"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { decodeLetter } from "@/lib/letter-encoder";
import { LoveLetter } from "@/types/letter";
import { Envelope } from "@/components/letter/Envelope";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { generateLetterPDF } from "@/lib/pdf-generator";
import {
  Download,
  PenLine,
  Share2,
  Copy,
  AlertCircle,
  HeartCrack,
} from "lucide-react";

export default function LetterDetailPage() {
  const params = useParams();
  const rawId = params?.id as string | undefined;

  const [letter, setLetter] = useState<LoveLetter | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [hasOpenedLetter, setHasOpenedLetter] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    let targetId = Array.isArray(rawId) ? rawId.join("/") : rawId;

    // Fallback: extract from window.location if rawId is missing
    if (!targetId && typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (pathname.includes("/letter/")) {
        targetId = pathname.substring(pathname.indexOf("/letter/") + 8);
      }
      if (!targetId && window.location.hash) {
        targetId = window.location.hash.replace(/^#(\/?letter\/|letter=)?/, "");
      }
      if (!targetId && window.location.search) {
        const queryParams = new URLSearchParams(window.location.search);
        targetId = queryParams.get("letter") || queryParams.get("data") || undefined;
      }
    }

    if (!targetId) {
      const timer = setTimeout(() => {
        setIsError(true);
        setIsLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }

    // 1. Try decoding targetId directly as compressed/encoded letter
    const decoded = decodeLetter(targetId);
    if (decoded) {
      setLetter(decoded);
      setIsError(false);
      setIsLoading(false);
      return;
    }

    // 2. Check local client cache for short ID
    try {
      const cached = localStorage.getItem(`love_letter_${targetId}`);
      if (cached) {
        const decodedCached = decodeLetter(cached);
        if (decodedCached) {
          setLetter(decodedCached);
          setIsError(false);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Ignore
    }

    // 3. If decoding fails, check if targetId is an ID in the ledger (e.g., from admin list or short ID)
    fetch(`/api/letters/public?id=${encodeURIComponent(targetId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success) {
          if (data.letter) {
            setLetter(data.letter);
            setIsError(false);
            setIsLoading(false);
            return;
          }
          if (data.encodedId) {
            const letterFromId = decodeLetter(data.encodedId);
            if (letterFromId) {
              setLetter(letterFromId);
              setIsError(false);
              setIsLoading(false);
              return;
            }
          }
        }
        setIsError(true);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, [rawId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
  };

  // Anti-copy protection for the letter content
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C")) {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
          return;
        }
        e.preventDefault();
        showToast("This letter is written for your eyes only ❤️");
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      e.preventDefault();
      showToast("This letter is written for your eyes only ❤️");
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("copy", handleCopy);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("copy", handleCopy);
    };
  }, []);

  const handleDownloadPDF = async () => {
    if (!letter) return;
    setIsPdfLoading(true);
    try {
      await generateLetterPDF("love-letter-paper", {
        title: letter.title || "digital-love-letter",
      });
      showToast("PDF downloaded successfully ❤️");
    } catch {
      showToast("Failed to generate PDF. Please try again.");
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Letter link copied to clipboard ❤️");
    } catch {
      showToast("Could not copy link");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-3 border-rose-200 border-t-rose-600 animate-spin mb-4" />
        <p className="text-sm text-zinc-500 font-serif animate-pulse">
          Opening seal...
        </p>
      </div>
    );
  }

  if (isError || !letter) {
    const isShortId = typeof rawId === "string" && rawId.length < 20;

    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <HeartCrack className="w-8 h-8 text-rose-500" />
        </div>
        <h1 className="text-2xl font-serif text-zinc-900 mb-2">
          Letter Not Found
        </h1>
        <p className="text-sm text-zinc-600 mb-6 leading-relaxed">
          {isShortId
            ? "This short link may have expired or the hosting server was restarted. If you are the sender, your draft is safely saved in your browser! Please use or ask for the Permanent Link, which never expires and can never be deleted."
            : "The link you opened might be incomplete or broken. Love letters carry their entire story in the link—make sure the entire URL was copied."}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="outline" size="md">
              Return Home
            </Button>
          </Link>
          <Link href="/create">
            <Button variant="primary" size="md" icon={<PenLine className="w-4 h-4" />}>
              Open Letter Creator
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Recipient Letter & Envelope Experience */}
      <Envelope letter={letter} onOpen={() => setHasOpenedLetter(true)} />

      {/* Recipient Action Toolbar (shown once letter is revealed) */}
      {hasOpenedLetter && (
        <div className="mt-10 pt-6 border-t border-rose-100 flex flex-wrap items-center justify-center gap-3 animate-in fade-in duration-500">
          <Button
            variant="outline"
            size="md"
            icon={<Download className="w-4 h-4 text-rose-600" />}
            onClick={handleDownloadPDF}
            isLoading={isPdfLoading}
          >
            Download PDF Keepsake
          </Button>

          <Button
            variant="outline"
            size="md"
            icon={<Copy className="w-4 h-4 text-rose-600" />}
            onClick={handleCopyLink}
          >
            Copy Link
          </Button>

          <Link href="/create">
            <Button
              variant="primary"
              size="md"
              icon={<PenLine className="w-4 h-4" />}
            >
              Write Your Own Letter
            </Button>
          </Link>
        </div>
      )}

      {/* Toast */}
      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />
    </div>
  );
}
