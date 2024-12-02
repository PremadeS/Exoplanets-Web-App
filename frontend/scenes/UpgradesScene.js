import Phaser from "phaser";

class UpgradesScene extends Phaser.Scene {
  constructor() {
    super({key : 'UpgradesScene'});
  }

  init(data) {
    this.username = data.username;
    this.spaceship_level = data.spaceship_level;
    this.score = data.score;
    this.level = data.level;
  }

  preload() {
    this.load.image('background', 'assets/bg/bgtile.png');
    this.load.image('ship', 'assets/ship/spaceship.png');
  }

  create() {
    this.cameras.main.fadeIn(250, 0, 0, 0);
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background');
    this.background.setOrigin(0, 0);

    this.add.text(this.scale.width / 2 - this.scale.width / 4, 200, 'Upgrades', {fontSize : '70px', color : '#00ff00', fontStyle : 'bold'}).setOrigin(0.5);
    this.shipLevelTxt = this.add.text(this.scale.width / 2 - this.scale.width / 4, 400, `Spaceship Level: ${this.spaceship_level}`, {fontSize : '25px', color : '#ffffff', fontStyle : 'bold'}).setOrigin(0.5);
    this.scoreTxt = this.add.text(this.scale.width / 2 - this.scale.width / 4, 450, `Score: ${this.score}`, {fontSize : '25px', color : '#ffffff', fontStyle : 'bold'}).setOrigin(0.5);

    this.shipImage = this.add.image(this.scale.width / 2 + this.scale.width / 4, this.scale.height / 2, `ship`);
    this.shipImage.rotation += Phaser.Math.DegToRad(-90);

    const upgradeButton = this.add.text(this.scale.width / 2 - this.scale.width / 4, this.scale.height - this.scale.height / 3.5, 'Upgrade', {
                                    fontSize : '28px',
                                    color : '#00ff00',
                                    backgroundColor : '#000',
                                    padding : {x : 10, y : 5}
                                  })
                              .setOrigin(0.5)
                              .setInteractive();

    upgradeButton.on('pointerdown', () => {
      this.handleUpgrade(this.username);
    });
    upgradeButton.on('pointerover', () => {
      upgradeButton.setStyle({fill : '#ff0000', backgroundColor : '#111'});
    });
    upgradeButton.on('pointerout', () => {
      upgradeButton.setStyle({fill : '#00ff00', backgroundColor : '#000'});
    });

    const backButton = this.add.text(this.scale.width / 2 - this.scale.width / 4, this.scale.height - this.scale.height / 8, 'Back', {
                                 fontSize : '28px',
                                 color : '#00ff00',
                                 backgroundColor : '#000',
                                 padding : {x : 10, y : 5}
                               })
                           .setOrigin(0.5)
                           .setInteractive();

    backButton.on('pointerdown', () => {
      this.cameras.main.fadeOut(250, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MainScene', {
          name : this.username,
          level : this.level,
          score : this.score,
          spaceship_level : this.spaceship_level
        });
      });
    });
    backButton.on('pointerover', () => {
      backButton.setStyle({fill : '#ff0000', backgroundColor : '#111'});
    });
    backButton.on('pointerout', () => {
      backButton.setStyle({fill : '#00ff00', backgroundColor : '#000'});
    });

    this.tweens.add({
      targets : this.shipImage,
      y : this.shipImage.y - 30,
      duration : 2000,
      yoyo : true,
      repeat : -1,
      ease : 'Sine.easeInOut'
    });
  }

  update() {
    this.background.tilePositionX += 2;
  }

  handleUpgrade(username) {

    fetch('http://localhost:3000/upgrade', {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify({username}),
    })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            this.score = data.newExp;
            this.spaceship_level = data.newSpaceshipLevel;
            this.shipLevelTxt.setText("Spaceship Level: " + this.spaceship_level);
            this.scoreTxt.setText("Score: " + this.score);
          } else {
            return;
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
  }
}

export default UpgradesScene;