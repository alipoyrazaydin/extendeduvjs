
## ExtendedUVJS
![https://kigi.moe/](https://img.shields.io/badge/Branch-Main-green)
![https://kigi.moe/](https://img.shields.io/badge/Framework-ExtendedUVJS-blue)<br>
**ExtendedUVJS** is a small library to help you write less code with more features being added into your favorite LibUV-based Javascript Interpreter!

Here are some examples to get you started:

1 - Log: 
```js
// Load the framework before everything.
require("extendeduvjs")();

// Set the process name AND COLOR first.
process.title = "ExtendedUVJS";
process.color = 34; // Color Blue in ANSI

log("Hello World!");
```
2 - Add objects to an object in one sentence.
```js
// Load the framework before everything.
require("extendeduvjs")();

var myObject = {"Hey": "Hello!"};
var JSONOutput = JSON.stringify(myObject.with({"What": "How?"}));
```
1 - Swallow (Methodified Try-Catch): 
```js
// Load the framework before everything.
require("extendeduvjs")();

return swallow(() => { return undefinedObject.hey })
// Return: null

return swallow(() => { return process.coreversion.NAME })
// Return: FoldFramework

return swallow(() => { return even for the most devious errors })
// Return: null
```
2 - requireAbsolute (Require by Absolute Path / Script Execution Path): 
```js
// Load the framework before everything.
require("extendeduvjs")();

// Assume we are at /core/utils and
// we want to require /core/classes/hey.js

// Normal Require:
require("../classes/hey");

// Absolute Path Require:
requireAbsolute("core/classes/hey");
```
