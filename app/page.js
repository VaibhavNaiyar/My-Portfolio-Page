'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Twitter, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

// ─── THEME CONTEXT ────────────────────────────────────────────────────────────
// Dark theme colors
const DARK = {
  bg: '#0A0A0A',
  fg: '#EDEDED',
  accent: '#D1FF4C',
  accentText: '#D1FF4C',
  muted: 'rgba(255,255,255,0.5)',
  border: 'rgba(255,255,255,0.1)',
  cardBg: '#111',
  cardBorder: 'rgba(255,255,255,0.1)',
  navBg: 'rgba(10,10,10,0.6)',
  testimonialBg: '#0D0D0D',
  mono: 'rgba(255,255,255,0.5)',
  tagBorder: 'rgba(255,255,255,0.15)',
  quoteColor: '#D1FF4C',
};

// Light purple theme colors
const LIGHT = {
  bg: '#FAF7FA',
  fg: '#1A0A2E',
  accent: '#78578C',
  accentText: '#78578C',
  muted: 'rgba(26,10,46,0.5)',
  border: 'rgba(120,87,140,0.2)',
  cardBg: '#F3EEF6',
  cardBorder: 'rgba(120,87,140,0.2)',
  navBg: 'rgba(250,247,250,0.8)',
  testimonialBg: '#F0EBF4',
  mono: '#89689D',
  tagBorder: 'rgba(120,87,140,0.3)',
  quoteColor: '#C286A0',
};

// ─── MAGNETIC COMPONENT ───────────────────────────────────────────────────────
function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    el.style.transition = 'transform 0.1s ease-out';
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0,0)';
    el.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1)';
  }, []);

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ display: 'inline-block' }}>
      {children}
    </div>
  );
}

