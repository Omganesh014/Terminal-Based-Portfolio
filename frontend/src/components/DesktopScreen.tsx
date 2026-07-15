import { useCallback, useEffect, useRef, useState } from 'react';
import { type WindowId, useWindowStore } from '../stores/windowStore';
import { OmGlyph } from './OmGlyph';

const workspaceItems = [
  { id: 'profile', name: 'profile', label: 'OMGANESH / DEVELOPER PROFILE', content: 'Omganesh\nFull Stack Developer\nInteractive interfaces, systems thinking, and product engineering.' },
  { id: 'about', name: 'about', label: 'ABOUT ME', content: 'I’m a Computer Science student who loves turning ideas into software that people can actually use. Whether it’s building a full-stack web app, experimenting with AI, or solving coding problems, I enjoy learning by creating and figuring out how things work under the hood.\n\nMost of my time goes into building projects, exploring new technologies, and sharpening my skills in Java, DSA, backend, and full-stack development. My goal is to become a software engineer who builds products that make a real impact. I believe the best way to grow is to keep building, keep breaking things, and keep improving—one project at a time.' },
  { id: 'resume', name: 'resume', label: 'RESUME / QUICK VIEW', content: 'Full-stack developer building responsive web applications, backend APIs, real-time systems, and AI-powered products.\n\nOpen Projects, Skills, and every other section directly from this workspace.' },
  { id: 'projects', name: 'projects', label: 'PROJECT INDEX', content: '' },
  { id: 'experience', name: 'experience', label: 'EXPERIENCE', content: 'TECHNICAL TEAM CORE MEMBER\nKLE CTIE · Dr. M. S. Sheshgiri Campus\nDecember 2025 – Present · Belagavi, Karnataka, India (Hybrid)\n\n• Collaborate with the technical team to organize technical events and workshops.\n• Support students with technical initiatives and project development.\n• Participate in technical discussions and innovation-focused activities.\n• Contribute to a collaborative learning environment.' },
  { id: 'education', name: 'education', label: 'EDUCATION', content: 'BACHELOR OF ENGINEERING (B.E.) – COMPUTER SCIENCE\nKLE Technological University, Dr. M. S. Sheshgiri Campus\nSeptember 2024 – September 2028\nRelevant skills: Java, C++, C, Web Development, DBMS, SQL, OOP\n\nHIGHER SECONDARY CERTIFICATE (HSC) – SCIENCE\nKLE Independent PU College, Nipani, Karnataka\nJune 2022 – June 2024\nGrade: 86.83%\n\nSECONDARY SCHOOL CERTIFICATE (SSC)\nK. L. E. English Medium School\nJuly 2021 – May 2022\nGrade: 93.76%' },
  { id: 'skills', name: 'skills', label: 'SKILL MATRIX', content: 'PROGRAMMING & WEB\nJava · C++ · C · HTML5 · React.js · Node.js · Express.js · TypeScript · Web Development · Full-Stack Development\n\nDATA & FUNDAMENTALS\nSQL · Database Management Systems (DBMS) · Object-Oriented Programming (OOP) · Problem Solving\n\nTOOLS & COLLABORATION\nGit · GitHub · Teamwork · Leadership · Communication · Student Development' },
  { id: 'certificates', name: 'certificates', label: 'CERTIFICATES', content: 'IBM FULL STACK SOFTWARE DEVELOPER PROFESSIONAL CERTIFICATE\nCoursera · In Progress\n\nAdditional certifications will be added as they are completed.' },
  { id: 'achievements', name: 'achievements', label: 'ACHIEVEMENTS', content: '• Developed end-to-end, real-time, role-based web platforms.\n• Built and integrated computer-vision models for infrastructure damage detection.\n• Contributed to Code Odyssey Hackathon 2026 with TruthBridge.\n• Created practical ML and AI-assisted learning projects.' },
  { id: 'contact', name: 'contact', label: 'CONTACT', content: '' },
  { id: 'terminal', name: 'terminal', label: 'INTERACTIVE SHELL', content: '' },
] as const satisfies ReadonlyArray<{ id: WindowId; name: string; label: string; content: string }>;

