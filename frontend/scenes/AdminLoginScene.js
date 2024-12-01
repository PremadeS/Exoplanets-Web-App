import Phaser from "phaser";

class AdminLoginScene extends Phaser.Scene {
  constructor() {
    super({key : 'AdminLoginScene'});
    this.realPassword = '';
  }

  preload() {
    this.load.image('background', 'assets/bg/bgtile.png')
  }
  update() {
    this.background.tilePositionX += 2;
  }

  create() {

    this.realPassword = '';
    this.cameras.main.fadeIn(250, 0, 0, 0);

    this.addedIncorrect = false;
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background');
    this.background.setOrigin(0, 0);

    this.add.text(this.scale.width / 2, 200, 'Admin Page', {fontSize : '70px', color : '#00ff00', fontStyle : 'bold'}).setOrigin(0.5);

    const starting = 350;
    this.add.text(this.scale.width / 2, starting, 'Sign In', {fontSize : '40px', color : '#ffffff'}).setOrigin(0.5);

    const usernameTxt = this.add.text(this.scale.width / 2 - 100, starting + 110, 'Username', {fontSize : '22px', color : '#ffffff', fontStyle : 'italic'}).setOrigin(0.5);
    this.usernameBox = this.add.rectangle(this.scale.width / 2, starting + 150, 310, 40).setStrokeStyle(2, 0xffffff);
    this.usernameText = this.add.text(this.scale.width / 2 - 140, starting + 140, '', {fontSize : '20px', color : '#ffffff'});

    const passwordTxt = this.add.text(this.scale.width / 2 - 100, starting + 230, 'Password', {fontSize : '22px', color : '#ffffff', fontStyle : 'italic'}).setOrigin(0.5);
    this.passwordBox = this.add.rectangle(this.scale.width / 2, starting + 270, 310, 40).setStrokeStyle(2, 0xffffff);
    this.passwordText = this.add.text(this.scale.width / 2 - 140, starting + 260, '', {fontSize : '20px', color : '#ffffff'});

    const loginButton = this.add.text(this.scale.width / 2, starting + 385, 'Login', {
                                  fontSize : '28px',
                                  color : '#00ff00',
                                  backgroundColor : '#000',
                                  padding : {x : 10, y : 5}
                                })
                            .setOrigin(0.5)
                            .setInteractive();

    loginButton.on('pointerdown', () => {
      this.handleLogin();
    });
    loginButton.on('pointerover', () => {
      loginButton.setStyle({fill : '#ff0000', backgroundColor : '#111'});
    });
    loginButton.on('pointerout', () => {
      loginButton.setStyle({fill : '#00ff00', backgroundColor : '#000'});
    });

    this.currentInput = null;
    this.input.keyboard.on('keydown', this.handleKey, this);

    this.usernameBox.setInteractive().on('pointerdown', () => {
      this.usernameBox.setStrokeStyle(2, 0x00ff00);
      this.passwordBox.setStrokeStyle(2, 0xffffff);
      usernameTxt.setColor('#00ff00');
      passwordTxt.setColor('#ffffff');
      this.currentInput = 'username';
    });

    this.passwordBox.setInteractive().on('pointerdown', () => {
      this.usernameBox.setStrokeStyle(2, 0xffffff);
      this.passwordBox.setStrokeStyle(2, 0x00ff00);
      passwordTxt.setColor('#00ff00');
      usernameTxt.setColor('#ffffff');
      this.currentInput = 'password';
    });
  }

  handleKey(event) {
    if (this.currentInput) {
      const isPassword = this.currentInput === 'password';
      let textObj = isPassword ? this.passwordText : this.usernameText;
      let currentText = textObj.text;

      if (event.key === 'Backspace') {
        textObj.setText(currentText.slice(0, -1));
        if (isPassword) {
          this.realPassword = this.realPassword.slice(0, -1);
        }
      } else if (event.key.length === 1) {
        if (isPassword) {
          this.realPassword += event.key;
          textObj.setText(textObj.text + '*');
        } else {
          textObj.setText(currentText + event.key);
        }
      }
    }
  }

  handleLogin() {
    const username = this.usernameText.text;
    const password = this.realPassword;

    fetch('http://localhost:3000/admin', {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify({username, password}),
    })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            this.cameras.main.fadeOut(250, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
              this.scene.start('AdminScene', {
                name : username
              });
            });
          } else {
            if (!this.addedIncorrect) {
              this.addedIncorrect = true;
              this.add.text(this.scale.width / 2, 675, 'Incorrect username or password.', {fontSize : '18px', color : '#ff0000'}).setOrigin(0.5);
            }
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
  }
}

export default AdminLoginScene;