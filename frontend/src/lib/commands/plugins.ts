import type { Command, CommandResult, ExecutionContext } from '../terminal';

type Plugin = {
  name: string;
  version: string;
  description: string;
  author: string;
};

const installed = new Map<string, Plugin>();

export const pluginCommands: Command[] = [
  {
    name: 'plugin', usage: 'plugin list | install <name> | remove <name> | info <name>',
    description: 'Manage terminal plugins.',
    run: (args, context): CommandResult => {
      const [sub, ...rest] = args;
      if (!sub) return { lines: ['Usage: plugin list | install <name> | remove <name> | info <name>'] };

      if (sub === 'list') {
        const all = Array.from(installed.values());
        if (!all.length) return { lines: ['No plugins installed.'] };
        return { lines: ['Installed plugins:', ...all.map((p) => `  ${p.name}@${p.version} — ${p.description}`)] };
      }

      if (sub === 'info') {
        const name = rest.join(' ');
        const p = installed.get(name);
        if (!p) return { lines: [`plugin: ${name} is not installed`] };
        return { lines: [`${p.name}@${p.version}`, `  Description: ${p.description}`, `  Author: ${p.author}`] };
      }

      if (sub === 'install') {
        const name = rest.join(' ');
        if (!name) return { lines: ['plugin: install requires a name'] };
        if (installed.has(name)) return { lines: [`plugin: ${name} is already installed`] };
        const available = availablePlugins.find((p) => p.name === name);
        if (!available) return { lines: [`plugin: ${name} is not a known plugin`, 'Run "plugin available" to see what can be installed.'] };
        installed.set(name, available);
        return { lines: [`Installing ${name}...`, `✓ ${name}@${available.version} installed`] };
      }

      if (sub === 'remove') {
        const name = rest.join(' ');
        if (!name) return { lines: ['plugin: remove requires a name'] };
        if (!installed.has(name)) return { lines: [`plugin: ${name} is not installed`] };
        installed.delete(name);
        return { lines: [`✓ ${name} removed`] };
      }

      if (sub === 'available') {
        return { lines: ['Available plugins:', ...availablePlugins.map((p) => `  ${p.name}@${p.version} — ${p.description}`)] };
      }

      return { lines: [`plugin: unknown subcommand '${sub}'`] };
    },
  },
];

const availablePlugins: Plugin[] = [
  { name: 'sql-cli', version: '1.0.0', description: 'Run SQL queries against portfolio data', author: 'OM' },
  { name: 'om-pkg', version: '1.0.0', description: 'Package manager for portfolio features', author: 'OM' },
  { name: 'network-tools', version: '1.0.0', description: 'Ping, curl, netstat, and traceroute simulations', author: 'OM' },
  { name: 'games', version: '1.0.0', description: 'Snake, tic-tac-toe, and matrix rain', author: 'OM' },
];
