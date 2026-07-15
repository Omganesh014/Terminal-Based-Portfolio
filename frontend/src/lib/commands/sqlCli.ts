import type { Command, CommandResult, ExecutionContext } from '../terminal';

const tables: Record<string, Record<string, string>[]> = {
  projects: [
    { id: '1', name: 'SpendDay', role: 'Full-stack Developer', stack: 'React 19, TypeScript, Express.js, Socket.IO', highlights: 'Real-time order tracking and role-based management', github: 'https://github.com/02fe24bcs078-dot/SpendDay' },
    { id: '2', name: 'Study Buddy', role: 'Full-stack Developer', stack: 'React.js, Node.js, Express.js, Google Gemini API', highlights: 'AI-powered study companion with Pomodoro timer', github: 'https://github.com/Omganesh014/Study-Buddy' },
    { id: '3', name: 'TruthBridge (JanaVaani)', role: 'Backend & ML Developer', stack: 'Next.js, Supabase, YOLO, Hugging Face', highlights: 'AI civic infrastructure monitoring platform', github: 'https://github.com/VAIBHAV7848/truthbridge' },
    { id: '4', name: 'Road Damage Detection', role: 'ML Developer', stack: 'YOLOv8, PyTorch, FastAPI', highlights: 'Deep-learning road defect detection system', github: 'https://github.com/Omganesh014/Road-Damage-Detection-Using-Deep-Learning' },
    { id: '5', name: 'OmOS Terminal Portfolio', role: 'Frontend Developer', stack: 'React 19, TypeScript, Vite, Zustand', highlights: 'Interactive OS-inspired developer portfolio', github: 'https://github.com/Omganesh014/Terminal-Based-Portfolio' },
    { id: '6', name: 'KLE CONNECT', role: 'Frontend Contributor', stack: 'React 18, TypeScript, Supabase, Agora RTC', highlights: 'College companion with AI tutoring and study rooms', github: 'https://github.com/VAIBHAV7848/KLE_CONNECT' },
    { id: '7', name: 'Digital Memory Capsule', role: 'Full-stack Developer', stack: 'React 18, Express.js, PostgreSQL, AWS S3', highlights: 'Secure time-locked memory preservation platform', github: 'https://github.com/Omganesh014/Digital-Memory-Capsule-' },
    { id: '8', name: 'WiDS 2026 Wildfire Prediction', role: 'ML Contributor', stack: 'Python, XGBoost, LightGBM, Scikit-learn', highlights: 'Wildfire risk prediction using ML algorithms', github: 'https://github.com/Omganesh014/WiDS2026-Wildfire-Prediction' },
  ],
  skills: [
    { id: '1', name: 'Java', category: 'Programming & Web' },
    { id: '2', name: 'C++', category: 'Programming & Web' },
    { id: '3', name: 'C', category: 'Programming & Web' },
    { id: '4', name: 'HTML5', category: 'Programming & Web' },
    { id: '5', name: 'React.js', category: 'Programming & Web' },
    { id: '6', name: 'Node.js', category: 'Programming & Web' },
    { id: '7', name: 'Express.js', category: 'Programming & Web' },
    { id: '8', name: 'TypeScript', category: 'Programming & Web' },
    { id: '9', name: 'Web Development', category: 'Programming & Web' },
    { id: '10', name: 'Full-Stack Development', category: 'Programming & Web' },
    { id: '11', name: 'SQL', category: 'Data & Fundamentals' },
    { id: '12', name: 'DBMS', category: 'Data & Fundamentals' },
    { id: '13', name: 'OOP', category: 'Data & Fundamentals' },
    { id: '14', name: 'Problem Solving', category: 'Data & Fundamentals' },
    { id: '15', name: 'Git', category: 'Tools & Collaboration' },
    { id: '16', name: 'GitHub', category: 'Tools & Collaboration' },
    { id: '17', name: 'Teamwork', category: 'Tools & Collaboration' },
    { id: '18', name: 'Leadership', category: 'Tools & Collaboration' },
    { id: '19', name: 'Communication', category: 'Tools & Collaboration' },
  ],
  experience: [
    { id: '1', role: 'Technical Team Core Member', organization: 'KLE CTIE', location: 'Belagavi, Karnataka, India', period: 'Dec 2025 – Present', type: 'Hybrid' },
  ],
  education: [
    { id: '1', degree: 'B.E. Computer Science', institution: 'KLE Technological University, Dr. M. S. Sheshgiri Campus', period: 'Sep 2024 – Sep 2028', details: 'Relevant: Java, C++, C, Web Development, DBMS, SQL, OOP' },
    { id: '2', degree: 'HSC (Science)', institution: 'KLE Independent PU College, Nipani', period: 'Jun 2022 – Jun 2024', details: 'Grade: 86.83%' },
    { id: '3', degree: 'SSC', institution: 'K. L. E. English Medium School', period: 'Jul 2021 – May 2022', details: 'Grade: 93.76%' },
  ],
  certificates: [
    { id: '1', name: 'IBM Full Stack Software Developer', platform: 'Coursera', status: 'In Progress' },
  ],
};

