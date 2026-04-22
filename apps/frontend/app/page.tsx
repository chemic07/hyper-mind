"use client";

import { useState, useEffect } from "react";
import AppBar from "@/components/Appbar";
import { PromptBox } from "@/components/Prompt";
import TemplateButtons from "@/components/TemplateButtons";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTemplateClick = (template: string) => {
    console.log("Template clicked:", template);
  };

  // Mouse movement detection to open sidebar
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX < 20) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#0f1624] to-[#0a0a0a] flex flex-col">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <AppBar />

        {/* Hero Section */}
        <div className="relative flex-1 flex items-center justify-center">
          {/* Curved Earth Background Effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-1/2">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-60 rounded-t-[100%] border-t-4 border-blue-400/30"></div>
            </div>
          </div>

          <div className="relative max-w-5xl mx-auto px-4 text-center">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a2333] rounded-full border border-[#1e3a8a]/30">
                <span className="text-[#60a5fa] text-sm">⚡</span>
                <span className="text-gray-400 text-sm">
                  Introducing Hyper Mind
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="text-white">What will you </span>
              <span className="text-[#60a5fa] italic">build</span>
              <span className="text-white"> today?</span>
            </h1>

            <p className="text-xl text-gray-400 mb-12">
              Create stunning apps & websites by chatting with AI.
            </p>

            {/* Prompt Box */}
            <div className="mb-8">
              <PromptBox />
            </div>

            {/* Import Options */}
            <TemplateButtons onTemplateClick={handleTemplateClick} />
          </div>
        </div>
      </div>
    </div>
  );
}
