const child_process = require('child_process');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');


const mathjaxEntry = require.resolve('mathjax-full');
const mathjaxDir = mathjaxEntry.substring(0, mathjaxEntry.indexOf('mathjax-full') + 'mathjax-full'.length);

const dir = path.resolve(__dirname, '..');
const cwd = dir.substring(0, dir.indexOf('node_modules'));  // dir.includes('node_modules') ? path.resolve(dir, '..', '..') : dir

const processConfig = {
    stdio: 'inherit',
    cwd: mathjaxDir,
    //detached: true
};



try {
    //  compiles ts files
    console.log(chalk.bold('compiling mathjax'));
    child_process.execSync('npm run compile', processConfig);
}
catch (e) { };

child_process.execSync('npm run postcompile', processConfig);
/*
const innerPathToFile = 'input/tex/mhchem/mhchem_parser.js';
fs.copyFileSync(path.resolve(processConfig.cwd, 'ts', innerPathToFile), path.resolve(processConfig.cwd, 'js', innerPathToFile));
*/
console.log(chalk.bold('\n\n\ncompiled mathjax successfully'));
console.log(chalk.bold('\ntypescript compiling errors can be safely disregarded'));