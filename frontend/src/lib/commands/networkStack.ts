import type { Command, CommandResult, ExecutionContext } from '../terminal';

function simulateLatency(): number {
  return Math.floor(Math.random() * 40 + 10);
}

export const networkCommands: Command[] = [
  {
    name: 'ping', usage: 'ping <host>',
    description: 'Send ICMP echo requests to a host.',
    run: (args): CommandResult => {
      const host = args[0];
      if (!host) return { lines: ['Usage: ping <host>'] };
      const ip = `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 255) + 1}`;
      const lines: string[] = [`PING ${host} (${ip}): 56 data bytes`];
      for (let i = 0; i < 4; i++) {
        const ms = simulateLatency();
        const ttl = Math.floor(Math.random() * 20 + 50);
        lines.push(`  64 bytes from ${ip}: icmp_seq=${i + 1} ttl=${ttl} time=${ms}.${Math.floor(Math.random() * 900) + 100}ms`);
      }
      const avg = simulateLatency();
      lines.push('', `--- ${host} ping statistics ---`, `  4 packets transmitted, 4 received, 0% packet loss`, `  round-trip min/avg/max/stddev = ${avg - 5}/${avg}/${avg + 5}/${Math.floor(Math.random() * 3) + 1}ms`);
      return { lines };
    },
  },
  {
    name: 'curl', usage: 'curl <url>',
    description: 'Fetch a resource over HTTP.',
    run: (args): CommandResult => {
      const url = args[0];
      if (!url) return { lines: ['Usage: curl <url>'] };

      const pages: Record<string, string[]> = {
        'https://omganesh.dev': [
          '<!DOCTYPE html>',
          '<html><head><title>OmGanesh R Matiwade</title></head>',
          '<body>',
          '  <h1>OmGanesh R Matiwade</h1>',
          '  <p>Computer Science undergraduate | Full-stack Developer</p>',
          '  <p>KLE Technological University, Belagavi</p>',
          '  <p>Building real-time web apps, AI tools, and ML systems.</p>',
          '</body></html>',
        ],
        'https://github.com/Omganesh014': [
          'GitHub Profile: Omganesh014',
          '',
          '  Repositories (9):',
          '    SpendDay — Full-stack food ordering platform',
          '    Study-Buddy — AI-powered study companion',
          '    TruthBridge — AI civic infrastructure monitor',
          '    Road-Damage-Detection — YOLO-based defect detection',
          '    Terminal-Based-Portfolio — OS-inspired developer portfolio',
          '    KLE-CONNECT — College companion platform',
          '    Digital-Memory-Capsule — Time-locked message platform',
          '    DAA-FINAL-LAB — C++ algorithms lab revision',
          '    WiDS2026-Wildfire-Prediction — ML wildfire risk prediction',
        ],
        'https://linkedin.com/in/omganesh-r-matiwade': [
          'LinkedIn: OmGanesh R Matiwade',
          '',
          '  Technical Team Core Member @ KLE CTIE',
          '  Computer Science @ KLE Technological University',
          '  Belagavi, Karnataka, India',
        ],
      };

      const normalized = url.replace(/\/+$/, '');
      const content = pages[normalized] || pages[normalized + '/'] || [
        `HTTP/1.1 200 OK`,
        `Content-Type: text/html`,
        `Server: OM-nginx/1.0`,
        '',
        `<html><body><h1>${url}</h1><p>Portfolio resource loaded.</p></body></html>`,
      ];

      return { lines: [
        `HTTP/1.1 200 OK`,
        `Content-Type: text/html`,
        `Content-Length: ${content.join('\n').length}`,
        `Server: OM-nginx/1.0`,
        `Connection: close`,
        '',
        ...content,
      ] };
    },
  },
  {
    name: 'netstat', usage: 'netstat [-a]',
    description: 'Display network connections and listening ports.',
    run: (args): CommandResult => {
      const all = args.includes('-a');
      const lines = [
        'Active Internet connections',
        'Proto  Recv-Q  Send-Q  Local Address          Foreign Address        State',
        ...(all ? [
          'tcp    0       0       0.0.0.0:22             0.0.0.0:*              LISTEN',
          'tcp    0       0       0.0.0.0:80             0.0.0.0:*              LISTEN',
          'tcp    0       0       0.0.0.0:443            0.0.0.0:*              LISTEN',
          'tcp    0       0       127.0.0.1:3001         0.0.0.0:*              LISTEN',
        ] : []),
        'tcp    0       0       10.0.0.2:45234          140.82.121.4:443       ESTABLISHED',
        'tcp    0       0       10.0.0.2:45236          140.82.121.5:443       ESTABLISHED',
        'tcp    0       0       10.0.0.2:45238          185.199.108.153:443    ESTABLISHED',
        'tcp    0       0       10.0.0.2:45240          185.199.109.153:443    ESTABLISHED',
        'tcp    0       0       10.0.0.2:45242          185.199.110.153:443    ESTABLISHED',
        'tcp    0       1       10.0.0.2:45244          142.250.80.46:443      CLOSE_WAIT',
        '',
        'Active UNIX domain sockets',
        'Path                                      Type    State      I-node',
        '/var/run/docker.sock                      stream  LISTEN     12345',
        '/run/user/1000/bus                        stream  CONNECTED  12346',
      ];
      return { lines };
    },
  },
  {
    name: 'traceroute', usage: 'traceroute <host>',
    description: 'Trace the route to a network host.',
    run: (args): CommandResult => {
      const host = args[0];
      if (!host) return { lines: ['Usage: traceroute <host>'] };
      const hops = [
        { n: 1, ip: '10.0.0.1', host: 'router.local', ms: 2 },
        { n: 2, ip: '172.16.1.1', host: 'isp-gateway.belagavi.net', ms: 8 },
        { n: 3, ip: '203.123.45.1', host: 'blr-core-01.in.tata', ms: 14 },
        { n: 4, ip: '203.123.45.50', host: 'blr-edge-02.in.tata', ms: 16 },
        { n: 5, ip: '72.14.237.1', host: '72.14.237.1', ms: 32 },
        { n: 6, ip: '216.58.196.1', host: 'mum01s12-in-f1.1e100.net', ms: 38 },
        { n: 7, ip: '142.250.80.46', host: '142.250.80.46', ms: 42 },
      ];
      const lines = [`traceroute to ${host}, 64 hops max`];
      for (const hop of hops) {
        const ms = hop.ms + Math.floor(Math.random() * 5);
        lines.push(`  ${String(hop.n).padStart(2)}  ${hop.host.padEnd(30)} (${hop.ip})  ${ms}.${Math.floor(Math.random() * 900) + 100}ms`);
      }
      lines.push(`  ${hops.length + 1}  ${host}  ${host}  ${simulateLatency()}.${Math.floor(Math.random() * 900) + 100}ms`);
      return { lines };
    },
  },
  {
    name: 'ifconfig', usage: 'ifconfig',
    description: 'Display network interface configuration.',
    run: (): CommandResult => ({
      lines: [
        'lo: flags=8049<UP,LOOPBACK,RUNNING,MULTICAST> mtu 65536',
        '    inet 127.0.0.1 netmask 255.0.0.0',
        '    inet6 ::1 prefixlen 128',
        '',
        'eth0: flags=8863<UP,BROADCAST,RUNNING,SIMPLEX,MULTICAST> mtu 1500',
        '    inet 10.0.0.2 netmask 255.255.255.0 broadcast 10.0.0.255',
        '    inet6 fe80::1234:5678:9abc:def0 prefixlen 64',
        '    ether 00:1a:2b:3c:4d:5e',
        '    media: autoselect (1000baseT <full-duplex>)',
        '    status: active',
        '',
        'wlan0: flags=8863<UP,BROADCAST,RUNNING,SIMPLEX,MULTICAST> mtu 1500',
        '    inet 192.168.1.101 netmask 255.255.255.0 broadcast 192.168.1.255',
        '    inet6 fe80::aabb:ccdd:eeff:0011 prefixlen 64',
        '    ether aa:bb:cc:dd:ee:ff',
        '    media: autoselect (802.11ac)',
        '    status: associated',
      ],
    }),
  },
  {
    name: 'nslookup', usage: 'nslookup <host>',
    description: 'Query DNS for host information.',
    run: (args): CommandResult => {
      const host = args[0];
      if (!host) return { lines: ['Usage: nslookup <host>'] };
      const records: Record<string, string[]> = {
        'omganesh.dev': ['Name:    omganesh.dev', 'Address: 185.199.108.153', 'Address: 185.199.109.153', 'Address: 185.199.110.153', 'Address: 185.199.111.153'],
        'github.com': ['Name:    github.com', 'Address: 140.82.121.3', 'Address: 140.82.121.4', 'Address: 140.82.121.5'],
        'google.com': ['Name:    google.com', 'Address: 142.250.80.46'],
      };
      const result = records[host] || ['Non-authoritative answer:', `Name: ${host}`, `Address: ${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 255) + 1}`];
      return { lines: ['Server:   8.8.8.8', 'Address:  8.8.8.8#53', '', ...result] };
    },
  },
];
