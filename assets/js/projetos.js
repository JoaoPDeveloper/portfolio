
listaProjetos.map((projeto, posicao) => {
let card = `
    <div class="col-md-4">
        <div class="card m-2" onclick="zoomImg('${posicao}')" title="Clique aqui para obter detalhes!" style="cursor: pointer;">
        <img src="${projeto.img}" id="imgProjeto" class="card-img-top" alt="Imagem do projeto">
        <div class="card-body">
        <h5 class="card-title" id="nomeProjeto" style="color:red">${projeto.nome}</h5>
        <button class="btn btn-light btn-sm" onclick="zoomImg('${posicao}')" id="botaoCorProjeto" title="Clique aqui para verificar o Projeto">Sobre o Projeto.</button>
                </div>
                </div>
                </div>
`;
document.querySelector("#cards").innerHTML += card;
})

function zoomImg(posicao) {
let projeto = listaProjetos[posicao];
document.querySelector("#modalZoomImgNomeProjeto").innerHTML = projeto.nome;
document.querySelector("#modalZoomImgDescricaoProjeto").innerHTML = projeto.descricao;
document.querySelector("#modalZoomImgProjeto").src = projeto.img;
document.querySelector("#tecnologia1").src  = projeto.tecnologia1;
document.querySelector("#tecnologia2").src  = projeto.tecnologia2;
document.querySelector("#tecnologia3").src  = projeto.tecnologia3;
document.querySelector('#ButtonProjeto').href = projeto.linkProjeto;
document.querySelector('#ButtonGitHub').href = projeto.linkGithub;
new bootstrap.Modal('#modalZoomImg').show();
}

function alterarTemaSite() {  
 let tema = document.querySelector("html").getAttribute("data-bs-theme");
 
 if (tema === 'dark') {
   document.querySelector("html").setAttribute("data-bs-theme", 'light');
   document.querySelector("#alterarTemaSite").innerHTML = ` <i class="bi bi-moon-stars"></i>`;
   document.querySelector("#textAbout").style.color = "white"
   document.querySelector("#textoAbout").style.color = 'white'
   document.querySelector("#aboutText").style.color = 'white'
   document.querySelector("#textoInicial").style.color = "black"
   document.querySelector("#textoPrincipal").style.color = "black"
   document.querySelector("#projectsContainer").style.color = 'white';
   document.querySelector(".icon3 img").src = "/assets/img/icon3.svg";
   document.querySelector("#nomeProjeto").style.color = 'yellow';
   document.querySelector("#square").text.color = 'yellow';
 } else {
   document.querySelector("html").setAttribute("data-bs-theme", 'dark');
   document.querySelector("#alterarTemaSite").innerHTML = `<i class="bi bi-brightness-high-fill"></i>`;
   document.querySelector("#textAbout").style.color = "yellow"
   document.querySelector("#textoAbout").style.color = 'yellow'
   document.querySelector("#aboutText").style.color = 'yellow'
   document.querySelector("#textoInicial").style.color = "yellow"
   document.querySelector("#textoPrincipal").style.color = "white"
   document.querySelector(".icon3 img").src = "/assets/img/icon3.svg";
   document.querySelector("#nomeProjeto").style.color = 'white';
   document.querySelector("#projectsContainer").style.color = 'yellow';
   document.querySelector("#square").style.color = 'yellow';
 }
 
 let botoes = document.querySelectorAll("#botaoCorProjeto");
 botoes.forEach((botao) => {
   botao.classList.toggle("btn-dark");
   botao.classList.toggle("btn-light");
 });
}
