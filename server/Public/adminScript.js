let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let socket = new WebSocket('ws://localhost:8180');

socket.onopen = () => {
    connexio.send(JSON.stringify({action: "generarAdmin"}));
};

socket.onmessage = function(event) {
    console.log('Message from server ', event.data);
};

socket.onclose = function(event) {
    if (event.wasClean) {
        console.log(`Closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        console.error('Connection died');
    }
};

socket.onerror = function(error) {
    console.error(`WebSocket error: ${error.message}`);
};

startBtn.addEventListener('click', () => {
    let alcada = document.getElementById("alcada").value;
    let amplada = document.getElementById("amplada").value;
    alert(alcada);
    socket.send(JSON.stringify({ action: 'start' ,amp:amplada,alc:alcada}));
});

stopBtn.addEventListener('click', () => {
    socket.send(JSON.stringify({ action: 'stop' }));
});