const projects = [
  { name: 'SpendDay', summary: 'Full-stack food ordering platform with real-time tracking and role-based management.', stack: 'React 19 · TypeScript · Express.js · Socket.IO · JWT', link: 'https://github.com/02fe24bcs078-dot/SpendDay' },
  { name: 'Study Buddy', summary: 'AI-powered study companion for focus, material summaries, and productive learning habits.', stack: 'React · Node.js · Express.js · Gemini API · Supabase', link: 'https://github.com/Omganesh014/Study-Buddy' },
  { name: 'TruthBridge (JanaVaani)', summary: 'AI-powered civic infrastructure monitoring and issue-resolution platform.', stack: 'Next.js · Supabase · Hugging Face · YOLO · OpenCV', link: 'https://github.com/VAIBHAV7848/truthbridge' },
  { name: 'Road Damage Detection System', summary: 'Deep-learning pipeline for real-time road and bridge defect detection.', stack: 'YOLOv8 · PyTorch · FastAPI · SQLite', link: 'https://github.com/Omganesh014/Road-Damage-Detection-Using-Deep-Learning' },
  { name: 'DAA-FINAL-LAB', summary: 'Exam-focused collection of essential algorithms lab implementations.', stack: 'C++', link: 'https://github.com/Omganesh014/DAA-FINAL-LAB' },
  { name: 'OmOS — Terminal-Based Portfolio', summary: 'Interactive operating-system-style developer portfolio.', stack: 'React 19 · TypeScript · Vite · Zustand · xterm.js', link: 'https://github.com/Omganesh014/Terminal-Based-Portfolio' },
  { name: 'KLE CONNECT', summary: 'College companion platform for communication, AI tutoring, and study planning.', stack: 'React · TypeScript · Supabase · Agora RTC', link: 'https://github.com/VAIBHAV7848/KLE_CONNECT' },
  { name: 'WiDS 2026 Wildfire Prediction', summary: 'Machine-learning wildfire risk prediction project.', stack: 'Python · Scikit-learn · XGBoost · LightGBM', link: 'https://github.com/Omganesh014/WiDS2026-Wildfire-Prediction' },
  { name: 'Digital Memory Capsule', summary: 'Secure, time-locked platform for messages and media.', stack: 'React · Node.js · Express.js · PostgreSQL · AWS S3', link: 'https://github.com/Omganesh014/Digital-Memory-Capsule-' },
] as const;

