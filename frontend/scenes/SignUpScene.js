import Phaser from "phaser";

class SignUpScene extends Phaser.Scene {
  constructor() {
    super({key : 'SignUpScene'});
  }

  preload() {
    this.load.image('background', 'assets/bg/bgtile.png')
  }
  update() {
    this.background.tilePositionX += 2;
  }

  create() {

    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background');
    this.background.setOrigin(0, 0);

    this.cameras.main.fadeIn(250, 0, 0, 0);
    this.add.text(this.scale.width / 2, 200, 'Sign Up Page', {fontSize : '70px', color : '#00ff00', fontStyle : 'bold'}).setOrigin(0.5);

    const starting = 250;

    const usernameTxt = this.add.text(this.scale.width / 2 - 100, starting + 110, 'Username', {fontSize : '22px', color : '#ffffff', fontStyle : 'italic'}).setOrigin(0.5);
    this.usernameBox = this.add.rectangle(this.scale.width / 2, starting + 150, 310, 40).setStrokeStyle(2, 0xffffff);
    this.usernameText = this.add.text(this.scale.width / 2 - 140, starting + 140, '', {fontSize : '20px', color : '#ffffff'});

    const passwordTxt = this.add.text(this.scale.width / 2 - 100, starting + 230, 'Password', {fontSize : '22px', color : '#ffffff', fontStyle : 'italic'}).setOrigin(0.5);
    this.passwordBox = this.add.rectangle(this.scale.width / 2, starting + 270, 310, 40).setStrokeStyle(2, 0xffffff);
    this.passwordText = this.add.text(this.scale.width / 2 - 140, starting + 260, '', {fontSize : '20px', color : '#ffffff'});

    const confirmPasswordTxt = this.add.text(this.scale.width / 2 - 50, starting + 350, 'Confirm Password', {fontSize : '22px', color : '#ffffff', fontStyle : 'italic'}).setOrigin(0.5);
    this.confirmPasswordBox = this.add.rectangle(this.scale.width / 2, starting + 390, 310, 40).setStrokeStyle(2, 0xffffff);
    this.confirmPasswordText = this.add.text(this.scale.width / 2 - 140, starting + 260, '', {fontSize : '20px', color : '#ffffff'});

    this.usernameBox.setInteractive().on('pointerdown', () => {
      this.usernameBox.setStrokeStyle(2, 0x00ff00);
      this.passwordBox.setStrokeStyle(2, 0xffffff);
      this.confirmPasswordBox.setStrokeStyle(2, 0xffffff);
      usernameTxt.setColor('#00ff00');
      passwordTxt.setColor('#ffffff');
      this.currentInput = 'username';
    });

    this.passwordBox.setInteractive().on('pointerdown', () => {
      this.usernameBox.setStrokeStyle(2, 0xffffff);
      this.passwordBox.setStrokeStyle(2, 0x00ff00);
      this.confirmPasswordBox.setStrokeStyle(2, 0xffffff);
      passwordTxt.setColor('#00ff00');
      usernameTxt.setColor('#ffffff');
      this.currentInput = 'password';
    });

    this.confirmPasswordBox.setInteractive().on('pointerdown', () => {
      this.usernameBox.setStrokeStyle(2, 0xffffff);
      this.passwordBox.setStrokeStyle(2, 0xffffff);
      this.confirmPasswordBox.setStrokeStyle(2, 0x00ff00);
      confirmPasswordTxt.setColor('#00ff00');
      usernameTxt.setColor('#ffffff');
      this.currentInput = 'password';
    });

    const signUpButton = this.add.text(this.scale.width / 2, starting + 485, 'Sign Up', {
                                   fontSize : '28px',
                                   color : '#00ff00',
                                   backgroundColor : '#000',
                                   padding : {x : 10, y : 5}
                                 })
                             .setOrigin(0.5)
                             .setInteractive();

    signUpButton.on('pointerdown', () => {
      this.handleLogin();
    });
    signUpButton.on('pointerover', () => {
      signUpButton.setStyle({fill : '#ff0000', backgroundColor : '#111'});
    });
    signUpButton.on('pointerout', () => {
      signUpButton.setStyle({fill : '#00ff00', backgroundColor : '#000'});
    });

    const alreadyHaveAnAccount = this.add.text(this.scale.width / 2, starting + 580, 'Already have an Account?', {fontSize : '26px', color : '#00ff00'}).setOrigin(0.5);
    alreadyHaveAnAccount.setInteractive().on('pointerover', () => {
      alreadyHaveAnAccount.setColor('#ff0000');
    });
    alreadyHaveAnAccount.setInteractive().on('pointerout', () => {
      alreadyHaveAnAccount.setColor('#00ff00');
    });
    alreadyHaveAnAccount.setInteractive().on('pointerdown', () => {
      this.cameras.main.fadeOut(250, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('LoginScene');
      });
    });
  }
}

export default SignUpScene;