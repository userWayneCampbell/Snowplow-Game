/**TODO - In order of importance
    *Make edges of canvases touch (bug, probably easily fixable)
    *Possibly change plow image
    *Animate crash/explosion sprites for mailboxes when hit? (tricky, but possible OPTIONAL)
    *Multiple choice for extra lives at game over screen? (unlikely OPTIONAL )
    *High scores? (unlikely OPTIONAL )
    *Add different messages for different amounts of points at game over (doable, but not sure
 OPTIONAL)
    * Increase difficulty somehow?
    

    *Lock mySprite to bottom *Easy* DONE
    *Add Screen perimeters *Easy* DONE
    *Add code for Falling items DONE
    *Score counter *Easy* DONE
    *Implement Hotkeys DONE
    *If mailbox goes off screen, spawn a new one at top of screen instead of stopping DONE
    *Implement lives DONE
    *Implement gameover screen/Stop mailboxes falling if lives = 0 DONE
    *Fix lives only updating on screen once score is at least 1 DONE
    *Fix mailboxes spawning partially off play area (reduce x a little bit?) DONE
    *Add Background image DONE
    *Change game over screen colour TEMPORARILY DONE
    *Replay on Game Over screen DONE
    *Animate the sprite DONE
    *Add snowplow images DONE
    *Make snowplow recognizably a plow with good proportions/Potentially rotate plow if you're turning? DONE
    *Fix plow hitbox. DONE
    *Snow on index DONE
    *Add Loading screen/Splash screen with our names and mentioning Explorers DONE
    *Implement incrementally faster mailbox speeds DONE
    *Add music DONE
    *Make speed of plow go up equally to speed of mailboxes, so you can still always barely get them. DONE
    *Get images for dodge objects? MOSTLY DONE 
    *Add a life every 20 points DONE
    *Add sound (easy) DONE
    *Finalize splash screen text (easy) DONE


**Changelog - By KyroZed
    *Locked mySprite to x-axis movements only (Deleted y-axis commands)
    *Changed all "canvas.width" and "canvas.height" to variables "Canvas_Width" and "Canvas_Height" for added readability and ease of modification
    *Defined canvas edges and locked objects inside of them (muahaha!)
    *Added three external javascript files (in javascripts folder): jquery.hotkeys.js and key_status.js (for simpler keybind definitions) and util.js (for clamp function)
    *Changed TODO and Changelog comments to one large comment block as opposed to many single line comments
    *Implemented falling objects code
    *Implemented score counter on separate canvas (thanks Wayne!)
    *Implemented hotkeys (left, right, etc.)
    *Implemented misses (mailbox goes off screen, spawn a new one, remove a life)
    *Changed mySprite speed to make crossing play area in the time that a mailbox falls possible.
    *Figured out how to put in image, but can't use it usefully..
    *Implemented game over screen
    *Implemented lives counter, but it doesn't update on screen unless score is at least 1
    *Fixed lives not updating on screen properly until score >= 1
    *Put in placeholder rectangles for snowplow so it's recognizable as snowplow
    *Fixed bug with mailboxes going through edges of orange snowplow piece
	*Hi Daniel
*/

//Define all Global variables
var scorechange;
var liveschange;

var playCanvas_Width = 800;
var playCanvas_Height = 600;

var scoreCanvas_Width = 100;
var scoreCanvas_Height = 600;

var playCanvas = document.getElementById('playCanvas');
var ctx = playCanvas.getContext('2d'); 

var scoreCanvas = document.getElementById('scoreCanvas');
var scoreCtx = scoreCanvas.getContext('2d');

var plowUp = document.getElementById("plowUp");
var plowRight = document.getElementById("plowLeft");
var plowLeft = document.getElementById("plowRight");
var mailboxImg = document.getElementById("mailbox");
var catImg = document.getElementById("cat");
var treeImg = document.getElementById("tree");
var explodeImg = document.getElementById("explode");

var score = 0;
var lives = 5;

//Define widths and heights of canvases
playCanvas.width = playCanvas_Width;
playCanvas.height = playCanvas_Height;

scoreCanvas.width = scoreCanvas_Width;
scoreCanvas.height = scoreCanvas_Height;
scoreCanvas.x = 750

//Define objects
var mySprite = {
    x: 300,
    y: 525,
    width: 75,
    height: 75,
    speed: 240,
    color: '#000'
};

