import Character from './character' 
import Player from './player' 
import { up, down, left, right, idle  } from './constants'

export class BasicEnemy extends Character {
    constructor(g, world, charlayer, floorlayer, column, row, sprite){
        //column and row are the coords of the cell in the layer
        super(g, world, charlayer, floorlayer, column, row, sprite);
        console.log('initialized enemy');

        this.gid = 4;
        this.action = [];
        this.action.push(up, down, left, right, idle);
    }

    run(){
        //Stupid AI which only attacks player if they are in front of them
        let inFront = this.whoIsInFront();
        if (inFront instanceof Player){
            console.log("Enemy should do the attack function!");
            this.attack(inFront);
        } else {
            //Tries to move randomly
            let direction = this.action[Math.floor(Math.random() * this.action.length)];
            this._move(direction);
        }
    }

}

