const fs = require("fs");
const path = require("path");

const sqlFilePath = path.join(__dirname, "../kamaleao.sql");
const outputBasePath = path.join(__dirname, "../src/content/posts");

const blogsMap = {
  2: "saoluis",
  33: "gospel",
  61: "mascotes",
};

function generateSlug(title) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function removeScripts(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, "");
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function convertTimestamp(timestamp) {
  return new Date(parseInt(timestamp) * 1000).toISOString();
}

// -----------------------------

const sql = fs.readFileSync(sqlFilePath, "utf8");

// pega tudo depois de VALUES até o ponto e vírgula final
const match = sql.match(/INSERT INTO `bhost_entries`[\s\S]+?VALUES\s*([\s\S]+?);/);

if (!match) {
  console.log("Nenhum INSERT encontrado.");
  process.exit();
}

let valuesBlock = match[1].trim();

// remove quebra de linha inicial
if (valuesBlock.startsWith("\n")) {
  valuesBlock = valuesBlock.slice(1);
}

// transforma em JSON válido
valuesBlock = valuesBlock
  .replace(/\r?\n/g, "")
  .replace(/\),\s*\(/g, ")|(");

const rows = valuesBlock.split("|");

let total = 0;

rows.forEach((row) => {
  const cleanRow = row.replace(/^\(/, "").replace(/\)$/, "");

  // divide respeitando aspas simples
  const fields = cleanRow.match(/'(?:\\'|[^'])*'|[^,]+/g);

  if (!fields || fields.length < 10) return;

  const e_id = fields[0].trim();
  const w_id = parseInt(fields[1]);
  const title = fields[4].replace(/^'|'$/g, "");
  const thumb = fields[5].replace(/^'|'$/g, "");
  const contents = fields[6].replace(/^'|'$/g, "");
  const dateRaw = fields[9].trim();

  if (!blogsMap[w_id]) return;

  const blogName = blogsMap[w_id];
  const slug = generateSlug(title);
  const cleanContent = removeScripts(contents);
  const formattedDate = convertTimestamp(dateRaw);

  const blogDir = path.join(outputBasePath, blogName);
  ensureDir(blogDir);

  const fileName = `${e_id}-${slug}.md`;
  const filePath = path.join(blogDir, fileName);

  const fileContent = `---
title: "${title.replace(/"/g, '\\"')}"
id: ${e_id}
blog: "${blogName}"
date: ${formattedDate}
thumb: "${thumb}"
---

${cleanContent}
`;

  fs.writeFileSync(filePath, fileContent, "utf8");
  total++;
});

console.log(`Migração concluída. ${total} posts criados.`);