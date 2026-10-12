import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUpRight } from "lucide-react";
import searchIndex from "../course/search-index.json";
import { glossary } from "../course/glossary";
import { questions } from "../interview";
import { CloseButton } from "./Layout";
export function SearchDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prior = document.activeElement as HTMLElement;
    ref.current?.querySelector("input")?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const nodes =
        ref.current?.querySelectorAll<HTMLElement>("input,button,a");
      if (!nodes?.length) return;
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      prior?.focus();
    };
  }, []);
  const q = query.toLowerCase();
  const results = [
    ...searchIndex,
    ...glossary.map((g) => ({
      type: "Glossary",
      title: g.term,
      text: g.simple + " " + g.deep,
      url: "/glossary",
    })),
    ...questions.map((x) => ({
      type: "Interview",
      title: x.question,
      text: x.category + " " + x.answer,
      url: "/interviews?question=" + x.id,
    })),
  ]
    .filter((r) => !q || (r.title + " " + r.text).toLowerCase().includes(q))
    .slice(0, 15);
  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="search-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Search course"
        ref={ref}
      >
        <div className="search-modal-header">
          <Search size={21} />
          <input
            aria-label="Search all content"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Lessons, exercises, terms, interview questions…"
          />
          <CloseButton onClick={onClose} />
        </div>
        <div className="search-results">
          {results.map((r, i) => (
            <Link key={i} to={r.url} onClick={onClose}>
              <span>
                <small>{r.type}</small>
                <strong>{r.title}</strong>
              </span>
              <ArrowUpRight size={16} />
            </Link>
          ))}
          {results.length === 0 && (
            <p>No matches. Try a topic like cosine, SQL, or evaluation.</p>
          )}
        </div>
        <div className="search-footer">
          Search your entire workspace <kbd>ESC to close</kbd>
        </div>
      </div>
    </div>
  );
}
