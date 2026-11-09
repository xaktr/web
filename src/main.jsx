import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDownRight, ArrowUpRight, ArrowRight, Github, Linkedin, Mail,
  Menu, X, Sparkles, Terminal, Code2, Layers3, ExternalLink, MoveUpRight,
  ChevronDown, Command, MousePointer2
} from 'lucide-react';
import './styles.css';

const logoUrl = `${import.meta.env.BASE_URL}logo.svg`;

const projects = [
  {
    number: '01',
    title: 'NEMO',
    type: 'COMPUTER VISION · UNDERWATER SYSTEMS',
    description: 'An exploration into using side-scan sonar imagery to help identify marine debris and seafloor anomalies.',
    stack: ['Python', 'Computer Vision', 'Machine Learning'],
    tone: 'mint',
    mark: 'N',
    details: 'Exploring how side-scan sonar imagery and computer vision could help identify marine debris and seafloor anomalies. The goal is to turn noisy acoustic images into useful, location-aware information for analysts.',
    status: 'IN DEVELOPMENT'

  }
];

const skills = [
  { group: 'LANGUAGES', items: ['C', 'C++', 'Python', 'JavaScript'] },
  { group: 'BUILDING', items: ['React', 'HTML & CSS', 'Git & GitHub'] },
  { group: 'EXPLORING', items: ['AI & ML', 'Problem Solving'] },
];

