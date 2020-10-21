let config={
    type: Phaser.AUTO,
    scale:{
        mode: Phaser.Scale.FIT,
        width: 850,
        height:500,
        
    },
    
        physics:{
            default:'arcade',
            arcade:{
                gravity:{
                  y:1000,
                  
                },
                debug:false,//true,
        },
        
    },
    backgroundColor: 0xffffaa,
    scene:{
    preload: preload,
    create: create,
    update:update,
    
    },
};

let game= new Phaser.Game(config);

let player_config={
    player_velocity: 100,
    player_jumpspeed: -600,
}



function preload(){
    this.load.image("ground","platform.png");
    //this.load.image("player","my character.png");
    this.load.image("sky","background.png");
    this.load.spritesheet("player","my character.png",{frameWidth:40,frameHeight:45});
    this.load.image("coin","objects.png");
    this.load.image("ray","ray.png");
}
function create(){
    W= game.config.width;
    H= game.config.height;
    //add tilesprites
    let ground= this.add.tileSprite(0,H-80,W,104,'ground');//not blurry
     //let ground= this.add.sprite(0,H-100,'ground');blury
    ground.setOrigin(0,0);
   // ground.displayWidth=W; blury
    //this.player= this.physics.add.sprite(W/2,H/2);
    //create a background
     //this.add.tileSprite(0,0,2*W,440,'sky');
  let background=      this.add.sprite(0,0,'sky');
    background.setOrigin(0,0);
    background.displayWidth = W;
    background.depth=-2;
    
    //create rays on the top of the background
   
    let rays=[];//empty array in js
    for(let i=-10;i<=10;i++)
    {let ray= this.add.sprite(W/2,H-70,'ray');
    ray.setOrigin(0.5,1);//....because y=1and x/=0.5...center is to be at bottom
  // ray.displayHeight=H*1.5;if my rays are not extending till the corner
     
    ray.depth=-1;
    ray.alpha=0.5;
     //ray.angle=30; and without loop one ray at 30 degree inclination from vertical will be drawn
    ray.angle= i*10;
    rays.push(ray);
    }
    //console.log(rays);
    //tween
    this.tweens.add({
        targets: rays,
        props:{
            angle: {
                value: "+=20",
            },
        },
        duration:6000,
        repeat:-1,
        
    });
    

   //create player
    this.player = this.physics.add.sprite(100,100,'player',5);
  console.log(this.player);
    this.player.setScale(0.9);
    //set the bounce
    this.player.setBounce(0.3);
    //player animations and movements
    this.player.setCollideWorldBounds(true);
    
    this.anims.create({
        key:'left',
        frames: this.anims.generateFrameNumbers('player',{start:0,end:2}),
        frameRate:7,
        repeat:-1,
    });
    this.anims.create({
        key:'center',
        frames: [{key:'player',frame:4}],
        frameRate:10,
    });
    this.anims.create({
        key:'right',
        frames: this.anims.generateFrameNumbers('player',{start:6,end:9}),
        frameRate:10,
        repeat:-1,
        
    })
    
    
    
    //keyboard
    this.cursors=this.input.keyboard.createCursorKeys();
   
    
    //add group of physical objects
    let coins=this.physics.add.group({
        key:"coin",
        repeat:17,
        setScale: {x:0.9,y:0.8},
        setXY:{x:5,y:0,stepX:50},
        
    });
    //add bounce to the coins
    coins.children.iterate(function(c)
    {
        c.setBounce(Phaser.Math.FloatBetween(0.4,0.7));                   
                           
    });
    //creating more platforms
    let platforms= this.physics.add.staticGroup();
    platforms.create(100,175,'ground').setScale(2,0.5).refreshBody();
   platforms.create(500,300,'ground').setScale(3,0.5).refreshBody();
    platforms.create(800,160,'ground').setScale(1,0.5).refreshBody();
    
    
    this.physics.add.existing(ground,true);//or ground.body.immoveable= true;
    ground.body.allowGravity = false;
    
     //add collision detection between ground and player
    this.physics.add.collider(ground,this.player);
    //add collider
    this.physics.add.collider(ground,coins);
    this.physics.add.collider(platforms,this.player);
    this.physics.add.collider(platforms,coins);
   // this.physics.add.collider(this.player,coins);//the coins will start moving when player collides with them //can say momentum got tranfered
    
    this.physics.add.overlap(this.player,coins,takeCoins,null,this);
   // null=processcallback //this=context
    //create cameras
    this.cameras.main.setBounds(0,0,W,H);
    this.physics.world.setBounds(0,0,W,H);
    this.cameras.main.startFollow(this.player,true,true);
   this.cameras.main.setZoom(1.5);
    
    //for paning effect because world size and camera focus is same
    //world size can be bigger than the game window 
}
function coins(c){
    
    
}
function update(){
  if(this.cursors.left.isDown)
      {
          this.player.setVelocityX(-player_config.player_velocity);
     this.player.anims.play('left',true);
      }
    else if(this.cursors.right.isDown)
        {
            this.player.setVelocityX(player_config.player_velocity);
            this.player.anims.play('right',true);
        }
   
    else
        
        {
            this.player.setVelocityX(0);
            this.player.anims.play('center');
        }
    //add jumping ability, stop the player once in air
      if(this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(player_config.player_jumpspeed);
        }
    
    
}
function takeCoins(player,coin) //if coins instead of coin
{
    coin.disableBody(true,true);//then coins instead of coin
    
}