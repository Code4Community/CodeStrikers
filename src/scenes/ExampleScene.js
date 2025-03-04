import Phaser from "phaser";
import Physics from "phaser";
import logoImg from "../assets/logo.png";
import smileyImg from "../assets/smiley.png";
import C4C from "c4c-lib";

function enterButtonHoverState(btn) {
  btn.setStyle({ fill: "#ff0" });
}

function enterButtonRestState(btn) {
  btn.setStyle({ fill: "#fff" });
}

export default class ExampleScene extends Phaser.Scene {
  constructor() {
    super("Example");
  }

  preload() {
    this.load.image("logo", logoImg);
    this.load.image("smiley", smileyImg);
  }

  create() {
    // This is the text for a program which calls the function stored in the
    // symbol "alert-hello". It starts with a line comment, and then a function
    // call.
    C4C.Editor.Window.init(this);
    C4C.Editor.Window.open();
    C4C.Editor.setText(`moveRight(20)`);

    this.smiley = this.add.sprite(400, 300, "smiley");

    // Define new function and store it in the symbol "alert-hello". This
    // function can now be called from our little language.
    C4C.Interpreter.define("alertHello", () => {
      alert("hello");
    });

    C4C.Interpreter.define("moveRight", (x_dist) => {
      this.smiley.x += x_dist;
    });

    C4C.Interpreter.define("moveLeft", (x_dist) => {
      this.smiley.x -= x_dist;
    });

    // Create some interface to running the interpreter:

    // Run Button
    const runButton = this.add
          .text(550, 100, "Evaluate", { fill: "#fff", fontSize: "30px" })
          .setInteractive()
          .on("pointerdown", () => {
            const programText = C4C.Editor.getText();
            // HERE'S THE IMPORTANT PART!!
            C4C.Interpreter.run(programText);
          })
          .on("pointerover", () => enterButtonHoverState(runButton))
          .on("pointerout", () => enterButtonRestState(runButton));

    // Editor Button
    const editorButton = this.add
          .text(500, 200, "Toggle Editor", { fill: "#fff", fontSize: "30px" })
          .setInteractive()
          .on("pointerdown", () => {
            C4C.Editor.Window.toggle();
          })
          .on("pointerover", () => enterButtonHoverState(editorButton))
          .on("pointerout", () => enterButtonRestState(editorButton));

    // Check Button
    const checkButton = this.add
          .text(550, 300, "Check", { fill: "#fff", fontSize: "30px" })
          .setInteractive()
          .on("pointerdown", () => {
            const programText = C4C.Editor.getText();
            // HERE'S THE IMPORTANT PART!!
            
            try {
              C4C.Interpreter.check(programText);              
            } catch (err) {
              console.log("Caught something: " + err);
            } finally {
              console.log("Done handling");
            }
          })
          .on("pointerover", () => enterButtonHoverState(checkButton))
          .on("pointerout", () => enterButtonRestState(checkButton));
  }
}
