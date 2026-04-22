"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { BACKEND_URL } from "@/config";
import { Plus } from "lucide-react";

export function PromptBox() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.post(
        `${BACKEND_URL}/project`,
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Server response:", response.data);
      setPrompt("");
    } catch (error) {
      console.error("❌ Error generating project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative bg-[#1a1a1a] rounded-2xl p-1 border border-[#2a2a2a]">
        <textarea
          placeholder="Let's build a prototype to validate my..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleGenerate();
            }
          }}
          className="w-full h-15 bg-transparent text-gray-300 placeholder:text-gray-600 px-6 py-4 resize-none focus:outline-none text-base"
        />
        <div className="flex items-center justify-between px-4 pb-4">
          <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors">
            <Plus className="w-5 h-5 text-gray-500" />
          </button>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-300 text-sm transition-colors">
              <span className="text-lg">🎯</span>
              Plan
            </button>
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="h-10 w-10 rounded-md bg-black hover:bg-[#3b82f6] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "..." : "➤"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
