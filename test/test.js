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
                consolePanelJs                = path.join(basicUsageDir,                    'scripts', 'console-panel', 'console-panel.js'),
                consolePanelJsExpectedOutput  = path.join(basicUsageDir, 'expected-output', 'scripts', 'console-panel', 'console-panel.js'),
                consolePanelCss               = path.join(basicUsageDir,                    'scripts', 'console-panel', 'console-panel.css'),
                consolePanelCssExpectedOutput = path.join(basicUsageDir, 'expected-output', 'scripts', 'console-panel', 'console-panel.css'),
                jqueryJs                      = path.join(basicUsageDir,                    'scripts', 'jquery', 'jquery.js'),
                jqueryJsExpectedOutput        = path.join(basicUsageDir, 'expected-output', 'scripts', 'jquery', 'jquery.js');

            shell.exec(
                path.join(__dirname, '..', 'index.js'),
                {
                    silent: true,
                    cwd: basicUsageDir
                },
                function (exitCode, stdout, stderr) {
                    expect(file(jqueryJs)).to.equal(file(jqueryJsExpectedOutput));
                    expect(file(consolePanelJs)).to.equal(file(consolePanelJsExpectedOutput));
                    expect(file(consolePanelCss)).to.equal(file(consolePanelCssExpectedOutput));

                    done();
                }
            );
        });

        it('should be able to copy files from a cjson config', function (done) {
            var advancedUsageDir = path.join(__dirname, 'advanced-usage');

            rimraf.sync(path.join(advancedUsageDir, 'public'));
            rimraf.sync(path.join(advancedUsageDir, 'scripts'));

            var
                underscoreJs                  = path.join(advancedUsageDir,                    'scripts', 'underscore.js'),
                underscoreJsExpectedOutput    = path.join(advancedUsageDir, 'expected-output', 'scripts', 'underscore.js'),
                consolePanelJs                = path.join(advancedUsageDir,                    'scripts', 'console-panel', 'console-panel.js'),
                consolePanelJsExpectedOutput  = path.join(advancedUsageDir, 'expected-output', 'scripts', 'console-panel', 'console-panel.js'),
                aJpg                          = path.join(advancedUsageDir,                    'public', 'images', 'test-a', 'a.jpg'),
                bJpg                          = path.join(advancedUsageDir,                    'public', 'images', 'test-b', 'b.jpg'),
                cTxt                          = path.join(advancedUsageDir,                    'public', 'images', 'test-c', 'c.txt'),
                aJpgExpectedOutput            = path.join(advancedUsageDir, 'expected-output', 'public', 'images', 'test-a', 'a.jpg'),
                bJpgExpectedOutput            = path.join(advancedUsageDir, 'expected-output', 'public', 'images', 'test-b', 'b.jpg'),
                cTxtExpectedOutput            = path.join(advancedUsageDir, 'expected-output', 'public', 'images', 'test-c', 'c.txt'),
                aJpgFlat                      = path.join(advancedUsageDir,                    'public', 'copy-to-flat-directory', 'a.jpg'),
                bJpgFlat                      = path.join(advancedUsageDir,                    'public', 'copy-to-flat-directory', 'b.jpg'),
                cTxtFlat                      = path.join(advancedUsageDir,                    'public', 'copy-to-flat-directory', 'c.txt');

            shell.exec(
                path.join(__dirname, '..', 'index.js'),
                {
                    silent: true,
                    cwd: advancedUsageDir
                },
                function (exitCode, stdout, stderr) {
                    expect(file(underscoreJs)).to.equal(file(underscoreJsExpectedOutput));
                    expect(file(consolePanelJs)).to.equal(file(consolePanelJsExpectedOutput));
                    expect(file(aJpg)).to.equal(file(aJpgExpectedOutput));
                    expect(file(bJpg)).to.equal(file(bJpgExpectedOutput));
                    expect(file(cTxt)).to.equal(file(cTxtExpectedOutput));
                    expect(file(aJpgFlat)).to.equal(file(aJpgExpectedOutput));
                    expect(file(bJpgFlat)).to.equal(file(bJpgExpectedOutput));
                    expect(file(cTxtFlat)).to.equal(file(cTxtExpectedOutput));

                    done();
                }
            );
        });
    });
});
