import {Partida} from "./salas.js"
/******************************************************************************
*					SERVIDOR WEB SOCKETS (port 8180)
******************************************************************************/

// Afegir el mòdul 'ws'
import WebSocket, {WebSocketServer} from 'ws';

// Crear servidor WebSockets i escoltar en el port 8180
const wsServer = new WebSocketServer({ port:8180 })
console.log("Servidor WebSocket escoltant en http://localhost:8180");
//Crear salas de manera provisional
let sales = [];
sales.push(new Partida(0,[],[{id:("estrella"+Date.now()),img:"star.svg",x:getRandomInt(-1000),y:getRandomInt(-1000)}]));
let tamanoNaves = [];
tamanoNaves["Rockets"] = {w:30,h:50};
tamanoNaves["Planes"] = {w:50,h:50};
let maxX = 1160;
let maxY = 600;
let minX = 0;
let minY = 0;
let spawnRate = 5000;
let maxEstrelles = 5+1;
let estrellaInterval;
// Enviar missatge a tothom excepte a 'clientExclos'
//	(si no s'especifica qui és el 'clientExclos', s'envia a tots els clients)
function broadcast(missatge, clientExclos) {
	wsServer.clients.forEach(function each(client) {
		if (client.readyState === WebSocket.OPEN && client !== clientExclos) {
			client.send(missatge);
		}
	});
}

function asignarCampoDeJuwgo(mensaje)
{
	maxX = mensaje.amp;
	maxY = mensaje.alc;
}

function encenderServer(mensaje)
{
	//maxPunts = mensaje.mxPun;
	sales[0].estrelles = [{id:("estrella"+Date.now()),img:"star.svg",x:getRandomInt(-1000),y:getRandomInt(-1000)}];
	
	maxX = mensaje.amp;
	maxY = mensaje.alc;

	clearInterval(estrellaInterval);
	estrellaInterval = setInterval(generarEstrellas,spawnRate);

	sales[0].status = 1;
}

function actualizarInfo(mensaje,client)
{
	client.send((JSON.stringify(sales[mensaje.server].players)));
	client.send((JSON.stringify(sales[mensaje.server].estrelles)));
}
function changePlayersPos(mensaje)
{
	let velX = 0,velY = 0,vel = 4;
	mensaje.up == true?  velY -= vel: velY;
	mensaje.dw == true?  velY += vel: velY;
	mensaje.le == true?  velX -= vel: velX;
	mensaje.ri == true?  velX += vel: velX;
	let id = mensaje.id;
	let pArr = sales[0].players;
	let playerIndex =  pArr.findIndex(obj => obj.id == id);
	sales[0].players[playerIndex].x += parseInt(velX);
	sales[0].players[playerIndex].y += parseInt(velY);
	let rot = rotacion((velX),(velY));
	rot == 777? rot = sales[0].players[playerIndex].rot: rot;
	sales[0].players[playerIndex].rot = parseInt(rot);
	//Limits to the position
	sales[0].players[playerIndex].x > maxX? sales[0].players[playerIndex].x = maxX-1: sales[0].players[playerIndex].x < minX? 
		sales[0].players[playerIndex].x = minX+1: sales[0].players[playerIndex].x;
	sales[0].players[playerIndex].y > maxY? sales[0].players[playerIndex].y = maxY-1: sales[0].players[playerIndex].y < minY? 
		sales[0].players[playerIndex].y = minY+1: sales[0].players[playerIndex].y;
	
	recogerEstrella(playerIndex);

	//Enviar les dades
	/*wsServer.clients.forEach(function each(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send((JSON.stringify(sales[0].players)));
		}
	});*/
}
function rotacion(velX,velY)
{
    let rotX,rotY;
    velX > 0? rotX = 90: velX < 0? rotX = 270: rotX = 777; 
    velY > 0? rotY = 180: velY < 0? rotY = 0: rotY = 777; 
    rotX == 777? rotX = rotY: rotX;
    rotY == 777? rotY = rotX: rotY;
    //Para corregir un error
    if(rotX == 270 && rotY == 0) rotY = 360;
    let rot = (rotX + rotY)/2;
    return rot;
}
//Codi estrelles
let intervalId;
function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}
function generarEstrellas()
{
	if(sales[0].estrelles.length < maxEstrelles)
		{
			sales[0].estrelles.push({id:("estrella"+Date.now()),img:"star.svg",x:getRandomInt(maxX),y:getRandomInt(maxY)});
		}
	/*	wsServer.clients.forEach(function each(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send((JSON.stringify(sales[0].estrelles)));
		}
	});*/
}
function recogerEstrella(index)
{
	for(let i = 0; i < sales[0].estrelles.length; i++)
	{
		let element = sales[0].estrelles[i];
		let xTrue = false;
		let yTrue = false;
		//Calcular posiciones
		element.x <= (sales[0].players[index].x + sales[0].players[index].w)? (sales[0].players[index].x <= (element.x + 20)? xTrue = true: xTrue = false): xTrue = false;
		element.y <= (sales[0].players[index].y + sales[0].players[index].h)? (sales[0].players[index].y <= (element.y + 20)? yTrue = true: yTrue = false): yTrue = false;
		//Eliminar estrella al contacto
		(xTrue == true && yTrue == true)? sales[0].estrelles.splice(i,1): xTrue;
		// Debugar el recoger estrella
		(xTrue == true && yTrue == true)? sales[0].players[index].score++: xTrue;
	}
	//let estrella =
	//console.log(estrella.offsetTop + estrella.offsetHeight)
}
function generarAdmin(client,peticio)
{
	if(sales[0].admin == 0)
		{
			let id = "admin"+peticio.socket.remotePort;
			sales[0].admin = id;
			client.send((JSON.stringify({TuId:id})));
		}else
		{
			client.send((JSON.stringify({vesA:"http://localhost/Practiques/Projecte/P2De%20Verda/Projecte2/vista/viewLogin.php"})));
		}
}

