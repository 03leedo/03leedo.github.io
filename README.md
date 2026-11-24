# 03leedo.github.io

03leedo 의 포트폴리오 — https://03leedo.github.io/

대표 프로젝트는 카카오테크 캠퍼스 4기 팀 프로젝트 [아이캐치](https://github.com/kakaotechcampus-4/ktc4-pusan-3)입니다.
놀이 추천을 맡는 Activity Agent 와 AI 품질 평가(eval)를 맡았습니다.

## 이 페이지의 규칙

아이캐치에는 "근거 기록을 달지 못한 개인화 추천은 버그다" 라는 규칙이 있습니다. 이 페이지도 같은 규칙으로 썼습니다.

- 저에 대한 주장은 `<span class="claim">` 으로 감싸고, 그 안에 근거 링크 `<a class="ev">` 를 하나 이상 답니다.
- `assets/main.js` 가 페이지를 읽어 주장 수와 **근거 없는 주장 수**를 직접 세어 화면에 보여 줍니다. 0 이 아니면 빨갛게 바뀝니다.
- "근거 펼쳐 보기" 를 누르면 주장에 형광펜이 칠해지고 근거가 알약으로 펼쳐집니다.

## 구성

| 파일 | |
| --- | --- |
| `index.html` | 페이지 전부 — 빌드 없이 그대로 배포합니다 |
| `assets/style.css` | 색은 `:root` 토큰. 밝은 · 어두운 화면 둘 다 |
| `assets/main.js` | 테마 · 근거 세기 · "한 줄이 놀이 추천이 되기까지" 재생 |
| `resume/resume.html` | 이력서 원본 (A4 인쇄용) |
| `resume/03leedo-resume.pdf` | 위 원본을 Chrome 으로 인쇄한 것 |

이력서를 고친 뒤에는 `resume/resume.html` 을 Chrome 에서 열어 인쇄 → PDF 로 저장(여백 기본, 배경 그래픽 켜기)하거나,
headless Chrome 으로 다시 뽑습니다.

```bash
chrome --headless=new --no-pdf-header-footer --print-to-pdf=resume/03leedo-resume.pdf resume/resume.html
```

## 배포

GitHub Pages · `main` 브랜치 `/ (root)`. `.nojekyll` 로 Jekyll 처리를 끕니다.

아이캐치 화면 · 영상 이미지(`assets/img/`)는 팀 저장소의 README 에서 가져왔습니다. 이 페이지는 Claude Code 와 함께 만들었습니다.
