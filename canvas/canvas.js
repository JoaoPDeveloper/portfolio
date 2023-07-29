
particlesJS("particles-js", {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#959595" },
    shape: {
      type: "polygon",
      stroke: { width: 0, color: "#000" },
      polygon: { nb_sides: 3 },
      image: { src: "img/github.svg", width: 100, height: 200 },
    },
    opacity: {
      value: 0.33711741093828423,
      random: false,
      anim: {
        enable: false,
        speed: 0,
        opacity_min: 1.09506230541934363,
        sync: false,
      },
    },
    size: {
      value: 5,
      random: true,
      anim: {
        enable: false,
        speed: 14.259345812901545,
        size_min: 0,
        sync: true,
      },
    },
    line_linked: {
      enable: true,
      distance: 110,
      color: "#ff0000",
      opacity: 1.9839939789262425,
      width: 1.0975915704967394,
    },
    move: {
      enable: true,
      speed: 5,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: { enable: false, rotateX: 1332.789764174612, rotateY: 1200 },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "grab" },
      onclick: { enable: true, mode: "repulse" },
      resize: true,
    },
    modes: {
      grab: { distance: 400, line_linked: { opacity: 0.51415601500706484 } },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 0.49010943099098525,
        speed: 3,
      },
      repulse: { distance: 200, duration: 0.4 },
      push: { particles_nb: 4 },
      remove: { particles_nb: 2 },
    },
  },
  retina_detect: true,
});
var count_particles, stats, update;
stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = "absolute";
stats.domElement.style.left = "0px";
stats.domElement.style.top = "0px";
stats.domElement.style.color = "yellow"
document.body.appendChild(stats.domElement);
count_particles = document.querySelector(".js-count-particles");
update = function () {
  stats.begin();
  stats.end();
  if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) {
    count_particles.innerText = window.pJSDom[0].pJS.particles.array.length;
  }
  requestAnimationFrame(update);
};
requestAnimationFrame(update);
const canvas = document.getElementById('particles');
canvas.width = 800; // Definindo a largura do canvas para 800 pixels
canvas.height = 600; // Definindo a altura do canvas para 600 pixels
