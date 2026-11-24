"""prs.tsv → 포트폴리오의 PR 타임라인(주 × 영역 유닛 차트)과 표 HTML 조각을 만든다.

사용: python -I make_timeline.py <prs.tsv> <out.html>
"""
import datetime as dt
import html
import sys
from collections import Counter, defaultdict

REPO = "https://github.com/kakaotechcampus-4/ktc4-pusan-3/pull/"
START = dt.date(2026, 9, 7)  # 프로젝트 첫 주 월요일
WEEKS = 10

ROWS = ["Activity Agent", "공공데이터 연동", "AI 품질 평가", "로그인 · 그 밖"]
EVAL = {788, 930}
DATA = {328, 346, 870, 964, 669, 668, 858, 583, 517, 741, 742, 390}
ETC = {19, 57, 58, 62, 95, 98, 821, 841}


def area(n: int) -> str:
    if n in EVAL:
        return ROWS[2]
    if n in DATA:
        return ROWS[1]
    if n in ETC:
        return ROWS[3]
    return ROWS[0]


def clean(title: str) -> str:
    # "[AI] feat(activity): ..." · "[AI Feat] Activity: ..." 머리표를 뗀다
    t = title
    if t.startswith("["):
        t = t.split("]", 1)[1].strip()
    for pre in ("feat(", "fix(", "docs(", "refactor(", "test("):
        if t.startswith(pre) and "):" in t:
            t = t.split("):", 1)[1].strip()
    return t


prs = []
for line in open(sys.argv[1], encoding="utf-8"):
    num, state, merged, _diff, title = line.rstrip("\n").split("\t", 4)
    if state != "MERGED":
        continue
    n = int(num.lstrip("#"))
    d = dt.date.fromisoformat(merged)
    w = (d - START).days // 7
    assert 0 <= w < WEEKS, (n, d)
    prs.append({"n": n, "d": d, "w": w, "area": area(n), "title": clean(title)})

prs.sort(key=lambda p: (p["d"], p["n"]))
cells = defaultdict(list)
for p in prs:
    cells[(p["area"], p["w"])].append(p)
row_count = Counter(p["area"] for p in prs)
week_count = Counter(p["w"] for p in prs)

out = []
labels = []
for w in range(WEEKS):
    day = START + dt.timedelta(days=7 * w)
    labels.append(f"{day.month}/{day.day}")

out.append('<div class="tl" id="pr-timeline">')
out.append('  <div class="tl__row tl__row--axis" aria-hidden="true"><span class="tl__label"></span>')
for w, lab in enumerate(labels):
    out.append(f'    <span class="tl__wk">{lab}</span>')
out.append("  </div>")
for r in ROWS:
    out.append(f'  <div class="tl__row">')
    out.append(f'    <span class="tl__label">{html.escape(r)} <b>{row_count[r]}</b></span>')
    for w in range(WEEKS):
        dots = []
        for p in cells.get((r, w), []):
            tip = f'#{p["n"]} · {p["d"].month}/{p["d"].day} · {p["title"]}'
            dots.append(
                f'<a class="tl__dot" href="{REPO}{p["n"]}" data-tip="{html.escape(tip, quote=True)}" '
                f'aria-label="{html.escape(tip, quote=True)}"></a>'
            )
        out.append(f'    <span class="tl__cell">{"".join(dots)}</span>')
    out.append("  </div>")
out.append('  <div class="tl__row tl__row--sum" aria-hidden="true"><span class="tl__label">주별 합계</span>')
for w in range(WEEKS):
    out.append(f'    <span class="tl__wk">{week_count.get(w, 0) or ""}</span>')
out.append("  </div>")
out.append("</div>")

# 표 보기
out.append('<details class="tl-table">')
out.append(f"  <summary>표로 보기 · PR {len(prs)}개</summary>")
out.append('  <div class="tl-table__scroll"><table>')
out.append("    <thead><tr><th>PR</th><th>머지</th><th>영역</th><th>제목</th></tr></thead><tbody>")
for p in prs:
    out.append(
        f'      <tr><td><a href="{REPO}{p["n"]}">#{p["n"]}</a></td><td>{p["d"].isoformat()}</td>'
        f'<td>{html.escape(p["area"])}</td><td>{html.escape(p["title"])}</td></tr>'
    )
out.append("    </tbody></table></div>")
out.append("</details>")

open(sys.argv[2], "w", encoding="utf-8").write("\n".join(out) + "\n")
print("total", len(prs))
print("rows", dict(row_count))
print("weeks", {labels[w]: week_count.get(w, 0) for w in range(WEEKS)})
print("max per cell", max(len(v) for v in cells.values()))
for r in ROWS:
    print(r, [len(cells.get((r, w), [])) for w in range(WEEKS)])
