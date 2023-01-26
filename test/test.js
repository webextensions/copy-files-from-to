/* globals describe, it */

var path = require('path');

var shell = require('shelljs');

var chai = require('chai');
var chaiFiles = require('chai-files');

chai.use(chaiFiles);

var expect = chai.expect;
var file = chaiFiles.file;

var { rimrafSync } = require('rimraf');

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

            rimrafSync(path.join(basicUsageDir, 'scripts'));

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
                function (exitCode, stdout, stderr) { // eslint-disable-line no-unused-vars
                    expect(file(jqueryJs)).to.equal(file(jqueryJsOriginal));
                    expect(file(consolePanelJs)).to.equal(file(consolePanelJsOriginal));
                    expect(file(consolePanelCss)).to.equal(file(consolePanelCssOriginal));

                    done();
                }
            );
        });

        it('should be able to copy files from a cjson config', function (done) {
            var advancedUsageDir = path.join(__dirname, 'advanced-usage');

            rimrafSync(path.join(advancedUsageDir, 'public'));
            rimrafSync(path.join(advancedUsageDir, 'scripts'));

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
                function (exitCode, stdout, stderr) { // eslint-disable-line no-unused-vars
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

            rimrafSync(path.join(dirToUse, 'scripts'));

            var
                underscoreJsMapOriginal = path.join(dirToUse, 'expected-output', 'scripts', 'underscore.js.map'),
                underscoreJsMap         = path.join(dirToUse,                    'scripts', 'underscore.js.map');

            shell.exec(
                path.join(__dirname, '..', 'index.js') + ' --mode pre-production',
                {
                    silent: true,
                    cwd: dirToUse
                },
                function (exitCode, stdout, stderr) { // eslint-disable-line no-unused-vars
                    expect(file(underscoreJsMap)).to.equal(file(underscoreJsMapOriginal));

                    done();
                }
            );
        });

        it('should be able to copy files from parent folder', function (done) {
            var testCopyFilesFromParentFolderDir = path.join(__dirname, 'test-copy-files-from-parent-folder');
            var cwdToUse = path.join(testCopyFilesFromParentFolderDir, 'folder-input-1', 'folder-input-2');

            rimrafSync(path.join(testCopyFilesFromParentFolderDir, 'dest'));

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
                function (exitCode, stdout, stderr) { // eslint-disable-line no-unused-vars
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

            rimrafSync(path.join(cwdToUse, 'scripts'));

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
                function (exitCode, stdout, stderr) { // eslint-disable-line no-unused-vars
                    expect(file(jqueryJs)).to.equal(file(jqueryJsOriginal));

                    done();
                }
            );
        });

        it('should be able to copy a directory', function (done) {
            const testCopyDirectory = path.join(__dirname, 'test-copy-directory');
            const cwdToUse = testCopyDirectory;

            rimrafSync(path.join(cwdToUse, 'target-dir'));

            const
                dir1File1Source  = path.join(testCopyDirectory, 'source-dir', 'dir1', 'file1.txt'),
                dir1File2Source  = path.join(testCopyDirectory, 'source-dir', 'dir1', 'file2.txt'),
                dir2File1Source  = path.join(testCopyDirectory, 'source-dir', 'dir2', 'file1.txt'),
                dir2File2Source  = path.join(testCopyDirectory, 'source-dir', 'dir2', 'file2.txt');

            const
                dir1File1Target = path.join(testCopyDirectory, 'target-dir', 'dir1', 'file1.txt'),
                dir1File2Target = path.join(testCopyDirectory, 'target-dir', 'dir1', 'file2.txt'),
                dir2File1Target = path.join(testCopyDirectory, 'target-dir', 'dir2', 'file1.txt'),
                dir2File2Target = path.join(testCopyDirectory, 'target-dir', 'dir2', 'file2.txt');

            shell.exec(
                path.join(__dirname, '..', 'index.js'),
                {
                    silent: true,
                    cwd: cwdToUse
                },
                function (exitCode, stdout, stderr) { // eslint-disable-line no-unused-vars
                    expect(file(dir1File1Target)).to.equal(file(dir1File1Source));
                    expect(file(dir1File2Target)).to.equal(file(dir1File2Source));

                    expect(file(dir2File1Target)).to.equal(file(dir2File1Source));
                    expect(file(dir2File2Target)).to.equal(file(dir2File2Source));

                    done();
                }
            );
        });

        it('should be able to copy files to a directory', function (done) {
            const testDir = path.join(__dirname, 'test-copy-files-to-a-directory');
            const cwdToUse = testDir;

            rimrafSync(path.join(cwdToUse, 'target-dir'));

            const
                file1TxtSource  = path.join(testDir, 'source-dir', 'file1.txt'),
                file2TxtSource  = path.join(testDir, 'source-dir', 'file2.txt'),
                readme1MdSource  = path.join(testDir, 'source-dir', 'readme1.md'),
                readme2MdSource  = path.join(testDir, 'source-dir', 'readme2.md'),
                webFileSource = path.join(testDir, 'expected-output', 'console-panel.js');

            const
                file1TxtTarget = path.join(testDir, 'target-dir', 'file1.txt'),
                file2TxtTarget = path.join(testDir, 'target-dir', 'file2.txt'),
                readme1MdTarget = path.join(testDir, 'target-dir', 'readme1.md'),
                readme2MdTarget = path.join(testDir, 'target-dir', 'readme2.md'),
                webFileTarget = path.join(testDir, 'target-dir', 'remote', 'console-panel.js');

            shell.exec(
                path.join(__dirname, '..', 'index.js'),
                {
                    silent: true,
                    cwd: cwdToUse
                },
                function (exitCode, stdout, stderr) { // eslint-disable-line no-unused-vars
                    expect(file(file1TxtTarget)).to.equal(file(file1TxtSource));
                    expect(file(file2TxtTarget)).to.equal(file(file2TxtSource));

                    expect(file(readme1MdTarget)).to.equal(file(readme1MdSource));
                    expect(file(readme2MdTarget)).to.equal(file(readme2MdSource));

                    expect(file(webFileTarget)).to.equal(file(webFileSource));

                    done();
                }
            );
        });
    });
});
