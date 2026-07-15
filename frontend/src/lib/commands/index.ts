import { pluginCommands } from './plugins';
import { sqlCommands } from './sqlCli';
import { pkgCommands } from './pkgManager';
import { networkCommands } from './networkStack';
import { gameCommands } from './games';
import type { Command } from '../terminal';

export const phase4Commands: Command[] = [
  ...pluginCommands,
  ...sqlCommands,
  ...pkgCommands,
  ...networkCommands,
  ...gameCommands,
];
