const panel = document.getElementById("bottom-panel");
const toggleBtn = document.getElementById("toggle-panel");

toggleBtn.addEventListener("click", () => {
    panel.classList.toggle("collapsed");
    console.log("HI")
    // Change button arrow
    if(panel.classList.contains("collapsed")){
        toggleBtn.textContent = "▲More"; // collapsed arrow
    } else {
        toggleBtn.textContent = "▼Less"; // expanded arrow
    }
});