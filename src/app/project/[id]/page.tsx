"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  Globe,
  Layers,
  Users,
  Zap,
  Send,
  RefreshCw,
  CheckCircle2,
  Loader2,
  Plus,
  LogOut,
  Trash2,
  MessageSquare,
  LayoutGrid,
  Code2,
  Search,
  PanelRightClose,
  PanelRightOpen,
  Monitor,
  Bot,
  ChevronRight,
  FileText,
  Shield,
  Star,
  X,
  Home,
  BarChart3,
  Settings,
} from "lucide-react";

interface AgentMessage {
  id: string;
  agentRole: string;
  agentName: string;
  content: string;
  stepOrder: number;
}

interface Project {
  id: string;
  name: string;
  idea: string;
  status: string;
  messages: AgentMessage[];
}

interface SidebarProject {
  id: string;
  name: string;
  status: string;
  _count: { messages: number };
}

const AGENT_ICONS: Record<string, React.ElementType> = {
  researcher: Search,
  pm: LayoutGrid,
  architect: Layers,
  engineer: Code2,
};

const AGENT_COLORS: Record<string, string> = {
  researcher: "bg-blue-50 text-blue-600 border-blue-200",
  pm: "bg-purple-50 text-purple-600 border-purple-200",
  architect: "bg-amber-50 text-amber-600 border-amber-200",
  engineer: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

const AGENT_LABELS: Record<string, string> = {
  researcher: "研究员",
  pm: "产品经理",
  architect: "架构师",
  engineer: "工程师",
};

const AGENT_NAMES: Record<string, string> = {
  researcher: "Iris",
  pm: "Emma",
  architect: "Bob",
  engineer: "Alex",
};

const AGENT_ORDER = ["researcher", "pm", "architect", "engineer"];

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  draft: { label: "草稿", color: "bg-slate-100 text-slate-600" },
  researching: { label: "调研中", color: "bg-blue-100 text-blue-600" },
  pming: { label: "规划中", color: "bg-purple-100 text-purple-600" },
  architecting: { label: "架构中", color: "bg-amber-100 text-amber-600" },
  building: { label: "构建中", color: "bg-emerald-100 text-emerald-600" },
  completed: { label: "已完成", color: "bg-green-100 text-green-600" },
};

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<SidebarProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningAgent, setRunningAgent] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const TABS = [
    { id: "home", label: "首页", icon: Home },
    { id: "templates", label: "模板", icon: LayoutGrid },
    { id: "analytics", label: "分析", icon: BarChart3 },
    { id: "settings", label: "设置", icon: Settings },
  ];

  const fetchProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.status === 401) { router.push("/login"); return; }
      if (res.status === 404) { router.push("/dashboard"); return; }
      const data = await res.json();
      setProject(data.project);
    } finally {
      setLoading(false);
    }
  }, [projectId, router]);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchProject(); fetchProjects(); }, [fetchProject, fetchProjects]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [project?.messages, streamingContent]);

  const getNextAgentIndex = () => project ? project.messages.length : 0;

  const runAgent = async () => {
    if (!project) return;
    const nextIndex = getNextAgentIndex();
    if (nextIndex >= AGENT_ORDER.length) return;

    const agentRole = AGENT_ORDER[nextIndex];
    setRunningAgent(agentRole);
    setStreamingContent("");
    setError("");

    try {
      const res = await fetch(`/api/projects/${projectId}/run-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentIndex: nextIndex }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "AI 调用失败");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("无法读取响应流");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            if (data.delta) setStreamingContent((prev) => prev + data.delta);
            if (data.done) {
              setStreamingContent("");
              setRunningAgent(null);
              await fetchProject();
              await fetchProjects();
            }
            if (data.error) throw new Error(data.error);
          }
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "未知错误");
      setRunningAgent(null);
      setStreamingContent("");
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (id === projectId) router.push("/dashboard");
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const allAgentsDone = project && project.messages.length >= AGENT_ORDER.length;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!project) return null;

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
      {/* ====== 左侧边栏（与 Dashboard 一致） ====== */}
      <aside
        className={`${
          sidebarOpen ? "w-60" : "w-0"
        } transition-all duration-300 border-r border-slate-200 flex flex-col bg-slate-50/50 overflow-hidden shrink-0`}
      >
        <Link href="/dashboard" className="px-4 py-4 border-b border-slate-200 flex items-center gap-2.5 hover:bg-white/50 transition-colors">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm text-slate-900 whitespace-nowrap">AI Team Studio</span>
        </Link>

        <div className="px-3 py-3">
          <Link
            href="/dashboard"
            className="w-full flex items-center gap-2 px-3 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="whitespace-nowrap">新建项目</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">项目</span>
            <span className="text-[11px] text-slate-400">{projects.length}</span>
          </div>

          <div className="space-y-0.5">
            {projects.map((proj) => {
              const status = STATUS_MAP[proj.status] || STATUS_MAP.draft;
              const isActive = proj.id === projectId;
              return (
                <div
                  key={proj.id}
                  className={`group flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all ${
                    isActive ? "bg-white shadow-sm border border-slate-200" : "hover:bg-white/60"
                  }`}
                  onClick={() => {
                    if (proj.id !== projectId) router.push(`/project/${proj.id}`);
                  }}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{proj.name}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(proj.id); }}
                    className="text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

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

      {/* ====== 中间聊天区域 ====== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部栏 */}
        <header className="h-12 border-b border-slate-200 flex items-center justify-between px-4 shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            >
              {sidebarOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
            </button>
            <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
            <span className="text-xs font-medium text-slate-700 truncate max-w-[200px]">{project.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewOpen(!previewOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400">Qwen 3.7-Plus</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            </div>
          </div>
        </header>

        {/* Agent 进度条 */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-1 max-w-3xl mx-auto">
            {AGENT_ORDER.map((role, idx) => {
              const Icon = AGENT_ICONS[role];
              const isDone = project.messages.some((m) => m.agentRole === role);
              const isRunning = runningAgent === role;
              const isPending = !isDone && !isRunning;

              return (
                <div key={role} className="flex items-center gap-1 flex-1">
                  <div className="flex flex-col items-center gap-0.5 flex-1">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                        isDone
                          ? "bg-green-50 border-green-300"
                          : isRunning
                          ? "bg-brand-50 border-brand-400 animate-pulse"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      ) : isRunning ? (
                        <Loader2 className="w-3.5 h-3.5 text-brand-500 animate-spin" />
                      ) : (
                        <Icon className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                    <span className={`text-[10px] font-medium ${isPending ? "text-slate-300" : "text-slate-500"}`}>
                      {AGENT_NAMES[role]}
                    </span>
                  </div>
                  {idx < AGENT_ORDER.length - 1 && (
                    <div className={`w-6 h-px -mt-3 ${isDone ? "bg-green-300" : "bg-slate-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-5">
            {/* 用户想法 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">你</span>
              </div>
              <div className="bg-slate-700 text-white rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%]">
                <p className="text-sm whitespace-pre-wrap">{project.idea}</p>
              </div>
            </div>

            {/* Agent 消息 */}
            {project.messages.map((msg) => {
              const Icon = AGENT_ICONS[msg.agentRole] || Search;
              const colorClasses = AGENT_COLORS[msg.agentRole] || AGENT_COLORS.researcher;
              return (
                <div key={msg.id} className="flex gap-3 animate-slide-up">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${colorClasses}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-slate-500">{msg.agentName}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {AGENT_LABELS[msg.agentRole]}
                      </span>
                    </div>
                    <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 流式输出 */}
            {runningAgent && (
              <div className="flex gap-3 animate-slide-up">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${AGENT_COLORS[runningAgent] || AGENT_COLORS.researcher}`}>
                  {(() => { const Icon = AGENT_ICONS[runningAgent] || Search; return <Icon className="w-4 h-4" />; })()}
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-slate-500">{AGENT_NAMES[runningAgent]}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {AGENT_LABELS[runningAgent]}
                    </span>
                    <Loader2 className="w-3 h-3 text-brand-500 animate-spin" />
                  </div>
                  <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {streamingContent}
                    <span className="cursor-blink" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 底部操作区 */}
        <div className="border-t border-slate-200 bg-white px-4 py-3 shrink-0">
          <div className="max-w-3xl mx-auto flex items-center justify-center gap-3">
            {error && (
              <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
                <span>{error}</span>
                <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">x</button>
              </div>
            )}

            {!allAgentsDone && !runningAgent && (
              <button
                onClick={runAgent}
                className="bg-brand-600 text-white px-6 py-2 rounded-xl font-medium text-sm hover:bg-brand-700 transition-all hover:shadow-lg hover:shadow-brand-200 flex items-center gap-2"
              >
                {project.messages.length === 0 ? (
                  <><Send className="w-4 h-4" />启动 AI 团队分析</>
                ) : (
                  <><ArrowLeft className="w-4 h-4" />继续下一步</>
                )}
              </button>
            )}

            {allAgentsDone && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-green-600 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-medium">所有 Agent 已完成</span>
                </div>
                <button
                  onClick={async () => {
                    for (const msg of project.messages) {
                      await fetch(`/api/projects/${projectId}/messages/${msg.id}`, { method: "DELETE" });
                    }
                    await fetchProject();
                  }}
                  className="bg-white text-slate-600 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 hover:border-slate-300 transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />重新分析
                </button>
                <Link
                  href="/dashboard"
                  className="bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-brand-700 transition-all"
                >
                  返回 Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ====== 右侧预览面板 ====== */}
      <aside
        className={`${
          previewOpen ? "w-72" : "w-0"
        } transition-all duration-300 border-l border-slate-200 bg-slate-50/30 overflow-hidden shrink-0`}
      >
        <div className="h-full flex flex-col">
          <div className="px-4 py-3 border-b border-slate-200">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">预览</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {project.messages.length === 0 && !runningAgent ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8 text-brand-300" />
                </div>
                <h4 className="text-sm font-semibold text-slate-700 mb-1">等待 AI 分析</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  点击"启动 AI 团队分析"开始协作
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">分析摘要</h4>
                {project.messages.map((msg) => {
                  const Icon = AGENT_ICONS[msg.agentRole] || Search;
                  const colorClasses = AGENT_COLORS[msg.agentRole] || AGENT_COLORS.researcher;
                  return (
                    <div key={msg.id} className="bg-white rounded-xl border border-slate-100 p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center ${colorClasses}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-700">{msg.agentName}</p>
                          <p className="text-[10px] text-slate-400">{AGENT_LABELS[msg.agentRole]}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-4">
                        {msg.content.slice(0, 150)}...
                      </p>
                    </div>
                  );
                })}
                {runningAgent && (
                  <div className="bg-brand-50/50 rounded-xl border border-brand-100 p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 text-brand-500 animate-spin" />
                      <span className="text-xs text-brand-600 font-medium">
                        {AGENT_NAMES[runningAgent]} 正在分析...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-slate-200">
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <CheckCircle2 className="w-3 h-3 text-green-400" />
              {project.messages.length}/{AGENT_ORDER.length} Agent 已完成
            </div>
          </div>
        </div>
      </aside>
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
            查看全部 <ArrowLeft className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}