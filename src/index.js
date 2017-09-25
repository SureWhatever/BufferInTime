/*
An example of how to create a basic isometric game world using Hexi's
`isoRectangle` and `addIsoProperties` methods.
*/
let thingsToLoad = ["assets/images/example_map.png"];

//Create a new Hexi instance, and start it.
let g = hexi(512, 512, setup, thingsToLoad, load);

//Scale the canvas to the maximum browser dimensions
g.scaleToWindow();

//Declare variables used in more than one function
let world, player;
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
      2, 2, 2, 2, 2, 2, 2, 2,
      2, 1, 1, 1, 1, 1, 1, 2,
      2, 1, 2, 1, 1, 2, 1, 2,
      2, 1, 1, 1, 1, 2, 2, 2,
      2, 1, 1, 1, 1, 1, 1, 2,
      2, 2, 2, 1, 2, 1, 1, 2,
      2, 1, 1, 1, 1, 1, 1, 2,
      2, 2, 2, 2, 2, 2, 2, 2
    ],

    //The character layer. `3` represents the game character
    //`0` represents an empty cell which won't contain any
    //sprites
    [
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 3, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0
    ]
  ];

  //Build the game world by looping through each of the arrays
  world.layers.forEach(layer => {

    //Loop through each array element
    layer.forEach((gid, index) => {

      //If the cell isn't empty (0) then create a sprite
      if (gid !== 0) {

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
          case 1:

            //Create a sprite using an isometric rectangle
            sprite = g.isoRectangle(world.cartTilewidth, world.cartTileheight, 0xCCCCFF);
            //Cartesian rectangle:
            //sprite = g.rectangle(world.cartTilewidth, world.cartTileheight, 0xCCCCFF);
            break;

            //The walls
          case 2:
            sprite = g.isoRectangle(world.cartTilewidth, world.cartTileheight, 0x99CC00);
            //Cartesian rectangle:
            //sprite = g.rectangle(world.cartTilewidth, world.cartTileheight, 0x99CC00);
            break;

            //The character
          case 3:
            sprite = g.isoRectangle(world.cartTilewidth, world.cartTileheight, 0xFF0000);
            //Cartesian rectangle:
            //sprite = g.rectangle(world.cartTilewidth, world.cartTileheight, 0xFF0000);

            //Define this sprite as the `player`
            player = new Player(world.layers[0,1], world.layers[0,0],column,row,sprite);
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
		player.moveLeft();
	}
	
	rightArrow.press = function(){
		player.moveRight();
	}
	
	upArrow.press = function(){
		player.moveUp();
	}
	
	downArrow.press = function(){
		player.moveDown();
	}
	
  
  
  g.state = play;
}


function play() {

	
	//console.log("This is the play function yay!");
	//console.log(world.layers);
	g.move(player.sprite);
}


class Player {

	constructor(charlayer, floorlayer, x, y, sprite){
		//x and y are supposed to be the coords of the cell in the layer
		this.x = x;
		this.y = y;
		this.sprite = sprite;
		this.floorlayer = floorlayer;
		this.charlayer = charlayer;
		this.sprite.vx = 0;
		this.sprite.vy = 0;
	}
	
	moveUp() {
		if (this.floorlayer[this.y-1, this.x] != 1){
			this.charlayer[this.y-1, this.x] = 3;
			this.charlayer[this.y, this.x] = 0;
			this.y = this.y+1;
			//this.sprite.cartX += world.cartTilewidth;
			this.sprite.cartY -= world.cartTileheight;
			this.sprite.y = this.sprite.isoY;
			this.sprite.x = this.sprite.isoX;
		}
	}
	
	moveLeft() {
		if (this.floorlayer[this.y, this.x-1] != 1){
			this.charlayer[this.y, this.x-1] = 3;
			this.charlayer[this.y, this.x] = 0;
			this.x = this.x-1;
			this.sprite.cartX -= world.cartTilewidth;
			//this.sprite.cartY = world.cartTileheight;
			this.sprite.y = this.sprite.isoY;
			this.sprite.x = this.sprite.isoX;
		}
			
	}
	
	moveRight() {
		if (this.floorlayer[this.y, this.x+1] != 1){
			this.charlayer[this.y, this.x+1] = 3;
			this.charlayer[this.y, this.x] = 0;
			this.x = this.x+1;
			this.sprite.cartX += world.cartTilewidth;
			//this.sprite.cartY = world.cartTileheight;
			this.sprite.y = this.sprite.isoY;
			this.sprite.x = this.sprite.isoX;
		}		
	}
	
	moveDown() {
		if (this.floorlayer[this.y+1, this.x] != 1){
			this.charlayer[this.y+1, this.x] = 3;
			this.charlayer[this.y, this.x] = 0;
			this.y = this.y+1;
			//this.sprite.cartX += world.cartTilewidth;
			this.sprite.cartY += world.cartTileheight;
			this.sprite.y = this.sprite.isoY;
			this.sprite.x = this.sprite.isoX;
		}
	}
}


