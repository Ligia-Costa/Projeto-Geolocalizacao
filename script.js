// Captura a referência aos elementos de resultado
const resultado = document.getElementById('resultado')
const resultado2 = document.querySelector('#resultado2')

// Criar as variáveis de latitude e longitude
let latitude = 0;
let longitude = 0;

// Função que pega a Localização
function pegarLocalizacao(){
    //Verifica se o navegador suporta o recurso de geolocalização
    if(navigator.geolocation){
        //Se suportar, tenta obter a posição atual do usuário
        //O método getCurrenPosition recebe duas funções:
        //- A primeira (mostrarPosicao) é chamada se a localização for obtida com sucesso
        //- A segunda (mostraErro) é chamada se a localização dar erro
        //- A terceira (opcional) permite personalizações.

        navigator.geolocation.getCurrentPosition(mostrarPosicao, mostrarErro,{
            enableHighAccuracy: true, //Pede mais precisão
            timeout: 10000, //Espera até 10 segundos para obter a localização
            maximumAge: 0 //Garante que a posição não seja uma antiga, salva no cache
        })

    }else{
        resultado.innerHTML = 'Geolocalização não é suportada por este navegador'
    }      
}

// Função chamada se houver erro para obter a geolocalização
function mostrarErro(error){
    switch(error.code){
        case error.PERMISSION_DENIED:
            resultado.innerText = '⛔ O usuário negou o acesso a localização.';
            break;
        case error.POSITION_UNVAILABLE:
            resultado.innerText = '❌ A localização não está disponível.';
            break;
        case error.TIMEOUT:
            resultado.innerText = '⏳ A solicitação expirou.';
            break;
        default:
            resultado.innerText = '⚠ Erro desconhecido.';
    }
}

// Função chamada para mostrar posição
function mostrarPosicao(posicao){
    console.log(posicao);
    latitude = posicao.coords.latitude
    console.log(latitude);
    longitude = posicao.coords.longitude
    console.log(longitude);
    resultado.innerHTML = `
    Latitude: ${latitude} <br>
    Longitude: ${longitude} <br>
    <a href="https://www.google.com.br/maps/@${latitude},${longitude},20z?entry=ttu" target='_blank'><h4> Ver no Google Maps</h4></a>
    `

    atualizaMapa(latitude,longitude)
}

// Função ao clicar no botão "📌 Buscar Endereço" para buscar o endereço usando a API do OpenStreetMap
async function buscarEndereco() {

    //verifica se as coordenadas foram obtidas
    if (latitude === null || longitude === null) {
        resultado2.innerHTML = "⚠ Primeiro obtenha as coordenadas!";
        return;
    }

    //faz a requisição à API
    try {
        //monta a URL com as coordenadas obtidas
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=pt-br`;

        //chama a API e espera pela resposta
        const resposta = await fetch(url);

        //transforma a resposta em JSON
        const dados = await resposta.json();
        console.log(dados)

        //extrai as informações de endereço para a variável endereco
        const endereco = dados.address;
        console.log(endereco);

        // Exibe o endereço formatado
        resultado2.innerHTML = `
    <h3>📍 Detalhes do endereço:</h3>
    País: ${endereco.country || "N/A"}<br>
    Estado: ${endereco.state || "N/A"}<br>
    Cidade: ${endereco.city || endereco.town || endereco.village || "N/A"}<br>
    Bairro: ${endereco.suburb || "N/A"}<br>
    Rua: ${endereco.road || "N/A"}<br>
    CEP: ${endereco.postcode || "N/A"}<br>
    <a href="https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}" target="_blank">
        <h4>🌍 Ver no OpenStreetMap</h4>
    </a>
    `;

    } catch (erro) {
        resultado2.innerHTML = "❌ Erro ao buscar o endereço!";
        console.error("Erro ao buscar dados:", erro);
    };
}

let mapa = L.map('mapa').setView([-23.9828992, -48.8669184], 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mapa);

function atualizaMapa (latitude, longitude){

    mapa.setView([latitude, longitude], 19);
    L.marker([latitude, longitude])
        .addTo(mapa)
        .bindPopup("📍 Você está aqui!")
        .openPopup();
}