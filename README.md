# copy-files-from-to
Copy files from one path to another, based on the instructions provided in a configuration file.

# Use cases

* This tool is useful when a few files need to be copied / updated frequently
* This tool works as a basic alternative for `npm` / `bower` when you wish to copy the scripts out of `node_modules` / `bower_components` folder
* You may like to use this tool if you prefer to keep some third-party dependencies (eg: from `node_modules`) updated and/or committed to your project's repository


# Installation
```sh
$ npm install -g copy-files-from-to
```

# How to use
In your `package.json` file, add the `"copyFiles"` and `"copyFilesSettings"` (optional) instructions as described in this section.

Alternatively, you may create a file, say, `copy-files-from-to.json` or `copy-files-from-to.cjson` [(JSON with comments)](https://github.com/kof/node-cjson) in your project and refer to the following usage examples.

## Basic usage
Sample file: [package.json](test/test-copy-instructions-from-package-json/package.json)
```json
{
    "name": "my-application",
    "version": "1.0.0",
    "dependencies": {
        "jquery": "3.4.0"
    },
    "copyFiles": [
        {
            "from": "node_modules/jquery/dist/jquery.js",
            "to": "scripts/jquery/jquery.js"
        },
        {
            "from": "https://raw.githubusercontent.com/webextensions/console-panel/master/src/console-panel.js",
            "to": "scripts/console-panel/console-panel.js"
        },
        {
            "from": "https://raw.githubusercontent.com/webextensions/console-panel/master/src/console-panel.css",
            "to": "scripts/console-panel/console-panel.css"
        }
    ]
}
```

Sample file: [copy-file-from-to.json](test/basic-usage/copy-files-from-to.json)
```json
{
    "copyFiles": [
        {
            "from": "node_modules/jquery/dist/jquery.js",
            "to": "scripts/jquery/jquery.js"
        },
        {
            "from": "https://raw.githubusercontent.com/webextensions/console-panel/master/src/console-panel.js",
            "to": "scripts/console-panel/console-panel.js"
        },
        {
            "from": "https://raw.githubusercontent.com/webextensions/console-panel/master/src/console-panel.css",
            "to": "scripts/console-panel/console-panel.css"
        }
    ]
}
```

### Command and output
```
$ copy-files-from-to
```

```
Reading copy instructions from file copy-files-from-to.json

Starting copy operation in "default" mode:
 ✓ Copied [ utf8 ] node_modules/jquery/dist/jquery.js to scripts/jquery/jquery.js
 ✓ Copied [binary] assets/logo.png to build/logo.png
 ✓ Copied [remote] https://raw.githubusercontent.com/webextensions/console-panel/master/src/console-panel.css to scripts/console-panel/console-panel.css
 ✓ Copied [remote] https://raw.githubusercontent.com/webextensions/console-panel/master/src/console-panel.js to scripts/console-panel/console-panel.js
```


## Advanced usage
Sample file: [copy-files-from-to.cjson](test/advanced-usage/copy-files-from-to.cjson)
```js
// This is a CJSON file (JSON with comments)
{
    "copyFiles": [
        // In "development" mode, copy from the full version of the library, in all other modes, use the minified version
        {
            "from": {
                "default": "https://raw.githubusercontent.com/jashkenas/underscore/master/underscore-min.js",
                "development": "https://raw.githubusercontent.com/jashkenas/underscore/master/underscore.js"
            },
            "to": "scripts/underscore.js"
        },

        // Copy this file only in "pre-production" mode
        {
            "from": "https://raw.githubusercontent.com/jashkenas/underscore/master/underscore-min.js.map",
            "to": {
                "default": {
                    "skip": true
                },
                "pre-production": "scripts/underscore.js.map"
            }
        },

        // Copy this file in "pre-production" and "production" mode only
        {
            "from": {
                "default": {
                    "skip": true
                },
                "pre-production": "node_modules/native-promise-only/npo.js",
                "production": "node_modules/native-promise-only/npo.js"
            },
            "to": "scripts/native-promise-only.js"
        },

        // Copy this file in all modes except "production" mode
        {
            "from": "https://raw.githubusercontent.com/webextensions/console-panel/master/src/console-panel.js",
            "to": {
                "default": "scripts/console-panel/console-panel.js",
                "production": {
                    "skip": true
                }
            }
        },

        // Copy the files matching the "glob" pattern (matching files, along with the their folder structure go into the "to" directory)
        {
            "from": "assets/**/*.jpg",
            "to": "public/images/"
        },

        // Copy the files matching the "glob" pattern (all of the matching files directly go into the "to" directory) since "toFlat" is set to "true"
        {
            "from": "assets/**/*.jpg",
            "to": "public/copy-all-jpg-files-to-this-directory/",
            "toFlat": true
        }
    ],
    "copyFilesSettings": {
        "whenFileExists": "notify-about-available-change",
        "removeSourceMappingURL": false,
        "uglifyJs": false,
        "addReferenceToSourceOfOrigin": false,
        "ignoreDotFilesAndFolders": true
    }
}
```

### Command and output

<details>
  <summary>$ copy-files-from-to</summary>
  <p>

  ```
  Reading copy instructions from file copy-files-from-to.cjson

  Starting copy operation in "default" mode:
   ✓ Copied [remote] https://raw.githubusercontent.com/jashkenas/underscore/master/underscore-min.js to scripts/underscore.js
   ✓ Copied [remote] https://raw.githubusercontent.com/webextensions/console-panel/master/src/console-panel.js to scripts/console-panel/console-panel.js
  ```
  </p>
</details>

<details>
  <summary>$ copy-files-from-to --mode development</summary>
  <p>

  ```
  Reading copy instructions from file copy-files-from-to.cjson

  Starting copy operation in "development" mode:
   ✓ Copied [remote] https://raw.githubusercontent.com/jashkenas/underscore/master/underscore.js to scripts/underscore.js
   ✓ Copied [remote] https://raw.githubusercontent.com/webextensions/console-panel/master/src/console-panel.js to scripts/console-panel/console-panel.js
  ```
  </p>
</details>

<details>
  <summary>$ copy-files-from-to --mode production</summary>
  <p>

  ```
  Reading copy instructions from file copy-files-from-to.cjson

  Starting copy operation in "production" mode:
   ✓ Copied [ utf8 ] node_modules/native-promise-only/npo.js to scripts/native-promise-only.js
   ✓ Copied [remote] https://raw.githubusercontent.com/jashkenas/underscore/master/underscore-min.js to scripts/underscore.js
  ```
  </p>
</details>

<details>
  <summary>$ copy-files-from-to --mode pre-production --config copy-files-from-to.cjson</summary>
  <p>

  ```
  Reading copy instructions from file copy-files-from-to.cjson

  Starting copy operation in "pre-production" mode:
   ✓ Copied [ utf8 ] node_modules/native-promise-only/npo.js to scripts/native-promise-only.js
   ✓ Copied [remote] https://raw.githubusercontent.com/jashkenas/underscore/master/underscore-min.js to scripts/underscore.js
   ✓ Copied [remote] https://raw.githubusercontent.com/jashkenas/underscore/master/underscore-min.js.map to scripts/underscore.js.map
   ✓ Copied [remote] https://raw.githubusercontent.com/webextensions/console-panel/master/src/console-panel.js to scripts/console-panel/console-panel.js
  ```
  </p>
</details>

# Configuration

## Structure of "copyFiles" instruction file
* You can provide the "copyFiles" instructions in a JSON or [CJSON](https://github.com/kof/node-cjson) file
* The file can be structured like:
    ```js
    {
        // copyFiles (required parameter)
        //     Summary: This is the instruction set for the files to be copied
        //     Data type: array (of objects)
        "copyFiles": [
            // Using "from" and "to", both, as simple strings
            {
                // from (required parameter)
                //     Summary: This contains the path of a file which is either on disk or accessible via "http"/"https" URL
                //     Data type: string, array, or object
                //     Note: When it is set as a string, it would be used for all modes. When it is set as an object, it can be
                //           configured differently for different modes (refer to the next example)
                //           When it is set as an array, it describes an array of glob patterns and settings
                "from": "http://example.com/index.html",

                // to (required parameter)
                //     Data type: string or object
                //     Summary: This instruction set would write a file to this path on the disk
                //     Note: When it is set as a string, it would be used for all modes. When it is set as an object, it can be
                //           configured differently for different modes
                "to": "example-index.html"
            },

            // Using "from" as an array of glob expressions
            {
                // from (required parameter)
                //     Data type: array
                //     Note: When it is set as an array, it describes an array of glob patterns and settings
                //           Any strings in the array are used as glob patterns.
                //           Any objects are used as fast-glob options: (See https://www.npmjs.com/package/fast-glob)
                "from": [
                    // The first entry here is also used to figure out the "non-magic parent path" from a glob string
                    // Copy all files from the public folder
                    "public/**/*",
                    // A "!" at the beginning of the pattern will ignore any files matching that pattern
                    // This ignores all files in the public/tmp folder
                    "!public/tmp/**/*",
                    // Any objects in the array will be collected together to pass to fast-glob as options
                    // This will copy any files starting with a .*
                    // This will not copy symlinked folders
                    { dot: true, followSymlinkedDirectories: false }
                ],
                // to (required parameter)
                //     Data type: string
                //     Summary: This instruction set would write all the files found with the glob patterns and settings
                //     to this folder.
                //     Note: When using glob patterns for the "from" value the target "to" path needs to be a folder
                "to": "build/"
            },

            // Using "from" and "to", both, as objects (and use string based mode entries)
            {
                "from": {
                    // The "from" section should contain details about at least one mode

                    // "default" mode (optional parameter, recommended to have)
                    //     Summary: "default" mode would be used when the command is executed without any mode or when the command
                    //              is executed in a mode which is not described for the given entry
                    //     Data type: string or object
                    "default": "node_modules/example/index.js",

                    // <custom> mode (optional parameter if any other mode exists)
                    "development": "node_modules/example/dev.js",

                    // <custom> mode (optional parameter if any other mode exists)
                    "production": "node_modules/example/production.js"

                    // More <custom> mode entries
                },
                "to": {
                    "default": "example.js"
                }
            },

            // Using "from" and "to", both, as objects (and use object based mode entries)
            {
                "from": {
                    "default": {
                        // src (required parameter)
                        //     Summary: This contains the path of a file which is either on disk or accessible via "http"/"https" URL
                        //     Data type: string
                        "src": "http://example.com/index-1.0.0.js.map",

                        // latest (optional parameter)
                        //     Summary: This contains the path of a file which is either on disk or accessible via "http"/"https" URL
                        //     Data type: string
                        //     Note: When this tools is executed with "--outdated" parameter, then the file from "latest" would be
                        //           compared with the file from "src", and if there are any differences, it would be notified that
                        //           an update is available
                        "latest": "http://example.com/index.js.map"
                    }
                },
                "to": {
                    "default": {
                        // dest (required parameter, when not using "skip" parameter set as true)
                        //     Summary: This instruction set would write a file to this path on the disk
                        //     Data type: string
                        "dest": "scripts/index.js.map",

                        // removeSourceMappingURL (optional parameter)
                        //     Summary: When set to true, any contents after "//# sourceMappingURL=" would be removed before
                        //              the copy operation
                        //     Data type: boolean
                        //     Default value: false
                        "removeSourceMappingURL": false,

                        // uglifyJs (optional parameter)
                        //     Summary: When set to true, this JavaScript file would be uglified before the copy operation
                        //              (via https://www.npmjs.com/package/uglify-js)
                        //     Data type: boolean
                        //     Default value: undefined
                        "uglifyJs": false
                    },
                    "production": {
                        // skip (required parameter, when not using "dest" parameter)
                        //     Summary: If you wish to skip a file in some particular mode, add "skip" as true, otherwise a warning
                        //              would be raised when you run this tool for that particular mode
                        //     Data type: boolean
                        //     Default value: false
                        "skip": true
                    }
                }
            }

            // Add more object entries with "from" and "to" details, and you can use any of the supported data types to
            // represent the values of "from", "to" and their "default" or <custom> modes
        ],

        // copyFilesSettings (optional parameter)
        //     Summary: Settings for the copy files operation
        //     Data type: object
        "copyFilesSettings": {
            // whenFileExists (optional parameter)
            //     Summary: When the file at "to" path already exists, what action should be taken
            //     Data type: string
            //     Supported values: "do-nothing" / "overwrite" / "notify-about-available-change"
            //     Default value: "do-nothing"
            "whenFileExists": "notify-about-available-change",

            // removeSourceMappingURL (optional parameter)
            //     Summary: When set to true, any contents after "//# sourceMappingURL=" would be removed before
            //              the copy operation
            //     Data type: boolean
            //     Default value: false
            "removeSourceMappingURL": false,

            // uglifyJs (optional parameter)
            //     Summary: When set to true, the JavaScript files would be uglified before the copy operation
            //              (via https://www.npmjs.com/package/uglify-js)
            //     Data type: boolean
            //     Default value: false
            "uglifyJs": false,

            // addReferenceToSourceOfOrigin (optional parameter)
            //     Summary: When set to true, the copy operation would create a file "<to-file-path>.source.txt"
            //              which would contain a link to the "from" path
            //     Data type: boolean
            //     Default value: false
            "addReferenceToSourceOfOrigin": false

            // ignoreDotFilesAndFolders (optional parameter)
            //     Summary: When set to true, globbing will ignore files and folders starting with a "." dot.
            //     Data type: boolean
            //     Default value: false
            "ignoreDotFilesAndFolders": true
        }
    }
    ```

## Command line options

```sh
$ copy-files-from-to --help
```

```
Usage:
  copy-files-from-to [--config <config-file>] [--mode <mode-name>] [...]

Examples:
  copy-files-from-to
  copy-files-from-to --config copy-files-from-to.json
  copy-files-from-to --mode production
  copy-files-from-to -h
  copy-files-from-to --version

Options:
     --config <config-file-path>     Path to configuration file
                                     When unspecified, it looks for:
                                         1) copy-files-from-to.cjson
                                         2) copy-files-from-to.json
                                         3) package.json
     --mode <mode-name>              Mode to use for copying the files
                                     When unspecified, it uses "default" mode
     --when-file-exists <operation>  Override "whenFileExists" setting specified in configuration file
                                     <operation> can be "notify-about-available-change" or "overwrite" or "do-nothing"
     --outdated                      Notify about outdated parts of the configuration file
                                     (takes cue from "latest" property, wherever specified)
     --verbose                       Verbose logging
  -v --version                       Output the version number
  -h --help                          Show help
```

# TODO

See [TODO.md](TODO.md)


# About this project

## Author

* Priyank Parashar - [GitHub](https://github.com/paras20xx) | [Twitter](https://twitter.com/paras20xx) | [LinkedIn](https://linkedin.com/in/ParasharPriyank/)

## Connect to us

* https://webextensions.org/
* [GitHub](https://github.com/webextensions/live-css-editor)
* [Twitter](https://twitter.com/webextensions)

## License

* [MIT](LICENSE)
