import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const site = "https://kamaleao.com";
const distDir = path.resolve("dist");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      // ignora assets internos (sitemap não precisa)
      if (e.name === "_astro") continue;
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

function toUrl(file) {
  const rel = file.replace(distDir, "").split(path.sep).join("/");
  // só index.html vira URL “bonita”
  if (!rel.endsWith("index.html")) return null;
  const urlPath = rel.slice(0, -"index.html".length);
  return site + (urlPath.startsWith("/") ? urlPath : "/" + urlPath);
}

(async () => {
  const files = await walk(distDir);
  const urls = files
    .map(toUrl)
    .filter(Boolean)
    // opcional: remover /novo/ se existir no dist (normalmente não existe)
    .filter((u) => !u.includes("/novo/"));

  const now = new Date().toISOString();

  const xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc><lastmod>${now}</lastmod></url>`).join("\n")}
</urlset>
`;

  await writeFile(path.join(distDir, "sitemap.xml"), xml, "utf8");
  console.log(`✅ sitemap.xml gerado com ${urls.length} URLs em dist/sitemap.xml`);
})();