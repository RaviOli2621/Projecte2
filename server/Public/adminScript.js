let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let amplada = document.getElementById('amplada');
let alcada = document.getElementById('alcada');
let socket = new WebSocket('ws://localhost:8180');

socket.onopen = () => {
    connexio.send(JSON.stringify({action: "generarAdmin"}));
};

socket.onmessage = function(event) {
    console.log('Message from server ', event.data);
};

socket.onclose = function(event) {
    
     console.error('Connection died');
    
};

socket.onerror = function(error) {
    console.error(`WebSocket error: ${error.message}`);
};

startBtn.addEventListener('click', () => {
    let alcada = document.getElementById("alcada").value;
    let amplada = document.getElementById("amplada").value;
    alert("Partida comenzada");
    socket.send(JSON.stringify({ action: 'start' ,amp:amplada,alc:alcada}));
});

//amplada.addEventListener('change', () => {
//    socket.send(JSON.stringify({ action: 'config', amp: amplada.value, alc: alcada.value }));
//});
//
//alcada.addEventListener('change', () => {
//    socket.send(JSON.stringify({ action: 'config', alc: alcada.value, amp: amplada.value }));
//});

stopBtn.addEventListener('click', () => {
    alert("Partida parada");
    socket.send(JSON.stringify({ action: 'stop' }));
});