export const projects = [
  {
    title: "동넷",
    repo: "https://github.com/LxNx-Hn/KT-10",
    label: "공공데이터 · 이동취약자 경로 추천",
    featured: true,
    problem:
      "부산 교통약자·이동취약자의 프로필과 이동 조건을 바탕으로 보행·대중교통 경로를 비교하는 맞춤형 경로 추천 PWA입니다.",
    contributions: [
      "TMAP 후보에 누락된 부산 시내버스 직행을 공식 BIMS 노선·정류장 데이터로 보완하는 비동기 수집기 구현",
      "BIMS 호출에 TTL cache·timeout·동시성 제한을 적용하고 Docker Compose·ECS 배포 설정 연결",
      "버스 번호·승하차 정류장명·좌표로 BIMS/TMAP의 동일 경로를 판별해 중복 병합",
      "화면 topN과 내부 후보 풀을 분리하고, 환승 최소 선택 시 환승 횟수를 모델 점수보다 먼저 적용",
      "동해선·부산김해경전철 오분류를 막고, 시간표가 연결되지 않은 철도 구간은 unavailable로 처리",
    ],
    technical: [
      "BIMS 정류장 연결선은 estimated로 밝히고, 평균 구간시간이 없으면 0으로 채우지 않고 후보에서 제외",
      "중복 병합 뒤 TMAP geometry를 유지하면서 BIMS 출처도 sources에 보존",
      "표시 개수와 수집 개수를 분리해 프로필 재평가 전 후보의 조기 탈락 방지",
      "연결되지 않은 외부 철도 시간표를 추정값으로 대체하지 않고 미연계 상태로 반환",
    ],
    tech: ["Python", "FastAPI", "React", "TypeScript", "TMAP · BIMS", "AWS ECS"],
    commits: [
      {
        label: "BIMS 직행 버스 보완",
        sha: "12e4b37",
        url: "https://github.com/LxNx-Hn/KT-10/commit/12e4b37bcb4f5564894718b5634636911e77ee0c",
      },
      {
        label: "BIMS/TMAP 중복 병합",
        sha: "cc188cc",
        url: "https://github.com/LxNx-Hn/KT-10/commit/cc188ccb3b3836871ab4630fc1f79beb5b63731b",
      },
      {
        label: "후보 풀·철도 정합성",
        sha: "c69be12",
        url: "https://github.com/LxNx-Hn/KT-10/commit/c69be12b69936cb64b27839ac024a0b6a6793ad9",
      },
    ],
  },
  {
    title: "동성로 창업지원 RAG 챗봇",
    repo: "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter",
    label: "RAG 상담 · Cloud 운영",
    featured: true,
    problem:
      "동성로 창업 희망자의 창업 현황·정책·검색 트렌드 질문을 분류하고, 지원 범위에 맞는 데이터 경로로 연결하는 RAG 상담형 서비스입니다.",
    contributions: [
      "프로젝트 구조와 FastAPI–React 연결, RAG 상담 흐름 설계",
      "NVIDIA NIM 기반 FastAPI gateway를 GCP Cloud Run에 배포하고 React·Netlify와 연결",
      "GitHub Secrets–Secret Manager–Cloud Run으로 이어지는 secret 주입 경로 구성",
      "Artifact Registry 정리 정책과 Cloud Run concurrency 설정으로 운영 비용 제어",
    ],
    technical: [
      "사용자 선택 category와 LLM 분류를 대조한 뒤 startup·policy·trend 서비스로 routing",
      "배포 workflow에서 image build·Cloud Run·health check·frontend build·Netlify를 연결",
      "모델 설정 누락은 503, NIM 요청 실패는 502로 드러내고 임의 답변으로 대체하지 않음",
    ],
    tech: ["FastAPI", "React", "RAG", "Cloud Run", "Secret Manager", "Netlify"],
    commits: [
      {
        label: "Cloud Run·Netlify 배포",
        sha: "d111c15",
        url: "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter/commit/d111c15ac7754c3cc96824f891d5e613a0efe532",
      },
      {
        label: "Secret 주입 모드 분리",
        sha: "63a51ac",
        url: "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter/commit/63a51acbdfa51ae147ca1c13936eb065439aaab1",
      },
      {
        label: "Cloud 비용 설정",
        sha: "3f2a33c",
        url: "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter/commit/3f2a33c9a92b619555850751005f9bae8d32be9f",
      },
    ],
  },
  {
    title: "Hot's POD",
    repo: "https://github.com/LxNx-Hn/Hot-s-Pod",
    label: "Hybrid Search · 서비스 정합성",
    featured: false,
    problem:
      "자연어로 오프라인 소모임을 찾고 참여·관리할 수 있도록, 키워드·벡터 유사도·RDB 조건을 결합한 하이브리드 검색과 운영 기능을 구현했습니다.",
    contributions: [
      "RDB filtering 이후 사라지는 similarity 순서를 복원하고 distance threshold를 0.73에서 0.715로 조정",
      "LLM 응답에서 내부 태그와 Markdown 문법이 노출되지 않도록 출력 규칙 구체화",
      "자식이 있는 댓글은 soft delete로 보존하고, 비어 있는 상위 댓글만 재귀 정리하도록 transaction 처리",
      "Pod 응답에 current_member를 추가하고 React Query cache invalidation으로 화면 상태 동기화",
      "수정·삭제 버튼 노출을 소유자·관리자에 대한 서버 권한 정책과 일치시킴",
    ],
    technical: [
      "장소·category 추출 → Sentence Transformer → ChromaDB → MariaDB filtering → LLM 응답 흐름",
      "RDB filtering 뒤에도 벡터 관련도 순위를 복원해 정렬 의미 유지",
      "계층형 댓글의 soft delete와 고아 상위 노드 정리를 한 transaction으로 처리",
      "Pydantic 응답 계약·React Query cache·권한 UI 사이의 데이터 일관성 확보",
    ],
    tech: ["FastAPI", "React", "ChromaDB", "MariaDB", "Sentence Transformers", "React Query"],
    commits: [
      {
        label: "RAG 결과 정렬",
        sha: "bde5c71",
        url: "https://github.com/LxNx-Hn/Hot-s-Pod/commit/bde5c71527ad0b3447d8b2f38f900aeea29ce6af",
      },
      {
        label: "계층형 댓글 삭제",
        sha: "4262beb",
        url: "https://github.com/LxNx-Hn/Hot-s-Pod/commit/4262beb4ea7093cb572fdaabb2a414f3272e4bed",
      },
      {
        label: "React Query 동기화",
        sha: "54749ae",
        url: "https://github.com/LxNx-Hn/Hot-s-Pod/commit/54749ae8c9c7e1038da2f115d10bc7854927cd72",
      },
    ],
    aiNote: {
      label: "AI 활용 사례",
      text: "MariaDB alias 오류의 재현 조건과 LEFT JOIN 전환 방향을 Copilot coding agent에 명세해 수정 PR을 생성하고, 공동작성자로 main에 병합했습니다.",
      url: "https://github.com/LxNx-Hn/Hot-s-Pod/commit/191a8eae5cce326ccd488e2ebddf51c10e54585a",
    },
  },
  {
    title: "M_RAG",
    repo: "https://github.com/LxNx-Hn/M_RAG",
    label: "RAG Evaluation · Reproducibility",
    featured: false,
    problem:
      "한국어 질문으로 영어 논문을 검색·답변할 때 HyDE·CAD·SCD가 미치는 영향을 고정 Paper-RAG 구조의 8개 조합으로 비교하고 재현 조건까지 검증했습니다.",
    contributions: [
      "152개 응답을 재분석해 기존 penalty_additive SCD v1의 null 결과를 그대로 보존",
      "기존 결과를 덮어쓰지 않고 literal reference_scd를 별도 실행 모드로 분리",
      "RAGAS 호출별 진단과 남은 null 셀만 재평가·병합하는 복구 loop 구현",
      "HyDE 입력·번역·생성 설정을 기록하고 null-cell 민감도 분석 추가",
    ],
    technical: [
      "null score를 0으로 채우지 않고 complete-case·null=0·null=1 민감도 결과를 분리",
      "비기본 SCD 실행에 별도 experiment ID와 명시적 confirmation 요구",
      "API key를 진단 파일에서 제거하고 judge 호출 뒤 결과를 atomic write",
      "직접 한국어 준수와 judge에 견고한 RAG 품질 효과를 구분해 해석",
    ],
    tech: ["Python", "PyTorch", "Transformers", "HyDE · CAD · SCD", "RAGAS", "PostgreSQL"],
    commits: [
      {
        label: "SCD null 결과 재분석",
        sha: "4a9f33a",
        url: "https://github.com/LxNx-Hn/M_RAG/commit/4a9f33afd5b7f7cb5f29713465f47ad9c013fe7a",
      },
      {
        label: "Reference SCD 분리",
        sha: "34c328e",
        url: "https://github.com/LxNx-Hn/M_RAG/commit/34c328e62ab043d8520515da96c98ce59e65ccf8",
      },
      {
        label: "실험 provenance 강화",
        sha: "10aa5d5",
        url: "https://github.com/LxNx-Hn/M_RAG/commit/10aa5d52b12c675ebb29070f50ac557e1b7554ea",
      },
    ],
  },
  {
    title: "AI_FinalTerm",
    repo: "https://github.com/LxNx-Hn/AI_FinalTerm",
    label: "Reinforcement Learning · Log Debugging",
    featured: false,
    problem:
      "사람과 동일한 가시 관측·조작 조건에서 Unity 보스전을 클리어하도록 PPO 에이전트의 action space·reward·action mask를 로그 기반으로 반복 설계했습니다.",
    contributions: [
      "50K 학습 로그에서 이동과 공격이 상호배타적인 단일 action 구조를 병목으로 진단",
      "Single Discrete [6]을 이동·공격이 독립적인 MultiDiscrete [5,2]로 변경",
      "공격 시도 보상을 제거하고 실제 보스 HP 감소가 확인된 hit에만 보상",
      "방향별 위험도를 계산해 이동·대기·공격 action mask 구성",
    ],
    technical: [
      "학습량을 늘리기 전에 action 구조와 reward 항목을 분리해 병목 탐색",
      "[5,2] 변경 뒤 공격 빈도와 damage 효과를 구분해 다음 병목 확인",
      "reward farming 제거와 클리어 성능 개선을 별개의 결과로 기록",
      "모든 이동이 geometry-blocked면 임의 방향 대신 WAIT 유지",
    ],
    tech: ["Unity", "C#", "ML-Agents", "PPO", "MultiDiscrete", "TensorBoard · ONNX"],
    commits: [
      {
        label: "50K 로그 병목 분석",
        sha: "f08cd01",
        url: "https://github.com/LxNx-Hn/AI_FinalTerm/commit/f08cd0153ed6c3941c334235b3fbae7aa73dc5f2",
      },
      {
        label: "Action Space [5,2]",
        sha: "6fedfb4",
        url: "https://github.com/LxNx-Hn/AI_FinalTerm/commit/6fedfb497ccb3d614c6d8a767f6f5b9e6306dc18",
      },
      {
        label: "Reward farming 제거",
        sha: "c84b1a4",
        url: "https://github.com/LxNx-Hn/AI_FinalTerm/commit/c84b1a4d89f055e11ee69e926d1df2314012e5e9",
      },
    ],
    aiNote: {
      label: "AI 공동작업",
      text: "대표 커밋은 Claude 공동작성 이력이 있습니다. AI와 분석·구현한 뒤 코드와 학습 보고서를 직접 대조한 작업으로 분리해 소개합니다.",
      url: "https://github.com/LxNx-Hn/AI_FinalTerm/commit/f08cd0153ed6c3941c334235b3fbae7aa73dc5f2",
    },
  },
];
