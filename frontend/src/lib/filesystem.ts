export type VirtualFileSystem = {
  directories: Record<string, string[]>;
  files: Record<string, string[]>;
};

export const defaultFileSystem: VirtualFileSystem = {
  directories: {
    '/': ['home', 'projects', 'experience', 'education', 'skills', 'certificates', 'achievements', 'contact', '.om'],
    '/home': ['omganesh'],
    '/home/omganesh': ['Projects', 'Experience', 'Education', 'Skills', 'Certificates', 'Achievements', 'Contact', '.config', 'README.md', 'resume.md', 'skills.md'],
    '/home/omganesh/Projects': ['spendday.md', 'study-buddy.md', 'truthbridge-janavaani.md', 'road-damage-detection.md', 'daa-final-lab.md', 'omos-terminal-portfolio.md', 'kle-connect.md', 'wids-2026-wildfire-prediction.md', 'digital-memory-capsule.md'],
    '/home/omganesh/Experience': ['profile.md'],
    '/home/omganesh/Education': ['education.md'],
    '/home/omganesh/Skills': ['skills.md'],
    '/home/omganesh/Certificates': ['certificates.md'],
    '/home/omganesh/Achievements': ['achievements.md'],
    '/home/omganesh/Contact': ['contact.md'],
    '/home/omganesh/.config': ['shellrc'],
    '/projects': ['spendday.md', 'study-buddy.md', 'truthbridge-janavaani.md', 'road-damage-detection.md', 'daa-final-lab.md', 'omos-terminal-portfolio.md', 'kle-connect.md', 'wids-2026-wildfire-prediction.md', 'digital-memory-capsule.md'],
    '/experience': ['profile.md'],
    '/education': ['education.md'],
    '/skills': ['skills.md'],
    '/certificates': ['certificates.md'],
    '/achievements': ['achievements.md'],
    '/contact': ['contact.md'],
    '/.om': ['manifest.json'],
  },
  files: {
    '/home/omganesh/README.md': ['# Welcome to OM', 'Explore this portfolio with ls, cat, tree, and help.'],
    '/home/omganesh/resume.md': [
      '# OmGanesh R Matiwade',
      'Belagavi, Karnataka, India',
      'Email: omganeshmatiwade007@gmail.com · GitHub: https://github.com/Omganesh014 · LinkedIn: https://www.linkedin.com/in/omganesh-r-matiwade-',
      '',
      '## Summary',
      'Computer Science undergraduate with full-stack development experience building real-time web applications, AI-powered tools, and ML-based systems. Passionate about creating impactful digital solutions.',
      '',
      '## Education',
      '**B.E. Computer Science** — KLE Technological University, Dr. M. S. Sheshgiri Campus · Sep 2024 – Sep 2028',
      'Relevant coursework: Java, C++, C, Web Development, DBMS, SQL, OOP',
      '',
      '**HSC (Science)** — KLE Independent PU College, Nipani · Jun 2022 – Jun 2024 · Grade: 86.83%',
      '',
      '## Experience',
      '**Technical Team Core Member** — KLE CTIE · Dec 2025 – Present',
      '• Organize technical events and workshops.',
      '• Support students with technical initiatives and project development.',
      '• Foster a collaborative learning environment.',
      '',
      '## Skills',
      '**Languages**: Java · C++ · C · TypeScript · JavaScript · SQL · Python',
      '**Frontend**: React.js · Next.js · HTML5 · CSS3 · Tailwind CSS · Zustand · Vite',
      '**Backend**: Node.js · Express.js · FastAPI · Supabase · Socket.IO',
      '**ML/AI**: YOLOv8 · Scikit-learn · XGBoost · Hugging Face · Google Gemini API',
      '**Tools**: Git · GitHub · AWS S3 · PostgreSQL · Docker · JWT · OOP',
      '',
      '## Projects',
      '**SpendDay** — Full-stack food ordering platform with real-time tracking, role-based dashboards, and Socket.IO.',
      '**Study Buddy** — AI-powered study companion with Gemini API, Pomodoro timer, and gamified streaks.',
      '**TruthBridge (JanaVaani)** — AI civic infrastructure monitor with YOLO damage detection and role-based portals.',
      '**OmOS Terminal Portfolio** — Interactive OS-inspired developer portfolio built with React, TypeScript, and Vite.',
      '**KLE CONNECT** — College companion platform with AI tutoring, real-time chat, and study rooms.',
      '**Digital Memory Capsule** — Secure time-locked message/video platform with AES-256-GCM encryption.',
      '',
      '## Certificates',
      'IBM Full Stack Software Developer Professional Certificate · Coursera (In Progress)',
    ],
    '/home/omganesh/skills.md': [
      '# Skills',
      '',
      '## Programming & Web',
      'Java · C++ · C · HTML5 · React.js · Node.js · Express.js · TypeScript · Web Development · Full-Stack Development',
      '',
      '## Data & Fundamentals',
      'SQL · Database Management Systems (DBMS) · Object-Oriented Programming (OOP) · Problem Solving',
      '',
      '## Tools & Collaboration',
      'Git · GitHub · Teamwork · Leadership · Communication · Student Development',
    ],
    '/home/omganesh/Projects/spendday.md': [
      '# SpendDay',
      'Full-stack online food ordering platform with real-time order tracking and role-based management.',
      '',
      'ROLE',
      'Full-stack Developer (Frontend & Backend)',
      '',
      'STACK',
      'React 19 · TypeScript · Vite · Tailwind CSS · Axios · Express.js · Node.js · Socket.IO · JWT · bcryptjs · JSON',
      '',
      'HIGHLIGHTS',
      '• Secure authentication for customers, restaurants, and administrators',
      '• Restaurant/menu discovery with search and filters',
      '• Cart, favorites, coupons, checkout, simulated payments, and email notifications',
      '• Live order synchronization and tracking with Socket.IO',
      '• Role-based dashboards for restaurant, menu, order, user, and kitchen management',
      '• Order history, reviews, cancellation, reordering, and operational analytics',
      '',
      'RESULT',
      'Capstone Web Technology project delivering a scalable end-to-end ordering workflow with role-based access control and real-time updates.',
      '',
      'GITHUB',
      'https://github.com/02fe24bcs078-dot/SpendDay',
      'DEMO VIDEO',
      'https://drive.google.com/file/d/1cggxVspMXDwSguXKMQISXu4Uv-jxLZQq/view',
    ],
    '/home/omganesh/Projects/study-buddy.md': [
      '# Study Buddy', 'AI-powered study companion for focused learning, material summarization, and productive habits.', '',
      'ROLE', 'Full-stack Developer', '',
      'STACK', 'React.js · JavaScript · Node.js · Express.js · Google Gemini API · Supabase · HTML5 · CSS3', '',
      'HIGHLIGHTS', '• AI-powered study material summarization', '• Pomodoro timer and study session tracking', '• Gamified streaks, rewards, milestones, and productivity insights', '• Responsive, student-friendly interface', '',
      'RESULT', 'Built an AI learning assistant that combines generative AI and productivity tools to improve focus, efficiency, and study consistency.', '',
      'GITHUB', 'https://github.com/Omganesh014/Study-Buddy',
    ],
    '/home/omganesh/Projects/truthbridge-janavaani.md': [
      '# TruthBridge (JanaVaani)', 'AI-powered civic infrastructure monitoring platform for road and bridge damage reporting and resolution.', '',
      'ROLE', 'Developed backend APIs and trained the road and bridge damage detection model; integrated AI predictions into the workflow.', '',
      'STACK', 'Next.js 16 · React 19 · TypeScript · Tailwind CSS · Supabase · Hugging Face Inference API · CLIP ViT · Python · YOLO · OpenCV · Leaflet · Recharts · Zod', '',
      'HIGHLIGHTS', '• AI damage detection, image classification, and authenticity verification', '• Citizen, authority, and engineer portals with role-based access', '• Geolocation maps, risk scoring, issue prioritization, and real-time analytics', '• End-to-end complaint tracking with Supabase RLS', '',
      'RESULT', 'Code Odyssey Hackathon 2026 contribution enabling automated damage assessment and intelligent issue management.', '',
      'GITHUB', 'https://github.com/VAIBHAV7848/truthbridge',
    ],
    '/home/omganesh/Projects/road-damage-detection.md': [
      '# TruthBridge - Road Damage Detection System', 'Deep-learning system for real-time detection, localization, and classification of road and bridge surface defects.', '',
      'ROLE', 'Trained the damage-detection ML model and developed the backend.', '',
      'STACK', 'YOLOv8 · Ultralytics · PyTorch · FastAPI · SQLite · imagehash · httpx', '',
      'HIGHLIGHTS', '• Crack and pothole detection with bounding boxes and confidence scores', '• Critical, moderate, and minor severity estimation', '• Risk scoring using environmental and location factors', '• Perceptual-hash duplicate detection, REST APIs, and critical-damage webhooks', '',
      'RESULT', 'Built a real-time infrastructure assessment pipeline combining inference, duplicate detection, risk scoring, and backend API integration.', '',
      'GITHUB', 'https://github.com/Omganesh014/Road-Damage-Detection-Using-Deep-Learning',
    ],
    '/home/omganesh/Projects/daa-final-lab.md': [
      '# DAA-FINAL-LAB', 'Exam-oriented collection of readable C++ implementations for Algorithms Lab ESA preparation.', '',
      'ROLE', 'Developer and algorithm implementation author', '',
      'STACK', 'C++', '',
      'HIGHLIGHTS', '• String search, DFS, BFS, and core sorting algorithms', '• Floyd, Dijkstra, Kruskal, and Prim algorithms', '• Binary Search Tree operations', '• Compact, small-input, viva-friendly code', '',
      'RESULT', 'Created a clear, easy-to-revise repository covering the key Algorithms Lab and ESA problems.', '',
      'GITHUB', 'https://github.com/Omganesh014/DAA-FINAL-LAB',
    ],
    '/home/omganesh/Projects/omos-terminal-portfolio.md': [
      '# OmOS - Terminal-Based Portfolio', 'Interactive terminal-style portfolio presented through a simulated operating system experience.', '',
      'ROLE', 'Frontend developer and project creator', '',
      'STACK', 'React 19 · TypeScript · Vite · Zustand · xterm.js · Tailwind CSS · ESLint · Prettier', '',
      'HIGHLIGHTS', '• Animated boot, login gate, restart flow, and keyboard-accessible desktop', '• Functional xterm.js terminal with command history and filesystem navigation', '• In-browser profile, resume, projects, skills, and terminal applications', '',
      'RESULT', 'Turned a conventional portfolio into an immersive, memorable system for exploring work and skills.', '',
      'GITHUB', 'https://github.com/Omganesh014/Terminal-Based-Portfolio',
    ],
    '/home/omganesh/Projects/kle-connect.md': [
      '# KLE CONNECT', 'College companion platform combining communication, AI tutoring, study planning, and campus support.', '',
      'ROLE', 'Contributed to frontend development and provided technical guidance on feature design and implementation.', '',
      'STACK', 'React 18 · TypeScript · Tailwind CSS · Shadcn UI · Framer Motion · Supabase · Agora RTC · Google Analytics Engine', '',
      'HIGHLIGHTS', '• Supabase authentication, real-time community chat, and collaborative notes', '• AI academic tutor and personal study planner', '• Voice/video virtual study rooms and campus navigation', '• Admin dashboard for users and announcements', '',
      'RESULT', 'Contributed to an integrated student platform supporting AI-assisted learning and real-time collaboration.', '',
      'GITHUB', 'https://github.com/VAIBHAV7848/KLE_CONNECT',
    ],
    '/home/omganesh/Projects/wids-2026-wildfire-prediction.md': [
      '# WiDS 2026 Wildfire Prediction', 'Machine-learning project for predicting wildfire risk from historical and environmental data.', '',
      'ROLE', 'ML project contributor and model developer', '',
      'STACK', 'Python · Pandas · NumPy · Scikit-learn · XGBoost · LightGBM · CatBoost · Random Forest', '',
      'HIGHLIGHTS', '• Data preprocessing and feature engineering', '• Training, evaluation, and comparison of multiple ML algorithms', '• Wildfire-risk prediction pipeline for practical ML learning', '',
      'RESULT', 'Built a course-project prediction workflow demonstrating predictive analytics, model training, and evaluation.', '',
      'GITHUB', 'https://github.com/Omganesh014/WiDS2026-Wildfire-Prediction',
    ],
    '/home/omganesh/Projects/digital-memory-capsule.md': [
      '# Digital Memory Capsule', 'Secure web platform for time-locked messages, photos, and videos that unlock on a chosen future date.', '',
      'ROLE', 'Project Creator and Full-stack Developer', '',
      'STACK', 'React 18 · Vite · React Router · Axios · Node.js · Express.js · PostgreSQL · JWT · bcrypt · Multer · AWS S3 · Nodemailer · node-cron', '',
      'HIGHLIGHTS', '• JWT authentication and AES-256-GCM encrypted private messages', '• Time-locked capsules, custom unlock dates, and public/token sharing', '• Validated image/video uploads with local or AWS S3 storage', '• Cron email reminders, profile management, and Gmail OTP verification', '',
      'RESULT', 'Designed a scalable full-stack memory-preservation platform combining encryption, media storage, reminders, and secure sharing.', '',
      'GITHUB', 'https://github.com/Omganesh014/Digital-Memory-Capsule-',
    ],
    '/home/omganesh/Experience/profile.md': ['# Experience', '## Technical Team Core Member', 'KLE CTIE, Dr. M. S. Sheshgiri Campus', 'December 2025 – Present · Belagavi, Karnataka, India (Hybrid)', '', '• Organize technical events and workshops.', '• Support students with technical initiatives and project development.', '• Participate in technical discussions and innovation-focused activities.', '• Foster a collaborative learning environment.'],
    '/home/omganesh/Education/education.md': ['# Education', '## Bachelor of Engineering (B.E.) – Computer Science', 'KLE Technological University, Dr. M. S. Sheshgiri Campus', 'September 2024 – September 2028', 'Relevant skills: Java, C++, C, Web Development, DBMS, SQL, OOP', '', '## Higher Secondary Certificate (HSC) – Science', 'KLE Independent PU College, Nipani, Karnataka', 'June 2022 – June 2024 · Grade: 86.83%', '', '## Secondary School Certificate (SSC)', 'K. L. E. English Medium School', 'July 2021 – May 2022 · Grade: 93.76%'],
    '/home/omganesh/Skills/skills.md': ['# Skills', '## Programming & Web', 'Java · C++ · C · HTML5 · React.js · Node.js · Express.js · TypeScript · Web Development · Full-Stack Development', '', '## Data & Fundamentals', 'SQL · Database Management Systems (DBMS) · Object-Oriented Programming (OOP) · Problem Solving', '', '## Tools & Collaboration', 'Git · GitHub · Teamwork · Leadership · Communication · Student Development'],
    '/home/omganesh/Certificates/certificates.md': ['# Certificates', 'IBM Full Stack Software Developer Professional Certificate', 'Coursera · In Progress'],
    '/home/omganesh/Achievements/achievements.md': ['# Achievements', 'Selected engineering and product achievements.'],
    '/home/omganesh/Contact/contact.md': ['# Contact', 'Name: OmGanesh R Matiwade', 'Instagram: https://www.instagram.com/omganesh_014/', 'GitHub: https://github.com/Omganesh014', 'Email: omganeshmatiwade007@gmail.com', 'LinkedIn: https://www.linkedin.com/in/omganesh-r-matiwade-', 'Location: Belagavi, Karnataka, India'],
    '/home/omganesh/.config/shellrc': ['export SHELL=om'],
    '/projects/spendday.md': ['# SpendDay', 'Full-stack food ordering platform with real-time order tracking.', 'GitHub: https://github.com/02fe24bcs078-dot/SpendDay'],
    '/projects/study-buddy.md': ['# Study Buddy', 'AI-powered study companion for focus and productive learning.', 'GitHub: https://github.com/Omganesh014/Study-Buddy'],
    '/projects/truthbridge-janavaani.md': ['# TruthBridge (JanaVaani)', 'AI-powered civic infrastructure monitoring platform.', 'GitHub: https://github.com/VAIBHAV7848/truthbridge'],
    '/projects/road-damage-detection.md': ['# TruthBridge - Road Damage Detection System', 'Deep-learning road and bridge defect detection system.', 'GitHub: https://github.com/Omganesh014/Road-Damage-Detection-Using-Deep-Learning'],
    '/projects/daa-final-lab.md': ['# DAA-FINAL-LAB', 'C++ algorithms lab revision repository.', 'GitHub: https://github.com/Omganesh014/DAA-FINAL-LAB'],
    '/projects/omos-terminal-portfolio.md': ['# OmOS - Terminal-Based Portfolio', 'Interactive OS-inspired developer portfolio.', 'GitHub: https://github.com/Omganesh014/Terminal-Based-Portfolio'],
    '/projects/kle-connect.md': ['# KLE CONNECT', 'Integrated college companion platform.', 'GitHub: https://github.com/VAIBHAV7848/KLE_CONNECT'],
    '/projects/wids-2026-wildfire-prediction.md': ['# WiDS 2026 Wildfire Prediction', 'Machine-learning wildfire risk prediction project.', 'GitHub: https://github.com/Omganesh014/WiDS2026-Wildfire-Prediction'],
    '/projects/digital-memory-capsule.md': ['# Digital Memory Capsule', 'Secure time-locked digital memory platform.', 'GitHub: https://github.com/Omganesh014/Digital-Memory-Capsule-'],
    '/experience/profile.md': ['Technical Team Core Member · KLE CTIE · December 2025 – Present'], '/education/education.md': ['B.E. Computer Science · KLE Technological University · 2024 – 2028'],
    '/skills/skills.md': ['Java', 'Web Development', 'C++', 'SQL', 'DBMS', 'OOP', 'C', 'HTML5', 'Git', 'GitHub', 'React.js', 'Node.js', 'Express.js', 'TypeScript', 'Full-Stack Development', 'Problem Solving', 'Teamwork', 'Leadership', 'Communication', 'Student Development'],
    '/certificates/certificates.md': ['IBM Full Stack Software Developer Professional Certificate · Coursera · In Progress'], '/achievements/achievements.md': ['Achievements.'],
    '/contact/contact.md': ['GitHub: https://github.com/Omganesh014', 'Email: omganeshmatiwade007@gmail.com'], '/.om/manifest.json': ['{ "name": "OM", "version": "1.0.0" }'],
  },
};

export function normalizePath(pathname: string) {
  const stack: string[] = [];
  for (const segment of pathname.split('/').filter(Boolean)) {
    if (segment === '.') continue;
    if (segment === '..') stack.pop(); else stack.push(segment);
  }
  return `/${stack.join('/')}`;
}

export function parentPath(pathname: string) {
  const segments = normalizePath(pathname).split('/').filter(Boolean);
  segments.pop();
  return `/${segments.join('/')}`;
}

export function baseName(pathname: string) {
  return normalizePath(pathname).split('/').filter(Boolean).pop() ?? '';
}

export function formatFileTree(fileSystem: VirtualFileSystem, root = '/home/omganesh') {
  const lines = [root];
  const visit = (pathname: string, prefix: string) => {
    const entries = fileSystem.directories[pathname] ?? [];
    entries.forEach((entry, index) => {
      const last = index === entries.length - 1;
      const child = normalizePath(`${pathname}/${entry}`);
      lines.push(`${prefix}${last ? '└──' : '├──'} ${entry}`);
      if (fileSystem.directories[child]) visit(child, `${prefix}${last ? '    ' : '│   '}`);
    });
  };
  visit(root, '');
  return lines;
}
