/**
 * Generates the correct EDS block markup for a Breadcrumb block.
 * Each breadcrumb item becomes its own row with 2 columns (link | text).
 * The last item (current page) has an empty link column.
 *
 * Usage:
 *   node tools/generate-breadcrumb.js "Home:/" "Insights & News:/insights-news" "Current Page"
 *
 * Output: HTML block markup ready to paste into a .plain.html content file.
 *
 * Model: breadcrumb (fields: link, text)
 * Structure: Container block - 1 row per item, 2 columns per row
 */

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: node tools/generate-breadcrumb.js "Label:path" "Label:path" "Current Page"');
  console.error('  Last item has no path (current page).');
  process.exit(1);
}

const items = args.map((arg, i) => {
  const isLast = i === args.length - 1;
  const parts = arg.split(':');

  if (isLast || parts.length === 1) {
    return { text: parts[0], link: '' };
  }

  const text = parts[0];
  const link = parts.slice(1).join(':');
  return { text, link };
});

const rows = items.map((item) => {
  const linkCell = item.link
    ? `<div><!-- field:link --><a href="${item.link}">${item.text}</a></div>`
    : '<div></div>';
  const textCell = `<div><!-- field:text -->${item.text}</div>`;
  return `    <div>\n        ${linkCell}\n        ${textCell}\n    </div>`;
});

const output = `<div class="breadcrumb">
${rows.join('\n')}
</div>`;

console.log(output);
