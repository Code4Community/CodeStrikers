# Phaser 3 + Code4Community Library Example Project

This project uses the [Phaser 3 Project
Template](https://github.com/photonstorm/phaser3-project-template). Read more
about everything not related to `c4c-lib` there.

## Setting up `c4c-lib`

### Without NPM

Source the `bundle.js` script for the library version you want to use.

```html
<title>An Example</title>
<script src="https://cdn.jsdelivr.net/npm/phaser@3.24.1/dist/phaser.js"></script>
<!-- The line which loads c4c-lib: -->
<script defer src="https://github.com/Code4Community/c4c-lib/releases/download/0.2.2/bundle.js"></script>
<script defer src="main.js"></script>
```

### With NPM

Install this library in your project. You can do that from github or from a local directory. For local development, the directory is best. These exact commands should work.

        npm install --save code4community/c4c-lib
        
    OR
    
        npm install --save file://$HOME/school/c4c-club/c4c-lib/

## Using `c4c-lib` 

1.  Create the editor.

    ```javascript
    // Create the C4C editor, inside the given element.
    C4C.Editor.create(document.body);
    ```
    
    You can also pass in a theme for the editor and a flag which initially sets the editor to be invisible.
    
2.  Create some javascript functions you would like to expose to the this library's language. For our example, the javascript function just creates an alert.

    ```javascript
    // Define new function and associate it with the symbol "myAlert". This
    // function can now be called from our little language.
    C4C.Interpreter.define("myAlert", () => {
      alert("hello");
    });
    ```

3.  Expose some way for your user to run the interpreter. For our example, the user can just on click a sprite.

    ```javascript
    // Create some interface to running the interpreter.
    const logo = this.add.image(400, 150, 'logo');

    logo.setInteractive();
    logo.on("pointerdown", () => {
      const programText = C4C.Editor.getText();
      // HERE'S THE IMPORTANT PART!!
      C4C.Interpreter.run(programText);
    });
    ```

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

[Our Language and Editor Library](https://github.com/Code4Community/code-editor-and-interpreter) may not be easily installed through npm. This will be fixed soon.

## Available Commands

| Command         | Description                                                                     |
|-----------------|---------------------------------------------------------------------------------|
| `npm install`   | Install project dependencies                                                    |
| `npm start`     | Build project and open web server running project                               |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) |

## Contribution Policy
This project is closed to outside contributions.
