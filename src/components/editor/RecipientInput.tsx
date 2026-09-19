"use client";

import React from "react";
import { Heart, User } from "lucide-react";

interface RecipientInputProps {
  recipient: string;
  sender: string;
  onChangeRecipient: (val: string) => void;
  onChangeSender: (val: string) => void;
}

export const RecipientInput: React.FC<RecipientInputProps> = ({
  recipient,
  sender,
  onChangeRecipient,
  onChangeSender,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Recipient */}
      <div>
        <label
          htmlFor="recipient-input"
          className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5 flex items-center gap-1.5"
        >
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>To (Recipient)</span>
        </label>
        <div className="relative">
          <input
            id="recipient-input"
            type="text"
            placeholder="e.g. My Dearest Maria"
            value={recipient}
            onChange={(e) => onChangeRecipient(e.target.value)}
            maxLength={100}
            className="w-full px-4 py-2.5 bg-white border border-rose-200/80 rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400 text-sm shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Sender */}
      <div>
        <label
          htmlFor="sender-input"
          className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5 flex items-center gap-1.5"
        >
          <User className="w-3.5 h-3.5 text-rose-500" />
          <span>From (Sender)</span>
        </label>
        <div className="relative">
          <input
            id="sender-input"
            type="text"
            placeholder="e.g. Forever yours, John"
            value={sender}
            onChange={(e) => onChangeSender(e.target.value)}
            maxLength={100}
            className="w-full px-4 py-2.5 bg-white border border-rose-200/80 rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400 text-sm shadow-sm transition-all"
          />
        </div>
      </div>
    </div>
  );
};
