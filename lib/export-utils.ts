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
    const name = b.type.charAt(0).toUpperCase() + b.type.slice(1);
    return `  {/* ${name} */}`;
  });
  return `<!-- Tailwind layout structure -->\n<div class="min-h-screen bg-surface-900 text-slate-200">\n${lines.join("\n")}\n</div>`;
}

function blockToWordPress(block: { type: string; props?: Record<string, unknown> }): string {
  const p = block.props || {};
  const text = (p.text as string) || block.type;
  const subtext = (p.subtext as string) || "";
  const buttonText = (p.buttonText as string) || "CTA";

  switch (block.type) {
    case "navbar":
      return `<!-- wp:group {"layout":{"type":"flex","justifyContent":"space-between"}} -->\n<div class="wp-block-group"><p>${escapeHtml(text)}</p></div>\n<!-- /wp:group -->`;
    case "hero":
      return `<!-- wp:cover {"dimRatio":50} -->\n<div class="wp-block-cover"><div class="wp-block-cover__inner-container">\n<!-- wp:heading {"textAlign":"center","level":1} -->\n<h1 class="has-text-align-center">${escapeHtml(text)}</h1>\n<!-- /wp:heading -->\n${subtext ? `<!-- wp:paragraph {"align":"center"} -->\n<p class="has-text-align-center">${escapeHtml(subtext)}</p>\n<!-- /wp:paragraph -->` : ""}\n</div></div>\n<!-- /wp:cover -->`;
    case "features":
      return `<!-- wp:columns -->\n<div class="wp-block-columns"><!-- wp:column -->\n<div class="wp-block-column"><h3>${escapeHtml(text)}</h3></div>\n<!-- /wp:column --></div>\n<!-- /wp:columns -->`;
    case "cards":
      return `<!-- wp:columns {"align":"wide"} -->\n<div class="wp-block-columns alignwide"><div class="wp-block-column"><p>${escapeHtml(text)}</p></div></div>\n<!-- /wp:columns -->`;
    case "cta":
      return `<!-- wp:group {"layout":{"type":"constrained"}} -->\n<div class="wp-block-group">\n<!-- wp:heading {"textAlign":"center"} -->\n<h2 class="has-text-align-center">${escapeHtml(text)}</h2>\n<!-- /wp:heading -->\n<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->\n<div class="wp-block-buttons"><div class="wp-block-button"><a class="wp-block-button__link">${escapeHtml(buttonText)}</a></div></div>\n<!-- /wp:buttons --></div>\n<!-- /wp:group -->`;
    case "footer":
      return `<!-- wp:group -->\n<div class="wp-block-group"><p class="has-text-align-center has-small-font-size">${escapeHtml(text)}</p></div>\n<!-- /wp:group -->`;
    default:
      return `<!-- wp:paragraph -->\n<p>${escapeHtml(text)}</p>\n<!-- /wp:paragraph -->`;
  }
}

export function exportWordPress(layout: LayoutStructure): string {
  const blocks = layout.layout.map((b) => blockToWordPress(b)).join("\n\n");
  return `<?php
/**
 * Template Name: Puff Design Export
 * Generated by Puff Design AI
 */
get_header();
?>

<main class="puff-exported-layout">
${blocks}
</main>

<?php get_footer(); ?>
`;
}

function blockToWix(block: { type: string; props?: Record<string, unknown> }): string {
  const p = block.props || {};
  const text = (p.text as string) || block.type;
  const subtext = (p.subtext as string) || "";
  const buttonText = (p.buttonText as string) || "CTA";
  const padding = (p.padding as number) || 16;

  switch (block.type) {
    case "navbar":
      return `  $w("#header").text = "${text}";`;
    case "hero":
      return `  $w("#heroTitle").text = "${text}";\n${subtext ? `  $w("#heroSubtitle").text = "${subtext}";` : ""}`;
    case "features":
      return `  $w("#featuresTitle").text = "${text}";`;
    case "cards":
      return `  $w("#cardsSection").data = { title: "${text}", padding: ${padding} };`;
    case "cta":
      return `  $w("#ctaTitle").text = "${text}";\n  $w("#ctaButton").label = "${buttonText}";`;
    case "footer":
      return `  $w("#footer").text = "${text}";`;
    default:
      return `  $w("#section").text = "${text}";`;
  }
}

export function exportWix(layout: LayoutStructure): string {
  const body = layout.layout.map((b) => blockToWix(b)).join("\n\n");
  return `// Wix Velo Page Code
// Generated by Puff Design AI
// Paste this into your Wix page's code panel

import wixWindow from 'wix-window';

$w.onReady(function () {
${body}

  console.log("Puff Design layout applied.");
});
`;
}