type Token = { type: 'select' | 'from' | 'where' | 'order' | 'limit' | 'like' | 'and' | 'or' | 'asc' | 'desc' | 'by' | 'comma' | 'star' | 'string' | 'ident' | 'number' | 'semicolon' | 'eof'; value: string };

function tokenize(sql: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < sql.length) {
    if (sql[i] === ' ' || sql[i] === '\t' || sql[i] === '\n') { i++; continue; }
    if (sql[i] === ';') { tokens.push({ type: 'semicolon', value: ';' }); i++; continue; }
    if (sql[i] === ',') { tokens.push({ type: 'comma', value: ',' }); i++; continue; }
    if (sql[i] === '*') { tokens.push({ type: 'star', value: '*' }); i++; continue; }
    if (sql[i] === "'") {
      let s = ''; i++;
      while (i < sql.length && sql[i] !== "'") { s += sql[i]; i++; }
      if (i < sql.length) i++;
      tokens.push({ type: 'string', value: s }); continue;
    }
    if (/\d/.test(sql[i])) {
      let n = ''; while (i < sql.length && /\d/.test(sql[i])) { n += sql[i]; i++; }
      tokens.push({ type: 'number', value: n }); continue;
    }
    if (/[a-zA-Z_]/.test(sql[i])) {
      let w = ''; while (i < sql.length && /[a-zA-Z0-9_]/.test(sql[i])) { w += sql[i]; i++; }
      const lower = w.toLowerCase();
      const typeMap: Record<string, Token['type']> = {
        select: 'select', from: 'from', where: 'where', order: 'order', limit: 'limit',
        like: 'like', and: 'and', or: 'or', asc: 'asc', desc: 'desc', by: 'by',
      };
      tokens.push({ type: typeMap[lower] || 'ident', value: w });
      continue;
    }
    return [{ type: 'eof', value: '' }];
  }
  tokens.push({ type: 'eof', value: '' });
  return tokens;
}

class ParseError extends Error {
  constructor(msg: string) { super(msg); this.name = 'ParseError'; }
}

type AST = {
  columns: string[];
  table: string;
  where?: { op: string; col: string; val: string }[];
  orderBy?: { col: string; dir: 'ASC' | 'DESC' };
  limit?: number;
};

function parse(tokens: Token[]): AST {
  let pos = 0;
  function peek(): Token { return tokens[pos] || { type: 'eof', value: '' }; }
  function consume(type?: Token['type']): Token {
    const t = peek();
    if (type && t.type !== type) throw new ParseError(`Expected ${type}, got ${t.type} ('${t.value}')`);
    pos++;
    return t;
  }

  if (peek().type !== 'select') throw new ParseError('Only SELECT queries are supported');
  consume('select');

  const columns: string[] = [];
  if (peek().type === 'star') { columns.push('*'); consume('star'); }
  else {
    columns.push(consume('ident').value);
    while (peek().type === 'comma') { consume('comma'); columns.push(consume('ident').value); }
  }

  if (peek().type !== 'from') throw new ParseError('Expected FROM');
  consume('from');

  const table = consume('ident').value.toLowerCase();
  if (!tables[table]) throw new ParseError(`Table '${table}' not found. Available: ${Object.keys(tables).join(', ')}`);

  let where: { op: string; col: string; val: string }[] | undefined;
  let orderBy: { col: string; dir: 'ASC' | 'DESC' } | undefined;
  let limit: number | undefined;

  while (peek().type !== 'eof' && peek().type !== 'semicolon') {
    if (peek().type === 'where') {
      consume('where');
      where = [];
      const col = consume('ident').value;
      let op: string;
      if (peek().type === 'like') { op = 'like'; consume('like'); }
      else { op = '='; }
      const val = consume().value;
      where.push({ op, col: col.toLowerCase(), val });

      while (peek().type === 'and' || peek().type === 'or') {
        const logic = peek().type === 'and' ? 'and' : 'or';
        consume();
        const c = consume('ident').value;
        let o: string;
        if (peek().type === 'like') { o = 'like'; consume('like'); }
        else { o = '='; }
        const v = consume().value;
        where.push({ op: o, col: c.toLowerCase(), val: v, ...(logic === 'or' ? { logic: 'or' as const } : {}) });
      }
    } else if (peek().type === 'order') {
      consume('order'); consume('by');
      const col = consume('ident').value.toLowerCase();
      const dir = peek().type === 'desc' ? (consume('desc'), 'DESC' as const) : 'ASC' as const;
      if (peek().type === 'asc') consume('asc');
      orderBy = { col, dir };
    } else if (peek().type === 'limit') {
      consume('limit');
      limit = parseInt(consume('number').value, 10);
    } else break;
  }

  return { columns, table, where, orderBy, limit };
}

