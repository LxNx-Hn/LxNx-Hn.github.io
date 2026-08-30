import { projects } from "./data/projects.js";

const projectList = document.querySelector("[data-project-list]");
const selectedProjectList = document.querySelector("[data-selected-project-list]");
const ragJourney = document.querySelector("[data-rag-journey]");
const externalLinkAttributes = 'target="_blank" rel="noopener noreferrer"';

const renderList = (items) => items.map((item) => `<li>${item}</li>`).join("");

const renderStack = (stack) =>
  stack.map((group) => `
    <div class="stack-group">
      <strong>${group.label}</strong>
      <p>${group.items.join(" · ")}</p>
    </div>`).join("");

const renderSelected = (project) => {
  const image = project.selected?.thumbnail || project.media?.items?.[0];
  return `
    <article class="selected-card">
      ${image ? `
        <a class="selected-image" href="#project-${project.slug}" aria-label="${project.title} Case Study로 이동">
          <img src="${image.src}" alt="" loading="eager" decoding="async" />
        </a>` : ""}
      <div class="selected-copy">
        <p class="project-label">${project.label}</p>
        <h3>${project.title}</h3>
        <p class="project-intro selected-intro">${project.intro}</p>
        <p class="selected-summary">${project.selected.summary}</p>
        <dl class="selected-meta">
          <div><dt>Role</dt><dd>${project.selected.role}</dd></div>
          <div><dt>Evidence</dt><dd>${project.selected.evidence}</dd></div>
        </dl>
        <a class="selected-link" href="#project-${project.slug}">Case Study <span aria-hidden="true">↓</span></a>
      </div>
    </article>`;
};