// ─── REVEAL COMPONENT ─────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ theme, T, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['ABOUT', 'SERVICES', 'WORK', 'CONTACT'];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? T.navBg : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${T.border}` : '1px solid transparent',
      }}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between h-16">
        {/* Logo */}
        <Magnetic>
          <a href="#" className="font-mono text-xs tracking-widest uppercase" style={{ color: T.fg }}>
            <span style={{ color: T.accent }}>/</span> VAIBHAV.DEV
          </a>
        </Magnetic>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Magnetic key={link} strength={0.4}>
              <a
                href={`#${link.toLowerCase()}`}
                className="font-mono text-xs tracking-widest uppercase transition-colors duration-200"
                style={{ color: T.muted }}
                onMouseEnter={e => e.currentTarget.style.color = T.accent}
                onMouseLeave={e => e.currentTarget.style.color = T.muted}
              >
                {link}
              </a>
            </Magnetic>
          ))}
          {/* Theme toggle */}
          <Magnetic>
            <button
              onClick={onToggleTheme}
              className="font-mono text-xs tracking-widest uppercase px-3 py-1 rounded-full border transition-all duration-200"
              style={{ color: T.accent, borderColor: T.accent }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? 'LIGHT' : 'DARK'}
            </button>
          </Magnetic>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden font-mono text-xs tracking-widest"
          style={{ color: T.fg }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? 'CLOSE' : 'MENU'}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ backgroundColor: T.bg, borderTop: `1px solid ${T.border}` }}
            className="md:hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="font-mono text-xs tracking-widest uppercase"
                  style={{ color: T.muted }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link}
                </a>
              ))}
              <button
                onClick={() => { onToggleTheme(); setMenuOpen(false); }}
                className="font-mono text-xs tracking-widest uppercase text-left"
                style={{ color: T.accent }}
              >
                {theme === 'dark' ? 'SWITCH TO LIGHT' : 'SWITCH TO DARK'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ T }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0px', '80px']);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen pt-16 flex flex-col">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex-1 flex flex-col">
        {/* Top meta row */}
        <div className="flex justify-between items-center pt-8 pb-6" style={{ borderBottom: `1px solid ${T.border}` }}>
          <motion.span
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: T.mono }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            / Portfolio — 2026
          </motion.span>
          <motion.span
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: T.mono }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Ludhiana · IND
          </motion.span>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-12 gap-8 flex-1 items-center py-8 md:py-12">
          {/* Headline — 8 cols */}
          <div className="col-span-12 md:col-span-8 flex flex-col justify-center overflow-hidden">
            <motion.h1
              className="font-bold uppercase leading-[0.85] tracking-tightest select-none"
              style={{ fontSize: 'clamp(3rem, 8.5vw, 8rem)', color: T.fg }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <div>SOFTWARE</div>
              <div className="relative inline-block">
                ENGINEER
                <span
                  className="absolute"
                  style={{
                    color: T.accent,
                    fontSize: 'clamp(0.4rem, 1.5vw, 1.2rem)',
                    top: '0.15em',
                    right: '-0.4em',
                    lineHeight: 1,
                  }}
                >
                  •
                </span>
              </div>
            </motion.h1>
          </div>

          {/* Portrait — 4 cols */}
          <motion.div
            className="col-span-12 md:col-span-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          >
            <motion.div
              className="relative w-full aspect-[3/4] overflow-hidden rounded-sm"
              style={{ y: imageY }}
            >
              <Image
                src="/vaibhav.jpeg"
                alt="Vaibhav — Full-Stack Engineer"
                fill
                className="object-cover object-top"
                priority
              />
              {/* Corner overlays */}
              <span
                className="absolute bottom-3 left-3 font-mono text-xs tracking-widest uppercase"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                [VAIBHAV]
              </span>
              <span
                className="absolute bottom-3 right-3 font-mono text-xs tracking-widest uppercase"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                ©2026
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom meta row */}
        <div style={{ borderTop: `1px solid ${T.border}` }} className="py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            '/ Creating since 2022',
            '/ Full-Stack · Web3 · DevOps',
            '/ Available Q3 2026',
          ].map((item, i) => (
            <motion.span
              key={i}
              className="font-mono text-xs tracking-widest uppercase"
              style={{ color: T.mono }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
            >
              {item}
            </motion.span>
          ))}
          <motion.div
            className="flex items-center gap-3 justify-end md:justify-end"
            style={{ opacity: scrollOpacity }}
          >
            <span className="font-mono text-xs tracking-widest uppercase" style={{ color: T.mono }}>
              SCROLL
            </span>
            <div className="h-px w-10" style={{ backgroundColor: T.mono }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function About({ T }) {
  return (
    <section id="about" style={{ borderTop: `1px solid ${T.border}` }} className="py-28 md:py-40">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-3">
            <Reveal>
              <span className="font-mono text-xs tracking-widest uppercase" style={{ color: T.mono }}>
                /About
              </span>
            </Reveal>
          </div>
          <div className="col-span-12 md:col-span-9">
            <Reveal delay={0.1}>
              <p
                className="font-medium leading-[1.2] tracking-tight"
                style={{ fontSize: 'clamp(1.4rem, 3.5vw, 3rem)', color: T.fg }}
              >
                I'm a software engineer focused on turning complex problems into simple, scalable solutions. Working independently, I've built everything from high-traffic learning platforms to real-time video networks using{' '}
                <span style={{ color: T.accent }}>Next.js</span>,{' '}
                <span style={{ color: T.accent }}>Node.js</span>,{' '}
                <span style={{ color: T.accent }}>PostgreSQL</span>, and modern{' '}
                <span style={{ color: T.accent }}>DevOps tools</span>.{' '}
                Currently diving deep into <strong style={{ color: T.fg }}>Generative AI</strong> and{' '}
                <strong style={{ color: T.fg }}>agentic workflows</strong>, exploring how large language models can power smarter applications. When I'm not optimizing APIs, contributing to open-source startups, or experimenting with AI, you can usually find me on the football field.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-10">
              <Magnetic>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border font-mono text-xs tracking-widest uppercase transition-all duration-300 group"
                  style={{ borderColor: T.fg, color: T.fg }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = T.accent;
                    e.currentTarget.style.borderColor = T.accent;
                    e.currentTarget.style.color = '#000';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = T.fg;
                    e.currentTarget.style.color = T.fg;
                  }}
                >
                  Get in touch
                  <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:rotate-45" />
                </a>
              </Magnetic>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── MARQUEE ──────────────────────────────────────────────────────────────────
function MarqueeSection({ T }) {
  const text = 'From idea to launch — clean, scalable products built to move fast and perform in the real world.';
  const repeated = Array(6).fill(text);

  return (
    <section
      className="py-16 md:py-24 overflow-hidden"
      style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}
    >
      <div className="flex whitespace-nowrap animate-marquee">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center flex-shrink-0">
            <span
              className="font-bold uppercase tracking-tightest leading-none"
              style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', color: T.fg }}
            >
              {item}
            </span>
            <span
              className="mx-6 md:mx-10 inline-block rounded-full flex-shrink-0"
              style={{ width: '0.6em', height: '0.6em', backgroundColor: T.accent, verticalAlign: 'middle' }}
            />
          </span>
        ))}
      </div>
    </section>
  );
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────
function Services({ T }) {
  const services = [
    { num: '01', title: 'Full-Stack Development', skills: ['Next.js', 'TypeScript', 'Node.js'] },
    { num: '02', title: 'Web3 / Smart Contracts', skills: ['Solidity', 'Hardhat', 'Wallets'] },
    { num: '03', title: 'Real-Time Systems', skills: ['WebRTC', 'WebSockets', 'APIs'] },
    { num: '04', title: 'DevOps & Deployment', skills: ['CI/CD', 'Docker', 'Cloud'] },
  ];

  return (
    <section id="services" className="py-28 md:py-40" style={{ borderTop: `1px solid ${T.border}` }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-12 gap-8 mb-16">
          <div className="col-span-12 md:col-span-3">
            <Reveal>
              <span className="font-mono text-xs tracking-widest uppercase" style={{ color: T.mono }}>
                /Services
              </span>
            </Reveal>
          </div>
          <div className="col-span-12 md:col-span-9">
            <Reveal delay={0.1}>
              <h2
                className="font-bold uppercase tracking-tightest leading-[0.85]"
                style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', color: T.fg }}
              >
                WHAT I DO
                <span style={{ color: T.accent }}>.</span>
              </h2>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.2}>
          <div
            className="grid grid-cols-1 md:grid-cols-2 rounded-lg overflow-hidden"
            style={{ border: `1px solid ${T.border}` }}
          >
            {services.map((svc, i) => (
              <ServiceCard key={svc.num} svc={svc} T={T} isLast={i === services.length - 1} index={i} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ServiceCard({ svc, T, index }) {
  const [hovered, setHovered] = useState(false);
  const isRight = index % 2 === 1;
  const isBottom = index >= 2;

  return (
    <div
      className="p-8 md:p-10 transition-colors duration-300 cursor-pointer"
      style={{
        backgroundColor: hovered ? T.cardBg : 'transparent',
        borderRight: isRight ? 'none' : `1px solid ${T.border}`,
        borderBottom: isBottom ? 'none' : `1px solid ${T.border}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex justify-between items-start mb-8">
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: T.mono }}>
          {svc.num}
        </span>
      </div>
      <h3
        className="font-bold mb-6"
        style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)', color: T.fg }}
      >
        {svc.title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {svc.skills.map((skill) => (
          <span
            key={skill}
            className="font-mono text-xs tracking-widest uppercase px-3 py-1 rounded-full border"
            style={{ borderColor: T.tagBorder, color: T.mono }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
function Projects({ T }) {
  const projects = [
    {
      num: '/01',
      year: '2025',
      title: 'SpendLens',
      desc: 'Intelligent expense categorizer with OCR receipt scanning, built at SIC Hackathon.',
      tech: ['Next.js', 'Tesseract.js', 'AI'],
      img: 'https://images.pexels.com/photos/5900178/pexels-photo-5900178.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      link: 'https://github.com/VaibhavNaiyar/SIC-hackathon',
    },
    {
      num: '/02',
      year: '2025',
      title: 'The Language Salon',
      desc: 'Multilingual learning platform — live website for a language education studio.',
      tech: ['Web', 'Design', 'CMS'],
      img: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      link: 'https://www.thelanguagesalon.com/',
    },
    {
      num: '/03',
      year: '2024',
      title: 'WebRTC Video Calling',
      desc: 'Peer-to-peer video calling app with low-latency streaming and real-time signaling.',
      tech: ['WebRTC', 'Node.js', 'Socket.io'],
      img: 'https://images.unsplash.com/photo-1586985564150-11ee04838034?auto=format&fit=crop&w=940&q=80',
      link: 'https://github.com/VaibhavNaiyar/videoCalling',
    },
    {
      num: '/04',
      year: '2024',
      title: 'Trading Platform',
      desc: 'Full-stack trading dashboard with live market data, charts, and order management.',
      tech: ['React', 'Node.js', 'WebSockets'],
      img: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      link: 'https://github.com/VaibhavNaiyar/trading-platform',
    },
    {
      num: '/05',
      year: '2024',
      title: 'Token LaunchPad',
      desc: 'Web3 token launch platform — create, deploy, and manage ERC-20 tokens on-chain.',
      tech: ['Solidity', 'Hardhat', 'Ethers.js'],
      img: 'https://images.pexels.com/photos/6771671/pexels-photo-6771671.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      link: 'https://github.com/VaibhavNaiyar/Token-LaunchPad-Mini-Project',
    },
    {
      num: '/06',
      year: '2026',
      title: 'Ed Tech Platform',
      desc: 'Currently building — an interactive learning platform with live sessions and AI-powered feedback.',
      tech: ['Next.js', 'AI', 'WIP'],
      img: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      link: null,
      wip: true,
    },
  ];

  return (
    <section id="work" className="py-28 md:py-40" style={{ borderTop: `1px solid ${T.border}` }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-12 gap-8 mb-16">
          <div className="col-span-12 md:col-span-3">
            <Reveal>
              <span className="font-mono text-xs tracking-widest uppercase" style={{ color: T.mono }}>
                /Featured Work
              </span>
            </Reveal>
          </div>
          <div className="col-span-12 md:col-span-9">
            <Reveal delay={0.1}>
              <h2
                className="font-bold uppercase tracking-tightest leading-[0.85]"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 7rem)', color: T.fg }}
              >
                SELECTED<br />
                PROJECTS<span style={{ color: T.accent }}>.</span>
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {projects.map((proj, i) => (
            <Reveal key={proj.title} delay={i * 0.1}>
              <ProjectCard proj={proj} T={T} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="mt-16 flex justify-center">
          <Magnetic>
            <a
              href="https://github.com/VaibhavNaiyar"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm tracking-widest uppercase inline-flex items-center gap-2 pb-1 border-b transition-colors duration-200"
              style={{ borderColor: T.fg, color: T.fg }}
              onMouseEnter={e => { e.currentTarget.style.color = T.accent; e.currentTarget.style.borderColor = T.accent; }}
              onMouseLeave={e => { e.currentTarget.style.color = T.fg; e.currentTarget.style.borderColor = T.fg; }}
            >
              VIEW ALL WORK <ArrowUpRight size={14} />
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}

function ProjectCard({ proj, T }) {
  const [hovered, setHovered] = useState(false);
  const Wrapper = proj.link ? 'a' : 'div';
  const wrapperProps = proj.link
    ? { href: proj.link, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="group block"
      style={{ cursor: proj.link ? 'pointer' : 'default', textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm mb-5">
        <Image
          src={proj.img}
          alt={proj.title}
          fill
          className="object-cover transition-all duration-700"
          style={{
            filter: hovered ? 'grayscale(0%)' : 'grayscale(100%)',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        {/* WIP overlay */}
        {proj.wip && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
            <span className="font-mono text-xs tracking-widest uppercase px-4 py-2 rounded-full border" style={{ borderColor: T.accent, color: T.accent }}>
              In Progress
            </span>
          </div>
        )}
        {/* Top overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <span className="font-mono text-xs tracking-widest" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {proj.num}
          </span>
          <span className="font-mono text-xs tracking-widest" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {proj.year}
          </span>
        </div>
        {/* Hover arrow — only when there's a link */}
        {proj.link && (
          <motion.div
            className="absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: T.accent }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUpRight size={16} color="#000" />
          </motion.div>
        )}
      </div>
      <h3 className="font-bold mb-2" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', color: T.fg }}>
        {proj.title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed" style={{ color: T.muted }}>
        {proj.desc}
      </p>
      <div className="flex flex-wrap gap-2">
        {proj.tech.map((t) => (
          <span
            key={t}
            className="font-mono text-xs tracking-widest uppercase px-3 py-1 rounded-full border"
            style={{ borderColor: T.tagBorder, color: T.mono }}
          >
            {t}
          </span>
        ))}
      </div>
    </Wrapper>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function Testimonials({ T }) {
  const testimonials = [
    {
      initials: 'AJ',
      name: 'Apoorva Juneja',
      role: 'Client',
      quote: 'Vaibhav built our app in just three days. He is fast, reliable, and highly dedicated, willing to do as many UI iterations as it takes to ensure the client is completely satisfied.',
    },
    {
      initials: 'V',
      name: 'Veerana',
      role: 'Collaborator',
      quote: 'He built the entire notes and ed-tech app with scalability in mind. He always looks ahead to future implementations, and I really appreciated how he kept everything so incredibly structured.',
    },
  ];

  return (
    <section className="py-28 md:py-40" style={{ borderTop: `1px solid ${T.border}` }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-12 gap-8 mb-16">
          <div className="col-span-12 md:col-span-3">
            <Reveal>
              <span className="font-mono text-xs tracking-widest uppercase" style={{ color: T.mono }}>
                /Words
              </span>
            </Reveal>
          </div>
          <div className="col-span-12 md:col-span-9">
            <Reveal delay={0.1}>
              <h2
                className="font-bold uppercase tracking-tightest leading-[0.85]"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 7rem)', color: T.fg }}
              >
                KIND WORDS<span style={{ color: T.accent }}>.</span>
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 max-w-4xl">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <TestimonialCard t={t} T={T} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t, T }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="p-8 rounded-lg"
      style={{
        backgroundColor: T.testimonialBg,
        border: `1px solid ${hovered ? T.accent + '40' : T.cardBorder}`,
      }}
      animate={{ y: hovered ? -4 : 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="text-5xl font-serif leading-none mb-6"
        style={{ color: T.quoteColor }}
      >
        "
      </div>
      <p className="text-lg md:text-xl leading-relaxed mb-8" style={{ color: T.fg }}>
        {t.quote}
      </p>
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: T.accent + '20', color: T.accent }}
        >
          {t.initials}
        </div>
        <div>
          <div className="font-medium text-sm" style={{ color: T.fg }}>
            {t.name}
          </div>
          <div className="font-mono text-xs tracking-widest uppercase mt-0.5" style={{ color: T.mono }}>
            {t.role}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function Field({ label, name, type = 'text', isTextarea = false, T, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="font-mono text-xs tracking-widest uppercase"
        style={{ color: T.mono }}
      >
        {label}
      </label>
      {isTextarea ? (
        <textarea
          id={name}
          name={name}
          rows={4}
          value={value}
          onChange={onChange}
          className="bg-transparent border-0 border-b outline-none resize-none py-3 text-sm transition-colors duration-200 w-full"
          style={{ borderColor: T.tagBorder, color: T.fg }}
          onFocus={e => e.target.style.borderColor = T.accent}
          onBlur={e => e.target.style.borderColor = T.tagBorder}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className="bg-transparent border-0 border-b outline-none py-3 text-sm transition-colors duration-200 w-full"
          style={{ borderColor: T.tagBorder, color: T.fg }}
          onFocus={e => e.target.style.borderColor = T.accent}
          onBlur={e => e.target.style.borderColor = T.tagBorder}
        />
      )}
    </div>
  );
}

function Contact({ T }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'sending' | 'sent' | 'error'

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-28 md:py-40" style={{ borderTop: `1px solid ${T.border}` }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <Reveal>
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: T.mono }}>
            /Contact
          </span>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 mt-10">
          {/* Left col */}
          <div>
            <Reveal delay={0.1}>
              <h2
                className="font-bold uppercase tracking-tightest leading-[0.85] mb-8"
                style={{ fontSize: 'clamp(3rem, 7vw, 7rem)', color: T.fg }}
              >
                LET'S<br />TALK<span style={{ color: T.accent }}>.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-base leading-relaxed mb-10" style={{ color: T.muted }}>
                Got an idea brewing, a product to ship, or just want to nerd out about systems? I read every message.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-col gap-4 mb-10">
                <a
                  href="mailto:naiyarvaibhav@gmail.com"
                  className="flex items-center gap-3 text-sm transition-colors duration-200 group"
                  style={{ color: T.fg }}
                  onMouseEnter={e => e.currentTarget.style.color = T.accent}
                  onMouseLeave={e => e.currentTarget.style.color = T.fg}
                >
                  <Mail size={16} />
                  naiyarvaibhav@gmail.com
                </a>
                <span className="flex items-center gap-3 text-sm" style={{ color: T.muted }}>
                  <MapPin size={16} />
                  Ludhiana, Punjab
                </span>
              </div>
              <div className="flex gap-4">
                {[
                  { icon: Github, href: 'https://github.com/VaibhavNaiyar', label: 'GitHub' },
                  { icon: Linkedin, href: 'https://www.linkedin.com/in/vaibhav-naiyar-07b817291/', label: 'LinkedIn' },
                  { icon: Twitter, href: 'https://x.com/VaibhavNaiyar', label: 'X / Twitter' },
                ].map(({ icon: Icon, href, label }) => (
                  <Magnetic key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200"
                      style={{ borderColor: T.border, color: T.mono }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = T.accent;
                        e.currentTarget.style.borderColor = T.accent;
                        e.currentTarget.style.color = '#000';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = T.border;
                        e.currentTarget.style.color = T.mono;
                      }}
                    >
                      <Icon size={16} />
                    </a>
                  </Magnetic>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right col — form */}
          <Reveal delay={0.2}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <Field label="Name" name="name" T={T} value={form.name} onChange={handleChange} />
              <Field label="Email" name="email" type="email" T={T} value={form.email} onChange={handleChange} />
              <Field label="Message" name="message" isTextarea T={T} value={form.message} onChange={handleChange} />

              <div className="flex flex-col gap-4">
                <Magnetic>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-mono text-xs tracking-widest uppercase transition-all duration-300 group"
                    style={{ backgroundColor: T.accent, color: '#000' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#000'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = T.accent; e.currentTarget.style.color = '#000'; }}
                  >
                    {status === 'sending' ? 'Sending...' : 'Send message'}
                    <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform duration-300" />
                  </button>
                </Magnetic>

                <AnimatePresence>
                  {status === 'sent' && (
                    <motion.span
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-mono text-xs tracking-widest uppercase"
                      style={{ color: T.accent }}
                    >
                      / Message sent
                    </motion.span>
                  )}
                  {status === 'error' && (
                    <motion.span
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-mono text-xs tracking-widest uppercase"
                      style={{ color: '#ef4444' }}
                    >
                      / Failed — try again
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ T }) {
  return (
    <footer style={{ borderTop: `1px solid ${T.border}` }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20">
        {/* Big closing headline */}
        <Reveal>
          <h2
            className="font-bold uppercase tracking-tightest leading-[0.85] mb-20"
            style={{ fontSize: 'clamp(3rem, 12vw, 10rem)', color: T.fg }}
          >
            LET'S BUILD /<br />
            <span style={{ color: T.accent }}>SOMETHING</span> REAL.
          </h2>
        </Reveal>

        {/* 3-col links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16" style={{ borderTop: `1px solid ${T.border}`, paddingTop: '3rem' }}>
          <div>
            <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: T.mono }}>
              /Email
            </div>
            <a
              href="mailto:naiyarvaibhav@gmail.com"
              className="text-sm transition-colors duration-200"
              style={{ color: T.fg }}
              onMouseEnter={e => e.currentTarget.style.color = T.accent}
              onMouseLeave={e => e.currentTarget.style.color = T.fg}
            >
              naiyarvaibhav@gmail.com
            </a>
          </div>
          <div>
            <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: T.mono }}>
              /Sitemap
            </div>
            <div className="flex flex-col gap-2">
              {['Home', 'About', 'Services', 'Work', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                  className="text-sm transition-colors duration-200"
                  style={{ color: T.muted }}
                  onMouseEnter={e => e.currentTarget.style.color = T.fg}
                  onMouseLeave={e => e.currentTarget.style.color = T.muted}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: T.mono }}>
              /Social
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: 'GitHub', href: 'https://github.com/VaibhavNaiyar' },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vaibhav-naiyar-07b817291/' },
                { label: 'X / Twitter', href: 'https://x.com/VaibhavNaiyar' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm inline-flex items-center gap-1 transition-colors duration-200"
                  style={{ color: T.muted }}
                  onMouseEnter={e => e.currentTarget.style.color = T.fg}
                  onMouseLeave={e => e.currentTarget.style.color = T.muted}
                >
                  {label} <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8"
          style={{ borderTop: `1px solid ${T.border}` }}
        >
          <span className="font-mono text-xs tracking-widest" style={{ color: T.mono }}>
            © 2026 Vaibhav. All rights reserved.
          </span>
          <span className="font-mono text-xs tracking-widest" style={{ color: T.mono }}>
            Built with Next.js · Hosted on Vercel
          </span>
          <span className="font-mono text-xs tracking-widest" style={{ color: T.mono }}>
            v1.0 — / Ludhiana, IND
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState('light');
  const T = theme === 'dark' ? DARK : LIGHT;

  useEffect(() => {
    document.body.classList.toggle('theme-light', theme === 'light');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div style={{ backgroundColor: T.bg, color: T.fg, transition: 'background-color 0.4s, color 0.4s' }}>
      <Nav theme={theme} T={T} onToggleTheme={toggleTheme} />
      <Hero T={T} />
      <About T={T} />
      <MarqueeSection T={T} />
      <Services T={T} />
      <Projects T={T} />
      <Testimonials T={T} />
      <Contact T={T} />
      <Footer T={T} />
    </div>
  );
}
