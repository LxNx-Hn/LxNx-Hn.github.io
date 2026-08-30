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
  const requiredIds = ["top", "selected-work", "projects", "rag-journey", "ai-workflow", "experience", "stack", "approach", "contact"];

  assert.match(html, /<html lang="ko">/);
  for (const element of requiredElements) assert.ok(html.includes(element), `missing ${element}`);
  for (const id of requiredIds) assert.ok(html.includes(`id="${id}"`), `missing section #${id}`);
  assert.ok(html.includes("AI Engineer"));
  assert.ok(html.includes("mailto:lxnx.kiki@gmail.com"));
  assert.ok(html.includes('href="#contact">Contact</a>'));
  assert.ok(html.includes('data-copy-email="lxnx.kiki@gmail.com"'));
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
  assert.ok(script.includes("[data-rag-journey]"));
  assert.ok(script.includes("renderSelected"));
  assert.ok(script.includes("renderDiagram"));
  assert.ok(script.includes("renderEvidence"));
  assert.ok(script.includes("projects.filter((project) => project.featured).map(renderProject)"));
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
    "한국어 문자 비율 +0.2203 · 76쌍 중 68쌍 개선",
  );
  assert.equal(
    byTitle["CODE BLUE · PPO Boss Agent"].selected.evidence,
    "892 episodes · 199 clears · overall 22.3% → recent 100 80%",
  );
});

test("AI workflow is compact but keeps the four validation stages", async () => {
  const html = await read("index.html");
  assert.ok(html.includes('aria-label="AI 활용 4단계"'));
  for (const label of ["문제·구조 정리", "작업 분해·구현", "코드 검토", "실행 검증"]) {
    assert.ok(html.includes(label));
  }
});


test("RAG journey keeps the intended growth order", () => {
  const journey = projects
    .filter((project) => !project.featured && project.journey)
    .sort((a, b) => a.journey.order - b.journey.order);

  assert.deepEqual(journey.map((project) => project.title), [
    "창업지원 RAG 챗봇",
    "Hot's POD",
  ]);
});

test("CODE BLUE results link directly to result evidence", () => {
  const codeBlue = projects.find((project) => project.title === "CODE BLUE · PPO Boss Agent");
  assert.ok(codeBlue.evidence?.some((item) =>
    item.url.endsWith("/docs/rl_final/PPO_1M_CLEAR_FINAL_REPORT.md")
  ));
  assert.ok(codeBlue.evidence?.some((item) =>
    item.url.endsWith("/videos/05_late_clever_clear.mp4")
  ));
});


test("experience section records the verified timeline and technical leadership", async () => {
  const html = await read("index.html");
  for (const text of [
    "KT디지털인재장학생",
    "KT그룹희망나눔재단 · 2022.03–2026.12",
    "2025.08",
    "Project Leader · Technical Lead",
    "2026.07–08",
    "AI Team Lead",
    "동국대학교 WISE캠퍼스",
    "컴퓨터공학과 · 2021.03–2027.02",
    "2023.02–2024.08",
  ]) {
    assert.ok(html.includes(text), `missing experience text: ${text}`);
  }
});

test("contact works without requiring a configured mail client", async () => {
  const html = await read("index.html");
  const script = await read("script.js");

  assert.ok(html.includes('href="#contact">Contact</a>'));
  assert.ok(html.includes('data-copy-email="lxnx.kiki@gmail.com"'));
  assert.ok(script.includes("navigator.clipboard"));
  assert.ok(script.includes("fallbackCopyText"));
  assert.ok(script.includes('document.execCommand("copy")'));
});


test("retired startup RAG live demo is not exposed", async () => {
  const html = await read("index.html");
  const script = await read("script.js");
  const data = await read("data/projects.js");

  for (const source of [html, script, data]) {
    assert.equal(source.includes("dgu-chat-bot.netlify.app"), false);
    assert.equal(source.includes(">Live Demo<"), false);
  }
});

test("RAG growth cards keep decision, result, stack, and project evidence", async () => {
  const script = await read("script.js");
  for (const token of [
    "rag-journey-scope",
    "rag-journey-decisions",
    "rag-decision-result",
    "rag-result-list",
    "rag-stack-list",
    "rag-journey-media-grid",
  ]) {
    assert.ok(script.includes(token), `missing RAG journey structure: ${token}`);
  }
  assert.ok(script.includes("project.cases.slice(0, 2)"));
  assert.ok(script.includes("project.results.slice(0, 3)"));
});


test("Dongnet documents the LLM-to-bootstrap labeling process without treating it as human validation", () => {
  const dongnet = projects.find((project) => project.title === "동넷");

  assert.ok(dongnet.overview.includes("LLM으로 1차 평가"));
  assert.ok(dongnet.overview.includes("bootstrap 학습 데이터"));
  assert.ok(dongnet.contributions.some((item) => item.includes("LLM 평가를 그대로 정답으로 쓰지 않고")));
  assert.ok(dongnet.cases[0].solution.includes("6,822개 bootstrap label"));
  assert.ok(dongnet.cases[0].result.includes("실제 사용자 선호 검증 결과로 해석하지 않았습니다"));
});
