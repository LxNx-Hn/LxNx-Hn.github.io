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
  assert.equal(projects.filter((project) => project.featured).length, 3);
  assert.equal(new Set(projects.map((project) => project.slug)).size, projects.length);

  const commitUrls = new Set();
  for (const project of projects) {
    assert.ok(project.title && project.overview && project.label && project.slug);
    assert.ok(project.stack.length >= 3 && project.stack.length <= 5);
    assert.ok(project.contributions.length >= 3 && project.contributions.length <= 5);
    assert.ok(project.cases.length >= 2 && project.cases.length <= 5);
    assert.ok(project.commits.length >= 3 && project.commits.length <= 6);
    assert.ok(project.results.length >= 3 && project.results.length <= 6);

    if (project.featured) {
      assert.ok(project.selected?.summary && project.selected?.role && project.selected?.evidence);
    }

    for (const group of project.stack) {
      assert.ok(group.label);
      assert.ok(group.items.length >= 1);
    }

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

    if (project.media) {
      for (const item of project.media.items) {
        assert.match(item.src, /^https:\/\/raw\.githubusercontent\.com\/LxNx-Hn\//);
        assert.ok(item.alt && item.caption);
      }
    }

    if (project.diagram) {
      assert.ok(project.diagram.title);
      assert.ok(project.diagram.nodes.length >= 3);
    }
  }
});

test("document keeps the required semantic structure and contact", async () => {
  const html = await read("index.html");
  const requiredElements = ["<header", "<nav", "<main", "<section", "<footer"];
  const requiredIds = ["top", "selected-work", "projects", "ai-workflow", "stack", "approach", "contact"];

  assert.match(html, /<html lang="ko">/);
  for (const element of requiredElements) assert.ok(html.includes(element), `missing ${element}`);
  for (const id of requiredIds) assert.ok(html.includes(`id="${id}"`), `missing section #${id}`);
  assert.ok(html.includes("AI Engineer"));
  assert.ok(html.includes("mailto:lxnx.kiki@gmail.com"));
  assert.equal(html.includes("AI Archive"), false);
  assert.equal(html.includes("/notes/"), false);
  assert.equal(html.includes("\uFFFD"), false);
});

test("project renderer keeps case studies closed and renders selected work", async () => {
  const script = await read("script.js");
  const labels = ["내가 맡은 부분", "Tech Stack", "프로젝트에서 고민했던 지점", "관련 코드 / 커밋"];
  let previous = -1;
  for (const label of labels) {
    const current = script.indexOf(label);
    assert.ok(current > previous, `wrong or missing project section order: ${label}`);
    previous = current;
  }

  assert.ok(script.includes("[data-selected-project-list]"));
  assert.ok(script.includes("renderSelected"));
  assert.ok(script.includes("renderDiagram"));
  assert.ok(script.includes('class="story-block"'));
  assert.equal(/<details class="story-block"[^>]*open/.test(script), false);
  assert.equal(script.includes("\uFFFD"), false);
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

test("local build source references resolve", async () => {
  const html = await read("index.html");
  for (const path of ["styles.css", "script.js", "assets/og.png", "assets/favicon.svg"]) {
    await stat(resolve(root, path));
    assert.ok(html.includes(path));
  }
  await stat(resolve(root, "data/projects.js"));
});


test("selected work evidence stays precise", () => {
  const byTitle = Object.fromEntries(projects.map((project) => [project.title, project]));
  assert.equal(
    byTitle["동넷"].selected.evidence,
    "380 OD · 1,137 routes · bootstrap NDCG@3 0.9166–0.9596",
  );
  assert.equal(
    byTitle["M_RAG"].selected.evidence,
    "한국어 비율 +0.2203 · 76쌍 중 68쌍 개선",
  );
  assert.equal(
    byTitle["CODE BLUE · PPO Boss Agent"].selected.evidence,
    "1M PPO · 199 boss clears · recent 100 clear rate 80%",
  );
});

test("AI workflow is compact but keeps the four validation stages", async () => {
  const html = await read("index.html");
  assert.ok(html.includes('aria-label="AI 활용 4단계"'));
  for (const label of ["문제·구조 정리", "작업 분해·구현", "코드 검토", "실행 검증"]) {
    assert.ok(html.includes(label));
  }
});
