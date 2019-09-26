const child_process = require('child_process');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('lodash');
//const yargs = require('yargs');

const processConfig = {
    cwd: path.resolve(__dirname, '..')
};

const start = 'npm start';
const tsc = 'tsc --watch';

fs.emptyDirSync(path.resolve(processConfig.cwd, 'dist'));
runCommand(tsc);
runCommand(start, _.assign(processConfig, { detached: false, stdio: 'inherit' }));

function runCommand(command, procConfig = processConfig) {
    if (process.platform === 'darwin') {
        child_process.spawnSync('open', [command], procConfig);

    } else if (process.platform === 'linux') {
        child_process.spawn('sh', [command], _.defaultsDeep(procConfig, { detached: true }));

    } else if (/^win/.test(process.platform)) {
        child_process.spawn('cmd.exe', ['/C', command], _.defaultsDeep(procConfig, { detached: true, stdio: 'ignore' }));

    } else {
        console.log(chalk.red(`Cannot start the packager. Unknown platform ${process.platform}`));
    }
}

