const minimist = require('minimist');
const { readFileSync, writeFileSync, existsSync, unlinkSync } = require('node:fs');
const path = require('node:path');
const { exec } = require('pkg');
const child_process = require('node:child_process');

function halt(err) {
  console.log(`Error: ${err}`);
  process.exit(1);
}

const args = minimist(process.argv.slice(2));

// Validate that an input file was specified
const entryPoint = args['i'] || args['input'];
if (!entryPoint) halt('No input GML file specified. Use -i or --input to specify an input file.');
if (!entryPoint.toLowerCase().endsWith('.gml')) halt('Input file must be a GML file.');

// Validate that the input file exists
let entryPointPath = entryPoint;
if (!existsSync(entryPointPath)) entryPointPath = path.join(__dirname, entryPoint);
if (!existsSync(entryPointPath)) halt('Input file does not exist.');

const interopContents = readFileSync(path.join(__dirname, 'interop.js'), 'utf-8');
let gmlContents = readFileSync(entryPointPath, 'utf-8')
  .replace(/self/g, 'this')
  .replace(/fps/g, '0')
  .replace(/fps_real/g, '0')
  .replace(/debug_mode/g, 'false')
  .replace(/working_directory/g, `process.cwd()`)
  .replace(/temp_directory/g, `process.cwd()`)
  .replace(/program_directory/g, `process.cwd()`)
  .replace(/\[\|/g, '[')
  .replace(/\[\?/g, '[')
  .replace(/\[\#/g, '[')
  .replace(/\[\@/g, '[')
  .replace(/\[\$/g, '[')
  .replace(/begin/g, '{')
  .replace(/end/g, '}')
  .replace(/(#macro)\s+([a-zA-Z_][a-zA-Z_0-9]+)/g, 'const $2 =')
  .replace(/constructor/g, '');

// Parse repeat loops
let output = gmlContents;
const repeatRegex = /(repeat)\s*(\(\d+\))\s*/g;
let result;
while((result = repeatRegex.exec(output)) !== null) {
  // remove match from output
  output = output.slice(0, result.index) + output.slice(result.index + result[0].length - 1);

  // insert text at match position
  output = output.slice(0, result.index) + `Array.from(new Array${result[2]}).forEach(() =>` + output.slice(result.index);

  let position = output.indexOf('{', result.index);
  let count = 1;
  let closed = false;
  while (!closed) {
    if (++position > output.length) {
      throw new Error('Parse error: Unmatched { for repeat loop at position ' + result.index + '.')
    }

    if (output[position] === '{') {
      count++;
    } else if (output[position] === '}') {
      if (--count === 0) {
        output = output.slice(0, position) + '});' + output.slice(position + 1);
        closed = true;
      }
    }
  }
}

gmlContents = output;

// Interop code that has to be not-eval'd
const __code_is_compiled = false;

function show_message(str) {
  const cmd = 'powershell (New-Object -ComObject Wscript.Shell).Popup("""' + str.replace(/\n/g, '`n') + '""",0,"""Message""",0x0)';
  child_process.execSync(cmd);
}

function show_question(str) {
  const cmd = 'powershell.exe -Command "& {Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show(\\"' + str.replace(/\n/g, '\\\\n') + '\\", \\"Message\\", [System.Windows.Forms.MessageBoxButtons]::YesNo, [System.Windows.Forms.MessageBoxIcon]::Question)}"';
  const result = child_process.execSync(cmd);
  return result.toString().toLowerCase().includes('yes');
}

function os_is_network_connected() {
  try {
    child_process.execSync('ping 8.8.8.8 -n 1');
    return true;
  } catch (e) {
    return false;
  }
}

function clipboard_has_text() {
  const result = child_process.execSync('powershell.exe -Command "Get-Clipboard"');
  return result.toString().length > 0;
}

function clipboard_get_text() {
  const result = child_process.execSync('powershell.exe -Command "Get-Clipboard"');
  return result.toString();
}

function clipboard_set_text(str) {
  child_process.execSync('powershell.exe -Command "Set-Clipboard -Value \'' + str + '\'"');
}

function url_open(url) {
  child_process.exec('start "' + url + '"');
}

// end interop

if (args['b'] || args['build']) {
  const builderContents = readFileSync(path.join(__dirname, 'builder.js'), 'utf-8');
  const output = `const __code_is_compiled = true;\nconst __interopRaw = "${interopContents.replace(/(\n)|(\r\n)|(\r)/g, '\\n')}";\nconst __gmlRaw = \`${gmlContents.replace(/(\n)|(\r\n)|(\r)/g, '\\n')}\`;\n${builderContents}`;

  const fname = path.join(process.cwd(), 'temp.js');
  writeFileSync(fname, output, 'utf-8');
  const outName = args['b'] || args['build'];
  let exeName = `${(!outName || outName === true) ? `gml_${Date.now()}` : outName}`;
  if (!exeName.toLowerCase().endsWith('.exe')) exeName += '.exe';
  const fullOut = path.join(process.cwd(), exeName);
  exec([fname, '--output', fullOut, '-t', 'node18-win-x64']).finally(() => {
    unlinkSync(fname);
  });
} else {
  eval(`${interopContents}\n${gmlContents}`);
}