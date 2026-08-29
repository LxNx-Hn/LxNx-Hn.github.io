import { projects } from "./data/projects.js";

const projectList = document.querySelector("[data-project-list]");

const externalLinkAttributes = 'target="_blank" rel="noopener noreferrer"';

const renderList = (items) => items.map((item) => `<li>${item}</li>`).join("");

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
          근거 커밋 <span aria-hidden="true">↗</span>
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

      <div class="problem-block">
        <p class="content-label">한 줄 문제 정의</p>
        <p>${project.problem}</p>
      </div>

      <div class="project-columns">
        <div>
          <p class="content-label">내가 한 핵심 작업</p>
          <ul class="bullet-list">${renderList(project.contributions)}</ul>
        </div>
        <div>
          <p class="content-label">기술적으로 중요했던 부분</p>
          <ul class="bullet-list">${renderList(project.technical)}</ul>
        </div>
      </div>

      ${aiNote}

      <footer class="project-footer">
        <ul class="tech-list" aria-label="사용 기술">
          ${project.tech.map((tech) => `<li>${tech}</li>`).join("")}
        </ul>
        <div class="commit-list" aria-label="대표 커밋">${commits}</div>
      </footer>
    </article>`;
};

if (projectList) {
  projectList.innerHTML = projects.map(renderProject).join("");
}
