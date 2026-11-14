"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Palette,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Quote,
  Undo,
  Redo,
  Eraser,
  Code,
  Eye,
  Edit3,
  Highlighter,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { renderBlogContent } from "@/lib/blogs";

interface Props {
  defaultValue?: string;
  name?: string;
  required?: boolean;
}

const PRESET_COLORS = [
  { name: "Default Ink", color: "#1E1033" },
  { name: "Vellora Pink", color: "#FF3D77" },
  { name: "Vellora Magenta", color: "#E0299B" },
  { name: "Vellora Purple", color: "#8B2FC9" },
  { name: "Bright Red", color: "#EF4444" },
  { name: "Emerald Green", color: "#10B981" },
  { name: "Royal Blue", color: "#2563EB" },
  { name: "Vibrant Orange", color: "#EA580C" },
  { name: "Amber Gold", color: "#D97706" },
  { name: "Slate Gray", color: "#64748B" },
];

const HIGHLIGHT_COLORS = [
  { name: "None", color: "transparent" },
  { name: "Yellow", color: "#FEF08A" },
  { name: "Pink", color: "#FBCFE8" },
  { name: "Green", color: "#BBF7D0" },
  { name: "Blue", color: "#BFDBFE" },
  { name: "Purple", color: "#E9D5FF" },
];

function normalizeInitialHtml(val: string): string {
  if (!val) return "";
  const trimmed = val.trim();
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(trimmed);
  if (!hasHtml) {
    return trimmed
      .split(/\n\n+/)
      .map((p) => `<p>${p.trim().replace(/\n/g, "<br/>")}</p>`)
      .join("");
  }
  return trimmed;
}

