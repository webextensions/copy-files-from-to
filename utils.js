var path = require('path'),
    fs = require('fs');

var axios = require('axios'),
    mkdirp = require('mkdirp'),
    { minify: minifyViaTerser } = require('terser'),
    isUtf8 = require('is-utf8');

var unixify = require('unixify');

var { createNoteDownInstance } = require('note-down');
const logger = createNoteDownInstance();
logger.removeOption('showLogLine');
var chalk = logger.chalk;

var utils = {
    logger,

    // https://github.com/sindresorhus/strip-bom/blob/f01a9435b8e7d31bb2bd757e67436d0a1864db0e/index.js
    // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
    // conversion translates it to FEFF (UTF-16 BOM)
    stripBom: function (string) {
        if (string.charCodeAt(0) === 0xFEFF) {
            return string.slice(1);
        }
        return string;
    },

    getEncoding: function(contents) {
        return isUtf8(contents) ? 'utf8' : 'binary';
    },
    getColoredTypeString: function(encoding) {
        switch (encoding) {
        case 'remote': return chalk.cyan('remote');
        case 'binary': return chalk.yellow('binary');
        case 'utf8': return ' utf8 ';
        default: return chalk.red(encoding);
        }
    },
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
        return unixify(path.relative(wrt, fullPath));
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
        var dirname = (
            dirPath[dirPath.length-1] === '/' ?
                unixify(path.normalize(dirPath)) :
                unixify(path.dirname(dirPath))
        );
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

    additionalProcessing: async function (additionalOptions, code) {
        var needsMinify = additionalOptions.needsMinify;
        var removeSourceMappingURL = additionalOptions.removeSourceMappingURL;
        var data = {};

        if (removeSourceMappingURL) {
            // LAZY: This approach is simple enough and seems to work well for the common known cases.
            //       As and when any issues are encountered, this code can be improved.
            code = String(code).split('//# sourceMappingURL=')[0];
            data.consoleCommand = data.consoleCommand || {};
            data.consoleCommand.sourceMappingUrl = 'Note: Removed "sourceMappingURL"';
        }

        if (needsMinify) {
            var result = await minifyViaTerser(
                String(code),
                // Equivalent to: terser <source> --compress sequences=false --format semicolons=false --output <destination>
                {
                    compress: {
                        sequences: false
                    },
                    mangle: false,
                    format: {
                        semicolons: false,
                        comments: function (_, comment) {
                            if (
                                comment.value.charAt(0) === '!' ||
                                /cc_on|copyright|license|preserve/i.test(comment.value)
                            ) {
                                return true;
                            } else {
                                return false;
                            }

                            // if (comment.type === 'comment2') { // multiline comment
                            //     return /@preserve|@license|@cc_on/i.test(comment.value);
                            // } else if (comment.type === 'comment1') { // single line comment
                            //     if (comment.value.indexOf('!') === 0) {
                            //         return true;
                            //     } else {
                            //         return /@preserve|@license|@cc_on/i.test(comment.value);
                            //     }
                            // } else {
                            //     return false;
                            // }
                        }
                    }
                }
            );
            var consoleCommand = 'terser <source> --compress sequences=false --format semicolons=false --output <destination>';

            data.code = result.code || code;
            data.consoleCommand = data.consoleCommand || {};
            data.consoleCommand.minifyJs = consoleCommand;
        } else {
            data.code = code;
        }

        return data;
    },

    readContents: function (sourceFullPath, cb) {
        if (utils.isRemoteResource(sourceFullPath)) {
            axios({
                method: 'get',
                url: sourceFullPath,
                responseType: 'arraybuffer',
                timeout: 30000
            })
                .then(function (response) {
                    if (response.status === 200) {
                        cb(null, response.data, 'remote');
                    } else {
                        cb('Unexpected statusCode (' + response.status + ') for response of: ' + sourceFullPath);
                    }
                })
                .catch(function (err) {
                    cb(err);
                });
        } else {
            try {
                var rawContents = fs.readFileSync(sourceFullPath);
                var encoding = utils.getEncoding(rawContents);
                var contents = encoding === 'binary'
                    ? rawContents
                    : rawContents.toString('utf8');
                cb(null, contents, encoding);
            } catch (e) {
                cb(e);
            }
        }
    }
};

module.exports = utils;
