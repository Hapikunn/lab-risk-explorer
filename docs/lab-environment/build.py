"""Build the read-only report; REPORT.md is the canonical text."""
from pathlib import Path
import re
import markdown2

ROOT = Path(__file__).resolve().parent
text = (ROOT / "REPORT.md").read_text(encoding="utf-8")
# Make source URLs clickable without changing Markdown image destinations.
text = re.sub(r"(?m)(。)(https://\S+)$", r"\1<\2>", text)
body = markdown2.markdown(text, extras=["tables", "header-ids"])
body = body.replace("<table>", '<div class="table-scroll"><table>').replace("</table>", "</table></div>")
page = '''<!doctype html>
<html lang="ja"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>想定するラボの装置・能力・自動化範囲</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#eef2f5;color:#1b2b39;font-family:system-ui,-apple-system,"Noto Sans JP",sans-serif;line-height:1.85}
main{max-width:1080px;margin:36px auto;background:white;padding:48px 54px;border-top:7px solid #176b72;border-radius:6px}
h1{font-size:2rem;line-height:1.5;margin:0 0 18px}h2{font-size:1.45rem;margin-top:48px;padding-bottom:8px;border-bottom:2px solid #c4dadd}h3{font-size:1.1rem;margin-top:28px}
a{color:#176b72;overflow-wrap:anywhere}p,li{overflow-wrap:anywhere}strong{color:#124d57}img{display:block;max-width:100%;max-height:430px;height:auto;margin:26px auto;object-fit:contain}
.table-scroll{overflow-x:auto;margin:24px 0}table{border-collapse:collapse;width:100%;font-size:.9rem;line-height:1.65}th,td{padding:12px 14px;vertical-align:top;border:1px solid #d5dfe3}th{background:#eaf3f3;text-align:left}tbody tr:nth-child(even){background:#f8fafb}
li{margin-bottom:8px}footer{margin-top:40px;padding-top:20px;border-top:1px solid #d5dfe3;color:#526672;font-size:.85rem}
@media(max-width:700px){main{margin:0;padding:26px 20px;border-radius:0}h1{font-size:1.5rem}table{min-width:650px}}
@media print{@page{size:A4;margin:16mm}body{background:white;font-size:10pt}main{margin:0;padding:0;border:0;max-width:none}h1{font-size:20pt}h2{font-size:15pt;break-after:avoid;margin-top:24px}h3{break-after:avoid}img{max-height:85mm;break-inside:avoid}table{font-size:8pt;min-width:0}th,td{padding:6px}thead{display:table-header-group}tr{break-inside:avoid}.table-scroll{overflow:visible}a{color:inherit}footer{font-size:8pt}}
</style></head><body><main>''' + body + '''<footer>本文：REPORT.md ／ 写真出典：PHOTOS.md ／ 根拠管理：sources.json<br>写真は公式公開URLを参照します。表示にはインターネット接続が必要です。</footer></main></body></html>'''
(ROOT / "report.html").write_text(page, encoding="utf-8")
print("Generated report.html")
