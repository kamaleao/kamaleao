const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

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
  if (!html) return "";
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

/*
  Corrige textos que podem estar:
  - UTF8 correto
  - Latin1 interpretado como UTF8
  - UTF8 quebrado salvo como Latin1
*/
function smartFix(text) {
  if (!text) return "";

  try {
    const latinConverted = Buffer.from(text, "latin1").toString("utf8");

    // Se depois da conversão aparecer caractere inválido, mantém original
    if (latinConverted.includes("�") || latinConverted.includes("ï¿½")) {
      return text;
    }

    return latinConverted;
  } catch {
    return text;
  }
}

async function migrate() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "kamaleao",
  });

  const [rows] = await connection.execute(`
    SELECT e_id, w_id, title, thumb, contents, date
    FROM bhost_entries
    WHERE w_id IN (2, 33, 61)
  `);

  let total = 0;

  for (const row of rows) {
    const blogName = blogsMap[row.w_id];
    if (!blogName) continue;

    const fixedTitle = smartFix(row.title || "");
    const fixedContent = smartFix(row.contents || "");

    const slug = generateSlug(fixedTitle);
    const cleanContent = removeScripts(fixedContent);
    const formattedDate = convertTimestamp(row.date);

    const blogDir = path.join(outputBasePath, blogName);
    ensureDir(blogDir);

    const fileName = `${row.e_id}-${slug}.md`;
    const filePath = path.join(blogDir, fileName);

    const fileContent = `---
title: "${fixedTitle.replace(/"/g, '\\"')}"
id: ${row.e_id}
blog: "${blogName}"
date: ${formattedDate}
thumb: "${row.thumb || ""}"
---

${cleanContent}
`;

    fs.writeFileSync(filePath, fileContent, "utf8");
    total++;
  }

  await connection.end();

  console.log(`Migração concluída. ${total} posts criados.`);
}

migrate().catch(console.error);