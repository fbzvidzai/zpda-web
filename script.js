// ----------------------------
// ZPDA Portal Script.js (Server-Connected)
// ----------------------------

document.addEventListener("DOMContentLoaded", () => {

  // ----------------------------
  // Containers
  // ----------------------------
  const homeContainer = document.getElementById("poem-list");
  const archiveContainer = document.getElementById("results");

  // ----------------------------
  // Fetch poems from server
  // ----------------------------
  let allPoems = [];

  async function fetchAndDisplayPoems() {
    try {
      const res = await fetch('https://zpda-backend-1.onrender.com/poems');
      allPoems = await res.json();

      // Update Home page: featured poems
      if(homeContainer){
        const featured = allPoems.slice(0, 3);
        displayPoems(featured, "poem-list");
      }

      // Update Archive page: all poems
      if(archiveContainer){
        displayPoems(allPoems, "results");
      }
    } catch (err) {
      console.error("Error fetching poems:", err);
      if(homeContainer) homeContainer.innerHTML = "<p>Could not load poems.</p>";
      if(archiveContainer) archiveContainer.innerHTML = "<p>Could not load poems.</p>";
    }
  }

  // Initial fetch
  fetchAndDisplayPoems();

  // ----------------------------
  // Archive Page: Filters
  // ----------------------------
  if(archiveContainer){
    ["search","language","genre","period"].forEach(id => {
      const el = document.getElementById(id);
      if(el) el.addEventListener("input", () => {
        const keyword = document.getElementById("search")?.value.toLowerCase() || "";
        const lang = document.getElementById("language")?.value || "";
        const gen = document.getElementById("genre")?.value || "";
        const per = document.getElementById("period")?.value || "";

        const filtered = allPoems.filter(p =>
          (p.title.toLowerCase().includes(keyword) ||
           p.author.toLowerCase().includes(keyword) ||
           p.text.toLowerCase().includes(keyword)) &&
          (!lang || p.language === lang) &&
          (!gen || p.genre === gen) &&
          (!per || p.period === per)
        );

        displayPoems(filtered, "results");
      });
    });
  }

  // ----------------------------
  // Submit Page: Form
  // ----------------------------
  if(window.location.pathname.includes("submit.html")){
    const form = document.getElementById("poemForm");
    if(form){
      form.addEventListener("submit", async e => {
        e.preventDefault();

        const formData = Object.fromEntries(new FormData(form));

        try {
          const res = await fetch('https://zpda-backend-1.onrender.com/poems', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
          const data = await res.json();

          alert("Poem submitted successfully ✅");
          form.reset();

          // Refresh poems
          fetchAndDisplayPoems();

        } catch(err){
          console.error("Error submitting poem:", err);
          alert("Failed to submit poem. Check console.");
        }
      });
    }
  }

});

// ----------------------------
// Display Poems Function
// ----------------------------
function displayPoems(list, containerId){
  const container = document.getElementById(containerId);
  if(!container) return;

  container.innerHTML = "";

  if(list.length === 0){
    container.innerHTML = "<p>No poems found.</p>";
    return;
  }

  list.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <h3>${p.title}</h3>
      <p><strong>${p.author}</strong></p>
      <p>${p.text}</p>
      <p><em>${p.language || ""} | ${p.genre || ""} | ${p.period || ""}</em></p>
    `;
    container.appendChild(div);
  });
}