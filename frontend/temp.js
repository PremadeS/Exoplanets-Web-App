import Phaser from 'phaser';

class PlanetDetailScene extends Phaser.Scene {
  constructor() {
    super({key : 'PlanetDetailScene'});
  }

  // Accept an object with planet data
  init(data) {
    this.planetData = data; // Store the planet data passed from the previous scene
  }

  preload() {
    this.load.image('background', 'assets/bg/bgtile.png');
    this.load.image('earth', 'assets/planets/earth.png');
    this.load.image(`planet${this.planetData.id}`, `assets/planets/planet${this.planetData.id}.png`); // Load the planet image dynamically
  }

  create() {
    this.cameras.main.fadeIn(250, 0, 0, 0);

    // Add the background
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background');
    this.background.setOrigin(0, 0);

    // Display planet information
    this.detailsText = this.add.text(50, 50, `Name: ${this.planetData.name}\n\nType: ${this.planetData.type}\n\nMass: ${this.planetData.mass} Jupiters\n\nRadius: ${this.planetData.radius}\n\nDiscovery Year: ${this.planetData.discovery_year}\n\nDistance From Earth: ${this.planetData.distance_from_earth} lightyears`, {
      fontSize : '32px',
      fill : '#fff'
    });

    // Add the planet image
    this.planetImage = this.add.image(this.scale.width / 2 + this.scale.width / 4, this.scale.height / 2, `planet${this.planetData.id}`);
    this.planetImage.setScale(1.5);
    this.planetImage.setOrigin(0.5);

    // Add tween animation to the planet
    this.tweens.add({
      targets : this.planetImage,
      y : this.planetImage.y - 30,
      duration : 2000,
      yoyo : true,
      repeat : -1,
      ease : 'Sine.easeInOut'
    });

    // Add retro-styled "Compare with Earth" button
    this.compareButton = this.add.text(30, this.scale.height - 100, 'Compare with Earth', {
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

    // Add retro-styled "Compare with Earth" button
    this.backCompareButton = this.add.text(30, this.scale.height - 50, 'Back', {
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

    // Add hover effect
    this.compareButton.on('pointerover', () => {
      this.compareButton.setStyle({fill : '#ff0000', backgroundColor : '#111'});
    });
    this.compareButton.on('pointerout', () => {
      this.compareButton.setStyle({fill : '#00ff00', backgroundColor : '#000'});
    });

    this.backCompareButton.on('pointerover', () => {
      this.backCompareButton.setStyle({fill : '#ff0000', backgroundColor : '#111'});
    });
    this.backCompareButton.on('pointerout', () => {
      this.backCompareButton.setStyle({fill : '#00ff00', backgroundColor : '#000'});
    });

    // Handle button click to compare with Earth
    this.compareButton.on('pointerdown', () => {
      this.showEarthComparison();
    });

    this.backCompareButton.on('pointerdown', () => {
      this.cameras.main.fadeOut(250, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MainScene');
      });
    });
  }

  showEarthComparison() {
    this.Note = this.add.text(this.scale.width / 2, this.scale.height - 90, `Note: This comparison is based on Jupiter radius, taken fron Nasa's Website`, {
      fontSize : '24px',
      fill : '#fff'
    });
    this.Note.setOrigin(0.5, 0);
    // Hide the planet details text and planet image
    this.detailsText.setVisible(false);
    this.compareButton.setVisible(false);
    // this.planetImage.setScale(1.5);

    this.tweens.add({
      targets : this.planetImage,
      scaleX : this.planetData.radius,
      scaleY : this.planetData.radius,
      duration : 1000,
      ease : 'Sine.easeInOut'
    });

    // Add the Earth image
    this.earthImage = this.add.image(this.scale.width / 2 - this.scale.width / 4, this.scale.height / 2, 'earth');
    this.earthImage.setScale(0.0911);
    this.earthImage.setOrigin(0, 1);

    // Add the same hover animation to Earth image
    this.tweens.add({
      targets : this.earthImage,
      y : this.earthImage.y - 30,
      duration : 2000,
      yoyo : true,
      repeat : -1,
      ease : 'Sine.easeInOut'
    });

    // Add "Back" button
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

    // Add hover effect to the "Back" button
    this.backButton.on('pointerover', () => {
      this.backButton.setStyle({fill : '#ff0000', backgroundColor : '#111'});
    });
    this.backButton.on('pointerout', () => {
      this.backButton.setStyle({fill : '#00ff00', backgroundColor : '#000'});
    });

    // Handle "Back" button click to return to the original view
    this.backButton.on('pointerdown', () => {
      this.tweens.add({
        targets : this.planetImage,
        scaleX : 1.5,
        scaleY : 1.5,
        duration : 1000,
        ease : 'Sine.easeInOut'
      });
      this.Note.setVisible(false);
      this.showPlanetDetails();
    });
  }

  showPlanetDetails() {
    // Hide Earth and back button, show original details
    this.earthImage.setVisible(false);
    this.backButton.setVisible(false);

    // Show planet details text and planet image again
    this.detailsText.setVisible(true);
    this.planetImage.setVisible(true);
    this.compareButton.setVisible(true);
  }

  update() {
    this.background.tilePositionX += 2; // Slowly move the background
  }

  shutdown() {
    this.cameras.main.fadeOut(500, 0, 0, 0);
  }
}

class MainScene extends Phaser.Scene {
  constructor() {
    super({key : 'MainScene'});
  }

  preload() {
    this.load.image('spaceship', 'assets/ship/spaceship.png');
    this.load.image('spaceshipmove', 'assets/ship/spaceshipmove.png');
    this.load.image('background', 'assets/bg/bgtile.png');

    fetchPlanets(this);
  }

  create() {
    this.cameras.main.fadeIn(250, 0, 0, 0);
    background = this.add.tileSprite(0, 0, config.width, config.height, 'background');
    background.setOrigin(0, 0);

    spaceship = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'spaceship');
    spaceship.setDepth(10);
    spaceship.setDrag(200); // Add some drag to the spaceship for smoother stopping
    spaceship.setScale(0.5);
    spaceship.setTint(0x999999);

    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addKeys('W,A,S,D');

    planets = this.physics.add.group(); // Create a group for planets

    this.cameras.main.startFollow(spaceship, true, 0.05, 0.05);
    this.cameras.main.setZoom(1);

    // Spawn initial planets
    this.spawnRandomPlanet();

    window.addEventListener('resize', () => resizeGame(this));
  }
  update() {
    let targetSpeedX = 0;
    let targetSpeedY = 0;
    let isMoving = false; // Track if the spaceship is moving

    // Check for input and move spaceship
    if (this.input.keyboard.keys[87].isDown) { // W key
      targetSpeedY = -slowMoveSpeed;           // Moving up
      isMoving = true;
    }
    if (this.input.keyboard.keys[83].isDown) { // S key
      targetSpeedY = slowMoveSpeed;            // Moving down
      isMoving = true;
    }
    if (this.input.keyboard.keys[65].isDown) { // A key
      targetSpeedX = -slowMoveSpeed;           // Moving left
      isMoving = true;
    }
    if (this.input.keyboard.keys[68].isDown) { // D key
      targetSpeedX = slowMoveSpeed;            // Moving right
      isMoving = true;
    }

    // Gradually adjust the speed (acceleration) with a threshold to avoid jitter
    const speedThreshold = 0.05; // Minimum velocity threshold to prevent jitter
    currentSpeedX = Phaser.Math.Interpolation.Linear([ currentSpeedX, targetSpeedX ], acceleration);
    currentSpeedY = Phaser.Math.Interpolation.Linear([ currentSpeedY, targetSpeedY ], acceleration);

    // Apply a threshold to prevent tiny movements causing jitter
    if (Math.abs(currentSpeedX) < speedThreshold)
      currentSpeedX = 0;
    if (Math.abs(currentSpeedY) < speedThreshold)
      currentSpeedY = 0;

    // Move the background based on smoothed velocity and keep it moving slowly
    background.tilePositionX += (currentSpeedX * 6) + 0.5; // Background follows spaceship speed and moves slowly
    background.tilePositionY += (currentSpeedY * 6);       // Background follows spaceship speed

    // Smoothly adjust the spaceship rotation
    if (isMoving) {
      spaceship.setVelocity(currentSpeedX * 2, currentSpeedY * 2);

      const desiredAngle = Phaser.Math.Angle.Between(0, 0, currentSpeedX, currentSpeedY);
      const currentAngle = spaceship.rotation; // Current rotation angle

      let angleDiff = desiredAngle - currentAngle;
      angleDiff = Phaser.Math.Angle.Wrap(angleDiff); // Wrap to -PI to PI

      const smoothAngle = currentAngle + angleDiff * 0.1; // Interpolate the angle
      spaceship.setRotation(smoothAngle);                 // Rotate spaceship towards smoothed angle

      if (decelerationTween) {
        decelerationTween.stop();
        decelerationTween = null;
      }

      if (spaceship.texture.key !== 'spaceshipmove') {
        spaceship.setTexture('spaceshipmove');
      }
    } else {
      if (!decelerationTween && (spaceship.body.velocity.x !== 0 || spaceship.body.velocity.y !== 0)) {
        decelerationTween = this.tweens.add({
          targets : spaceship.body.velocity,
          x : 0,           // Smoothly bring x velocity to zero
          y : 0,           // Smoothly bring y velocity to zero
          ease : 'Power2', // Smooth deceleration
          duration : 800,  // Duration for smooth stop
          onComplete : () => {
            spaceship.setVelocity(0, 0); // Ensure velocity is exactly zero
            decelerationTween = null;    // Reset tween when done
          }
        });
      }
      if (spaceship.texture.key !== 'spaceship') {
        spaceship.setTexture('spaceship');
      }
    }

    // Move planets based on smoothed velocity
    planets.children.each(planet => {
      planet.x -= (currentSpeedX * planetMoveSpeed) / slowMoveSpeed; // Move planets slower
      planet.y -= (currentSpeedY * planetMoveSpeed) / slowMoveSpeed;

      const distance = Phaser.Math.Distance.Between(spaceship.x, spaceship.y, planet.x, planet.y);
      if (distance < 150 && planet.scale === planet.initialScale) {
        if (!planet.isGrown) { // Only scale and change color if not already grown
          smoothScale(planet, planet.initialScale + 0.2, 250);
          changeColor(planet, false); // Change color as it grows
          planet.isGrown = true;      // Mark as grown
          planet.isShrunk = false;    // Reset shrunk state
        }
      } else if (distance >= 150 && planet.scale > planet.initialScale) {
        if (!planet.isShrunk) { // Only scale and reset color if not already shrunk
          smoothScale(planet, planet.initialScale, 250);
          changeColor(planet, true); // Reset color when scaling down
          planet.isShrunk = true;    // Mark as shrunk
          planet.isGrown = false;    // Reset grown state
        }
      }

      // Destroy planets that go off-screen
      if (planet.x < -planet.width || planet.x > config.width + planet.width ||
          planet.y < -planet.height || planet.y > config.height + planet.height) {
        planet.destroy();
      }
    });

    // Random planet creation
    if (Phaser.Math.Between(0, 100) > 77 && isMoving) { // 2% chance to spawn a planet per frame
      this.spawnRandomPlanet();
    }
  }

  spawnRandomPlanet() {
    let x, y;
    let overlap = true;
    let limit = 0;

    // Keep generating a new position until there is no overlap
    while (overlap && limit < 5) {
      if (Phaser.Math.Between(0, 1)) {
        x = Phaser.Math.Between(-planetSpawnDistance - 800, config.width + planetSpawnDistance);
        y = Phaser.Math.Between(-planetSpawnDistance - 800, 0); // Above or below screen
      } else {
        x = Phaser.Math.Between(-planetSpawnDistance - 800, config.width + planetSpawnDistance + 800);
        y = Phaser.Math.Between(config.height, config.height + planetSpawnDistance + 800); // Above or below screen
      }

      overlap = false;

      // Check if the new planet would overlap with any existing planet
      planets.children.each(planet => {
        let distance = Phaser.Math.Distance.Between(x, y, planet.x, planet.y);
        if (distance < planet.width + planet.mass / 10) {
          overlap = true;
        }
      });

      ++limit; // to avoid inifinite loop bruv..
    }

    let planetId = Phaser.Math.Between(1, totalPlanetTypes); // Randomly choose a planet ID

    let planet = planets.create(x, y, `planet${planetId}`); // Load texture based on ID
    planet.id = planetId;
    planet.name = planetData[planetId - 1].name;
    planet.type = planetData[planetId - 1].type;
    planet.distance_from_earth = planetData[planetId - 1].distance_from_earth;
    planet.discovery_year = planetData[planetId - 1].discovery_year;
    planet.mass = planetData[planetId - 1].mass;
    planet.radius = planetData[planetId - 1].radius;

    planet.setScale(planet.radius); // Random size
    planet.initialScale = planet.radius;
    planet.setDepth(5);       // Ensure planets have a lower depth than spaceship
    planet.setTint(0x333333); // Dark gray tint

    planet.setInteractive();
    planet.on('pointerdown', () => {
      const distance = Phaser.Math.Distance.Between(spaceship.x, spaceship.y, planet.x, planet.y);
      if (distance < 150) {
        this.cameras.main.fadeOut(250, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('PlanetDetailScene', {
            id : planet.id,
            name : planet.name,
            type : planet.type,
            mass : planet.mass,
            radius : planet.radius,
            discovery_year : planet.discovery_year,
            distance_from_earth : planet.distance_from_earth,
          });
        });
      }
    });
  }
}

// Configuration object for the game
const config = {
  type : Phaser.AUTO,
  width : window.innerWidth,
  height : window.innerHeight,
  physics : {
    default : 'arcade',
    arcade : {
      gravity : {y : 0},
      debug : false
    }
  },
  scale : {
    mode : Phaser.Scale.FIT,
    autoCentre : Phaser.Scale.CENTER_BOTH
  },
  scene : [ MainScene, PlanetDetailScene ] // Register both scenes here
};

let currentSpeedX = 0;
let currentSpeedY = 0;
const acceleration = 0.05; // Speed increase rate

const slowMoveSpeed = 1.5; // Reduced movement speed
let easingTween;           // Reference for the easing tween for movement
let decelerationTween;     // Reference for deceleration tween

let spaceship;
let cursors;
let background;
let rotationTween;               // Store reference to the tween
let planets;                     // Group for planets
const planetMoveSpeed = 5;       // Speed of movement for planets
const planetSpawnDistance = 800; // Distance from the screen edges to spawn planets
const game = new Phaser.Game(config);

let planetData;
let totalPlanetTypes;

async function fetchPlanets(scene) {
  try {
    const response = await fetch('http://localhost:3000/planets');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    planetData = await response.json();
    totalPlanetTypes = planetData.length;
    console.log(planetData);

    // Preload planet images dynamically based on IDs
    planetData.forEach(planet => {
      scene.load.image(`planet${planet.id}`, `assets/planets/planet${planet.id}.png`); // Load texture using planet ID
    });

  } catch (error) {
    console.error('Error fetching planets:', error);
  }
}

function resizeGame(scene) {
  // Set new width and height based on window size
  game.scale.resize(window.innerWidth, window.innerHeight);

  // Update the background to cover the new size
  background.setSize(window.innerWidth, window.innerHeight);
}

function smoothScale(planet, targetScale, duration) {
  const initialScale = planet.scale;                        // Get the initial scale
  const scaleChange = targetScale - initialScale;           // Calculate the change in scale
  const frameDuration = 16.67;                              // Approximate time per frame at 60 FPS
  const totalFrames = Math.floor(duration / frameDuration); // Total frames for the duration
  let currentFrame = 0;

  const easeOut = (t) => {
    return 1 - Math.pow(1 - t, 2); // Quadratic ease-out function
  };

  const scalePlanet = () => {
    if (currentFrame < totalFrames) {
      currentFrame++;
      const t = currentFrame / totalFrames;                   // Normalized time (0 to 1)
      const easedT = easeOut(t);                              // Apply ease-out function
      const newScale = initialScale + (scaleChange * easedT); // Calculate new scale
      planet.setScale(newScale);                              // Set the new scale
      requestAnimationFrame(scalePlanet);                     // Continue scaling in the next frame
    } else {
      planet.setScale(targetScale); // Ensure it ends exactly at the target scale
    }
  };

  scalePlanet(); // Start the scaling loop
}

function changeColor(planet, setTint) {
  const fadeDuration = 250;                            // Duration for fade-in in milliseconds
  const fadeFrames = Math.floor(fadeDuration / 16.67); // Approximate frames at 60 FPS

  // Initialize fade properties on the planet if they don't exist
  if (!planet.isFadingIn)
    planet.isFadingIn = false;
  if (!planet.isFadingOut)
    planet.isFadingOut = false;

  if (setTint) {
    // Start fade-in if not already fading in and not in progress of fade-out
    if (!planet.isFadingIn && !planet.isFadingOut) {
      planet.isFadingIn = true; // Mark as fading in
      let currentFrame = 0;

      const fadeIn = () => {
        if (currentFrame < fadeFrames) {
          currentFrame++;
          const tintColor = Phaser.Display.Color.Interpolate.ColorWithColor(
              {r : 255, g : 255, b : 255}, // White (no tint)
              {r : 51, g : 51, b : 51},    // Dark gray tint
              fadeFrames,
              currentFrame);
          planet.setTint(Phaser.Display.Color.GetColor(tintColor.r, tintColor.g, tintColor.b));
          requestAnimationFrame(fadeIn);
        } else {
          planet.setTint(0x333333);  // Set final tint color
          planet.isFadingIn = false; // Mark fade-in as complete
        }
      };
      fadeIn();
    }
  } else {
    // Start fade-out if not already fading out and not in progress of fade-in
    if (!planet.isFadingOut && !planet.isFadingIn) {
      planet.isFadingOut = true; // Mark as fading out
      let currentFrame = 0;

      const fadeOut = () => {
        if (currentFrame < fadeFrames) {
          currentFrame++;
          const tintColor = Phaser.Display.Color.Interpolate.ColorWithColor(
              {r : 51, g : 51, b : 51},    // Dark gray
              {r : 255, g : 255, b : 255}, // White (no tint)
              fadeFrames,
              currentFrame);
          planet.setTint(Phaser.Display.Color.GetColor(tintColor.r, tintColor.g, tintColor.b));
          requestAnimationFrame(fadeOut);
        } else {
          planet.clearTint();         // Clear the tint after fade completes
          planet.isFadingOut = false; // Mark fade-out as complete
        }
      };
      fadeOut();
    }
  }
}

game.scene.start('MainScene');
