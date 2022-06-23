const nome = "oi";
/* window.prompt("Qual o seu nome?"); */

carregar();
setInterval(carregar, 3000);




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
    promessa.catch(tratarErro);
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

function tratarErro(error){
    console.log(error);
    /* tratar erros */
}

