const child_process = require('node:child_process');

const interopContents = __interopRaw;
const gmlContents = __gmlRaw;

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

eval(`${interopContents}\n${gmlContents}`);
