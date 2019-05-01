import { AbstractCommand, inject, Output } from 'stix';
import chalk from 'chalk';
import toDatetime from 'to-datetime';
import { Migrator } from 'wetland';
import { WetlandService } from '../Service';
import { getName } from '../../utils';

export class MigratorCommand extends AbstractCommand {
  @inject(WetlandService)
  private wetlandService: WetlandService;

  private migrator: Migrator;

  public async create (output: Output, { name, bare }: { name?: string, bare?: boolean }) {
    const migrationName = await getName(name);
    const wetland = this.wetlandService.getInstance();
    const schema = wetland.getSchemaManager();
    const code: { up: string, down: string } = { up: null, down: null };

    if (!bare) {
      const previous = await wetland.getSnapshotManager().fetch(migrationName, false);

      const migrations = await Promise.all([
        schema.getCode(previous || {}),
        schema.getCode(previous || {}, true),
      ]);

      code.up = migrations[0];
      code.down = migrations[1];
    }

    const migrationFileName = await wetland.getMigrator().create(migrationName, code);

    return output.success(`Migration file '${migrationFileName}' created`);
  }

  public async forward (output: Output) {
    await this.wetlandService.getInstance().getSnapshotManager().create();

    output.success('Dev snapshot created');
  }

  public async dev (output: Output, { run }: { run: boolean }) {
    const wetland = this.wetlandService.getInstance();
    const schema = wetland.getSchemaManager();
    const snapshot = wetland.getSnapshotManager();
    const previous = await snapshot.fetch();

    if (!run) {
      output.addData('\n', '-- Queries for dev migrations:');
      output.addData((schema.getSQL(previous || {}) || '-- Nothing to do.'), '\n');
    } else {
      await schema.apply(previous || {});
      await snapshot.create();

      output.success('Dev migrations applied');
    }
  }

  public async status (output: Output) {
    const checkmark: string = process.platform === 'win32' ? '\u221A' : '✓';
    const cross: string = process.platform === 'win32' ? '\u00D7' : '✖';
    const migrator: Migrator = this.getMigrator();
    const runMap: { [name: string]: MigrationResultType } = {};
    const result = await Promise.all([
      migrator.allMigrations(),
      migrator.appliedMigrations(),
    ]);

    result[1].forEach((migration: MigrationResultType) => runMap[migration.name] = migration);

    const migrations: Array<Array<string>> = result[0].map(migration => {
      const applied = runMap[migration];

      return [
        migration,
        applied ? toDatetime(applied.migration_time) : 'N/A',
        applied ? applied.run : 'N/A',
        applied ? `${chalk.green(checkmark)} Applied` : `${chalk.red(cross)} Not applied`,
      ];
    });

    output.addHorizontalTable([
      chalk.green.bold('Migration'),
      chalk.green.bold('Run at'),
      chalk.green.bold('Run ID'),
      chalk.green.bold('Status'),
    ], migrations);
  }

  public async dump (output: Output, params: { [action: string]: boolean }) {
    return await this.run(output, params, false);
  }

  public async run (output: Output, { up, down, latest, revert }: { [action: string]: boolean }, run: boolean = true) {
    const migrator = this.getMigrator();

    switch (true) {
      case up:
        return await this.runMigration((action: string) => migrator.up(action), run, output);
      case down:
        return await this.runMigration((action: string) => migrator.down(action), run, output);
      case latest:
        return await this.runMigration((action: string) => migrator.latest(action), run, output);
      case revert:
        return await this.runMigration((action: string) => migrator.revert(action), run, output);
    }

    return output.error('Unable to run migration. You need to specify one of: up, down, latest or revert.');
  }

  private async runMigration (method: (action: string) => any, run: boolean, output: Output) {
    const result = await method(run ? Migrator.ACTION_RUN : Migrator.ACTION_GET_SQL);

    if (!result) {
      if (run) {
        output.addData('-- No queries found');
      } else {
        output.success('No migrations to run');
      }
    } else if (run) {
      output.addData(chalk.green.bold(`'${parseInt(result, 10)}' migrations executed`));
    } else {
      output.addData('-- Queries for next migration');
      output.addData(result);
    }
  }

  public async regress (output: Output, { name, run }: { name: string, run: boolean }) {
    const migrationName = await getName(name);
    const wetland = this.wetlandService.getInstance();
    const schema = wetland.getSchemaManager();
    const snapshot = wetland.getSnapshotManager();

    const migration = await snapshot.fetch(migrationName, false);

    if (run) {
      await schema.apply(migration, true);
      await snapshot.create();

      return output.success(`Successfully reverted to '${migrationName}'`);
    }

    const sql = await schema.getSQL(migration, true);

    output.addData('\n-- Queries for revert', sql + '\n');
  }

  public async schema (output: Output, { run }: { run: boolean }) {
    const wetland = this.wetlandService.getInstance();
    const schema = wetland.getSchemaManager();

    if (run) {
      await schema.create();

      return output.success('Schema created successfully');
    }

    output.addData('\n-- Queries for schema');
    output.addData(schema.getSQL() + '\n');
  }

  private getMigrator (): Migrator {
    if (!this.migrator) {
      this.migrator = this.wetlandService.getInstance().getMigrator();
    }

    return this.migrator;
  }
}

type MigrationResultType = { name: string; migration_time: Date; run: string; };
