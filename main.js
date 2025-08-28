// ==============================
// Menú Hamburguesa
// ==============================
const hamburger = document.getElementById("hamburger");
const navMobile = document.getElementById("nav-mobile");

hamburger.addEventListener("click", () => {
  navMobile.classList.toggle("show");
  hamburger.classList.toggle("open");
});

document.querySelectorAll(".nav-mobile a").forEach(link => {
  link.addEventListener("click", () => {
    navMobile.classList.remove("show");
    hamburger.classList.remove("open");
  });
});


// ==============================
// FAB WhatsApp (futuro)
// ==============================
// Ejemplo: animación al aparecer, tracking de clics o
// abrir chat con un número dinámico según la página.
// function initWhatsAppFab() {
//   const fab = document.querySelector(".whatsapp-fab");
//   fab.addEventListener("click", () => {
//     console.log("FAB WhatsApp clickeado");
//   });
// }


// ==============================
// Formulario (futuro)
// ==============================
// Ejemplo: validar campos antes de enviar
// function validateForm() {
//   const form = document.querySelector(".contact-form");
//   form.addEventListener("submit", (e) => {
//     const name = document.getElementById("name").value.trim();
//     const email = document.getElementById("email").value.trim();
//     if (!name || !email) {
//       e.preventDefault();
//       alert("Por favor completa los campos obligatorios.");
//     }
//   });
// }


// ==============================
// Animaciones de secciones (futuro)
// ==============================
// Ejemplo: mostrar con efecto fade al hacer scroll
// function revealOnScroll() {
//   const sections = document.querySelectorAll("section");
//   const triggerBottom = window.innerHeight * 0.8;
//   sections.forEach(section => {
//     const top = section.getBoundingClientRect().top;
//     if (top < triggerBottom) {
//       section.classList.add("visible");
//     }
//   });
// }
// window.addEventListener("scroll", revealOnScroll);

