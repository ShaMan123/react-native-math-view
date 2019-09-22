const child_process = require('child_process');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');

const procConfig = {
    cwd: path.resolve(__dirname, '..')
};

const start = 'cd MathExample && npm start';
const tsc = 'tsc --watch';

if (process.platform === 'darwin') {
    child_process.spawnSync('open', [tsc], procConfig);
    child_process.spawnSync('open', [start], procConfig);

} else if (process.platform === 'linux') {
    procConfig.detached = true;
    child_process.spawn('sh', [tsc], procConfig);
    child_process.spawn('sh', [start], procConfig);

} else if (/^win/.test(process.platform)) {
    procConfig.detached = true;
    procConfig.stdio = 'ignore';
    child_process.spawn('cmd.exe', ['/C', tsc], procConfig);
    child_process.spawn('cmd.exe', ['/C', start], procConfig);
    
} else {
    console.log(chalk.red(`Cannot start the packager. Unknown platform ${process.platform}`));
}