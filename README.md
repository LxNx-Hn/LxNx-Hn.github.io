# 문종건 · AI Engineer Portfolio

RAG, Search, Ranking, Reinforcement Learning을 실험에서 서비스까지 연결한 프로젝트를 정리한 개인 포트폴리오입니다.

🔗 **Live**: https://lxnx-hn.github.io  
✉️ **Contact**: lxnx.kiki@gmail.com

## 사이트 구성

- Selected Work — 대표 프로젝트 3개 요약
- Project Case Studies — 5개 프로젝트의 역할, 시각 자료, 판단 과정, 결과와 코드
- AI in Development — AI를 설계·구현·검토·검증에 사용하는 방식
- Working Stack / Working Notes

## 로컬 확인

```bash
npm run check
npm run build
python -m http.server 4173 -d dist
```

브라우저에서 `http://127.0.0.1:4173/`을 엽니다.

## GitHub Pages 배포

`main`에 push하면 GitHub Actions가 `npm run check → npm run build`를 실행하고, 생성된 `dist/`만 GitHub Pages artifact로 배포합니다.

과거 archive 페이지는 저장소와 배포 대상에서 제거했고, production에는 포트폴리오에 필요한 정적 파일만 포함합니다.

## 콘텐츠 원칙

프로젝트 상세는 `소개 → 시각 자료/구조 → 내가 맡은 부분 → Tech Stack → 프로젝트에서 고민했던 지점 → 확인한 결과 → 관련 코드` 순서로 구성합니다. 상단 Selected Work는 빠른 탐색용이며 상세 Case Study를 대체하지 않습니다.
