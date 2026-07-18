"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Plus,
  LogOut,
  Trash2,
  ArrowRight,
  Send,
  MessageSquare,
  LayoutGrid,
  Bot,
  Code2,
  Search,
  PanelRightClose,
  PanelRightOpen,
  RefreshCw,
  Zap,
  Layers,
  Home,
  BarChart3,
  Settings,
  Star,
  X,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  idea: string;
  status: string;
  updatedAt: string;
  _count: { messages: number };
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  draft: { label: "草稿", color: "bg-slate-100 text-slate-600" },
  researching: { label: "调研中", color: "bg-blue-100 text-blue-600" },
  pming: { label: "规划中", color: "bg-purple-100 text-purple-600" },
  architecting: { label: "架构中", color: "bg-amber-100 text-amber-600" },
  building: { label: "构建中", color: "bg-emerald-100 text-emerald-600" },
  completed: { label: "已完成", color: "bg-green-100 text-green-600" },
};

const AGENT_AVATARS = [
  { name: "Iris", color: "bg-blue-500", icon: "🔍" },
  { name: "Emma", color: "bg-purple-500", icon: "📋" },
  { name: "Bob", color: "bg-amber-500", icon: "🏗️" },
  { name: "Alex", color: "bg-emerald-500", icon: "💻" },
];

