'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, PiggyBank, ShoppingCart, TrendingUp, DollarSign, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

const initialModules = [
  { id: '1', title: 'What is Money?', category: 'Basics', duration: '5 min', completed: true, icon: DollarSign },
  { id: '2', title: 'Saving Smart', category: 'Saving', duration: '8 min', completed: true, icon: PiggyBank },
  { id: '3', title: 'Needs vs Wants', category: 'Spending', duration: '6 min', completed: false, icon: ShoppingCart },
  { id: '4', title: 'Growing Your Money', category: 'Investing', duration: '10 min', completed: false, icon: TrendingUp },
  { id: '5', title: 'Earning & Jobs', category: 'Earning', duration: '7 min', completed: false, icon: DollarSign },
];

const initialBadges = [
  { name: 'First Saver', earned: true },
  { name: 'Budget Boss', earned: true },
  { name: 'Smart Spender', earned: false },
  { name: 'Investor Jr.', earned: false },
];

const lessonContent: Record<string, string[]> = {
  '1': [
    'Money is a medium of exchange that people use to trade goods and services. Throughout history, people have used everything from shells and beads to gold coins as money. Today, most money exists digitally in bank accounts.',
    'Understanding money means understanding its three core functions: it serves as a medium of exchange, a unit of account, and a store of value. When you earn money, you can save it for later or spend it on things you need.',
    'Learning to manage money well is one of the most important life skills you can develop. The earlier you start, the more confident and prepared you will be for your financial future.',
  ],
  '2': [
    'Saving money means setting aside a portion of what you earn for future use. A good rule of thumb is the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.',
    'One of the most powerful concepts in saving is compound interest. When you save money in a bank account that earns interest, you earn interest not just on your original deposit, but also on the interest that has already been added.',
    'Setting specific savings goals can help you stay motivated. Whether it is an emergency fund, a new gadget, or college tuition, having a clear target makes it easier to stick to your savings plan.',
  ],
  '3': [
    'Understanding the difference between needs and wants is crucial for making smart spending decisions. Needs are things you must have to survive and function, like food, shelter, and basic clothing. Wants are things that are nice to have but not essential.',
    'Before making a purchase, try the 24-hour rule: wait a full day before buying something you want but do not need. This helps you avoid impulse purchases and ensures you are spending money on things that truly matter to you.',
    'Creating a simple budget that separates needs from wants can help you see where your money goes each month. Track your spending for a week and categorize each purchase. You might be surprised by how much goes to wants versus needs.',
  ],
  '4': [
    'Investing means putting your money to work so it can grow over time. Unlike saving, which keeps your money safe with small returns, investing has the potential for higher returns but comes with some risk.',
    'There are many ways to invest: stocks let you own a piece of a company, bonds are like loans you make to governments or companies, and index funds let you invest in many companies at once. Diversifying your investments helps reduce risk.',
    'The key to successful investing is starting early and being patient. Thanks to compound growth, even small amounts invested regularly can grow into significant sums over many years. Time in the market is more important than timing the market.',
  ],
  '5': [
    'There are many ways to earn money, from traditional jobs to entrepreneurial ventures. Understanding the different ways people earn income can help you make smart career decisions and find opportunities that match your skills and interests.',
    'Active income is money you earn by trading your time for pay, like a salary or hourly wage. Passive income is money that comes in with little ongoing effort, like rental income or dividends from investments. Building multiple income streams provides financial security.',
    'Developing marketable skills is one of the best investments you can make. Whether it is coding, writing, design, or financial literacy, skills that others value will always be in demand and can open doors to higher-paying opportunities.',
  ],
};

export default function LearnPage() {
  const [modules, setModules] = useState(initialModules);
  const [badges, setBadges] = useState(initialBadges);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  const completed = modules.filter((m) => m.completed).length;

  const handleCompleteModule = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, completed: true } : m))
    );

    if (moduleId === '3') {
      setBadges((prev) =>
        prev.map((b) => (b.name === 'Smart Spender' ? { ...b, earned: true } : b))
      );
    }
    if (moduleId === '4') {
      setBadges((prev) =>
        prev.map((b) => (b.name === 'Investor Jr.' ? { ...b, earned: true } : b))
      );
    }

    setActiveModuleId(null);
  };

  const activeModule = activeModuleId ? modules.find((m) => m.id === activeModuleId) : null;

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Learn</h1>
      </div>

      <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-text-secondary">Your Progress</p>
          <span className="text-sm font-medium text-green">{completed}/{modules.length} completed</span>
        </div>
        <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
          <div className="h-full bg-green rounded-full transition-all" style={{ width: `${(completed / modules.length) * 100}%` }} />
        </div>
      </div>

      {activeModule ? (
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-6 mb-8">
          <button
            onClick={() => setActiveModuleId(null)}
            className="flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors mb-4"
          >
            <ArrowLeft size={16} /> Back to Modules
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-md bg-green-dim text-green flex items-center justify-center">
              {(() => { const Icon = activeModule.icon; return <Icon size={18} />; })()}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{activeModule.title}</h2>
              <p className="text-xs text-text-muted">{activeModule.category} &middot; {activeModule.duration}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 mb-6">
            {(lessonContent[activeModule.id] || []).map((paragraph, i) => (
              <p key={i} className="text-sm text-text-secondary leading-relaxed">{paragraph}</p>
            ))}
          </div>
          <button
            onClick={() => handleCompleteModule(activeModule.id)}
            className="w-full bg-green text-black font-semibold py-3 rounded-md hover:opacity-90 transition-opacity"
          >
            Complete Module
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mb-8">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => !mod.completed && setActiveModuleId(mod.id)}
                className={`bg-bg-card border border-border rounded-lg p-4 flex items-center gap-3 transition-colors ${mod.completed ? 'cursor-default' : 'hover:border-border-hover cursor-pointer'}`}
              >
                <div className={`w-10 h-10 rounded-md flex items-center justify-center ${mod.completed ? 'bg-green-dim text-green' : 'bg-bg-elevated text-text-muted'}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{mod.title}</p>
                  <p className="text-xs text-text-muted">{mod.category} &middot; {mod.duration}</p>
                </div>
                {mod.completed ? (
                  <CheckCircle2 size={18} className="text-green" />
                ) : (
                  <span className="text-xs bg-bg-elevated text-text-muted px-2.5 py-1 rounded-full">Start</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <h3 className="font-semibold mb-3">Badges</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {badges.map((badge) => (
          <div key={badge.name} className={`p-4 rounded-lg border text-center ${badge.earned ? 'bg-green-dim/30 border-green/20' : 'bg-bg-card border-border opacity-50'}`}>
            {badge.earned ? (
              <CheckCircle2 size={24} className="text-green mx-auto mb-2" />
            ) : (
              <Lock size={24} className="text-text-muted mx-auto mb-2" />
            )}
            <p className="text-xs font-medium">{badge.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
