let nome = "";

// BONUS INICIO

let toNome = "Todos";
let tipoMsg = "message"; // or private_message    

document.querySelector("textarea").addEventListener("keypress", enviarEnter);

function notif(){
    let not = document.querySelector(".notif");

    if(toNome !== "Todos"){
        not.innerHTML = "Enviando para " + toNome;
        if(tipoMsg === "private_message"){
            not.innerHTML += " (reservadamente)";
        }
    }else { not.innerHTML = "";  }
}

function logados(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promessa.then(sucessoLog);
}

function sucessoLog(obj){
    const dom = document.querySelector(".listaNomes");
    if(toNome === "Todos"){
        dom.innerHTML = "<div data-identifier='participant' class='nomeEscolhido' onclick='selecNome(this)'><div><ion-icon name='people'></ion-icon><span>Todos</span></div><img src='./imagens/certin.png' ></div>";
    }else{   dom.innerHTML = "<div data-identifier='participant' onclick='selecNome(this)'><div><ion-icon name='people'></ion-icon><span>Todos</span></div><img src='./imagens/certin.png' ></div>";   }

    for(let i = 0;i<obj.data.length;i++){
        if(obj.data[i].name === toNome){
            dom.innerHTML += `<div data-identifier='participant' class='nomeEscolhido' onclick='selecNome(this)'><div><ion-icon name='person-circle'></ion-icon><span>${obj.data[i].name}</span></div><img src='./imagens/certin.png' ></div>`;
        }else {   dom.innerHTML += `<div data-identifier='participant' onclick='selecNome(this)'><div><ion-icon name='person-circle'></ion-icon><span>${obj.data[i].name}</span></div><img src='./imagens/certin.png' ></div>`; }
    }
}

function selecNome(elemento){
    document.querySelector(".nomeEscolhido").classList.remove("nomeEscolhido");
    elemento.classList.add("nomeEscolhido");
    toNome = elemento.querySelector("span").textContent;
    if(toNome === "Todos"){
        selecVisib(document.querySelector(".visibPub"));
    }
    notif();
}

function selecVisib(elemento){
    if(toNome !== "Todos" || tipoMsg === "private_message"){
        document.querySelector(".visibEscolhida").classList.remove("visibEscolhida");
        elemento.classList.add("visibEscolhida");
        if(elemento.querySelector("span").textContent === "Reservadamente"){
            tipoMsg = "private_message";
        }else { tipoMsg = "message";    }
        notif();
    }
}

function trocaTelaMenu(){
    logados();
    document.querySelector(".fundoMenu").classList.toggle("escondido");
}

function trocaTelaLogin(){
    document.querySelector(".pagLogin").classList.add("escondido");
    document.querySelector(".pagina").classList.remove("escondido");  
}

function loading(){
    document.querySelector(".login").classList.toggle("escondido");
    document.querySelector(".logando").classList.toggle("escondido");
}

function enviarEnter(tecla){
    if(tecla.key === 'Enter'){
        tecla.preventDefault();
        enviar();
    }
}

// BONUS FINAL

function enviar(){
    const msg = document.querySelector("textarea");
    if(msg.value !== ""){ // "  " problem
     const dados = {
            from: nome,
	        to: toNome,  
	        text: msg.value,
	        type: tipoMsg  
        }
        const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', dados);
        promessa.then(msgValida);
        promessa.catch(msgError);
        msg.value = "";
    }
}

function msgValida(resposta){
    carregar();
}

function msgError(error){
    window.location.reload();
}

function logar(){
    nome = document.querySelector(".pagLogin input").value;
    const dados = {name: nome};
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', dados);
    promessa.then(nomeValido);
    promessa.catch(tratarErro);
    loading();
}

function nomeValido(resposta){
    carregar();
    setInterval(manterLogado, 5000);
    trocaTelaLogin();
    setInterval(carregar, 3000);
    logados();
    setInterval(logados,10000);
}

function tratarErro(error){
    console.log(error.response.status);
    document.querySelector(".erroLogin").innerHTML = "Nome inválido ou já está em uso";
    loading();
}

function manterLogado(){
    const dados = {name: nome};
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', dados);
    promessa.then();
}

function crescer(elemento){
    if(elemento.scrollHeight < 65){
    elemento.style.height = elemento.scrollHeight + "px";
    }
    if(elemento.value.length < 30){
        elemento.style.height = "25px";
    } 
}

function carregar(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(tratarSucesso);
}

function tratarSucesso(resposta){
    const elemento = document.querySelector(".chat");
    elemento.innerHTML = "";
    let ultimoP;
 
    for(let i = 0;i<resposta.data.length;i++){
        if(resposta.data[i].type === "status"){
            elemento.innerHTML += `<p class="${resposta.data[i].type}"><span>(${resposta.data[i].time}) </span><strong>${resposta.data[i].from}</strong> ${resposta.data[i].text}</p>`;  
        }else if(resposta.data[i].type === "message"){
            elemento.innerHTML += `<p class="${resposta.data[i].type}"><span>(${resposta.data[i].time}) </span><strong>${resposta.data[i].from}</strong> para <strong>${resposta.data[i].to}: </strong> ${resposta.data[i].text}</p>`;
        }else if(resposta.data[i].type === "private_message" && (nome === resposta.data[i].to || nome === resposta.data[i].from) ){
            elemento.innerHTML += `<p class="${resposta.data[i].type}"><span>(${resposta.data[i].time}) </span><strong>${resposta.data[i].from}</strong> reservadamente para <strong>${resposta.data[i].to}: </strong> ${resposta.data[i].text}</p>`;
        }
    }
    ultimoP = document.querySelector('p:last-child');
    ultimoP.scrollIntoView();
}
