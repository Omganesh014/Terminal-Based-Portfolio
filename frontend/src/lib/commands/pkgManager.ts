import type { Command, CommandResult, ExecutionContext } from '../terminal';

type Pkg = {
  name: string;
  version: string;
  description: string;
  size: string;
  depends: string[];
};

const registry: Pkg[] = [
  { name: 'profile', version: '1.2.0', description: 'Personal profile card with GitHub stats', size: '12K', depends: [] },
  { name: 'projects', version: '2.1.0', description: 'Full project catalog with details', size: '48K', depends: [] },
  { name: 'skills', version: '1.0.0', description: 'Skills matrix and proficiency levels', size: '8K', depends: [] },
  { name: 'experience', version: '1.1.0', description: 'Work experience timeline', size: '16K', depends: [] },
  { name: 'education', version: '1.0.0', description: 'Education history and grades', size: '12K', depends: [] },
  { name: 'certificates', version: '1.0.0', description: 'Certificate listing and status', size: '4K', depends: [] },
  { name: 'contact', version: '1.0.0', description: 'Contact information and form', size: '2K', depends: [] },
  { name: 'games-pack', version: '1.0.0', description: 'Snake, tic-tac-toe, and matrix rain', size: '64K', depends: ['terminal-features'] },
  { name: 'sql-cli', version: '1.0.0', description: 'SQL query interface for portfolio data', size: '32K', depends: [] },
  { name: 'network-tools', version: '1.0.0', description: 'Ping, curl, netstat, and traceroute', size: '24K', depends: [] },
  { name: 'terminal-features', version: '1.0.0', description: 'Core terminal utilities and enhancements', size: '8K', depends: [] },
];

const installed = new Set(['profile', 'projects', 'skills', 'experience', 'education', 'certificates', 'contact', 'terminal-features']);

export const pkgCommands: Command[] = [
  {
    name: 'om-pkg', usage: 'om-pkg <subcommand> [args]',
    description: 'Portfolio package manager. Subcommands: list, install, remove, info, search, update, upgrade.',
    run: (args): CommandResult => {
      const [sub, ...rest] = args;
      if (!sub) {
        return { lines: [
          'Usage: om-pkg <subcommand>',
          '',
          'Subcommands:',
          '  list                  List installed packages',
          '  install <pkg>        Install a package',
          '  remove <pkg>         Remove a package',
          '  info <pkg>           Show package information',
          '  search <term>        Search the registry',
          '  update               Update package registry',
          '  upgrade              Upgrade all installed packages',
        ] };
      }

      if (sub === 'list') {
        const all = Array.from(installed).map((n) => registry.find((p) => p.name === n)).filter(Boolean) as Pkg[];
        if (!all.length) return { lines: ['(no packages installed)'] };
        const totalSize = all.reduce((s, p) => s + parseInt(p.size), 0);
        return { lines: [
          ...all.map((p) => `  ${p.name.padEnd(20)} ${p.version.padEnd(8)} ${p.size.padEnd(6)} ${p.description}`),
          '',
          `${all.length} packages installed, ${totalSize}K total`,
        ] };
      }

      if (sub === 'install') {
        const name = rest[0];
        if (!name) return { lines: ['om-pkg: install requires a package name'] };
        if (installed.has(name)) return { lines: [`om-pkg: ${name} is already installed`] };
        const pkg = registry.find((p) => p.name === name);
        if (!pkg) return { lines: [`om-pkg: package '${name}' not found`, 'Run "om-pkg search <term>" or "om-pkg list --all" to find packages.'] };

        for (const dep of pkg.depends) {
          if (!installed.has(dep)) {
            return { lines: [`om-pkg: missing dependency: ${dep}`, `  Run "om-pkg install ${dep}" first.`] };
          }
        }

        installed.add(name);
        return { lines: [`Installing ${name}...`, `✓ ${name} ${pkg.version} installed (${pkg.size})`] };
      }

      if (sub === 'remove') {
        const name = rest[0];
        if (!name) return { lines: ['om-pkg: remove requires a package name'] };
        if (!installed.has(name)) return { lines: [`om-pkg: ${name} is not installed`] };

        const dependents = registry.filter((p) => p.depends.includes(name) && installed.has(p.name));
        if (dependents.length) {
          return { lines: [`om-pkg: cannot remove ${name} — required by: ${dependents.map((p) => p.name).join(', ')}`, '  Remove those packages first.'] };
        }

        installed.delete(name);
        return { lines: [`Removing ${name}...`, `✓ ${name} removed`] };
      }

      if (sub === 'info') {
        const name = rest[0];
        if (!name) return { lines: ['om-pkg: info requires a package name'] };
        const pkg = registry.find((p) => p.name === name) || { name, version: '?', description: '?', size: '?', depends: [] };
        return { lines: [
          `Package: ${pkg.name}`,
          `  Version:   ${pkg.version}`,
          `  Size:      ${pkg.size}`,
          `  Status:    ${installed.has(name) ? 'installed' : 'not installed'}`,
          `  Depends:   ${pkg.depends.length ? pkg.depends.join(', ') : '(none)'}`,
          '',
          `  ${pkg.description}`,
        ] };
      }

      if (sub === 'search') {
        const term = rest.join(' ').toLowerCase();
        if (!term) return { lines: ['om-pkg: search requires a term'] };
        const matches = registry.filter((p) => p.name.includes(term) || p.description.toLowerCase().includes(term));
        if (!matches.length) return { lines: [`No packages matching '${term}'`] };
        return { lines: [
          `Search results for '${term}':`,
          ...matches.map((p) => `  ${p.name.padEnd(20)} ${installed.has(p.name) ? '[installed]' : '[available]'.padStart(11)}  ${p.description}`),
        ] };
      }

      if (sub === 'update') {
        return { lines: ['Updating registry...', '✓ Registry is up to date'] };
      }

      if (sub === 'upgrade') {
        const upgradable = Array.from(installed).filter((n) => registry.find((p) => p.name === n));
        if (!upgradable.length) return { lines: ['(no packages installed)'] };
        return { lines: [`Upgrading ${upgradable.length} packages...`, ...upgradable.map((n) => `  ✓ ${n} up to date`), 'All packages are up to date.'] };
      }

      if (sub === 'list' && rest[0] === '--all') {
        return { lines: ['All packages:', ...registry.map((p) => `  ${p.name.padEnd(20)} ${p.version.padEnd(8)} ${p.size.padEnd(6)} ${installed.has(p.name) ? '[installed]' : '[available]'}  ${p.description}`)] };
      }

      return { lines: [`om-pkg: unknown subcommand '${sub}'`] };
    },
  },
];
