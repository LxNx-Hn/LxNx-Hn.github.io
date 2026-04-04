# KIKI Archive

**KIKI의 AI 공부 기록 + 프로젝트 정리 블로그**  
GitHub Pages로 배포되는 정적 사이트입니다.

🔗 **라이브 사이트**: [https://lxnx-hn.github.io](https://lxnx-hn.github.io)

---

## 섹션 구조

| 섹션 | 경로 | 설명 |
|---|---|---|
| 홈 | `/` | 프로필 + 섹션 내비게이션 |
| AI | `/ai/` | CNN · 딥러닝 · Keras · PyTorch 학습 기록 |
| Review | `/review/` | 논문 리뷰 |
| Project | `/project/` | 프로젝트 정리 |
| Notes | `/notes/` | 단상·메모 (Jekyll Markdown) |

---

## 포스트 추가 (빠른 시작)

1. 해당 섹션 폴더에 HTML 파일 추가 (예: `ai/my-post.html`)
2. 섹션 `index.html`의 `POSTS` 배열에 항목 추가

```js
// ai/index.html 안 POSTS 배열
{
  slug: "my-post",
  title: "포스트 제목",
  date: "2026-01-01",
  tags: ["AI", "CNN"],
  href: "my-post.html"
}
```

---

## 📖 유지보수 가이드

포스트·섹션 추가, 사이드바·레이아웃 수정, Jekyll Notes 관리 등  
모든 유지보수 방법은 아래 문서를 참고하세요.

**→ [docs/MAINTENANCE.md](./docs/MAINTENANCE.md)**

주요 항목:
- 전체 폴더 구조 설명
- 포스트 HTML 파일 작성 템플릿
- POSTS 배열 등록 방법
- 새 섹션 추가 절차
- 사이드바 / 토글 버튼 커스터마이즈
- CSS 변수(색상·폰트) 조정
- GitHub Pages 배포 확인

---

## 기술 스택

- **HTML / CSS / Vanilla JS** — 섹션 페이지 (빌드 도구 없음)
- **Jekyll** — Notes 섹션 (GitHub Pages 내장)
- **Google Fonts** — Gaegu (제목) + Pretendard (본문)
- **GitHub Pages** — 자동 배포 (`main` 브랜치 push)
