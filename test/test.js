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
    });
});
