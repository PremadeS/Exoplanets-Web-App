import Phaser from "phaser";

class SignUpScene extends Phaser.Scene {
  constructor() {
    super({key : 'SignUpScene'});
    this.realPassword = '';
    this.confirmPassword = '';
    this.email = '';
    this.addedIncorrect = false;
  }

  preload() {
    this.load.image('background', 'assets/bg/bgtile.png');
  }

  update() {
    this.background.tilePositionX += 2;
  }

  create() {
    this.realPassword = '';
    this.confirmPassword = '';
    this.email = '';
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background');
    this.background.setOrigin(0, 0);

    this.cameras.main.fadeIn(250, 0, 0, 0);
    this.add.text(this.scale.width / 2, 200, 'Sign Up Page', {fontSize : '70px', color : '#00ff00', fontStyle : 'bold'}).setOrigin(0.5);

    const starting = 200;

    const emailTxt = this.add.text(this.scale.width / 2 - 100, starting + 110, 'Email', {fontSize : '22px', color : '#ffffff', fontStyle : 'italic'}).setOrigin(0.5);
    this.emailBox = this.add.rectangle(this.scale.width / 2, starting + 150, 310, 40).setStrokeStyle(2, 0xffffff);
    this.emailText = this.add.text(this.scale.width / 2 - 140, starting + 140, '', {fontSize : '20px', color : '#ffffff'});

    const usernameTxt = this.add.text(this.scale.width / 2 - 100, starting + 210, 'Username', {fontSize : '22px', color : '#ffffff', fontStyle : 'italic'}).setOrigin(0.5);
    this.usernameBox = this.add.rectangle(this.scale.width / 2, starting + 250, 310, 40).setStrokeStyle(2, 0xffffff);
    this.usernameText = this.add.text(this.scale.width / 2 - 140, starting + 240, '', {fontSize : '20px', color : '#ffffff'});

    const passwordTxt = this.add.text(this.scale.width / 2 - 100, starting + 310, 'Password', {fontSize : '22px', color : '#ffffff', fontStyle : 'italic'}).setOrigin(0.5);
    this.passwordBox = this.add.rectangle(this.scale.width / 2, starting + 350, 310, 40).setStrokeStyle(2, 0xffffff);
    this.passwordText = this.add.text(this.scale.width / 2 - 140, starting + 340, '', {fontSize : '20px', color : '#ffffff'});

    const confirmPasswordTxt = this.add.text(this.scale.width / 2 - 50, starting + 430, 'Confirm Password', {fontSize : '22px', color : '#ffffff', fontStyle : 'italic'}).setOrigin(0.5);
    this.confirmPasswordBox = this.add.rectangle(this.scale.width / 2, starting + 470, 310, 40).setStrokeStyle(2, 0xffffff);
    this.confirmPasswordText = this.add.text(this.scale.width / 2 - 140, starting + 460, '', {fontSize : '20px', color : '#ffffff'});

    this.emailBox.setInteractive().on('pointerdown', () => {
      this.emailBox.setStrokeStyle(2, 0x00ff00);
      this.usernameBox.setStrokeStyle(2, 0xffffff);
      this.passwordBox.setStrokeStyle(2, 0xffffff);
      this.confirmPasswordBox.setStrokeStyle(2, 0xffffff);
      emailTxt.setColor('#00ff00');
      usernameTxt.setColor('#ffffff');
      passwordTxt.setColor('#ffffff');
      confirmPasswordTxt.setColor('#ffffff');
      this.currentInput = 'email';
    });

    this.usernameBox.setInteractive().on('pointerdown', () => {
      this.emailBox.setStrokeStyle(2, 0xffffff);
      this.usernameBox.setStrokeStyle(2, 0x00ff00);
      this.passwordBox.setStrokeStyle(2, 0xffffff);
      this.confirmPasswordBox.setStrokeStyle(2, 0xffffff);
      usernameTxt.setColor('#00ff00');
      emailTxt.setColor('#ffffff');
      passwordTxt.setColor('#ffffff');
      confirmPasswordTxt.setColor('#ffffff');
      this.currentInput = 'username';
    });

    this.passwordBox.setInteractive().on('pointerdown', () => {
      this.emailBox.setStrokeStyle(2, 0xffffff);
      this.usernameBox.setStrokeStyle(2, 0xffffff);
      this.passwordBox.setStrokeStyle(2, 0x00ff00);
      this.confirmPasswordBox.setStrokeStyle(2, 0xffffff);
      passwordTxt.setColor('#00ff00');
      emailTxt.setColor('#ffffff');
      usernameTxt.setColor('#ffffff');
      confirmPasswordTxt.setColor('#ffffff');
      this.currentInput = 'password';
    });

    this.confirmPasswordBox.setInteractive().on('pointerdown', () => {
      this.emailBox.setStrokeStyle(2, 0xffffff);
      this.usernameBox.setStrokeStyle(2, 0xffffff);
      this.passwordBox.setStrokeStyle(2, 0xffffff);
      this.confirmPasswordBox.setStrokeStyle(2, 0x00ff00);
      confirmPasswordTxt.setColor('#00ff00');
      emailTxt.setColor('#ffffff');
      usernameTxt.setColor('#ffffff');
      passwordTxt.setColor('#ffffff');
      this.currentInput = 'confirmPassword';
    });

    const signUpButton = this.add.text(this.scale.width / 2, starting + 550, 'Sign Up', {
                                   fontSize : '28px',
                                   color : '#00ff00',
                                   backgroundColor : '#000',
                                   padding : {x : 10, y : 5}
                                 })
                             .setOrigin(0.5)
                             .setInteractive();

    signUpButton.on('pointerdown', () => {
      this.handleSignUp();
    });
    signUpButton.on('pointerover', () => {
      signUpButton.setStyle({fill : '#ff0000', backgroundColor : '#111'});
    });
    signUpButton.on('pointerout', () => {
      signUpButton.setStyle({fill : '#00ff00', backgroundColor : '#000'});
    });

    const alreadyHaveAnAccount = this.add.text(this.scale.width / 2, starting + 650, 'Already have an Account?', {fontSize : '26px', color : '#00ff00'}).setOrigin(0.5);
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

    this.input.keyboard.on('keydown', (event) => {
      this.handleKey(event);
    });
  }

