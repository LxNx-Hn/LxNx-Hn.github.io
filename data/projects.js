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
        "title": "프로필별 추천 모델을 만들 때 같은 실제 OD가 학습·검증에 섞일 수 있음",
        "problem": "경로 후보는 query group 단위로 쌓였지만, 같은 출발지·도착지에서 파생된 후보가 다른 group id를 가지면 학습과 검증에 동시에 들어갈 가능성이 있었습니다.",
        "cause": "모델 분할 기준이 단순 group_id에만 의존하면 실제로 같은 OD인지까지 보장하지 못했습니다.",
        "approach": "점수가 잘 나오는지보다 검증 데이터가 정말 학습에서 분리됐는지부터 확인했고, 실제 OD를 나타내는 별도 holdout_group_id가 필요하다고 봤습니다.",
        "solution": "모든 feature snapshot에 holdout_group_id를 필수로 두고, 하나의 query group이 정확히 하나의 실제 OD에 매핑되는지 검증한 뒤 OD 단위로 train/validation을 분리했습니다.",
        "result": "6개 프로필 모두 304개 학습 OD와 76개 검증 OD로 분리했고, NDCG@3 0.9166~0.9596, 후보쌍 정확도 0.6806~0.8315 범위의 baseline을 확인했습니다."
      },
      {
        "title": "학습된 모델 파일이 있어도 현재 서비스 feature와 다르면 그대로 쓰면 안 됨",
        "problem": "모델 artifact가 존재하는 것만으로는 현재 서비스가 만드는 feature와 같은 조건에서 학습된 모델인지 알 수 없었습니다.",
        "cause": "feature column 변경, 프로필 누락, 검증 지표가 없는 artifact가 runtime에 들어오면 조용히 잘못된 추천을 만들 수 있었습니다.",
        "approach": "모델을 '파일'이 아니라 schema와 검증 결과를 같이 가진 artifact로 보고, 로딩 전에 계약을 검사하도록 했습니다.",
        "solution": "6개 프로필 존재 여부, feature_columns, OD holdout 지표, archive 중복 경로, 모델 hash 등을 검증하고 조건이 맞지 않으면 promotion/runtime 사용을 거부하도록 했습니다.",
        "result": "현재 baseline은 bootstrap 평가 데이터로 학습한 모델임을 명시적으로 남기고, 사람 평가를 거친 human_validated 모델과 구분해 운영할 수 있게 했습니다."
      },
      {
        "title": "외부 경로 API 하나가 느려지면 전체 추천 응답까지 같이 늦어짐",
        "problem": "ODsay가 느리거나 optional 보행·그늘 enrichment가 지연될 때 사용자는 기본 경로 결과까지 오래 기다려야 했습니다.",
        "cause": "필수 후보 수집과 추가 품질 보강이 같은 응답 경로에서 함께 끝나기를 기다리고 있었습니다.",
        "approach": "모든 데이터를 다 받을 때까지 기다리는 것보다 먼저 쓸 수 있는 실제 후보를 반환하고, 선택적 보강은 시간 예산 안에서 처리하는 편이 낫다고 봤습니다.",
        "solution": "느린 ODsay 요청은 TMAP으로 hedge하고 provider별 timeout과 전체 latency budget을 두었습니다. optional walk/shade 수집은 제한 시간을 넘으면 기본 후보를 먼저 유지하도록 분리했습니다.",
        "result": "한 공급원의 지연이나 선택 기능 때문에 전체 경로 검색이 같이 멈추는 범위를 줄였습니다."
      },
      {
        "title": "정상 응답인데 실제 직행 버스가 후보에서 빠짐",
        "problem": "TMAP 호출 자체는 성공했지만 실제 존재하는 일부 직행 버스가 추천 후보에 포함되지 않았습니다.",
        "cause": "후처리 문제가 아니라 TMAP이 해당 직행 버스 경로를 반환하지 않는 경우가 있었습니다.",
        "approach": "같은 공급원 안에서 값을 억지로 만들기보다 다른 공공 교통 데이터로 후보를 보완할 수 있는지 확인했습니다.",
        "solution": "BIMS 노선·정류장 데이터를 비동기로 수집해 직행 후보를 추가하고 TTL cache, timeout, 동시 요청 상한을 함께 적용했습니다.",
        "result": "TMAP에 없는 직행 버스를 후보군에 보완할 수 있게 됐고, 특정 지역에서는 정류장 검색 반경 때문에 노선을 놓치는 경우까지 추가로 보정했습니다."
      },
      {
        "title": "BIMS를 붙이자 같은 버스가 다른 ID로 두 번 나타남",
        "problem": "같은 노선이 TMAP과 BIMS에서 서로 다른 stop id와 geometry로 들어와 중복 후보가 생겼습니다.",
        "cause": "공급원별 식별자 체계가 달라 단순 route id 비교로는 동일 경로를 판단할 수 없었습니다.",
        "approach": "사용자가 같은 버스로 보는 기준을 다시 잡고 버스 번호, 승하차 정류장명, 좌표 근접도를 함께 비교했습니다.",
        "solution": "복수 조건 기반 병합 기준을 만들고 중복 경로는 하나로 합쳤으며, BIMS 활성화 전의 cache가 남아 결과가 달라지는 문제도 함께 무효화했습니다.",
        "result": "여러 공급원을 쓰면서도 같은 버스가 중복 노출되는 문제를 줄이고 출처는 함께 보존했습니다."
      },
      {
        "title": "확인하지 못한 철도·geometry 값을 확정값처럼 보여줄 위험",
        "problem": "일부 철도는 노선이 잘못 해석됐고, BIMS에는 실제 도로 선형이 없으며 연결되지 않은 시간표도 있었습니다.",
        "cause": "서로 다른 공급원의 데이터를 하나의 route schema로 합치는 과정에서 없는 값을 추정값으로 채울 유인이 생겼습니다.",
        "approach": "경로가 하나 덜 보이는 것보다 잘못된 정보를 사용자가 믿는 쪽이 더 큰 문제라고 판단했습니다.",
        "solution": "동해선·경전철 등 노선 해석을 바로잡고, 추정 geometry는 estimated, 미연계 시간표는 unavailable로 남겼습니다. 확인할 수 없는 시간·거리도 임의의 0으로 채우지 않았습니다.",
        "result": "추천 결과에서 확인된 값과 추정·미확인 값을 구분하고, 사용자에게 데이터 품질 한계를 숨기지 않도록 했습니다."
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
        "title": "질문을 바로 생성형 AI에 넘기면 서비스 범위가 흐려짐",
        "problem": "창업지원 서비스가 다루지 않는 질문에도 모델이 그럴듯한 답을 만들 수 있고, 필요한 데이터와 상관없는 검색이 늘어날 수 있었습니다.",
        "cause": "답변 전에 질문의 목적과 지원 범위를 나누는 routing 단계가 없으면 모든 질문이 같은 생성 경로로 들어갑니다.",
        "approach": "더 큰 모델을 쓰기보다 먼저 '이 질문을 서비스가 답해야 하는가, 답한다면 어느 데이터로 가야 하는가'를 나누는 쪽으로 구조를 잡았습니다.",
        "solution": "질문을 창업·정책·트렌드·범위 외로 분류하고 분류 결과에 맞는 서비스만 실행했습니다. classifier가 설명문을 길게 만들지 않도록 출력도 한 글자로 제한했습니다.",
        "result": "프로젝트 기준 질문 분류 정확도 97.14%, Recall 97.94%, Precision 98.07%, F1 97.60을 확인했고 범위 밖 질문을 별도 처리할 수 있게 했습니다."
      },
      {
        "title": "팀 기능은 각각 동작하지만 하나의 서비스에서는 입력·출력이 맞지 않음",
        "problem": "데이터 처리, 분류, RAG 응답, frontend가 각자 개발되면서 한 부분의 형식이 바뀌면 다른 기능이 바로 깨질 수 있었습니다.",
        "cause": "팀원이 맡은 기능별 기준은 있었지만 서비스 전체에서 공유하는 API contract와 변경 확인 흐름이 필요했습니다.",
        "approach": "각 기능을 대신 구현하기보다 전체 흐름에서 어디서 어떤 값이 들어오고 나가는지를 맞추는 데 집중했습니다.",
        "solution": "FastAPI endpoint와 frontend 호출 형식을 정리하고 category와 data source 연결, runtime config, health endpoint, 배포 문서를 함께 관리했습니다.",
        "result": "각 팀원이 만든 기능을 하나의 사용자 흐름으로 연결하고 이후 배포 환경 변경에도 같은 구조를 유지할 수 있게 했습니다."
      },
      {
        "title": "로컬 RAG를 실제 데모 환경에 올리려면 GPU·secret·frontend 배포를 같이 풀어야 함",
        "problem": "로컬에서는 동작했지만 모델 실행 환경, API key, backend URL, frontend 배포가 서로 다른 플랫폼에 있었습니다.",
        "cause": "GPU 모델 서버를 그대로 Cloud 환경에 상시 유지하면 데모 목적에 비해 운영 비용과 설정 복잡도가 커졌습니다.",
        "approach": "모델을 직접 호스팅하는 것과 모델 API를 호출하는 gateway를 분리해 어떤 부분만 Cloud Run에 둘지 다시 봤습니다.",
        "solution": "NVIDIA NIM 호출만 담당하는 경량 FastAPI 이미지를 Artifact Registry에 올리고 Cloud Run에 배포한 뒤, 반환 URL을 Netlify frontend runtime config에 연결했습니다.",
        "result": "GPU 서버를 상시 운영하지 않고도 backend–frontend가 이어지는 데모 배포 구조를 만들었습니다."
      },
      {
        "title": "배포가 된 뒤에는 API key와 비용이 새로운 문제로 남음",
        "problem": "GitHub Actions에서 secret을 직접 환경변수로 다루는 방식과 Cloud Run의 무제한 scaling은 데모 운영에 맞지 않았습니다.",
        "cause": "개발 성공 기준과 운영 기준이 달랐고, 배포 횟수가 늘면서 image와 instance 비용도 계속 쌓일 수 있었습니다.",
        "approach": "한 번 배포되는지만 보지 않고 한 달 정도의 데모를 반복 운영한다고 가정해 secret과 비용 조건을 다시 봤습니다.",
        "solution": "GitHub Secrets에서 Secret Manager로 값을 갱신하고 Cloud Run에는 secret reference로 주입했습니다. max instance를 제한하고 오래된 Artifact Registry image는 최근 3개만 남기도록 정리했습니다.",
        "result": "배포 과정에 secret 관리와 scale/image 비용 제어를 포함시켰습니다."
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
      "자연어 입력에서 장소·category를 추출하고 Vector Search → RDB filtering → LLM 응답으로 이어지는 검색 흐름을 구현·조정했습니다.",
      "벡터 검색의 similarity가 DB 조회 이후 사라지는 문제를 찾아 최종 결과까지 점수를 유지하고 실제 결과를 보며 threshold를 조정했습니다.",
      "댓글의 계층 구조, soft delete, 회원 탈퇴 상태가 동시에 맞도록 transaction과 재귀 정리 로직을 수정했습니다.",
      "join/leave, current_member, React Query cache가 서로 다른 상태를 보여주는 문제를 수정해 서버와 화면 상태를 맞췄습니다.",
      "관리자·host·작성자 권한과 cookie 격리 문제를 점검해 backend 정책과 frontend 버튼 노출을 같은 기준으로 맞췄습니다."
    ],
    "cases": [
      {
        "title": "벡터 검색에서는 가장 비슷한 모임인데 최종 결과에서는 아래로 밀림",
        "problem": "ChromaDB 검색에서 similarity가 높았던 모임이 MariaDB 조건 필터를 통과한 뒤 순서가 바뀌었습니다.",
        "cause": "RDB에서 id 목록을 다시 조회하면서 Vector Search의 similarity order가 사라졌습니다.",
        "approach": "threshold부터 계속 바꾸지 않고 Vector Search, DB filtering, final response 각 단계에서 동일 후보의 점수를 따라갔습니다.",
        "solution": "pod_similarity_map을 만들어 similarity score를 최종 단계까지 유지하고 DB 결과를 다시 관련도 순으로 정렬했습니다. 이후 실제 검색 결과를 보며 threshold를 조정했습니다.",
        "result": "지역·category 조건을 적용하면서도 의미 기반 검색의 관련도 순서를 유지할 수 있게 했습니다."
      },
      {
        "title": "검색용 내부 태그가 LLM 답변에 그대로 보임",
        "problem": "검색에서 쓰려고 만든 내부 tag와 Markdown 표현이 사용자에게 보이는 답변에도 노출됐습니다.",
        "cause": "retrieval context와 user-facing response의 출력 규칙이 분리돼 있지 않았습니다.",
        "approach": "검색 문맥을 지우는 대신 내부에서 필요한 정보와 최종 사용자에게 보여줄 표현을 따로 정의했습니다.",
        "solution": "system message와 output rule을 수정해 내부 tag와 불필요한 Markdown이 최종 응답에 나오지 않도록 제한했습니다.",
        "result": "검색 단계의 구조화된 문맥은 유지하면서 사용자 답변 형태를 분리했습니다."
      },
      {
        "title": "회원 탈퇴·댓글 삭제가 계층형 댓글 구조와 충돌함",
        "problem": "부모 댓글을 물리 삭제하면 자식 댓글의 문맥이 끊기고, 반대로 모든 삭제 댓글을 계속 남기면 고아 placeholder가 쌓였습니다.",
        "cause": "일반 CRUD 삭제 방식으로는 parent-child 관계와 탈퇴 사용자 상태를 동시에 처리하기 어려웠습니다.",
        "approach": "댓글 하나의 삭제가 아니라 자식 존재 여부와 상위 댓글 상태까지 같이 봐야 한다고 판단했습니다.",
        "solution": "자식이 있는 댓글은 user_id/content를 비우는 soft delete로 남기고 leaf는 물리 삭제했습니다. 마지막 자식이 사라지면 삭제 상태의 상위 댓글을 재귀적으로 정리하고 한 transaction에서 처리했습니다.",
        "result": "대화 문맥은 유지하면서 불필요하게 남는 삭제 placeholder를 정리할 수 있게 했습니다."
      },
      {
        "title": "참가·탈퇴 후 서버 상태는 바뀌었는데 화면은 이전 상태를 보여줌",
        "problem": "Pod 참가/탈퇴나 생성 뒤 current_member와 참가 인원, 버튼 상태가 즉시 맞지 않는 경우가 있었습니다.",
        "cause": "서버 변경 이후 React Query의 관련 cache key가 모두 invalidation되지 않았고 일부 응답에는 current_member가 빠져 있었습니다.",
        "approach": "화면 component만 강제로 갱신하지 않고 어떤 query가 같은 상태를 공유하는지 확인했습니다.",
        "solution": "Pod 상세 응답에 current_member를 추가하고 pods/podMember 등 관련 query를 함께 invalidate하도록 수정했습니다.",
        "result": "join/leave·생성 이후 화면과 backend의 회원 상태가 같은 시점에 갱신되도록 맞췄습니다."
      },
      {
        "title": "로그인 cookie가 다른 local 서비스와 섞일 수 있는 보안 문제",
        "problem": "개발 중 같은 localhost에서 여러 서비스를 띄울 때 auth cookie 이름·scope가 겹치면 다른 서비스의 로그인 정보가 전달될 수 있었습니다.",
        "cause": "cookie가 애플리케이션별로 충분히 분리되지 않은 상태였습니다.",
        "approach": "기능 오류가 아니라 인증 경계 문제로 보고 cookie 이름과 전달 범위를 서비스 단위로 분리했습니다.",
        "solution": "auth cookie를 서비스 전용 이름과 설정으로 격리하고 frontend/backend에서 같은 정책을 사용하도록 수정했습니다.",
        "result": "로컬·배포 환경에서 다른 애플리케이션과 인증 상태가 섞일 가능성을 줄였습니다."
      },
      {
        "title": "서버 권한과 화면의 수정·삭제 버튼 기준이 다름",
        "problem": "backend에서는 host/admin/작성자마다 허용 작업이 다른데 frontend 버튼이 같은 기준을 쓰지 않으면 눌러도 실패하거나 권한 없는 작업이 노출될 수 있었습니다.",
        "cause": "권한 로직이 API와 UI에 따로 구현돼 변화가 서로 따라가지 못했습니다.",
        "approach": "UI 편의 문제가 아니라 권한 계약 문제로 보고 역할별 동작을 하나씩 대조했습니다.",
        "solution": "Pod 수정은 host, 삭제는 host/admin, 댓글 수정은 작성자, 삭제는 작성자/admin 기준으로 backend와 frontend 표시를 맞췄습니다.",
        "result": "화면에 보이는 동작과 실제 서버 권한이 같은 기준을 사용하도록 정리했습니다."
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
    "label": "졸업논문 · Korean-query / English-paper RAG factor analysis",
    "featured": false,
    "overview": "여러 서비스에서 RAG를 사용한 뒤, 졸업논문에서는 RAG 구성 요소가 실제로 어떤 효과를 내는지 직접 검증했습니다. 한국어 질문으로 영어 논문을 검색·답변하는 고정 Paper-RAG backbone에서 HyDE, CAD, SCD를 on/off한 8개 조합을 비교했습니다. 서비스 구현과 실험 코드를 분리하고, main experiment에서는 19개 질문 × 8개 설정으로 152개 generation을 만든 뒤 RAGAS 평가와 직접 언어 준수 측정을 함께 사용했습니다.",
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
      "Dense + BM25 + RRF + rerank로 이어지는 fixed retrieval backbone을 점검하고 실험에서 query별 context가 실제 대상 논문에서 나오는지 검증했습니다.",
      "HyDE·CAD·SCD 8-config main matrix와 parameter freeze, generation, scoring, aggregation 흐름을 분리해 같은 조건을 다시 실행할 수 있게 했습니다.",
      "기존 SCD 결과가 목표를 직접 측정하지 못하고 있음을 확인해 152개 답변의 한글 문자 비율을 별도로 측정하고 결론을 null result로 수정했습니다.",
      "기존 penalty 방식과 논문 reference SCD 구현을 별도 mode로 분리해 이전 결과를 덮어쓰지 않고 다시 152개를 생성·평가했습니다.",
      "RAGAS judge의 503/504와 null metric을 진단 로그로 남기고 실패 셀만 반복 재평가·병합하는 복구 runner를 만들었습니다."
    ],
    "cases": [
      {
        "title": "main 실험을 돌렸는데 모든 sample에서 context가 0개",
        "problem": "main split generation을 시작하자 rerank 뒤 사용할 context가 없어서 모든 sample이 실패했습니다.",
        "cause": "실험 질문은 RAG, CAD, RAPTOR, Mi:dm 등 여러 논문을 대상으로 하는데 local index에는 BGE 논문 하나만 들어 있었습니다.",
        "approach": "retriever나 model parameter를 바꾸기 전에 현재 index가 실험 대상 corpus를 실제로 포함하는지부터 확인했습니다.",
        "solution": "checked-in source PDF 전체를 기본으로 indexing하고 --reset으로 깨끗하게 재구축할 수 있게 index builder를 수정했습니다.",
        "result": "main split이 요구하는 전체 논문 corpus에서 context를 검색할 수 있게 됐고 이후 152/152 generation을 완료했습니다."
      },
      {
        "title": "BM25가 아무 단어도 겹치지 않는 chunk까지 top-k를 채워 RRF 점수를 받음",
        "problem": "한국어 query와 영어 chunk처럼 lexical overlap이 전혀 없는 문서도 BM25 top-k 자리를 채우면서 RRF rank를 얻고 있었습니다.",
        "cause": "BM25 결과를 top_k 개수까지 자르는 방식이라 score=0 후보도 정상 sparse retrieval 결과처럼 fusion에 들어갔습니다.",
        "approach": "sparse 결과가 비어도 되는 경우와 검색 실패를 구분했습니다. 한국어 질문에서는 BM25 결과가 0개여도 dense retrieval은 정상일 수 있다고 봤습니다.",
        "solution": "score가 0 이하가 되는 순간 BM25 결과 추가를 멈추고, sparse가 비면 기존 pipeline이 dense-only로 계속 진행하도록 했습니다.",
        "result": "lexical 근거가 없는 chunk가 RRF 순위를 받는 문제를 제거하면서 한국어 query의 dense retrieval은 유지했습니다."
      },
      {
        "title": "대상 논문 filter를 top-k 뒤에 적용하면 필요한 chunk가 이미 사라짐",
        "problem": "특정 논문을 대상으로 검색해도 global BM25 top-k에서 다른 논문 chunk가 먼저 차지하면 target document chunk가 filter 전에 탈락할 수 있었습니다.",
        "cause": "doc_id 조건이 sparse scoring 후보를 고르기 전에 적용되지 않았습니다.",
        "approach": "검색 후 필터가 아니라 retrieval candidate 생성 시점에서 문서 범위를 제한해야 한다고 봤습니다.",
        "solution": "BM25에 doc_id pre-filter를 추가하고 dense/sparse/fused trace를 하나의 public search_with_trace API로 통합했습니다.",
        "result": "실험 route가 대상 문서 밖의 chunk 때문에 target context를 놓치는 문제를 줄이고 retrieval trace도 같은 구현에서 기록했습니다."
      },
      {
        "title": "SCD가 한국어 유지에 효과가 있다고 썼는데 기존 RAGAS 지표로는 직접 확인할 수 없음",
        "problem": "기존 분석에서는 SCD가 한국어 출력을 유지한다고 해석했지만 사용한 RAGAS metric은 한국어 문자 유지율 자체를 측정하지 않았습니다.",
        "cause": "평가 지표와 SCD의 직접 목표가 달랐습니다.",
        "approach": "좋아 보이는 기존 결론을 유지하기보다 SCD on/off 152개 답변에서 목표 자체를 다시 측정했습니다.",
        "solution": "한글 문자 비율을 계산해 paired 비교하고 baseline drift와 이미 한국어였던 응답을 분리해 분석했습니다.",
        "result": "기존 penalty_additive SCD v1의 순효과가 명확하지 않다는 null result로 결론을 수정했습니다."
      },
      {
        "title": "null result가 구현 방식 문제인지 방법 자체의 문제인지 구분이 필요함",
        "problem": "기존 SCD 코드는 reference method의 일부만 구현한 penalty 방식이라 논문 방법과 같은 결과라고 볼 수 없었습니다.",
        "cause": "target-language boost, multiplicative scaling, warm-up 등 reference 구현과 기존 코드 사이에 차이가 있었습니다.",
        "approach": "기존 실험을 지우고 새 결과로 덮지 않고 두 구현을 별도 mode로 두어 차이를 직접 비교했습니다.",
        "solution": "reference_scd를 별도 guarded mode로 추가하고 152개 generation을 다시 수행했습니다.",
        "result": "reference 구현에서는 한국어 adherence가 paired +0.2203 개선됐지만 RAG 품질 효과는 judge에 따라 달라져, 언어 준수 개선과 RAG 품질 개선을 분리해서 결론 내렸습니다."
      },
      {
        "title": "RAGAS judge가 503/504로 실패해 metric null이 반복 발생",
        "problem": "NVIDIA NIM judge의 shared capacity 문제로 일부 평가 호출이 503 ResourceExhausted, 504 timeout을 내면서 결과 셀이 비었습니다.",
        "cause": "단순 client timeout 문제가 아니라 외부 judge endpoint의 일시적인 capacity limit였습니다.",
        "approach": "전체 152개를 매번 다시 평가하지 않고 어떤 query·metric이 실패했는지 남긴 뒤 그 부분만 복구하는 방식이 필요했습니다.",
        "solution": "HTTP status, exception, elapsed, body 일부를 호출마다 atomic write하고 API key를 redaction했습니다. 이후 null 셀만 subset으로 다시 평가하고 기존 결과에 병합하는 converge-until-null runner를 만들었습니다.",
        "result": "실패 원인을 보존하면서 이미 성공한 평가를 버리지 않고 필요한 셀만 재시도할 수 있게 했습니다."
      }
    ],
    "commits": [
      {
        "label": "전체 source paper index",
        "sha": "a7a47cc",
        "url": "https://github.com/LxNx-Hn/M_RAG/commit/a7a47cc3e490cfb2004402b64c6d52984e6237fb"
      },
      {
        "label": "BM25 zero-score 제거",
        "sha": "a29f168",
        "url": "https://github.com/LxNx-Hn/M_RAG/commit/a29f168f5c6a67bf31ffad7a03a9500bdc82c614"
      },
      {
        "label": "SCD null 결과 재분석",
        "sha": "4a9f33a",
        "url": "https://github.com/LxNx-Hn/M_RAG/commit/4a9f33afd5b7f7cb5f29713465f47ad9c013fe7a"
      },
      {
        "label": "Reference SCD 분리",
        "sha": "34c328e",
        "url": "https://github.com/LxNx-Hn/M_RAG/commit/34c328e62ab043d8520515da96c98ce59e65ccf8"
      },
      {
        "label": "Judge null 복구 loop",
        "sha": "d5d69af",
        "url": "https://github.com/LxNx-Hn/M_RAG/commit/d5d69af47b810d2cde8e59144b0844657257bf19"
      },
      {
        "label": "실험 provenance 강화",
        "sha": "10aa5d5",
        "url": "https://github.com/LxNx-Hn/M_RAG/commit/10aa5d52b12c675ebb29070f50ac557e1b7554ea"
      }
    ],
    "results": [
      "Main matrix: 19 queries × 8 HyDE/CAD/SCD configs = 152 generations",
      "CAD: faithfulness +0.044 paired",
      "HyDE: answer relevancy +0.070, context recall +0.026, context precision -0.056",
      "기존 penalty_additive SCD v1: 직접 언어 준수 기준 null factor로 결론 수정",
      "reference_scd: 한국어 adherence +0.2203 paired, 다만 RAG 품질 효과는 cross-judge에서 견고하지 않아 별도 해석",
      "실험 결과·구현·judge 조건을 분리해 재현성과 과장 방지를 우선"
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
        "title": "PPO를 붙이기 전에 게임 자체가 학습 환경으로 안정적으로 돌아가야 했음",
        "problem": "보스전은 7×7 grid에서 warning tile을 피하고 공격해야 하며 phase가 바뀔 때마다 pattern과 boss 위치가 달라지는 실제 게임 로직을 가지고 있었습니다.",
        "cause": "강화학습 전용으로 단순화된 toy environment가 아니라 사람이 플레이하는 게임 scene의 상태와 입력을 agent가 그대로 사용할 수 있어야 했습니다.",
        "approach": "게임 logic을 별도 Python 환경으로 다시 만들지 않고 PlayerController, PlayerCombat, Boss pattern을 유지한 채 RL input bridge와 state extractor를 붙였습니다.",
        "solution": "Boss01_Elevator_RLTrain scene, BossPlayerAgent, StateExtractor, Reward, EpisodeResetter, DebugLogger를 추가해 기존 게임의 보스전 위에 ML-Agents interface를 구성했습니다.",
        "result": "직접 만든 게임의 실제 boss logic을 유지하면서 사람이 플레이하는 조건과 비교 가능한 PPO 학습 환경을 만들었습니다."
      },
      {
        "title": "초기 학습에서 action mask와 입력 반복 때문에 agent가 정상 행동을 못함",
        "problem": "이동 중이라는 이유로 방향이 막히거나, 한 번만 눌러야 하는 ATTACK이 decision 사이에서 반복돼 cooldown spam이 생겼습니다.",
        "cause": "사람 입력용 상태 검사와 RL action masking을 그대로 섞었고 TakeActionsBetweenDecisions 설정이 one-shot 공격과 맞지 않았습니다.",
        "approach": "보상부터 바꾸기 전에 agent가 선택 가능한 action이 실제 게임 규칙과 같은지부터 진단했습니다.",
        "solution": "이동 mask는 geometry wall만 보도록 분리하고 boss cell은 이동 가능하게 했으며, TakeActionsBetweenDecisions=false와 one-shot external input을 적용했습니다.",
        "result": "busy state나 이전 action 때문에 선택지가 잘못 막히는 문제를 제거하고 안정적인 training baseline을 만들었습니다."
      },
      {
        "title": "episode reset 때 Unity가 멈춰 ML-Agents communicator가 끊김",
        "problem": "학습 중 약 976 step 부근에서 scene reload가 main thread를 막아 trainer와 Unity 사이 gRPC timeout이 발생했습니다.",
        "cause": "동기 SceneManager.LoadScene이 episode 종료 때 game loop를 잠시 멈췄습니다.",
        "approach": "timeout 값을 무작정 크게 잡기보다 reset 전후 시간을 직접 logging해 어디서 communication이 끊기는지 확인했습니다.",
        "solution": "scene reset을 LoadSceneAsync coroutine으로 바꾸고 reload queue/before/after timing log를 추가했습니다.",
        "result": "20K 안정 학습에서 67/67 scene reload를 정상 처리하고 trainer exit 문제를 제거했습니다."
      },
      {
        "title": "50K 학습을 해도 agent가 살아남기만 하고 공격하지 않음",
        "problem": "Fresh50K에서 boss damage가 24/60에 막혔고 공격은 전체 action의 1.40%뿐이었습니다. 안전하게 공격할 수 있는 기회의 80.3%를 넘겼습니다.",
        "cause": "Single Discrete [6]에서는 WAIT/이동/공격 중 하나만 선택해야 해서 사람처럼 피하면서 동시에 공격할 수 없었습니다. reward도 생존 쪽 penalty 비중이 컸습니다.",
        "approach": "step을 더 늘리기 전에 22개 이상의 opportunity/danger 지표를 추가해 안전한 공격 기회를 얼마나 놓치는지, 어디서 맞는지 행동 단위로 분석했습니다.",
        "solution": "이동 [5]와 공격 [2]을 독립 branch로 둔 MultiDiscrete [5,2]로 action space를 바꿨습니다.",
        "result": "agent도 사람처럼 이동과 공격을 같은 decision에서 표현할 수 있게 됐고, 이후 학습에서 다음 병목을 별도로 확인할 수 있게 됐습니다."
      },
      {
        "title": "동시 공격이 가능해지자 이번에는 공격 시도만으로 reward를 버는 문제",
        "problem": "MultiDiscrete 변경 뒤 공격이 사실상 무료 행동이 되면서 실제 hit 없이 공격을 반복해 SafeInRangeAttackAttemptReward를 쌓았습니다. 기존 run에서 attempt reward가 +104, 실제 damage reward는 +51 수준이었습니다.",
        "cause": "보상이 '공격 성공'이 아니라 '안전한 위치에서 공격 시도'에 붙어 있었습니다.",
        "approach": "reward 합계가 좋아졌다는 이유로 성공으로 보지 않고 hit rate와 boss HP 감소를 함께 비교했습니다.",
        "solution": "공격 시도 reward를 0으로 만들고 실제 boss HP 감소가 확인된 hit에만 +0.08 SuccessfulHitBonusReward를 지급하도록 바꿨습니다.",
        "result": "Fresh50K에서 reward farming을 제거했고, headline damage가 바로 오르지 않았다는 사실도 그대로 남겨 다음 병목을 분리했습니다."
      },
      {
        "title": "agent에게 사람이 볼 수 없는 정보를 주면 클리어해도 의미가 없음",
        "problem": "보스의 MarkATK real/fake pattern과 sweep 순서를 학습시키는 과정에서 내부 pattern state를 observation에 그대로 넣으면 사람이 모르는 미래 정보를 agent만 알 수 있었습니다.",
        "cause": "학습을 쉽게 만드는 observation과 사람 입력 조건을 지키는 observation 사이에 차이가 있었습니다.",
        "approach": "성능보다 환경 무결성을 우선해 실제 화면에 나타난 cue와 과거 관측 history만 사용하고 hidden target, off-lane, stale target이 공격 mask를 통과하는지도 따로 기록했습니다.",
        "solution": "visible MarkATK real/fake cue와 sweep history를 observation에 추가하고 target gate 및 integrity metric을 넣었습니다.",
        "result": "최종 1M run에서 attack_out_of_range, hidden hit, off-lane hit, stale hit, fake marker mask leak, next-band/sweep-index leak를 모두 0으로 확인했습니다."
      },
      {
        "title": "50K에서는 클리어가 없었지만 구조를 고친 뒤 얼마나 더 학습해야 하는지 확인",
        "problem": "짧은 실험에서는 회피 중심 local optimum에서 빠져나오지 못했고 보스 처치가 발생하지 않았습니다.",
        "cause": "보스전은 여러 phase를 거쳐 공격권을 다시 만드는 장기 의사결정 문제라 구조 수정 효과가 20K~50K 안에 완전히 나타나지 않았습니다.",
        "approach": "action/reward/observation을 계속 바꾸지 않고 c84b1a4 기준 코드를 고정한 상태에서 PPO-only 1M headless long-run을 별도로 수행했습니다.",
        "solution": "동일 action [5,2], 438 observation, hit-gated reward 조건을 유지하고 100K마다 checkpoint를 남기며 1M step까지 학습했습니다.",
        "result": "총 892 episode에서 boss_dead 199회, 전체 클리어율 22.3%, 최근 100 episode 클리어율 80%, 최근 100 episode hit rate 97.3%를 기록했습니다."
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
