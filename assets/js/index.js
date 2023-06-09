var i = setInterval(function () {
  clearInterval(i);
  document.getElementById("carregando").style.display = "none";
  document.getElementById("container").style.display = "inline";
}, 1000);
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
function backToTop() {
  window.scrollTo(0, 0);
}
document.getElementById("botaoMostrar").addEventListener("click", function () {
  document.querySelector(".conteudo").classList.add("mostrando");
});

document
  .getElementById("botaoMostrar")
  .addEventListener("click", function (event) {
    event.preventDefault();
    var elementoDestino = document.getElementById("container-about");
    var offsetTop = elementoDestino.offsetTop;
    var deslocamento = offsetTop - 100;
    window.scrollTo({
      top: deslocamento,
      behavior: "smooth",
    });
  });

const bodyEl = document.body;
const barEl = document.querySelector(".bar");
const updateBar = () => {
  let scrollPos =
    (window.scrollY / (bodyEl.scrollHeight - window.innerHeight)) * 100;
  barEl.style.width = `${scrollPos}%`;
  requestAnimationFrame(updateBar);
};

updateBar();
const javascriptProgress = document.querySelector(".javascript progress");
const typescriptProgress = document.querySelector(".typescript progress");
const phpProgress = document.querySelector(
  ".progress-bar.progress-bar progress"
);
const angularProgress = document.querySelector(
  ".progress-bar:nth-of-type(2) progress"
);
const sqlProgress = document.querySelector(
  ".progress-bar:last-of-type progress"
);
const tailwindProgress = document.querySelector(
  ".progress-bar:last-of-type progress"
);

javascriptProgress.style.setProperty("--progress-value", "65");
typescriptProgress.style.setProperty("--progress-value", "45");
phpProgress.style.setProperty("--progress-value", "35");
angularProgress.style.setProperty("--progress-value", "35");
sqlProgress.style.setProperty("--progress-value", "75");
tailwindProgress.style.setProperty("--progress-value", "35");

function openPokedexModal() {
  document.getElementById("modal").style.display = "block";
}
function closePokedexModal() {
  document.getElementById("modal").style.display = "none";
}
function openBuzzfeedModal() {
  document.getElementById("modal-buzz").style.display = "block";
}
function closeBuzzfeedModal() {
  document.getElementById("modal-buzz").style.display = "none";
}
function openInvertedModal() {
  document.getElementById("modal-world").style.display = "block";
}
function closeInvertedModal() {
  document.getElementById("modal-world").style.display = "none";
}
function openMarioModal() {
  document.getElementById("modal-mario").style.display = "block";
}
function closeMarioModal() {
  document.getElementById("modal-mario").style.display = "none";
}
function openDolarModal() {
  document.getElementById("modal-dolar").style.display = "block";
}
function closeDolarModal() {
  document.getElementById("modal-dolar").style.display = "none";
}
function openFinanceiroModal() {
  document.getElementById("modal-financeiro").style.display = "block";
}
function closeFinanceiroModal() {
  document.getElementById("modal-financeiro").style.display = "none";
}
function openLoadinModal() {
  document.getElementById("modal-carregar").style.display = "block";
}
function closeLoadingModal() {
  document.getElementById("modal-carregar").style.display = "none";
}
