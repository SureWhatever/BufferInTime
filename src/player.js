import Character from './character' 
import Stats from './stats'

export default class Player extends Character {

    constructor(g, world, charlayer, floorlayer, column, row, sprite){
        //column and row are the coords of the cell in the layer
        super(g, world, charlayer, floorlayer, column, row, sprite);
        this.attackStyle = function(other) {
            console.log("did my attack style");
            return false;
        };
        this.actionPerformed = false;
        this.basestats = new Stats(12,2,1);
        this.stats = new Stats(12,2,1);
    }

    move(direction){
        let changedDirection = (this.facingObj.direction[0] != direction[0]) || (this.facingObj.direction[1] != direction[1]);
        // move function modifies the facing to equal direction so have to store the value before comparing
        this.actionPerformed = this._move(direction) || changedDirection;
    }
}
