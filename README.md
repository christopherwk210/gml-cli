# gml-cli

A cursed CLI tool that allows you to execute .gml files, and also "compile" them into standalone .exe files.

## Usage

You can download the latest version from the [releases page](https://github.com/christopherwk210/gml-cli/releases), just click on the link for `gml.exe`.

Once it's downloaded, create a .gml file next to it and execute the file like so:

```
.\gml.exe -i my_script.gml
```

If you want to turn your script into an executable, you can use the `-b` flag

```
.\gml.exe -i my_script.gml -b my_program.exe
```

This will create `my_program.exe` in the current working directory.

## What have I done?

Something terrible. This is, at best, a curious experiment that happens to be functional and might actually be useful. Use at your own risk! Make no mistake, this project is messy and cursed. Not everything works here, and what *does* work may not work as expected. Only a small subset of GML features and functions are currently supported. A rough list of what is implemented can be found further down.

So, what I've actually done here, is I've pulled a fast one on you. This is a Node.js project, and there's actually very little language parsing going on. GML is close enough to JS that it mostly just works in Node out of the box. There are a few gotchas, but they weren't too hard to work around. All this program really does is clean up your GML enough to the point where Node won't complain, and then executes it with `eval` (Side note, this also means that `\` characters don't work when compiling your scripts due to nested string parsing, lol)

This means that you could write valid Node.js code in your GML files alongside your GML and it'll work just fine, although I have not tested code splitting or package importing with `require` *at all*. That probably won't work. The actual "compiling" part is nothing more than a packaging step handled by [pkg](https://github.com/vercel/pkg).

## Technical details

So if I'm just cleaning up GML so it (barely) passes as JS, how did I get GML functions to work? Simple: I implemented them in JS by hand. This turned out to be mostly just time consuming, but I've gotten enough code coverage in place that you could actually make some useful utilities here. All of my JS implementations of GML functions can be found in `src/interop.js`. This file isn't actually referenced directly in the source, and is instead read as text to be concat'd with the GML contents. Note that some GML features had to be included in `src/index.js` and `src/builder.js` for... reasons. The `src/builder.js` file is what is included when compiling .gml files, since it's not necessary to include the full original source code.

Some initial "parsing" work can be found in `src/index.js`, and is mostly just some regex replacements. There's a notable bit involving some parsing to make `repeat()` loops work which is kind of cool. I could do the same for `do ... until` loops, but like, does anybody actually use those?

## Additional features

There are some extra functions available to GML that I thought would be nice to include.

### `clear_debug_messages()`

Clears the console, supported wherever `console.clear()` is supported

### `wait_for_exit()`

Displays "Press any key to continue..." in the console and waits until the user presses a key to close the window. Useful if you want your program to be used by double-clicking it rather than running in the console.

## Examples

See `examples/*.gml` for some neat GML scripts that I wrote and confirmed to work well. The `file-reader.gml` script is probably most notable, as it works with command line parameters; A common task for CLI programs.

## Supported features

Roughly, and in no particular order:

```
DS Maps
DS Lists
Accessors
Strings
Arrays
Structs
Methods
Math
Buffers
File Directories
Data Type Functions
File System
Debugging (including show_message and show_question!)
Encoding And Hashing
OS And Compiler (kinda)
General Game Control (specifically game_end)
Clipboard functionality
url_open (where url_open is actually more like a shell execute)
repeat loops
```