// Connexió
let connexio;
let dibujarInt = 0;
let estrellasInt = 0;

function init() {
    // Local o remot
    let domini;
    if (window.location.protocol == "file:") domini = "localhost";
    else domini = window.location.hostname;

    // Creació de la connexió
    let url = "ws://" + domini + ":8180";
    connexio = new WebSocket(url);

    // Quan s'obre la connexió, enviar missatge al servidor
    connexio.onopen = () => {
        //connexio.send("Hola a tothom!");
        connexio.send(JSON.stringify({action: "generarNave"}));
    }

    // Quan arriba un missatge, mostrar-lo per consola
    connexio.onmessage = e => {
            try {
            let l = JSON.parse(e.data);
            if(l.TuId != null) 
                {
                    idJugador = l.TuId;

                    alert(idJugador);
                }
            else if((l[0].img == 'star.svg')) estrellas = l;
            else 
            {
                players = l;
                console.log(players);
                players.sort(function (a, b) {
                    return b.score - a.score;
                  });
            }
        } catch (error) {
            if(typeof(e.data) == typeof(""))
                {
                    //let d = document.querySelector('chat');
                    //d.innerHTML += "<p>" + e.data + "</p>";
                    //d.scroll(0,d.scrollHeight);
                } 
        }

    }
    
    // Quan es produeix un error, mostrar-lo per consola
    connexio.onerror = error => {
        alert("Error en la connexió: " + error);
    }
    dibujarInt = setInterval(function(){dibujarNaves(players)},1000/60);
    estrellasInt = setInterval(function(){dibujarEstrellas(estrellas)},1000/60);
}
// Recivir datos
function actualizarPartida(event)
{
    let js = JSON.stringify({action: "actualizar", server: 0 ,id: idJugador});
    enviar(event,js);
}
setInterval(actualizarPartida,1000/60);
// Mover
let keyCodeMovementL = false;
let keyCodeMovementR = 0;
let keyCodeMovementU = 0;
let keyCodeMovementD = 0;
let velXN = 0,velXP = 0, velYN = 0, velYP = 0, velocidad = 4;
$(window).on("keydown",naveTeclado);    
$(window).on("keyup",naveTeclado);    
setInterval(mover,20);
function mover(event)
{
    let js = JSON.stringify({action: "mover", id: idJugador,up: keyCodeMovementU,dw: keyCodeMovementD,le: keyCodeMovementL,ri: keyCodeMovementR})
    enviar(event,js);
}

/*$(window).on("mousedown",dispararRaton);    
$(window).on("contextmenu",menu);    
$(window).on("mouseup",dispararRaton);*/    

    function naveTeclado(event)
    {
        event.defaultPrevented;
            {
                if(event.type == "keydown")
                    {
                        if((event.key == "ArrowLeft" || event.code == "KeyA") && keyCodeMovementL == false)
                            {
                                keyCodeMovementL = true;
                                velXN = velocidad;
                            }
                        if((event.key == "ArrowRight" || event.code == "KeyD") && keyCodeMovementR == false)
                            {
                                keyCodeMovementR = true;
                                velXP = velocidad;
                            }
                        if((event.key == "ArrowUp" || event.code == "KeyW") && keyCodeMovementU == false)
                            {
                                keyCodeMovementU = true;
                                velYN = velocidad;
                            }
                        if((event.key == "ArrowDown" || event.code == "KeyS") && keyCodeMovementD == false)
                            {
                                keyCodeMovementD = true;
                                velYP = velocidad;
                            }
                        
                        
                    }else if(event.type == "keyup")
                        {
                            if((event.key == "ArrowLeft" || event.code == "KeyA") && keyCodeMovementL == true)
                                {
                                    keyCodeMovementL = false;
                                    velXN = 0;
                                }
                            if((event.key == "ArrowRight" || event.code == "KeyD") && keyCodeMovementR == true)
                                {
                                    keyCodeMovementR = false;
                                    velXP = 0;
                                }
                            if((event.key == "ArrowUp" || event.code == "KeyW") && keyCodeMovementU == true)
                                {
                                    keyCodeMovementU = false;
                                    velYN = 0;
                                }
                            if((event.key == "ArrowDown" || event.code == "KeyS") && keyCodeMovementD == true)
                                {
                                    keyCodeMovementD = false;
                                    velYP = 0;
                                }
                            
                        }
            }
    }

