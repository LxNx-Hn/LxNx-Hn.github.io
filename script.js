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

const renderCase = (item, index, featured) => `
  <details class="story-block" ${featured && index === 0 ? "open" : ""}>
    <summary>
      <span class="story-index">${String(index + 1).padStart(2, "0")}</span>
      <strong>${item.title}</strong>
      <span class="story-toggle" aria-hidden="true">＋</span>
    </summary>
    <div class="story-copy">
      <p class="story-lead">${item.problem}</p>
      <p>${item.cause} ${item.approach}</p>
      <p>${item.solution}</p>
      <p class="story-result"><span>확인한 결과</span>${item.result}</p>
    </div>
  </details>`;

const renderMedia = (media) => {
  if (!media?.items?.length) return "";

  const items = media.items
    .map(
      (item) => `
        <figure class="project-media-item">
          <div class="project-media-frame">
            <img src="${item.src}" alt="${item.alt}" loading="lazy" decoding="async" />
          </div>
          <figcaption>${item.caption}</figcaption>
        </figure>`,
    )
    .join("");

  const links = media.links?.length
    ? `<div class="project-resource-links">${media.links
        .map(
          (link) => `<a href="${link.url}" ${externalLinkAttributes}>${link.label} <span aria-hidden="true">↗</span></a>`,
        )
        .join("")}</div>`
    : "";

  return `
    <section class="project-media" aria-label="프로젝트 화면 및 자료">
      <div class="project-media-grid">${items}</div>
      ${links}
    </section>`;
};

const renderResults = (items) =>
  items?.length
    ? `
      <section class="project-results" aria-label="프로젝트 결과">
        <p class="content-label">확인한 결과</p>
        <ul class="result-list">${renderList(items)}</ul>
      </section>`
    : "";

const renderProject = (project, index) => {
  const classes = ["project-chapter", project.featured ? "project-featured" : ""]
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
        <div class="project-heading-copy">
          <p class="project-label">${project.label}</p>
          <h3 id="project-title-${index + 1}">${project.title}</h3>
          <p class="project-overview-copy">${project.overview}</p>
        </div>
        <a class="repo-link" href="${project.repo}" ${externalLinkAttributes}>
          Repository <span aria-hidden="true">↗</span>
        </a>
      </header>

      ${renderMedia(project.media)}

      <div class="project-main-grid">
        <section class="project-role" aria-label="내가 맡은 부분">
          <p class="content-label">내가 맡은 부분</p>
          <ul class="bullet-list">${renderList(project.contributions)}</ul>
        </section>

        <aside class="project-stack" aria-label="Tech Stack">
          <p class="content-label">Tech Stack</p>
          <div class="stack-groups">${renderStack(project.stack)}</div>
        </aside>
      </div>

      <section class="project-stories" aria-label="프로젝트에서 고민했던 지점">
        <div class="story-heading">
          <p class="content-label">프로젝트에서 고민했던 지점</p>
          <p>구현 과정에서 기준을 다시 잡거나 판단이 필요했던 지점을 정리했습니다.</p>
        </div>
        <div class="story-list">${project.cases.map((item, caseIndex) => renderCase(item, caseIndex, project.featured)).join("")}</div>
      </section>

      ${renderResults(project.results)}
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
