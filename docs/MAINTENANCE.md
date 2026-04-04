# KIKI Archive — 유지보수 가이드

> 이 문서만 보면 누구든 포스트·섹션을 추가하고, 레이아웃·사이드바를 수정할 수 있습니다.

---

## 목차

1. [전체 폴더 구조](#1-전체-폴더-구조)
2. [홈 페이지 구조 (`index.html`)](#2-홈-페이지-구조-indexhtml)
3. [섹션 페이지 구조 (AI / Review / Project)](#3-섹션-페이지-구조-ai--review--project)
4. [포스트(HTML) 파일 작성 방법](#4-포스트html-파일-작성-방법)
5. [POSTS 배열에 글 등록하기](#5-posts-배열에-글-등록하기)
6. [새 섹션 추가하기](#6-새-섹션-추가하기)
7. [홈에서 섹션 버튼 활성화하기](#7-홈에서-섹션-버튼-활성화하기)
8. [사이드바 / 토글 버튼 커스터마이즈](#8-사이드바--토글-버튼-커스터마이즈)
9. [스타일 · CSS 변수 조정](#9-스타일--css-변수-조정)
10. [Jekyll Notes 섹션 관리](#10-jekyll-notes-섹션-관리)
11. [GitHub Pages 배포](#11-github-pages-배포)
12. [자주 묻는 질문 (FAQ)](#12-자주-묻는-질문-faq)

---

## 1. 전체 폴더 구조

```
LxNx-Hn.github.io/
│
├── index.html              ← 홈 페이지 (프로필 사이드바 + 섹션 버튼)
│
├── ai/
│   ├── index.html          ← AI 섹션 (포스트 목록 사이드바 + iframe 뷰어)
│   ├── cnn.html            ← AI 포스트 예시
│   ├── post1.html
│   └── post2.html
│
├── review/
│   └── index.html          ← Review 섹션 (포스트 목록 사이드바 + iframe 뷰어)
│
├── project/
│   └── index.html          ← Project 섹션 (포스트 목록 사이드바 + iframe 뷰어)
│
├── notes/
│   ├── index.md            ← Notes 목록 (Jekyll)
│   └── 2026-04-04-welcome.md  ← Jekyll 포스트 예시
│
├── _layouts/
│   └── default.html        ← Jekyll 공통 레이아웃 (Notes 전용)
│
├── _config.yml             ← Jekyll 설정 (title, url 등)
│
└── docs/
    └── MAINTENANCE.md      ← 이 문서
```

### 핵심 구조 원칙

| 페이지 유형 | 특징 |
|---|---|
| **홈** (`index.html`) | 프로필 사이드바(좌) + 섹션 내비게이션(우). 사이드바는 토글 가능 |
| **섹션 인덱스** (`ai/index.html` 등) | 포스트 목록 사이드바(좌) + iframe 뷰어(우). 사이드바 토글 가능 |
| **포스트** (`ai/cnn.html` 등) | 독립 HTML 파일. iframe 안에 로드됨 |
| **Notes** (`notes/*.md`) | Jekyll Markdown. `_layouts/default.html` 템플릿 사용 |

---

## 2. 홈 페이지 구조 (`index.html`)

홈은 두 영역으로 나뉩니다.

```
┌────────────────── .layout ──────────────────┐
│  <aside class="card profile">  │  <main class="card main">  │
│  프로필 / 소개 / 링크          │  히어로 + 섹션 버튼        │
└────────────────────────────────────────────────┘
```

- **프로필 사이드바**: `.profile` 클래스. 아바타·이름·소개·링크 포함.
- **메인 영역**: `.main` 클래스. 히어로 배너 + `.section-btn` 버튼들.
- **토글 버튼** (`#sidebarToggle`): 상단 `.top` 영역 오른쪽에 위치. 클릭 시 `.layout`에 `sidebar-collapsed` 클래스 추가/제거.
- **상태 유지**: `localStorage` 키 `root_sidebar_hidden` 으로 새로고침 후에도 유지.

### 홈 사이드바 토글 동작 요약

```
버튼 클릭 → .layout.sidebar-collapsed 토글
→ CSS: grid-template-columns: 0px 1fr
→ .profile { display: none }
→ .main { max-width: 820px; margin: 0 auto }
```

---

## 3. 섹션 페이지 구조 (AI / Review / Project)

각 섹션(`ai/`, `review/`, `project/`)의 `index.html`은 동일한 패턴을 따릅니다.

```
┌──── .topbar ─────────────────────────────────┐
│  [☰ 목록] [← Home] / AI                     │
└──────────────────────────────────────────────┘
┌──── .body ───────────────────────────────────┐
│  <aside class="sidebar">  │  <section class="viewer">  │
│  포스트 목록 + 검색창      │  iframe (선택한 포스트)    │
└──────────────────────────────────────────────┘
```

- **상단 내비** (`.topbar`): `[☰ 목록]` 토글 버튼 + 홈 링크 + 현재 섹션명.
- **사이드바** (`.sidebar`): 검색창 + POSTS 배열로 렌더된 글 목록.
- **뷰어** (`.viewer`): 선택한 포스트를 iframe으로 로드.
- **플로팅 버튼** (`#floatOpen`): 사이드바가 닫힌 상태일 때 화면 왼쪽에 작게 나타나 다시 열 수 있게 함.
- **상태 유지**: `localStorage` 키 `ai_sidebar_hidden` / `review_sidebar_hidden` / `project_sidebar_hidden` 으로 관리.

### 섹션 사이드바 토글 동작 요약

```
[☰ 목록] 클릭 → .body.sidebar-collapsed 토글
→ CSS: grid-template-columns: 0px 1fr (사이드바 너비 0)
→ .sidebar: overflow hidden으로 안 보임
→ .float-open 버튼 등장 (position: fixed, 왼쪽)
→ .viewer-inner: max-width 900px, margin: 0 auto (가운데 정렬)
```

---

## 4. 포스트(HTML) 파일 작성 방법

포스트는 각 섹션 폴더(`ai/`, `review/`, `project/`) 안에 **독립 HTML 파일**로 작성합니다. iframe에서 로드되므로 완전한 HTML 문서여야 합니다.

### 최소 템플릿

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>글 제목</title>
  <style>
    /* iframe 안 기본 스타일 */
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 760px;
      margin: 0 auto;
      padding: 24px 18px 56px;
      color: #13151a;
      background: #ffffff;
      line-height: 1.75;
    }
    h1 { font-size: 26px; margin-bottom: 8px; }
    h2 { font-size: 20px; margin: 2em 0 .6em; }
    code {
      background: rgba(135,191,255,.15);
      border: 1px solid rgba(135,191,255,.35);
      border-radius: 4px;
      padding: 1px 5px;
      font-size: .9em;
    }
    pre {
      background: #f4f8ff;
      border: 1px solid rgba(19,21,26,.10);
      border-radius: 10px;
      padding: 14px 16px;
      overflow-x: auto;
    }
    pre code { background: none; border: none; padding: 0; }
  </style>
</head>
<body>
  <h1>글 제목</h1>
  <p>작성일: 2026-01-01</p>

  <h2>섹션 1</h2>
  <p>내용...</p>

  <h2>섹션 2</h2>
  <pre><code>코드 예시</code></pre>
</body>
</html>
```

### 파일명 규칙

- 소문자 + 하이픈 사용: `my-post.html`, `cnn-basics.html`
- 공백·특수문자 사용 금지

---

## 5. POSTS 배열에 글 등록하기

포스트 HTML 파일을 만든 뒤, 해당 섹션의 `index.html` 안 `const POSTS = [...]` 배열에 항목을 추가합니다.

### 위치 찾기

각 섹션 `index.html`의 `<script>` 안에 아래 주석 블록이 있습니다.

```js
// ──────────────────────────────────────────────────────────────────────
// AI 포스트 목록
// 새 글 추가 방법: /ai/ 폴더에 HTML 파일 추가 후, 아래 배열에 항목 하나 추가
// ──────────────────────────────────────────────────────────────────────
const POSTS = [
  // 여기에 추가
];
```

### 항목 형식

```js
{
  slug: "고유-식별자",      // URL 해시에 사용됨, 영문+하이픈 권장
  title: "포스트 제목",
  date: "2026-01-01",
  tags: ["태그1", "태그2"],
  href: "파일명.html"       // 해당 섹션 폴더 기준 상대 경로
}
```

### AI 섹션 예시 (`ai/index.html`)

```js
const POSTS = [
  {
    slug: "cnn",
    title: "CNN Shape 변환 해설 — CIFAR-10 & 한글 감성분석",
    date: "2026-04-04",
    tags: ["CNN", "CIFAR-10", "Keras", "PyTorch"],
    href: "cnn.html"
  },
  {
    slug: "my-new-post",           // ← 새 글 추가
    title: "Transformer 기초",
    date: "2026-05-01",
    tags: ["Transformer", "NLP"],
    href: "transformer-basics.html"
  }
];
```

> **주의**: `slug`는 배열 안에서 중복되면 안 됩니다. URL 해시(`#slug`)로도 사용됩니다.

---

## 6. 새 섹션 추가하기

예시: `notes2` 섹션 추가

### 6-1. 폴더와 `index.html` 생성

```
notes2/
└── index.html
```

`ai/index.html`을 복사해서 다음 부분만 수정합니다.

| 수정 위치 | 수정 내용 |
|---|---|
| `<title>` | `AI — KIKI Archive` → `Notes2 — KIKI Archive` |
| `.topbar` 안 `<span class="page-title">` | `AI` → `Notes2` |
| `STORAGE_KEY` 변수 | `"ai_sidebar_hidden"` → `"notes2_sidebar_hidden"` |
| `.sidebar-label` 텍스트 | `AI 포스트` → `Notes2 포스트` |
| `const POSTS` 배열 | 새 글 목록으로 교체 |
| 주석의 경로 설명 | `/ai/` → `/notes2/` |

### 6-2. 포스트 파일 추가

섹션 4번 템플릿으로 HTML 파일을 `notes2/` 안에 만들고, `POSTS` 배열에 등록합니다.

### 6-3. 홈에서 섹션 버튼 활성화

섹션 7번을 참고하세요.

---

## 7. 홈에서 섹션 버튼 활성화하기

`index.html`의 `.sections` div 안에 주석 처리된 섹션 버튼이 있습니다.

```html
<!-- 주석 해제 전 -->
<!--
<a class="section-btn" href="/review/">
  <div>
    <div class="section-btn-title">Review</div>
    <div class="section-btn-desc">논문 리뷰</div>
  </div>
  <div class="section-btn-arrow">→</div>
</a>
-->

<!-- 주석 해제 후 (콘텐츠 준비 완료 시) -->
<a class="section-btn" href="/review/">
  <div>
    <div class="section-btn-title">Review</div>
    <div class="section-btn-desc">논문 리뷰</div>
  </div>
  <div class="section-btn-arrow">→</div>
</a>
```

### 완전히 새 섹션 버튼 추가 예시

```html
<a class="section-btn" href="/notes2/">
  <div>
    <div class="section-btn-title">Notes2</div>
    <div class="section-btn-desc">새 노트 섹션 설명</div>
  </div>
  <div class="section-btn-arrow">→</div>
</a>
```

---

## 8. 사이드바 / 토글 버튼 커스터마이즈

### 8-1. 홈 프로필 사이드바 너비 변경

`index.html` CSS에서 grid 첫 열 값을 수정합니다.

```css
/* 현재: 320px */
.layout {
  grid-template-columns: 320px 1fr;
}
```

예: `260px`로 줄이기 → `grid-template-columns: 260px 1fr;`

### 8-2. 섹션 사이드바 너비 변경

각 섹션 `index.html` CSS에서 `--sidebar-w` 변수를 수정합니다.

```css
:root {
  --sidebar-w: 300px; /* 원하는 값으로 수정 */
}
```

### 8-3. 토글 버튼 스타일 변경

**홈 토글 버튼** (`index.html`):

```css
.sidebar-toggle {
  padding: 6px 11px;
  border-radius: 8px;
  font-size: 12px;
  /* 배경색, 테두리 등 자유롭게 수정 */
}
```

**섹션 토글 버튼** (각 섹션 `index.html`):

동일한 `.sidebar-toggle` 클래스. 아이콘은 `<span class="toggle-icon">☰</span>`, 레이블은 `<span id="toggleLabel">목록</span>`.

### 8-4. 플로팅 "목록 열기" 버튼 위치 변경

사이드바가 닫혔을 때 좌측에 뜨는 버튼(`.float-open`)의 위치를 바꾸려면:

```css
/* 현재: 화면 왼쪽 고정 */
.float-open {
  position: fixed;
  top: 60px;
  left: 0;
  border-left: none;
  border-radius: 0 8px 8px 0;
}

/* 예: 우하단으로 변경 */
.float-open {
  position: fixed;
  bottom: 24px;
  right: 24px;
  left: auto;
  top: auto;
  border-left: 1px solid rgba(19,21,26,.15);
  border-radius: 8px;
}
```

### 8-5. localStorage 키 이름 정리

| 페이지 | localStorage 키 |
|---|---|
| 홈 (`index.html`) | `root_sidebar_hidden` |
| AI (`ai/index.html`) | `ai_sidebar_hidden` |
| Review (`review/index.html`) | `review_sidebar_hidden` *(추가 예정)* |
| Project (`project/index.html`) | `project_sidebar_hidden` *(추가 예정)* |

> **주의**: 홈과 섹션은 서로 다른 `localStorage` 키를 사용합니다. 홈의 사이드바 상태는 섹션에 영향을 주지 않고, 그 반대도 마찬가지입니다.

---

## 9. 스타일 · CSS 변수 조정

모든 색상과 공통 값은 각 HTML 파일 상단의 `:root { }` 블록에서 관리합니다.

### 공통 변수 (홈 기준)

```css
:root {
  --sky: #87BFFF;          /* 포인트 컬러 (하늘색) */
  --sky-soft: #BFE2FF;     /* 연한 하늘색 */
  --ink: #13151a;          /* 기본 텍스트 색 */
  --muted: #5b6472;        /* 보조 텍스트 색 */
  --paper: #ffffff;        /* 카드 배경 */
  --paper-2: #f5f3ee;      /* 페이지 배경 */
  --line: rgba(19,21,26,.10); /* 구분선 */
  --shadow: 0 10px 30px rgba(18,38,63,.10); /* 카드 그림자 */
  --radius: 18px;          /* 카드 모서리 둥글기 */
}
```

### 포인트 컬러를 초록으로 바꾸기 예시

```css
:root {
  --sky: #6FD08C;
  --sky-soft: #B8F0C8;
}
```

### 폰트 변경

현재 폰트:
- **제목**: Gaegu (손글씨 느낌)
- **본문**: Pretendard (깔끔한 한국어)

다른 Google Fonts로 바꾸려면 `<head>` 안 `<link>` 와 `font-family` 를 함께 수정합니다.

---

## 10. Jekyll Notes 섹션 관리

`notes/` 폴더는 Jekyll Markdown 파일을 사용합니다.

### 새 노트 추가

1. `notes/` 폴더에 `YYYY-MM-DD-제목.md` 형식으로 파일 생성.

```markdown
---
layout: default
title: "노트 제목"
date: 2026-05-01
---

# 노트 내용

Markdown 으로 작성.
```

2. `notes/index.md` 의 목록에 링크 추가.

```markdown
- [2026-05-01 노트 제목](./2026-05-01-노트제목/)
```

### Jekyll 레이아웃 (`_layouts/default.html`)

Notes 페이지에만 사용되는 공통 템플릿입니다. 수정 시 모든 Notes 페이지에 영향을 줍니다.

- `{{ page.title }}` — Markdown front matter의 `title`
- `{{ content }}` — Markdown 본문
- `{{ page.date | date: "%Y-%m-%d" }}` — 날짜

---

## 11. GitHub Pages 배포

이 레포지토리는 GitHub Pages로 자동 배포됩니다.

- **배포 URL**: `https://lxnx-hn.github.io`
- **배포 트리거**: `main` 브랜치에 push 시 자동 빌드·배포
- **Jekyll 설정**: `_config.yml` (title, url, baseurl 등)

### 배포 확인 방법

1. GitHub → Repository → **Actions** 탭에서 빌드 상태 확인
2. 초록 체크(✓) 표시되면 배포 완료

### `_config.yml` 주요 설정

```yaml
title: KIKI Archive
description: AI공부 기록 + 프로젝트정리
baseurl: ""
url: "https://lxnx-hn.github.io"
```

---

## 12. 자주 묻는 질문 (FAQ)

### Q. 새 포스트를 추가했는데 목록에 안 뜹니다.

`POSTS` 배열에 항목을 추가했는지 확인하세요. 파일만 만든다고 목록에 자동으로 추가되지 않습니다.

### Q. 섹션 페이지에서 사이드바가 두 개 뜹니다.

이전 PR에서 중복 코드가 삽입된 경우입니다. `index.html`에 `.sidebar` 태그가 하나만 있는지 확인하고, 중복된 `<aside>` 또는 `<div id="list">` 블록을 제거하세요.

### Q. 홈에서 사이드바가 뜨면 안 되는데 뜹니다.

홈(`index.html`)의 사이드바는 **프로필 패널**입니다. 포스트 목록이 홈에 뜬다면, 섹션 `index.html`의 코드가 `index.html` 루트에 잘못 복사된 것입니다. 각 파일을 분리해서 유지하세요.

### Q. 사이드바 닫았는데 본문이 왼쪽에 붙습니다.

`ai/index.html` CSS에서 `.body.sidebar-collapsed .viewer-inner`의 `max-width`와 `margin: 0 auto`가 있는지 확인하세요.

```css
.body.sidebar-collapsed .viewer-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}
```

### Q. 모바일에서 레이아웃이 깨집니다.

각 섹션 `index.html` 하단의 `@media (max-width: 720px)` 블록이 있는지 확인하세요. 없으면 아래를 추가합니다.

```css
@media (max-width: 720px) {
  body { height: auto; overflow: auto; }
  .body {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
  .body.sidebar-collapsed {
    grid-template-columns: 1fr;
    grid-template-rows: 0px 1fr;
  }
  .sidebar {
    border-right: none;
    border-bottom: 1px solid var(--line);
    max-height: 240px;
    overflow: hidden;
  }
  .body.sidebar-collapsed .sidebar {
    max-height: 0;
    border-bottom: none;
  }
}
```

### Q. Review / Project 섹션이 홈에서 보이지 않습니다.

`index.html`에서 해당 섹션 버튼이 `<!-- 주석 -->` 처리되어 있습니다. 섹션 7번을 참고해 주석을 해제하세요.

---

*최종 업데이트: 2026-04-04 — 사이드바 토글·플로팅 버튼·중복 UI 제거 이후 구조 반영*
