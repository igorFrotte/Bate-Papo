let nome = "";

// BONUS INICIO

document.querySelector("textarea").addEventListener("keypress", enviarEnter);

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
	        to: "Todos",  
	        text: msg.value,
	        type: "message"  // private_message
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
    if(elemento.value.length < 39){
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
        }else if(resposta.data[i].type === "private_message" && nome === resposta.data[i].to ){
            elemento.innerHTML += `<p class="${resposta.data[i].type}"><span>(${resposta.data[i].time}) </span><strong>${resposta.data[i].from}</strong> reservadamente para <strong>${resposta.data[i].to}: </strong> ${resposta.data[i].text}</p>`;
        }
    }
    ultimoP = document.querySelector('p:last-child');
    ultimoP.scrollIntoView();
}
