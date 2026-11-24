# 03leedo.github.io

이도헌(03leedo)의 포트폴리오 · https://03leedo.github.io/

- 연락처: hero9573@naver.com · [GitHub](https://github.com/03leedo)
- 대표 프로젝트: 카카오테크 캠퍼스 4기 팀 프로젝트 [아이캐치](https://github.com/kakaotechcampus-4/ktc4-pusan-3). 놀이 추천 에이전트(Activity Agent)와 AI 품질 평가(eval)를 맡았습니다.
- 수상: 제7회 PNU 창의융합 AI 해커톤 우수상(3위, [FarmBroker](https://github.com/03leedo/pnuai-b-06-bomdongmarket)) · 카카오테크 캠퍼스 4기 아이디어톤 우수상
- 교육: 카카오테크 캠퍼스 4기 Agentic AI 과정 수료 · 부산대학교 정보컴퓨터공학부 재학

## 구성

| 파일 | |
| --- | --- |
| `index.html` | 페이지 전부. 빌드 없이 그대로 배포합니다 |
| `assets/style.css` | 색은 `:root` 토큰. 밝은 · 어두운 화면 둘 다 |
| `assets/main.js` | 테마 전환 · 타임라인 툴팁 · Activity Agent 처리 흐름 재생 |
| `assets/og.png` | 링크 미리보기 이미지 (1200 × 630) |
| `404.html` | 없는 주소 |
| `resume/resume.html` | 이력서 원본 (A4 한 장, 한 단, 본문 10pt) |
| `resume/03leedo-resume.pdf` | 위 원본을 Chrome으로 인쇄한 것 |
| `tools/` | PR 타임라인을 만드는 스크립트와 그 입력 |

프로젝트 설명의 문장 끝에 붙은 작은 링크(`<a class="ev">`)는 그 내용의 근거가 되는 PR · 문서 · 측정 기록입니다.

## 이력서 PDF 다시 만들기

`resume/resume.html`을 고친 뒤 Chrome에서 열어 인쇄 → PDF로 저장(여백 기본, 배경 그래픽 켜기)하거나,
headless Chrome으로 다시 뽑습니다. 한 장을 넘지 않는지 확인합니다.

```bash
chrome --headless=new --no-pdf-header-footer --print-to-pdf=resume/03leedo-resume.pdf resume/resume.html
```

## PR 타임라인 다시 만들기

"10주 동안 머지한 PR 68개"는 `tools/prs.tsv`(gh로 뽑은 PR 목록)에서 `tools/make_timeline.py`가 만든 HTML 조각입니다.
PR이 바뀌면 목록을 다시 뽑고, 출력 조각으로 `index.html`의 `<div class="tl" id="pr-timeline">`부터 `</details>`까지를 바꿉니다.
영역(Activity · 연동 · 평가 · 그 밖)은 스크립트 위쪽의 PR 번호 목록으로 나눕니다.

```bash
gh pr list --repo kakaotechcampus-4/ktc4-pusan-3 --author 03leedo --state all --limit 200 \
  --json number,title,state,mergedAt,additions,deletions \
  --jq '.[] | "#\(.number)\t\(.state)\t\(.mergedAt[:10] // "-")\t+\(.additions)/-\(.deletions)\t\(.title)"' \
  > tools/prs.tsv
python tools/make_timeline.py tools/prs.tsv timeline.html
```

## 배포

GitHub Pages · `main` 브랜치 `/ (root)`. `.nojekyll`로 Jekyll 처리를 끕니다.

아이캐치 화면 · 영상 이미지(`assets/img/`)는 팀 저장소의 README에서 가져왔습니다. 이 페이지는 Claude Code를 활용해 만들었습니다.
