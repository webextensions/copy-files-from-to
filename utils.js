var path = require('path'),
    fs = require('fs');

var request = require('request'),
    mkdirp = require('mkdirp'),
    UglifyJS = require('uglify-js'),
    isUtf8 = require('is-utf8');

var unixify = require('unixify');

var logger = require('note-down');
logger.removeOption('showLogLine');
var chalk = logger.chalk;

var utils = {
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

    additionalProcessing: function (additionalOptions, code) {
        var needsUglify = additionalOptions.needsUglify;
        var removeSourceMappingURL = additionalOptions.removeSourceMappingURL;
        var data = {};

        if (removeSourceMappingURL) {
            // LAZY: This approach is simple enough and seems to work well for the common known cases.
            //       As and when any issues are encountered, this code can be improved.
            code = String(code).split('//# sourceMappingURL=')[0];
            data.consoleCommand = data.consoleCommand || {};
            data.consoleCommand.sourceMappingUrl = 'Note: Removed "sourceMappingURL"';
        }

        if (needsUglify) {
            var result = UglifyJS.minify(
                String(code),
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

            data.code = result.code || code;
            data.consoleCommand = data.consoleCommand || {};
            data.consoleCommand.uglifyJs = consoleCommand;
        } else {
            data.code = code;
        }

        return data;
    },

    readContents: function (sourceFullPath, cb) {
        if (utils.isRemoteResource(sourceFullPath)) {
            request(
                {
                    uri: sourceFullPath,
                    encoding: null,
                    gzip: true,
                    timeout: 30000
                },
                function (err, response, body) {
                    if (err) {
                        cb(err);
                    } else {
                        if (response.statusCode === 200) {
                            cb(null, body, 'remote');
                        } else {
                            cb('Unexpected statusCode (' + response.statusCode + ') for response of: ' + sourceFullPath);
                        }
                    }
                }
            );
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
