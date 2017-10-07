/*
An example of how to create a basic isometric game world using Hexi's
`isoRectangle` and `addIsoProperties` methods.
*/
let thingsToLoad = ["assets/images/example_map.png"];

//Create a new Hexi instance, and start it.
let g = hexi(512, 512, setup, thingsToLoad, load);

//Scale the canvas to the maximum browser dimensions
g.scaleToWindow();

let tile = {
  EMPTY: 0,
  WALKABLE: 1,
  WALL: 2,
  PLAYER: 3,
  BASICENEMY: 4
};
//Declare variables used in more than one function
let world, player, enemy = [];
let up    = [ 0, -1];
let down  = [ 0,  1];
let left  = [-1,  0];
let right = [ 1,  0];
let idle  = [ 0,  0];
var leftArrow, rightArrow, upArrow, downArrow;

//Start Hexi
g.start();

function load(){

  //Display the file currently being loaded
  console.log(`loading: ${g.loadingFile}`); 

  //Display the percentage of files currently loaded
  console.log(`progress: ${g.loadingProgress}`);

  //Add an optional loading bar 
  g.loadingBar();
}

function setup() {

  //Create the `world` container that defines our isometric
  //tile-based world
  world = g.group();

  //Set the Cartesian `tileWidth` and `tileHeight` of each tile, in pixels
  world.cartTilewidth = 32;
  world.cartTileheight = 32;

  //Define the width and height of the world, in tiles
  world.widthInTiles = 8;
  world.heightInTiles = 8;

  //Create the world layers
  world.layers = [

    //The environment layer. `2` represents the walls,
    //`1` represents the floors
    [
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      2, 2, 2, 1, 1, 2, 2, 2,
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1
    ],

    //The character layer. `3` represents the game character
    //`0` represents an empty cell which won't contain any
    //sprites
    [
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 4, 0,
      0, 4, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 3, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 4, 0,
      0, 0, 4, 0, 0, 0, 0, 0
    ]
  ];

  //Build the game world by looping through each of the arrays
  world.layers.forEach(layer => {

    //Loop through each array element
    layer.forEach((gid, index) => {

      //If the cell isn't empty (0) then create a sprite
      if (gid !== tile.EMPTY) {

        //Find the column and row that the sprite is on and also
        //its x and y pixel values.
        let column, row, x, y;
        column = index % world.widthInTiles;
        row = Math.floor(index / world.widthInTiles);
        x = column * world.cartTilewidth;
        y = row * world.cartTileheight;

        //Next, create a different sprite based on what its
        //`gid` number is
        let sprite;
        switch (gid) {

          //The floor
          case tile.WALKABLE:

            //Create a sprite using an isometric rectangle
            sprite = g.isoRectangle(0/*world.cartTilewidth*/, 0/*world.cartTileheight*/, 0xCCCCFF);
            //Cartesian rectangle:
            //sprite = g.rectangle(world.cartTilewidth, world.cartTileheight, 0xCCCCFF);
            break;

            //The walls
          case tile.WALL:
            sprite = g.isoRectangle(world.cartTilewidth, world.cartTileheight, 0x99CC00);
            //Cartesian rectangle:
            //sprite = g.rectangle(world.cartTilewidth, world.cartTileheight, 0x99CC00);
            break;

            //The character
          case tile.PLAYER:
            sprite = g.isoRectangle(world.cartTilewidth, world.cartTileheight, 0xFF0000);
            //Cartesian rectangle:
            //sprite = g.rectangle(world.cartTilewidth, world.cartTileheight, 0xFF0000);

            //Define this sprite as the `player`
            player = new Player(world.layers[1], world.layers[0],column,row,sprite);
            break;
          case tile.BASICENEMY:
            sprite = g.isoRectangle(world.cartTilewidth, world.cartTileheight, 0xAFAFAF);
            enemy.push(new BasicEnemy(world.layers[1], world.layers[0], column, row, sprite));
        }


        //Add these properties to the sprite
        g.addIsoProperties(sprite, x, y, world.cartTilewidth, world.cartTileheight);

        //Set the sprite's `x` and `y` pixel position based on its
        //isometric coordinates
        sprite.x = sprite.isoX;
        sprite.y = sprite.isoY;

        //Cartesian positioning
        //sprite.x = sprite.cartX;
        //sprite.y = sprite.cartY;

        //Add the sprite to the `world` container
        world.addChild(sprite);
      }
    });
  });

  //Position the world inside the canvas
  let canvasOffset = (g.canvas.width / 2) - world.cartTilewidth;
  world.x += canvasOffset;
  
  	
	leftArrow = g.keyboard(37);
	rightArrow = g.keyboard(39);
	upArrow = g.keyboard(38);
	downArrow = g.keyboard(40);
	
	leftArrow.press = function(){
		player.move_(left);
	}
	
	rightArrow.press = function(){
		player.move_(right);
	}
	
	upArrow.press = function(){
		player.move_(up);
	}
	
	downArrow.press = function(){
		player.move_(down);
	}
	
  
  
  g.state = play;
}


