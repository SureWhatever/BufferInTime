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

  let testarray = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]];
  console.log(testarray[0][1]);
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
            sprite = g.isoRectangle(world.cartTilewidth, world.cartTileheight, 0xCCCCFF);
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
            console.log("This is column: " + column + " row: " + row);
            console.log(world.layers[1]);
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
		player.move(left);
	}
	
	rightArrow.press = function(){
		player.move(right);
	}
	
	upArrow.press = function(){
		player.move(up);
	}
	
	downArrow.press = function(){
		player.move(down);
	}
	
  
  
  g.state = play;
}


function play() {

	
	//console.log("This is the play function yay!");
	//console.log(world.layers);
	g.move(player.sprite);
  
  enemy.forEach(e => {
    
    if (player.actionPerformed == true){
      e.run();
    }
    
    g.move(e.sprite);
  });
  
  player.actionPerformed = false;
}


class Player {

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
    this.actionPerformed = false;
	}
  
  //Flattens 2D index into 1D
  getIndex(column, row) {
    let result = column + row * world.widthInTiles;
    return result;
  }
	
  move(direction) {
    let floorpiece = null;
    if ((this.row * world.widthInTiles) + this.column + direction[0] <= ((this.row + 1) * world.widthInTiles) - 1 &&
        (this.row * world.widthInTiles) + this.column + direction[0] >= this.row * (world.widthInTiles)) {
      floorpiece = this.floorlayer[this.getIndex(this.column + direction[0], this.row + direction[1])];
    }
		if (floorpiece == tile.WALKABLE){
			this.charlayer[this.getIndex(this.column, this.row)] = 0;
      
			this.column = this.column + direction[0];
      this.row = this.row + direction[1];
      
			this.charlayer[this.getIndex(this.column, this.row)] = 3;
			this.sprite.cartX += world.cartTilewidth * direction[0];
			this.sprite.cartY += world.cartTileheight * direction[1];
			this.sprite.y = this.sprite.isoY;
			this.sprite.x = this.sprite.isoX;
      
      this.actionPerformed = true;
		}
    
    
  }
}

class BasicEnemy{
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
    
    this.gid = 4;
    this.action = [];
    this.action.push(up, down, left, right, idle);
  }
  
  getIndex(column, row) {
    let result = column + row * world.widthInTiles;
    return result;
  }
  
  run(){
    //Tries to move randomly
    let direction = this.action[Math.floor(Math.random() * this.action.length)];
    this.move(direction);
    
  }
  move(direction){
    let floorpiece = null;
    
    //The top and bottom of the grid are blocked off for movement because
    //the spaces are out of bounds for the array, which is undefined
    //since the world is a 1D array, we have to check if the character isnt
    //going to be "out of bounds" to the left and right of the world
    if ((this.row * world.widthInTiles) + this.column + direction[0] <= ((this.row + 1) * world.widthInTiles) - 1 &&
        (this.row * world.widthInTiles) + this.column + direction[0] >= this.row * (world.widthInTiles)) {
      floorpiece = this.floorlayer[this.getIndex(this.column + direction[0], this.row + direction[1])];
    }
    
    if (floorpiece == tile.WALKABLE){
      this.charlayer[this.getIndex(this.column, this.row)] = 0;
      
      this.column = this.column + direction[0];
      this.row = this.row + direction[1];
      this.charlayer[this.getIndex(this.column, this.row)] = this.gid;
      
      this.sprite.cartX += world.cartTilewidth * direction[0];
      this.sprite.cartY += world.cartTileheight * direction[1];
      this.sprite.y = this.sprite.isoY;
      this.sprite.x = this.sprite.isoX;
    }
  }
  
}
