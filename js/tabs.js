const tabs = document.querySelector('.tabs');
const tabButtons = tabs.querySelectorAll('[role="tab"]');
const tabPanels = tabs.querySelectorAll('[role="tabpanel"]');

function handleTabClick(e) {
    const clickedButton = e.currentTarget;
    const selectedPanel = tabs.querySelector(`[aria-labelledby="${ clickedButton.id }"]`);

    tabPanels.forEach(panel => panel.hidden = true);
    tabButtons.forEach(tab => tab.setAttribute('aria-selected', false));

    clickedButton.setAttribute('aria-selected', true);
    selectedPanel.hidden = false;
}

tabButtons.forEach(button => button.addEventListener('click', handleTabClick));
