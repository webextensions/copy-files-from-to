#!/usr/bin/env node

var path = require('path'),
    fs = require('fs');

var async = require('async'),
    request = require('request'),
    mkdirp = require('mkdirp'),
    cjson = require('cjson'),
    _ = require('lodash'),
    UglifyJS = require('uglify-js');

var logger = require('note-down');
logger.removeOption('showLogLine');

var chalk = logger.chalk;

var argv = require('yargs')
    .help(false)
    .version(false)
    .argv;

var packageJson = require('./package.json');

var nodeVersion = process.versions.node;

var paramHelp = argv.h || argv.help,
    paramVersion = argv.v || argv.version,
    paramVerbose = argv.verbose,
    paramOutdated = argv.outdated,
    paramWhenFileExists = argv.whenFileExists;

var cwd = process.cwd();

var utils = {
    isRemoteResource: function (resourcePath) {
        if (
            resourcePath.indexOf('https://') === 0 ||
            resourcePath.indexOf('http://') === 0 ||
            resourcePath.indexOf('ftp://') === 0
        ) {
            return true;
        }
        return false;
    },
    getRelativePath: function (wrt, fullPath) {
        if (utils.isRemoteResource(fullPath)) {
            return fullPath;
        }
        return path.relative(wrt, fullPath);
    },

    exitWithError: function (e, errMsg) {
        if (errMsg) {
            logger.log(chalk.magenta(errMsg));
        }
        if (e) {
            logger.error(e);
        }
        process.exit(1);
    },

    // Returns true/false/<defaultValue>
    booleanIntention: function (val, defaultValue) {
        if (val === undefined) {
            return defaultValue;
        } else {
            return !!val;
        }
    },

    ensureDirectoryExistence: function(dirPath) {
        var dirname = path.dirname(dirPath);
        if (!fs.existsSync(dirPath)) {
            try {
                mkdirp.sync(dirname);
            } catch (e) {
                logger.error('\n' + chalk.bold.underline('Error:'));
                logger.error('Unable to create directory ' + dirname);

                logger.error('\n' + chalk.bold.underline('Error details:'));
                logger.error(e);

                process.exit(1);
            }
        }
    },

    doUglify: function (needsUglify, code, cb) {
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
            var consoleCommand = 'uglifyjs <source> --compress sequences=false --beautify beautify=false,semicolons=false,comments=some --output <destination>';
            cb(result.code, consoleCommand);
        } else {
            cb(code, null);
        }
    },

    readContents: function (sourceFullPath, cb) {
        if (utils.isRemoteResource(sourceFullPath)) {
            request(
                {
                    uri: sourceFullPath,
                    gzip: true,
                    timeout: 30000
                },
                function (err, response, body) {
                    if (err) {
                        cb(err);
                    } else {
                        if (response.statusCode === 200) {
                            cb(null, body);
                        } else {
                            cb('Unexpected statusCode (' + response.statusCode + ') for response of: ' + sourceFullPath);
                        }
                    }
                }
            );
        } else {
            try {
                var contents = fs.readFileSync(sourceFullPath, 'utf8');
                cb(null, contents);
            } catch (e) {
                cb(e);
            }
        }
    }
};

