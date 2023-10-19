class RickBreaker extends Phaser.Scene {

  constructor() {

    super();
    this.player;
    this.ball;
    this.blueBrick;
    this.greenBrick;
    this.redBrick;
    this.orangeBrick;
    this.cursors;
    this.gameStart = false;
    this.score = 0
    this.scoreText;
    this.rick;
    this.ricka;
    this.bricks;
    this.rickRolledl;

  };

  preload() {
    this.load.audio('rick', 'assets/rick-rolled.ogg');
    this.load.image('this.ball', 'assets/images/ball.png');
    this.load.image('brick1', 'assets/images/brick-blue.png');
    this.load.image('brick2', 'assets/images/brick-green.png');
    this.load.image('brick3', 'assets/images/brick-red.png');
    this.load.image('brick4', 'assets/images/brick-orange.png');
    this.load.image('paddle', 'assets/images/paddle.png');
    this.load.spritesheet('ricka', 'assets/images/rick.png', { frameWidth: 160, frameHeight: 160 });

  }

  create() {



    //const graphics = this.add.graphics();
    this.ricka = this.physics.add.sprite(400, 300, 'ricka').setScale(4);

    //Rick roll 'em
    this.rickRolled = this.sound.add('rick');
    this.rickRolled.play();

    //setting up scoreboard
    this.scoreText = this.add.text(5, 5, 'score: 0', { fontSize: '14px', fill: '#fff' });

    //creating this.player via paddle
    this.player = this.physics.add.sprite(
      400, //x position
      600, //y position
      'paddle'
    ).setScale(.125),
      this.player.setImmovable(true);
    this.player.body.collideWorldBounds = true;


    //create this.ball
    this.ball = this.physics.add.sprite(
      400,
      565,
      'this.ball'
    ).setScale(.01);
    this.ball.setOrigin(0.5, 0.5);
    this.ball.setCircle(1200, -100);
    this.ball.refreshBody();


    this.ball.body.collideWorldBounds = true;
    this.ball.body.setBounce(1);

    //add bricks
    this.blueBricks = this.physics.add.group({
      key: 'brick1',
      repeat: 8,
      immovable: true,
      setXY: {
        x: 120,
        y: 45,
        stepX: 70
      },
      setScale: {
        x: .3,
        y: .3
      }
    });
    this.greenBricks = this.physics.add.group({
      key: 'brick2',
      repeat: 7,
      immovable: true,
      setXY: {
        x: 150,
        y: 80,
        stepX: 70
      },
      setScale: {
        x: .3,
        y: .3
      }
    });
    this.redBricks = this.physics.add.group({
      key: 'brick3',
      repeat: 10,
      immovable: true,
      setXY: {
        x: 50,
        y: 115,
        stepX: 70
      },
      setScale: {
        x: .3,
        y: .2
      }
    });
    this.orangeBricks = this.physics.add.group({
      key: 'brick4',
      repeat: 8,
      immovable: true,
      setXY: {
        x: 120,
        y: 150,
        stepX: 70
      },
      setScale: {
        x: .3,
        y: .3
      }
    });


    this.anims.create({
      key: 'roll',
      frames: this.anims.generateFrameNumbers('ricka', { start: 0, end: 53 }),
      frameRate: 30,
      repeat: -1,

    });
    //add keyboard movement - up, down, left, right, shift, space
    this.cursors = this.input.keyboard.createCursorKeys()

    //COLLISIONS

    //create collisions between brick and this.ball
    this.physics.add.collider(this.ball, this.greenBricks, this.brickCollision, null, this);
    this.physics.add.collider(this.ball, this.blueBricks, this.brickCollision, null, this);
    this.physics.add.collider(this.ball, this.orangeBricks, this.brickCollision, null, this);
    this.physics.add.collider(this.ball, this.redBricks, this.brickCollision, null, this);

    //create collision between paddle and this.ball
    this.physics.add.collider(this.ball, this.player, this.playerCollision, null, this);

    //GAME STATUS START/WIN/LOSE
    this.startGameText = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      'Press Spacebar to Start',
      {
        fontFamily: 'Courier',
        fontSize: '32px',
        fill: '#fff'
      }
    );

    this.startGameText.setOrigin(0.5);
    this.startGameText.setVisible(true);

    this.lostText = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      'Try Again?',
      {
        fontFamily: 'Courier',
        fontSize: '50px',
        fill: '#fff'
      }
    );

    this.lostText.setOrigin(0.5);
    this.lostText.setVisible(false);

    this.winText = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      'You win!',
      {
        fontFamily: 'Courier',
        fontSize: '50px',
        fill: '#fff'
      }
    );

    this.winText.setOrigin(0.5);
    this.winText.setVisible(false);



  }

  update() {



    //GameStart on space
    if (!this.gameStart) {
      this.ricka.setVisible(false);

      this.ball.setX(this.player.x);
      this.ball.setVelocityY(0);//prevents this.ball from floating up
      this.ball.setVelocityX(0); //prevents this.ball from floating left or right

      if (this.cursors.space.isDown) {

        this.gameStart = true;
        this.ricka.setVisible(true);
        this.ricka.anims.play('roll', true);
        this.startGameText.setVisible(false);
        this.ball.setVelocityY(-250);



      }
    }

    if (this.gameOver(this.physics.world)) {
      this.lostText.setVisible(true);
      this.ball.disableBody(true, true);
      if (this.cursors.shift.isDown) {
        this.gameStart = false;
        this.scene.restart();
        this.score = 0;
      }

    } else if (this.win()) {
      this.winText.setVisible(true);
      this.ball.disableBody(true, true);
    } else {
      //while the game is live
      this.player.body.setVelocityX(0); //keeps this.player still if not pressing keyboard
      if (!this.rickRolled.isPlaying) {
        this.rickRolled.play();
      }

      //controls the paddle left and right at px/s
      if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-650); //num is px per second to the left
      } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(650); //num is px per second to the right
      }
    }

  }

  // object collision functions
  brickCollision(ball, brick) {
    brick.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText('score:' + this.score);

    if (ball.body.velocity.x === 0) {
      this.num = Math.random();
      if (this.num >= 0.5) {
        ball.body.setVelocityX(150);
      } else {
        ball.body.setVelocityY(-150);
      }
    }
  }


  playerCollision(ball, player) {
    ball.setVelocityY(ball.body.velocity.y - 30);

    let newVelX = Math.abs(ball.body.velocity.x) + 7;

    if (ball.x < player.x) {
      ball.setVelocityX(-newVelX);
    } else {
      ball.setVelocityX(newVelX);
    }


  }

  //Game Status functions
  gameOver(world) {
    return this.ball.body.y >= world.bounds.height - 40;
  }

  win() {
    return this.blueBricks.countActive() + this.greenBricks.countActive() + this.redBricks.countActive() + this.orangeBricks.countActive() === 0;
  }

}





const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 200,
  height: 150,
  transparent: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: RickBreaker,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: false,
      debug: true
    }
  }
}

const game = new Phaser.Game(config);






