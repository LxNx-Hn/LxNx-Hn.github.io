import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const distRelation = relative(root, dist);

if (!distRelation || distRelation.startsWith(`..${sep}`) || distRelation === "..") {
  throw new Error("Build output must remain inside the project directory.");
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const staticFiles = ["styles.css", "script.js", "data/projects.js", "assets/og.png", "assets/favicon.svg"];

for (const file of staticFiles) {
  const destination = resolve(dist, file);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(resolve(root, file), destination);
}

let html = await readFile(resolve(root, "index.html"), "utf8");
const configuredBaseUrl = process.env.SITE_BASE_URL?.trim().replace(/\/$/, "");

if (configuredBaseUrl) {
  const baseUrl = new URL(configuredBaseUrl);
  if (baseUrl.protocol !== "https:" && baseUrl.hostname !== "127.0.0.1" && baseUrl.hostname !== "localhost") {
    throw new Error("SITE_BASE_URL must use HTTPS outside local development.");
  }

  html = html.replaceAll("https://lxnx-hn.github.io", baseUrl.href.replace(/\/$/, ""));
}

await writeFile(resolve(dist, "index.html"), html, "utf8");
await writeFile(resolve(dist, ".nojekyll"), "", "utf8");

console.log(`Built static site: ${dist}`);
