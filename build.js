const { exec } = require('pkg');

exec(['./src/index.js', '-c', './pkg.json', '--output', './bin/gml.exe'])