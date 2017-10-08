import Player from './player'
import {BasicEnemy} from './enemy'
import { up, down, left, right, idle, tile  } from './constants'

let thingsToLoad = ["assets/images/example_map.png"];

//Create a new Hexi instance, and start it.
let g = hexi(512, 512, setup, thingsToLoad, load);

//Scale the canvas to the maximum browser dimensions
g.scaleToWindow();

//Declare variables used in more than one function
let world, player, enemy = [];
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
            player = new Player(g, world, world.layers[1], world.layers[0],column,row,sprite);
            break;
          case tile.BASICENEMY:
            sprite = g.isoRectangle(world.cartTilewidth, world.cartTileheight, 0xAFAFAF);
            enemy.push(new BasicEnemy(g, world, world.layers[1], world.layers[0], column, row, sprite));
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
    g.move(player.sprite);
    g.move(player.facingObj.sprite);

    enemy.forEach(e => {

        if (player.actionPerformed == true){
            e.run();
        }

        g.move(e.sprite);
        g.move(e.facingObj.sprite);
    });

    player.actionPerformed = false;
}

