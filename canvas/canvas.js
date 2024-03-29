particlesJS("particles-js", {
  particles: {
    number: {
      value: 25,
      density: { enable: true, value_area: 900.2352352352348 },
    },
    color: { value: "#2d19aa" },
    shape: {
      type: "circle",
      stroke: { width: 5, color: "#0000CD" },
      polygon: { nb_sides: 3 },
      image: { src: "img/github.svg", width: 50, height: 50 },
    },
    opacity: {
      value: 0.1,
      random: false,
      anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
    },
    size: {
      value: 0.6,
      random: true,
      anim: { enable: false, speed: 300, size_min: 0.1, sync: false },
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0,
      width: 1,
    },
    move: {
      enable: true,
      speed: 2,
      direction: "bottom",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: { enable: false, rotateX: 600, rotateY: 1200 },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {

      resize: true,
    },
    modes: {
      grab: { distance: 200, line_linked: { opacity: 1 } },
      bubble: {
        distance: 563.7158871928543,
        size: 23.98791009331295,
        duration: 10,
        opacity: 0.9675123737636223,
        speed: 4,
      },
      repulse: { distance: 300, duration: 4 },
      push: { particles_nb: 1 },
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
