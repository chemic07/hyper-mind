"use client";

import { Button } from "@/components/ui/button";

export default function TemplateButtons() {
  const templates = [
    "Build a chess app",
    "Create a todo app",
    "Create a docs app",
    "Create a base app",
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {templates.map((item) => (
        <Button
          key={item}
          variant="outline"
          className="rounded-full border-gray-300 hover:bg-gray-100 text-gray-700 px-5 py-2 transition"
        >
          {item}
        </Button>
      ))}
    </div>
  );
}
