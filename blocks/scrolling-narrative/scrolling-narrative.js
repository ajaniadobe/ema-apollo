export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  let leftEl;
  let rightEl;

  // Handle CAPI 2-row layout (left row + right row) and doc 1-row-2-cell layout
  if (rows.length >= 2 && rows[0].children.length === 1 && rows[1].children.length === 1) {
    leftEl = rows[0].firstElementChild;
    rightEl = rows[1].firstElementChild;
    rows[0].append(rightEl);
    rows.slice(1).forEach((row) => row.remove());
  } else {
    [leftEl, rightEl] = rows[0].children;
  }

  if (leftEl) leftEl.classList.add('scrolling-narrative-left');
  if (rightEl) rightEl.classList.add('scrolling-narrative-right');
}
