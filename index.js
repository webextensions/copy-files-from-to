#!/usr/bin/env node

var path = require('path');

var chalk = require('chalk'),
    async = require('async'),
    request = require('request');

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

var exitWithError = function (e, errMsg) {
    if (errMsg) {
        console.log(chalk.magenta(errMsg));
    }
    if (e) {
        console.log(chalk.red(e));
    }
    process.exit(1);
};

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

var jsonText;
try {
    jsonText = fs.readFileSync(sourceFile, 'utf8');

    console.log(chalk.blue('Reading copy instructions from JSON file ' + sourceFile));
} catch (e) {
    exitWithError(e, 'Error in reading file: ' + sourceFile);
}

var filesToCopy = {};
var settings = {};
try {
    var jsonData = JSON.parse(jsonText);
    filesToCopy = jsonData.filesToCopy;
    settings = jsonData.settings;
} catch (e) {
    exitWithError(e, 'Invalid JSON data:\n    ' + jsonText.replace(/\n/g, '\n    '));
}

var mode = process.argv[3];

var errorsCaught = 0;

filesToCopy = filesToCopy.map(function (fileToCopy) {
    var from = fileToCopy.from[mode] || fileToCopy.from['default'] || fileToCopy.from,
        to = fileToCopy.to[mode] || fileToCopy.to['default'] || fileToCopy.to;
    if (typeof from === 'string' && typeof to === 'string') {
        return {
            originalFrom: from,
            latestVersion: fileToCopy.latestVersion,
            from: (function () {
                if (from.indexOf('http://') === 0 || from.indexOf('https://') === 0) {
                    return from;
                }
                return path.join(sourceFileDirectory, from);
            }()),
            to: path.join(sourceFileDirectory, to)
        };
    } else {
        errorsCaught++;
        if (errorsCaught === 1) {   // Show this only once
            console.log(chalk.red('Something is wrong in the structure of list of files to copy.'));
        }
        console.log('');
        if (typeof from !== 'string') {
            console.log(chalk.yellow('    Please make sure that the value for "from" is a string OR "from.default" exists OR handles the "from.<mode>" you expect it to run with.'));
        }
        if (typeof to !== 'string') {
            console.log(chalk.yellow('    Please make sure that the value for "to" is a string OR "to.default" exists OR handles the "to.<mode>" you expect it to run with.'));
        }
        console.log(chalk.yellow('    ' + JSON.stringify(fileToCopy, null, '    ').replace(/\n/g, '\n    ')));
        return null;
    }
});

var getRelativePath = function (fullPath) {
    if (fullPath.indexOf('http://') === 0 || fullPath.indexOf('https://') === 0) {
        return fullPath;
    }
    return path.relative(pwd, fullPath);
};

function writeFile (fileToCopy, cb) {
    var originalFrom = fileToCopy.originalFrom,
        latestVersion = fileToCopy.latestVersion,
        from = fileToCopy.from,
        to = fileToCopy.to;
    var strFromTo = chalk.gray(getRelativePath(from)) + ' to ' + chalk.gray(getRelativePath(to)),
        successMessage = chalk.green(' ✓') + ' Copied ' + strFromTo,
        errorMessage = chalk.red(' ✗') + ' Failed to copy ' + strFromTo;
    if (from.indexOf('http://') === 0 || from.indexOf('https://') === 0) {
        request(from, function (err, response, body) {
            if (response.statusCode === 200) {
                fs.writeFileSync(to, body);
                if (settings.addLinkToSourceOfOrigin) {
                    fs.writeFileSync(to + '.source.txt', originalFrom);
                }
                if (latestVersion) {
                    request(latestVersion, function (errLatest, responseLatest, bodyLatest) {
                        if (responseLatest.statusCode === 200) {
                            if (bodyLatest !== body) {
                                console.log(successMessage + chalk.yellow(' (updates available)'));
                            } else {
                                console.log(successMessage + chalk.green(' (up to date)'));
                            }
                        } else {
                            console.log(successMessage + chalk.yellow(' (but couldn\'t compare it with latest version)'));
                        }
                    });
                } else {
                    console.log(successMessage);
                }
            } else {
                errorsCaught++;
                console.log(errorMessage);
            }
            cb();
        });
    } else {
        try {
            cpFile.sync(from, to, {overwrite: true});
            if (settings.addLinkToSourceOfOrigin) {
                fs.writeFileSync(to + '.source.txt', originalFrom);
            }
            console.log(successMessage);
        } catch (e) {
            errorsCaught++;
            console.log(errorMessage);
        }
        cb();
    }
    return true;
}

var done = function () {
    if (errorsCaught) {
        if (errorsCaught === 1) {
            console.log(chalk.red('\nCaught ' + errorsCaught + ' error. Please check.'));
        } else {
            console.log(chalk.red('\nCaught ' + errorsCaught + ' errors. Please check.'));
        }
        process.exit(1);
    }
};

if (filesToCopy.length) {
    console.log(chalk.blue('\nStarting copy operation in ' + (mode ? '"' + mode + '"' : 'default') + ' mode:') + chalk.yellow(' (overwrite option is on)'));

    async.eachLimit(
        filesToCopy,
        8,
        function (fileToCopy, callback) {
            writeFile(fileToCopy, function () {
                callback();
            });
        },
        done
    );
} else {
    console.log(chalk.yellow('No instructions provided for copy operation.'));
}
