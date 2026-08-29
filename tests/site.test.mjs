import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { projects } from "../data/projects.js";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const read = (path) => readFile(resolve(root, path), "utf8");

const allowedRepositories = new Set([
  "https://github.com/LxNx-Hn/KT-10",
  "https://github.com/LxNx-Hn/Hot-s-Pod",
  "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter",
  "https://github.com/LxNx-Hn/M_RAG",
  "https://github.com/LxNx-Hn/AI_FinalTerm",
]);

test("project data stays inside the verified public repository set", () => {
  assert.equal(projects.length, 5);
  assert.deepEqual(new Set(projects.map((project) => project.repo)), allowedRepositories);

  const commitUrls = new Set();
  for (const project of projects) {
    assert.ok(project.title && project.overview && project.label);
    assert.ok(project.stack.length >= 3 && project.stack.length <= 5);
    assert.ok(project.contributions.length >= 3 && project.contributions.length <= 5);
    assert.ok(project.cases.length >= 2 && project.cases.length <= 7);
    assert.ok(project.commits.length >= 3 && project.commits.length <= 6);

    for (const group of project.stack) {
      assert.ok(group.label);
      assert.ok(group.items.length >= 1);
    }

    assert.ok(project.results.length >= 3 && project.results.length <= 7);

    for (const item of project.cases) {
      for (const key of ["title", "problem", "cause", "approach", "solution", "result"]) {
        assert.ok(item[key], `${project.title}: missing case field ${key}`);
      }
    }

    for (const commit of project.commits) {
      assert.match(commit.sha, /^[0-9a-f]{7}$/);
      assert.ok(commit.url.startsWith(`${project.repo}/commit/`));
      assert.equal(commitUrls.has(commit.url), false, `duplicate commit URL: ${commit.url}`);
      commitUrls.add(commit.url);
    }

    if (project.aiNote) {
      assert.match(project.aiNote.url, /^https:\/\/github\.com\/LxNx-Hn\//);
    }

    if (project.media) {
      assert.ok(project.media.items.length >= 1 && project.media.items.length <= 3);
      for (const item of project.media.items) {
        assert.match(item.src, /^https:\/\/raw\.githubusercontent\.com\/LxNx-Hn\//);
        assert.ok(item.alt && item.caption);
      }
      for (const link of project.media.links ?? []) {
        assert.match(link.url, /^https:\/\//);
        assert.ok(link.label);
      }
    }
  }
});

test("document keeps the required semantic structure and anchor targets", async () => {
  const html = await read("index.html");
  const requiredElements = ["<header", "<nav", "<main", "<section", "<footer"];
  const requiredIds = ["top", "projects", "ai-workflow", "stack", "approach"];

  assert.match(html, /<html lang="ko">/);
  for (const element of requiredElements) assert.ok(html.includes(element), `missing ${element}`);
  for (const id of requiredIds) assert.ok(html.includes(`id="${id}"`), `missing section #${id}`);
  assert.ok(html.includes('href="#projects"'));
  assert.ok(html.includes('class="skip-link"'));
  assert.equal(html.includes("\uFFFD"), false, "index.html contains a replacement character");
  assert.equal(html.includes("KT 지원"), false);
});

test("project renderer follows portfolio reading order", async () => {
  const script = await read("script.js");
  const labels = ["내가 맡은 부분", "Tech Stack", "프로젝트에서 고민했던 지점", "관련 코드 / 커밋"];
  let previous = -1;
  for (const label of labels) {
    const current = script.indexOf(label);
    assert.ok(current > previous, `wrong or missing project section order: ${label}`);
    previous = current;
  }
  assert.ok(script.includes('target="_blank" rel="noopener noreferrer"'));
  assert.ok(script.includes('aria-labelledby="project-title-'));
  assert.ok(script.includes('class="story-block"'));
  assert.equal(script.includes("\uFFFD"), false, "script.js contains a replacement character");
});

test("social preview is a valid large landscape PNG", async () => {
  const imagePath = resolve(root, "assets/og.png");
  const image = await readFile(imagePath);
  const imageStat = await stat(imagePath);

  assert.ok(imageStat.size > 100_000);
  assert.equal(image.subarray(1, 4).toString("ascii"), "PNG");
  const width = image.readUInt32BE(16);
  const height = image.readUInt32BE(20);
  assert.ok(width >= 1200 && height >= 630, `${width}x${height} is too small`);
  assert.ok(width / height > 1.8 && width / height < 2.0, `${width}x${height} has the wrong aspect ratio`);
});

test("local asset references resolve to files", async () => {
  const html = await read("index.html");
  for (const path of ["styles.css", "script.js", "assets/og.png", "assets/favicon.svg"]) {
    await stat(resolve(root, path));
    assert.ok(html.includes(path));
  }
  await stat(resolve(root, "data/projects.js"));
});
