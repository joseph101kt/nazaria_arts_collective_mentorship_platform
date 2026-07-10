"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  label: string;
  placeholder: string;
  helperText?: string;
  values: string[];
  onChange: (values: string[]) => void;
  maxTags?: number;
}

export default function TagInput({
  label,
  placeholder,
  helperText,
  values,
  onChange,
  maxTags = 8,
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (values.includes(trimmed)) {
      setDraft("");
      return;
    }
    if (values.length >= maxTags) return;
    onChange([...values, trimmed]);
    setDraft("");
  };

  const removeTag = (tag: string) => {
    onChange(values.filter((v) => v !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && draft === "" && values.length > 0) {
      removeTag(values[values.length - 1]);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[#1F2A44] dark:text-[#F1EFE7]">
        {label}
      </label>
      <div
        className={cn(
          "flex flex-wrap items-center gap-1.5 rounded-lg border px-2.5 py-2",
          "border-[#D8D3C4] bg-white focus-within:border-[#E8A33D] focus-within:ring-2 focus-within:ring-[#E8A33D]/30",
          "dark:border-[#333B4D] dark:bg-[#1C2333] dark:focus-within:border-[#E8A33D]"
        )}
      >
        {values.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full bg-[#EEF3EF] px-2.5 py-1 text-xs font-medium text-[#2F6F62] dark:bg-[#233229] dark:text-[#8FC7B5]"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              className="rounded-full p-0.5 hover:bg-[#2F6F62]/15"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={values.length === 0 ? placeholder : ""}
          className="min-w-[120px] flex-1 bg-transparent text-sm outline-none placeholder:text-[#9A9585] dark:text-[#F1EFE7] dark:placeholder:text-[#6B7280]"
        />
      </div>
      {helperText && (
        <p className="text-xs text-[#78725F] dark:text-[#9096A6]">{helperText}</p>
      )}
    </div>
  );
}