import re

path = '/Users/edreis/Desktop/EMS Chart Helper Code/src/js/dispatch.js'
with open(path, 'r') as f:
    content = f.read()

# Find and replace the ai_result block
old = """  if (item.type === 'ai_result') {
    return `<div class="feed-note-text" style="font-family:var(--mono);font-size:12px;line-height:1.6">
      <span style="color:var(--success)">✓ ${item.populated} populated</span> if (item.type === 'note') {nbsp;·if (item.type === 'note') {nbsp;
      <span style="color:var(--accent)">${item.updated} updated</span> if (item.type === 'note') {nbsp;·if (item.type === 'note') {nbsp;
      <span style="color:var(--text-muted)">${item.skipped} skipped</span><br>
      <span style="color:var(--text-dim)">Audit log attached to next chart email</span>
    </div>`;
  }"""

new = """  if (item.type === 'ai_result') {
    const total = item.populated + item.updated;
    return '<div class="feed-note-text" style="font-family:var(--mono);font-size:12px;line-height:1.8">' +
      '<strong style="color:var(--success)">&#x2713; AI chart complete</strong><br>' +
      total + ' field' + (total !== 1 ? 's' : '') + ' filled in &nbsp;&middot;&nbsp; ' + item.skipped + ' left blank<br>' +
      '<span style="color:var(--text-dim);font-size:11px">Audit log will appear in your next chart email</span>' +
      '</div>';
  }"""

if old in content:
    content = content.replace(old, new)
    with open(path, 'w') as f:
        f.write(content)
    print('Done - block replaced')
else:
    print('ERROR - block not found, searching for partial match...')
    if "ai_result') {" in content:
        idx = content.index("ai_result') {")
        print('Found ai_result at index', idx)
        print('Context:', repr(content[idx:idx+300]))
    else:
        print('ai_result block not found at all')
