'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Logo } from '@/components/ui/logo';
import {
  FadeIn,
  Stagger,
  StaggerItem,
  Parallax,
  ScaleIn,
  RevealLine,
} from '@/components/ui/motion';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { WaitlistForm } from '@/components/waitlist-form';
import {
  Shield,
  Users,
  TrendingUp,
  CreditCard,
  Zap,
  Brain,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Family Sub-Accounts',
    description:
      'Create managed accounts for kids and family members with custom spending controls and limits.',
    color: 'green' as const,
  },
  {
    icon: Shield,
    title: 'Smart Controls',
    description:
      'Set daily limits, block merchant categories, freeze accounts instantly. Full parental oversight.',
    color: 'blue' as const,
  },
  {
    icon: TrendingUp,
    title: 'Stablecoin Staking',
    description:
      'Earn yield on idle balances with transparent, on-chain staking. Watch your money grow.',
    color: 'purple' as const,
  },
  {
    icon: CreditCard,
    title: 'Virtual & Physical Cards',
    description:
      'Issue cards linked to any sub-account. Virtual cards instant, physical cards delivered.',
    color: 'green' as const,
  },
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description:
      'Receipt scanning, auto-categorization, and spending insights powered by AI.',
    color: 'blue' as const,
  },
  {
    icon: Zap,
    title: 'Financial Literacy',
    description:
      'Built-in learning modules, chore rewards, and gamification to teach kids about money.',
    color: 'purple' as const,
  },
];

const colorMap = {
  green: {
    bg: 'bg-green-dim',
    text: 'text-green',
    glow: 'shadow-[0_0_40px_rgba(34,197,94,0.12)]',
    border: 'hover:border-green/20',
  },
  blue: {
    bg: 'bg-blue-dim',
    text: 'text-blue',
    glow: 'shadow-[0_0_40px_rgba(59,130,246,0.12)]',
    border: 'hover:border-blue/20',
  },
  purple: {
    bg: 'bg-purple-dim',
    text: 'text-purple',
    glow: 'shadow-[0_0_40px_rgba(168,85,247,0.12)]',
    border: 'hover:border-purple/20',
  },
};

