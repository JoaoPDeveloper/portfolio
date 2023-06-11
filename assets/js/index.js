
ScrollReveal().reveal(".headline", { delay: 300 });
ScrollReveal().reveal(".container-about", { delay: 800 });
ScrollReveal().reveal(".container", { delay: 800 });
ScrollReveal().reveal(".square", { delay: 800 });

window.onscroll = function () {
  var backToTopBtn = document.querySelector(".back-to-top");
  if (window.pageYOffset > 300) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
};
const bodyEl = document.body;
const barEl = document.querySelector(".bar");
const updateBar = () => {
  let scrollPos =
    (window.scrollY / (bodyEl.scrollHeight - window.innerHeight)) * 100;
  barEl.style.width = `${scrollPos}%`;
  requestAnimationFrame(updateBar);
};