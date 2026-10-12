import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { glossary } from "../course/glossary";
import { PageHeading } from "../components/Layout";
export default function Glossary() {
  const [query, setQuery] = useState("");
  const items = glossary
    .filter((g) =>
      (g.term + " " + g.simple + " " + g.deep)
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .sort((a, b) => a.term.localeCompare(b.term));
  return (
    <div className="page">
      <PageHeading
        eyebrow="YOUR ENGINEERING REFERENCE"
        title="Make the vocabulary yours."
        description="Clear definitions, deeper intuition, and examples that connect back to your work."
      />
      <label className="glossary-search">
        <Search size={19} />
        <input
          aria-label="Search glossary"
          placeholder="Search terms, concepts, or examples…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="glossary-grid">
        {items.map((g) => (
          <article
            className="panel glossary-card"
            id={g.term.toLowerCase()}
            key={g.term}
          >
            <h2>{g.term}</h2>
            <p className="glossary-simple">{g.simple}</p>
            <p>{g.deep}</p>
            <div className="glossary-example">
              <strong>In practice</strong>
              <p>{g.example}</p>
            </div>
            <Link to={"/lesson/" + g.lesson}>
              Related foundation <ArrowRight size={14} />
            </Link>
          </article>
        ))}
      </div>
      {items.length === 0 && <p>No terms match your search.</p>}
    </div>
  );
}
