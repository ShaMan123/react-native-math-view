const child_process = require('child_process');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');

const dir = path.resolve(__dirname, '..');
const cwd = dir.substring(0, dir.indexOf('node_modules'));  // dir.includes('node_modules') ? path.resolve(dir, '..', '..') : dir

const processConfig = {
    stdio: 'inherit',
    cwd
};

const innerPathToFile = 'input/tex/mhchem/mhchem_parser.js';
const pathToModule = 'node_modules/mathjax-full';

try {
    child_process.execSync('cd node_modules/mathjax-full && npm run compile', processConfig);
}
catch (e) { };
//child_process.execSync('cd node_modules/mathjax-full && npm run postcompile', processConfig);
fs.copyFileSync(path.resolve(processConfig.cwd, pathToModule, 'ts', innerPathToFile), path.resolve(processConfig.cwd, pathToModule, 'js', innerPathToFile));

console.log(chalk.bold('compiled mathjax successfully'));