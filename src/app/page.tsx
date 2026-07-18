"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight, Sparkles, Star, Github, Trophy, BookOpen,
  Zap, Globe, Shield, Code2, Monitor, Search, Megaphone,
  LayoutGrid, Layers, Users, Bot, TrendingUp, Send, RefreshCw,
} from "lucide-react";

const AGENTS = [
  { icon: Search, name: "Iris", role: "Deep Researcher", desc: "通过深度市场调研发现真实需求和细分市场，将信号转化为可行的商机。" },
  { icon: Layers, name: "Bob", role: "Architect", desc: "设计系统蓝图，选择正确的架构，确保你的应用可扩展且可靠。" },
  { icon: Megaphone, name: "Adrian", role: "Ads Specialist", desc: "自动运行 Google Ads。广告专家管理广告创建、追踪和优化，让你以更少精力实现规模化增长。" },
  { icon: LayoutGrid, name: "Emma", role: "Product Manager", desc: "将想法转化为清晰的产品规格和范围，确保构建过程保持简洁和可用。" },
  { icon: Bot, name: "Mike", role: "Team Leader", desc: "端到端执行计划，协调所有 Agent，及时请求你的审批，让你快速推进的同时保持掌控。" },
  { icon: Globe, name: "Sarah", role: "SEO Specialist", desc: "快速上线 SEO 页面并自动优化，以更低的成本快速获取自然流量。" },
  { icon: Code2, name: "Alex", role: "Engineer", desc: "构建可投产的全栈应用，连接前端、后端、集成和部署。" },
  { icon: TrendingUp, name: "David", role: "Data Analyst", desc: "分析海量数据，发现增长机会，提供清晰洞察，让你做出更明智的数据驱动决策。" },
];

const FEATURES = [
  { icon: Zap, title: "几分钟内上线，而非数周", desc: "告诉 AI 你的想法，几分钟内就能看到可用应用。通过与 AI 对话获得完整的功能页面、流程和特性。" },
  { icon: Shield, title: "真实产品，而非演示", desc: "构建可发布、可增长、可扩展的可用产品。内置用户登录、数据存储、Stripe 支付等一切所需功能。" },
  { icon: LayoutGrid, title: "商业工具包，一站式", desc: "在一个平台完成全流程。进行市场调研、构建全栈应用、部署、优化 SEO、添加集成并追踪结果。AI 自动化繁琐工作，让你专注最重要的事。" },
  { icon: TrendingUp, title: "获得付费用户和收入", desc: "将想法变成人们愿意付费的产品。全栈商业能力覆盖发布、托管和日常运营，让你更快获得收入。" },
  { icon: Github, title: "始终保持完全掌控", desc: "随时导出代码并同步到 GitHub。随着业务增长，保持对项目的完全控制。" },
];

const TOOLS = [
  { icon: Monitor, title: "Visual Editor", desc: "将你的精确设计变为现实。可视化编辑器快速调整布局和组件。" },
  { icon: Globe, title: "Atoms Cloud", desc: "为你的应用提供全栈后端，包括用户登录、数据库、集成和可扩展托管。" },
  { icon: Zap, title: "Race Mode", desc: "跨多个模型运行提示词，即时获得最佳版本。" },
  { icon: Code2, title: "Instant AI Integrations", desc: "为你的产品添加强大的 AI 能力，支持 Gemini 和 GPT 等模型——无需 API Key。" },
  { icon: Search, title: "SEO Agent", desc: "自动让你的网站对搜索引擎友好，让 Google 抓取、索引和排名能为你带来真实客户的页面。" },
  { icon: Megaphone, title: "Ads Specialist", desc: "以更少的手动工作实现规模化增长。广告专家处理广告创建、追踪和优化。" },
];

const CLIENTS = ["Amazon", "Walmart", "eBay", "Samsung", "Lenovo", "Microsoft", "Maersk", "Orange", "Mercado Libre", "Deutsche Bank", "NVIDIA"];

