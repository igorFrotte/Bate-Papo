let nome = "";

logar();
setInterval(carregar, 3000);

document.querySelector("textarea").addEventListener("keypress", enviarEnter);

function enviarEnter(tecla){
    console.log(tecla);
    if(tecla.key === 'Enter'){
        enviar();
    }
}

function enviar(){
    const msg = document.querySelector("textarea");
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

function msgValida(resposta){
    carregar();
}

function msgError(error){
    window.location.reload();
}

function logar(){
    nome = window.prompt("Qual seu nome?");
    const dados = {name: nome};
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', dados);
    promessa.then(nomeValido);
    promessa.catch(tratarErro);
}

function nomeValido(resposta){
    carregar();
    setInterval(manterLogado, 5000);
}

function tratarErro(error){
    logar();
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
