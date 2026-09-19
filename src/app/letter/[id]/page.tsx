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
    if (!rawId) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const decoded = decodeLetter(rawId);
      if (decoded) {
        setLetter(decoded);
      } else {
        setIsError(true);
      }
    } catch (err) {
      console.error("Failed to decode letter:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [rawId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
  };

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
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <HeartCrack className="w-8 h-8 text-rose-500" />
        </div>
        <h1 className="text-2xl font-serif text-zinc-900 mb-2">
          Letter Not Found or Corrupted
        </h1>
        <p className="text-sm text-zinc-600 mb-8 leading-relaxed">
          The link you opened might be incomplete or broken. Love letters carry
          their entire story in the link—make sure the entire URL was copied.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="outline" size="md">
              Return Home
            </Button>
          </Link>
          <Link href="/create">
            <Button variant="primary" size="md" icon={<PenLine className="w-4 h-4" />}>
              Write a New Letter
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
