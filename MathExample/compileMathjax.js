const child_process = require('child_process');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');

const processConfig = {
    stdio: 'inherit',
    cwd: __dirname
};

const innerPathToFile = 'input/tex/mhchem/mhchem_parser.js';
const pathToModule = 'node_modules/mathjax-full';

try {
    child_process.execSync('cd node_modules/mathjax-full && npm run compile', processConfig);
}
catch (e) { };
//child_process.execSync('cd node_modules/mathjax-full && npm run postcompile', processConfig);
fs.copyFileSync(path.resolve(__dirname, pathToModule, 'ts', innerPathToFile), path.resolve(__dirname, pathToModule, 'js', innerPathToFile));

console.log(chalk.bold('compiled mathjax successfully'));