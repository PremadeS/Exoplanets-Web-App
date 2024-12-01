import Phaser from "phaser";

import AdminLoginScene from "./scenes/AdminLoginScene";

class AdminScene extends Phaser.Scene {
  constructor() {
    super({key : "AdminScene"});
  }

  init(data) {
    this.username = data.name;
  }

  preload() {
    this.load.image("background", "assets/bg/bgtile.png");
  }

  update() {
    this.background.tilePositionX += 2;
  }

  create() {
    this.cameras.main.fadeIn(250, 0, 0, 0);
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "background").setOrigin(0);

    this.add.text(this.scale.width / 2, this.scale.height / 8, `Hello, ${this.username}`, {
              fontSize : "24px",
              color : "#00ff00",
              fontStyle : "bold",
            })
        .setOrigin(0.5);

    this.add.text(this.scale.width / 2, this.scale.height / 8 + 100, "Cool stuff happens here", {
              fontSize : "18px",
              color : "#ffffff",
              fontStyle : "bold",
            })
        .setOrigin(0.5);

    const fields = [
      {label : "Name", key : "name"},
      {label : "Mass", key : "mass"},
      {label : "Discovery Year", key : "discoveryYear"},
      {label : "Type", key : "type"},
      {label : "Distance From Earth", key : "distanceFromEarth"},
      {label : "Radius", key : "radius"},
      {label : "Image URL", key : "imageUrl"},
    ];

    this.inputs = {};
    const fieldWidth = this.scale.width / 4;
    const fieldHeight = 30;
    const startY = this.scale.height / 3;
    const offsetY = 50;

    fields.forEach((field, index) => {
      const yPosition = startY + index * offsetY;

      this.add.text(this.scale.width / 8, yPosition + 6, field.label, {
                fontSize : "16px",
                color : "#ffffff",
              })
          .setOrigin(0);

      const inputBox = this.add.rectangle(this.scale.width / 4, yPosition, fieldWidth, fieldHeight, 0x000000).setOrigin(0);

      inputBox.setStrokeStyle(2, 0xffffff);
      inputBox.setInteractive();

      const inputText = this.add.text(this.scale.width / 4 + 5, yPosition + 5, "", {
                                  fontSize : "14px",
                                  color : "#ffffff",
                                })
                            .setOrigin(0);

      this.inputs[field.key] = {box : inputBox, text : inputText, value : ""};

      inputBox.on("pointerdown", () => {
        this.activateInput(field.key);
      });
    });

    const submitButton = this.add.text(this.scale.width / 4 + 50, startY + fields.length * offsetY + 50, "Submit", {
                                   fontSize : "18px",
                                   color : "#00ff00",
                                   backgroundColor : "#000000",
                                   padding : {x : 10, y : 5},
                                 })
                             .setOrigin(0.5);

    submitButton.setInteractive();
    submitButton.on("pointerdown", () => this.handleSubmit());
    submitButton.on("pointerover", () => {
      submitButton.setStyle({fill : "#ff0000", backgroundColor : "#111"});
    });
    submitButton.on("pointerout", () => {
      submitButton.setStyle({fill : "#00ff00", backgroundColor : "#000"});
    });

    const queryBoxWidth = this.scale.width / 3;
    const queryBoxHeight = 30;

    this.queryInputBox = this.add.rectangle(this.scale.width * 0.7 + 20, 325, queryBoxWidth, queryBoxHeight, 0x000000).setOrigin(0.5).setStrokeStyle(2, 0xffffff);
    this.queryInputText = this.add.text(this.queryInputBox.x - queryBoxWidth / 2 + 5, this.queryInputBox.y - 10, "", {
                                    fontSize : "16px",
                                    color : "#ffffff",
                                  })
                              .setOrigin(0);

    this.queryInputBox.setInteractive();
    this.queryInputBox.on("pointerdown", () => this.activateQueryInput());

    const runQueryButton = this.add.text(this.scale.width * 0.7, 400, "Run Query", {
                                     fontSize : "18px",
                                     color : "#ffffff",
                                     backgroundColor : "#000000",
                                     padding : {x : 10, y : 5},
                                   })
                               .setOrigin(0.5);
    runQueryButton.setInteractive();
    runQueryButton.on("pointerdown", () => this.runQuery());

    const shortcutButtonPlanets = this.add.text(this.scale.width * 0.7, 450, "Show Planets", {
                                            fontSize : "18px",
                                            color : "#ffffff",
                                            backgroundColor : "#000000",
                                            padding : {x : 10, y : 5},
                                          })
                                      .setOrigin(0.5);
    shortcutButtonPlanets.setInteractive();
    shortcutButtonPlanets.on("pointerdown", () => this.runQueryShortcut("SELECT * FROM planets"));