const QUICK_STARTS = [
  "AI 健身教练 App，个性化训练计划",
  "SaaS 数据分析 Dashboard，实时图表",
  "在线课程平台，视频播放+证书",
  "电商比价工具，多平台价格追踪",
];

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [creating, setCreating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.status === 401) { router.push("/login"); return; }
      const data = await res.json();
      setProjects(data.projects);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!inputValue.trim() || creating) return;
    setCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inputValue.slice(0, 30) + (inputValue.length > 30 ? "..." : ""),
          idea: inputValue,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setInputValue("");
        router.push(`/project/${data.project.id}`);
      }
    } catch { /* ignore */ } finally {
      setCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreate();
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const TABS = [
    { id: "home", label: "首页", icon: Home },
    { id: "templates", label: "模板", icon: LayoutGrid },
    { id: "analytics", label: "分析", icon: BarChart3 },
    { id: "settings", label: "设置", icon: Settings },
  ];

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* ====== 顶部促销横幅 ====== */}
      {bannerVisible && (
        <div className="bg-brand-900 text-white shrink-0">
          <div className="max-w-6xl mx-auto px-6 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span className="text-sm font-medium">
                升级到 Pro 版，解锁无限项目和高级分析能力
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-white text-brand-700 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-brand-50 transition-all">
                升级 Pro
              </button>
              <button
                onClick={() => setBannerVisible(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== 主体内容区 ====== */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧边栏 */}
        <aside
          className={`${
            sidebarOpen ? "w-56" : "w-0"
          } transition-all duration-300 border-r border-slate-200 flex flex-col bg-slate-50/60 overflow-hidden shrink-0`}
        >
          {/* Logo */}
          <div className="px-4 py-4 border-b border-slate-200 flex items-center gap-2.5">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm text-slate-900 whitespace-nowrap">
              AI Team Studio
            </span>
          </div>

          {/* 新建项目 */}
          <div className="px-3 py-3">
            <button
              onClick={() => inputRef.current?.focus()}
              className="w-full flex items-center gap-2 px-3 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-all text-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="whitespace-nowrap">新建项目</span>
            </button>
          </div>

          {/* 项目列表 */}
          <div className="flex-1 overflow-y-auto px-3">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                项目
              </span>
              <span className="text-[11px] text-slate-400">{projects.length}</span>
            </div>

            {loading ? (
              <div className="space-y-1.5 px-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <p className="text-xs text-slate-400 px-2 py-4 text-center">
                暂无项目
              </p>
            ) : (
              <div className="space-y-0.5">
                {projects.map((project) => {
                  const status = STATUS_MAP[project.status] || STATUS_MAP.draft;
                  return (
                    <div
                      key={project.id}
                      className="group flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all hover:bg-white/60"
                      onClick={() => router.push(`/project/${project.id}`)}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-700 truncate">
                          {project.name}
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                        className="text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 底部 */}
          <div className="px-3 py-3 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-700 hover:bg-white/60 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">退出登录</span>
            </button>
          </div>
        </aside>

        {/* 主内容区 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 顶部栏 */}
          <header className="h-12 border-b border-slate-200 flex items-center justify-between px-4 shrink-0 bg-white">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            >
              {sidebarOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400">Qwen 3.7-Plus</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            </div>
          </header>

          {/* 滚动内容区 */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 py-12">
              {/* ====== 居中欢迎卡片 ====== */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-10 mb-8">
                {/* Agent 头像组 */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex -space-x-2">
                    {AGENT_AVATARS.map((agent, idx) => (
                      <div
                        key={agent.name}
                        className={`w-12 h-12 ${agent.color} rounded-full border-[3px] border-white flex items-center justify-center text-lg shadow-sm`}
                        style={{ zIndex: AGENT_AVATARS.length - idx }}
                        title={agent.name}
                      >
                        {agent.icon}
                      </div>
                    ))}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-slate-700">AI 团队</p>
                    <p className="text-xs text-slate-400">4 Agents 已就绪</p>
                  </div>
                </div>

                {/* 欢迎文案 */}
                <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
                  今天想构建什么？
                </h1>
                <p className="text-slate-500 text-sm text-center mb-8">
                  描述你的产品想法，AI 团队会从调研到代码方案，一步步帮你落地
                </p>

                {/* 输入区 */}
                <div className="relative flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="描述你的产品想法，AI 团队将帮你分析..."
                    rows={2}
                    className="flex-1 bg-transparent resize-none outline-none text-sm text-slate-700 placeholder:text-slate-400 py-1 max-h-32"
                    style={{ minHeight: "44px" }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height = Math.min(target.scrollHeight, 128) + "px";
                    }}
                  />
                  <button
                    onClick={handleCreate}
                    disabled={!inputValue.trim() || creating}
                    className="p-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 self-end"
                  >
                    {creating ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-center text-[10px] text-slate-400 mt-3">
                  Enter 发送 · Shift+Enter 换行
                </p>
              </div>

              {/* ====== 快速开始 ====== */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    快速开始
                  </h3>
                  <button className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                    查看全部 →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {QUICK_STARTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputValue(prompt);
                        inputRef.current?.focus();
                      }}
                      className="text-left px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-brand-300 hover:bg-brand-50/50 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 bg-white rounded-lg border border-slate-200 flex items-center justify-center shrink-0 text-xs font-semibold text-slate-400 group-hover:border-brand-200 group-hover:text-brand-500 transition-all">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-slate-600 group-hover:text-slate-800 flex-1 leading-relaxed">
                          {prompt}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ====== 最近项目 ====== */}
              {projects.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-700">最近项目</h3>
                    <Link href="/dashboard" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                      查看全部 →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {projects.slice(0, 4).map((project) => {
                      const status = STATUS_MAP[project.status] || STATUS_MAP.draft;
                      return (
                        <Link
                          key={project.id}
                          href={`/project/${project.id}`}
                          className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all"
                        >
                          <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center shrink-0">
                            <MessageSquare className="w-4 h-4 text-brand-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 truncate">
                              {project.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${status.color}`}>
                                {status.label}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {project._count.messages} 步
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ====== 底部 Tab 导航栏 ====== */}
      <div className="border-t border-slate-200 bg-white shrink-0">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                    isActive
                      ? "text-brand-600 border-brand-600"
                      : "text-slate-400 border-transparent hover:text-slate-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <Link
            href="/dashboard"
            className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
          >
            查看全部 <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}