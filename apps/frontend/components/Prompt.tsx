"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { BACKEND_URL } from "@/config";

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
    } catch (error) {
      console.error("❌ Error generating project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end w-full max-w-2xl mx-auto gap-3">
      {/* Input Box */}
      <Input
        placeholder="Create a chess application..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-20 text-lg px-4 rounded-xl border border-gray-300 focus-visible:ring-2 focus-visible:ring-black"
      />

      {/* Button aligned to right below input */}
      <Button
        onClick={handleGenerate}
        disabled={loading}
        className="h-10 w-10 rounded-md bg-black hover:bg-gray-800 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "..." : "➤"}
      </Button>
    </div>
  );
}
