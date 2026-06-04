import os, re

slides_dir = r"C:\Users\mrlyd\Desktop\ai-assistant-ui-replica\react-blueprint\src\components\slides"

for fname in os.listdir(slides_dir):
    if not fname.endswith('.jsx'):
        continue
    path = os.path.join(slides_dir, fname)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    def replace_quotes_with_backticks(match):
        inner = match.group(1)
        # Escape backslashes, backticks, and ${ for template literal
        escaped = inner.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        return '<div className="code-block" dangerouslySetInnerHTML={{' + '__html: `' + escaped + '`' + '}} />'

    # Match dangerouslySetInnerHTML with single-quoted multi-line content
    new_content = re.sub(
        r'<div className="code-block" dangerouslySetInnerHTML=\{\{__html: \'([\s\S]*?)\'\}\} />',
        replace_quotes_with_backticks,
        content
    )

    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed code blocks in {fname}")

print("Done")
