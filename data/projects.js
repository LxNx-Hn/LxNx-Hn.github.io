export const projects = [
  {
    "title": "동넷",
    "repo": "https://github.com/LxNx-Hn/KT-10",
    "label": "이동취약자 맞춤형 경로 추천 · 팀 프로젝트",
    "featured": true,
    "overview": "이동취약자가 자신의 이동 조건에 맞는 보행·대중교통 경로를 비교할 수 있도록 만든 서비스입니다. 외부 경로 API가 놓치는 후보를 공공 교통 데이터로 보완하고, 여러 공급원의 경로를 하나의 후보군으로 정리해 다시 평가하도록 구성했습니다.",
    "stack": [
      {
        "label": "AI / Ranking",
        "items": [
          "XGBoost",
          "사용자 조건 기반 재정렬"
        ]
      },
      {
        "label": "Backend / Data",
        "items": [
          "Python",
          "FastAPI",
          "TMAP",
          "BIMS"
        ]
      },
      {
        "label": "Frontend",
        "items": [
          "React",
          "TypeScript"
        ]
      },
      {
        "label": "Infra",
        "items": [
          "Docker",
          "AWS ECS"
        ]
      }
    ],
    "contributions": [
      "TMAP에 빠진 직행 버스를 BIMS 노선·정류장 데이터로 보완하는 수집 흐름을 구현했습니다.",
      "서로 다른 공급원에서 들어온 같은 버스를 버스 번호·정류장명·좌표로 판별해 병합했습니다.",
      "화면에 보여줄 경로 수와 내부 후보 수를 분리해 사용자 조건으로 다시 평가하기 전에 후보가 빠지지 않게 했습니다.",
      "철도 노선 오분류와 미연계 시간표를 확인하고, 확인할 수 없는 정보는 estimated 또는 unavailable로 구분했습니다."
    ],
    "cases": [
      {
        "title": "실제 있는 직행 버스가 후보에 나오지 않음",
        "problem": "TMAP 응답은 정상이었지만 실제로 존재하는 일부 직행 버스가 추천 후보에서 빠졌습니다.",
        "cause": "후처리 문제가 아니라 TMAP이 해당 직행 경로 자체를 반환하지 않는 경우가 있었습니다.",
        "approach": "같은 정보를 다시 가공하기보다 다른 공급원에서 후보를 보완할 수 있는지 확인했고, BIMS의 노선·정류장 데이터를 연결했습니다.",
        "solution": "TMAP 후보가 부족할 때 BIMS 데이터를 비동기로 수집해 직행 버스 후보를 추가하고, timeout·cache·동시 요청 상한도 함께 넣었습니다.",
        "result": "외부 API 한 곳의 결과에만 의존하지 않고 누락된 직행 버스를 후보군에 보완할 수 있게 했습니다."
      },
      {
        "title": "보완 데이터를 붙이자 같은 버스가 두 번 보임",
        "problem": "TMAP과 BIMS에서 같은 노선이 서로 다른 ID와 geometry로 들어와 중복 후보가 생겼습니다.",
        "cause": "공급원마다 정류장 ID 체계가 달라 단순 ID 비교로는 같은 경로인지 판단할 수 없었습니다.",
        "approach": "실제 사용자가 같은 버스로 인식하는 기준이 무엇인지 보고 버스 번호, 승하차 정류장명, 좌표 근접도를 같이 비교했습니다.",
        "solution": "여러 조건을 함께 보는 병합 기준을 만들고, 중복으로 판단된 경우 TMAP geometry를 대표 경로로 유지하면서 BIMS 출처도 남겼습니다.",
        "result": "보완 데이터는 유지하면서 같은 버스가 중복으로 노출되는 문제를 줄였습니다."
      },
      {
        "title": "확인할 수 없는 값을 그럴듯하게 보여주면 안 됨",
        "problem": "일부 철도는 노선이 잘못 분류되거나 연결된 시간표가 없었고, BIMS에는 실제 도로 선형이 없었습니다.",
        "cause": "서로 다른 교통 데이터의 범위와 품질을 하나의 형식으로 맞추면서 없는 정보를 채우려는 지점이 생겼습니다.",
        "approach": "사용자에게 경로가 하나 덜 보이는 것보다 잘못된 정보를 확정값처럼 보여주는 쪽이 더 위험하다고 판단했습니다.",
        "solution": "추정 geometry는 estimated로, 연결되지 않은 시간표는 unavailable로 두고 확인할 수 없는 평균 시간은 0으로 채우지 않았습니다.",
        "result": "추천 결과 안에서 확인된 값과 추정·미확인 값을 구분할 수 있게 했습니다."
      }
    ],
    "commits": [
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
    ]
  },
  {
    "title": "창업지원 RAG 챗봇",
    "repo": "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter",
    "label": "RAG · 질문 분류 · Cloud 배포 · 팀 프로젝트 / Project Leader",
    "featured": true,
    "overview": "창업 희망자의 질문을 창업 현황·정책·트렌드·범위 외로 먼저 나누고, 질문 성격에 맞는 데이터 경로에서 답을 찾도록 만든 RAG 챗봇입니다. 프로젝트 리더로 서비스 구조와 기능 간 연결, 배포 흐름을 맡았습니다.",
    "stack": [
      {
        "label": "AI",
        "items": [
          "RAG",
          "질문 분류",
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
          "React"
        ]
      },
      {
        "label": "Cloud / Ops",
        "items": [
          "Cloud Run",
          "Secret Manager",
          "Netlify",
          "GitHub Actions"
        ]
      }
    ],
    "contributions": [
      "질문 분류 → category별 데이터 경로 → 응답으로 이어지는 전체 RAG 흐름을 잡았습니다.",
      "백엔드와 프론트엔드의 입력·출력 형식을 맞추고 팀 기능이 한 서비스에서 이어지도록 연결했습니다.",
      "FastAPI/NIM gateway를 Cloud Run에 배포하고 React·Netlify까지 이어지는 배포 workflow를 구성했습니다.",
      "API key를 Secret Manager로 관리하고, 데모 규모에 맞춰 인스턴스 수와 Artifact Registry 정리 조건을 조정했습니다."
    ],
    "cases": [
      {
        "title": "질문을 바로 LLM에 넘기면 서비스 범위가 흐려짐",
        "problem": "창업 정보 서비스인데도 질문을 그대로 생성형 AI에 넘기면 관련 없는 검색이 늘고 범위 밖 질문에도 답할 수 있었습니다.",
        "cause": "검색 전에 질문의 목적과 서비스 지원 범위를 구분하는 단계가 없었습니다.",
        "approach": "답변 모델을 바꾸기보다 먼저 어떤 질문을 어디로 보내야 하는지 분류 기준을 만들었습니다.",
        "solution": "질문을 창업·정책·트렌드·범위 외 네 종류로 나누고, 분류 결과에 맞는 데이터 경로만 실행했습니다. 분류 모델은 한 글자만 반환하도록 출력 형식을 제한했습니다.",
        "result": "반복 검증에서 질문 분류 정확도 97.14%를 확인했고, 범위 밖 질문을 별도 처리할 수 있게 했습니다."
      },
      {
        "title": "기능이 돌아가도 배포와 운영 조건이 남아 있었음",
        "problem": "로컬에서 동작하는 백엔드와 프론트엔드를 실제 데모 환경에서 반복 배포하고, API key와 비용도 관리해야 했습니다.",
        "cause": "모델 gateway, Cloud Run, 프론트엔드, secret이 각각 다른 환경에서 동작했습니다.",
        "approach": "배포를 한 번 성공시키는 것보다 다시 올려도 같은 순서로 확인할 수 있게 만드는 데 집중했습니다.",
        "solution": "GitHub Actions에서 image build → Cloud Run → health check → frontend build → Netlify 순서를 연결하고, Secret Manager와 인스턴스·이미지 보관 정책을 같이 설정했습니다.",
        "result": "서비스 기능뿐 아니라 secret, health check, 배포 비용까지 포함한 데모 운영 흐름을 만들었습니다."
      }
    ],
    "commits": [
      {
        "label": "Cloud Run·Netlify 배포",
        "sha": "d111c15",
        "url": "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter/commit/d111c15ac7754c3cc96824f891d5e613a0efe532"
      },
      {
        "label": "Secret 주입 모드 분리",
        "sha": "63a51ac",
        "url": "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter/commit/63a51acbdfa51ae147ca1c13936eb065439aaab1"
      },
      {
        "label": "Cloud 비용 설정",
        "sha": "3f2a33c",
        "url": "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter/commit/3f2a33c9a92b619555850751005f9bae8d32be9f"
      }
    ]
  },
  {
    "title": "Hot's POD",
    "repo": "https://github.com/LxNx-Hn/Hot-s-Pod",
    "label": "자연어 기반 소모임 검색 · Hybrid Search",
    "featured": false,
    "overview": "사용자가 자연어로 원하는 소모임을 찾을 수 있도록 Sentence Transformer 기반 벡터 검색, MariaDB 조건 필터, LLM 응답을 한 흐름으로 연결한 서비스입니다. 검색뿐 아니라 댓글·권한·화면 상태까지 실제 서비스에서 생기는 정합성 문제도 함께 다뤘습니다.",
    "stack": [
      {
        "label": "AI / Search",
        "items": [
          "Sentence Transformers",
          "ChromaDB",
          "LLM"
        ]
      },
      {
        "label": "Backend",
        "items": [
          "FastAPI",
          "MariaDB",
          "Pydantic"
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
          "Hybrid Search",
          "권한 / 상태 동기화"
        ]
      }
    ],
    "contributions": [
      "벡터 검색 결과가 RDB 조건 필터 뒤에도 관련도 순서를 유지하도록 검색 흐름을 수정했습니다.",
      "실제 검색 결과를 비교하면서 similarity threshold를 조정했습니다.",
      "검색용 내부 태그와 Markdown 문법이 LLM의 사용자 답변에 노출되지 않게 출력 규칙을 분리했습니다.",
      "계층형 댓글 삭제, current_member 응답, React Query invalidation, 권한별 버튼 노출을 서버 정책과 맞췄습니다."
    ],
    "cases": [
      {
        "title": "벡터 검색에서는 맞았는데 최종 결과 순서가 달라짐",
        "problem": "ChromaDB에서 관련도가 높았던 모임이 MariaDB 조건 필터를 거친 뒤 최종 결과에서는 아래로 밀렸습니다.",
        "cause": "RDB에서 다시 조회하는 과정에서 벡터 검색의 similarity 순서가 사라졌습니다.",
        "approach": "검색 결과만 보고 임계값부터 바꾸지 않고 Vector Search → RDB filtering → 최종 응답 순서로 값을 따라갔습니다.",
        "solution": "벡터 similarity를 마지막 단계까지 유지하는 map을 두고 최종 결과를 다시 정렬했습니다. 이후 실제 검색 결과를 보며 threshold도 조정했습니다.",
        "result": "장소·category 조건을 적용하면서도 벡터 검색의 관련도 순서를 유지할 수 있게 했습니다."
      },
      {
        "title": "검색에 필요한 내부 표현이 사용자 답변에 그대로 노출됨",
        "problem": "검색 단계에서 사용하던 내부 태그와 Markdown 표기가 LLM 답변에 그대로 나오는 경우가 있었습니다.",
        "cause": "검색 문맥에 필요한 표현과 사용자에게 보여줄 출력 규칙이 명확히 분리돼 있지 않았습니다.",
        "approach": "검색용 context 자체를 없애기보다 내부 정보는 유지하되 최종 출력에서 무엇을 보여주면 안 되는지 따로 정의했습니다.",
        "solution": "system message와 출력 규칙을 수정해 내부 태그와 불필요한 Markdown을 사용자 응답에서 제외했습니다.",
        "result": "검색에 필요한 문맥은 유지하면서 사용자에게 보이는 답변 형태를 분리했습니다."
      }
    ],
    "aiNote": {
      "label": "AI 코딩 도구 활용",
      "text": "MariaDB correlated subquery alias 오류를 수정할 때 Copilot coding agent가 LEFT JOIN 집계 대안을 작성했습니다. 제안된 diff를 기존 구조와 비교하고 실행 결과를 확인한 뒤 반영했습니다.",
      "url": "https://github.com/LxNx-Hn/Hot-s-Pod/commit/191a8eae5cce326ccd488e2ebddf51c10e54585a"
    },
    "commits": [
      {
        "label": "RAG 결과 정렬",
        "sha": "bde5c71",
        "url": "https://github.com/LxNx-Hn/Hot-s-Pod/commit/bde5c71527ad0b3447d8b2f38f900aeea29ce6af"
      },
      {
        "label": "계층형 댓글 삭제",
        "sha": "4262beb",
        "url": "https://github.com/LxNx-Hn/Hot-s-Pod/commit/4262beb4ea7093cb572fdaabb2a414f3272e4bed"
      },
      {
        "label": "React Query 동기화",
        "sha": "54749ae",
        "url": "https://github.com/LxNx-Hn/Hot-s-Pod/commit/54749ae8c9c7e1038da2f115d10bc7854927cd72"
      }
    ]
  },
  {
    "title": "M_RAG",
    "repo": "https://github.com/LxNx-Hn/M_RAG",
    "label": "졸업논문 · RAG 구성 요소 비교 및 평가",
    "featured": false,
    "overview": "한국어 질문으로 영어 논문을 검색·답변하는 RAG에서 HyDE, CAD, SCD가 실제로 어떤 차이를 만드는지 비교한 졸업논문 프로젝트입니다. 기대한 결과에 맞추기보다 평가 지표와 구현이 목표를 제대로 측정하는지 다시 확인하는 데 집중했습니다.",
    "stack": [
      {
        "label": "AI",
        "items": [
          "RAG",
          "HyDE",
          "CAD",
          "SCD"
        ]
      },
      {
        "label": "Model",
        "items": [
          "PyTorch",
          "Transformers"
        ]
      },
      {
        "label": "Evaluation",
        "items": [
          "RAGAS",
          "paired comparison"
        ]
      },
      {
        "label": "Data / Experiment",
        "items": [
          "Python",
          "PostgreSQL",
          "실험 provenance"
        ]
      }
    ],
    "contributions": [
      "152개 답변의 한글 문자 비율을 따로 계산해 SCD on/off를 같은 질문 기준으로 다시 비교했습니다.",
      "기존 penalty 방식과 reference SCD 구현을 별도 mode로 분리해 이전 실험을 깨지 않고 다시 검증했습니다.",
      "RAGAS judge 실패 원인과 조건을 기록하고 null 셀만 다시 평가·병합하는 복구 흐름을 만들었습니다.",
      "HyDE query·model·parameter 정보를 남겨 같은 실험을 다시 확인할 수 있게 했습니다."
    ],
    "cases": [
      {
        "title": "SCD 효과를 보고 싶은데 기존 평가 점수로는 설명이 안 됨",
        "problem": "SCD를 적용하면 한국어 답변 유지가 좋아질 것으로 예상했지만 기존 RAGAS 결과만으로는 효과가 명확하지 않았습니다.",
        "cause": "사용하던 평가 지표가 SCD가 직접 바꾸려는 한국어 유지 정도를 측정하지 않았습니다.",
        "approach": "모델이나 prompt를 먼저 바꾸지 않고 평가 기준이 목표와 맞는지부터 다시 확인했습니다.",
        "solution": "152개 답변의 한글 문자 비율을 직접 계산하고 동일 질문에 대해 SCD on/off를 paired로 비교했습니다.",
        "result": "기존의 긍정적 해석을 유지하지 않고, 해당 구현에서는 순효과가 명확하지 않다는 null result로 결론을 수정했습니다."
      },
      {
        "title": "구현 차이와 평가 실패 때문에 같은 실험을 다시 확인하기 어려움",
        "problem": "SCD 구현 방식이 reference와 달랐고 RAGAS judge 실패로 일부 metric이 비어 있었습니다.",
        "cause": "기존 구현과 새 구현, 실패한 평가 셀이 한 실험 안에서 섞이면 이전 결과와 새 결과를 구분하기 어려웠습니다.",
        "approach": "기존 결과를 덮어쓰지 않고 구현과 평가 단계를 각각 분리해 다시 실행할 수 있게 했습니다.",
        "solution": "reference SCD를 별도 mode로 두고, judge 실패 로그를 남긴 뒤 null 셀만 재평가해 병합하도록 했습니다. query·model·parameter도 함께 기록했습니다.",
        "result": "과거 결과를 보존하면서 구현별 결과와 재평가 결과를 같은 조건에서 다시 확인할 수 있게 했습니다."
      }
    ],
    "commits": [
      {
        "label": "SCD 결과 재분석",
        "sha": "4a9f33a",
        "url": "https://github.com/LxNx-Hn/M_RAG/commit/4a9f33afd5b7f7cb5f29713465f47ad9c013fe7a"
      },
      {
        "label": "Reference SCD 분리",
        "sha": "34c328e",
        "url": "https://github.com/LxNx-Hn/M_RAG/commit/34c328e62ab043d8520515da96c98ce59e65ccf8"
      },
      {
        "label": "실험 provenance 강화",
        "sha": "10aa5d5",
        "url": "https://github.com/LxNx-Hn/M_RAG/commit/10aa5d52b12c675ebb29070f50ac557e1b7554ea"
      }
    ]
  },
  {
    "title": "AI_FinalTerm",
    "repo": "https://github.com/LxNx-Hn/AI_FinalTerm",
    "label": "PPO 강화학습 · Unity ML-Agents",
    "featured": false,
    "overview": "RAG 외의 AI 방식도 직접 경험해보기 위해 Unity 보스전을 학습하는 PPO 에이전트를 만든 프로젝트입니다. 학습 시간을 계속 늘리기보다 50K 로그를 보고 action space와 reward 구조에서 성능이 막히는 이유를 하나씩 확인했습니다.",
    "stack": [
      {
        "label": "RL",
        "items": [
          "PPO",
          "Unity ML-Agents"
        ]
      },
      {
        "label": "Environment",
        "items": [
          "Unity",
          "C#"
        ]
      },
      {
        "label": "Design",
        "items": [
          "MultiDiscrete",
          "Action Mask",
          "Reward Design"
        ]
      },
      {
        "label": "Analysis",
        "items": [
          "TensorBoard",
          "Training Log",
          "ONNX"
        ]
      }
    ],
    "contributions": [
      "50K 학습 로그에서 행동 빈도와 damage를 확인해 action 구조의 병목을 분석했습니다.",
      "Single Discrete [6]을 이동 [5]·공격 [2]이 분리된 MultiDiscrete [5,2]로 변경했습니다.",
      "공격 시도 자체에 주던 보상을 없애고 실제 HP 감소가 확인된 hit에만 보상을 주도록 바꿨습니다.",
      "방향별 위험도를 기준으로 이동·대기·공격 action mask를 구성했습니다."
    ],
    "cases": [
      {
        "title": "50K를 학습해도 공격 비율이 낮고 성능이 정체됨",
        "problem": "학습을 진행해도 공격 행동 비율이 낮고 보스에게 주는 damage가 충분히 늘지 않았습니다.",
        "cause": "사람은 이동하면서 공격할 수 있지만 기존 Single Discrete [6]에서는 이동과 공격 중 하나만 선택할 수 있었습니다.",
        "approach": "학습 step을 더 늘리기 전에 사람이 할 수 있는 행동과 에이전트가 선택할 수 있는 행동 자체를 비교했습니다.",
        "solution": "행동 공간을 이동 [5]와 공격 [2] branch로 나눈 MultiDiscrete [5,2]로 변경했습니다.",
        "result": "이동과 공격을 동시에 표현할 수 있게 됐지만 total damage 개선은 확인되지 않아, 구조 개선과 성능 개선을 따로 기록했습니다."
      },
      {
        "title": "공격을 맞히지 않아도 보상을 받는 reward farming",
        "problem": "에이전트가 실제 damage를 주지 않아도 공격 시도만 반복해 보상을 얻을 수 있었습니다.",
        "cause": "hit 여부와 관계없이 공격 시도 자체에 양의 reward가 붙어 있었습니다.",
        "approach": "보상 합계가 올라가는지만 보지 않고 어떤 행동으로 reward를 얻는지 로그를 다시 확인했습니다.",
        "solution": "공격 시도 reward를 제거하고 실제 보스 HP가 감소한 경우에만 hit reward를 주도록 변경했습니다.",
        "result": "의도하지 않은 reward farming은 제거했지만 클리어 성능까지 개선됐다고 보지는 않고 다음 병목을 다시 확인했습니다."
      }
    ],
    "aiNote": {
      "label": "AI 공동작업",
      "text": "대표 action/reward 수정 커밋에는 Claude 공동작성 이력이 있습니다. AI와 같이 수정한 뒤 구조 변화와 실제 학습 성능은 50K 로그를 기준으로 따로 확인했습니다.",
      "url": "https://github.com/LxNx-Hn/AI_FinalTerm/commit/6fedfb497ccb3d614c6d8a767f6f5b9e6306dc18"
    },
    "commits": [
      {
        "label": "50K 로그 병목 분석",
        "sha": "f08cd01",
        "url": "https://github.com/LxNx-Hn/AI_FinalTerm/commit/f08cd0153ed6c3941c334235b3fbae7aa73dc5f2"
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
      }
    ]
  }
];
