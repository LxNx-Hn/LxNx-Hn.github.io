export const projects = [
  {
    "title": "동넷",
    "repo": "https://github.com/LxNx-Hn/KT-10",
    "label": "이동취약자 맞춤형 경로 추천 · 데이터 수집 / 모델 학습 / 서비스 연결",
    "featured": true,
    "overview": "이동취약자가 단순 최단시간이 아니라 경사, 도보거리, 환승, 계단·승강기, 저상버스, 그늘 같은 조건까지 보고 경로를 비교할 수 있도록 만든 팀 프로젝트입니다. 여러 경로 공급원에서 실제 후보를 모으고 공간·환경 데이터를 피처로 만든 뒤, 6개 사용자 프로필별 XGBRanker로 다시 평가해 서비스에 연결했습니다. 380개 OD에서 1,137개 실제 경로 후보를 만들고 6개 프로필 기준 6,822개 평가 데이터를 구성했습니다.",
    "stack": [
      {
        "label": "AI / Ranking",
        "items": [
          "XGBRanker",
          "Learning to Rank",
          "Profile-aware Ranking",
          "NDCG@3"
        ]
      },
      {
        "label": "Data / Spatial",
        "items": [
          "Pandas",
          "GeoPandas",
          "Shapely",
          "TMAP",
          "ODsay",
          "BIMS",
          "DEM / 공간 레이어"
        ]
      },
      {
        "label": "Backend",
        "items": [
          "Python",
          "FastAPI",
          "PostgreSQL"
        ]
      },
      {
        "label": "Frontend / Infra",
        "items": [
          "React",
          "TypeScript",
          "Docker",
          "AWS ECS",
          "GitHub Actions"
        ]
      }
    ],
    "contributions": [
      "실제 경로 후보를 수집하고 경사·도보·환승·접근성·환경 정보를 하나의 feature snapshot으로 만드는 AI 파이프라인을 다뤘습니다.",
      "6개 프로필별 평가 기준과 학습 데이터를 구성하고, 실제 OD 단위 holdout을 적용한 XGBRanker를 학습·검증했습니다.",
      "학습 artifact의 feature schema, 프로필별 검증 지표, hash와 모델 파일을 확인한 뒤에만 runtime에서 사용할 수 있게 검증 로직을 넣었습니다.",
      "ODsay·TMAP·BIMS 등 외부 공급원의 지연·누락·중복을 다루고, 사용자에게 보여줄 후보가 실제 데이터 범위 안에서 유지되도록 수집·병합 로직을 수정했습니다.",
      "화면에 보여줄 topN과 내부 후보군을 분리하고, 사용자 옵션으로 다시 평가하기 전에 경로가 조기 탈락하지 않도록 추천 흐름을 조정했습니다."
    ],
    "cases": [
      {
        "title": "추천 모델을 평가할 때 같은 실제 OD가 학습과 검증에 섞이지 않게 해야 했음",
        "problem": "경로 후보가 여러 query group으로 쌓이다 보니 같은 출발지·도착지에서 나온 후보가 train과 validation에 동시에 들어갈 수 있었습니다.",
        "cause": "단순 group_id만 기준으로 분리하면 실제로 같은 OD인지까지 보장하지 못했습니다.",
        "approach": "점수가 높게 나오는지보다 검증 데이터가 정말 학습과 분리돼 있는지부터 확인했습니다.",
        "solution": "실제 OD를 나타내는 holdout_group_id를 별도로 두고, 같은 OD는 항상 같은 split에 들어가도록 검증 로직을 추가했습니다.",
        "result": "6개 프로필 모두 304개 train OD와 76개 validation OD로 분리했고, NDCG@3 0.9166~0.9596 범위의 baseline을 확인했습니다."
      },
      {
        "title": "외부 API는 정상인데 실제 직행 버스가 후보에서 빠졌음",
        "problem": "TMAP 호출 자체는 성공했지만 실제 존재하는 일부 직행 버스가 결과에 나오지 않았습니다.",
        "cause": "후처리 문제가 아니라 공급원이 해당 경로 자체를 반환하지 않는 경우였습니다.",
        "approach": "없는 경로를 추정해서 만들기보다 다른 공공 교통 데이터에서 후보를 보완할 수 있는지 확인했습니다.",
        "solution": "BIMS 노선·정류장 데이터를 추가로 수집해 직행 버스 후보를 보완하고 timeout, cache, 동시 요청 상한도 함께 넣었습니다.",
        "result": "한 공급원의 누락 때문에 실제 직행 경로가 사라지는 문제를 줄였습니다."
      },
      {
        "title": "BIMS를 붙이자 같은 버스가 다른 ID로 두 번 들어옴",
        "problem": "TMAP과 BIMS에서 같은 노선이 서로 다른 stop id와 geometry로 들어와 중복 후보가 생겼습니다.",
        "cause": "공급원마다 식별자 체계가 달라 route id 비교만으로는 같은 버스인지 알 수 없었습니다.",
        "approach": "사용자가 같은 경로라고 보는 기준을 다시 잡았습니다.",
        "solution": "버스 번호, 승하차 정류장명, 좌표 근접도를 함께 비교해 병합하고, 공급원 정보는 따로 남겼습니다.",
        "result": "여러 데이터 공급원을 쓰면서도 같은 버스가 중복으로 보이는 문제를 줄였습니다."
      },
      {
        "title": "경로가 많아지는 것보다 틀린 값을 확정값처럼 보여주는 게 더 위험했음",
        "problem": "일부 철도 노선은 잘못 해석됐고 BIMS에는 실제 도로 선형이 없으며, 연결되지 않은 시간표도 있었습니다.",
        "cause": "서로 다른 데이터 형식을 하나의 route schema로 합치다 보면 없는 값을 임의로 채우기 쉬웠습니다.",
        "approach": "사용자 입장에서는 경로 하나가 덜 보이는 것보다 잘못된 시간을 믿는 쪽이 더 큰 문제라고 봤습니다.",
        "solution": "추정 geometry는 estimated, 확인하지 못한 시간표는 unavailable로 남기고 철도 노선 해석도 다시 맞췄습니다.",
        "result": "확인된 정보와 추정·미확인 정보를 결과 안에서 구분할 수 있게 했습니다."
      }
    ],
    "commits": [
      {
        "label": "프로필별 XGBRanker baseline",
        "sha": "c75ab5f",
        "url": "https://github.com/LxNx-Hn/KT-10/commit/c75ab5f70ba6f2e63c4a8204ccbc097627e858f0"
      },
      {
        "label": "OD holdout 계약",
        "sha": "0d0f687",
        "url": "https://github.com/LxNx-Hn/KT-10/commit/0d0f687eaeb2cb575566a04ea0c1eca3bbe19e46"
      },
      {
        "label": "ODsay 지연 TMAP hedge",
        "sha": "2949c50",
        "url": "https://github.com/LxNx-Hn/KT-10/commit/2949c50586723b559e761e414ba751192d57d856"
      },
      {
        "label": "BIMS 직행 버스 보완",
        "sha": "12e4b37",
        "url": "https://github.com/LxNx-Hn/KT-10/commit/12e4b37bcb4f5564894718b5634636911e77ee0c"
      },
      {
        "label": "BIMS/TMAP 중복 병합",
        "sha": "cc188cc",
        "url": "https://github.com/LxNx-Hn/KT-10/commit/cc188ccb3b3836871ab4630fc1f79beb5b63731b"
      },
      {
        "label": "후보 풀·철도 정합성",
        "sha": "c69be12",
        "url": "https://github.com/LxNx-Hn/KT-10/commit/c69be12b69936cb64b27839ac024a0b6a6793ad9"
      }
    ],
    "results": [
      "380개 OD · 1,137개 실제 경로 후보 · 6,822개 프로필 평가 데이터",
      "6개 프로필 XGBRanker baseline · NDCG@3 0.9166~0.9596",
      "실제 OD holdout: 프로필별 304 train / 76 validation OD",
      "경로 후보 수집부터 feature snapshot, 학습 artifact, runtime 추천까지 한 흐름으로 연결",
      "현재 모델은 bootstrap_baseline이며 사람 평가 기반 human_validated 모델로 과장하지 않도록 구분"
    ]
  },
  {
    "title": "창업지원 RAG 챗봇",
    "repo": "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter",
    "label": "KT 디지털인재장학생 · 첫 RAG 프로젝트 · Project Leader",
    "featured": true,
    "overview": "창업 희망자가 창업 현황, 정책, 검색 트렌드를 질문하면 먼저 질문의 범위를 분류하고 각 질문에 맞는 데이터 경로에서 답을 찾도록 만든 RAG 챗봇입니다. 제가 RAG를 처음 서비스 형태로 다뤄본 프로젝트였고, Project Leader로 전체 아키텍처, FastAPI–React 연결, 배포와 운영 문서까지 맡아 팀 기능을 하나의 서비스로 연결했습니다.",
    "stack": [
      {
        "label": "AI",
        "items": [
          "RAG",
          "Sentence Transformers",
          "PyTorch / Transformers",
          "NVIDIA NIM"
        ]
      },
      {
        "label": "Backend",
        "items": [
          "Python",
          "FastAPI"
        ]
      },
      {
        "label": "Frontend",
        "items": [
          "React",
          "JavaScript",
          "CSS"
        ]
      },
      {
        "label": "Cloud / Ops",
        "items": [
          "Docker",
          "GitHub Actions",
          "GCP Cloud Run",
          "Secret Manager",
          "Artifact Registry",
          "Netlify"
        ]
      }
    ],
    "contributions": [
      "질문 분류 → category별 데이터 source → RAG 응답으로 이어지는 전체 서비스 흐름과 FastAPI–React 구조를 설계했습니다.",
      "팀원별로 나뉜 데이터·AI·프론트 기능의 입력과 출력 형식을 맞추고 변경 시 연결 부분을 다시 확인할 수 있도록 문서와 배포 기준을 정리했습니다.",
      "GPU 서버를 직접 상시 운영하는 대신 NVIDIA NIM을 호출하는 경량 FastAPI gateway를 Cloud Run에 배포하고 Netlify frontend와 연결했습니다.",
      "GitHub Actions에서 image build, Cloud Run 배포, health check, frontend build, Netlify 배포까지 이어지는 CI/CD를 구성했습니다.",
      "Secret Manager, Cloud Run scale limit, Artifact Registry 정리 정책을 넣어 API key와 데모 비용을 운영 조건 안에서 관리했습니다."
    ],
    "cases": [
      {
        "title": "모든 질문을 바로 LLM에 넘기면 서비스가 어디까지 답해야 하는지 흐려짐",
        "problem": "창업지원 서비스가 다루지 않는 질문에도 모델이 답을 만들고, 질문마다 필요한 데이터가 다른데도 같은 검색 흐름을 타게 됐습니다.",
        "cause": "답변 전에 질문의 목적과 서비스 범위를 나누는 routing 단계가 없었습니다.",
        "approach": "더 큰 모델을 쓰기보다 먼저 어떤 질문을 어느 데이터로 보내야 하는지 나눴습니다.",
        "solution": "질문을 창업·정책·트렌드·범위 외로 분류하고 분류 결과에 맞는 검색 경로만 실행했습니다. classifier 출력도 한 글자로 제한했습니다.",
        "result": "프로젝트 기준 Accuracy 97.14%, Recall 97.94%, Precision 98.07%, F1 97.60을 확인했습니다."
      },
      {
        "title": "팀원이 만든 기능이 각각 돌아가도 한 서비스에서는 바로 이어지지 않았음",
        "problem": "데이터 처리, 분류, RAG 응답, frontend가 따로 개발되면서 한쪽 형식이 바뀌면 다른 기능이 깨질 수 있었습니다.",
        "cause": "기능별 구현은 있었지만 서비스 전체에서 공유하는 입력·출력 기준이 필요했습니다.",
        "approach": "각 기능을 대신 만드는 것보다 전체 흐름에서 값이 어디서 들어오고 나가는지를 맞췄습니다.",
        "solution": "FastAPI endpoint와 frontend 호출 형식을 정리하고 category와 data source 연결, runtime config, health endpoint를 문서로 남겼습니다.",
        "result": "팀 기능을 하나의 사용자 흐름으로 연결하고 이후 배포 환경 변경에도 같은 구조를 유지할 수 있게 했습니다."
      },
      {
        "title": "로컬에서 돌아가는 챗봇을 실제 데모로 올리려면 모델보다 운영 문제가 더 남았음",
        "problem": "GPU 실행 환경, API key, backend URL, frontend 배포가 서로 다른 환경에 있었습니다.",
        "cause": "모델 서버를 그대로 상시 운영하면 데모 목적에 비해 비용과 설정이 과했습니다.",
        "approach": "무엇을 직접 호스팅하고 무엇을 API로 분리할지 다시 봤습니다.",
        "solution": "NVIDIA NIM을 호출하는 경량 FastAPI gateway만 Cloud Run에 올리고, Netlify frontend와 GitHub Actions로 연결했습니다. Secret Manager와 scale/image 정리 정책도 같이 적용했습니다.",
        "result": "AI 기능뿐 아니라 secret과 배포 비용까지 포함한 데모 운영 흐름을 만들었습니다."
      }
    ],
    "commits": [
      {
        "label": "Cloud Run·Netlify 배포",
        "sha": "d111c15",
        "url": "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter/commit/d111c15ac7754c3cc96824f891d5e613a0efe532"
      },
      {
        "label": "Secret Manager 배포 모드",
        "sha": "63a51ac",
        "url": "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter/commit/63a51acbdfa51ae147ca1c13936eb065439aaab1"
      },
      {
        "label": "Cloud Run scale 제한",
        "sha": "74e88ab",
        "url": "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter/commit/74e88aba215f91bc558347aac5003dad3721a2fb"
      },
      {
        "label": "데모 비용 설정",
        "sha": "3f2a33c",
        "url": "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter/commit/3f2a33c9a92b619555850751005f9bae8d32be9f"
      }
    ],
    "results": [
      "질문 분류 Accuracy 97.14% · Recall 97.94% · Precision 98.07% · F1 97.60",
      "질문 분류 → 데이터 경로 → RAG 응답으로 이어지는 서비스 구조 연결",
      "Cloud Run backend + Netlify frontend + GitHub Actions CI/CD 구성",
      "Secret Manager와 Cloud Run/Artifact Registry 비용 제어까지 데모 운영 범위에 포함"
    ]
  },
  {
    "title": "Hot's POD",
    "repo": "https://github.com/LxNx-Hn/Hot-s-Pod",
    "label": "자연어 기반 소모임 검색 · RAG 재구현 + 서비스 정합성",
    "featured": false,
    "overview": "첫 RAG 프로젝트 이후 구조를 제 손으로 다시 만들어보기 위해 진행한 자연어 기반 소모임 검색 서비스입니다. 장소·category를 해석하고 Sentence Transformer로 벡터 검색한 뒤 MariaDB 조건을 적용하고 LLM이 결과를 설명하도록 연결했습니다. 검색 기능만 만든 것이 아니라 회원, 권한, 댓글, join/leave, cache처럼 실제 서비스에서 서로 맞아야 하는 상태도 함께 다뤘습니다.",
    "stack": [
      {
        "label": "AI / Search",
        "items": [
          "Sentence Transformers",
          "ChromaDB",
          "Vector Search",
          "LLM",
          "Hybrid Search"
        ]
      },
      {
        "label": "Backend",
        "items": [
          "FastAPI",
          "MariaDB",
          "Pydantic",
          "SQL"
        ]
      },
      {
        "label": "Frontend",
        "items": [
          "React",
          "React Query"
        ]
      },
      {
        "label": "Engineering",
        "items": [
          "Auth / Cookie",
          "Role Permission",
          "Transaction",
          "Cache Invalidation"
        ]
      }
    ],
    "contributions": [
      "자연어 입력을 Vector Search → RDB 조건 필터 → LLM 응답으로 연결하는 검색 흐름을 다시 직접 구성했습니다.",
      "벡터 검색의 similarity가 DB 조회 뒤 사라지는 문제를 찾아 최종 결과까지 점수를 유지하도록 수정했습니다.",
      "실제 검색 결과를 보면서 similarity threshold를 조정하고, 검색용 내부 정보와 사용자에게 보여줄 LLM 출력 규칙을 분리했습니다.",
      "검색·모임 상세·참가 상태가 화면에서 어긋나는 부분은 React Query와 backend 응답을 같이 보며 맞췄습니다."
    ],
    "cases": [
      {
        "title": "벡터 검색에서는 맞는 결과인데 DB 조건을 거치면 순서가 바뀜",
        "problem": "ChromaDB에서는 관련도가 높았던 모임이 장소·category 조건을 적용한 최종 결과에서는 아래로 밀렸습니다.",
        "cause": "RDB에서 id 목록을 다시 조회하는 과정에서 벡터 similarity 순서가 사라졌습니다.",
        "approach": "threshold만 계속 바꾸지 않고 Vector Search → DB filtering → 최종 응답 순서로 같은 후보의 점수를 따라갔습니다.",
        "solution": "similarity map을 최종 단계까지 유지하고 DB 결과를 다시 관련도 순으로 정렬했습니다.",
        "result": "조건 필터를 적용하면서도 의미 검색의 순서를 유지할 수 있게 했습니다."
      },
      {
        "title": "검색 임계값을 높이면 엉뚱한 결과는 줄지만 필요한 모임도 같이 사라짐",
        "problem": "자연어 검색에서 너무 느슨하면 관련 없는 모임이 섞이고, 너무 엄격하면 표현이 조금 다른 모임까지 빠졌습니다.",
        "cause": "embedding distance에 하나의 정답 threshold가 있는 게 아니라 실제 데이터와 사용자 표현에 따라 trade-off가 있었습니다.",
        "approach": "숫자 하나를 이론적으로 정하기보다 여러 자연어 검색 결과를 직접 비교하면서 어디까지 관련 결과로 볼지 확인했습니다.",
        "solution": "검색 결과를 반복 확인하며 threshold를 조정했고, 그 뒤에도 DB filtering과 최종 정렬이 같은 기준을 유지하는지 같이 봤습니다.",
        "result": "단순 keyword 검색보다 자연어 표현을 받아들이면서도 관련 없는 결과가 과하게 섞이지 않도록 기준을 조정했습니다."
      },
      {
        "title": "검색을 위해 만든 내부 표현이 사용자 답변에 그대로 노출됨",
        "problem": "검색 단계에서 사용한 내부 tag와 Markdown 표현이 LLM의 최종 답변에 섞여 나왔습니다.",
        "cause": "retrieval context와 user-facing response가 같은 표현 규칙을 공유하고 있었습니다.",
        "approach": "검색 문맥을 단순하게 없애기보다 내부에서 필요한 정보와 최종 출력 규칙을 따로 두는 쪽으로 봤습니다.",
        "solution": "system message와 출력 규칙을 분리해 내부 tag와 불필요한 Markdown을 최종 응답에서 제외했습니다.",
        "result": "검색에는 구조화된 문맥을 쓰면서 사용자에게는 자연스러운 답변만 보여줄 수 있게 했습니다."
      }
    ],
    "aiNote": {
      "label": "AI 코딩 도구 활용",
      "text": "MariaDB correlated subquery alias 오류에서는 Copilot coding agent가 LEFT JOIN 집계 대안을 작성했습니다. 전체 파일을 맡기지 않고 오류 범위와 기존 query 구조를 기준으로 diff를 확인한 뒤 실행 결과로 적용 여부를 판단했습니다.",
      "url": "https://github.com/LxNx-Hn/Hot-s-Pod/commit/191a8eae5cce326ccd488e2ebddf51c10e54585a"
    },
    "commits": [
      {
        "label": "RAG 결과 정렬",
        "sha": "bde5c71",
        "url": "https://github.com/LxNx-Hn/Hot-s-Pod/commit/bde5c71527ad0b3447d8b2f38f900aeea29ce6af"
      },
      {
        "label": "LLM 출력 규칙",
        "sha": "50a42ce",
        "url": "https://github.com/LxNx-Hn/Hot-s-Pod/commit/50a42cede6af5d0da5b32c8992a5c82b2bc1a9a5"
      },
      {
        "label": "계층형 댓글 삭제",
        "sha": "4262beb",
        "url": "https://github.com/LxNx-Hn/Hot-s-Pod/commit/4262beb4ea7093cb572fdaabb2a414f3272e4bed"
      },
      {
        "label": "회원 상태 cache 동기화",
        "sha": "35fc4cc",
        "url": "https://github.com/LxNx-Hn/Hot-s-Pod/commit/35fc4cc05bec29f9459d7087ba85161b3db1cce7"
      },
      {
        "label": "권한과 UI 기준",
        "sha": "94eab11",
        "url": "https://github.com/LxNx-Hn/Hot-s-Pod/commit/94eab11ec4e25459ae5163d9647de0edf99731c0"
      },
      {
        "label": "Cookie isolation",
        "sha": "e8cf6b0",
        "url": "https://github.com/LxNx-Hn/Hot-s-Pod/commit/e8cf6b05fba63f13fc62037ab62eae984095c149"
      }
    ],
    "results": [
      "Vector Search의 similarity를 RDB filtering 이후에도 보존하는 hybrid search 흐름 구현",
      "LLM 내부 context와 사용자 출력 규칙 분리",
      "계층형 댓글 soft delete + orphan parent 재귀 정리",
      "React Query cache와 backend membership/permission 상태 동기화",
      "AI 코딩 도구가 만든 SQL 수정도 diff와 실행 결과를 확인한 뒤 반영"
    ]
  },
  {
    "title": "M_RAG",
    "repo": "https://github.com/LxNx-Hn/M_RAG",
    "label": "졸업논문 · Cross-lingual RAG 평가와 HyDE × CAD × SCD 비교",
    "featured": false,
    "overview": "한국어로 질문하고 영어 논문에서 근거를 찾은 뒤 다시 한국어로 답하는 cross-lingual RAG를 졸업논문으로 다뤘습니다. 같은 Paper-RAG backbone에서 HyDE, CAD, SCD 조합을 비교했지만, 실제로 가장 어려웠던 부분은 모델을 돌리는 것보다 서로 다른 언어가 섞인 상태에서 결과를 어떻게 공정하게 평가할지 정하는 일이었습니다. 한국어 질문·영어 논문·영어 reference·한국어 답변이 한 평가 안에 같이 들어가면서 번역 자체가 새로운 변수가 됐고, 이를 분리해 해석하는 과정을 논문의 중요한 부분으로 남겼습니다.",
    "stack": [
      {
        "label": "RAG / Retrieval",
        "items": [
          "BGE-M3",
          "BM25",
          "RRF",
          "CrossEncoder",
          "HyDE"
        ]
      },
      {
        "label": "Generation",
        "items": [
          "Mi:dm 2.0 Base",
          "CAD",
          "SCD",
          "PyTorch",
          "Transformers"
        ]
      },
      {
        "label": "Evaluation",
        "items": [
          "RAGAS",
          "NVIDIA NIM Judge",
          "paired factor analysis",
          "language adherence"
        ]
      },
      {
        "label": "Experiment",
        "items": [
          "Python",
          "ChromaDB",
          "PostgreSQL",
          "A100 80GB",
          "provenance / guarded runner"
        ]
      }
    ],
    "contributions": [
      "한국어 질의–영어 논문 RAG에서 HyDE, CAD, SCD 8개 조합을 같은 backbone 위에서 생성·평가했습니다.",
      "SCD의 목표인 한국어 유지 효과는 LLM judge가 아니라 생성 답변의 한글 비율을 직접 측정해 별도로 검증했습니다.",
      "cross-lingual RAGAS 평가에서 번역 여부가 SCD 효과와 섞이는 문제를 발견하고, 영어·한국어 양쪽으로 맞춘 대칭 평가를 새로 설계했습니다.",
      "번역 과정에서 숫자, 인용, 날짜, 모델·metric 이름 같은 기술 용어가 바뀌지 않았는지 별도 integrity check를 넣고 평가 입력을 score 전에 고정했습니다.",
      "같은 입력을 gpt-4o와 고정 gpt-4.1 judge로 다시 평가해 특정 judge에서만 나타나는 효과를 최종 결론으로 쓰지 않았습니다."
    ],
    "cases": [
      {
        "title": "한국어 질문·영어 논문·한국어 답변을 RAGAS로 어떤 언어에서 평가해야 하는가",
        "problem": "질문은 한국어, 검색 context와 reference는 영어, SCD가 켜진 답변은 한국어에 가까웠습니다. 그대로 평가하면 metric이 의미 차이와 언어 차이를 같이 보게 되고, 답변이나 context 한쪽만 번역하면 번역 자체가 점수에 영향을 줍니다.",
        "cause": "cross-lingual RAG에서는 '같은 의미면 같은 점수'라고 가정하기 어렵고, 특히 faithfulness는 답변과 context를 함께 보므로 두 언어가 다르면 judge의 판단 조건도 달라집니다.",
        "approach": "처음에는 SCD-on context만 한국어로 맞춰 평가했지만, 그러면 SCD 여부와 번역 여부가 항상 같이 움직여 점수 차이가 SCD 때문인지 번역 때문인지 분리할 수 없다는 문제를 확인했습니다.",
        "solution": "HyDE-off에서 검색 context가 byte 단위로 같은 38개 SCD on/off 쌍만 따로 잡고, 양쪽 조건 모두에 같은 규칙을 적용해 영어 패널과 한국어 패널을 각각 만들었습니다. 이미 목표 언어인 텍스트는 그대로 두고 필요한 경우만 번역했습니다.",
        "result": "번역을 한쪽 조건에만 적용한 첫 평가를 인과적 결과로 쓰지 않고 sensitivity analysis로 낮춰 해석했고, 더 대칭적인 입력에서 다시 비교할 수 있게 됐습니다."
      },
      {
        "title": "번역으로 언어를 맞추면 이번에는 원래 의미와 기술 용어가 바뀔 수 있음",
        "problem": "평가를 위해 문장을 번역하는 순간 숫자, 인용, 날짜, 모델명, metric명 같은 표현이 바뀌면 원래 답변과 다른 내용을 평가하게 됩니다. 단어 하나의 번역 선택도 answer relevancy나 faithfulness에 영향을 줄 수 있습니다.",
        "cause": "일반 번역 품질이 높아도 연구 평가에서는 작은 표현 변화가 곧 실험 처치가 될 수 있었습니다.",
        "approach": "번역이 자연스러운지만 보지 않고 '평가 대상의 의미를 얼마나 그대로 보존했는가'를 별도 조건으로 두었습니다.",
        "solution": "숫자·인용·circled number·고정 날짜 literal을 정확히 보존하는지 검사하고, 번역이 필요 없는 경우에는 identity를 유지했습니다. 모든 평가 입력은 점수를 보기 전에 SHA-256으로 고정했습니다.",
        "result": "같은 normalization rule을 네 조건에 적용하고도 번역 노출 빈도가 SCD-off/on에서 달랐다는 한계까지 그대로 남겼습니다. 즉 같은 규칙을 적용했다고 해서 완전히 같은 처치가 된다고 과장하지 않았습니다."
      },
      {
        "title": "SCD가 한국어를 더 잘 유지하는 건 확인했는데 RAG 품질도 좋아졌다고 말할 수 있는가",
        "problem": "reference SCD는 한국어 비율을 분명히 높였지만, 첫 gpt-4o 대칭 패널에서는 answer relevancy가 낮아지는 신호가 나왔습니다.",
        "cause": "자동 평가는 judge 모델에 의존하고, 이미 생성한 답변을 사후 번역해 평가한 구조라 SCD 자체의 인과 효과라고 바로 말하기 어려웠습니다.",
        "approach": "첫 judge 결과가 불편하더라도 그대로 남기고, 같은 입력 파일을 번역에 사용하지 않은 별도 고정 judge로 다시 채점했습니다.",
        "solution": "영어·한국어 패널을 gpt-4.1-2025-04-14로 cross-judge 평가하고 19개 query cluster 기준 paired bootstrap 신뢰구간을 다시 계산했습니다.",
        "result": "gpt-4o에서 보였던 answer-relevancy의 0이 아닌 음의 구간이 gpt-4.1에서는 재현되지 않았습니다. 최종적으로 '한국어 유지 효과는 강하지만 judge에 강건한 RAG 품질 차이는 확인되지 않았다'고 결론을 제한했습니다."
      },
      {
        "title": "처음 구현한 SCD가 효과가 없었을 때 논문 방법 자체가 문제인지 구현이 다른 건지 구분해야 했음",
        "problem": "초기 penalty_additive SCD는 한국어 유지 효과가 거의 없었고 일부 이미 한국어인 답변을 오히려 나쁘게 만들었습니다.",
        "cause": "코드를 원 논문과 다시 대조해보니 target-language boost와 warm-up이 빠져 있었고, reference의 multiplicative scaling 대신 고정 additive penalty만 사용하고 있었습니다.",
        "approach": "기존 결과를 버리고 새 결과로 덮기보다 '기존 구현에서의 결과'와 '논문 기준 구현에서의 결과'를 따로 남겼습니다.",
        "solution": "reference_scd를 별도 mode로 구현하고 기존 v1 결과를 보존한 채 같은 152개 generation 구조로 다시 실험했습니다.",
        "result": "reference_scd에서는 한국어 비율 paired +0.2203, 76쌍 중 68쌍 개선을 확인했습니다. 구현 차이를 확인하지 않았다면 기존 null result를 방법 자체의 실패로 잘못 해석할 수 있었습니다."
      }
    ],
    "commits": [
      {
        "label": "기존 SCD null 결과 직접 재검증",
        "sha": "4a9f33a",
        "url": "https://github.com/LxNx-Hn/M_RAG/commit/4a9f33afd5b7f7cb5f29713465f47ad9c013fe7a"
      },
      {
        "label": "Reference SCD 구현 분리",
        "sha": "34c328e",
        "url": "https://github.com/LxNx-Hn/M_RAG/commit/34c328e62ab043d8520515da96c98ce59e65ccf8"
      },
      {
        "label": "Translated BLEU/ROUGE 설계",
        "sha": "08a2594",
        "url": "https://github.com/LxNx-Hn/M_RAG/commit/08a25942352eafc5acb0393d86728410adb7726a"
      },
      {
        "label": "Cross-lingual context 평가",
        "sha": "ddb0dd2",
        "url": "https://github.com/LxNx-Hn/M_RAG/commit/ddb0dd26b4bd7e1fc0b7d74f9b63762ed11ef32d"
      },
      {
        "label": "최종 대칭·cross-judge 근거 정리",
        "sha": "ae5b64e",
        "url": "https://github.com/LxNx-Hn/M_RAG/commit/ae5b64e87b5ae4c02c2bfa80da0ec4ced068bfcb"
      },
      {
        "label": "최종 논문 결과 정렬",
        "sha": "a5c15d2",
        "url": "https://github.com/LxNx-Hn/M_RAG/commit/a5c15d2539698acfb02e5eb56758bee48e292702"
      }
    ],
    "results": [
      "영어 논문 4편 · 한국어 질의 19개 · HyDE × CAD × SCD 8개 설정 · 총 152개 생성",
      "reference_scd 한국어 비율 paired +0.2203 · 68/76 쌍 개선",
      "언어 이탈(<0.5) 26/76 → 12/76",
      "동일 검색 context 38쌍으로 영어/한국어 대칭 평가 구성",
      "gpt-4o에서 보인 answer-relevancy 저하 신호가 고정 gpt-4.1 cross-judge에서는 재현되지 않음",
      "최종 결론: 한국어 언어 준수 증가는 확인, judge에 강건한 비영점 RAG-quality 효과는 미확인"
    ]
  },
  {
    "title": "CODE BLUE · PPO Boss Agent",
    "repo": "https://github.com/LxNx-Hn/AI_FinalTerm",
    "label": "AI 기말 과제 · 직접 만든 Unity 게임 + PPO 강화학습",
    "featured": false,
    "overview": "AI 기말 과제로 직접 만든 2D 격자 액션 게임 CODE BLUE에 Unity ML-Agents PPO를 적용한 프로젝트입니다. 게임 자체는 Entry, 일반 전투 스테이지, 병원 스테이지, 엘리베이터 보스전, 옥상 엔딩, Credits까지 6개 씬으로 구성했고 플레이어 이동·공격·대시, 적 AI, 아이템, trigger, UI, 보스의 다단계 패턴을 구현했습니다. 강화학습에서는 이 게임의 보스전을 별도 RL scene으로 만들고, 사람이 화면에서 확인할 수 있는 정보와 같은 범위의 observation과 이동/공격 입력만으로 보스를 처치하도록 학습시켰습니다.",
    "stack": [
      {
        "label": "Game",
        "items": [
          "Unity",
          "C#",
          "Grid System",
          "Enemy AI",
          "Boss Pattern",
          "Scene / Trigger"
        ]
      },
      {
        "label": "RL",
        "items": [
          "Unity ML-Agents",
          "PPO",
          "MultiDiscrete [5,2]",
          "Action Mask"
        ]
      },
      {
        "label": "Observation / Reward",
        "items": [
          "438-dim vector obs",
          "Visible Cue",
          "Hit-gated Reward",
          "Hazard Memory"
        ]
      },
      {
        "label": "Experiment",
        "items": [
          "TensorBoard",
          "Headless Training",
          "ONNX",
          "1M steps",
          "Training Log Analysis"
        ]
      }
    ],
    "contributions": [
      "6개 씬으로 이어지는 CODE BLUE 게임의 grid 이동, 플레이어 combat, 적 AI, item/trigger, boss phase·pattern과 UI를 구성하고 보스전을 RL 학습 가능한 별도 scene으로 연결했습니다.",
      "보스 위치·방향·HP·phase, warning/damage tile, 최근 위험 정보와 실제 화면에 보이는 pattern cue를 observation으로 구성했습니다.",
      "학습 로그에 공격 기회, 위험 타일 진입, hit attribution, safe move 여부 등 진단 지표를 추가해 reward 총합이 아니라 실제 행동이 왜 막히는지 확인했습니다.",
      "사람은 이동과 공격을 동시에 할 수 있는데 agent는 하나만 고르던 action mismatch를 찾아 Single Discrete [6]을 MultiDiscrete [5,2]로 변경했습니다.",
      "reward farming, action mask, scene reset timeout, one-shot 입력 replay 같은 학습 환경 자체의 버그를 수정한 뒤 1M PPO long-run을 수행했습니다."
    ],
    "cases": [
      {
        "title": "사람은 이동하면서 공격할 수 있는데 agent는 둘 중 하나만 고르게 만든 상태였음",
        "problem": "50K 학습에서 boss damage가 24/60에 막혔고 공격은 전체 action의 1.40%뿐이었습니다. 안전하게 공격할 수 있는 기회의 80.3%를 넘겼습니다.",
        "cause": "초기 Single Discrete [6]에서는 WAIT·이동·공격 중 하나만 선택할 수 있어 사람이 실제 게임에서 하는 '피하면서 공격'을 표현할 수 없었습니다.",
        "approach": "학습 step을 더 늘리기 전에 사람 입력과 agent action space 자체가 같은 조건인지 비교했습니다.",
        "solution": "이동 [5]와 공격 [2]을 독립 branch로 둔 MultiDiscrete [5,2]로 변경했습니다.",
        "result": "agent도 이동과 공격을 같은 decision에서 표현할 수 있게 됐고 이후 reward 문제를 별도로 확인할 수 있었습니다."
      },
      {
        "title": "action space를 고치자 이번에는 실제 hit 없이 공격 시도만으로 보상을 얻음",
        "problem": "동시 공격이 가능해진 뒤 agent가 정확히 맞히기보다 공격을 반복해 attempt reward를 쌓았습니다.",
        "cause": "보상이 공격 성공이 아니라 안전한 위치에서 '공격을 시도한 것'에 붙어 있었습니다.",
        "approach": "reward 총합만 보지 않고 hit rate와 boss HP 감소를 같이 봤습니다.",
        "solution": "공격 시도 reward를 제거하고 실제 boss HP가 감소한 hit에만 bonus reward를 주도록 바꿨습니다.",
        "result": "reward farming은 제거됐고, 그 수정만으로 damage가 바로 오르지 않았다는 결과도 그대로 남겨 다음 병목과 분리했습니다."
      },
      {
        "title": "보스를 깨게 만드는 것보다 사람이 볼 수 없는 정보를 agent에게 주지 않는 게 중요했음",
        "problem": "보스 pattern의 내부 state나 다음 순서를 observation에 넣으면 성능은 쉽게 오를 수 있지만 사람보다 더 많은 정보를 가진 agent가 됩니다.",
        "cause": "게임 내부에는 AI가 읽을 수 있는 상태가 많지만 실제 플레이어는 warning tile과 화면에 나타난 cue만 볼 수 있습니다.",
        "approach": "클리어율보다 사람과 비교 가능한 조건을 먼저 정했습니다.",
        "solution": "MarkATK real/fake cue와 과거 sweep history처럼 실제 화면에서 확인 가능한 정보만 observation으로 만들고 hidden/off-lane/stale target leak를 따로 기록했습니다.",
        "result": "최종 1M run에서 hidden hit, off-lane hit, stale hit, fake marker mask leak, next-band/sweep-sequence leak를 0으로 확인했습니다."
      },
      {
        "title": "구조를 계속 바꾸기보다 어느 시점부터는 고정하고 길게 학습해봐야 했음",
        "problem": "20K~50K에서는 회피 중심 local optimum에서 빠져나오지 못했고 보스 처치가 나오지 않았습니다.",
        "cause": "여러 phase를 버티고 공격권을 다시 만드는 보스전이라 짧은 run만으로 구조 변경 효과를 판단하기 어려웠습니다.",
        "approach": "action·reward·observation을 더 만지지 않고 기준 코드를 고정한 뒤 장기 학습 자체를 검증했습니다.",
        "solution": "동일 [5,2] action, 438차원 observation, hit-gated reward 조건으로 PPO-only 1M headless run을 수행했습니다.",
        "result": "총 892 episode에서 boss_dead 199회, 전체 클리어율 22.3%, 최근 100 episode 클리어율 80%, 최근 hit rate 97.3%를 기록했습니다."
      }
    ],
    "aiNote": {
      "label": "AI 공동작업",
      "text": "RL 디버깅과 일부 action/reward 수정 커밋은 Claude 공동작성 이력이 있습니다. AI가 제안한 변경을 그대로 성과로 보지 않고 매 변경 뒤 Fresh training과 log metric으로 구조 변화와 실제 성능 변화를 따로 확인했습니다.",
      "url": "https://github.com/LxNx-Hn/AI_FinalTerm/commit/6fedfb497ccb3d614c6d8a767f6f5b9e6306dc18"
    },
    "commits": [
      {
        "label": "RL action/mask 입력 버그 수정",
        "sha": "903e2b3",
        "url": "https://github.com/LxNx-Hn/AI_FinalTerm/commit/903e2b3ea34683be36c0647893a8a98c81dc4d20"
      },
      {
        "label": "Async episode reset",
        "sha": "5bddba2",
        "url": "https://github.com/LxNx-Hn/AI_FinalTerm/commit/5bddba21d71421d9705cc40743b37f3e03dd48ec"
      },
      {
        "label": "행동 기회 진단 metric",
        "sha": "8357fe2",
        "url": "https://github.com/LxNx-Hn/AI_FinalTerm/commit/8357fe2d2d0bf7394f90a2a70a2a92dd418b59aa"
      },
      {
        "label": "Action Space [5,2]",
        "sha": "6fedfb4",
        "url": "https://github.com/LxNx-Hn/AI_FinalTerm/commit/6fedfb497ccb3d614c6d8a767f6f5b9e6306dc18"
      },
      {
        "label": "Reward farming 제거",
        "sha": "c84b1a4",
        "url": "https://github.com/LxNx-Hn/AI_FinalTerm/commit/c84b1a4d89f055e11ee69e926d1df2314012e5e9"
      },
      {
        "label": "1M PPO long-run",
        "sha": "9448e2b",
        "url": "https://github.com/LxNx-Hn/AI_FinalTerm/commit/9448e2bd869dcb80e6839e00927e443c745fbe53"
      }
    ],
    "results": [
      "CODE BLUE: 직접 만든 2D grid action game · 6개 scene · player/enemy/item/trigger/boss pattern/UI 구성",
      "PPO action spec [5,2] · 최종 observation 438차원",
      "1M PPO run: boss_dead 199회 · 전체 클리어율 22.3%",
      "최근 100 episode 클리어율 80% · hit rate 97.3%",
      "평균 클리어 70.0초 · 최속 42.6초",
      "hidden/off-lane/stale/fake-marker/next-band/sweep-sequence integrity leak 0"
    ]
  }
];
