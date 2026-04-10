const fs = require("fs");
const path = require("path");

const rootIndexPath = path.resolve(process.cwd(), "index.html");
const publicIndexPath = path.resolve(process.cwd(), "public", "index.html");

if (fs.existsSync(rootIndexPath)) {
  console.log("[build] index.html found at project root");
  process.exit(0);
}

if (!fs.existsSync(publicIndexPath)) {
  console.error(
    "[build] Missing both root index.html and public/index.html. Cannot continue build.",
  );
  process.exit(1);
}

fs.copyFileSync(publicIndexPath, rootIndexPath);
console.log("[build] Restored missing root index.html from public/index.html");
