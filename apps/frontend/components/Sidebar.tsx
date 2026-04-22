"use client";

import { useEffect, useState } from "react";
import { Plus, Moon, Sun, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { BACKEND_URL } from "@/config";

interface Project {
  id: string;
  description: string | null;
  createdAt: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const { getToken, signOut } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const fetchProjects = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${BACKEND_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut();
  };

  const filteredProjects = projects.filter((project) =>
    project?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedProjects = filteredProjects.reduce(
    (acc, project) => {
      const date = new Date(project.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(project);
      return acc;
    },
    {} as Record<string, Project[]>
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-black border-r border-gray-800 z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4 text-white">
          {/* New Project Button */}
          <Button
            className="w-full bg-[#111111] hover:bg-[#1a1a1a] text-white border border-gray-700 rounded-lg mb-6 justify-start gap-2 transition-all"
            onClick={onClose}
          >
            <div className="w-5 h-5 border-2 border-[#60a5fa] rounded-full flex items-center justify-center">
              <Plus className="w-3 h-3 text-[#60a5fa]" />
            </div>
            Start a new Project
          </Button>

          {/* Your Projects Section */}
          <div className="mb-4">
            <h3 className="text-gray-300 text-sm font-medium mb-3">
              Your Projects
            </h3>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111111] border border-gray-700 rounded-lg h-10 pl-10 pr-4 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#60a5fa]"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Projects List */}
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
            {loading ? (
              <p className="text-gray-500 text-sm">Loading...</p>
            ) : Object.keys(groupedProjects).length === 0 ? (
              <p className="text-gray-500 text-sm">No projects yet</p>
            ) : (
              Object.entries(groupedProjects).map(([date, dateProjects]) => (
                <div key={date}>
                  <h4 className="text-gray-500 text-xs mb-2">{date}</h4>
                  <div className="space-y-2">
                    {dateProjects.map((project) => (
                      <button
                        key={project.id}
                        className="w-full text-left p-3 border border-gray-700 rounded-lg hover:bg-[#1a1a1a] transition-colors"
                      >
                        <p className="text-white text-sm truncate">
                          {project.description || "Untitled Project"}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <div className="w-5 h-5 border-2 border-gray-500 rounded-full flex items-center justify-center">
                {darkMode ? (
                  <Sun className="w-3 h-3 text-[#60a5fa]" />
                ) : (
                  <Moon className="w-3 h-3 text-[#60a5fa]" />
                )}
              </div>
              <span className="text-sm">Dark Mode</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors"
            >
              <div className="w-5 h-5 border-2 border-gray-500 rounded-full flex items-center justify-center">
                <LogOut className="w-3 h-3" />
              </div>
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