//Jugadores
//let players = [{id:"player1",img:"rocketBlue.svg",x:0,y:0},{id:"player2",img:"rocketGreen.svg",x:0,y:0}];
let players = [];
let tamanoNaves = [];
tamanoNaves["Rockets"] = {w:30,h:50};
tamanoNaves["Planes"] = {w:50,h:50};
let idJugador = "player1"
function dibujarNaves(naves)
{
    let partida = $(".jugadores");
    naves.forEach(element => {
        let id = "#"+element.id;
        let div = $(id);
        if($(div).length == 0)
            {
                div = $('<div class="DivPlayer" id="'+element.id+'" style="top:'+element.x+'px; left:'+element.y+'px; transform: rotate('+element.rot+'deg);">'+
                    '<iframe src="./media/'+element.img+'" width="'+element.w+'" height="'+element.h+'" class="player" title="SVG"></iframe></div>');
                $(partida).append(div);
            }
            console.log(element.rot);
        $(div).css({top: element.y+"px", left: element.x+"px",transform: 'rotate('+element.rot+'deg)'})  
    });
    let navesDibujadas = $(partida).find(".DivPlayer");
    for(let i = 0; i < $(navesDibujadas).length; i++)
        {
            let id = ($(navesDibujadas[i]).prop("id"));
            let index = players.findIndex(obj => obj.id == id) ?? null; 
            if(index == -1)
                {
                    navesDibujadas[i].remove();
                }
        }
    actualizarPuntos();
}
function actualizarPuntos()
{
    let tablero = $(".StHt");
    let html = "";
    let jugadoresP = [];
    jugadoresP.push({nom: players[0].nom ?? "",punts: players[0].score ?? 0});
    if(typeof players[1] !== 'undefined') jugadoresP.push({nom: (players[1].nom),punts: (players[1].score)}); else jugadoresP.push({nom: (""),punts: (0)});
    if(typeof players[2] !== 'undefined') jugadoresP.push({nom: (players[2].nom),punts: (players[2].score)}); else jugadoresP.push({nom: (""),punts: (0)});
    for(let i = 0; i < players.length && i < 2; i++)
        {
            html += jugadoresP[i].nom + ": " + jugadoresP[i].punts + "\n";
        }

   $(tablero).html(html);
}
//Estrellas
let estrellas = [];
function dibujarEstrellas(estrellas) {
    let partida = $(".estrellas");

    estrellas.forEach(element => {
        let id = "#"+element.id;
        let div = $(id);
        if($(div).length == 0) {
            div = $('<div class="DivEstrella" id="'+element.id+'" style="top:'+element.x+'px; left:'+element.y+'px;">'+
                '<iframe src="./media/Components/'+element.img+'" width="20" height="20" class="estrella" title="SVG"></iframe></div>');
            $(partida).append(div);
        }
        $(div).css({top: element.y+"px", left: element.x+"px"});
    });

    let estrellasDibujadas = $(partida).find(".DivEstrella");
    for(let i = 0; i < $(estrellasDibujadas).length; i++) {
        let id = ($(estrellasDibujadas[i]).prop("id"));
        let index = estrellas.findIndex(obj => obj.id == id);
        if(index == -1) {
            $(estrellasDibujadas[i]).remove();
        }
    }
}
// Enviar missatge

function enviar(ev,message) {
    let missatge = message;
    connexio.send(missatge);
    //alert(missatge.value.replace(/\r\n|\r|\n/g,"<br>"));
    missatge.value = "";
    //missatge.focus();
    if (ev) ev.preventDefault();
}

function enter(ev) {
    let key = window.event.keyCode;

    if (key === 13 && !ev.shiftKey) {
        enviar();
        ev.preventDefault();
        return false;
    }
    else {
        return true;
    }
}
