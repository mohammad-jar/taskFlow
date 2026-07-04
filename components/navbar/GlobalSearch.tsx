"use client";

import { Search, Loader2, ArrowUpRight, Inbox } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type SearchResult = {
  id: string;
  type: "Workspace" | "Task" | "Member";
  title: string;
  subtitle: string;
  href: string;
  image?: string | null;
};

const typeStyles = {
  Workspace: "bg-blue-50 text-blue-600",
  Task: "bg-emerald-50 text-emerald-600",
  Member: "bg-amber-50 text-amber-600",
};

const GlobalSearch = () => {
  const searchRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const abortController = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmedQuery)}`,
          {
            signal: abortController.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error(error);
          setResults([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      abortController.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  const showPanel = open && query.trim().length > 0;

  return (
    <div ref={searchRef} className="relative hidden w-full max-w-2xl lg:block">
      <Search
        size={17}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search tasks, workspaces, or teammates..."
        className="h-11 w-full rounded-2xl border border-white bg-white/90 pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-200 focus:ring-4 focus:ring-blue-100"
      />

      {showPanel && (
        <div className="absolute left-0 right-0 top-13 z-50 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/70">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Global search
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto p-2">
            {loading ? (
              <div className="flex min-h-32 flex-col items-center justify-center gap-3 text-sm text-slate-500">
                <Loader2 size={20} className="animate-spin text-blue-600" />
                Searching TaskFlow...
              </div>
            ) : query.trim().length < 2 ? (
              <SearchMessage
                icon={<Search size={20} />}
                title="Keep typing"
                description="Use at least 2 characters to search."
              />
            ) : results.length > 0 ? (
              <div className="space-y-1">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={result.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-slate-50"
                  >
                    <ResultIcon result={result} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${typeStyles[result.type]}`}
                        >
                          {result.type}
                        </span>
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {result.title}
                        </p>
                      </div>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {result.subtitle}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-slate-300 transition group-hover:text-blue-600"
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <SearchMessage
                icon={<Inbox size={20} />}
                title="No results found"
                description="Try a task title, workspace name, or teammate email."
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ResultIcon = ({ result }: { result: SearchResult }) => {
  if (result.image) {
    return (
      <div
        className="h-10 w-10 shrink-0 rounded-2xl bg-cover bg-center"
        style={{ backgroundImage: `url("${result.image}")` }}
      />
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-600">
      {result.title.slice(0, 2).toUpperCase()}
    </div>
  );
};

const SearchMessage = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex min-h-32 flex-col items-center justify-center px-6 text-center">
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
      {icon}
    </div>
    <p className="mt-3 text-sm font-semibold text-slate-950">{title}</p>
    <p className="mt-1 text-sm text-slate-500">{description}</p>
  </div>
);

export default GlobalSearch;
