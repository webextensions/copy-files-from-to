#!/usr/bin/env node

var chalk = require('chalk'),
    path = require('path');

var readListFromFile = null;

if (!module.parent) {
    readListFromFile = process.argv[2];
    if (!readListFromFile) {
        console.log(chalk.red('\nError: Not enough arguments. Exiting with code 1.\n'));

        console.log('Format:   copy-files-from-to <instructions-file> <custom-mode-name>');
        console.log('Examples: copy-files-from-to test/data/scripts-to-copy.json');
        console.log('          copy-files-from-to test/data/scripts-to-copy.json prod');
        console.log('          copy-files-from-to /var/www/rules.json dev');
        console.log('');

        process.exit(1);
    }
} else {
    console.log(chalk.blue('Please run this module (copy-files-from-to) from its binary file.') + chalk.yellow(' Warning: Exiting without error (code 0).'));
    process.exit(0);
}

var cpFile = require('cp-file'),
    fs = require('fs');

var sourceFile,
    sourceFileDirectory;

var pwd = process.env.PWD;

if (readListFromFile.indexOf('/') === 0) {
    sourceFile = readListFromFile;
} else {
    sourceFile = pwd + '/' + readListFromFile;
}
sourceFileDirectory = path.dirname(sourceFile);

var jsonText = fs.readFileSync(sourceFile, 'utf8'),
    filesToCopy = JSON.parse(jsonText);

var mode = process.argv[3];

var errorsCaught = 0;

filesToCopy = filesToCopy.map(function (fileToCopy) {
    var mappedObject = {};
    try {
        mappedObject.from = path.join(sourceFileDirectory, fileToCopy.from[mode] || fileToCopy.from['default'] || fileToCopy.from);
        mappedObject.to = path.join(sourceFileDirectory, fileToCopy.to);
    } catch (e) {
        errorsCaught++;
        console.log(chalk.red('Something is wrong in the structure of list of files to copy.'));
        console.log(chalk.yellow('Please make sure that the following instruction is correct, has default mode and handles the modes you expect it to run with:'));
        console.log(chalk.yellow('    ' + JSON.stringify(fileToCopy, null, '    ').replace(/\n/g, '\n    ')));
        return null;
    }

    return mappedObject;
});

var getRelativePath = function (fullPath) {
    return path.relative(pwd, fullPath);
};

if (filesToCopy.length) {
    console.log(chalk.blue('Starting copy operation in ' + (mode ? '"' + mode + '"' : 'default') + ' mode:') + chalk.yellow(' (overwrite option is on)'));
    filesToCopy.forEach(function (fileToCopy) {
        if (fileToCopy) {
            process.stdout.write('Copying ' + chalk.gray(getRelativePath(fileToCopy.from)) + ' to ' + chalk.gray(getRelativePath(fileToCopy.to)));
            try {
                cpFile.sync(fileToCopy.from, fileToCopy.to, {overwrite: true});
                process.stdout.write(chalk.green(' ✓') + '\n');
            } catch (e) {
                errorsCaught++;
                process.stdout.write(chalk.red(' ✗') + '\n');
            }
        }
    });
} else {
    console.log(chalk.yellow('No instructions provided for copy operation.'));
}

if (errorsCaught) {
    if (errorsCaught === 1) {
        console.log(chalk.red('\nCaught ' + errorsCaught + ' error. Please check.'));
    } else {
        console.log(chalk.red('\nCaught ' + errorsCaught + ' errors. Please check.'));
    }
    process.exit(1);
}
