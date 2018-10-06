import { CommandManagerConfigType } from 'stix';
import path from 'path';

export const command: CommandManagerConfigType = {
  locations: [ path.resolve(__dirname, '..', 'Library', 'Command') ],
};
