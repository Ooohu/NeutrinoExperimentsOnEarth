// Filter panel
const toggleBtnFilter = document.getElementById("toggle-filters");
const filterPanel = document.getElementById("filter-panel");

toggleBtnFilter.addEventListener("click", () => {
    filterPanel.classList.toggle("expanded");
    toggleBtnFilter.textContent = filterPanel.classList.contains("expanded") ? "Filters ▲" : "Filters ▼";
});

// Bottom text panel
const togglePanelBtn = document.getElementById("toggle-panel");
const bottomPanel = document.getElementById("bottom-panel");

togglePanelBtn.addEventListener("click", () => {
    bottomPanel.classList.toggle("collapsed");
    togglePanelBtn.textContent = bottomPanel.classList.contains("collapsed") ? "▲More" : "▼Less";
});