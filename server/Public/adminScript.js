let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let socket = new WebSocket('ws://localhost:8180');

socket.onopen = () => {
    console.log("Admin conectado")
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
    socket.send(JSON.stringify({ action: 'start' }));
});

stopBtn.addEventListener('click', () => {
    socket.send(JSON.stringify({ action: 'stop' }));
});