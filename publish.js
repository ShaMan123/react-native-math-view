/* tslint:disable: no-console */
const { execSync } = require('child_process');
const semver = require('semver');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const yargs = require('yargs');
const argv = yargs.argv;

// Workaround JS
const isRelease = true;

const ONLY_ON_BRANCH = 'origin/master';
const VERSION_TAG = isRelease ? 'latest' : 'snapshot';
const VERSION_INC = _.defaultTo(argv._.shift(), 'patch');

function run() {
    /*
    if (!validateEnv()) {
        return;
    }
    */
    //setupGit();
    //

    //createNpmRc();
    versionTagAndPublish();
}

function validateEnv() {
    if (!process.env.JENKINS_CI) {
        throw new Error(`releasing is only available from CI`);
    }

    if (!process.env.JENKINS_MASTER) {
        console.log(`not publishing on a different build`);
        return false;
    }

    if (process.env.GIT_BRANCH !== ONLY_ON_BRANCH) {
        console.log(`not publishing on branch ${process.env.GIT_BRANCH}`);
        return false;
    }

    return true;
}

function setupGit() {
    execSync(`git config --global push.default simple`);
    execSync(`git config --global user.email "${process.env.GIT_EMAIL}"`);
    execSync(`git config --global user.name "${process.env.GIT_USER}"`);
    const remoteUrl = new RegExp(`https?://(\\S+)`).exec(execSync(`git remote -v`))[1];
    execSync(`git remote add deploy "https://${process.env.GIT_USER}:${process.env.GIT_TOKEN}@${remoteUrl}"`);
    // execSync(`git checkout ${ONLY_ON_BRANCH}`);
}

function createNpmRc() {
    fs.existsSync(`package-lock.json`) && fs.unlinkSync(`package-lock.json`);
    
    const content = `
email=\${NPM_EMAIL}
//registry.npmjs.org/:_authToken=\${NPM_TOKEN}
`;
    fs.writeFileSync(`.npmrc`, content);
}

function versionTagAndPublish() {
    const packageVersion = semver.clean(process.env.npm_package_version);
    console.log(`package version: ${packageVersion}`);

    const currentPublished = findCurrentPublishedVersion();
    console.log(`current published version: ${currentPublished}`);

    const latest = semver.gt(packageVersion, currentPublished) ? packageVersion : currentPublished;
    const version = semver.inc(latest, VERSION_INC);

    console.log(`Publishing version: ${version}`);

    tryPublishAndTag(version);
}


function findCurrentPublishedVersion() {
    return execSync(`npm view ${process.env.npm_package_name} dist-tags.latest`, { env: process.env }).toString();
}

function getCurrentBranchName() {
    return execSync(`git rev-parse --abbrev-ref HEAD`).toString();
}

function tryPublishAndTag(version) {
    let theCandidate = version;
    for (let retry = 0; retry < 5; retry++) {
        try {
            tagAndPublish(theCandidate);
            console.log(`Released ${theCandidate}`);
            return;
        } catch (err) {
            const alreadyPublished = _.includes(err.toString(), 'You cannot publish over the previously published version');
            if (!alreadyPublished) {
                throw err;
            }
            console.log(`previously published. retrying with increased ${VERSION_INC}...`);
            theCandidate = semver.inc(theCandidate, VERSION_INC);
        }
    }
}

function tagAndPublish(newVersion) {
    const packageJson = readPackageJson();
    console.log(`trying to publish ${newVersion}...`);
    execSync(`npm --no-git-tag-version version ${newVersion}`);
    execSync(`npm publish --tag ${VERSION_TAG} ${_.defaultTo(argv.verbose, false) ? '--verbose' : ''}`, { stdio: [process.stdin, process.stdout, process.stderr] });
    execSync(`git tag -a ${newVersion} -m "${newVersion}"`);
    execSync(`git push ${packageJson.repository.url} ${getCurrentBranchName()} ${newVersion}`);
    if (isRelease) {
        updatePackageJsonGit(newVersion);
    }
}

function getPackageJsonPath() {
    return `${process.cwd()}/package.json`;
}

function writePackageJson(packageJson) {
    fs.writeFileSync(getPackageJsonPath(), JSON.stringify(packageJson, null, 2));
}

function readPackageJson() {
    return JSON.parse(fs.readFileSync(getPackageJsonPath()));
}

function updatePackageJsonGit(version) {
    execSync(`git checkout master`);
    const packageJson = readPackageJson();
    packageJson.version = version;
    writePackageJson(packageJson);
    execSync(`git add package.json`);
    execSync(`git commit -m"Update package.json version to ${version}"`);
    execSync(`git push ${packageJson.repository.url} ${getCurrentBranchName()}`);
}

run();
