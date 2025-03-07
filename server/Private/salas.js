
export class Partida
{
    id = "";
    players = [];
    estrelles = [];
    admin = "";
    status = 0;
    turbos = [];

    constructor(id,players,estrelles)
    {
        this.id = id;
        this.players = players;
        this.estrelles = estrelles;
    }

    //Seters i geters
    get players()
    {
        return this.players;
    }
    get id()
    {
        return this.id;
    }
    set players(p)
    {
        this.players = p;
        return this.players;
    }
    set id(p)
    {
        this.id = p;
        return this.id;
    }
    lessPlayersTeam () {
        let verdes = 0;
        let rojos = 0;
        this.players.forEach(element => {
            
            if(element.team == "green") verdes++;
            else rojos ++;
        });
        if(verdes < rojos) return 0;
        else return 1;
    }
}
