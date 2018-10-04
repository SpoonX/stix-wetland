import { Cli } from 'stix';
import { MigratorCommand } from '../Library/Command/MigratorCommand';

export const cli = {
  commands: [
    Cli.program('orm', {
      commands: [
        Cli.command('orm:migrator:status', MigratorCommand, 'status', {
          description: 'Output the status of your migrations.',
        }),
      ],
    }),
  ],
};