const projectDetails = [
  { problem: 'Simplifies food ordering by bringing customer ordering, restaurant operations, and platform administration into one application with live updates.', role: 'Full-stack Developer (Frontend & Backend)', features: ['Secure customer, restaurant, and admin authentication', 'Restaurant/menu discovery with advanced search and filters', 'Shopping cart, favorites, coupons, and checkout', 'Real-time order tracking with Socket.IO', 'Order history, reviews, cancellation, and reorder functionality', 'Role-based management dashboards and kitchen availability controls', 'Simulated email notifications and online payment workflow'], achievement: 'Developed a complete end-to-end food ordering platform with role-based access control, real-time order synchronization, and scalable full-stack architecture as a capstone Web Technology course project.', demo: 'https://drive.google.com/file/d/1cggxVspMXDwSguXKMQISXu4Uv-jxLZQq/view' },
  { problem: 'Helps students overcome distractions and inefficient study routines by combining AI-assisted learning, focus management, and progress tracking.', role: 'Full-stack Developer', features: ['AI-powered study material summarization', 'Pomodoro timer for focused study sessions', 'Gamified streaks, rewards, and progress milestones', 'Personalized productivity insights', 'Study-session tracking and performance monitoring', 'Responsive and user-friendly interface'], achievement: 'Built an AI-powered learning assistant that combines productivity tools and generative AI to improve student focus, learning efficiency, and study consistency.' },
  { problem: 'Improves public infrastructure maintenance by automating road and bridge damage detection, prioritizing reports with AI, and connecting citizens, authorities, and engineers.', role: 'Developed backend APIs and trained the machine learning model for road and bridge damage detection, integrating AI predictions into the application workflow.', features: ['AI-based road and bridge damage detection using computer vision', 'Image classification and authenticity verification', 'Multi-role citizen, authority, and engineer portals', 'Interactive geolocation maps with Leaflet', 'AI-powered risk scoring and automatic issue prioritization', 'Real-time analytics dashboard and monitoring', 'Supabase RLS authentication and end-to-end complaint tracking'], achievement: 'Contributed to the Code Odyssey Hackathon 2026 project by training the damage-detection model and integrating automated assessment with the issue-management workflow.' },
  { problem: 'Automates road and bridge damage detection, reducing manual inspections and identifying issues faster through severity and risk assessment.', role: 'Trained the damage detection ML model and developed the backend.', features: ['Image-based road and bridge damage detection', 'Bounding-box localization for cracks and potholes', 'Damage classification with confidence scoring', 'Critical, moderate, and minor severity estimation', 'Risk scoring using environmental and location factors', 'Duplicate-image detection using perceptual hashing', 'REST APIs, statistics, health checks, and critical-damage webhooks'], achievement: 'Built a deep-learning infrastructure damage-detection pipeline with real-time inference, duplicate detection, risk scoring, and backend API integration.' },
  { problem: 'Helps students revise, understand, and execute frequently asked Algorithms Lab ESA and viva problems using readable, logic-focused code.', role: 'Developer and algorithm implementation author', features: ['Brute-force string search', 'DFS and BFS', 'Bubble, insertion, selection, quick, merge, and heap sort', 'Floyd’s algorithm', 'Binary Search Tree operations', 'Dijkstra’s, Kruskal’s, and Prim’s algorithms', 'Simple, exam-friendly implementations for small inputs'], achievement: 'Created a compact, exam-focused C++ algorithms repository covering the most important lab and ESA problems in a clear, easy-to-revise format.' },
  { problem: 'Replaces a static portfolio with an engaging simulated operating system that makes projects, skills, and resume information memorable to explore.', role: 'Frontend developer and project creator', features: ['Animated boot sequence with skip option', 'Password-style login gate and restart flow', 'Keyboard-accessible desktop interface', 'Functional xterm.js terminal', 'Command history, filesystem navigation, and command palette', 'In-browser apps for profile, resume, projects, skills, and terminal access', 'Frontend-first prototype with planned backend support'], achievement: 'Built a creative terminal-based portfolio that transforms a conventional personal website into an immersive operating system experience.' },
  { problem: 'Brings academic collaboration, communication, AI tutoring, study planning, and campus support together so students use fewer disconnected tools.', role: 'Contributed to frontend development and provided technical guidance on feature design and implementation.', features: ['Supabase authentication', 'Real-time community chat and collaborative notes', 'AI-powered academic tutor', 'Voice/video virtual study rooms', 'Personal study planner and campus navigation', 'Admin dashboard for users and announcements'], achievement: 'Contributed to an integrated student platform featuring AI-assisted learning, real-time collaboration, and campus productivity tools.' },
  { problem: 'Helps estimate wildfire risk from historical and environmental data to support earlier awareness, planning, and response.', role: 'ML project contributor and model developer', features: ['Wildfire risk prediction with ML models', 'Data preprocessing and feature engineering', 'Model training and evaluation', 'Comparison of multiple machine-learning algorithms', 'Prediction pipeline for wildfire risk analysis', 'Practical course-project implementation'], achievement: 'Built a machine-learning wildfire prediction course project demonstrating data preprocessing, model training, and predictive analytics skills.' },
  { problem: 'Lets users preserve and share memories securely by locking messages and media until a future date, with encryption, reminders, and controlled sharing.', role: 'Project Creator and Full-stack Developer', features: ['JWT and bcrypt authentication', 'Time-locked capsules with custom unlock dates', 'Optional AES-256-GCM encryption for private messages', 'Image/video uploads with local or AWS S3 storage', 'Public and token-based capsule sharing', 'Automated email reminders using cron jobs', 'Profile management with Gmail OTP verification and secure upload validation'], achievement: 'Designed and developed a secure full-stack app that combines encrypted time capsules, media storage, automated reminders, and authenticated sharing.' },
] as const;

const contactLinks = [
  { badge: '[ig]', label: 'Instagram', value: '@omganesh_014', href: 'https://www.instagram.com/omganesh_014/' },
  { badge: '[git]', label: 'GitHub', value: 'Omganesh014', href: 'https://github.com/Omganesh014' },
  { badge: '[in]', label: 'LinkedIn', value: 'omganesh-r-matiwade', href: 'https://www.linkedin.com/in/omganesh-r-matiwade-' },
  { badge: '[@]', label: 'Email', value: 'omganeshmatiwade007@gmail.com', href: 'mailto:omganeshmatiwade007@gmail.com' },
] as const;

