export const projects = [
  {
    "title": "동넷",
    "repo": "https://github.com/LxNx-Hn/KT-10",
    "label": "이동취약자 맞춤 경로 추천 · 동넷",
    "featured": true,
    "overview": "동넷은 이동취약자가 경로를 고를 때 소요시간만 보는 대신 경사, 도보거리, 환승, 계단·승강기, 저상버스, 접근성 정보와 시간대별 건물 그늘까지 함께 비교할 수 있게 만든 경로 추천 서비스입니다. 이동취약자에게 가장 빠른 경로가 항상 가장 좋은 경로는 아니라는 문제에서 시작했고, 경로를 볼 항목은 있었지만 프로필마다 무엇을 얼마나 중요하게 볼지 정량 기준이 없었습니다. 실제 경로 후보를 LLM으로 1차 평가한 뒤 점수와 근거를 다시 분석해 고정된 평가 rubric과 bootstrap 학습 데이터를 만들고, 6개 사용자 프로필별 XGBRanker baseline을 학습했습니다. 이후 후보 재정렬과 백엔드·서비스 연결까지 맡았습니다.",
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
      "경사·도보·환승·접근성·환경 정보를 실제 경로 후보 단위로 정리하고, VWorld 건물 정보와 태양 위치를 이용한 시간대별 건물 그늘 정보까지 평가·추천 모델 입력과 서비스 화면에 연결했습니다.",
      "평가 항목은 있었지만 프로필별 정량 기준이 없어서 실제 후보를 LLM으로 1차 평가하고, 점수와 근거를 다시 분석해 고정된 평가 rubric으로 정리했습니다.",
      "LLM 1차 평가의 점수와 근거를 재분석해 고정 rubric으로 옮기고, 이를 적용해 6,822개 bootstrap label과 6개 프로필별 XGBRanker baseline을 만들었습니다.",
      "화면에 보여줄 경로 수와 모델이 비교할 내부 candidate pool을 분리해, 개인화 모델이 더 넓은 후보를 비교한 뒤 최종 경로를 선택하도록 구성했습니다.",
      "확인 수준에 따라 데이터를 exact / estimated / unavailable로 나눠 모델과 화면에 같은 상태로 전달했습니다."
    ],
    "cases": [
      {
        "title": "평가 기준이 없는 상태에서 학습 데이터 만들기",
        "problem": "경사, 도보거리, 환승, 접근성처럼 경로를 볼 항목은 있었지만, 프로필마다 어떤 차이를 얼마나 크게 볼지 정량 기준이 없었습니다. 실제 사용자 선택 데이터도 충분하지 않아 바로 supervised ranking label을 만들 수 없었습니다.",
        "cause": "평가 항목 목록만으로는 경로 간 우선순위를 만들 수 없었고, 임의로 가중치와 점수를 정하면 그 기준 자체가 학습 결과에 그대로 들어가게 됩니다.",
        "approach": "먼저 실제 경로 후보를 6개 프로필 관점에서 LLM으로 1차 평가해 점수와 판단 근거를 모았습니다. 이후 어떤 항목이 반복해서 영향을 주는지와 점수 분포를 다시 확인해 프로필별 평가 기준을 정리했습니다.",
        "solution": "재분석한 내용을 고정된 profile evaluation rubric으로 만들고, 같은 실제 후보 스냅샷에 다시 적용해 380개 OD, 1,137개 경로, 6개 프로필의 6,822개 bootstrap label을 생성했습니다. 이 데이터로 XGBRanker baseline을 학습했고 artifact에서도 bootstrap 평가 기반 모델과 실제 사람 평가 모델을 구분하도록 했습니다.",
        "result": "프로필별 OD holdout에서 NDCG@3 0.9166~0.9596을 확인했습니다. 이 수치는 초기 평가 기준의 일관성을 확인한 bootstrap baseline 결과로 해석했고, 실제 사용자 선호 검증은 별도 검증 단계로 구분했습니다."
      },
      {
        "title": "개인화 전 후보 보존",
        "problem": "외부 API가 반환한 경로를 시간순 topN으로 바로 잘라 화면과 모델에 같이 쓰면, 특정 사용자에게는 더 적합하지만 일반 기준에서 조금 느린 경로가 개인화 평가를 받기도 전에 사라질 수 있었습니다.",
        "cause": "'화면에 몇 개를 보여줄지'와 '추천 모델이 몇 개를 비교해야 할지'는 다른 문제인데 같은 topN 값으로 묶여 있었습니다.",
        "approach": "최종 UI는 단순해야 하지만 내부에서는 개인화가 의미 있게 작동할 만큼 후보 다양성을 보존해야 한다고 봤습니다.",
        "solution": "UI topN과 내부 candidate pool을 분리해 더 넓은 후보군을 먼저 유지하고, 사용자 프로필로 재평가한 뒤 최종 경로만 화면에 보여주도록 순서를 바꿨습니다.",
        "result": "일반적인 시간순 필터가 개인화 모델의 선택지를 미리 없애는 구조를 줄이고, 후보 생성과 랭킹의 역할을 분리했습니다."
      },
      {
        "title": "불확실한 데이터 처리",
        "problem": "여러 공급원을 합치다 보니 실제 도로 선형이 없는 버스 경로, 연결되지 않은 철도 시간표, 공급원마다 표현이 다른 노선처럼 '값은 필요하지만 확정할 수 없는 정보'가 생겼습니다.",
        "cause": "추천 시스템은 숫자와 feature가 있으면 계산을 계속할 수 있지만, 임의로 채운 값은 오히려 모델이 거짓 확신을 갖게 만들 수 있었습니다.",
        "approach": "정보가 비어 있는 상태와 실제 값이 0인 상태를 분리하고, 사용자에게 보이는 결과에서도 데이터의 확인 수준이 드러나도록 기준을 잡았습니다.",
        "solution": "경로 geometry와 시간표 등은 exact / estimated / unavailable로 상태를 나눴습니다. 공급원 보완은 실제 공공 데이터가 확인되는 경우에 적용했습니다.",
        "result": "후보 수보다 데이터의 확인 수준을 우선해 추천 파이프라인에 상태를 남겼고, 모델과 화면이 같은 데이터 한계를 공유하도록 했습니다."
      }
    ],
    "commits": [
      {
        "label": "프로필 평가 기준",
        "sha": "32aacbd",
        "url": "https://github.com/LxNx-Hn/KT-10/commit/32aacbd603abb466d0f4fa1b4ace037ca33750fd"
      },
      {
        "label": "프로필 학습 데이터",
        "sha": "ec3d39a",
        "url": "https://github.com/LxNx-Hn/KT-10/commit/ec3d39a4603e5a30bfeaa2183da21b14b66ab8c2"
      },
      {
        "label": "XGBRanker baseline",
        "sha": "c75ab5f",
        "url": "https://github.com/LxNx-Hn/KT-10/commit/c75ab5f70ba6f2e63c4a8204ccbc097627e858f0"
      },
      {
        "label": "후보군·개인화 재평가",
        "sha": "c69be12",
        "url": "https://github.com/LxNx-Hn/KT-10/commit/c69be12b69936cb64b27839ac024a0b6a6793ad9"
      }
    ],
    "results": [
      "LLM 1차 평가의 점수·근거를 재분석해 고정 profile rubric으로 정리",
      "380개 OD · 1,137개 실제 경로 후보 · 6,822개 bootstrap 평가 label",
      "6개 프로필 XGBRanker baseline · NDCG@3 0.9166~0.9596",
      "UI topN과 내부 candidate pool을 분리해 개인화 전 후보 다양성 보존",
      "bootstrap_baseline과 human_validated 모델을 명시적으로 구분",
      "확인된 값과 estimated / unavailable 값을 추천·표시 단계에서 구분",
      "VWorld 건물 정보와 태양 위치를 이용해 출발 시각별 건물 그늘 비율·그늘 도보거리를 경로에 반영"
    ],
    "media": {
      "items": [
        {
          "src": "https://raw.githubusercontent.com/LxNx-Hn/KT-10/main/docs/app/hero-app.webp",
          "alt": "동넷 경로 추천 서비스 메인 화면",
          "caption": "실제 서비스 화면"
        },
        {
          "src": "https://raw.githubusercontent.com/LxNx-Hn/KT-10/main/docs/app/route-detail.webp",
          "alt": "동넷 경로 상세 정보 화면",
          "caption": "경로 상세 및 접근성 정보"
        },
        {
          "src": "https://raw.githubusercontent.com/LxNx-Hn/KT-10/main/docs/app/shade-overlay.webp",
          "alt": "동넷 시간대별 건물 그늘 오버레이 화면",
          "caption": "출발 시각별 건물 그늘 오버레이"
        }
      ],
      "links": [
        {
          "label": "발표 화면",
          "url": "https://lxnx-hn.github.io/KT-10/"
        }
      ]
    },
    "slug": "dongnet",
    "selected": {
      "summary": "경사·환승·접근성·시간대별 건물 그늘까지 함께 보는 이동취약자 경로 추천 서비스에서, 실제 경로 후보를 LLM으로 1차 평가하고 재분석해 6개 프로필별 XGBRanker 학습 데이터로 연결했습니다.",
      "role": "Ranking · Data Pipeline · Backend",
      "evidence": "380 OD · 1,137 routes · bootstrap NDCG@3 0.9166–0.9596"
    }
  },
  {
    "title": "M_RAG",
    "repo": "https://github.com/LxNx-Hn/M_RAG",
    "label": "Cross-lingual RAG 졸업논문 연구 진행 중 · M_RAG",
    "featured": true,
    "overview": "한국어 질문으로 영어 논문을 검색하고 한국어로 답하는 cross-lingual RAG를 졸업논문 주제로 진행 중입니다. 같은 Paper-RAG backbone에서 HyDE, CAD, SCD 8개 조합을 비교했고, 모델 효과뿐 아니라 서로 다른 언어가 섞인 결과를 어떻게 공정하게 평가할지도 실험의 한 부분으로 다뤘습니다.",
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
      "한국어 질의–영어 논문 환경에서 HyDE, CAD, SCD 8개 조합의 생성·평가 실험을 구성했습니다.",
      "SCD의 한국어 유지 효과를 RAGAS 점수와 분리해 생성 답변의 언어 준수율로 직접 측정했습니다.",
      "번역 여부가 SCD 효과와 섞이는 문제를 확인하고 영어·한국어 대칭 평가와 번역 integrity check를 설계했습니다.",
      "같은 평가 입력을 서로 다른 judge로 다시 채점해 특정 judge에서만 나타나는 차이를 최종 결론에서 분리했습니다."
    ],
    "cases": [
      {
        "title": "Cross-lingual 평가 조건",
        "problem": "질문은 한국어, 검색 context와 reference는 영어, SCD가 켜진 답변은 한국어에 가까웠습니다. 이 상태에서 RAGAS를 돌리면 내용 품질과 언어 차이가 같은 점수 안에 섞입니다.",
        "cause": "cross-lingual RAG에서는 의미가 같아도 judge가 언어 조합에 따라 다르게 반응할 수 있고, 특히 faithfulness는 답변과 context를 동시에 보기 때문에 언어 조건 자체가 평가 변수가 됩니다.",
        "approach": "처음에는 SCD-on context만 한국어로 번역해 언어를 맞췄지만, 그러면 SCD 여부와 번역 여부가 항상 같이 움직여 점수 차이를 분리할 수 없다는 confound를 확인했습니다.",
        "solution": "HyDE-off에서 검색 context가 byte 단위로 같은 38개 SCD on/off 쌍만 따로 잡고, 양쪽 조건 모두에 같은 normalization rule을 적용한 영어 패널과 한국어 패널을 각각 만들었습니다.",
        "result": "첫 비대칭 평가는 인과 결과가 아니라 sensitivity analysis로 낮춰 해석했고, SCD 외의 언어 조건을 최대한 맞춘 별도 평가를 만들었습니다."
      },
      {
        "title": "번역 과정의 평가 왜곡",
        "problem": "답변·context를 같은 언어로 맞추는 과정에서 숫자, 인용, 날짜, 모델명, metric명이나 기술 용어가 조금만 바뀌어도 원래 생성 결과가 아닌 번역 결과를 평가하게 됩니다.",
        "cause": "일반 번역에서는 자연스러움이 중요하지만 연구 평가에서는 단어 하나의 선택도 answer relevancy나 faithfulness에 영향을 줄 수 있습니다.",
        "approach": "번역 품질을 감으로 판단하지 않고 어떤 정보는 절대 바뀌면 안 되는지 먼저 정했습니다. 동시에 이미 목표 언어 조건을 만족하는 텍스트까지 다시 번역할 필요는 없다고 봤습니다.",
        "solution": "필요한 경우에만 번역하고 숫자·인용·circled number·고정 날짜 literal을 정확히 보존하는지 검사했습니다. 평가 입력은 score를 보기 전에 protocol id와 SHA-256으로 고정했습니다.",
        "result": "번역을 평가 전처리로 사용하면서도 그 과정 자체를 추적 가능한 변수로 남겼고, 같은 규칙을 적용해도 SCD-off/on의 실제 translation exposure가 달랐다는 한계까지 명시했습니다."
      },
      {
        "title": "Judge에 따른 결과 차이",
        "problem": "대칭 입력을 gpt-4o로 평가했을 때 answer relevancy가 낮아지는 구간이 나왔습니다. 수치만 보면 SCD의 비용이라고 쓰기 쉬웠습니다.",
        "cause": "RAGAS의 일부 metric은 LLM judge의 의미 판단에 의존하고, 평가 입력도 사후 normalization을 거친 상태라 한 judge의 결과만으로 방법의 인과 효과를 단정하기 어려웠습니다.",
        "approach": "첫 결과를 유리하거나 불리하다는 이유로 버리지 않고 입력을 그대로 고정한 채, normalization에 사용하지 않은 별도 고정 judge가 같은 방향을 재현하는지 확인했습니다.",
        "solution": "같은 영어·한국어 패널을 gpt-4.1-2025-04-14로 다시 채점하고 19개 query cluster 기준 paired bootstrap 신뢰구간을 비교했습니다.",
        "result": "gpt-4o에서 보였던 answer-relevancy의 비영점 음의 구간이 gpt-4.1에서는 재현되지 않았습니다. 최종 결론을 '한국어 유지 효과는 확인, judge에 강건한 RAG 품질 차이는 미확인'으로 제한했습니다."
      },
      {
        "title": "방법과 구현 효과 분리",
        "problem": "초기 penalty_additive SCD는 한국어 유지에 거의 도움이 되지 않았고 일부 이미 한국어인 답변을 오히려 악화시켰습니다.",
        "cause": "원 논문과 코드를 다시 대조해보니 target-language boost와 warm-up이 빠져 있었고, reference의 multiplicative scaling 대신 additive penalty를 사용하고 있었습니다.",
        "approach": "기존 결과를 지우고 새 구현으로 덮으면 실패 원인을 잃는다고 봤습니다. '내 구현에서의 결과'와 '논문 방식 자체의 결과'를 분리해야 했습니다.",
        "solution": "기존 penalty_additive를 그대로 보존하고 reference_scd를 별도 mode로 구현해 같은 실험 구조에서 다시 생성·평가했습니다.",
        "result": "reference_scd에서 한국어 비율 paired +0.2203, 76쌍 중 68쌍 개선을 확인했습니다. 초기 null result를 SCD 방법 자체의 실패로 잘못 결론내리지 않게 됐습니다."
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
        "label": "논문 초안 결과 정렬",
        "sha": "a5c15d2",
        "url": "https://github.com/LxNx-Hn/M_RAG/commit/a5c15d2539698acfb02e5eb56758bee48e292702"
      }
    ],
    "results": [
      "19 queries × 8 HyDE/CAD/SCD configs = 152 generations",
      "reference SCD 한국어 문자 비율 paired +0.2203 · 68/76 쌍 개선",
      "동일 검색 context 38쌍으로 영어/한국어 대칭 평가 구성",
      "한국어 유지 효과는 확인했지만 judge에 강건한 RAG-quality 차이는 확인하지 못함"
    ],
    "media": {
      "items": [
        {
          "src": "https://raw.githubusercontent.com/LxNx-Hn/M_RAG/main/docs/PAPER/figures/system_overview.svg",
          "alt": "M_RAG 전체 시스템 및 실험 구조",
          "caption": "System overview"
        },
        {
          "src": "https://raw.githubusercontent.com/LxNx-Hn/M_RAG/main/docs/PAPER/figures/factorial_design.svg",
          "alt": "HyDE CAD SCD factorial experiment design",
          "caption": "HyDE × CAD × SCD 실험 설계"
        }
      ],
      "links": [
        {
          "label": "국문 논문 초안 PDF",
          "url": "https://github.com/LxNx-Hn/M_RAG/blob/main/docs/PAPER/output/M_RAG_THESIS_KO.pdf"
        },
        {
          "label": "영문 논문 초안 PDF",
          "url": "https://github.com/LxNx-Hn/M_RAG/blob/main/docs/PAPER/output/M_RAG_THESIS_EN.pdf"
        }
      ]
    },
    "slug": "m-rag",
    "selected": {
      "summary": "한국어 질문으로 영어 논문을 검색하는 RAG에서 HyDE·CAD·SCD를 비교하고, cross-lingual 평가 조건 자체를 다시 검증했습니다.",
      "role": "Experiment Design · RAG · Evaluation",
      "evidence": "한국어 문자 비율 +0.2203 · 76쌍 중 68쌍 개선",
      "thumbnail": {
        "src": "./assets/mrag-selected.svg",
        "alt": "한국어 질의에서 영어 논문 검색, HyDE·CAD·SCD 비교와 cross-lingual 평가로 이어지는 M_RAG 요약 도식"
      }
    }
  },
  {
    "title": "CODE BLUE · PPO Boss Agent",
    "repo": "https://github.com/LxNx-Hn/AI_FinalTerm",
    "label": "컴퓨터게임 과제로 제작한 CODE BLUE + PPO 강화학습",
    "featured": true,
    "overview": "컴퓨터게임 과제로 직접 제작한 2D 격자 액션 게임 CODE BLUE의 보스전을 PPO로 해결해본 프로젝트입니다. Entry, 일반 전투, 병원, 엘리베이터 보스전, 옥상 엔딩, Credits까지 6개 씬으로 게임을 만들고 플레이어 이동·공격·대시, 적 AI, 아이템, trigger, UI, 다단계 보스 패턴을 구현했습니다. 이후 보스전을 별도 RL 학습 환경으로 연결해, 사람이 게임에서 할 수 있는 행동과 볼 수 있는 정보 범위 안에서 PPO agent가 보스를 처치하도록 학습했습니다.",
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
      "컴퓨터게임 과제로 CODE BLUE의 6개 scene, grid 이동, player combat, 적 AI, item/trigger, boss phase·pattern과 UI를 구현했습니다.",
      "완성한 보스전을 ML-Agents 학습 환경으로 연결하고, 실제 플레이 입력에 맞춰 action space와 observation을 설계했습니다.",
      "공격 기회, hit, 위험 회피 같은 행동 단위 지표를 추가해 reward 총합만으로 판단하지 않도록 했습니다.",
      "Action Space와 Reward 구조를 단계별로 수정하고 매 변경 뒤 fresh training으로 이전 checkpoint 영향을 분리했습니다.",
      "환경 설계를 고정한 뒤 PPO-only 1M long-run으로 실제 보스 클리어까지 확인했습니다."
    ],
    "cases": [
      {
        "title": "Action Space 설계",
        "problem": "50K 학습에서 agent는 살아남지만 공격을 거의 하지 않았습니다. 사람은 이동하면서 공격할 수 있는데 agent는 WAIT·이동·공격 중 하나만 선택하도록 만들어져 있었습니다.",
        "cause": "PPO의 학습량보다 앞서, 제가 정의한 Single Discrete [6] action space가 실제 게임 조작을 제대로 표현하지 못하고 있었습니다.",
        "approach": "학습 step이나 hyperparameter를 더 바꾸기 전에 사람의 input과 agent가 선택할 수 있는 action을 먼저 비교했습니다.",
        "solution": "이동 [5]와 공격 [2]을 독립 branch로 둔 MultiDiscrete [5,2]로 변경했습니다.",
        "result": "agent도 이동과 공격을 같은 decision에서 표현할 수 있게 됐고, 이후 성능 변화를 reward와 별도로 다시 확인할 수 있었습니다."
      },
      {
        "title": "Reward와 실제 행동의 차이",
        "problem": "이동과 공격을 동시에 할 수 있게 하자 agent의 reward는 늘었지만 실제 hit 없이 공격을 반복하는 행동이 생겼습니다.",
        "cause": "SafeInRangeAttackAttemptReward가 '공격 성공'이 아니라 '공격 시도' 자체를 보상해 policy가 의도보다 쉬운 reward 획득 경로를 찾았습니다.",
        "approach": "episode reward만 보지 않고 공격 시도, 실제 HP 감소, hit rate를 분리해 어떤 행동에서 점수가 생겼는지 확인했습니다.",
        "solution": "시도 보상을 제거하고 실제 boss HP 감소가 확인된 hit에만 bonus를 주는 hit-gated reward로 바꿨습니다.",
        "result": "reward farming을 제거했고, reward 증가와 task success를 같은 것으로 보지 않는 평가 기준을 만들었습니다."
      },
      {
        "title": "Observation의 정보 범위",
        "problem": "보스의 내부 pattern state나 다음 공격 순서를 observation에 넣으면 학습은 쉬워지지만 실제 사람보다 미래를 더 많이 아는 agent가 됩니다.",
        "cause": "Unity 내부에는 쉽게 읽을 수 있는 상태가 많지만, 연구 목표는 단순 클리어가 아니라 사람이 보는 정보 범위에서 학습 가능한지를 보는 것이었습니다.",
        "approach": "성능보다 observation의 정당성을 먼저 정하고, 실제 화면에 나타난 cue와 이미 관측된 history만 허용했습니다.",
        "solution": "MarkATK real/fake cue와 과거 sweep history처럼 플레이어가 확인 가능한 정보만 observation으로 구성하고 hidden/off-lane/stale target leak를 별도 metric으로 추적했습니다.",
        "result": "최종 1M run에서 hidden hit, off-lane hit, stale hit, fake-marker mask leak, next-band/sweep-sequence leak를 모두 0으로 확인했습니다."
      },
      {
        "title": "환경 고정 후 장기 학습",
        "problem": "20K~50K에서는 클리어가 거의 나오지 않아 구조가 아직 틀린 것인지, 장기 학습이 부족한 것인지 구분하기 어려웠습니다.",
        "cause": "환경을 계속 바꾸면 매번 학습 분포가 달라져 어느 수정이 실제 효과가 있었는지 판단하기 어려워집니다.",
        "approach": "Action Space, observation, hit-gated reward가 의도대로 동작한다고 확인한 시점부터는 더 이상 유리하게 조건을 바꾸지 않고 환경을 고정했습니다.",
        "solution": "같은 [5,2] action, 438차원 observation, reward 조건을 유지한 채 PPO-only 1M headless long-run을 수행했습니다.",
        "result": "892 episode에서 boss_dead 199회, 전체 클리어율 22.3%, 최근 100 episode 클리어율 80%, 최근 hit rate 97.3%를 기록해 장기 학습에서 실제 task success로 이어지는지 확인했습니다."
      }
    ],
    "aiNote": {
      "label": "AI 공동작업",
      "text": "RL 디버깅과 일부 action/reward 수정 커밋은 Claude 공동작성 이력이 있습니다. AI가 제안한 변경을 그대로 성과로 보지 않고 매 변경 뒤 Fresh training과 log metric으로 구조 변화와 실제 성능 변화를 따로 확인했습니다.",
      "url": "https://github.com/LxNx-Hn/AI_FinalTerm/commit/6fedfb497ccb3d614c6d8a767f6f5b9e6306dc18"
    },
    "commits": [
      {
        "label": "MDP / 환경 설계 분석",
        "sha": "1119175",
        "url": "https://github.com/LxNx-Hn/AI_FinalTerm/commit/111917571e5ef9f4422e80cfd2f3c5848702a55b"
      },
      {
        "label": "50K 병목 분석",
        "sha": "f08cd01",
        "url": "https://github.com/LxNx-Hn/AI_FinalTerm/commit/f08cd0153ed6c3941c334235b3fbae7aa73dc5f2"
      },
      {
        "label": "Action Space [5,2]",
        "sha": "6fedfb4",
        "url": "https://github.com/LxNx-Hn/AI_FinalTerm/commit/6fedfb497ccb3d614c6d8a767f6f5b9e6306dc18"
      },
      {
        "label": "Hit-gated Reward",
        "sha": "c84b1a4",
        "url": "https://github.com/LxNx-Hn/AI_FinalTerm/commit/c84b1a4d89f055e11ee69e926d1df2314012e5e9"
      },
      {
        "label": "Observation 설계",
        "sha": "af1894b",
        "url": "https://github.com/LxNx-Hn/AI_FinalTerm/commit/af1894b930d4e7e94cef8cb17f963058e51e42fb"
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
    ],
    "media": {
      "items": [
        {
          "src": "https://raw.githubusercontent.com/LxNx-Hn/AI_FinalTerm/main/presentations/final/assets/source_images/game_warning_tile.png",
          "alt": "CODE BLUE 보스전 warning tile 게임 화면",
          "caption": "직접 만든 CODE BLUE 보스전"
        },
        {
          "src": "https://raw.githubusercontent.com/LxNx-Hn/AI_FinalTerm/main/docs/rl_final/figures/clear_rate_by_step.png",
          "alt": "PPO 학습 step별 클리어율 그래프",
          "caption": "1M PPO 학습 중 클리어율 변화"
        }
      ],
      "links": [
        {
          "label": "1M PPO 클리어 영상",
          "url": "https://github.com/LxNx-Hn/AI_FinalTerm/blob/main/videos/05_late_clever_clear.mp4"
        },
        {
          "label": "최종 발표자료",
          "url": "https://github.com/LxNx-Hn/AI_FinalTerm/blob/main/presentations/final/CODE_BLUE_RL_FINAL.pptx"
        },
        {
          "label": "학습 영상 5종",
          "url": "https://github.com/LxNx-Hn/AI_FinalTerm/tree/main/videos"
        }
      ]
    },
    "slug": "code-blue",
    "selected": {
      "summary": "컴퓨터게임 과제로 만든 CODE BLUE의 보스전을 실제 플레이 조건에 맞춘 PPO 환경으로 연결해 학습했습니다.",
      "role": "Game Environment · PPO · Evaluation",
      "evidence": "892 episodes · 199 clears · overall 22.3% → recent 100 80%"
    },
    "evidence": [
      {
        "label": "1M PPO 결과 보고서",
        "url": "https://github.com/LxNx-Hn/AI_FinalTerm/blob/main/docs/rl_final/PPO_1M_CLEAR_FINAL_REPORT.md",
        "note": "892 episodes · boss_dead 199 · recent 100 clear rate 80%"
      },
      {
        "label": "1M PPO 클리어 영상",
        "url": "https://github.com/LxNx-Hn/AI_FinalTerm/blob/main/videos/05_late_clever_clear.mp4",
        "note": "1M PPO inference 실제 gameplay"
      }
    ]
  },
  {
    "title": "Hot's POD",
    "repo": "https://github.com/LxNx-Hn/Hot-s-Pod",
    "label": "자연어 기반 소모임 검색 · Hot's POD",
    "featured": false,
    "overview": "첫 RAG 프로젝트가 끝난 뒤 구조를 직접 다시 만들어보기 위해 진행한 자연어 소모임 검색 서비스입니다. 사용자가 '주말에 근처에서 가볍게 운동할 모임'처럼 검색하면 의미적으로 비슷한 모임을 찾되, 장소·category처럼 틀리면 안 되는 조건은 DB에서 다시 확인하도록 Vector Search와 RDB filtering을 연결했습니다. LLM은 검색 결과를 만드는 주체가 아니라, 확인된 모임을 사용자에게 설명하는 마지막 단계로 두었습니다.",
    "stack": [
      {
        "label": "AI / Search",
        "items": [
          "Sentence Transformers",
          "ChromaDB",
          "Vector Search",
          "LLM"
        ]
      },
      {
        "label": "Backend / Filter",
        "items": [
          "FastAPI",
          "MariaDB",
          "SQL",
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
        "label": "Search Design",
        "items": [
          "Semantic Retrieval",
          "Structured Filtering",
          "Similarity Calibration"
        ]
      }
    ],
    "contributions": [
      "의미 유사도와 장소·category 같은 구조화 조건을 어떤 순서로 결합할지 검색 흐름을 설계했습니다.",
      "Vector Search의 similarity가 DB filtering 뒤에도 유지되도록 최종 ranking까지 score를 전달했습니다.",
      "실제 query 결과를 보며 similarity threshold를 조정하고 검색 결과가 어떻게 달라지는지 비교했습니다.",
      "LLM에는 DB에서 확인된 모임만 넘기고, retrieval과 최종 답변의 역할을 분리했습니다."
    ],
    "cases": [
      {
        "title": "Semantic Search와 조건 검색의 역할 분리",
        "problem": "'운동할 사람', '조용한 모임'처럼 표현이 다양한 의도는 keyword만으로 찾기 어렵지만, 장소나 category는 의미가 비슷하다는 이유로 다른 값을 허용하면 안 됐습니다.",
        "cause": "Semantic Search는 표현 차이에 강하지만 hard constraint에는 느슨하고, SQL filter는 정확하지만 사용자의 애매한 의도를 이해하지 못합니다.",
        "approach": "어떤 정보는 의미가 비슷하면 되고, 어떤 정보는 정확히 일치해야 하는지 먼저 역할을 나눴습니다. 이후 실제 자연어 query 결과를 반복해서 보면서 similarity threshold도 같은 흐름 안에서 조정했습니다.",
        "solution": "먼저 embedding으로 의미 후보를 만들고 장소·category는 RDB에서 다시 확인했습니다. DB filtering 뒤에도 Vector Search의 similarity를 유지해 재정렬하고, threshold는 현재 데이터에서 관련 결과가 과하게 빠지거나 섞이지 않는 범위로 조정했습니다.",
        "result": "자연어 표현의 유연성은 가져가면서 구조화 조건은 정확히 지키고, 검색 관련도까지 마지막 순위에 반영하는 흐름을 만들었습니다."
      },
      {
        "title": "LLM의 역할 범위",
        "problem": "LLM에게 검색과 답변을 함께 맡기면 자연스럽지만, 실제 DB에 없는 모임을 섞거나 retrieval용 tag를 사용자 답변에 드러낼 가능성이 있었습니다.",
        "cause": "생성 모델의 자연스러운 표현 능력과 검색 시스템의 사실성 책임을 같은 단계에 두고 있었습니다.",
        "approach": "모임 존재 여부와 순위는 retrieval/DB가 책임지고, LLM은 그 결과를 설명하는 역할로 제한했습니다.",
        "solution": "확인된 context_pods만 LLM에 넘기고 내부 tag와 Markdown 규칙을 user-facing output과 분리했습니다.",
        "result": "LLM의 역할을 검색 판단이 아니라 표현 단계로 제한해, 자연스러운 답변과 검색 결과의 사실성을 분리했습니다."
      }
    ],
    "aiNote": {
      "label": "AI 코딩 도구 활용",
      "text": "MariaDB correlated subquery alias 오류에서는 Copilot coding agent가 LEFT JOIN 집계 대안을 작성했습니다. 전체 파일을 맡기지 않고 오류 범위와 기존 query 구조를 기준으로 diff를 확인한 뒤 실행 결과로 적용 여부를 판단했습니다.",
      "url": "https://github.com/LxNx-Hn/Hot-s-Pod/commit/191a8eae5cce326ccd488e2ebddf51c10e54585a"
    },
    "commits": [
      {
        "label": "RAG 검색 기준 조정",
        "sha": "15605d7",
        "url": "https://github.com/LxNx-Hn/Hot-s-Pod/commit/15605d78415bda211ef026341a2a60346065ebad"
      },
      {
        "label": "Similarity ranking 보존",
        "sha": "bde5c71",
        "url": "https://github.com/LxNx-Hn/Hot-s-Pod/commit/bde5c71527ad0b3447d8b2f38f900aeea29ce6af"
      },
      {
        "label": "LLM 출력 경계",
        "sha": "50a42ce",
        "url": "https://github.com/LxNx-Hn/Hot-s-Pod/commit/50a42cede6af5d0da5b32c8992a5c82b2bc1a9a5"
      }
    ],
    "results": [
      "Semantic Retrieval과 Structured Filtering을 분리한 자연어 검색 흐름",
      "DB filtering 이후에도 Vector similarity 기반 ranking 유지",
      "LLM은 확인된 검색 결과를 설명하는 단계로 제한"
    ],
    "slug": "hots-pod",
    "diagram": {
      "title": "Natural-language search pipeline",
      "nodes": [
        {
          "title": "Natural-language Query",
          "note": "사용자 표현"
        },
        {
          "title": "Semantic Retrieval",
          "note": "Sentence Transformer · ChromaDB"
        },
        {
          "title": "Structured Filter",
          "note": "장소 · Category · MariaDB"
        },
        {
          "title": "Re-rank",
          "note": "Similarity 보존 · threshold 조정"
        },
        {
          "title": "LLM Response",
          "note": "확인된 결과만 설명"
        }
      ]
    },
    "journey": {
      "order": 2,
      "stage": "검색 구조 직접 재설계",
      "summary": "첫 RAG 프로젝트 이후 retrieval 구조를 직접 다시 구성하면서 Semantic Retrieval과 장소·category 같은 hard constraint를 분리했습니다.",
      "focus": "Vector similarity를 DB filtering 뒤에도 유지하고, LLM은 확인된 검색 결과를 설명하는 마지막 단계로 제한했습니다.",
      "evidence": "Semantic Retrieval → Structured Filter → Re-rank → LLM",
      "links": [
        {
          "label": "Repository",
          "url": "https://github.com/LxNx-Hn/Hot-s-Pod"
        }
      ],
      "role": "Search Design · Backend · RAG"
    }
  },
  {
    "title": "창업지원 RAG 챗봇",
    "repo": "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter",
    "label": "첫 RAG 서비스 프로젝트 · Project Leader",
    "featured": false,
    "overview": "창업 희망자의 질문에 정책, 창업 정보, 검색 트렌드를 찾아 답하는 RAG 챗봇입니다. 처음 RAG를 서비스 형태로 다뤘던 프로젝트라 '모델을 어떻게 붙일까'보다 어떤 질문을 서비스가 답해야 하고, 질문 종류에 따라 어떤 데이터를 써야 하는지를 먼저 정하는 과정이 중요했습니다. Project Leader로 질문 분류부터 검색·응답, FastAPI–React 연결과 배포까지 전체 흐름을 맞췄습니다.",
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
      "질문을 창업·정책·트렌드·범위 외로 나누고 category별 데이터 source와 응답 경로를 연결했습니다.",
      "classifier가 설명을 생성하지 않고 routing 값만 반환하도록 출력 형식을 제한하고 분류 성능을 반복 검증했습니다.",
      "팀원이 만든 데이터·AI·frontend 기능의 입력·출력 기준을 맞춰 하나의 사용자 흐름으로 연결했습니다.",
      "데모 규모에서는 GPU 모델을 직접 상시 운영하지 않고 NVIDIA NIM gateway + Cloud Run + Netlify 구조로 배포했습니다."
    ],
    "cases": [
      {
        "title": "질문 범위와 Routing",
        "problem": "생성형 AI는 창업과 관련 없어도 그럴듯하게 답할 수 있었고, 정책 질문과 트렌드 질문은 필요한 데이터의 성격도 달랐습니다. 모든 질문을 하나의 RAG 경로로 보내는 게 맞지 않았습니다.",
        "cause": "RAG의 검색 정확도보다 앞단에서 '이 질문이 서비스 범위 안인지, 어느 정보 경로로 가야 하는지'를 정하는 기준이 필요했습니다.",
        "approach": "모델에게 더 많은 문서를 주는 대신 질문을 먼저 구조화해 서비스가 책임질 범위를 분명하게 만들었습니다.",
        "solution": "질문을 창업·정책·트렌드·범위 외 네 종류로 분류하고 결과에 따라 다른 데이터 경로를 실행했습니다. classifier 출력은 한 글자로 제한해 생성형 설명이 routing에 섞이지 않게 했습니다.",
        "result": "프로젝트 기준 Accuracy 97.14%, Recall 97.94%, Precision 98.07%, F1 97.60을 확인했고, 범위 밖 질문을 별도 처리할 수 있게 됐습니다."
      },
      {
        "title": "모델 운영 방식 선택",
        "problem": "로컬 GPU 환경에서는 동작했지만 실제 데모에서는 모델 서버, API key, backend, frontend, 비용을 함께 고려해야 했습니다. 모든 것을 직접 호스팅하면 프로젝트 규모에 비해 운영 부담이 컸습니다.",
        "cause": "개발 단계의 '모델이 실행된다'와 서비스 단계의 '반복 배포하고 유지할 수 있다'는 다른 기준이었습니다.",
        "approach": "AI 모델 자체를 소유하는 것보다 데모에서 필요한 제어 범위와 운영 비용을 기준으로 경계를 다시 나눴습니다.",
        "solution": "NVIDIA NIM 호출을 담당하는 경량 FastAPI gateway만 Cloud Run에 두고 Netlify frontend와 연결했습니다. Secret Manager, instance 상한, Artifact Registry 정리 정책도 같은 운영 흐름에 포함했습니다.",
        "result": "AI 기능을 실제 서비스 형태로 배포하면서 모델, backend, secret, 비용을 하나의 운영 조건으로 같이 보게 됐습니다."
      }
    ],
    "commits": [
      {
        "label": "초기 서비스 Demo",
        "sha": "52269ce",
        "url": "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter/commit/52269ceb61332a532e24cc8bf48794181c01ba86"
      },
      {
        "label": "Cloud Run·Netlify 배포",
        "sha": "d111c15",
        "url": "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter/commit/d111c15ac7754c3cc96824f891d5e613a0efe532"
      },
      {
        "label": "Secret Manager 배포",
        "sha": "63a51ac",
        "url": "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter/commit/63a51acbdfa51ae147ca1c13936eb065439aaab1"
      },
      {
        "label": "데모 비용 조건",
        "sha": "3f2a33c",
        "url": "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter/commit/3f2a33c9a92b619555850751005f9bae8d32be9f"
      }
    ],
    "results": [
      "질문 분류 Accuracy 97.14% · Recall 97.94% · Precision 98.07% · F1 97.60",
      "질문 분류 → 데이터 경로 → RAG 응답으로 이어지는 서비스 구조 연결",
      "Cloud Run backend + Netlify frontend + GitHub Actions CI/CD 구성",
      "Secret Manager와 Cloud Run/Artifact Registry 비용 제어까지 데모 운영 범위에 포함"
    ],
    "media": {
      "items": [
        {
          "src": "https://raw.githubusercontent.com/LxNx-Hn/chatbot-with-kt-dgucenter/main/ops/images/Screenshot/%EB%B0%98%EC%9D%91%ED%98%95UI.png",
          "alt": "창업지원 RAG 챗봇 반응형 UI",
          "caption": "Desktop / Mobile UI"
        },
        {
          "src": "https://raw.githubusercontent.com/LxNx-Hn/chatbot-with-kt-dgucenter/main/ops/images/Screenshot/%EC%98%88%EC%8B%9C_%EC%A0%95%EC%B1%85.png",
          "alt": "창업지원 RAG 챗봇 정책 질문 응답 예시",
          "caption": "정책 질문 응답 예시"
        }
      ],
      "links": [
        {
          "label": "시연 영상",
          "url": "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter/blob/main/ops/presentations/%EC%8B%9C%EC%97%B0%EC%98%81%EC%83%81.mp4"
        }
      ]
    },
    "slug": "startup-rag",
    "journey": {
      "order": 1,
      "stage": "첫 서비스형 RAG",
      "summary": "Project Leader로 질문 분류와 routing부터 검색·응답, FastAPI–React 연결, Cloud Run·Netlify 배포까지 전체 흐름을 맞췄습니다.",
      "focus": "질문 범위와 데이터 경로를 먼저 나누고, 모델·백엔드·secret·비용을 함께 운영 조건으로 봤습니다.",
      "evidence": "Classifier F1 97.60 · Cloud Run + Netlify",
      "links": [
        {
          "label": "Repository",
          "url": "https://github.com/LxNx-Hn/chatbot-with-kt-dgucenter"
        }
      ],
      "role": "Project Leader · Technical Lead"
    }
  }
];
