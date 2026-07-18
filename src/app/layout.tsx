import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Team Studio — 多智能体协作，更快构建产品",
  description: "把你的想法交给 AI 团队，从调研到构建一气呵成。研究员、产品经理、架构师、工程师协作，一站式完成产品落地。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="min-h-screen bg-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}