function play() {

	g.move(player.sprite);
  g.move(player.facingSprite);
  
  enemy.forEach(e => {
    
    if (player.actionPerformed == true){
      e.run();
    }
    
    g.move(e.sprite);
    g.move(e.facingSprite);
  });
  
  player.actionPerformed = false;
}

class Stats {
  constructor(health, attack, defense) {
    this.health = health;
    this.attack = attack;
    this.defense = defense;
  }
  
  calculateDamage(stats){
    if (arguments.length === 0){
        return this.attack;
    } else if (typeof stats === "object"){
      return Math.min(this.attack - stats.defense, stats.health);
    }
    
  }
  
  
}


class Character {
  constructor(charlayer, floorlayer, column, row, sprite){
    //column and row are the coords of the cell in the layer
		this.column = column;
		this.row = row;
		this.sprite = sprite;
		this.floorlayer = floorlayer;
		this.charlayer = charlayer;
		//For some reason the velocities, decided to not be zero by default
		this.sprite.vx = 0;
		this.sprite.vy = 0;
    
    this.facing = right;
    
    this.facingSprite = g.isoRectangle(16, 16, 0x000000);
    g.addIsoProperties(this.facingSprite, 0, 0, world.cartTilewidth/2, world.cartTileheight/2);
    this.facingSprite.vx = 0;
    this.facingSprite.vy = 0;
    
    this.facingSprite.x = (this.column + this.facing[0]) * world.cartTilewidth;
    this.facingSprite.y = (this.row + this.facing[1]) * world.cartTileheight;
    world.addChild(this.facingSprite);
    
    
    
    this.dead = false;
    this.attackStyle = function(other) {
      console.log(this.constructor.name + ": attacked: " + other.constructor.name);
      return false;
    };
    
    this.stats = new Stats(1,1,1);
    this.basestats = new Stats(1,1,1);
  }
  
  whoIsInFront(){
    let index = this.getIndex(this.column + this.facing[0], this.row + this.facing[1]);
    return this.charlayer[index];
  }
  
  whatIsInFront() {
    let index = this.getIndex(this.column + this.facing[0], this.row + this.facing[1]);
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
    let result = column + row * world.widthInTiles;
    return result;
  }
  
  move(direction) {
    let retval = false;
    this.facing = direction;
    let floorpiece = null;
    if ((this.row * world.widthInTiles) + this.column + direction[0] <= ((this.row + 1) * world.widthInTiles) - 1 &&
        (this.row * world.widthInTiles) + this.column + direction[0] >= this.row * (world.widthInTiles)) {
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
			this.sprite.cartX += world.cartTilewidth * direction[0];
			this.sprite.cartY += world.cartTileheight * direction[1];
			this.sprite.y = this.sprite.isoY;
			this.sprite.x = this.sprite.isoX;
      
      
      retval = true;
		} 
    
    this.facingSprite.cartX = this.sprite.cartX + (world.cartTilewidth/2 * (this.facing[0] + 1));
    this.facingSprite.cartY = this.sprite.cartY + (world.cartTileheight/2 * this.facing[1]);
    this.facingSprite.y = this.facingSprite.isoY;
    this.facingSprite.x = this.facingSprite.isoX;
    if (this instanceof Player){
      console.log("cartX:" + this.sprite.cartX);
      console.log("worldWidth:" + world.cartTilewidth);
      console.log("facing[0]:" + this.facing[0]);
      console.log("cartX:" + this.sprite.cartX);
      console.log("sprite:", this.sprite.x, this.sprite.y);
      console.log("facing:", this.facingSprite.x, this.facingSprite.y);
    }
    return retval;
  }
}

class Player extends Character {

	constructor(charlayer, floorlayer, column, row, sprite){
		//column and row are the coords of the cell in the layer
		super(charlayer, floorlayer, column, row, sprite);
    this.attackStyle = function(other) {
      console.log("did my attack style");
      return false;
      
    };
    
    this.actionPerformed = false;
    
    this.basestats = new Stats(12,2,1);
    this.stats = new Stats(12,2,1);
	}
  
  move_(direction){
    
    let changedDirection = (this.facing[0] != direction[0]) || (this.facing[1] != direction[1]);
    // move function modifies the facing to equal direction so have to store the value before comparing
    this.actionPerformed = this.move(direction) || changedDirection;
    
  }
}

class BasicEnemy extends Character {
  constructor(charlayer, floorlayer, column, row, sprite){
    //column and row are the coords of the cell in the layer
		super(charlayer, floorlayer, column, row, sprite);
        
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
      this.move(direction);
    }
  }
  
}
