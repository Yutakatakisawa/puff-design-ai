import type { LayoutStructure } from "./types";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function blockToHtml(block: { type: string; props?: Record<string, unknown> }): string {
  const p = block.props || {};
  const text = (p.text as string) || block.type;
  const subtext = (p.subtext as string) || "";
  const fontSize = (p.fontSize as number) || 16;
  const padding = (p.padding as number) || 16;
  const bg = (p.backgroundColor as string) || "transparent";

  switch (block.type) {
    case "navbar":
      return `<header style="padding:${padding}px;font-size:${fontSize}px;background:rgba(30,27,75,0.5)">${escapeHtml(text)}</header>`;
    case "hero":
      return `<section style="padding:${padding}px;font-size:${fontSize}px;background:${bg};text-align:center"><h1>${escapeHtml(text)}</h1>${subtext ? `<p>${escapeHtml(subtext)}</p>` : ""}</section>`;
    case "features":
      return `<section style="padding:${padding}px;font-size:${fontSize}px"><h2>${escapeHtml(text)}</h2></section>`;
    case "cards":
      return `<section style="padding:${padding}px;font-size:${fontSize}px"><div class="cards">${escapeHtml(text)}</div></section>`;
    case "cta":
      return `<section style="padding:${padding}px;font-size:${fontSize}px;background:${bg};text-align:center"><h2>${escapeHtml(text)}</h2><button>${escapeHtml((p.buttonText as string) || "CTA")}</button></section>`;
    case "footer":
      return `<footer style="padding:${padding}px;font-size:${fontSize}px">${escapeHtml(text)}</footer>`;
    default:
      return `<div style="padding:${padding}px">${escapeHtml(text)}</div>`;
  }
}

export function exportHtml(layout: LayoutStructure): string {
  const body = layout.layout.map((b) => blockToHtml(b)).join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Exported UI</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body{font-family:system-ui;background:#0f0d14;color:#e2e8f0;margin:0}</style>
</head>
<body>
${body}
</body>
</html>`;
}

function blockToReact(block: { type: string; props?: Record<string, unknown> }): string {
  const p = block.props || {};
  const text = (p.text as string) || block.type;
  const subtext = (p.subtext as string) || "";
  const fontSize = (p.fontSize as number) || 16;
  const padding = (p.padding as number) || 16;
  const bg = (p.backgroundColor as string) || "transparent";

  switch (block.type) {
    case "navbar":
      return `<header className="p-4 text-sm bg-indigo-950/50">${escapeHtml(text)}</header>`;
    case "hero":
      return `<section className="p-6 text-center" style={{ fontSize: ${fontSize}, background: '${bg}' }}><h1 className="text-2xl font-bold">${escapeHtml(text)}</h1>${subtext ? `<p className="mt-2 opacity-80">${escapeHtml(subtext)}</p>` : ""}</section>`;
    case "features":
      return `<section className="p-5"><h2 className="text-xl font-semibold">${escapeHtml(text)}</h2></section>`;
    case "cards":
      return `<section className="p-4"><div className="grid grid-cols-2 gap-4">${escapeHtml(text)}</div></section>`;
    case "cta":
      return `<section className="p-8 text-center" style={{ background: '${bg}' }}><h2 className="text-xl font-bold">${escapeHtml(text)}</h2><button className="mt-4 px-6 py-2 rounded-lg bg-violet-600">${escapeHtml((p.buttonText as string) || "CTA")}</button></section>`;
    case "footer":
      return `<footer className="p-4 text-xs text-slate-400">${escapeHtml(text)}</footer>`;
    default:
      return `<div className="p-4">${escapeHtml(text)}</div>`;
  }
}

export function exportReact(layout: LayoutStructure): string {
  const body = layout.layout.map((b) => blockToReact(b)).join("\n  ");
  return `export default function ExportedLayout() {
  return (
    <div className="min-h-screen bg-[#0f0d14] text-slate-200">
  ${body}
    </div>
  );
}
`;
}

export function exportTailwindLayout(layout: LayoutStructure): string {
  const lines = layout.layout.map((b) => {
    const p = b.props || {};
    const name = b.type.charAt(0).toUpperCase() + b.type.slice(1);
    return `  {/* ${name} */}`;
  });
  return `<!-- Tailwind layout structure -->\n<div class="min-h-screen bg-surface-900 text-slate-200">\n${lines.join("\n")}\n</div>`;
}
