#!/usr/bin/env node

var path = require('path'),
    fs = require('fs');

var packageJson = require('./package.json');

var chalk = require('chalk'),
    async = require('async'),
    request = require('request'),
    UglifyJS = require('uglify-js');

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

var sourceFile,
    sourceFileDirectory;

var pwd = process.cwd();

if (readListFromFile.indexOf('/') === 0 || readListFromFile.indexOf('\\') === 0) {
    sourceFile = readListFromFile;
} else {
    sourceFile = path.resolve(pwd, readListFromFile);
}
sourceFileDirectory = path.dirname(sourceFile);

var jsonText;
try {
    jsonText = fs.readFileSync(sourceFile, 'utf8');

    console.log(chalk.blue('Reading copy instructions from JSON file ' + sourceFile));
} catch (e) {
    exitWithError(e, 'Error in reading file: ' + sourceFile);
}

var filesToCopy = {},
    settings = {};
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
    var from = null,
        uglify = null;
    if (typeof fileToCopy.from === 'string') {
        from = fileToCopy.from;
    } else {
        var fromMode = fileToCopy.from[mode] || fileToCopy.from['default'] || {};
        from = fromMode.src;
        uglify = fromMode.uglify;
    }

    var to = null;
    if (typeof fileToCopy.to === 'string') {
        to = fileToCopy.to;
    } else {
        var toMode = fileToCopy.to[mode] || fileToCopy.to['default'] || {};
        to = toMode.dest;
    }

    if (typeof from === 'string' && typeof to === 'string') {
        return {
            intendedFrom: from,
            intendedTo: to,
            latestVersion: fileToCopy.latestVersion,
            from: (function () {
                if (from.indexOf('http://') === 0 || from.indexOf('https://') === 0) {
                    return from;
                }
                return path.join(sourceFileDirectory, from);
            }()),
            to: path.join(sourceFileDirectory, to),
            uglify: uglify
        };
    } else {
        errorsCaught++;
        if (errorsCaught === 1) {   // Show this only once
            console.log(chalk.red('Something is wrong in the structure of list of files to copy.'));
        }
        console.log('');
        if (typeof from !== 'string') {
            console.log(chalk.yellow('    Please make sure that the value for "from" is a string OR "from.default.src" exists OR handles the "from.<mode>.src" you expect it to run with.'));
        }
        if (typeof to !== 'string') {
            console.log(chalk.yellow('    Please make sure that the value for "to" is a string OR "to.default.dest" exists OR handles the "to.<mode>.dest" you expect it to run with.'));
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

var readContents = function (fileToCopy, cb) {
    var source = fileToCopy.from;
    if (source.indexOf('http://') === 0 || source.indexOf('https://') === 0) {
        request(source, function (err, response, body) {
            if (response.statusCode === 200) {
                cb(null, body);
            } else {
                cb(err);
            }
        });
    } else {
        var contents = fs.readFileSync(source, 'utf8');
        cb(null, contents);
    }
};

var mkdirp = require('mkdirp');
var checkFolderExist = function(folderPath) {
    if (!fs.existsSync(folderPath)) {
        mkdirp(path.dirname(folderPath), function (error) {
            console.error("Could not create directory", error);
        });
    }
};

var writeContents = function (fileToCopy, options, cb) {
    var to = fileToCopy.to,
        intendedFrom = fileToCopy.intendedFrom;
    var contents = options.contents,
        uglified = options.uglified;

    checkFolderExist();
    fs.writeFileSync(to, contents);
    if (settings.addLinkToSourceOfOrigin) {
        var sourceDetails = intendedFrom;
        if (uglified) {
            sourceDetails += (uglified.uglifyCommand || '');
        }
        fs.writeFileSync(to + '.source.txt', sourceDetails);
    }
    cb();
};

var checkForLatestVersion = function (fileToCopy, originalContents, cb) {
    var latestVersion = fileToCopy.latestVersion;
    if (latestVersion) {
        request(latestVersion, function (errLatest, responseLatest, bodyLatest) {
            if (responseLatest.statusCode === 200) {
                if (bodyLatest !== originalContents) {
                    cb(chalk.yellow(' (updates available)'));
                } else {
                    cb(chalk.green(' (up to date)'));
                }
            } else {
                cb(chalk.yellow(' (but couldn\'t compare it with latest version)'));
            }
        });
    } else {
        cb();
    }
};

var doUglify = function (needsUglify, code, cb) {
    if (needsUglify) {
        var result = UglifyJS.minify(
            code,
            // Equivalent to: uglifyjs <source> --compress sequences=false --beautify beautify=false,semicolons=false,comments=some --output <destination>
            {
                compress: {
                    sequences: false
                },
                mangle: false,
                output: {
                    semicolons: false,
                    comments: 'some'
                }
            }
        );
        cb(result.code);
    } else {
        cb(code);
    }
};

var preWriteOperations = function (fileToCopy, contents, cb) {
    var needsUglify = fileToCopy.uglify;
    doUglify(needsUglify, contents, function (processedCode) {
        if (needsUglify) {
            cb({
                contentsAfterPreWriteOperations: processedCode,
                uglified: {
                    uglifyCommand:
                        '\n' +
                        '\n' +
                        '$ uglifyjs <source> --compress sequences=false --beautify beautify=false,semicolons=false,comments=some --output <destination>' +
                        '\n' +
                        '\nWhere:' +
                        '\n    uglifyjs = npm install -g uglify-js@' + packageJson.dependencies['uglify-js'] +
                        '\n    <source> = File ' + fileToCopy.intendedFrom +
                        '\n    <destination> = File ./' + path.basename(fileToCopy.intendedTo)
                }
            });
        } else {
            cb({
                contentsAfterPreWriteOperations: processedCode
            });
        }
    });
};

var postWriteOperations = function (fileToCopy, originalContents, contentsAfterPreWriteOperations, cb) {
    checkForLatestVersion(fileToCopy, originalContents, function (status) {
        cb(status);
    });
};

function copyFile (fileToCopy, cb) {
    var from = fileToCopy.from,
        to = fileToCopy.to;

    var strFromTo = chalk.gray(getRelativePath(from)) + ' to ' + chalk.gray(getRelativePath(to));
    var successMessage = chalk.green(' ✓') + ' Copied ' + strFromTo,
        errorMessage = chalk.red(' ✗') + ' Failed to copy ' + strFromTo;

    readContents(fileToCopy, function (err, originalContents) {
        if (err) {
            errorsCaught++;
            console.log(errorMessage);
            return;
        }

        preWriteOperations(fileToCopy, originalContents, function (options) {
            var contentsAfterPreWriteOperations = options.contentsAfterPreWriteOperations,
                uglified = options.uglified;
            writeContents(
                fileToCopy,
                {
                    contents: contentsAfterPreWriteOperations,
                    uglified: uglified
                },
                function () {
                    postWriteOperations(fileToCopy, originalContents, contentsAfterPreWriteOperations, function (appendToSuccessMessage) {
                        console.log(successMessage + (appendToSuccessMessage || ''));
                        cb();
                    });
                }
            );
        });
    });
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
    console.log(chalk.blue('\nStarting copy operation in "' + (mode || 'default') + '" mode:') + chalk.yellow(' (overwrite option is on)'));

    async.eachLimit(
        filesToCopy,
        8,
        function (fileToCopy, callback) {
            copyFile(fileToCopy, function () {
                callback();
            });
        },
        done
    );
} else {
    console.log(chalk.yellow('No instructions provided for copy operation.'));
}