type DesktopScreenProps = { onOpenTerminal: () => void; onExitFullscreen: () => void; onLogout: () => void; onSignOut: () => void; onShutdown: () => void; };

export function DesktopScreen({ onOpenTerminal, onExitFullscreen, onLogout, onSignOut, onShutdown }: DesktopScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLElement | null>(null);
  const activeWindow = useWindowStore((state) => state.activeWindow);
  const openWindow = useWindowStore((state) => state.openWindow);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const openItem = workspaceItems.find((item) => item.id === activeWindow);

  const openSelected = useCallback((index: number) => {
    const item = workspaceItems[index];
    if (item.id === 'terminal') { onOpenTerminal(); return; }
    setSelectedProjectIndex(null);
    openWindow(item.id);
  }, [onOpenTerminal, openWindow]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (openItem) {
        if (event.key === 'Escape') { closeWindow(); return; }
        if (event.key === 'Tab') {
          const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])');
          if (!focusable?.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
        return;
      }
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); setSelectedIndex((index) => (index + 1) % workspaceItems.length); }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); setSelectedIndex((index) => (index - 1 + workspaceItems.length) % workspaceItems.length); }
      if (event.key === 'Enter') { event.preventDefault(); openSelected(selectedIndex); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeWindow, openItem, openSelected, selectedIndex]);

  useEffect(() => {
    if (openItem) dialogRef.current?.querySelector<HTMLElement>('button, a[href], input')?.focus();
  }, [openItem]);

  return <main className="desktop-screen terminal-desktop" aria-label="OM workspace">
    <section className="workspace-console">
      <header className="workspace-bar"><span>OM / WORKSPACE</span><span>session: omganesh@om</span><div className="workspace-controls"><button type="button" onClick={onExitFullscreen}>[ exit full screen ]</button><button type="button" onClick={onLogout}>[ logout ]</button><button type="button" onClick={onSignOut}>[ sign out ]</button><button type="button" onClick={onShutdown}>[ shutdown ]</button></div></header>
      <div className="workspace-body">
        <OmGlyph className="workspace-glyph" label="OM workspace" />
        <p className="workspace-prompt"><span>omganesh@om</span>:<b>~</b>$ workspace --list</p>
        <div className="workspace-intro"><strong>PORTFOLIO INDEX</strong><span>select a section to inspect</span></div>
        <nav className="workspace-list" aria-label="Portfolio modules">{workspaceItems.map((item, index) => <button className={selectedIndex === index ? 'is-selected' : ''} key={item.id} type="button" onFocus={() => setSelectedIndex(index)} onClick={() => openSelected(index)}><span className="workspace-index">[{String(index + 1).padStart(2, '0')}]</span><span className="workspace-command">open {item.name}</span><span className="workspace-label">{item.label}</span></button>)}</nav>
        <footer className="workspace-footer"><span>[↑ ↓] navigate</span><span>[enter] open</span><span>terminal is optional — every portfolio section is available here</span><span>use [ exit full screen ] when needed</span></footer>
      </div>
    </section>
    {openItem && <section className="desktop-window workspace-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-label={openItem.label}>
      <header><strong>OM / {openItem.label}</strong><button type="button" aria-label="Close module" onClick={closeWindow}>[esc]</button></header>
      {openItem.id === 'projects' ? <div className="project-index">{selectedProjectIndex === null ? <><p><span className="dialog-prompt">PROJECT INDEX / SELECT A PROJECT</span>{'\n\n'}Browse full project details and repository links directly from the workspace.</p><div className="project-list">{projects.map((project, index) => <button type="button" key={project.name} onClick={() => setSelectedProjectIndex(index)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{project.name}</strong><em>{project.summary}</em></button>)}</div></> : <ProjectDetails index={selectedProjectIndex} onBack={() => setSelectedProjectIndex(null)} />}</div> : openItem.id === 'resume' ? <ResumeDetails /> : openItem.id === 'contact' ? <ContactDetails /> : <p><span className="dialog-prompt">$ inspect {openItem.name}</span>{'\n\n'}{openItem.content}</p>}
    </section>}
  </main>;
}

