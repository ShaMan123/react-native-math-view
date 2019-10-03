#!/usr/bin / env node
const child_process = require('child_process');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('lodash');
const argv = require('yargs').argv;

const processConfig = {
    cwd: process.cwd() //path.resolve(__dirname, '..')
};

function runCommand(command, procConfig = processConfig) {
    if (process.platform === 'darwin') {
        return child_process.spawnSync('open', [command], procConfig);

    } else if (process.platform === 'linux') {
        return child_process.spawn('sh', [command], _.defaultsDeep(procConfig, { detached: true }));

    } else if (/^win/.test(process.platform)) {
        return child_process.spawn('cmd.exe', ['/C', command], _.defaultsDeep(procConfig, { detached: true, stdio: 'ignore' }));
    } else {
        console.log(chalk.red(`Cannot start the packager. Unknown platform ${process.platform}`));
    }
}

function tsc() {
    const cmd = 'tsc --watch';
    fs.emptyDirSync(path.resolve(processConfig.cwd, 'dist'));
    return runCommand(cmd);
}

function start() {
    const cmd = 'npm start';
    runCommand(cmd, _.assign(processConfig, { detached: false, stdio: 'inherit' }));
}

function dev() {
    tsc();
    setTimeout(start, 1000);
}

if (argv.tsc) tsc();
else dev();