    const shortcutButtonUsers = this.add.text(this.scale.width * 0.7, 500, "Show Users", {
                                          fontSize : "18px",
                                          color : "#ffffff",
                                          backgroundColor : "#000000",
                                          padding : {x : 10, y : 5},
                                        })
                                    .setOrigin(0.5);
    shortcutButtonUsers.setInteractive();
    shortcutButtonUsers.on("pointerdown", () => this.runQueryShortcut("SELECT * FROM users"));

    this.queryResultText = this.add.text(this.scale.width * 0.55, 550, "", {
                                     fontSize : "14px",
                                     color : "#ffffff",
                                     wordWrap : {width : this.scale.width / 3},
                                   })
                               .setOrigin(0);
  }

  activateInput(key) {
    Object.values(this.inputs).forEach(input => {
      input.box.setStrokeStyle(2, 0xffffff);
      input.text.setColor("#ffffff");
    });

    const activeInput = this.inputs[key];
    activeInput.box.setStrokeStyle(2, 0x00ff00);
    activeInput.text.setColor("#00ff00");

    let currentValue = activeInput.value;
    this.input.keyboard.removeAllListeners("keydown");

    this.input.keyboard.on("keydown", (event) => {
      if (event.key === "Backspace") {
        currentValue = currentValue.slice(0, -1);
      } else if (event.key.length === 1) {
        currentValue += event.key;
      }

      activeInput.value = currentValue;
      activeInput.text.setText(currentValue);
    });
  }

  activateQueryInput() {
    let currentValue = this.queryInputText.text;
    this.input.keyboard.removeAllListeners("keydown");

    this.input.keyboard.on("keydown", (event) => {
      if (event.key === "Backspace") {
        currentValue = currentValue.slice(0, -1);
      } else if (event.key.length === 1) {
        currentValue += event.key;
      }
      this.queryInputText.setText(currentValue);
    });
  }

  handleSubmit() {
    let hasError = false;

    Object.keys(this.inputs).forEach((key) => {
      const input = this.inputs[key];
      const value = input.value.trim();

      if (value === "") {
        hasError = true;
        if (!input.errorMessage) {
          input.errorMessage = this.add.text(input.box.x + input.box.width + 10, input.box.y - input.box.height / 2 + 25, "Required", {
                                         fontSize : "14px",
                                         color : "#ff0000",
                                       })
                                   .setOrigin(0);
        }
      } else if (input.errorMessage) {
        input.errorMessage.destroy();
        input.errorMessage = null;
      }
    });

    if (hasError) {
      return;
    }

    const formData = Object.keys(this.inputs).reduce((data, key) => {
      data[key] = this.inputs[key].value.trim();
      return data;
    }, {});

    fetch("http://localhost:3000/api/planets", {
      method : "POST",
      headers : {
        "Content-Type" : "application/json",
      },
      body : JSON.stringify(formData),
    }).then((response) => {
        if (response.ok) {
          this.displayMessage("Planet added successfully!", "#00ff00");
        } else {
          return response.json().then((err) => {
            this.displayMessage(`Error: ${err.message}`, "#ff0000");
          });
        }
      }).catch((error) => {
      this.displayMessage(`Error: ${error.message}`, "#ff0000");
    });
  }

  runQuery() {
    const query = this.queryInputText.text.trim();
    if (query === "") {
      this.displayMessage("Query cannot be empty.", "#ff0000");
      return;
    }

    fetch("http://localhost:3000/api/query", {
      method : "POST",
      headers : {
        "Content-Type" : "application/json",
      },
      body : JSON.stringify({query}),
    }).then((response) => response.json())
        .then((data) => {
          if (data.error) {
            this.displayMessage(`Error: ${data.error}`, "#ff0000");
          } else {
            console.log("Query successful:", data);
            this.displayMessage("Query executed successfully!", "#00ff00");
          }
        })
        .catch((error) => {
          this.displayMessage(`Error: ${error.message}`, "#ff0000");
        });
  }

  runQueryShortcut(query) {
    this.queryInputText.setText(query);
    this.runQuery();
  }

  displayMessage(message, color) {
    this.queryResultText.setText(message);
    this.queryResultText.setColor(color);
  }
}

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
  scene : [ AdminLoginScene, AdminScene ]
};

const game = new Phaser.Game(config);
game.scene.start('AdminLoginScene');