import Stats from './stats'
import Player from './player'
import { right, tile } from './constants'

class Facing {
    constructor(g, width, height, direction = right){
        this.direction = direction
        this.sprite = g.isoRectangle(16, 16, 0x000000);
        g.addIsoProperties(this.sprite, 0, 0, width/2, height/2);
        this.sprite.vx = 0;
        this.sprite.vy = 0;
        this.sprite.x = (this.column + this.direction[0]) * width;
        this.sprite.y = (this.row + this.direction[1]) * height;
    }
}

export default class Character {
  constructor(g, world, charlayer, floorlayer, column, row, sprite){
    // world variables
    this.cartTilewidth = world.cartTilewidth
    this.cartTileheight = world.cartTileheight
    this.widthInTiles = world.widthInTiles

    //column and row are the coords of the cell in the layer
    this.column = column;
    this.row = row;
    this.sprite = sprite;
    this.floorlayer = floorlayer;
    this.charlayer = charlayer;
    //For some reason the velocities, decided to not be zero by default
    this.sprite.vx = 0;
    this.sprite.vy = 0;

    this.facingObj = new Facing(g, world.cartTilewidth, world.cartTileheight);
    world.addChild(this.facingObj.sprite);


    this.dead = false;
    this.attackStyle = function(other) {
      console.log(this.constructor.name + ": attacked: " + other.constructor.name);
      return false;
    };
    
    this.stats = new Stats(1,1,1);
    this.basestats = new Stats(1,1,1);
  }
  
  whoIsInFront(){
    let index = this.getIndex(this.column + this.facingObj.direction[0], this.row + this.facingObj.direction[1]);
    return this.charlayer[index];
  }
  
  whatIsInFront() {
    let index = this.getIndex(this.column + this.facingObj.direction[0], this.row + this.facingObj.direction[1]);
    return this.floorlayer[index];
  }
  
  attack(other){
    // This function uses the attacker's attackStyle
    // function and applies all of the aggressive bonuses
    // beyond the normal stats
    if (this.attackStyle != undefined){
      console.log(this.constructor.name + ": prepare to attack: " + other.constructor.name);
      return this.attackStyle(other);
    }
    console.log(this.constructor.name+ ": attack style: " + this.attackStyle);
    return false;
  }
  
  defend(other){
    //This function applies all of the defensive bonuses 
    // and reductions beyond the normal stats
    console.log(this.constructor.name + ": defending from: " + other.constructor.name);
  }
  
  isDead(){
    if (this.stats.health <= 0){
      this.stats.health = 0;
      this.dead = true;
    }
    
    return this.dead;
  }
  
  //Flattens 2D index into 1D
  getIndex(column, row) {
    let result = column + row * this.widthInTiles;
    return result;
  }

  _move(direction) {
      let retval = false;
      this.facingObj.direction = direction;
      let floorpiece = null;
      if ((this.row * this.widthInTiles) + this.column + direction[0] <= ((this.row + 1) * this.widthInTiles) - 1 &&
              (this.row * this.widthInTiles) + this.column + direction[0] >= this.row * (this.widthInTiles)) {
          floorpiece = this.floorlayer[this.getIndex(this.column + direction[0], this.row + direction[1])];
          //Checks the character layer, not allowed to walk through other NPC's
          if (this.charlayer[this.getIndex(this.column + direction[0], this.row + direction[1])] != tile.EMPTY){
              floorpiece = tile.WALL;
          }
      }

      if (floorpiece == tile.WALKABLE){
          this.charlayer[this.getIndex(this.column, this.row)] = 0;

          this.column = this.column + direction[0];
          this.row = this.row + direction[1];

          this.charlayer[this.getIndex(this.column, this.row)] = this;
          this.sprite.cartX += this.cartTilewidth * direction[0];
          this.sprite.cartY += this.cartTileheight * direction[1];
          this.sprite.y = this.sprite.isoY;
          this.sprite.x = this.sprite.isoX;


          retval = true;
      } 

      this.facingObj.sprite.cartX = this.sprite.cartX + (this.cartTilewidth/2 * (this.facingObj.direction[0] + 1));
      this.facingObj.sprite.cartY = this.sprite.cartY + (this.cartTileheight/2 * this.facingObj.direction[1]);
      this.facingObj.sprite.y = this.facingObj.sprite.isoY;
      this.facingObj.sprite.x = this.facingObj.sprite.isoX;
      if (this instanceof Player){
        console.log("cartX:" + this.sprite.cartX);
        console.log("worldWidth:" + this.cartTilewidth);
        console.log("facing[0]:" + this.facingObj.direction[0]);
        console.log("cartX:" + this.sprite.cartX);
        console.log("sprite:", this.sprite.x, this.sprite.y);
        console.log("facing:", this.facingObj.sprite.x, this.facingObj.sprite.y);
      }
      return retval;
  }
}

