"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, Zap, Shield, TrendingUp, Globe, Users, CheckCircle2 } from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "几分钟内上线，而非数周", desc: "只需描述你想构建什么，AI 团队在几分钟内帮你完成。" },
  { icon: Shield, title: "真实产品，而非演示", desc: "内置用户登录、数据存储、支付等一切所需功能。" },
  { icon: TrendingUp, title: "自动化你的运营", desc: "AI 自动化市场调研、部署、SEO 和效果追踪。" },
  { icon: Globe, title: "获得付费用户和收入", desc: "全栈商业能力覆盖发布、托管和日常运营。" },
  { icon: Users, title: "始终保持完全掌控", desc: "随时导出代码并同步到 GitHub，保持对项目的完全控制。" },
];

const CLIENTS = ["Amazon", "Walmart", "eBay", "Samsung", "Lenovo", "Microsoft", "Maersk"];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError(data.error || "登录失败");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ====== 左侧：产品特性 ====== */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-brand-50 via-white to-brand-50/50 flex-col relative overflow-hidden">
        <div className="flex-1 flex flex-col justify-center px-12 xl:px-16 py-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">AI Team Studio</span>
          </Link>

          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
            将想法变成
            <span className="text-gradient">产品</span>并销售
          </h2>
          <p className="text-slate-500 mb-10 leading-relaxed">
            无需编码，无需手动配置。只需描述你想构建什么，AI 团队帮你完成。
          </p>

          {/* Agent 头像组 */}
          <div className="flex items-center gap-2 mb-10">
            <div className="flex -space-x-2">
              {["🔍", "📋", "🏗️", "💻", "📊", "🤖"].map((emoji, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-white flex items-center justify-center text-base shadow-sm"
                  style={{ zIndex: 6 - i }}
                >
                  {emoji}
                </div>
              ))}
            </div>
            <span className="text-sm text-slate-600 font-medium ml-3">6 个 AI Agent 为你服务</span>
          </div>

          {/* 特性列表 */}
          <div className="space-y-4 mb-10">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <feature.icon className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{feature.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 客户 logo */}
          <div className="border-t border-slate-200 pt-8">
            <p className="text-xs text-slate-400 mb-4 font-medium">受到全球客户的信赖</p>
            <div className="flex items-center gap-4 flex-wrap">
              {CLIENTS.map((name) => (
                <span key={name} className="text-sm font-semibold text-slate-300">{name}</span>
              ))}
            </div>
          </div>
        </div>

        {/* 背景装饰 */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ====== 右侧：登录表单 ====== */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* 移动端 Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">AI Team Studio</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">登录或注册</h1>
            <p className="text-slate-500 text-sm">开始用 AI Team Studio 创建</p>
          </div>

          {/* Social Login */}
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all mb-4">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            使用 Google 账号登录
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-4 text-slate-400">或</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入密码"
                className="input"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-xl">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-sm py-2.5"
            >
              {loading ? "登录中..." : "登录"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            还没有账号？{" "}
            <Link href="/register" className="text-brand-600 font-medium hover:text-brand-700">
              免费注册 <ArrowRight className="w-3 h-3 inline" />
            </Link>
          </p>

          <p className="text-center text-xs text-slate-400 mt-8">
            继续即表示你同意我们的服务条款和隐私政策
          </p>
        </div>
      </div>
    </div>
  );
}