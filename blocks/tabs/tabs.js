import { moveInstrumentation } from '../../scripts/scripts.js';

function selectTab(selectedTab, tablist, panels) {
  tablist.querySelectorAll('.tabs-tab').forEach((tab) => {
    tab.setAttribute('aria-selected', 'false');
  });
  panels.querySelectorAll('.tabs-panel').forEach((panel) => {
    panel.hidden = true;
  });

  selectedTab.setAttribute('aria-selected', 'true');
  const panelId = selectedTab.getAttribute('aria-controls');
  const panel = panels.querySelector(`#${panelId}`);
  if (panel) panel.hidden = false;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const panels = document.createElement('div');
  panels.className = 'tabs-panels';

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const label = cells[0]?.textContent.trim() || `Tab ${i + 1}`;
    const content = cells[1] || document.createElement('div');
    const id = `tab-${label.toLowerCase().replace(/\s+/g, '-')}-${i}`;

    const tab = document.createElement('button');
    tab.className = 'tabs-tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    tab.setAttribute('aria-controls', `panel-${id}`);
    tab.id = id;
    tab.textContent = label;
    tab.addEventListener('click', () => selectTab(tab, tablist, panels));
    tablist.append(tab);

    const panel = document.createElement('div');
    panel.className = 'tabs-panel';
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', id);
    panel.id = `panel-${id}`;
    panel.hidden = i !== 0;
    while (content.firstChild) panel.append(content.firstChild);
    moveInstrumentation(row, panel);
    panels.append(panel);
  });

  block.textContent = '';
  block.append(tablist, panels);
}
