// Scroll reveal animation
window.addEventListener("scroll", () => {
  document.querySelectorAll(".reveal").forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
});

// CONTACT FORM (API READY)
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const status = document.getElementById("status");
  status.innerText = "Sending...";

  const data = {
    name: e.target[0].value,
    email: e.target[1].value,
    message: e.target[2].value
  };

  // 🔥 Replace with your backend API later
  setTimeout(() => {
    status.innerText = "Message sent successfully 🚀";
  }, 1500);
});