const steps = [
  {
    step: '01',
    title: 'Create Your Account',
    desc: 'Sign up with email or connect your wallet. Choose family or business mode.',
  },
  {
    step: '02',
    title: 'Add Sub-Accounts',
    desc: 'Create accounts for kids or team members. Set spending limits and controls.',
  },
  {
    step: '03',
    title: 'Fund & Grow',
    desc: 'Deposit via bank or crypto. Earn staking yield. Track spending with AI insights.',
  },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroScroll, [0, 1], [0, 150]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">
      <Header variant="landing" />

      {/* ─── Announcement Bar ─── */}
      <div className="relative bg-bg border-b border-border/50">
        <div className="max-w-[960px] mx-auto px-5 py-2.5 flex items-center justify-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 text-green font-medium text-xs tracking-wide uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green" />
            </span>
            Coming Soon
          </span>
          <span className="text-text-muted text-xs">
            We&apos;re building something special. Sign up for early access.
          </span>
        </div>
      </div>

      {/* ─── Hero Section ─── */}
      <section ref={heroRef} className="relative pt-24 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Ambient background — subtle edge glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Top-left corner glow */}
          <div className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px] rounded-full bg-green/[0.03] blur-[120px]" />
          {/* Top-right corner glow */}
          <div className="absolute -top-[200px] -right-[200px] w-[500px] h-[500px] rounded-full bg-green/[0.025] blur-[120px]" />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative max-w-[960px] mx-auto px-5 text-center"
        >
          <FadeIn delay={0.1} direction="up" distance={20}>
            <div className="inline-flex items-center gap-2 bg-green-dim/80 backdrop-blur-sm text-green text-xs font-medium px-4 py-2 rounded-full mb-8 border border-green/10">
              <Zap size={14} />
              Decentralized Banking for Families
            </div>
          </FadeIn>

          <FadeIn delay={0.3} direction="up" distance={30}>
            <h1 className="text-5xl md:text-[64px] font-bold leading-[1.1] tracking-tight max-w-4xl mx-auto">
              The bank account your{' '}
              <span className="relative">
                <span className="text-green">whole family</span>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-green/0 via-green to-green/0 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                />
              </span>{' '}
              can grow with
            </h1>
          </FadeIn>

          <FadeIn delay={0.5} direction="up" distance={20}>
            <p className="text-text-secondary text-lg md:text-xl mt-8 max-w-2xl mx-auto leading-relaxed">
              Create sub-accounts for kids and team members, set smart spending controls, earn
              staking yields, and teach financial literacy — all from one platform.
            </p>
          </FadeIn>

          <FadeIn delay={0.7} direction="up" distance={20}>
            <div className="mt-12">
              <WaitlistForm className="justify-center" />
            </div>
          </FadeIn>

          <FadeIn delay={1} direction="none">
            <motion.div
              className="mt-16 flex justify-center"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown size={24} className="text-text-muted" />
            </motion.div>
          </FadeIn>
        </motion.div>
      </section>

      {/* ─── Explainer Video ─── */}
      <section className="pb-20 md:pb-32 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-green/[0.02] rounded-full blur-[120px]" />
        </div>
        <ScaleIn className="max-w-[1280px] mx-auto px-5 relative">
          <div className="rounded-2xl overflow-hidden border border-border bg-bg-card shadow-[0_0_80px_rgba(34,197,94,0.06)]">
            <video
              className="w-full"
              autoPlay
              muted
              loop
              controls
              playsInline
              preload="auto"
            >
              <source src="/finplace-explainer.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </ScaleIn>
      </section>


      {/* ─── Features Section ─── */}
      <section id="features" className="py-20 md:py-32 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] -right-[250px] w-[500px] h-[500px] rounded-full bg-green/[0.02] blur-[120px]" />
          <div className="absolute bottom-[10%] -left-[250px] w-[400px] h-[400px] rounded-full bg-green/[0.02] blur-[120px]" />
        </div>

        <div className="max-w-[960px] mx-auto px-5 relative">
          <div className="text-center mb-16">
            <FadeIn>
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted mb-3">Features</p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold">
                Everything your family bank needs
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-text-secondary mt-4 max-w-xl mx-auto text-lg">
                A complete banking platform designed for families and businesses that want full
                control over their finances.
              </p>
            </FadeIn>
          </div>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" stagger={0.08}>
            {features.map((feature) => {
              const colors = colorMap[feature.color];
              return (
                <StaggerItem key={feature.title}>
                  <div
                    className={`group bg-bg-card/80 backdrop-blur-sm border border-border rounded-xl p-7 transition-all duration-500 hover:border-border-hover ${colors.border} hover:${colors.glow} hover:-translate-y-1`}
                  >
                    <div
                      className={`w-11 h-11 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110`}
                    >
                      <feature.icon size={20} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <RevealLine />

      {/* ─── How It Works ─── */}
      <section className="py-20 md:py-32 relative">
        <div className="max-w-[960px] mx-auto px-5">
          <div className="text-center mb-16">
            <FadeIn>
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted mb-3">
                How It Works
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold">Up and running in minutes</h2>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-[38px] left-[16.66%] right-[16.66%] h-px">
              <FadeIn direction="none" duration={1.2} delay={0.5}>
                <div className="w-full h-px bg-gradient-to-r from-green/30 via-green/10 to-green/30" />
              </FadeIn>
            </div>

            {steps.map((item, i) => (
              <FadeIn key={item.step} delay={0.15 * i} direction="up">
                <div className="text-center relative">
                  <motion.div
                    className="w-[76px] h-[76px] rounded-2xl bg-gradient-to-br from-green-dim to-bg-card border border-green/10 text-green text-xl font-bold flex items-center justify-center mx-auto mb-6"
                    whileHover={{ scale: 1.08, rotate: 3 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {item.step}
                  </motion.div>
                  <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-[260px] mx-auto">
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <RevealLine />

      {/* ─── CTA Section ─── */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green/[0.02] rounded-full blur-[120px]" />
        </div>

        <Parallax className="relative" speed={-0.15}>
          <div className="max-w-[960px] mx-auto px-5 text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold mb-5">
                Ready to take control of your family&apos;s finances?
              </h2>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="text-text-secondary mb-10 max-w-xl mx-auto text-lg">
                Be among the first families to use FinPlace to manage, save, and grow together.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <WaitlistForm size="large" className="justify-center" />
            </FadeIn>

            <Stagger
              className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mt-10 text-sm text-text-muted"
              stagger={0.12}
              delay={0.5}
            >
              {[
                'No credit card required',
                'Early access for waitlist members',
                'Free tier planned',
              ].map((text) => (
                <StaggerItem key={text}>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-green" />
                    {text}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Parallax>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/50 py-12">
        <FadeIn direction="none">
          <div className="max-w-[960px] mx-auto px-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <Logo size="md" />
              <nav className="flex items-center gap-8 text-sm text-text-muted">
                {['Privacy', 'Terms', 'Docs', 'Support'].map((item) => (
                  <Link
                    key={item}
                    href="#"
                    className="hover:text-text transition-colors duration-300"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
              <p className="text-sm text-text-muted">
                &copy; 2026 FinPlace. All rights reserved.
              </p>
            </div>
          </div>
        </FadeIn>
      </footer>
    </div>
  );
}
