
// config do scrolReveal
ScrollReveal().reveal(".headline", { delay: 300 });
ScrollReveal().reveal(".container-about", { delay: 800 });
ScrollReveal().reveal(".container", { delay: 800 });
ScrollReveal().reveal(".square", { delay: 800 });

// backtotop
window.onscroll = function () {
  var backToTopBtn = document.querySelector(".back-to-top");
  if (window.pageYOffset > 300) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
};
