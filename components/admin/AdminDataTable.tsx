"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type AdminColumn<Row extends Record<string, unknown>> = {
  key: string;
  label: string;
  render?: (row: Row) => React.ReactNode;
};

type FilterConfig<Row extends Record<string, unknown>> = {
  key: keyof Row & string;
  label: string;
  options: { value: string; label: string }[];
  allLabel?: string;
};

type Props<Row extends Record<string, unknown>> = {
  title: string;
  description?: string;
  rows: Row[];
  columns: AdminColumn<Row>[];
  getRowId: (row: Row) => string;
  searchPlaceholder?: string;
  filter?: FilterConfig<Row>;
  newItemHref?: string;
  newItemLabel?: string;
  editHref?: (row: Row) => string;
  exportFilename: string;
  pageSize?: number;
  onDelete?: (row: Row) => void | Promise<void>;
};

function cellText(row: Record<string, unknown>, key: string) {
  const v = row[key];
  if (v == null) return "";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function downloadCsv(filename: string, columns: AdminColumn<Record<string, unknown>>[], rows: Record<string, unknown>[]) {
  const header = columns.map((c) => `"${c.label.replace(/"/g, '""')}"`).join(",");
  const lines = rows.map((row) =>
    columns
      .map((c) => {
        const raw = cellText(row, c.key).replace(/"/g, '""');
        return `"${raw}"`;
      })
      .join(","),
  );
  const blob = new Blob([`\uFEFF${header}\n${lines.join("\n")}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminDataTable<Row extends Record<string, unknown>>(props: Props<Row>) {
  const {
    title,
    description,
    rows,
    columns,
    getRowId,
    searchPlaceholder = "Search…",
    filter,
    newItemHref,
    newItemLabel = "Add new",
    editHref,
    exportFilename,
    pageSize = 10,
    onDelete,
  } = props;

  const [query, setQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let list = rows;
    if (filter && filterValue) {
      list = list.filter((r) => String(r[filter.key] ?? "") === filterValue);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((r) =>
        columns.some((c) => cellText(r as Record<string, unknown>, c.key).toLowerCase().includes(q)),
      );
    }
    return list;
  }, [rows, columns, query, filter, filterValue]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = useMemo(() => {
    const start = safePage * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  function onExport() {
    downloadCsv(exportFilename, columns as AdminColumn<Record<string, unknown>>[], filtered as Record<string, unknown>[]);
  }

  return (
    <section className="rounded-2xl border border-slate-700/80 bg-slate-900/40 p-4 shadow-lg shadow-fuchsia-950/20 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {newItemHref && (
            <Link
              href={newItemHref}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-teal-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md transition hover:brightness-110"
            >
              {newItemLabel}
            </Link>
          )}
          <button
            type="button"
            onClick={onExport}
            className="rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          placeholder={searchPlaceholder}
          className="w-full min-w-[12rem] rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-fuchsia-500/60 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 sm:max-w-xs"
        />
        {filter && (
          <label className="flex items-center gap-2 text-sm text-slate-400">
            <span className="whitespace-nowrap">{filter.label}</span>
            <select
              value={filterValue}
              onChange={(e) => {
                setFilterValue(e.target.value);
                setPage(0);
              }}
              className="rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-fuchsia-500/60 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30"
            >
              <option value="">{filter.allLabel ?? "All"}</option>
              {filter.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        )}
        <p className="text-sm text-slate-500 sm:ml-auto">
          {filtered.length} row{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-700/60">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/80 text-slate-400">
              {columns.map((c) => (
                <th key={c.key} className="whitespace-nowrap px-3 py-3 font-medium">
                  {c.label}
                </th>
              ))}
              {(editHref || onDelete) && (
                <th className="whitespace-nowrap px-3 py-3 text-right font-medium">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (editHref || onDelete ? 1 : 0)}
                  className="px-3 py-8 text-center text-slate-500"
                >
                  No rows match your filters.
                </td>
              </tr>
            ) : (
              pageRows.map((row) => {
                const id = getRowId(row);
                return (
                  <tr key={id} className="border-b border-slate-800/80 align-top text-slate-200 last:border-0">
                    {columns.map((c) => (
                      <td key={c.key} className="px-3 py-3">
                        {c.render ? c.render(row) : cellText(row as Record<string, unknown>, c.key)}
                      </td>
                    ))}
                    {(editHref || onDelete) && (
                      <td className="px-3 py-3 text-right">
                        <div className="inline-flex flex-wrap items-center justify-end gap-2">
                          {editHref && (
                            <Link
                              href={editHref(row)}
                              className="rounded-lg border border-slate-600 px-2 py-1 text-xs font-medium text-teal-300 hover:bg-slate-800"
                            >
                              Edit
                            </Link>
                          )}
                          {onDelete && (
                            <button
                              type="button"
                              className="rounded-lg border border-red-900/60 px-2 py-1 text-xs font-medium text-red-300 hover:bg-red-950/40"
                              onClick={() => {
                                if (typeof window !== "undefined" && window.confirm("Delete this row?")) {
                                  void onDelete(row);
                                }
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4 text-sm text-slate-400">
          <span>
            Page {safePage + 1} of {pageCount}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={safePage <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded-lg border border-slate-600 px-3 py-1.5 text-slate-200 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              className="rounded-lg border border-slate-600 px-3 py-1.5 text-slate-200 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