if (module.parent) {
    // Just show a warning and do not exit the process since a basic mocha test checks for the sanity of the code of this file
    logger.warn('\nWarning: Please run this module (' + packageJson.name + ') from its binary file.' + '\n');
} else {
    var showHelp = function () {
        logger.log([
            '',
            chalk.bold('Usage:'),
            '  copy-files-from-to [--config <config-file>] [--mode <mode-name>] [...]',
            '',
            chalk.bold('Examples:'),
            '  copy-files-from-to',
            '  copy-files-from-to --config copy-files-from-to.json',
            '  copy-files-from-to --mode production',
            '  copy-files-from-to -h',
            '  copy-files-from-to --version',
            '',
            chalk.bold('Options:'),
            '     --config <config-file-path>     Path to configuration file',
            '                                     When unspecified, it looks for copy-files-from-to.cjson / copy-files-from-to.json',
            '     --mode <mode-name>              Mode to use for copying the files',
            '                                     When unspecified, it uses "default" mode',
            '     --when-file-exists <operation>  Override "whenFileExists" setting specified in configuration file',
            '                                     <operation> can be "notify-about-available-change" or "overwrite" or "do-nothing"',
            '     --outdated                      Notify about outdated parts of the configuration file',
            '                                     (takes cue from "latest" property, wherever specified)',
            '     --verbose                       Verbose logging',
            '  -v --version                       Output the version number',
            '  -h --help                          Show help',
            ''
        ].join('\n'));
    };

    if (paramHelp) {
        showHelp();
        process.exit(0);
    }

    if (paramVersion || paramVerbose) {
        logger.log(packageJson.name + ' version: ' + packageJson.version);
        logger.log('Node JS version: ' + nodeVersion);
        if (paramVersion) {
            process.exit(0);
        }
    }

    var configFile = null;

    configFile = argv.config;
    if (!configFile) {
        if (fs.existsSync(path.resolve(cwd, 'copy-files-from-to.cjson'))) {
            configFile = 'copy-files-from-to.cjson';
        } else if (fs.existsSync(path.resolve(cwd, 'copy-files-from-to.json'))) {
            configFile = 'copy-files-from-to.json';
        } else {
            logger.error(
                '\n' +
                chalk.bold('Error:') + ' Please ensure that you have passed correct arguments. Exiting with error (code 1).'
            );
            showHelp();
            process.exit(1);
        }
    }

    var configFileSource,
        configFileSourceDirectory;

    if (configFile.indexOf('/') === 0 || configFile.indexOf('\\') === 0) { // readListFromFile has an absolute path
        configFileSource = configFile;
    } else { // readListFromFile has a relative path
        configFileSource = path.resolve(cwd, configFile);
    }
    configFileSourceDirectory = path.dirname(configFileSource);

    var cjsonText;
    try {
        logger.info('Reading copy instructions from file ' + utils.getRelativePath(cwd, configFileSource));
        cjsonText = fs.readFileSync(configFileSource, 'utf8');
    } catch (e) {
        utils.exitWithError(e, 'Error in reading file: ' + configFileSource);
    }

    var copyFiles = [],
        settings = {};
    try {
        var cjsonData = cjson.parse(cjsonText);
        if (cjsonData instanceof Object) {
            if (Array.isArray(cjsonData.copyFiles)) {
                copyFiles = cjsonData.copyFiles;
            }
            if (cjsonData.settings instanceof Object) {
                settings = cjsonData.settings;
            }
        }
    } catch (e) {
        utils.exitWithError(e, 'Invalid (C)JSON data:\n    ' + cjsonText.replace(/\n/g, '\n    '));
    }

    // ".only" is useful for debugging (This feature is not mentioned in documentation)
    copyFiles = (function (copyFiles) {
        var copyFilesWithOnly = [];

        copyFiles.forEach(function (copyFile) {
            if (copyFile.only) {
                copyFilesWithOnly.push(copyFile);
            }
        });

        if (copyFilesWithOnly.length) {
            return copyFilesWithOnly;
        } else {
            return copyFiles;
        }
    }(copyFiles));

    if (paramOutdated) {
        var arrFromAndLatest = [];

        for (var i = 0; i < copyFiles.length; i++) {
            let copyFile = copyFiles[i];
            let from = copyFile.from;
            if (from && typeof from === 'object') {
                let modes = Object.keys(from);
                for (let i = 0; i < modes.length; i++) {
                    let mode = modes[i],
                        fromMode = from[mode];
                    if (fromMode.src && fromMode.latest) {
                        var ob = {
                            src: fromMode.src,
                            latest: fromMode.latest
                        };
                        arrFromAndLatest.push(ob);
                    }
                }
            }
        }

        if (paramVerbose) {
            logger.verbose('Need to check for updates for the following entries:');
            logger.verbose(JSON.stringify(arrFromAndLatest, null, '    '));
        }

        var compareSrcAndLatest = function (arrSrcAndLatest) {
            async.eachLimit(
                arrSrcAndLatest,
                8,
                function (srcAndLatest, callback) {
                    var resourceSrc = srcAndLatest.src,
                        resourceSrcContents = null;
                    var resourceLatest = srcAndLatest.latest,
                        resourceLatestContents = null;

                    async.parallel(
                        [
                            function (cb) {
                                utils.readContents(resourceSrc, function (err, contents) {
                                    if (err) {
                                        logger.error(' ✗ Could not read: ' + resourceSrc);
                                    } else {
                                        resourceSrcContents = contents;
                                    }
                                    cb();
                                });
                            },
                            function (cb) {
                                utils.readContents(resourceLatest, function (err, contents) {
                                    if (err) {
                                        logger.error(' ✗ (Could not read) ' + chalk.gray(resourceLatest));
                                    } else {
                                        resourceLatestContents = contents;
                                    }
                                    cb();
                                });
                            }
                        ],
                        function () {
                            if (resourceSrcContents !== null && resourceLatestContents !== null) {
                                if (resourceSrcContents === resourceLatestContents) {
                                    logger.success(' ✓' + chalk.gray(' (Up to date) ' + resourceSrc));
                                } else {
                                    logger.warn(' 🔃 ("src" is outdated w.r.t. "latest") ' + chalk.gray(resourceSrc));
                                }
                            }
                            callback();
                        }
                    );
                }
            );
        };

        if (arrFromAndLatest.length) {
            compareSrcAndLatest(arrFromAndLatest);
        } else {
            logger.warn('There are no "from" entries for which "from.<mode>.src" file needs to be compared with "from.<mode>.latest" file.');
        }
    } else {
        var WHEN_FILE_EXISTS_NOTIFY_ABOUT_AVAILABLE_CHANGE = 'notify-about-available-change',
            WHEN_FILE_EXISTS_OVERWRITE = 'overwrite',
            WHEN_FILE_EXISTS_DO_NOTHING = 'do-nothing',
            ARR_WHEN_FILE_EXISTS = [
                WHEN_FILE_EXISTS_NOTIFY_ABOUT_AVAILABLE_CHANGE,
                WHEN_FILE_EXISTS_OVERWRITE,
                WHEN_FILE_EXISTS_DO_NOTHING
            ];
        var whenFileExists = paramWhenFileExists;
        if (ARR_WHEN_FILE_EXISTS.indexOf(whenFileExists) === -1) {
            whenFileExists = settings.whenFileExists;
            if (ARR_WHEN_FILE_EXISTS.indexOf(whenFileExists) === -1) {
                whenFileExists = WHEN_FILE_EXISTS_DO_NOTHING;
            }
        }
        var overwriteIfFileAlreadyExists = (whenFileExists === WHEN_FILE_EXISTS_OVERWRITE),
            notifyAboutAvailableChange = (whenFileExists === WHEN_FILE_EXISTS_NOTIFY_ABOUT_AVAILABLE_CHANGE);

        var mode = argv.mode || 'default';

        var warningsEncountered = 0;

        copyFiles = copyFiles.map(function normalizeData(copyFile) {
            var latest = null;
            var from = null,
                skipFrom = null;
            if (typeof copyFile.from === 'string') {
                from = copyFile.from;
            } else {
                var fromMode = copyFile.from[mode] || copyFile.from['default'] || {};
                if (typeof fromMode === 'string') {
                    from = fromMode;
                } else {
                    from = fromMode.src;
                    skipFrom = !!fromMode.skip;
                    latest = fromMode.latest;
                }
            }

            var to = null,
                skipTo = null,
                uglify = null;
            if (typeof copyFile.to === 'string') {
                to = copyFile.to;
            } else {
                var toMode = copyFile.to[mode] || copyFile.to['default'] || {};
                if (typeof toMode === 'string') {
                    to = toMode;
                } else {
                    to = toMode.dest;
                    skipTo = !!toMode.skip;
                }

                if (typeof toMode === 'object' && toMode.uglifyJs !== undefined) {
                    uglify = utils.booleanIntention(toMode.uglifyJs, false);
                } else {
                    uglify = utils.booleanIntention(settings.uglifyJs, false);
                }
            }

            if (typeof from === 'string' && typeof to === 'string') {
                if (from.match(/\.js$/) || to.match(/\.js$/)) {
                    // If "from" or "to" path ends with ".js", that indicates that it is a JS file
                    // So, retain the uglify setting.
                    // It is a "do nothing" block
                } else {
                    // It does not seem to be a JS file. So, don't uglify it.
                    uglify = false;
                }

                return {
                    intendedFrom: from,
                    intendedTo: to,
                    latest: latest,
                    from: (function () {
                        if (utils.isRemoteResource(from)) {
                            return from;
                        }
                        return path.join(configFileSourceDirectory, from);
                    }()),
                    to: path.join(configFileSourceDirectory, to),
                    uglify: uglify
                };
            } else {
                if (
                    (typeof from !== 'string' && !skipFrom) ||
                    (typeof to !== 'string' && !skipTo)
                ) {
                    warningsEncountered++;
                    if (warningsEncountered === 1) {   // Show this only once
                        logger.log('');
                        logger.warn('Some entries will not be considered in the current mode (' + mode + ').');
                    }

                    logger.log('');

                    var applicableModesForSkip = _.uniq(['"default"', '"' + mode + '"']).join(' / ');
                    if (typeof from !== 'string' && !skipFrom) {
                        var fromValuesToCheck = _.uniq([
                            '"from"',
                            '"from.default"',
                            '"from.default.src"',
                            '"from.' + mode + '"',
                            '"from.' + mode + '.src"'
                        ]).join(' / ');
                        logger.warn('    Please ensure that the value for ' + fromValuesToCheck + ' is a string.');
                        logger.warn('    Otherwise, add ' + chalk.blue('"skip": true') + ' under "from" for mode: ' + applicableModesForSkip);
                    }
                    if (typeof to !== 'string' && !skipTo) {
                        var toValuesToCheck = _.uniq([
                            '"to"',
                            '"to.default"',
                            '"to.default.dest"',
                            '"to.' + mode + '"',
                            '"to.' + mode + '.dest"'
                        ]).join(' / ');
                        logger.warn('    Please ensure that the value for ' + toValuesToCheck + ' is a string.');
                        logger.warn('    Otherwise, add ' + chalk.blue('"skip": true') + ' under "to" for mode: ' + applicableModesForSkip);
                    }

                    logger.warn('    ' + JSON.stringify(copyFile, null, '    ').replace(/\n/g, '\n    '));
                }
            }
        });

        var writeContents = function (copyFile, options, cb) {
            var to = copyFile.to,
                intendedFrom = copyFile.intendedFrom;
            var contents = options.contents,
                uglified = options.uglified,
                overwriteIfFileAlreadyExists = options.overwriteIfFileAlreadyExists;

            utils.ensureDirectoryExistence(to);

            var fileExists = fs.existsSync(to),
                fileDoesNotExist = !fileExists;

            var avoidedFileOverwrite;
            if (
                fileDoesNotExist ||
                (fileExists && overwriteIfFileAlreadyExists)
            ) {
                try {
                    fs.writeFileSync(to, contents);
                } catch (e) {
                    cb(e);
                    return;
                }
                if (settings.addReferenceToSourceOfOrigin) {
                    var sourceDetails = intendedFrom;
                    if (uglified) {
                        sourceDetails += (uglified.uglifyCommand || '');
                    }

                    /*
                    TODO: Handle error scenario for this ".writeFileSync()" operation.
                          Not handling it yet because for all practical use-cases, if
                          the code has been able to write the "to" file, then it should
                          be able to write the "<to>.source.txt" file
                    */
                    fs.writeFileSync(to + '.source.txt', sourceDetails);
                }
                avoidedFileOverwrite = false;
            } else {
                avoidedFileOverwrite = true;
            }
            cb(null, avoidedFileOverwrite);
        };

        var checkForAvailableChange = function (copyFile, contentsOfFrom, config, cb) {
            var notifyAboutAvailableChange = config.notifyAboutAvailableChange;

            if (notifyAboutAvailableChange) {
                var to = copyFile.to;
                utils.readContents(to, function (err, contentsOfTo) {
                    if (err) {
                        cb(chalk.red(' (unable to read "to.<mode>.dest" file at path ' + to + ')'));
                        warningsEncountered++;
                    } else {
                        var needsUglify = copyFile.uglify;

                        utils.doUglify(needsUglify, contentsOfFrom, function (processedCode) {
                            if (processedCode === contentsOfTo) {
                                cb(chalk.gray(' (up to date)'));
                            } else {
                                cb(chalk.yellow(' (update is available)'));
                            }
                        });
                    }
                });
            } else {
                cb();
            }
        };

        var preWriteOperations = function (copyFile, contents, cb) {
            var needsUglify = copyFile.uglify;
            utils.doUglify(needsUglify, contents, function (processedCode, consoleCommand) {
                if (needsUglify) {
                    cb({
                        contentsAfterPreWriteOperations: processedCode,
                        uglified: {
                            uglifyCommand:
                                '\n' +
                                '\n' +
                                '$ ' + consoleCommand +
                                '\n' +
                                '\nWhere:' +
                                '\n    uglifyjs = npm install -g uglify-js@' + packageJson.dependencies['uglify-js'] +
                                '\n    <source> = File ' + copyFile.intendedFrom +
                                '\n    <destination> = File ./' + path.basename(copyFile.intendedTo)
                        }
                    });
                } else {
                    cb({
                        contentsAfterPreWriteOperations: processedCode
                    });
                }
            });
        };

        var postWriteOperations = function (copyFile, originalContents, contentsAfterPreWriteOperations, config, cb) {
            checkForAvailableChange(copyFile, originalContents, config, function (status) {
                cb(status);
            });
        };

        var doCopyFile = function (copyFile, cb) {
            var from = copyFile.from,
                to = copyFile.to;

            var printFrom = ' ' + chalk.gray(utils.getRelativePath(cwd, from)),
                printTo = ' ' + chalk.gray(utils.getRelativePath(cwd, to)),
                printFromTo = printFrom + ' to' + printTo;
            var successMessage = ' ' + chalk.green('✓') + ' Copied',
                successMessageAvoidedFileOverwrite = ' ' + chalk.green('✓') + chalk.gray(' Already exists'),
                errorMessageCouldNotReadFromSrc = ' ' + chalk.red('✗') + ' Could not read',
                errorMessageFailedToCopy = ' ' + chalk.red('✗') + ' Failed to copy';

            var destFileExists = fs.existsSync(to),
                destFileDoesNotExist = !destFileExists;
            if (
                destFileDoesNotExist ||
                (
                    destFileExists &&
                    (
                        overwriteIfFileAlreadyExists ||
                        notifyAboutAvailableChange
                    )
                )
            ) {
                utils.readContents(copyFile.from, function (err, contentsOfFrom) {
                    if (err) {
                        warningsEncountered++;
                        if (destFileExists && notifyAboutAvailableChange) {
                            logger.log(errorMessageCouldNotReadFromSrc + printFrom);
                        } else {
                            logger.log(errorMessageFailedToCopy + printFromTo);
                        }
                        cb();
                        return;
                    }

                    preWriteOperations(copyFile, contentsOfFrom, function (options) {
                        var contentsAfterPreWriteOperations = options.contentsAfterPreWriteOperations,
                            uglified = options.uglified;
                        writeContents(
                            copyFile,
                            {
                                contents: contentsAfterPreWriteOperations,
                                uglified: uglified,
                                overwriteIfFileAlreadyExists: overwriteIfFileAlreadyExists
                            },
                            function (err, avoidedFileOverwrite) {
                                if (err) {
                                    warningsEncountered++;
                                    logger.log(errorMessageFailedToCopy + printFromTo);
                                    cb();
                                    return;
                                } else {
                                    postWriteOperations(
                                        copyFile,
                                        contentsOfFrom,
                                        contentsAfterPreWriteOperations,
                                        {
                                            notifyAboutAvailableChange: notifyAboutAvailableChange
                                        },
                                        function (appendToSuccessMessage) {
                                            if (avoidedFileOverwrite) {
                                                logger.log(successMessageAvoidedFileOverwrite + (appendToSuccessMessage || '') + printTo);
                                            } else {
                                                // Copying value of "destFileDoesNotExist" to "destFileDidNotExist" since that has a better
                                                // sematic name for the given context
                                                let destFileDidNotExist = destFileDoesNotExist;
                                                if (destFileDidNotExist) {
                                                    logger.log(successMessage + printFromTo);
                                                } else {
                                                    logger.log(successMessage + (appendToSuccessMessage || '') + printFromTo);
                                                }
                                            }
                                            cb();
                                        }
                                    );
                                }
                            }
                        );
                    });
                });
            } else {
                logger.log(successMessageAvoidedFileOverwrite + printTo);
                cb();
            }
        };

        var done = function (warningsEncountered) {
            if (warningsEncountered) {
                if (warningsEncountered === 1) {
                    logger.warn('\nEncountered ' + warningsEncountered + ' warning. Please check.');
                } else {
                    logger.warn('\nEncountered ' + warningsEncountered + ' warnings. Please check.');
                }
                logger.error('Error: Please resolve the above mentioned warnings. Exiting with code 1.');
                process.exit(1);
            }
        };

        if (copyFiles.length) {
            logger.log(
                chalk.blue('\nStarting copy operation in "' + (mode || 'default') + '" mode:') +
                (overwriteIfFileAlreadyExists ? chalk.yellow(' (overwrite option is on)') : '')
            );

            async.eachLimit(
                copyFiles,
                8,
                function (copyFile, callback) {
                    // "copyFile" would be "undefined" when copy operation is not applicable
                    // in current "mode" for the given file
                    if (copyFile && typeof copyFile === 'object') {
                        doCopyFile(copyFile, function () {
                            callback();
                        });
                    } else {
                        callback();
                    }
                },
                function () {
                    done(warningsEncountered);
                }
            );
        } else {
            logger.warn('No instructions applicable for copy operation.');
        }
    }
}
