# 문종건 · 개인 포트폴리오

공개 GitHub 저장소와 대표 커밋을 바탕으로 만든 개인 포트폴리오입니다.

🔗 **라이브 사이트**: [https://lxnx-hn.github.io](https://lxnx-hn.github.io)

## 사이트 구성

- `/` — 5개 프로젝트 case study, AI 활용 방식, 실제 사용 스택과 작업 기준

루트 포트폴리오에서는 프로젝트와 직접 관련된 정보만 노출합니다.

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

프로젝트는 `소개 → 시각 자료 → 내가 맡은 부분 → Tech Stack → 프로젝트에서 고민했던 지점 → 확인한 결과 → 관련 코드` 순서로 정리합니다. 문제 사례는 표처럼 잘게 나누지 않고, 실제로 생각이 바뀐 순서가 보이도록 서술형 case study로 보여줍니다.