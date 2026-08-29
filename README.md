# 문종건 · 개인 포트폴리오

공개 GitHub 저장소와 대표 커밋을 바탕으로 만든 개인 포트폴리오입니다.

🔗 **라이브 사이트**: [https://lxnx-hn.github.io](https://lxnx-hn.github.io)

## 사이트 구성

- `/` — 문제 해결 방식, 5개 프로젝트, AI 활용 방식, 실제 사용 스택
- `/ai/` — 기존 AI 학습 기록 아카이브
- `/review/` — 기존 논문 리뷰 아카이브
- `/project/` — 기존 프로젝트 기록
- `/notes/` — 기존 Jekyll 메모

기존 아카이브 경로는 보존하고, 루트 홈만 개인 포트폴리오 화면으로 정리했습니다.

## 로컬 확인

```bash
npm run check
npm run build
python -m http.server 4173
```

브라우저에서 `http://127.0.0.1:4173/`을 엽니다.

## GitHub Pages 배포

이 저장소는 `main` 브랜치 루트를 GitHub Pages 소스로 사용합니다. `main`에 push하면 Pages가 정적 파일을 자동 배포하고, `.github/workflows/validate.yml`이 콘텐츠 계약과 빌드를 확인합니다.

## 콘텐츠 원칙

프로젝트는 `소개 → Tech Stack → 내가 맡은 부분 → 문제·원인·시도·해결·결과 → 프로젝트 결과 → 관련 커밋` 순서로 정리합니다. 문제 사례가 많은 프로젝트는 접이식 case study로 두어 개요는 빠르게 보고 필요할 때 구현·디버깅 과정을 깊게 확인할 수 있게 했습니다. 사실과 작업 범위는 공개 저장소의 README와 대표 커밋 diff를 기준으로 확인하며, 본인 작성 커밋과 AI 공동작성 커밋을 구분합니다. 재현할 수 없는 수치나 프로젝트 전체를 단독 구현했다는 표현은 포함하지 않습니다.

## 유지보수

기존 아카이브 포스트의 작성 규칙은 [docs/MAINTENANCE.md](./docs/MAINTENANCE.md)를 참고합니다. 루트 포트폴리오 프로젝트의 카드 데이터는 `data/projects.js`에서 관리합니다.
