#!/usr/bin/env node

var path = require('path'),
    fs = require('fs');

var unixify = require('unixify');
var cjson = require('cjson');

var logger = require('note-down');
logger.removeOption('showLogLine');
var chalk = logger.chalk;

var argv = require('yargs')
    .help(false)
    .version(false)
    .argv;

var utils = require('./utils.js');
var main = require('./main.js');

var paramHelp = argv.h || argv.help,
    paramVersion = argv.v || argv.version,
    paramVerbose = argv.verbose,
    paramOutdated = argv.outdated,
    paramWhenFileExists = argv.whenFileExists;

var packageJson = require('./package.json');

var nodeVersion = process.versions.node;

var cwd = unixify(process.cwd());

if (!module.parent) {
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
            '                                     When unspecified, it looks for:',
            '                                         1) copy-files-from-to.cjson',
            '                                         2) copy-files-from-to.json',
            '                                         3) package.json',
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
        } else if (fs.existsSync(path.resolve(cwd, 'package.json'))) {
            configFile = 'package.json';
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
    configFileSourceDirectory = unixify(path.dirname(configFileSource));

    var cjsonText;
    try {
        logger.info('Reading copy instructions from file ' + utils.getRelativePath(cwd, configFileSource));
        cjsonText = fs.readFileSync(configFileSource, 'utf8');
        cjsonText = utils.stripBom(cjsonText);
    } catch (e) {
        utils.exitWithError(e, 'Error in reading file: ' + configFileSource);
    }

    var copyFiles = [],
        copyFilesSettings = {};
    try {
        var cjsonData = cjson.parse(cjsonText);
        if (cjsonData instanceof Object) {
            if (Array.isArray(cjsonData.copyFiles)) {
                copyFiles = cjsonData.copyFiles;
            }
            if (cjsonData.copyFilesSettings instanceof Object) {
                copyFilesSettings = cjsonData.copyFilesSettings;
            }
        }
    } catch (e) {
        utils.exitWithError(e, 'Invalid (C)JSON data:\n    ' + cjsonText.replace(/\n/g, '\n    '));
    }

    main({
        paramVerbose: paramVerbose,
        paramOutdated: paramOutdated,
        paramWhenFileExists: paramWhenFileExists,
        cwd: cwd,
        copyFiles: copyFiles,
        copyFilesSettings: copyFilesSettings,
        configFileSourceDirectory: configFileSourceDirectory,
        mode: argv.mode
    });
}

module.exports = main;