  handleKey(event) {
    if (this.currentInput) {
      const isPassword = this.currentInput === 'password';
      const isConfirmPassword = this.currentInput === 'confirmPassword';
      const isEmail = this.currentInput === 'email';
      let textObj = isPassword ? this.passwordText : isConfirmPassword ? this.confirmPasswordText
                                                 : isEmail             ? this.emailText
                                                                       : this.usernameText;
      let currentText = textObj.text;

      if (event.key === 'Backspace') {
        textObj.setText(currentText.slice(0, -1));
        if (isPassword) {
          this.realPassword = this.realPassword.slice(0, -1);
        } else if (isConfirmPassword) {
          this.confirmPassword = this.confirmPassword.slice(0, -1);
        } else if (isEmail) {
          this.email = this.email.slice(0, -1);
        }
      } else if (event.key.length === 1) {
        if (isPassword) {
          this.realPassword += event.key;
          textObj.setText(currentText + '*');
        } else if (isConfirmPassword) {
          this.confirmPassword += event.key;
          textObj.setText(currentText + '*');
        } else if (isEmail) {
          this.email += event.key;
          textObj.setText(currentText + event.key);
        } else {
          textObj.setText(currentText + event.key);
        }
      }
    }
  }

  handleSignUp() {
    const username = this.usernameText.text;
    const password = this.realPassword;
    const confirmPassword = this.confirmPassword;
    const email = this.email;

    if (!username || !password || !confirmPassword || !email) {
      this.removeErrorMessages();
      this.addErrorMessage('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      this.removeErrorMessages();
      this.addErrorMessage('Passwords do not match.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.removeErrorMessages();
      this.addErrorMessage('Invalid email address.');
      return;
    }

    this.removeErrorMessages();
    fetch('http://localhost:3000/signup', {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify({username, password, email}),
    })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            this.cameras.main.fadeOut(250, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
              this.scene.start('MainScene', {
                name : username,
                score : 0,
                level : 1,
                spaceship_level : 1
              });
            });
          } else {
            this.removeErrorMessages();
            this.addErrorMessage('Incorrect username or password.');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
  }

  removeErrorMessages() {
    const errorMessages = this.children.getByName('errorText');
    if (errorMessages) {
      errorMessages.destroy();
    }
  }

  addErrorMessage(message) {
    this.add.text(this.scale.width / 2, 710, message, {fontSize : '18px', color : '#ff0000'}).setOrigin(0.5).setName('errorText');
  }
}

export default SignUpScene;