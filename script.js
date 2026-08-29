import { projects } from "./data/projects.js";

const projectList = document.querySelector("[data-project-list]");
const externalLinkAttributes = 'target="_blank" rel="noopener noreferrer"';

const renderList = (items) => items.map((item) => `<li>${item}</li>`).join("");

const renderStack = (stack) =>
  stack
    .map(
      (group) => `
        <div class="stack-group">
          <strong>${group.label}</strong>
          <p>${group.items.join(" · ")}</p>
        </div>`,
    )
    .join("");

const renderCase = (item, index) => `
  <article class="case-study">
    <h4>${String(index + 1).padStart(2, "0")} · ${item.title}</h4>
    <dl class="case-rows">
      <div class="case-row"><dt>문제</dt><dd>${item.problem}</dd></div>
      <div class="case-row"><dt>원인</dt><dd>${item.cause}</dd></div>
      <div class="case-row"><dt>확인 / 시도</dt><dd>${item.approach}</dd></div>
      <div class="case-row"><dt>해결</dt><dd>${item.solution}</dd></div>
      <div class="case-row case-row-result"><dt>결과</dt><dd>${item.result}</dd></div>
    </dl>
  </article>`;

const renderProject = (project, index) => {
  const classes = ["project-card", project.featured ? "project-card-featured" : ""]
    .filter(Boolean)
    .join(" ");

  const commits = project.commits
    .map(
      (commit) => `
        <a class="commit-link" href="${commit.url}" ${externalLinkAttributes}>
          <span>${commit.label}</span>
          <code>${commit.sha}</code>
          <span aria-hidden="true">↗</span>
        </a>`,
    )
    .join("");

  const aiNote = project.aiNote
    ? `
      <aside class="project-ai-note">
        <div>
          <span>${project.aiNote.label}</span>
          <p>${project.aiNote.text}</p>
        </div>
        <a href="${project.aiNote.url}" ${externalLinkAttributes}>
          관련 커밋 <span aria-hidden="true">↗</span>
        </a>
      </aside>`
    : "";

  return `
    <article class="${classes}" aria-labelledby="project-title-${index + 1}">
      <header class="project-header">
        <div>
          <p class="project-label">${project.label}</p>
          <h3 id="project-title-${index + 1}">${project.title}</h3>
        </div>
        <a class="repo-link" href="${project.repo}" ${externalLinkAttributes}>
          Repository <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section class="project-overview" aria-label="프로젝트 소개">
        <p class="content-label">프로젝트 소개</p>
        <p>${project.overview}</p>
      </section>

      <section class="project-stack" aria-label="Tech Stack">
        <p class="content-label">Tech Stack</p>
        <div class="stack-groups">${renderStack(project.stack)}</div>
      </section>

      <section class="project-role" aria-label="내가 맡은 부분">
        <p class="content-label">내가 맡은 부분</p>
        <ul class="bullet-list">${renderList(project.contributions)}</ul>
      </section>

      <section class="project-cases" aria-label="문제 해결 과정">
        <p class="content-label">문제 해결 과정</p>
        <div class="case-study-list">${project.cases.map(renderCase).join("")}</div>
      </section>

      ${aiNote}

      <footer class="project-footer">
        <p class="content-label">관련 코드 / 커밋</p>
        <div class="commit-list" aria-label="대표 커밋">${commits}</div>
      </footer>
    </article>`;
};

if (projectList) {
  projectList.innerHTML = projects.map(renderProject).join("");
}
