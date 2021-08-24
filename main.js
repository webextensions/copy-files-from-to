var path = require('path'),
    fs = require('fs');

var async = require('async'),
    _ = require('lodash'),
    fastGlob = require('fast-glob'),
    globParent = require('glob-parent'),
    isGlob = require('is-glob'),
    md5 = require('md5');

var unixify = require('unixify');

var logger = require('note-down');
logger.removeOption('showLogLine');
var chalk = logger.chalk;

var packageJson = require('./package.json');

var utils = require('./utils.js');

var main = function (params) {
    var paramVerbose = params.paramVerbose;
    var paramOutdated = params.paramOutdated;
    var paramWhenFileExists = params.paramWhenFileExists;
    var cwd = params.cwd || unixify(process.cwd());
    var copyFiles = params.copyFiles || [];
    var copyFilesSettings = params.copyFilesSettings || {};
    var bail = copyFilesSettings.bail || false; // TODO: Document this feature
    var configFileSourceDirectory = params.configFileSourceDirectory || cwd;
    var mode = params.mode || 'default';

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
            var copyFile = copyFiles[i];
            var from = copyFile.from;
            if (from && typeof from === 'object') {
                var modes = Object.keys(from);
                for (var j = 0; j < modes.length; j++) {
                    var thisMode = modes[j],
                        fromMode = from[thisMode];
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
                                utils.readContents(resourceSrc, function (err, contents, encoding) {
                                    if (err) {
                                        logger.error(' ✗ Could not read: ' + resourceSrc);
                                    } else {
                                        if (encoding === 'binary')
                                            resourceSrcContents = md5(contents);
                                        else
                                            resourceSrcContents = contents;
                                    }
                                    cb();
                                });
                            },
                            function (cb) {
                                utils.readContents(resourceLatest, function (err, contents, encoding) {
                                    if (err) {
                                        logger.error(' ✗ (Could not read) ' + chalk.gray(resourceLatest));
                                    } else {
                                        if (encoding === 'binary')
                                            resourceLatestContents = md5(contents);
                                        else
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
            whenFileExists = copyFilesSettings.whenFileExists;
            if (ARR_WHEN_FILE_EXISTS.indexOf(whenFileExists) === -1) {
                whenFileExists = WHEN_FILE_EXISTS_DO_NOTHING;
            }
        }
        var overwriteIfFileAlreadyExists = (whenFileExists === WHEN_FILE_EXISTS_OVERWRITE),
            notifyAboutAvailableChange = (whenFileExists === WHEN_FILE_EXISTS_NOTIFY_ABOUT_AVAILABLE_CHANGE);

        var warningsEncountered = 0;

        copyFiles = copyFiles.map(function normalizeData(copyFile) {
            var latest = null;
            var from = null,
                skipFrom = null;
            if (typeof copyFile.from === 'string' || Array.isArray(copyFile.from)) {
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
                removeSourceMappingURL = null,
                uglify = null;
            if (typeof copyFile.to === 'string') {
                to = copyFile.to;
                uglify = utils.booleanIntention(copyFilesSettings.uglifyJs, false);
            } else {
                var toMode = copyFile.to[mode] || copyFile.to['default'] || {};
                if (typeof toMode === 'string') {
                    to = toMode;
                } else {
                    to = toMode.dest;
                    skipTo = !!toMode.skip;
                }

                if (typeof toMode === 'object' && toMode.removeSourceMappingURL !== undefined) {
                    removeSourceMappingURL = utils.booleanIntention(toMode.removeSourceMappingURL, false);
                } else {
                    removeSourceMappingURL = utils.booleanIntention(copyFilesSettings.removeSourceMappingURL, false);
                }

                if (typeof toMode === 'object' && toMode.uglifyJs !== undefined) {
                    uglify = utils.booleanIntention(toMode.uglifyJs, false);
                } else {
                    uglify = utils.booleanIntention(copyFilesSettings.uglifyJs, false);
                }
            }

            if (isGlob(to)) {
                warningsEncountered++;
                logger.log('');
                logger.warn('The "to" entries should not be a "glob" pattern. ' + chalk.blue('(Reference: https://github.com/isaacs/node-glob#glob-primer)'));

                to = null;
            }

            var toFlat = null;
            if (copyFile.toFlat) {
                toFlat = true;
            }

            if ((typeof from === 'string' || Array.isArray(from)) && typeof to === 'string') {
                if (!Array.isArray(from) && (from.match(/\.js$/) || to.match(/\.js$/))) {
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
                        if (Array.isArray(from)) {
                            // If array, it's a glob instruction. Any objects are
                            var globPatterns = [];
                            var globSettings = {};
                            from.forEach( globPart => {
                                if (typeof globPart === 'string') {
                                    if (globPart.charAt(0) === '!')
                                        globPatterns.push('!' + unixify(path.join(configFileSourceDirectory, globPart.substring(1))));
                                    else
                                        globPatterns.push(unixify(path.join(configFileSourceDirectory, globPart)));
                                } else {
                                    Object.assign(globSettings, globPart);
                                }
                            });
                            return {
                                globPatterns: globPatterns,
                                globSettings: globSettings,
                            };
                        }
                        return unixify(path.join(configFileSourceDirectory, from));
                    }()),
                    to: unixify(path.join(configFileSourceDirectory, to)),
                    toFlat: toFlat,
                    removeSourceMappingURL: removeSourceMappingURL,
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

        copyFiles = (function () {
            var arr = [];
            copyFiles.forEach(function (copyFile) {
                if (copyFile && copyFile.from) {
                    var entries = function() {
                        if (typeof copyFile.from === 'string' && isGlob(copyFile.from)) {
                            return fastGlob.sync([copyFile.from], { dot: !copyFilesSettings.ignoreDotFilesAndFolders });
                        } else if (copyFile.from.globPatterns) {
                            return fastGlob.sync(
                                copyFile.from.globPatterns,
                                Object.assign({ dot: !copyFilesSettings.ignoreDotFilesAndFolders }, copyFile.from.globSettings)
                            );
                        } else {
                            return null;
                        }
                    }();
                    if (entries && entries.length) {
                        entries.forEach(function (entry) {
                            var ob = JSON.parse(JSON.stringify(copyFile));
                            ob.from = entry;

                            var intendedFrom = ob.intendedFrom;
                            if (Array.isArray(intendedFrom)) {
                                intendedFrom = intendedFrom[0];
                            }
                            var targetTo = unixify(
                                path.relative(
                                    path.join(
                                        configFileSourceDirectory,
                                        globParent(intendedFrom)
                                    ),
                                    ob.from
                                )
                            );
                            if (copyFile.toFlat) {
                                var fileName = path.basename(targetTo);
                                targetTo = fileName;
                            }

                            ob.to = unixify(
                                path.join(
                                    ob.to,
                                    targetTo
                                )
                            );
                            arr.push(ob);
                        });
                    } else {
                        if (copyFile.from.globPatterns) {
                            // do nothing
                        } else {
                            arr.push(copyFile);
                        }
                    }
                }
            });
            return arr;
        }());

        var writeContents = function (copyFile, options, cb) {
            var to = copyFile.to,
                intendedFrom = copyFile.intendedFrom;
            var contents = options.contents,
                consoleCommand = options.consoleCommand,
                overwriteIfFileAlreadyExists = options.overwriteIfFileAlreadyExists;

            utils.ensureDirectoryExistence(to);

            var fileExists = fs.existsSync(to),
                fileDoesNotExist = !fileExists;

            var avoidedFileOverwrite;
            var finalPath = '';
            if (
                fileDoesNotExist ||
                (fileExists && overwriteIfFileAlreadyExists)
            ) {
                try {
                    if (to[to.length-1] === '/') {
                        var stats = fs.statSync(to);
                        if (stats.isDirectory()) {
                            if (typeof intendedFrom === 'string' && !isGlob(intendedFrom)) {
                                var fileName = path.basename(intendedFrom);
                                to = unixify(path.join(to, fileName));
                            }
                        }
                    }

                    fs.writeFileSync(to, contents, copyFile.encoding === 'binary' ? null : 'utf8');
                    finalPath = to;
                } catch (e) {
                    cb(e);
                    return;
                }
                if (copyFilesSettings.addReferenceToSourceOfOrigin) {
                    var sourceDetails = intendedFrom;
                    if (consoleCommand) {
                        if (consoleCommand.sourceMappingUrl) {
                            sourceDetails += '\n\n' + consoleCommand.sourceMappingUrl;
                        }
                        if (consoleCommand.uglifyJs) {
                            sourceDetails += '\n\n' + consoleCommand.uglifyJs;
                        }
                    }

                    /*
                    TODO: Handle error scenario for this ".writeFileSync()" operation.
                          Not handling it yet because for all practical use-cases, if
                          the code has been able to write the "to" file, then it should
                          be able to write the "<to>.source.txt" file
                    */
                    fs.writeFileSync(to + '.source.txt', sourceDetails, 'utf8');
                }
                avoidedFileOverwrite = false;
            } else {
                avoidedFileOverwrite = true;
            }
            cb(null, avoidedFileOverwrite, finalPath || to);
        };

        var checkForAvailableChange = function (copyFile, contentsOfFrom, config, cb) {
            var notifyAboutAvailableChange = config.notifyAboutAvailableChange;

            if (notifyAboutAvailableChange) {
                var to = copyFile.to;
                utils.readContents(to, function (err, contentsOfTo, encoding) {
                    if (err) {
                        cb(chalk.red(' (unable to read "to.<mode>.dest" file at path ' + to + ')'));
                        warningsEncountered++;
                    } else {
                        copyFile.encoding = encoding;
                        var needsUglify = copyFile.uglify;
                        var removeSourceMappingURL = copyFile.removeSourceMappingURL;

                        var response = utils.additionalProcessing({
                            needsUglify: needsUglify,
                            removeSourceMappingURL: removeSourceMappingURL
                        }, contentsOfFrom);
                        var processedCode = response.code;

                        if (copyFile.encoding === 'binary') {
                            // Only run resource-intensive md5 on binary files
                            if (md5(processedCode) === md5(contentsOfTo)) {
                                cb(chalk.gray(' (up to date)'));
                            } else {
                                cb(chalk.yellow(' (md5 update is available)'));
                            }
                        } else {
                            if (processedCode === contentsOfTo) {
                                cb(chalk.gray(' (up to date)'));
                            } else {
                                cb(chalk.yellow(' (update is available)'));
                            }
                        }
                    }
                });
            } else {
                cb();
            }
        };

        var preWriteOperations = function (copyFile, contents, cb) {
            var needsUglify = copyFile.uglify;
            var removeSourceMappingURL = copyFile.removeSourceMappingURL;
            var response = utils.additionalProcessing({
                needsUglify: needsUglify,
                removeSourceMappingURL: removeSourceMappingURL
            }, contents);

            var processedCode = response.code;
            var consoleCommand = response.consoleCommand;

            var data = {};
            data.contentsAfterPreWriteOperations = processedCode;
            if (consoleCommand) {
                if (consoleCommand.uglifyJs) {
                    consoleCommand.uglifyJs = (
                        '$ ' + consoleCommand.uglifyJs +
                        '\n' +
                        '\nWhere:' +
                        '\n    uglifyjs = npm install -g uglify-js@' + packageJson.dependencies['uglify-js'] +
                        '\n    <source> = File ' + copyFile.intendedFrom +
                        '\n    <destination> = File ./' + path.basename(copyFile.intendedTo)
                    );
                }

                data.consoleCommand = consoleCommand;
            }

            cb(data);
        };

        var postWriteOperations = function (copyFile, originalContents, contentsAfterPreWriteOperations, config, cb) {
            checkForAvailableChange(copyFile, originalContents, config, function (status) {
                cb(status);
            });
        };

        var doCopyFile = function (copyFile, cb) {
            var from = copyFile.from,
                to = copyFile.to;

            var printFrom = ' ' + chalk.gray(utils.getRelativePath(cwd, from));
            var printFromToOriginal =  ' ' + chalk.gray(utils.getRelativePath(cwd, to));

            var successMessage = ' ' + chalk.green('✓') + ` Copied `,
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
                utils.readContents(copyFile.from, function (err, contentsOfFrom, encoding) {
                    if (err) {
                        warningsEncountered++;
                        if (destFileExists && notifyAboutAvailableChange) {
                            logger.log(errorMessageCouldNotReadFromSrc + printFrom);
                        } else {
                            logger.log(errorMessageFailedToCopy + printFromToOriginal);
                            if (bail) {
                                logger.error(`An error occurred in reading file (From: ${copyFile.from} ; To: ${copyFile.to}).`);
                                logger.error(`Exiting the copy-files-from-to operation with exit code 1 since the "bail" option was set.`);
                                process.exit(1);
                            }
                        }
                        cb();
                        return;
                    }
                    copyFile.encoding = encoding;
                    var typeString = `[${utils.getColoredTypeString(encoding)}]`;

                    preWriteOperations(copyFile, contentsOfFrom, function (options) {
                        var contentsAfterPreWriteOperations = options.contentsAfterPreWriteOperations,
                            consoleCommand = options.consoleCommand;
                        writeContents(
                            copyFile,
                            {
                                contents: contentsAfterPreWriteOperations,
                                consoleCommand: consoleCommand,
                                overwriteIfFileAlreadyExists: overwriteIfFileAlreadyExists
                            },
                            function (err, avoidedFileOverwrite, finalPath) {
                                if (err) {
                                    warningsEncountered++;
                                    logger.log(errorMessageFailedToCopy + printFromTo);
                                    if (bail) {
                                        logger.error(`An error occurred in writing file (From: ${copyFile.from} ; To: ${copyFile.to}).`);
                                        logger.error(`Exiting the copy-files-from-to operation with exit code 1 since the "bail" option was set.`);
                                        process.exit(1);
                                    }
                                    cb();
                                    return;
                                } else {
                                    var printTo = ' ' + chalk.gray(utils.getRelativePath(cwd, finalPath));
                                    var printFromTo = printFrom + ' to' + printTo;

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
                                                var destFileDidNotExist = destFileDoesNotExist;
                                                if (destFileDidNotExist) {
                                                    logger.log(successMessage + typeString + printFromTo);
                                                } else {
                                                    logger.log(successMessage + typeString + (appendToSuccessMessage || '') + printFromTo);
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
                logger.log(successMessageAvoidedFileOverwrite + printFromToOriginal);
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
};

module.exports = main;
