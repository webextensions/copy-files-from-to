# TODO

* Refactor code
* Check the support for copying files across different partition (w.r.t. executing program) on Windows
* If the operation attempts to modify a file outside the `process.cwd()`/config-file-directory, then `--unsafe` parameter must be passed
* Consider adding support for npm modules via https://unpkg.com/
* Consider adding option to use soft links, rather than copying the files
* Check if any speed improvements (probably via changes in parallelisation) can be done
* Add `--clean` option (to "Delete the files mentioned in `"to"` entries (for all modes)")
  * Also add an option to "clean empty directories"
* Add support for loading `.js` files as configuration
* Add more logging when running with `--verbose` option
* Add `--silent` option
* Consider adding support to auto convert GitHub links to raw content links
* Consider adding support for `bower.json`
* Write test-cases