export default function BlogContentEditor({
  defaultValue = "",
  name = "content",
  required = true,
}: Props) {
  const [mode, setMode] = useState<"visual" | "html" | "preview">("visual");
  const [htmlContent, setHtmlContent] = useState<string>(() =>
    normalizeInitialHtml(defaultValue),
  );

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState("#FF3D77");

  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isUpdatingFromEditor = useRef(false);

  // Sync initial HTML content into contentEditable on mount or when switching to visual mode
  useEffect(() => {
    if (mode === "visual" && editorRef.current) {
      if (!isUpdatingFromEditor.current) {
        editorRef.current.innerHTML = htmlContent;
      }
    }
  }, [mode, htmlContent]);

  const updateHtml = useCallback((newHtml: string) => {
    setHtmlContent(newHtml);
  }, []);

  const handleEditorInput = () => {
    if (editorRef.current) {
      isUpdatingFromEditor.current = true;
      const html = editorRef.current.innerHTML;
      updateHtml(html);
      isUpdatingFromEditor.current = false;
    }
  };

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (mode !== "visual" || !editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    handleEditorInput();
  };

  const handleTextColorChange = (color: string) => {
    setCurrentColor(color);
    executeCommand("foreColor", color);
    setShowColorPicker(false);
  };

  const handleHighlightChange = (color: string) => {
    if (color === "transparent") {
      executeCommand("removeFormat");
    } else {
      executeCommand("hiliteColor", color);
    }
    setShowHighlightPicker(false);
  };

  const handleFormatBlock = (tag: string) => {
    executeCommand("formatBlock", tag);
  };

  const handleInsertLink = () => {
    const url = prompt("Enter the website URL (e.g. https://example.com):");
    if (url) {
      const cleanUrl = url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`;
      executeCommand("createLink", cleanUrl);
    }
  };

  // Helper to insert quick HTML tag snippets in HTML mode
  const insertHtmlSnippet = (openTag: string, closeTag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = `${openTag}${selected || "text"}${closeTag}`;

    const newText = text.substring(0, start) + replacement + text.substring(end);
    setHtmlContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + openTag.length,
        start + openTag.length + (selected ? selected.length : 4),
      );
    }, 0);
  };

  return (
    <div className="flex flex-col rounded-[16px] border border-gray-200 bg-white overflow-hidden shadow-xs focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500/20 transition-all">
      {/* Hidden input submitted with the parent form */}
      <input type="hidden" name={name} value={htmlContent} required={required} />

      {/* TOP HEADER: Mode Tabs & Editor Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 bg-gray-50/80 px-3.5 py-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-bold uppercase tracking-wider text-admin-ink-2">
            Article Content Format
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 px-2 py-0.5 text-[10.5px] font-semibold text-pink-700">
            <Sparkles className="h-3 w-3" />
            Rich Text &amp; HTML
          </span>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center rounded-lg bg-gray-200/60 p-0.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode("visual")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-all ${
              mode === "visual"
                ? "bg-white text-admin-ink shadow-xs"
                : "text-admin-ink-2 hover:text-admin-ink"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5 text-pink-600" />
            <span>Visual Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("html")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-all ${
              mode === "html"
                ? "bg-white text-admin-ink shadow-xs"
                : "text-admin-ink-2 hover:text-admin-ink"
            }`}
          >
            <Code className="h-3.5 w-3.5 text-purple-600" />
            <span>&lt;&gt; HTML Source</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-all ${
              mode === "preview"
                ? "bg-white text-admin-ink shadow-xs"
                : "text-admin-ink-2 hover:text-admin-ink"
            }`}
          >
            <Eye className="h-3.5 w-3.5 text-blue-600" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* VISUAL MODE TOOLBAR */}
      {mode === "visual" && (
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 bg-white px-2.5 py-2 text-admin-ink">
          {/* Headings */}
          <div className="flex items-center border-r border-gray-200 pr-1 mr-1 gap-0.5">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleFormatBlock("<p>");
              }}
              title="Normal Paragraph"
              className="rounded p-1.5 text-xs font-bold hover:bg-gray-100 transition"
            >
              P
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleFormatBlock("<h2>");
              }}
              title="Heading 2"
              className="inline-flex items-center gap-0.5 rounded p-1.5 text-xs font-bold hover:bg-gray-100 transition"
            >
              <Heading2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleFormatBlock("<h3>");
              }}
              title="Heading 3"
              className="inline-flex items-center gap-0.5 rounded p-1.5 text-xs font-bold hover:bg-gray-100 transition"
            >
              <Heading3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleFormatBlock("<h4>");
              }}
              title="Heading 4"
              className="inline-flex items-center gap-0.5 rounded p-1.5 text-xs font-bold hover:bg-gray-100 transition"
            >
              <Heading4 className="h-4 w-4" />
            </button>
          </div>

          {/* Text Styling: Bold, Italic, Underline, Strikethrough */}
          <div className="flex items-center border-r border-gray-200 pr-1 mr-1 gap-0.5">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("bold");
              }}
              title="Bold (Ctrl+B)"
              className="rounded p-1.5 text-gray-700 hover:bg-gray-100 hover:text-black transition"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("italic");
              }}
              title="Italic (Ctrl+I)"
              className="rounded p-1.5 text-gray-700 hover:bg-gray-100 hover:text-black transition"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("underline");
              }}
              title="Underline (Ctrl+U)"
              className="rounded p-1.5 text-gray-700 hover:bg-gray-100 hover:text-black transition"
            >
              <Underline className="h-4 w-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("strikeThrough");
              }}
              title="Strikethrough"
              className="rounded p-1.5 text-gray-700 hover:bg-gray-100 hover:text-black transition"
            >
              <Strikethrough className="h-4 w-4" />
            </button>
          </div>

          {/* COLOR PICKER DROPDOWN */}
          <div className="relative border-r border-gray-200 pr-1 mr-1">
            <button
              type="button"
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowHighlightPicker(false);
              }}
              title="Text Color"
              className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              <Palette className="h-4 w-4" style={{ color: currentColor }} />
              <div
                className="h-2 w-3 rounded-xs border border-gray-300"
                style={{ backgroundColor: currentColor }}
              />
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </button>

            {showColorPicker && (
              <div className="absolute top-full left-0 z-30 mt-1 w-52 rounded-xl border border-gray-200 bg-white p-2.5 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                <p className="text-[11px] font-bold text-gray-500 mb-1.5">
                  Select Text Color:
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleTextColorChange(c.color);
                      }}
                      title={c.name}
                      className="group relative flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 transition hover:scale-110"
                      style={{ backgroundColor: c.color }}
                    >
                      <span className="sr-only">{c.name}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-2.5 flex items-center justify-between border-t border-gray-100 pt-2 text-xs">
                  <span className="text-[11px] text-gray-500">Custom:</span>
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => handleTextColorChange(e.target.value)}
                    className="h-6 w-12 cursor-pointer rounded border border-gray-200 p-0.5"
                  />
                </div>
              </div>
            )}
          </div>

          {/* HIGHLIGHT COLOR PICKER */}
          <div className="relative border-r border-gray-200 pr-1 mr-1">
            <button
              type="button"
              onClick={() => {
                setShowHighlightPicker(!showHighlightPicker);
                setShowColorPicker(false);
              }}
              title="Background Highlight Color"
              className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              <Highlighter className="h-4 w-4 text-amber-500" />
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </button>

            {showHighlightPicker && (
              <div className="absolute top-full left-0 z-30 mt-1 w-48 rounded-xl border border-gray-200 bg-white p-2.5 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                <p className="text-[11px] font-bold text-gray-500 mb-1.5">
                  Text Highlight:
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {HIGHLIGHT_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleHighlightChange(c.color);
                      }}
                      className="rounded border border-gray-200 py-1 text-center text-[10.5px] font-semibold text-gray-800 transition hover:scale-105"
                      style={{
                        backgroundColor:
                          c.color === "transparent" ? "#F3F4F6" : c.color,
                      }}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Lists: Bullets & Numbers */}
          <div className="flex items-center border-r border-gray-200 pr-1 mr-1 gap-0.5">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("insertUnorderedList");
              }}
              title="Bullet List"
              className="rounded p-1.5 text-gray-700 hover:bg-gray-100 transition"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("insertOrderedList");
              }}
              title="Numbered List"
              className="rounded p-1.5 text-gray-700 hover:bg-gray-100 transition"
            >
              <ListOrdered className="h-4 w-4" />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center border-r border-gray-200 pr-1 mr-1 gap-0.5">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("justifyLeft");
              }}
              title="Align Left"
              className="rounded p-1.5 text-gray-700 hover:bg-gray-100 transition"
            >
              <AlignLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("justifyCenter");
              }}
              title="Align Center"
              className="rounded p-1.5 text-gray-700 hover:bg-gray-100 transition"
            >
              <AlignCenter className="h-4 w-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("justifyRight");
              }}
              title="Align Right"
              className="rounded p-1.5 text-gray-700 hover:bg-gray-100 transition"
            >
              <AlignRight className="h-4 w-4" />
            </button>
          </div>

          {/* Extras: Link, Blockquote, Clear Formatting */}
          <div className="flex items-center border-r border-gray-200 pr-1 mr-1 gap-0.5">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleInsertLink();
              }}
              title="Insert Link"
              className="rounded p-1.5 text-gray-700 hover:bg-gray-100 transition"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleFormatBlock("<blockquote>");
              }}
              title="Quote"
              className="rounded p-1.5 text-gray-700 hover:bg-gray-100 transition"
            >
              <Quote className="h-4 w-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("removeFormat");
              }}
              title="Clear Formatting"
              className="rounded p-1.5 text-gray-700 hover:bg-gray-100 transition"
            >
              <Eraser className="h-4 w-4" />
            </button>
          </div>

          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("undo");
              }}
              title="Undo (Ctrl+Z)"
              className="rounded p-1.5 text-gray-500 hover:bg-gray-100 transition"
            >
              <Undo className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("redo");
              }}
              title="Redo (Ctrl+Y)"
              className="rounded p-1.5 text-gray-500 hover:bg-gray-100 transition"
            >
              <Redo className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* HTML MODE TOOLBAR (Quick Tag Helpers) */}
      {mode === "html" && (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-3 py-2 text-xs">
          <span className="text-[11px] font-bold text-gray-500 mr-1">
            Quick Insert:
          </span>
          <button
            type="button"
            onClick={() => insertHtmlSnippet("<b>", "</b>")}
            className="rounded bg-white px-2 py-0.5 border border-gray-200 font-mono text-[11px] font-bold text-gray-700 hover:bg-gray-100"
          >
            &lt;b&gt;
          </button>
          <button
            type="button"
            onClick={() => insertHtmlSnippet("<i>", "</i>")}
            className="rounded bg-white px-2 py-0.5 border border-gray-200 font-mono text-[11px] font-bold text-gray-700 hover:bg-gray-100"
          >
            &lt;i&gt;
          </button>
          <button
            type="button"
            onClick={() => insertHtmlSnippet("<u>", "</u>")}
            className="rounded bg-white px-2 py-0.5 border border-gray-200 font-mono text-[11px] font-bold text-gray-700 hover:bg-gray-100"
          >
            &lt;u&gt;
          </button>
          <button
            type="button"
            onClick={() =>
              insertHtmlSnippet('<span style="color: #FF3D77;">', "</span>")
            }
            className="rounded bg-pink-50 px-2 py-0.5 border border-pink-200 font-mono text-[11px] font-bold text-pink-700 hover:bg-pink-100"
          >
            &lt;color: pink&gt;
          </button>
          <button
            type="button"
            onClick={() =>
              insertHtmlSnippet('<span style="color: #8B2FC9;">', "</span>")
            }
            className="rounded bg-purple-50 px-2 py-0.5 border border-purple-200 font-mono text-[11px] font-bold text-purple-700 hover:bg-purple-100"
          >
            &lt;color: purple&gt;
          </button>
          <button
            type="button"
            onClick={() => insertHtmlSnippet("<h2>", "</h2>")}
            className="rounded bg-white px-2 py-0.5 border border-gray-200 font-mono text-[11px] font-bold text-gray-700 hover:bg-gray-100"
          >
            &lt;h2&gt;
          </button>
          <button
            type="button"
            onClick={() => insertHtmlSnippet("<h3>", "</h3>")}
            className="rounded bg-white px-2 py-0.5 border border-gray-200 font-mono text-[11px] font-bold text-gray-700 hover:bg-gray-100"
          >
            &lt;h3&gt;
          </button>
          <button
            type="button"
            onClick={() => insertHtmlSnippet("<p>", "</p>")}
            className="rounded bg-white px-2 py-0.5 border border-gray-200 font-mono text-[11px] font-bold text-gray-700 hover:bg-gray-100"
          >
            &lt;p&gt;
          </button>
          <button
            type="button"
            onClick={() =>
              insertHtmlSnippet(
                '<a href="https://" target="_blank" rel="noopener noreferrer">',
                "</a>",
              )
            }
            className="rounded bg-white px-2 py-0.5 border border-gray-200 font-mono text-[11px] font-bold text-gray-700 hover:bg-gray-100"
          >
            &lt;a href&gt;
          </button>
          <button
            type="button"
            onClick={() =>
              insertHtmlSnippet("<ul>\n  <li>", "</li>\n</ul>")
            }
            className="rounded bg-white px-2 py-0.5 border border-gray-200 font-mono text-[11px] font-bold text-gray-700 hover:bg-gray-100"
          >
            &lt;ul&gt;&lt;li&gt;
          </button>
        </div>
      )}

      {/* EDITOR WORK AREA */}
      <div className="relative min-h-[280px]">
        {/* 1. VISUAL CONTENTEDITABLE EDITOR */}
        <div
          className={`p-4 min-h-[280px] max-h-[460px] overflow-y-auto focus:outline-none blog-content ${
            mode === "visual" ? "block" : "hidden"
          }`}
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleEditorInput}
          onBlur={handleEditorInput}
          data-placeholder="Write your article here... Highlight text to make it Bold, Italic, change Colors, add Headings, or switch to <> HTML Source."
        />

        {/* 2. RAW HTML SOURCE TEXTAREA */}
        {mode === "html" && (
          <textarea
            ref={textareaRef}
            value={htmlContent}
            onChange={(e) => updateHtml(e.target.value)}
            placeholder="Type or paste HTML code here, e.g. <h2>Welcome</h2><p>This is <b>bold</b> and <span style='color: #ff3d77;'>pink text</span>.</p>"
            className="w-full min-h-[280px] max-h-[460px] p-4 font-mono text-[13px] text-gray-900 leading-relaxed focus:outline-none bg-slate-50/50 resize-y"
            rows={12}
          />
        )}

        {/* 3. LIVE PREVIEW */}
        {mode === "preview" && (
          <div className="p-5 min-h-[280px] max-h-[460px] overflow-y-auto bg-brand-bg/30">
            <div className="rounded-xl bg-white p-5 border border-pink-100 shadow-xs">
              <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2 text-[11px] font-semibold text-gray-400">
                <span>PREVIEW AS READERS WILL SEE IT:</span>
                <span className="text-pink-600 font-bold">Vellora Blog Post</span>
              </div>
              <div
                className="blog-content leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    renderBlogContent(htmlContent) ||
                    "<p class='italic text-gray-400'>Article content is currently empty. Write in Visual or HTML mode to preview.</p>",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* FOOTER HELPER HINT */}
      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/60 px-3.5 py-1.5 text-[11px] text-gray-500">
        <span>
          {mode === "visual" &&
            "Tip: Select any word to apply Bold, Italic, custom Color, or Headings instantly."}
          {mode === "html" &&
            "HTML format accepted: tags like <b>, <i>, <h2>, and <span style='color: ...'> will render directly."}
          {mode === "preview" &&
            "This preview matches the live website font, colors, and layout."}
        </span>
        <span className="font-mono text-[10.5px] text-gray-400">
          {htmlContent.length} chars
        </span>
      </div>
    </div>
  );
}