const PRICING_PLANS = [
  { name: "Starter", price: "免费", period: "", desc: "适合初次体验", features: ["1 个项目", "4 个 AI Agent", "基础分析", "社区支持"], cta: "免费开始", href: "/register", highlighted: false },
  { name: "Pro", price: "¥99", period: "/月", desc: "适合独立开发者", features: ["无限项目", "8 个 AI Agent", "高级分析", "优先支持", "代码导出", "SEO 优化"], cta: "升级 Pro", href: "/register", highlighted: true },
  { name: "Team", price: "¥299", period: "/月", desc: "适合团队协作", features: ["Pro 全部功能", "团队协作", "无限 API 调用", "专属客服", "自定义 Agent", "SSO 登录"], cta: "联系销售", href: "/register", highlighted: false },
];

export default function LandingPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!prompt.trim() || creating) return;
    setCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: prompt.slice(0, 30) + (prompt.length > 30 ? "..." : ""),
          idea: prompt,
        }),
      });
      const data = await res.json();
      if (res.ok) router.push(`/project/${data.project.id}`);
    } catch { /* ignore */ } finally {
      setCreating(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* ====== Nav ====== */}
      <nav className="fixed top-0 left-0 right-0 z-50 nav-glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">AI Team Studio</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm">登录</Link>
            <Link href="/register" className="btn-primary text-sm">免费注册</Link>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        {/* ====== Hero ====== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/50 via-white to-white">
          <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
            <div className="badge-primary mb-6 animate-fade-in-down">
              <Sparkles className="w-3.5 h-3.5" />
              多智能体 AI 协作平台
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-hero text-slate-900 mb-5 animate-fade-in-up max-w-3xl mx-auto" style={{ lineHeight: 1.1, fontWeight: 800 }}>
              你的 <span className="text-gradient">AI 团队</span>，帮助你{""}
              更快构建并赢得客户
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8 animate-fade-in-up leading-relaxed">
              一个完整的 AI 团队帮助你以更低成本更快上线。你来做决策，
              AI Agent 负责调研、规划、构建、测试和增长。
            </p>

            {/* Hero 输入框 */}
            <div className="max-w-xl mx-auto animate-fade-in-up">
              <div className="relative flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-5 py-3.5 shadow-card-lg focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
                  placeholder="描述你的想法，AI Assistant 会帮你快速构建原型..."
                  className="flex-1 bg-transparent outline-none text-base text-slate-700 placeholder:text-slate-400"
                />
                <button
                  onClick={handleCreate}
                  disabled={!prompt.trim() || creating}
                  className="p-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  {creating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4">
                <Link href="/register" className="btn-primary text-sm">
                  免费注册 <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
                <Link href="/login" className="btn-secondary text-sm">
                  已有账号？登录
                </Link>
              </div>
            </div>
          </div>

          {/* 背景装饰 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* ====== Template Showcase ====== */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: "Investment Portfolio Monitor", desc: "投资组合监控与分析", color: "from-blue-500 to-cyan-400" },
              { title: "AI-Powered Manga App", desc: "AI 漫画生成与创作平台", color: "from-purple-500 to-pink-400" },
              { title: "Fitness App", desc: "个性化健身训练应用", color: "from-emerald-500 to-teal-400" },
            ].map((item) => (
              <div key={item.title} className="card-hover p-1 overflow-hidden group cursor-pointer">
                <div className={`h-44 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-3`}>
                  <span className="text-white/90 font-semibold text-lg">{item.title}</span>
                </div>
                <div className="px-4 pb-4">
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ====== Trusted By ====== */}
        <section className="border-y border-slate-100 py-14 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-sm text-slate-400 mb-8 font-medium">受到全球客户的信赖</p>
            <div className="relative overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
              <div className="flex items-center gap-16 animate-scroll-x whitespace-nowrap">
                {[...CLIENTS, ...CLIENTS].map((name, i) => (
                  <span key={`${name}-${i}`} className="text-slate-300 font-bold text-xl tracking-wide">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ====== Recognition ====== */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Github, label: "GitHub", value: "10K+ Stars", desc: "开源社区认可" },
              { icon: Trophy, label: "Product Hunt", value: "#1 of the Week", desc: "产品社区推荐" },
              { icon: BookOpen, label: "学术论文", value: "~30 篇", desc: "ICLR/NeurIPS/ACL" },
            ].map((item) => (
              <div key={item.label} className="card-hover p-6 text-center">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-brand-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                <p className="text-sm font-medium text-slate-700 mt-1">{item.label}</p>
                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ====== Agent Team ====== */}
        <section className="bg-surface-secondary py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="badge-primary mb-4">AI 团队</div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                你的 <span className="text-gradient">AI 团队</span>，更快构建
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
                一个完整的 AI 团队帮助你以更低成本更快上线。你来做决策，Agent 处理调研、规划、构建、测试和增长。
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {AGENTS.map((agent, idx) => (
                <div key={idx} className="card-hover p-5 group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center group-hover:bg-brand-100 transition-colors shrink-0">
                      <agent.icon className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{agent.name}</p>
                      <p className="text-xs text-brand-600 font-medium">{agent.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{agent.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== Features ====== */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                调研、设计、编码、增长
                <br />一站式完成
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((feature, idx) => (
                <div key={idx} className="card-hover p-6">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== Everything You Need ====== */}
        <section className="bg-surface-secondary py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                构建、上线、创收所需的一切
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                一体化平台，覆盖从开发到增长的全流程
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOOLS.map((tool, idx) => (
                <div key={idx} className="card-hover p-5 group">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-brand-100 transition-colors">
                    <tool.icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1.5">{tool.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">{tool.desc}</p>
                  <Link href="/login" className="text-xs text-brand-600 font-medium hover:text-brand-700 transition-colors flex items-center gap-1">
                    立即体验 <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== Pricing ====== */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                定价方案
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                免费开始，灵活扩展
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRICING_PLANS.map((plan, idx) => (
                <div
                  key={idx}
                  className={`card-hover p-6 relative ${plan.highlighted ? "ring-2 ring-brand-500 shadow-card-lg" : ""}`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white px-3 py-0.5 rounded-full text-xs font-semibold">
                      最受欢迎
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  <div className="mt-3 mb-1">
                    <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
                    {plan.period && <span className="text-slate-400 text-sm">{plan.period}</span>}
                  </div>
                  <p className="text-sm text-slate-500 mb-5">{plan.desc}</p>
                  <Link
                    href={plan.href}
                    className={plan.highlighted
                      ? "btn-primary w-full justify-center flex text-sm"
                      : "btn-secondary w-full justify-center flex text-sm"}
                  >
                    {plan.cta}
                  </Link>
                  <ul className="mt-5 space-y-2.5">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 bg-brand-500 rounded-full shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== CTA ====== */}
        <section className="py-20 bg-surface-secondary">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-12 md:p-16 text-white">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
                将想法变成
                <span className="text-yellow-300">产品</span>并销售
              </h2>
              <p className="text-brand-100 mb-8 text-sm leading-relaxed">
                无需编码，无需手动配置。只需描述你想构建什么。
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-white text-brand-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-brand-50 transition-all shadow-lg"
              >
                免费开始 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ====== Footer ====== */}
        <footer className="border-t border-slate-100 py-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-slate-900">AI Team Studio</span>
            </div>
            <p className="text-sm text-slate-400">
              Demo 项目 — 基于 Qwen 3.7-Plus 多智能体协作
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link href="/login" className="hover:text-slate-600 transition-colors">登录</Link>
              <Link href="/register" className="hover:text-slate-600 transition-colors">注册</Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}