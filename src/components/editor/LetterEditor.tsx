"use client";

import React, { useState, useEffect, useCallback } from "react";
import { LoveLetter, DEFAULT_LETTER } from "@/types/letter";
import { saveDraft, loadDraft, clearDraft } from "@/lib/local-storage";
import { encodeLetter } from "@/lib/letter-encoder";
import { generateLetterPDF } from "@/lib/pdf-generator";
import { RecipientInput } from "./RecipientInput";
import { LetterTitleInput } from "./LetterTitleInput";
import { LetterContentEditor } from "./LetterContentEditor";
import { FontSelector } from "./FontSelector";
import { ThemeSelector } from "./ThemeSelector";
import { DecorationSelector } from "./DecorationSelector";
import { LetterPreview } from "../letter/LetterPreview";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Toast } from "../ui/Toast";
import {
  Share2,
  Download,
  Trash2,
  Copy,
  Check,
  Eye,
  Edit3,
  ExternalLink,
} from "lucide-react";

export const LetterEditor: React.FC = () => {
  const [letter, setLetter] = useState<LoveLetter>(DEFAULT_LETTER);
  const [isClient, setIsClient] = useState(false);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");

  // Modals & Toast State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [fullEncodedUrl, setFullEncodedUrl] = useState("");
  const [showFullUrl, setShowFullUrl] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
  }, []);

  // Restore draft on initial load
  useEffect(() => {
    setIsClient(true);
    const saved = loadDraft();
    if (saved) {
      setLetter(saved);
      showToast("Draft restored from your last visit ❤️");
    }
  }, [showToast]);

  // Auto-save draft on changes (debounced)
  useEffect(() => {
    if (!isClient) return;
    const timer = setTimeout(() => {
      saveDraft(letter);
    }, 600);
    return () => clearTimeout(timer);
  }, [letter, isClient]);

  // Handle Share link generation with clean Short ID
  const handleGenerateShareLink = () => {
    try {
      const encoded = encodeLetter(letter);
      // Generate clean 8-character alphanumeric short ID
      const shortId =
        Math.random().toString(36).slice(2, 6) +
        Math.random().toString(36).slice(2, 6);

      const shortUrl = `${window.location.origin}/letter/${shortId}`;
      const longUrl = `${window.location.origin}/letter/${encoded}`;

      setShareUrl(shortUrl);
      setFullEncodedUrl(longUrl);
      setShowFullUrl(false);
      setIsShareModalOpen(true);

      // Cache locally on creator's device for instantaneous 0ms resolution
      try {
        localStorage.setItem(`love_letter_${shortId}`, encoded);
      } catch {
        // Ignore
      }

      // Asynchronously log to admin ledger and persistent storage
      fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: shortId,
          encodedId: encoded,
          recipient: letter.recipient,
          sender: letter.sender,
          title: letter.title,
          theme: letter.theme,
          font: letter.font,
          background: letter.background,
          content: letter.content,
          decorations: letter.decorations,
          alignment: letter.alignment,
          fontSize: letter.fontSize,
          createdAt: letter.createdAt || new Date().toISOString(),
        }),
      }).catch((err) => {
        // Silent failure so link generation is never interrupted
        console.warn("Could not log to admin ledger:", err);
      });
    } catch (err) {
      console.error("Failed to generate link:", err);
      showToast("Could not generate share link. Please try again.");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      showToast("Link copied to clipboard ❤️");
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      showToast("Failed to copy link. Please copy manually.");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: letter.title || "A Love Letter for You",
          text: `A romantic digital letter written for ${letter.recipient || "you"}`,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadPDF = async () => {
    setIsPdfLoading(true);
    try {
      await generateLetterPDF("love-letter-preview-paper", {
        title: letter.title || "digital-love-letter",
      });
      showToast("Letter PDF downloaded ❤️");
    } catch (err) {
      console.error("PDF download failed:", err);
      showToast("Failed to generate PDF. Please try again.");
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleConfirmClearDraft = () => {
    clearDraft();
    setLetter(DEFAULT_LETTER);
    setIsClearModalOpen(false);
    showToast("Draft cleared. Fresh stationery ready.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex rounded-2xl bg-rose-100/70 p-1 mb-6 border border-rose-200">
        <button
          onClick={() => setMobileTab("edit")}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === "edit"
              ? "bg-white text-rose-700 shadow-sm"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Write & Style</span>
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === "preview"
              ? "bg-white text-rose-700 shadow-sm"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Preview</span>
        </button>
      </div>

      {/* Main 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editor Controls */}
        <div
          className={`lg:col-span-6 space-y-6 bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm ${
            mobileTab === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="flex items-center justify-between border-b border-rose-100 pb-4">
            <div>
              <h2 className="text-xl font-serif font-medium text-zinc-900">
                Compose Your Letter
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Saved automatically to your device.
              </p>
            </div>

            <button
              onClick={() => setIsClearModalOpen(true)}
              className="text-xs text-zinc-400 hover:text-rose-600 flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-rose-50"
              title="Clear draft"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Section 1: Recipient & Sender */}
          <RecipientInput
            recipient={letter.recipient}
            sender={letter.sender}
            onChangeRecipient={(val) =>
              setLetter((prev) => ({ ...prev, recipient: val }))
            }
            onChangeSender={(val) =>
              setLetter((prev) => ({ ...prev, sender: val }))
            }
          />

          {/* Section 2: Letter Title */}
          <LetterTitleInput
            title={letter.title}
            onChangeTitle={(val) =>
              setLetter((prev) => ({ ...prev, title: val }))
            }
          />

          {/* Section 3: Letter Content Editor */}
          <LetterContentEditor
            content={letter.content}
            onChangeContent={(val) =>
              setLetter((prev) => ({ ...prev, content: val }))
            }
            alignment={letter.alignment || "center"}
            onChangeAlignment={(val) =>
              setLetter((prev) => ({ ...prev, alignment: val }))
            }
            fontSize={letter.fontSize || "base"}
            onChangeFontSize={(val) =>
              setLetter((prev) => ({ ...prev, fontSize: val }))
            }
          />

          <div className="pt-2 border-t border-rose-100/60" />

          {/* Section 4: Font Selection */}
          <FontSelector
            selectedFont={letter.font}
            onChangeFont={(font) =>
              setLetter((prev) => ({ ...prev, font }))
            }
          />

          <div className="pt-2 border-t border-rose-100/60" />

          {/* Section 5: Theme & Background */}
          <ThemeSelector
            selectedTheme={letter.theme}
            onChangeTheme={(theme) =>
              setLetter((prev) => ({ ...prev, theme }))
            }
            selectedBackground={letter.background}
            onChangeBackground={(background) =>
              setLetter((prev) => ({ ...prev, background }))
            }
          />

          <div className="pt-2 border-t border-rose-100/60" />

          {/* Section 6: Decorations */}
          <DecorationSelector
            decorations={letter.decorations}
            onChangeDecorations={(decorations) =>
              setLetter((prev) => ({ ...prev, decorations }))
            }
          />

          {/* Action Bar inside editor for convenience */}
          <div className="pt-6 border-t border-rose-100 flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:flex-1"
              icon={<Share2 className="w-4 h-4" />}
              onClick={handleGenerateShareLink}
            >
              Create Shareable Link ❤️
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              icon={<Download className="w-4 h-4" />}
              onClick={handleDownloadPDF}
              isLoading={isPdfLoading}
            >
              Download PDF
            </Button>
          </div>
        </div>

        {/* Right Column: Live Letter Preview */}
        <div
          className={`lg:col-span-6 sticky top-24 ${
            mobileTab === "edit" ? "hidden lg:block" : "block"
          }`}
        >
          <LetterPreview
            letter={letter}
            onShareClick={handleGenerateShareLink}
            showActions={true}
          />
        </div>
      </div>

      {/* Shareable Link Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Your Love Letter is Ready ❤️"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-zinc-600">
            Anyone with this link will receive your beautifully animated envelope
            and personalized letter. No login or database required!
          </p>

          {/* URL Box */}
          <div className="flex items-center gap-2 p-2 bg-rose-50/60 rounded-2xl border border-rose-200">
            <input
              type="text"
              readOnly
              value={showFullUrl ? fullEncodedUrl : shareUrl}
              className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-zinc-800 font-mono focus:outline-none select-all truncate"
            />
            <Button
              variant={isCopied ? "secondary" : "primary"}
              size="sm"
              icon={
                isCopied ? (
                  <Check className="w-3.5 h-3.5 text-rose-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )
              }
              onClick={async () => {
                const target = showFullUrl ? fullEncodedUrl : shareUrl;
                try {
                  await navigator.clipboard.writeText(target);
                  setIsCopied(true);
                  showToast("Link copied to clipboard ❤️");
                  setTimeout(() => setIsCopied(false), 2500);
                } catch {
                  showToast("Failed to copy link.");
                }
              }}
            >
              {isCopied ? "Copied!" : "Copy"}
            </Button>
          </div>

          {/* Short Link indicator & toggle */}
          <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <span>⚡</span> {showFullUrl ? "Self-contained encoded URL" : "Clean, short shareable link"}
            </span>
            <button
              type="button"
              onClick={() => setShowFullUrl(!showFullUrl)}
              className="text-rose-600 hover:underline hover:text-rose-700 font-medium"
            >
              {showFullUrl ? "Use Short Link" : "View Full URL"}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              icon={<Share2 className="w-4 h-4" />}
              onClick={handleNativeShare}
            >
              Share via...
            </Button>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-zinc-200 bg-white hover:bg-rose-50 text-sm font-medium text-zinc-700 hover:text-rose-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in New Tab</span>
            </a>
          </div>
        </div>
      </Modal>

      {/* Clear Draft Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Reset Letter?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-zinc-600">
            Are you sure you want to delete your current draft and reset to default?
            This cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsClearModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmClearDraft}
            >
              Yes, Reset Draft
            </Button>
          </div>
        </div>
      </Modal>

      {/* Floating Toast */}
      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />
    </div>
  );
};
