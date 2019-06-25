/* globals describe, it */

var path = require('path');

var shell = require('shelljs');

var chai = require('chai');
var chaiFiles = require('chai-files');

chai.use(chaiFiles);

var expect = chai.expect;
var file = chaiFiles.file;

var rimraf = require("rimraf");

var copyFilesFromTo = require('../index.js');       // eslint-disable-line no-unused-vars

describe('package', function() {
    describe('copy-files-from-to', function() {
        this.timeout(10000);

        // If there would be an error in require, the code would not reach this point
        it('should load fine when using require', function(done) {
            done();
        });

        it('should be able to copy files from a json config', function (done) {
            var basicUsageDir = path.join(__dirname, 'basic-usage');

            rimraf.sync(path.join(basicUsageDir, 'scripts'));

            var
                consolePanelJsOriginal  = path.join(basicUsageDir, 'expected-output', 'scripts', 'console-panel', 'console-panel.js'),
                consolePanelJs          = path.join(basicUsageDir,                    'scripts', 'console-panel', 'console-panel.js'),

                consolePanelCssOriginal = path.join(basicUsageDir, 'expected-output', 'scripts', 'console-panel', 'console-panel.css'),
                consolePanelCss         = path.join(basicUsageDir,                    'scripts', 'console-panel', 'console-panel.css'),

                jqueryJsOriginal        = path.join(basicUsageDir, 'node_modules', 'jquery', 'dist', 'jquery.js'),
                jqueryJs                = path.join(basicUsageDir, 'scripts', 'jquery', 'jquery.js');

            shell.exec(
                path.join(__dirname, '..', 'index.js'),
                {
                    silent: true,
                    cwd: basicUsageDir
                },
                function (exitCode, stdout, stderr) {
                    expect(file(jqueryJs)).to.equal(file(jqueryJsOriginal));
                    expect(file(consolePanelJs)).to.equal(file(consolePanelJsOriginal));
                    expect(file(consolePanelCss)).to.equal(file(consolePanelCssOriginal));

                    done();
                }
            );
        });

        it('should be able to copy files from a cjson config', function (done) {
            var advancedUsageDir = path.join(__dirname, 'advanced-usage');

            rimraf.sync(path.join(advancedUsageDir, 'public'));
            rimraf.sync(path.join(advancedUsageDir, 'scripts'));

            var
                underscoreJsOriginal   = path.join(advancedUsageDir, 'expected-output', 'scripts', 'underscore.js'),
                underscoreJs           = path.join(advancedUsageDir,                    'scripts', 'underscore.js'),

                consolePanelJsOriginal = path.join(advancedUsageDir, 'expected-output', 'scripts', 'console-panel', 'console-panel.js'),
                consolePanelJs         = path.join(advancedUsageDir,                    'scripts', 'console-panel', 'console-panel.js'),

                aJpgOriginal           = path.join(advancedUsageDir, 'expected-output', 'public', 'images', 'test-a', 'a.jpg'),
                bJpgOriginal           = path.join(advancedUsageDir, 'expected-output', 'public', 'images', 'test-b', 'b.jpg'),
                cTxtOriginal           = path.join(advancedUsageDir, 'expected-output', 'public', 'images', 'test-c', 'c.txt'),

                aJpg                   = path.join(advancedUsageDir,                    'public', 'images', 'test-a', 'a.jpg'),
                bJpg                   = path.join(advancedUsageDir,                    'public', 'images', 'test-b', 'b.jpg'),
                cTxt                   = path.join(advancedUsageDir,                    'public', 'images', 'test-c', 'c.txt'),

                aJpgFlat               = path.join(advancedUsageDir,                    'public', 'copy-to-flat-directory', 'a.jpg'),
                bJpgFlat               = path.join(advancedUsageDir,                    'public', 'copy-to-flat-directory', 'b.jpg'),
                cTxtFlat               = path.join(advancedUsageDir,                    'public', 'copy-to-flat-directory', 'c.txt');

            shell.exec(
                path.join(__dirname, '..', 'index.js'),
                {
                    silent: true,
                    cwd: advancedUsageDir
                },
                function (exitCode, stdout, stderr) {
                    expect(file(underscoreJs)).to.equal(file(underscoreJsOriginal));
                    expect(file(consolePanelJs)).to.equal(file(consolePanelJsOriginal));

                    expect(file(aJpg)).to.equal(file(aJpgOriginal));
                    expect(file(bJpg)).to.equal(file(bJpgOriginal));
                    expect(file(cTxt)).to.equal(file(cTxtOriginal));

                    expect(file(aJpgFlat)).to.equal(file(aJpgOriginal));
                    expect(file(bJpgFlat)).to.equal(file(bJpgOriginal));
                    expect(file(cTxtFlat)).to.equal(file(cTxtOriginal));

                    done();
                }
            );
        });

        it('should be able to copy a file in custom mode', function (done) {
            var dirToUse = path.join(__dirname, 'test-copy-file-in-custom-mode');

            rimraf.sync(path.join(dirToUse, 'scripts'));

            var
                underscoreJsMapOriginal = path.join(dirToUse, 'expected-output', 'scripts', 'underscore.js.map'),
                underscoreJsMap         = path.join(dirToUse,                    'scripts', 'underscore.js.map');

            shell.exec(
                path.join(__dirname, '..', 'index.js') + ' --mode pre-production',
                {
                    silent: true,
                    cwd: dirToUse
                },
                function (exitCode, stdout, stderr) {
                    expect(file(underscoreJsMap)).to.equal(file(underscoreJsMapOriginal));

                    done();
                }
            );
        });

        it('should be able to copy files from parent folder', function (done) {
            var testCopyFilesFromParentFolderDir = path.join(__dirname, 'test-copy-files-from-parent-folder');
            var cwdToUse = path.join(testCopyFilesFromParentFolderDir, 'folder-input-1', 'folder-input-2');

            rimraf.sync(path.join(testCopyFilesFromParentFolderDir, 'dest'));

            var
                consolePanelJsOriginal  = path.join(testCopyFilesFromParentFolderDir, 'code', 'console-panel.js'),
                consolePanelCssOriginal = path.join(testCopyFilesFromParentFolderDir, 'code', 'console-panel.css'),

                consolePanelJsGlob1     = path.join(testCopyFilesFromParentFolderDir, 'dest', 'folder-output-1', 'console-panel.js'),
                consolePanelCssGlob1    = path.join(testCopyFilesFromParentFolderDir, 'dest', 'folder-output-1', 'console-panel.css'),

                consolePanelJsGlob2     = path.join(testCopyFilesFromParentFolderDir, 'dest', 'folder-output-2', 'console-panel.js'),
                consolePanelCssGlob2    = path.join(testCopyFilesFromParentFolderDir, 'dest', 'folder-output-2', 'console-panel.css');

            shell.exec(
                path.join(__dirname, '..', 'index.js'),
                {
                    silent: true,
                    cwd: cwdToUse
                },
                function (exitCode, stdout, stderr) {
                    expect(file(consolePanelJsGlob1)).to.equal(file(consolePanelJsOriginal));
                    expect(file(consolePanelCssGlob1)).to.equal(file(consolePanelCssOriginal));

                    expect(file(consolePanelJsGlob2)).to.equal(file(consolePanelJsOriginal));
                    expect(file(consolePanelCssGlob2)).to.equal(file(consolePanelCssOriginal));

                    done();
                }
            );
        });

        it('should be able to read copy instructions from package.json file as a fallback', function (done) {
            var cwdToUse = path.join(__dirname, 'test-copy-instructions-from-package-json');

            rimraf.sync(path.join(cwdToUse, 'scripts'));

            // There are multiple files which are being copied, but we need to test only one of them to verify
            // if instructions are being read from package.json file
            var
                jqueryJsOriginal = path.join(cwdToUse, 'node_modules', 'jquery', 'dist', 'jquery.js'),
                jqueryJs         = path.join(cwdToUse, 'scripts', 'jquery', 'jquery.js');

            shell.exec(
                path.join(__dirname, '..', 'index.js'),
                {
                    silent: true,
                    cwd: cwdToUse
                },
                function (exitCode, stdout, stderr) {
                    expect(file(jqueryJs)).to.equal(file(jqueryJsOriginal));

                    done();
                }
            );
        });
    });
});
