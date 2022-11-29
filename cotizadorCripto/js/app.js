const criptomonedasSelect =document.querySelector('#criptomonedas');
const monedaSelect =document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBus = {
    moneda: '',
    criptomoneda: ''
}

const resultadoCrip = criptomonedas => new Promise( resolve =>{
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCripto();
    formulario.addEventListener('submit', subForm);
    criptomonedasSelect.addEventListener('change', readVal);
    monedaSelect.addEventListener('change', readVal);
})

function consultarCripto(){
    const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => resultadoCrip(resultado.Data))
        .then(criptomonedas => selectCripto(criptomonedas))

    
}

function selectCripto(criptomonedas){
    criptomonedas.forEach( cri => {
        const { FullName, Name } = cri.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    })

}

function readVal(e){
    objBus[e.target.name] = e.target.value;
    
    

}

function subForm(e){
    e.preventDefault();

    const { moneda, criptomoneda } = objBus;
    if( moneda === '' || criptomoneda === ''){
        shwAlert('Ambos campos son obligatorios');
        return;
    }

    schApi();

}

function shwAlert(msg){
    const rmvErr = document.querySelector('.error');
    if(!rmvErr){
        const dvMensaje = document.createElement('div');
        dvMensaje.classList.add('error')
        dvMensaje.textContent = msg;
    
        formulario.appendChild(dvMensaje);
        setTimeout(() => {
            dvMensaje.remove();
            
        }, 2200);

    }
   

}

function schApi(){
    const { moneda, criptomoneda } = objBus;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    shwSpinner();

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( cotizacion => {
            shwCotiHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        })

}
function shwCotiHTML(cotizacion){
    
    
    clnHTML();

    
    const  { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;


    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span> ${PRICE} </span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio más alto del día: <span>${HIGHDAY}</span> </p>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio más bajo del día: <span>${LOWDAY}</span> </p>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Última actualización: <span>${LASTUPDATE}</span></p>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);

    formulario.appendChild(resultado);

}

function clnHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function shwSpinner(){
    clnHTML();
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
    `;

    resultado.appendChild(spinner);
}