function App() {
  const [activeProject, setActiveProject] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    const timer = setInterval(() => setClock(new Date()), 60000);
    return () => { window.removeEventListener('scroll', onScroll); clearInterval(timer); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeProject !== null || menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeProject, menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <div className="grain" aria-hidden="true" />
      <header className={`topbar ${scrolled ? 'topbar-scrolled' : ''}`}>
        <a href="#home" className="wordmark" onClick={closeMenu} aria-label="Back to home">
          <img src={logoUrl} alt="AR" className="site-logo" />
        </a>
        <nav className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
          <a href="#about" onClick={closeMenu}><span>01</span> About</a>
          <a href="#work" onClick={closeMenu}><span>02</span> Work</a>
          <a href="#Skills" onClick={closeMenu}><span>03</span> Skills</a>
          <a href="#contact" onClick={closeMenu}><span>04</span> Contact</a>
          <a className="nav-cta" href="#contact" onClick={closeMenu}>Let's talk <ArrowUpRight size={14} /></a>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-topline">
            <span className="eyebrow"><span className="status-dot" /> OPEN TO LEARNING & COLLABORATION</span>
          </div>
          <div className="hero-layout">
            <div className="hero-copy">
              <p className="hero-pretitle">HELLO, INTERNET. I'M</p>
              <h1>Ankit Raj<span className="title-period">.</span></h1>
              <div className="hero-role"><span className="role-line" /> <span> CSE UNDERGRAD <b>·</b> QUIET OBSERVER <b>·</b> CURIOUS MIND</span></div>
              <p className="hero-description">I'm a second-year Computer Science undergrad drawn to the questions hiding beneath the surface. I tend to observe first, get curious, and build my way toward an answer.</p>
              <div className="hero-actions">
                <a className="button button-light" href="#work">Explore my work <ArrowDownRight size={17} /></a>
                <a className="text-link" href="#about">A little about me <ArrowRight size={15} /></a>
              </div>
              <div className="hero-footnote"><span className="tiny-cross">✳</span> BUILT WITH CURIOSITY, NOT A TEMPLATE.</div>
            </div>
            <div className="hero-art" aria-label="Abstract interactive visual">
              <div className="art-grid" />
              <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
              <div className="orbit-core">
                <div className="pulse-core">
                  <span className="pulse-ring" />
                  <span className="pulse-ring pulse-ring-delayed" />
                  <span className="pulse-dot" />
                </div>
                <i />
              </div>
              <div className="art-label art-label-top"><span>FIG. 001</span><span>THE WORK IN PROGRESS</span></div>
              <div className="art-label art-label-bottom"><span className="art-cross">+</span><span>LEARN / BUILD / REPEAT</span></div>
              <div className="float-note note-one"><Code2 size={15} /><span>curiosity.exe</span></div>
              <div className="float-note note-two"><Sparkles size={14} /><span>ideas in motion</span></div>
              <div className="art-index">01—04</div>
            </div>
          </div>
          <div className="hero-bottom">
            <span>SCROLL TO EXPLORE</span>
            <div className="scroll-track"><span /></div>
            <span className="hero-time">LOCAL TIME <b>{clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</b></span>
          </div>
        </section>

        <section className="intro-band">
          <div className="section-wrap intro-band-inner">
            <span className="section-kicker">THE SHORT VERSION</span>
            <p>Not an expert in everything.<br /><em>Just serious about getting better.</em></p>
            <span className="intro-aside">Fail <ArrowRight size={17} /> Learn <ArrowRight size={17} /> Repeat. </span>
          </div>
        </section>

        <section className="about section-wrap section-pad" id="about">
          <div className="section-heading">
            <span className="section-kicker">01 / ABOUT</span>
            <span className="heading-aside">A HUMAN BEFORE A RESUME</span>
          </div>
          <div className="about-grid">
            <div className="about-left">
              <h2>Learning by<br />making <span>things.</span></h2>
              <div className="about-stamp"><span>EST.</span><strong>IN<br />PROGRESS</strong><span>ALWAYS</span></div>
            </div>
            <div className="about-right">
              <p className="about-lead">I'm a B.Tech student interested in the space where <strong>engineering, software, and real-world problems</strong> meet.</p>
              <p>I'm naturally quiet, but my curiosity rarely sits still. I like following a question until it becomes a project, understanding the pieces before rushing to an answer, and learning by making things. This site is a field notebook for that process — experiments, projects, questions, and the progress in between.</p>
              <div className="about-facts">
                <div><span>RIGHT NOW</span><strong>Second-year CSE undergrad</strong></div>
                <div><span>MY DEFAULT MODE</span><strong>Observe first. Ask better questions.</strong></div>
                <div><span>OFF-SCREEN</span><strong>Music, ideas & deep dives</strong></div>
              </div>
            </div>
          </div>
        </section>

        <section className="work-section" id="work">
          <div className="section-wrap section-pad">
            <div className="section-heading">
              <span className="section-kicker">02 / SELECTED WORK</span>
              <span className="heading-aside">THOUGHTS MADE TANGIBLE</span>
            </div>
            <div className="work-intro">
              <h2>Less talk.<br /><span>More proof.</span></h2>
              <p>Projects, experiments, and questions I'm working through. Open a project to explore the thinking behind it.</p>
            </div>
            <div className="project-list">
              {projects.map((project) => (
                <button className={`project-row ${project.tone}`} key={project.number} onClick={() => setActiveProject(project)}>
                  <span className="project-number">{project.number}</span>
                  <span className="project-mark">{project.mark}</span>
                  <span className="project-main">
                    <span className="project-type">{project.type}</span>
                    <strong>{project.title}</strong>
                    <span className="project-description">{project.description}</span>
                    <span className="project-stack">{project.stack.map((tag) => <i key={tag}>{tag}</i>)}</span>
                  </span>
                  <span className="project-open"><ArrowUpRight size={21} /></span>
                </button>
              ))}
            </div>
            <div className="work-note"><span className="note-star">✳</span> THE BEST PROJECTS START WITH A GOOD QUESTION.</div>
          </div>
        </section>

        <section className="toolkit section-wrap section-pad" id="Skills">
          <div className="section-heading">
            <span className="section-kicker">03 / Skills</span>
            <span className="heading-aside">TOOLS ARE A MEANS, NOT THE POINT</span>
          </div>
          <div className="toolkit-layout">
            <div>
              <h2>Things I'm<br /><span>getting good at.</span></h2>
              <p className="toolkit-desc">A working list, not a claim to know it all. The goal is to keep learning and use each tool for a reason.</p>
              <div className="terminal-card">
                <div className="terminal-top"><span /><span /><span /><i>~/learning-log</i></div>
                <div className="terminal-body">
                  <p><span className="terminal-green">➜</span> current_focus</p>
                  <p className="terminal-output">build → test → understand → repeat</p>
                  <p><span className="terminal-green">➜</span> status <span className="terminal-cursor">▋</span></p>
                </div>
              </div>
            </div>
            <div className="skill-groups">
              {skills.map((group, i) => (
                <div className="skill-group" key={group.group}>
                  <div className="skill-group-head"><span>0{i + 1}</span><strong>{group.group}</strong><span className="skill-line" /></div>
                  <div className="skill-pills">{group.items.map((skill) => <span key={skill}>{skill}<ArrowUpRight size={12} /></span>)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="section-wrap contact-inner">
            <div className="section-heading">
              <span className="section-kicker">04 / CONTACT</span>
              <span className="heading-aside">GOOD THINGS START WITH A HELLO</span>
            </div>
            <div className="contact-content">
              <div><p className="contact-overline">HAVE A QUESTION, IDEA, OR OPPORTUNITY?</p><h2>Let's make<br /><em>something matter.</em></h2></div>
              <div className="contact-right">
                <p>I'm always glad to meet people who enjoy learning, building, and sharing what they discover.</p>
                <div className="social-links">
                  <a href="https://github.com/xaktr" target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ExternalLink size={12} /></a>
                  <a href="https://www.linkedin.com/in/xaktr/" target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn <ExternalLink size={12} /></a>
                  <a href="mailto:rajankit.ap@gmail.com"><Mail size={16} /> Email <ExternalLink size={12} /></a>
                </div>
              </div>
            </div>            <footer className="footer">
              <a href="#home" className="footer-logo" aria-label="Back to top">
                <img src={logoUrl} alt="AR" className="site-logo footer-logo-img" />
              </a>
              <span>Always Curious</span>
              <a href="#home" className="back-top">BACK TO TOP <ArrowUpRight size={14} /></a>
              <span className="footer-year">© 2026</span>
            </footer>
          </div>
        </section>
      </main>

      {activeProject && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setActiveProject(null); }}>
          <section className={`project-modal ${activeProject.tone}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-top"><span>PROJECT FILE / {activeProject.number}</span><button onClick={() => setActiveProject(null)} aria-label="Close project details"><X size={20} /></button></div>
            <div className="modal-mark">{activeProject.mark}</div>
            <span className="project-type">{activeProject.type}</span>
            <h2 id="modal-title">{activeProject.title}</h2>
            <p className="modal-description">{activeProject.details}</p>
            <div className="modal-status"><span>STATUS</span><strong><span className="status-dot" /> {activeProject.status}</strong></div>
            <div className="modal-stack">{activeProject.stack.map(tag => <span key={tag}>{tag}</span>)}</div>
            <button className="modal-done" onClick={() => setActiveProject(null)}>Back to portfolio <ArrowRight size={16} /></button>
          </section>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