function generarPlayer(client,peticio)
{
	if(sales[0].players.length < 800)
		{
			let img = "Rockets/rocketColorfull.svg";
			if(sales[0].players.length > 0) img = "Planes/planeColorfull.svg";
			sales[0].players.push({id:("player"+peticio.socket.remotePort),nom:"Mondongo",img:img,x:maxX/2,y:maxY/2,rot:0,score: 0,
				w:tamanoNaves[img.split("/")[0]].w,h:tamanoNaves[img.split("/")[0]].h});
			client.send((JSON.stringify({TuId:"player"+peticio.socket.remotePort})));
		}else
		{
			client.send((JSON.stringify({vesA:"http://localhost/Practiques/Projecte/P2De%20Verda/Projecte2/vista/viewLogin.php"})));
		}

}
// Al rebre un nou client (nova connexió)
wsServer.on('connection', (client, peticio) => {


	
	// Guardar identificador (IP i Port) del nou client
	let id = peticio.socket.remoteAddress + ":" + peticio.socket.remotePort;

	// Enviar salutació al nou client
	//	i avisar a tots els altres que s'ha afegit un nou client
	client.send(`Benvingut <strong>${id}</strong>`);
	broadcast(`Nou client afegit: ${id}`, client);
	
	// Al rebre un missatge d'aques client
	//	reenviar-lo a tothom (inclòs ell mateix)
	client.on('message', missatge => {
		try {
			let js = JSON.parse(`${missatge}`);
			if(js.action == "mover") changePlayersPos(js);	
			else if(js.action == "actualizar") actualizarInfo(js, client);
			else if(js.action == "generarNave") generarPlayer(client,peticio);
			else if(js.action == "generarAdmin") generarAdmin(client,peticio);
			else if(js.action == "start") encenderServer(js);
			else if(js.action == "config") asignarCampoDeJuwgo(js);
			else console.log(js);
		} catch (error) {
			console.log(error);
			broadcast(`<strong>${id}: </strong>${missatge}`);
		}
		//broadcast(`<strong>${id}: </strong>${missatge}`);
		//console.log(`Missatge de ${id} --> ${missatge}`);
	});
	client.on("close",(reason) =>
	{
		console.log("Desconexion de player"+peticio.socket.remotePort );
		let index = sales[0].players.findIndex(obj => obj.id == ("player"+peticio.socket.remotePort));
		if(index != -1)sales[0].players.splice(index,1);
		else if(sales[0].admin == "admin"+peticio.socket.remotePort)sales[0].admin = 0;
	});
});

//let players = [{id:"player1",img:"rocketBlue.svg",x:0,y:0},{id:"player2",img:"rocketGreen.svg",x:0,y:0}];
//let players = [];

/******************************************************************************
*						SERVIDOR WEB (port 8080)
******************************************************************************/

import { createServer } from 'http';
import { parse } from 'url';
import { existsSync, readFile } from 'fs';
import { timeStamp } from "console";
//import { Sala } from './salas.js';

function header(resposta, codi, cType) {
	resposta.setHeader('Access-Control-Allow-Origin', '*');
	resposta.setHeader('Access-Control-Allow-Methods', 'GET');
	if (cType) resposta.writeHead(codi, {'Content-Type': cType});
	else resposta.writeHead(codi);
}

function enviarArxiu(resposta, dades, filename, cType, err) {
	if (err) {
		header(resposta, 400, 'text/html');
		resposta.end("<p style='text-align:center;font-size:1.2rem;font-weight:bold;color:red'>Error al l legir l'arxiu</p>");
		return;
	}

	header(resposta, 200, cType);
	resposta.write(dades);
	resposta.end();
}

function onRequest(peticio, resposta) {
	let cosPeticio = "";

	peticio.on('error', function(err) {
		console.error(err);
	}).on('data', function(dades) {
		cosPeticio += dades;
	}).on('end', function() {
		resposta.on('error', function(err) {
			console.error(err);
		});

		if (peticio.method == 'GET') {
			let q = parse(peticio.url, true);
			let filename = "." + q.pathname;

			if (filename == "./Joc") filename += "/index.html";
			if (existsSync(filename)) {
				readFile(filename, function(err, dades) {
					enviarArxiu(resposta, dades, filename, undefined, err);
					});
			}
			else {
				header(resposta, 404, 'text/html');
				resposta.end("<p style='text-align:center;font-size:1.2rem;font-weight:bold;color:red'>404 Not Found</p>");
			}
		}
	});
}

let server = createServer();
server.on('request', onRequest);

server.listen(8080);	
console.log("Servidor escoltant en http://localhost:8080");