var mailbox = {
    x: (Math.random() * playCanvas_Width) - 32,
    y: 0,
    width: 32,
    height: 32,
    speed: 180
};

var cat = {
    x: (Math.random() * playCanvas_Width) - 32,
    y: 0,
    width: 32,
    height: 32,
    speed: 220
};

var tree = {
    x: (Math.random() * playCanvas_Width) - 32,
    y: 0,
    width: 32,
    height: 32,
    speed: 190
};
//Update all variables (lives, score, etc.) and check for collisions
function update(mod) {
    if (lives > 0){   
        if (keydown.left) {
            mySprite.x -= mySprite.speed * mod;
        };

        if (keydown.right) {
            mySprite.x += mySprite.speed * mod;
        };

    //Limit range of different objects
    var rand = Math.random()
    mySprite.x = mySprite.x.clamp(0, playCanvas_Width - (mySprite.width));
    mailbox.x = mailbox.x.clamp(0, playCanvas_Width - (mailbox.width));
    cat.x = cat.x.clamp(0, playCanvas_Width - (cat.width));
    tree.x = tree.x.clamp(0, playCanvas_Width - (tree.width));
    mailbox.y += mailbox.speed * mod;
    cat.y += cat.speed * mod;
    
    if((Math.random() * 1000) < 500){
        cat.x += Math.random();
    }    else{
        cat.x -= Math.random();
    };
    
    tree.y += tree.speed * mod;
    
    //Mailbox collision rules
        if (
            mySprite.x < mailbox.x + mailbox.width &&
            mySprite.x + mySprite.width > mailbox.x &&
            mySprite.y < mailbox.y + mailbox.height &&
            mySprite.y + mySprite.height > mailbox.y
            ) 
        //then      
            {
                mailCollide();
            }
            
        else if(

            mySprite.x < mailbox.x + mailbox.width &&
            mySprite.x + mySprite.width > mailbox.x &&
            mySprite.y < mailbox.y + mailbox.height &&
            mySprite.y + mySprite.height > mailbox.y
            )
                {
                    mailCollide();
                };
           //Cat collision rules
           if (
            mySprite.x < cat.x + cat.width &&
            mySprite.x + mySprite.width > cat.x &&
            mySprite.y < cat.y + cat.height &&
            mySprite.y + mySprite.height > cat.y
            ) 
        //then      
            {
                catCollide();
            }
            
        else if(

            mySprite.x < cat.x + cat.width &&
            mySprite.x + mySprite.width > cat.x &&
            mySprite.y < cat.y + cat.height &&
            mySprite.y + mySprite.height > cat.y
            )
                {
                    catCollide();
                };

        //Tree collision rules... I am Groot!
        if (
            mySprite.x < tree.x + tree.width &&
            mySprite.x + mySprite.width > tree.x &&
            mySprite.y < tree.y + tree.height &&
            mySprite.y + mySprite.height > tree.y
            ) 
        //then      
            {
                treeCollide();
            }
            
        else if(

            mySprite.x < tree.x + tree.width &&
            mySprite.x + mySprite.width > tree.x &&
            mySprite.y < tree.y + tree.height &&
            mySprite.y + mySprite.height > tree.y
            )
                {
                    treeCollide();
                };

    //Mailbox miss rules
    if (
        mailbox.y > playCanvas_Height
        )
            {
                missed();

            };
    };
    //Cat miss rules
    if (
        cat.y > playCanvas_Height
    )
            {
               catMissed();

            };

    //Tree miss rules
    if (
        tree.y > playCanvas_Height
    )
            {
               treeMissed();

            };

    ctx.clearRect(0, 0, playCanvas_Width, playCanvas_Height);

};


