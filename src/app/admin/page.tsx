"use client";

import React, { useState, useEffect, useCallback } from "react";
import { LetterRecord } from "@/types/admin";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import {
  Lock,
  Eye,
  EyeOff,
  Search,
  ExternalLink,
  Copy,
  Trash2,
  RefreshCw,
  LogOut,
  Download,
  Mail,
  Heart,
  Calendar,
  Sparkles,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [letters, setLetters] = useState<LetterRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [themeFilter, setThemeFilter] = useState<string>("all");

  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [letterToDelete, setLetterToDelete] = useState<LetterRecord | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
  }, []);

  const fetchLetters = useCallback(async (token: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/letters", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        setIsAuthenticated(false);
        sessionStorage.removeItem("love_admin_token");
        setAuthError("Session expired. Please enter password again.");
        return;
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.letters)) {
        setLetters(data.letters);
      }
    } catch (err) {
      console.error("Failed to load letters:", err);
      showToast("Error loading letters");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  // Check existing session token on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem("love_admin_token");
    if (savedToken) {
      setIsAuthenticated(true);
      fetchLetters(savedToken);
    }
  }, [fetchLetters]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!passwordInput.trim()) {
      setAuthError("Please enter the admin password");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        sessionStorage.setItem("love_admin_token", data.token);
        setIsAuthenticated(true);
        fetchLetters(data.token);
        showToast("Welcome to Admin Dashboard ❤️");
      } else {
        setAuthError(data.error || "Invalid password");
      }
    } catch {
      setAuthError("Failed to verify credentials");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("love_admin_token");
    setIsAuthenticated(false);
    setPasswordInput("");
    setLetters([]);
  };

  const handleDeleteLetter = async (record: LetterRecord) => {
    const token = sessionStorage.getItem("love_admin_token");
    if (!token) return;

    try {
      const res = await fetch(`/api/letters?id=${encodeURIComponent(record.id)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setLetters((prev) => prev.filter((item) => item.id !== record.id));
        setLetterToDelete(null);
        showToast("Letter record removed");
      } else {
        showToast("Failed to delete record");
      }
    } catch {
      showToast("Network error deleting record");
    }
  };

  const handleCopyLink = async (encodedId: string) => {
    const url = `${window.location.origin}/letter/${encodedId}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Letter link copied ❤️");
    } catch {
      showToast("Failed to copy link");
    }
  };

  const handleExportCSV = () => {
    if (letters.length === 0) {
      showToast("No letters to export");
      return;
    }

    const headers = ["ID", "Recipient", "Sender", "Title", "Theme", "Font", "Created At", "URL"];
    const rows = letters.map((l) => [
      `"${l.id}"`,
      `"${(l.recipient || "").replace(/"/g, '""')}"`,
      `"${(l.sender || "").replace(/"/g, '""')}"`,
      `"${(l.title || "").replace(/"/g, '""')}"`,
      `"${l.theme}"`,
      `"${l.font}"`,
      `"${l.createdAt}"`,
      `"${window.location.origin}/letter/${l.encodedId}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `love_letters_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV exported successfully");
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page to 1 on search or theme filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, themeFilter, pageSize]);

  // Filter letters
  const filteredLetters = letters.filter((l) => {
    const matchesSearch =
      (l.recipient || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.sender || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.contentSnippet || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTheme = themeFilter === "all" || l.theme === themeFilter;

    return matchesSearch && matchesTheme;
  });

  const totalPages = Math.max(1, Math.ceil(filteredLetters.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedLetters = filteredLetters.slice(startIndex, startIndex + pageSize);

  const todayLettersCount = letters.filter((l) => {
    const date = new Date(l.createdAt).toDateString();
    return date === new Date().toDateString();
  }).length;

  // 1. Password Protection Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-rose-200/80 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-5 shadow-sm text-rose-600">
            <Lock className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-serif text-zinc-900 mb-2">
            Admin Access Required
          </h1>
          <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
            This route is private. Enter your administrator password to view the list of created love letters.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 bg-rose-50/40 border border-rose-200 rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm pr-11"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {authError && (
                <p className="text-xs text-rose-600 mt-2 font-medium text-left">
                  {authError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isVerifying}
            >
              Unlock Dashboard
            </Button>
          </form>

          <p className="mt-6 text-[11px] text-zinc-400">
            Configure password via <code className="font-mono text-zinc-600">ADMIN_PASSWORD</code> in Vercel. Default is <code className="font-mono text-zinc-600">loveadmin2026</code>.
          </p>
        </div>
      </div>
    );
  }

  // 2. Authenticated Dashboard View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-100 pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 text-rose-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Lock className="w-3 h-3 text-rose-600" />
            <span>Private Admin Portal</span>
          </div>
          <h1 className="text-3xl font-serif text-zinc-900">
            Created Love Letters Ledger
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Real-time ledger of all personalized love letters generated on your platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}
            onClick={() => {
              const token = sessionStorage.getItem("love_admin_token");
              if (token) fetchLetters(token);
            }}
          >
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<LogOut className="w-3.5 h-3.5" />}
            onClick={handleLogout}
          >
            Exit
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/80 rounded-2xl p-5 border border-rose-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
              Total Letters Created
            </p>
            <p className="text-2xl font-serif font-bold text-zinc-900 mt-0.5">
              {letters.length}
            </p>
          </div>
        </div>

        <div className="bg-white/80 rounded-2xl p-5 border border-rose-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
              Created Today
            </p>
            <p className="text-2xl font-serif font-bold text-zinc-900 mt-0.5">
              {todayLettersCount}
            </p>
          </div>
        </div>

        <div className="bg-white/80 rounded-2xl p-5 border border-rose-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
              Storage Engine
            </p>
            <p className="text-sm font-semibold text-zinc-800 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ready & Synced</span>
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-rose-100 shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by recipient, sender, title, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-rose-50/40 border border-rose-200/80 rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={themeFilter}
            onChange={(e) => setThemeFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-rose-200 rounded-xl text-xs sm:text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            <option value="all">All Themes</option>
            <option value="classic">Classic Love</option>
            <option value="rose">Rose</option>
            <option value="midnight">Midnight Love</option>
            <option value="blush">Blush</option>
            <option value="minimal">Minimal</option>
            <option value="valentine">Valentine&apos;s</option>
          </select>
        </div>
      </div>

      {/* Letters List Table */}
      {filteredLetters.length === 0 ? (
        <div className="bg-white/80 rounded-3xl p-12 text-center border border-rose-100 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-serif text-zinc-800 mb-1">
            {searchQuery ? "No matching letters found" : "No letters recorded yet"}
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {searchQuery
              ? "Try adjusting your search keywords or theme filter."
              : "When visitors click 'Create Shareable Link', their letter will automatically appear here."}
          </p>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-rose-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-rose-50/70 border-b border-rose-100 text-zinc-600 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Recipient & Sender</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Title & Snippet</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Theme & Font</th>
                  <th className="py-3.5 px-4">Date Created</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100/60 text-zinc-700">
                {paginatedLetters.map((letter) => (
                  <tr
                    key={letter.id}
                    className="hover:bg-rose-50/40 transition-colors"
                  >
                    {/* Recipient & Sender */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-medium text-zinc-900 flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 shrink-0" />
                        <span>{letter.recipient || "Anonymous"}</span>
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        {letter.sender ? `From: ${letter.sender}` : "No sender name"}
                      </div>
                    </td>

                    {/* Title & Snippet */}
                    <td className="py-4 px-4 hidden md:table-cell max-w-xs">
                      <div className="font-medium text-zinc-800 truncate">
                        {letter.title || "Untitled Letter"}
                      </div>
                      <div className="text-xs text-zinc-500 truncate mt-0.5">
                        {letter.contentSnippet}
                      </div>
                    </td>

                    {/* Theme & Font */}
                    <td className="py-4 px-4 hidden sm:table-cell">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium capitalize">
                        {letter.theme}
                      </span>
                      <div className="text-[11px] text-zinc-400 mt-1 capitalize">
                        {letter.font}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-xs text-zinc-500 whitespace-nowrap">
                      {new Date(letter.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      <div className="text-[10px] text-zinc-400">
                        {new Date(letter.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/letter/${letter.encodedId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Open letter in new tab"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => handleCopyLink(letter.encodedId)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Copy letter link"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setLetterToDelete(letter)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete record from ledger"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="px-4 sm:px-6 py-4 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 text-xs text-zinc-600">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <span>
                Showing <strong>{filteredLetters.length === 0 ? 0 : startIndex + 1}</strong> to{" "}
                <strong>{Math.min(startIndex + pageSize, filteredLetters.length)}</strong> of{" "}
                <strong>{filteredLetters.length}</strong> letters
              </span>

              <div className="flex items-center gap-1.5 pl-2 border-l border-rose-100">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-white border border-rose-200 rounded-lg px-2 py-1 text-xs text-zinc-700 focus:outline-none focus:ring-1 focus:ring-rose-400"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Previous / Next buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<ChevronLeft className="w-3.5 h-3.5" />}
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>

              <span className="px-2 font-medium text-zinc-700">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                icon={<ChevronRight className="w-3.5 h-3.5" />}
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="flex-row-reverse"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Vercel Deployment Notice */}
      <div className="mt-10 p-5 rounded-2xl bg-rose-50/60 border border-rose-200/70 text-xs text-zinc-600 flex items-start gap-3">
        <Info className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-zinc-800">
            Vercel Deployment & Permanent Storage:
          </p>
          <p className="leading-relaxed">
            Letters are saved automatically. To persist all created letters permanently across Vercel serverless cold restarts, you can add <strong>Upstash Redis</strong> or <strong>Vercel KV</strong> from your Vercel Project Dashboard (Storage tab) in 1 click. The app automatically connects via environment variables.
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {letterToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          role="dialog"
        >
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-rose-100">
            <h3 className="text-lg font-serif font-medium text-zinc-900 mb-2">
              Remove Letter Record?
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed mb-6">
              Remove letter for <strong>{letterToDelete.recipient}</strong> from the admin list? (The recipient will still be able to open their link via URL decoding).
            </p>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLetterToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteLetter(letterToDelete)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast */}
      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />
    </div>
  );
}
