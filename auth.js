// auth.js — Site-wide profile circle + dropdown
document.addEventListener("DOMContentLoaded", () => {
  const authContainer = document.getElementById("auth-container");
  const token = localStorage.getItem("zpdaToken");
  const username = localStorage.getItem("username");
  const savedImage = localStorage.getItem("profileImage");

  if (token && username) {
    // Logged-in user — show profile circle
    authContainer.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px; position:relative;">
        <div id="profile-pic-container" style="width:40px; height:40px; border-radius:50%; background:#3b5998; color:white; display:flex; justify-content:center; align-items:center; font-weight:bold; font-size:16px; cursor:pointer; border:2px solid white; overflow:hidden;">
          <img id="profile-pic" src="${savedImage || ''}" style="width:100%; height:100%; object-fit:cover; display:${savedImage ? 'block' : 'none'};">
          <span id="profile-initials" style="display:${savedImage ? 'none' : 'flex'};">${username.charAt(0).toUpperCase()}</span>
        </div>
        <input type="file" id="uploadPic" style="display:none;" accept="image/*">
        <div id="profile-dropdown" style="position:absolute; top:50px; right:0; background:#0f3460; color:white; border-radius:6px; display:none; flex-direction:column; min-width:140px; z-index:1000;">
          <a href="dashboard.html" style="padding:8px 12px; text-decoration:none; color:white;">Dashboard</a>
          <a href="#" id="logoutBtn" style="padding:8px 12px; text-decoration:none; color:white;">Logout</a>
        </div>
      </div>
    `;

    const profilePic = document.getElementById("profile-pic");
    const profileInitials = document.getElementById("profile-initials");
    const uploadInput = document.getElementById("uploadPic");
    const dropdown = document.getElementById("profile-dropdown");
    const picContainer = document.getElementById("profile-pic-container");

    // Click on profile circle → open file picker
    picContainer.addEventListener("click", () => uploadInput.click());

    // Save uploaded image to localStorage and update UI
    uploadInput.addEventListener("change", () => {
      const file = uploadInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e){
        localStorage.setItem("profileImage", e.target.result);
        profilePic.src = e.target.result;
        profilePic.style.display = 'block';
        profileInitials.style.display = 'none';
      };
      reader.readAsDataURL(file);
    });

    // Right-click to toggle dropdown
    picContainer.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
    });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("zpdaToken");
      localStorage.removeItem("username");
      localStorage.removeItem("profileImage");
      window.location.href = "login.html";
    });

    // Close dropdown if clicked outside
    document.addEventListener("click", (e) => {
      if (!authContainer.contains(e.target)) {
        dropdown.style.display = "none";
      }
    });

  } else {
    // Not logged-in — show Login/Signup buttons
    authContainer.innerHTML = `
      <a href="login.html" class="auth-btn">Login</a>
      <a href="signup.html" class="auth-btn signup">Sign Up</a>
    `;
  }
});