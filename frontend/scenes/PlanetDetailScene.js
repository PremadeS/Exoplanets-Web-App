import Phaser from "phaser";

class PlanetDetailScene extends Phaser.Scene {
  constructor() {
    super({key : 'PlanetDetailScene'});
  }

  init(data) {
    this.planetData = data;
  }

  preload() {
    this.load.image('background', 'assets/bg/bgtile.png');
    this.load.image('earth', 'assets/planets/earth.png');
    this.load.image(`planet${this.planetData.id}`, `assets/planets/planet${this.planetData.id}.png`);
    this.load.image(`sun`, `assets/planets/sun.png`);
  }

  create() {
    this.cameras.main.fadeIn(250, 0, 0, 0);
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background');
    this.background.setOrigin(0, 0);

    this.detailsText = this.add.text(50, 50, `Name: ${this.planetData.name}\n\nType: ${this.planetData.type}\n\nMass: ${this.planetData.mass} Jupiters\n\nRadius: ${this.planetData.radius}\n\nDiscovery Year: ${this.planetData.discovery_year}\n\nDistance From Earth: ${this.planetData.distance_from_earth} lightyears`, {
      fontSize : '32px',
      fill : '#fff'
    });

    this.planetImage = this.add.image(this.scale.width / 2 + this.scale.width / 4, this.scale.height / 2, `planet${this.planetData.id}`);
    this.planetImage.setScale(1.5);
    this.planetImage.setOrigin(0.5);

    this.tweens.add({
      targets : this.planetImage,
      y : this.planetImage.y - 30,
      duration : 2000,
      yoyo : true,
      repeat : -1,
      ease : 'Sine.easeInOut'
    });

    this.compareButton = this.add.text(30, this.scale.height - 150, 'Compare with Earth', {
                                   fontSize : '24px',
                                   fill : '#00ff00',
                                   fontFamily : 'Courier',
                                   backgroundColor : '#000',
                                   padding : {x : 10, y : 5},
                                   fixedWidth : 280
                                 })
                             .setOrigin(0, 1)
                             .setInteractive()
                             .setDepth(10);

    this.compareSunButton = this.add.text(30, this.scale.height - 100, 'Compare with Sun', {
                                      fontSize : '24px',
                                      fill : '#00ff00',
                                      fontFamily : 'Courier',
                                      backgroundColor : '#000',
                                      padding : {x : 10, y : 5},
                                      fixedWidth : 250
                                    })
                                .setOrigin(0, 1)
                                .setInteractive()
                                .setDepth(10);

    this.backButton = this.add.text(30, this.scale.height - 50, 'Back', {
                                fontSize : '24px',
                                fill : '#00ff00',
                                fontFamily : 'Courier',
                                backgroundColor : '#000',
                                padding : {x : 10, y : 5},
                                fixedWidth : 80
                              })
                          .setOrigin(0, 1)
                          .setInteractive()
                          .setDepth(10);

    this.addPointerEvents();

    this.compareButton.on('pointerdown', () => {
      this.showEarthComparison();
    });

    this.compareSunButton.on('pointerdown', () => {
      this.showSunComparison();
    });

    this.backButton.on('pointerdown', () => {
      this.cameras.main.fadeOut(250, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MainScene');
      });
    });
  }

  addPointerEvents() {
    const pointerEvents = (button) => {
      button.on('pointerover', () => {
        button.setStyle({fill : '#ff0000', backgroundColor : '#111'});
      });
      button.on('pointerout', () => {
        button.setStyle({fill : '#00ff00', backgroundColor : '#000'});
      });
    };

    pointerEvents(this.compareButton);
    pointerEvents(this.backButton);
    pointerEvents(this.compareSunButton);
  }

  showEarthComparison() {
    this.Note = this.add.text(this.scale.width / 2, this.scale.height - 90, `Note: This comparison is based on Jupiter radius, taken from NASA's Website`, {
      fontSize : '24px',
      fill : '#fff'
    });
    this.Note.setOrigin(0.5, 0);

    this.detailsText.setVisible(false);
    this.compareButton.setVisible(false);
    this.compareSunButton.setVisible(false);
    this.backButton.setVisible(false); // Hide back button

    this.tweens.add({
      targets : this.planetImage,
      scaleX : this.planetData.radius,
      scaleY : this.planetData.radius,
      duration : 1000,
      ease : 'Sine.easeInOut'
    });

    this.earthImage = this.add.image(this.scale.width / 2 - this.scale.width / 4, this.scale.height / 2, 'earth');
    this.earthImage.setScale(0.0911);
    this.earthImage.setOrigin(0, 1);

    this.tweens.add({
      targets : this.earthImage,
      y : this.earthImage.y - 30,
      duration : 2000,
      yoyo : true,
      repeat : -1,
      ease : 'Sine.easeInOut'
    });

    this.backButton.setVisible(true); // Show back button
    this.backButton.on('pointerdown', () => {
      this.tweens.add({
        targets : this.planetImage,
        scaleX : 1.5,
        scaleY : 1.5,
        duration : 1000,
        ease : 'Sine.easeInOut'
      });
      this.Note.setVisible(false);
      this.showPlanetDetails(); // This will return to the planet details view
    });
  }

  showSunComparison() {
    this.Note = this.add.text(this.scale.width / 2, this.scale.height - 90, `Note: This comparison is based on Jupiter radius, taken from NASA's Website`, {
      fontSize : '24px',
      fill : '#fff'
    });
    this.Note.setOrigin(0.5, 0);

    this.detailsText.setVisible(false);
    this.compareButton.setVisible(false);
    this.compareSunButton.setVisible(false);
    this.backButton.setVisible(false); // Hide back button

    this.tweens.add({
      targets : this.planetImage,
      scaleX : this.planetData.radius / 9.98,
      scaleY : this.planetData.radius / 9.98,
      duration : 1000,
      ease : 'Sine.easeInOut'
    });

    this.sunImage = this.add.image(this.scale.width / 2 - this.scale.width / 4, this.scale.height / 1.5, 'sun');
    this.sunImage.setScale(1);
    this.sunImage.setOrigin(0, 1);

    this.tweens.add({
      targets : this.sunImage,
      y : this.sunImage.y - 30,
      duration : 2000,
      yoyo : true,
      repeat : -1,
      ease : 'Sine.easeInOut'
    });

    this.backButton.setVisible(true); // Show back button
    this.backButton.on('pointerdown', () => {
      this.sunImage.setVisible(false);
      this.Note.setVisible(false);
      this.backButton.setVisible(false);
      this.tweens.add({
        targets : this.planetImage,
        scaleX : 1.5,
        scaleY : 1.5,
        duration : 1000,
        ease : 'Sine.easeInOut'
      });

      this.showPlanetDetails(); // This will return to the planet details view
    });
  }

  showPlanetDetails() {
    this.detailsText.setVisible(true);
    this.compareButton.setVisible(true);
    this.compareSunButton.setVisible(true);
    this.backButton.setVisible(true); // Show back button

    // Hide the sun image when returning to planet details
    if (this.sunImage) {
      this.sunImage.setVisible(false);
    }

    if (this.earthImage) {
      this.earthImage.setVisible(false);
    }

    if (this.Note) {
      this.Note.setVisible(false);
    }

    this.planetImage.setVisible(true);
  }

  update() {
    this.background.tilePositionX += 2;
  }

  shutdown() {
    this.cameras.main.fadeOut(500, 0, 0, 0);
  }
}

export default PlanetDetailScene;