function formatCell(val: string, width: number): string {
  if (val.length > width) return val.slice(0, width - 3) + '...';
  return val.padEnd(width);
}

function execute(ast: AST): string[] {
  const data = tables[ast.table];
  let rows = [...data];

  if (ast.where) {
    for (const cond of ast.where) {
      rows = rows.filter((row) => {
        const cell = (row[cond.col] || '').toLowerCase();
        const val = cond.val.toLowerCase();
        if (cond.op === 'like') return cell.includes(val);
        return cell === val;
      });
    }
  }

  const sortCol = ast.orderBy?.col;
  if (sortCol) {
    rows.sort((a, b) => {
      const av = (a[sortCol] || '').toLowerCase();
      const bv = (b[sortCol] || '').toLowerCase();
      return ast.orderBy!.dir === 'DESC' ? bv.localeCompare(av) : av.localeCompare(bv);
    });
  }

  if (ast.limit !== undefined) rows = rows.slice(0, ast.limit);

  const cols = ast.columns.length === 1 && ast.columns[0] === '*'
    ? Object.keys(data[0] || {}) : ast.columns;

  const widths = cols.map((c) => Math.max(c.length, ...rows.map((r) => (r[c] || '').length)));
  const sep = '+-' + widths.map((w) => '-'.repeat(w)).join('-+-') + '-+';
  const header = '| ' + cols.map((c, i) => formatCell(c, widths[i])).join(' | ') + ' |';

  const result = [sep, header, sep];
  for (const row of rows) {
    result.push('| ' + cols.map((c, i) => formatCell(row[c] || '', widths[i])).join(' | ') + ' |');
  }
  result.push(sep);
  result.push(`(${rows.length} row${rows.length !== 1 ? 's' : ''})`);
  return result;
}

export const sqlCommands: Command[] = [
  {
    name: 'sql', usage: 'sql <SELECT query>',
    description: 'Run SQL queries on portfolio data. Tables: projects, skills, experience, education, certificates.',
    run: (args): CommandResult => {
      if (!args.length) {
        return {
          lines: [
            'SQL CLI — query portfolio data with SELECT statements.',
            '',
            'Tables:',
            '  projects      — id, name, role, stack, highlights, github',
            '  skills        — id, name, category',
            '  experience    — id, role, organization, location, period, type',
            '  education     — id, degree, institution, period, details',
            '  certificates  — id, name, platform, status',
            '',
            'Examples:',
            '  sql SELECT * FROM projects',
            '  sql SELECT name, role FROM projects WHERE role LIKE \'Full-stack\'',
            '  sql SELECT name FROM skills WHERE category = \'Programming & Web\' ORDER BY name',
            '  sql SELECT * FROM projects LIMIT 3',
          ],
        };
      }

      const query = args.join(' ');
      try {
        const tokens = tokenize(query);
        const ast = parse(tokens);
        return { lines: execute(ast) };
      } catch (err) {
        if (err instanceof ParseError) return { lines: [`SQL Error: ${err.message}`] };
        return { lines: ['SQL Error: Invalid query'] };
      }
    },
  },
];
