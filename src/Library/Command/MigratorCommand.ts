import { AbstractCommand, inject, Output } from 'stix';
import chalk from 'chalk';
import toDatetime from 'to-datetime';
import { Migrator } from 'wetland';
import { WetlandService } from '../Service';

export class MigratorCommand extends AbstractCommand {
  @inject(WetlandService)
  private wetlandService: WetlandService;

  public async status (params: Object, output: Output) {
    const checkmark: string = process.platform === 'win32' ? '\u221A' : '✓';
    const cross: string = process.platform === 'win32' ? '\u00D7' : '✖';
    const migrator: Migrator = this.wetlandService.getInstance().getMigrator();
    const result = await Promise.all([ migrator.allMigrations(), migrator.appliedMigrations() ]);
    const runMap: { [name: string]: MigrationResultType } = {};

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
}

type MigrationResultType = { name: string; migration_time: Date; run: string; };
