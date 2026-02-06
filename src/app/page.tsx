// app/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { process } from "@/lib/crypto";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt" | null>(null);
  const [copied, setCopied] = useState(false);
  const [dark, setDark] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleProcess = () => {
    if (!input.trim()) {
      setOutput("");
      setMode(null);
      return;
    }

    const { result, mode: processMode } = process(input);
    setOutput(result);
    setMode(processMode);
  };

  const handleCopy = async () => {
    if (!output) return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(output);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = output;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      outputRef.current?.select();
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setMode(null);
    inputRef.current?.focus();
  };

  const handleSwap = () => {
    setInput(output);
    setOutput("");
    setMode(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleProcess();
    }
  };

  return (
    <main
      className={`h-screen w-screen flex overflow-hidden ${dark ? "bg-neutral-900" : "bg-neutral-50"}`}
    >
      {/* Minimalist Theme Toggle */}
      <button
        onClick={() => setDark(!dark)}
        className="absolute top-3 right-4 z-10 p-1 bg-transparent cursor-pointer focus:outline-none border-none"
        aria-label="Toggle Theme"
      >
        {dark ? (
          <svg
            className="w-6 h-6 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-neutral-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </button>

      {/* Left Panel - Input */}
      <div
        className={`w-1/2 h-full flex flex-col p-6 border-r 
        ${dark ? "border-neutral-700" : "border-neutral-200"}`}
      >
        <div className="flex items-center justify-between mb-4">
          <label
            className={`text-xs font-medium tracking-wider uppercase 
            ${dark ? "text-neutral-400" : "text-neutral-500"}`}
          >
            Input
          </label>
          <span
            className={`text-xs ${dark ? "text-neutral-500" : "text-neutral-400"}`}
          >
            TextKit
          </span>
        </div>

        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste or type text here"
          className={`flex-1 w-full p-4 text-sm leading-relaxed resize-none transition-colors
            ${dark
              ? "bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-600 focus:border-neutral-500"
              : "bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-300 focus:border-black"
            } border`}
          spellCheck={false}
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleProcess}
            disabled={!input.trim()}
            className={`px-6 py-2.5 text-xs font-medium tracking-wider uppercase transition-colors
              ${dark
                ? "bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-700 disabled:text-neutral-500"
                : "bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400"
              }`}
          >
            Process
          </button>
          <button
            onClick={handleClear}
            className={`px-6 py-2.5 border text-xs font-medium tracking-wider uppercase transition-colors
              ${dark
                ? "border-neutral-600 text-neutral-400 hover:border-neutral-400 hover:text-neutral-200"
                : "border-neutral-300 text-neutral-600 hover:border-black hover:text-black"
              }`}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Right Panel - Output */}
      <div
        className={`w-1/2 h-full flex flex-col p-6 
        ${dark ? "bg-neutral-800" : "bg-neutral-100"}`}
      >
        <div className="flex items-center justify-between mb-4">
          <label
            className={`text-xs font-medium tracking-wider uppercase 
            ${dark ? "text-neutral-400" : "text-neutral-500"}`}
          >
            Output
          </label>
          {/* {mode && (
            <span
              className={`text-xs tracking-wider uppercase 
              ${dark ? "text-neutral-500" : "text-neutral-400"}`}
            >
              {mode === "decrypt" ? "Decoded" : "Encoded"}
            </span>
          )} */}
        </div>

        <textarea
          ref={outputRef}
          value={output}
          readOnly
          placeholder="Result will appear here"
          className={`flex-1 w-full p-4 text-sm leading-relaxed resize-none transition-colors
            ${dark
              ? "bg-neutral-900 border-neutral-700 text-neutral-100 placeholder:text-neutral-600"
              : "bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-300"
            } border`}
          spellCheck={false}
          onClick={() => outputRef.current?.select()}
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleCopy}
            disabled={!output}
            className={`px-6 py-2.5 border text-xs font-medium tracking-wider uppercase transition-colors
              ${dark
                ? "border-neutral-600 text-neutral-400 hover:border-neutral-400 hover:text-neutral-200 disabled:border-neutral-700 disabled:text-neutral-600"
                : "border-neutral-300 text-neutral-600 hover:border-black hover:text-black disabled:border-neutral-200 disabled:text-neutral-300"
              }`}
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleSwap}
            disabled={!output}
            className={`px-6 py-2.5 border text-xs font-medium tracking-wider uppercase transition-colors
              ${dark
                ? "border-neutral-600 text-neutral-400 hover:border-neutral-400 hover:text-neutral-200 disabled:border-neutral-700 disabled:text-neutral-600"
                : "border-neutral-300 text-neutral-600 hover:border-black hover:text-black disabled:border-neutral-200 disabled:text-neutral-300"
              }`}
          >
            Use as Input
          </button>
        </div>
      </div>
    </main>
  );
}