function ProjectDetails({ index, onBack }: { index: number; onBack: () => void }) {
  const project = projects[index];
  const details = projectDetails[index];
  const demo = 'demo' in details ? details.demo : undefined;
  return <article className="project-details">
    <button className="project-back" type="button" onClick={onBack}>← all projects</button>
    <p><span className="dialog-prompt">PROJECT {String(index + 1).padStart(2, '0')}</span></p>
    <h2>{project.name}</h2>
    <section><h3>ONE-LINE SUMMARY</h3><p>{project.summary}</p></section>
    <section><h3>PROBLEM IT SOLVES</h3><p>{details.problem}</p></section>
    <section><h3>TECH STACK</h3><p>{project.stack}</p></section>
    <section><h3>KEY FEATURES</h3><ul>{details.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></section>
    <section><h3>MY ROLE</h3><p>{details.role}</p></section>
    <section><h3>NOTABLE RESULT / ACHIEVEMENT</h3><p>{details.achievement}</p></section>
    <section><h3>GITHUB</h3><a href={project.link} target="_blank" rel="noreferrer">{project.link}</a></section>
    {demo && <section><h3>LIVE DEMO</h3><a href={demo} target="_blank" rel="noreferrer">Demo video</a></section>}
  </article>;
}

function ContactDetails() {
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    await navigator.clipboard?.writeText('omganeshmatiwade007@gmail.com');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return <article className="contact-details">
    <p><span className="dialog-prompt">CONTACT / OPEN CHANNEL</span></p>
    <h2>OmGanesh R Matiwade</h2>
    <div className="contact-links">{contactLinks.map((link) => <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined}><span>{link.badge}</span><strong>{link.label}</strong><em>{link.value}</em></a>)}</div>
    <button className="copy-email" type="button" onClick={() => void copyEmail()}>{copied ? '[ok] email copied' : '[@] copy email address'}</button>
    <p className="contact-location">[loc] Belagavi, Karnataka, India</p>
  </article>;
}

function ResumeDetails() {
  return <article className="resume-details">
    <p><span className="dialog-prompt">RESUME / QUICK VIEW</span></p>
    <h2>OmGanesh R Matiwade</h2>
    <p>Computer Science undergraduate at KLE Technological University with experience in full-stack web development, machine learning, and embedded systems. Passionate about practical software and real-world problem solving.</p>
    <section><h3>CONTACT</h3><p>+91 89048 07897 · omganeshmatiwade007@gmail.com · Karnataka, India</p></section>
    <section><h3>EDUCATION</h3><p>B.E. Computer Science · KLE Technological University, Dr. M. S. Sheshgiri Campus · 2024–2028</p></section>
    <section><h3>TECHNICAL SKILLS</h3><p>C · C++ · Java · JavaScript · React.js · Node.js · Express.js · REST APIs · SQL · Supabase · Git · GitHub · Linux · Arduino Mega 2560 · Agora RTC · DSA · OOP · DBMS · Operating Systems · Computer Networks · ML Fundamentals</p></section>
    <section><h3>RELEVANT COURSEWORK</h3><p>Data Structures and Algorithms · Object-Oriented Programming · Database Management Systems · Operating Systems · Computer Networks · Probability and Statistics</p></section>
    <section><h3>SELECTED RESUME PROJECTS</h3><ul><li>KLE Connect — student collaboration, real-time communication, AI tutor, and virtual study rooms.</li><li>Food Ordering System — full-stack ordering, authentication, role-based access, backend APIs, and SQL operations.</li><li>Digital Memory Capsule — secure future-unlock memory storage with backend APIs and database integration.</li><li>Wood Log Quality and Age Prediction — signal-processing and ML model development using acoustic/vibration data.</li><li>Pothole Detection System — computer-vision model training, evaluation, and dataset refinement.</li><li>Bluetooth Controlled Folding Garage Door System — Arduino Mega 2560, Bluetooth control, and motor automation.</li></ul></section>
    <section><h3>INTERESTS</h3><p>Full-Stack Development · Embedded Systems and IoT · Machine Learning · Software Engineering · Fitness and Gym Training</p></section>
    <a className="download-resume" href="/OmGanesh-Matiwade-Resume.pdf" download>download resume (PDF)</a>
    <a className="download-resume" href="/OmGanesh-R-Matiwade-Resume.txt" download>[↓] download resume</a>
  </article>;
}