function render() {
    if (lives <= 0)
    {
                //gameover
               
                ctx.fillStyle = "#000000";
                    ctx.font = "20px Garamond";
                    ctx.fillRect(0, 0, playCanvas_Width, playCanvas_Height);
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillText("Game over!  Final score: "+score+"!", 250, 300);    

                    scoreCtx.fillStyle="fff";
                    scoreCtx.fillRect(0,0, scoreCanvas_Width,scoreCanvas_Height);


                setTimeout(function(){window.location = "index.html"}, 5000);
                
    }
    else
    {
        scoreCtx.font = "14px Garamond";
        scoreCtx.fillText("Lives: 5", 10, 570);
        
        scoreCtx.font = "14px Garamond";
        scoreCtx.fillText("Score: 0", 10, 590);
        
        if (scorechange == true)
            {
                print_score();
            };

        if (liveschange == true)
            {
                print_lives();
            };
              
        if (keydown.right){
        
            //snowplow to right
            //Draw snowplow
            ctx.drawImage(plowLeft, mySprite.x, mySprite.y, mySprite.width, mySprite.height);
            //Draw mailbox
            ctx.drawImage(mailboxImg, mailbox.x, mailbox.y, mailbox.width, mailbox.height);
            //Draw cat
            ctx.drawImage(catImg, cat.x, cat.y, cat.width, cat.height);
            //Draw tree
            ctx.drawImage(treeImg, tree.x, tree.y, tree.width, tree.height);

        } else if (keydown.left){

            //snowplow to left
            ctx.drawImage(plowRight, mySprite.x, mySprite.y, mySprite.width, mySprite.height);               
            //Draw mailbox
            ctx.drawImage(mailboxImg, mailbox.x, mailbox.y, mailbox.width, mailbox.height);
            //Draw cat
            ctx.drawImage(catImg, cat.x, cat.y, cat.width, cat.height);
            //Draw tree
            ctx.drawImage(treeImg, tree.x, tree.y, tree.width, tree.height);

        } else{
            //Draw snowplow
            ctx.drawImage(plowUp, mySprite.x, mySprite.y, mySprite.width, mySprite.height);
            //Draw mailbox
            ctx.drawImage(mailboxImg, mailbox.x, mailbox.y, mailbox.width, mailbox.height);
            //Draw cat
            ctx.drawImage(catImg, cat.x, cat.y, cat.width, cat.height);
            //Draw tree
            ctx.drawImage(treeImg, tree.x, tree.y, tree.width, tree.height);

        };    
    };     
   
};
 
function run() {
    update((Date.now() - time) / 1000);
    render();
    time = Date.now();
};
 
function mailCollide() {
    //On collision with mailbox
    //Respawn mailbox
    mailbox.x = (Math.random() * playCanvas_Width)-32;
    mailbox.y = 0;
    //Increase score and speed of game
    score++;
    mailbox.speed++;
    mySprite.speed++;
    //Every twenty points, give an extra life
    if (score%20 == 0){
        lives = varlives + 1;
    };        
    scorechange=true;
    //Play mailbox crash sound
    document.getElementById('Crash').play();
};

function catCollide() {
    //On collision with cat
    //Respawn cat
    cat.x = Math.random() * playCanvas_Width;
    cat.y = 0;
    //Decrease lives by one
    lives--;
    scorechange=true;
    //Play cat screech sound
    document.getElementById('Cat').play();
};

function treeCollide() {
    //On collision with tree
    //Respawn tree
    tree.x = Math.random() * playCanvas_Width;
    tree.y = 0;
    //Decrease lives by one
    lives--;
    scorechange=true;
    //Play tree thunk sound
    document.getElementById('Tree').play();
};

function missed() {
    //On missing a mailbox
    //Respawn mailbox
    mailbox.x = (Math.random() * playCanvas_Width)-32;
    mailbox.y = 0;
    //Decrease lives by one
    lives --;
    liveschange=true;
};

function catMissed() {
    //On missing a cat
    //Respawn cat
    cat.x = (Math.random() * playCanvas_Width)-32;
    cat.y = 0;
};

function treeMissed() {
    //On missing a tree
    //Respawn tree
    tree.x = (Math.random() * playCanvas_Width)-32;
    tree.y = 0;
};

function print_score() {
    //Write score on Score canvas
    scoreCtx.clearRect(0, 0, scoreCanvas_Width, scoreCanvas_Height);
    scoreCtx.font = "14px Garamond";
    scoreCtx.fillText("Score: "+score, 10, 590);
    scoreCtx.fillText("Lives: "+lives, 10, 570);
};

function print_lives() {
    //Write lives on Score canvas
    scoreCtx.clearRect(0, 0, scoreCanvas_Width, scoreCanvas_Height);
    scoreCtx.font = "14px Garamond";
    scoreCtx.fillText("Score: "+score, 10, 590);
    scoreCtx.fillText("Lives: "+lives, 10, 570);
};

var time = Date.now();
setInterval(run, 10);



