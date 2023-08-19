const techStack = [
  {
    name: "JavaScript",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
  },
  {
    name: "ReactJS",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  },
  {
    name: "PHP",
    imageSrc:
      "https://www.primeirabusca.com/wp-content/uploads/2018/07/elephant.png",
  },
  {
    name: "Laravel",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Laravel.svg/1024px-Laravel.svg.png",
  },
  {
    name: "SQL",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/68/Oracle_SQL_Developer_logo.svg/800px-Oracle_SQL_Developer_logo.svg.png",
  },
  {
    name: "Angular",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/c/cf/Angular_full_color_logo.svg",
  },
  {
    name: "TypeScript",
    imageSrc:
      "https://cdn.iconscout.com/icon/free/png-512/typescript-1174965.png",
  },
  {
    name: "Bootstrap",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/b/b2/Bootstrap_logo.svg",
  },
  {
    name: "Java",
    imageSrc: "https://www.svgrepo.com/show/184143/java.svg",
  },
  {
    name: "AWS",
    imageSrc:
      "https://play-lh.googleusercontent.com/u_f6r0YV93zRmSO4-SBUlyzpnyNAI0gNATKat6URmcPvtmuCl2P7K9kr6al2A2InHrE=w240-h480-rw",
  },
  {
    name: "Git/GitHub",
    imageSrc: "https://alyssonmach.github.io/Minicurso-Git-e-GitHub/img/5.png",
  },
  {
    name: "Figma",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
  },
  {
    name: "Firebase",
    imageSrc: "https://www.svgrepo.com/show/353735/firebase.svg",
  },
  {
    name: "Slack",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
  },
  {
    name: "Azure",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg",
  },
  {
    name: "Tailwind",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
  },
  {
    name: "Bulma",
    imageSrc: "https://www.svgrepo.com/show/353527/bulma.svg",
  },
];
const cardsContainer = document.getElementById("languages");

techStack.forEach((language) => {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("col-md-2", "mb-4");

  const cardImg = document.createElement("img");
  cardImg.src = language.imageSrc;
  cardImg.classList.add("card-img");

  const cardTitle = document.createElement("h5");
  cardTitle.textContent = language.name;
  cardTitle.classList.add("card-title");

  cardDiv.appendChild(cardImg);
  cardDiv.appendChild(cardTitle);

  cardsContainer.appendChild(cardDiv);
});