const renderCase = (item, index) => `
  <details class="story-block">
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
  const items = media.items.map((item) => `
    <figure class="project-media-item">
      <div class="project-media-frame">
        <img src="${item.src}" alt="${item.alt}" loading="lazy" decoding="async" />
      </div>
      <figcaption>${item.caption}</figcaption>
    </figure>`).join("");

  const links = media.links?.length
    ? `<div class="project-resource-links">${media.links.map((link) =>
        `<a href="${link.url}" ${externalLinkAttributes}>${link.label} <span aria-hidden="true">↗</span></a>`).join("")}</div>`
    : "";

  return `
    <section class="project-media" aria-label="프로젝트 화면 및 자료">
      <div class="project-media-grid${media.layout ? ` project-media-grid--${media.layout}` : ""}">${items}</div>
      ${links}
    </section>`;
};

const renderDiagram = (diagram) => {
  if (!diagram?.nodes?.length) return "";
  return `
    <section class="project-diagram" aria-label="${diagram.title}">
      <p class="content-label">${diagram.title}</p>
      <div class="diagram-flow">
        ${diagram.nodes.map((node, index) => `
          <div class="diagram-step">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${node.title}</strong>
            <small>${node.note}</small>
          </div>
          ${index < diagram.nodes.length - 1 ? '<span class="diagram-arrow" aria-hidden="true">→</span>' : ""}
        `).join("")}
      </div>
    </section>`;
};

const renderResults = (items) =>
  items?.length ? `
    <section class="project-results" aria-label="프로젝트 결과">
      <p class="content-label">확인한 결과</p>
      <ul class="result-list">${renderList(items)}</ul>
    </section>` : "";

const renderEvidence = (items) =>
  items?.length ? `
    <section class="project-evidence" aria-label="결과 근거">
      <p class="content-label">Evidence</p>
      <div class="project-evidence-list">
        ${items.map((item) => `
          <a href="${item.url}" ${externalLinkAttributes}>
            <strong>${item.label}</strong>
            <span>${item.note}</span>
            <i aria-hidden="true">↗</i>
          </a>`).join("")}
      </div>
    </section>` : "";

const renderJourney = (project) => {
  const resources = [
    ...(project.journey.links || []),
    ...(project.media?.links || []),
  ].filter((link, index, all) =>
    all.findIndex((candidate) => candidate.url === link.url) === index
  );

  const media = project.media?.items?.length
    ? `
      <div class="rag-journey-media-grid">
        ${project.media.items.slice(0, 2).map((item) => `
          <figure>
            <div class="rag-journey-media">
              <img src="${item.src}" alt="${item.alt}" loading="lazy" decoding="async" />
            </div>
            <figcaption>${item.caption}</figcaption>
          </figure>`).join("")}
      </div>`
    : "";

  const decisions = project.cases.slice(0, 2).map((item) => `
    <article class="rag-decision">
      <strong>${item.title}</strong>
      <p>${item.problem}</p>
      <p class="rag-decision-result"><span>확인한 결과</span>${item.result}</p>
    </article>`).join("");

  const stack = project.stack.map((group) =>
    `<div><strong>${group.label}</strong><span>${group.items.slice(0, 3).join(" · ")}</span></div>`
  ).join("");

  return `
    <article class="rag-journey-card" id="journey-${project.slug}">
      <header class="rag-journey-header">
        <div class="rag-journey-index">0${project.journey.order}</div>
        <div>
          <p class="project-label">${project.journey.stage}</p>
          <h3>${project.title}</h3>
          <p class="project-intro rag-journey-intro">${project.intro}</p>
          <p class="rag-journey-role">${project.journey.role}</p>
          <p class="rag-journey-summary">${project.journey.summary}</p>
        </div>
        <a class="rag-repo-link" href="${project.repo}" ${externalLinkAttributes}>Repository <span aria-hidden="true">↗</span></a>
      </header>

      <div class="rag-journey-body">
        <div class="rag-journey-main">
          <section class="rag-journey-scope">
            <p class="content-label">내가 맡은 부분</p>
            <ul class="bullet-list">${renderList(project.contributions.slice(0, 3))}</ul>
          </section>

          <section class="rag-journey-decisions">
            <p class="content-label">핵심 판단</p>
            <div class="rag-decision-grid">${decisions}</div>
          </section>
        </div>

        <aside class="rag-journey-side">
          <section>
            <p class="content-label">확인한 결과</p>
            <ul class="result-list rag-result-list">${renderList(project.results.slice(0, 3))}</ul>
          </section>

          <section class="rag-journey-stack">
            <p class="content-label">Tech Stack</p>
            <div class="rag-stack-list">${stack}</div>
          </section>

          <div class="rag-journey-links">
            ${resources.map((link) =>
              `<a href="${link.url}" ${externalLinkAttributes}>${link.label} <span aria-hidden="true">↗</span></a>`
            ).join("")}
          </div>
        </aside>
      </div>

      ${media}
      ${project.diagram ? renderDiagram(project.diagram) : ""}
    </article>`;
};

const renderProject = (project, index) => {
  const commits = project.commits.map((commit) => `
    <a class="commit-link" href="${commit.url}" ${externalLinkAttributes}>
      <span>${commit.label}</span><code>${commit.sha}</code><span aria-hidden="true">↗</span>
    </a>`).join("");

  const aiNote = project.aiNote ? `
    <aside class="project-ai-note">
      <div><span>${project.aiNote.label}</span><p>${project.aiNote.text}</p></div>
      <a href="${project.aiNote.url}" ${externalLinkAttributes}>관련 커밋 <span aria-hidden="true">↗</span></a>
    </aside>` : "";

  return `
    <article class="project-chapter" id="project-${project.slug}" aria-labelledby="project-title-${index + 1}">
      <header class="project-header">
        <div class="project-heading-copy">
          <p class="project-label">${project.label}</p>
          <h3 id="project-title-${index + 1}">${project.title}</h3>
          <p class="project-intro project-intro-main">${project.intro}</p>
          <p class="project-overview-copy">${project.overview}</p>
        </div>
        <a class="repo-link" href="${project.repo}" ${externalLinkAttributes}>Repository <span aria-hidden="true">↗</span></a>
      </header>

      ${renderMedia(project.media)}
      ${renderDiagram(project.diagram)}

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
        <div class="story-list">${project.cases.map(renderCase).join("")}</div>
      </section>

      ${renderResults(project.results)}
      ${renderEvidence(project.evidence)}
      ${aiNote}

      <footer class="project-footer">
        <p class="content-label">관련 코드 / 커밋</p>
        <div class="commit-list" aria-label="대표 커밋">${commits}</div>
      </footer>
    </article>`;
};

if (selectedProjectList) {
  selectedProjectList.innerHTML = projects.filter((project) => project.featured).map(renderSelected).join("");
}
if (projectList) {
  projectList.innerHTML = projects.filter((project) => project.featured).map(renderProject).join("");
}
if (ragJourney) {
  ragJourney.innerHTML = projects
    .filter((project) => !project.featured && project.journey)
    .sort((a, b) => a.journey.order - b.journey.order)
    .map(renderJourney)
    .join("");
}


const copyEmailButton = document.querySelector("[data-copy-email]");
const copyStatus = document.querySelector("[data-copy-status]");

const fallbackCopyText = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
};

if (copyEmailButton) {
  copyEmailButton.addEventListener("click", async () => {
    const email = copyEmailButton.dataset.copyEmail;
    let copied = false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        copied = true;
      } else {
        copied = fallbackCopyText(email);
      }
    } catch {
      copied = fallbackCopyText(email);
    }

    copyEmailButton.textContent = copied ? "Copied" : "Copy failed";
    if (copyStatus) {
      copyStatus.textContent = copied
        ? "이메일 주소를 복사했습니다."
        : `복사하지 못했습니다. ${email} 주소를 직접 복사해주세요.`;
    }

    window.setTimeout(() => {
      copyEmailButton.textContent = "Copy Email";
    }, 1800);
  });
}
