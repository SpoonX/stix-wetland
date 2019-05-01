import { Cli } from 'stix';
import chalk from 'chalk';
import { MigratorCommand } from '../Library/Command/MigratorCommand';
import { SnapshotCommand } from '../Library/Command/SnapshotCommand';

export const cli = {
  commands: [
    Cli.program('orm', {
      commands: [
        Cli.command('orm:snapshot:create', SnapshotCommand, 'create', {
          description: 'Create a new snapshot (name defaults to git branch name).',
          options: {
            name: {
              alias: 'n',
              description: 'A name for the snapshot (defaults to git branch name).',
            },
          },
        }),
        Cli.command('orm:snapshot:remove', SnapshotCommand, 'remove', {
          description: 'Remove a snapshot (name defaults to git branch name).',
          options: {
            name: {
              alias: 'n',
              description: 'Name of the snapshot to remove (defaults to git branch name).',
            },
          },
        }),
        Cli.command('orm:migrator:create', MigratorCommand, 'create', {
          description: 'Create a new migration file (name defaults to git branch name).',
          options: {
            name: {
              alias: 'n',
              description: 'A name for the migration (defaults to git branch name).',
            },
            bare: {
              alias: 'b',
              description: 'Create a empty migration file without diffing against the current schema.',
            },
          },
        }),

        Cli.command('orm:migrator:schema', MigratorCommand, 'schema', {
          description: 'Create the database schema.',
          options: {
            run: {
              alias: 'r',
              description: 'Apply the queries instead of dumping the SQL to stdout.',
            },
          },
        }),

        Cli.command('orm:migrator:run', MigratorCommand, 'run', {
          description: chalk`Run one of the migrator methods. Make sure this is what you want before running.`,
          options: {
            up: { alias: 'u', description: 'Run the latest un-applied "up" migration.' },
            down: { alias: 'd', description: 'Run the latest "down" migration.' },
            latest: { alias: 'l', description: 'Run all not yet applied "up" migrations.' },
            revert: { alias: 'r', description: 'Undo the last run migration(s).' },
          },
        }),

        Cli.command('orm:migrator:dump', MigratorCommand, 'dump', {
          description: chalk`Dump the SQL queries to stdout for orm:migrator:run instead of executing them.`,
          options: {
            up: { alias: 'u', description: 'Dump the latest un-applied "up" migration queries.' },
            down: { alias: 'd', description: 'Dump the latest "down" migration queries.' },
            latest: { alias: 'l', description: 'Dump all not yet applied "up" migrations queries.' },
            revert: { alias: 'r', description: 'Dump the queries for reverting the last run migration(s).' },
          },
        }),

        Cli.command('orm:migrator:status', MigratorCommand, 'status', {
          description: 'Output the status of your migrations.',
        }),

        Cli.command('orm:migrator:forward', MigratorCommand, 'forward', {
          description: 'Update the dev snapshot without running the migrations.',
        }),

        Cli.command('orm:migrator:dev', MigratorCommand, 'dev', {
          description: 'Diff against current mapping and run or output dev migrations.',
          options: {
            run: {
              alias: 'r',
              description: 'Apply the queries instead of dumping the SQL to stdout.',
            },
          },
        }),

        Cli.command('orm:migrator:regress', MigratorCommand, 'regress', {
          description: 'Regress to the state of a snapshot. Useful when testing your migrations',
          options: {
            name: {
              alias: 'n',
              description: 'A name for the migration (defaults to git branch name).',
            },
            run: {
              alias: 'r',
              description: 'Apply the queries instead of dumping the SQL to stdout.',
            },
          },
        }),
      ],
    }),
  ],
};
