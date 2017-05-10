# copy-files-from-to
Copy files from one path to another.

# Installation

    $ npm install -g copy-files-from-to

# Usage
Create a file, say `list.json` which looks like:

    [
        {
            "from": "node_modules/jquery/dist/jquery.js",
            "to": "http-pub/3rdparty/jquery/jquery.js"
        },
        {
            "from": "node_modules/react/dist/react.js",
            "to": {
	            "default": "http-pub/3rdparty/react/react.js",
	            "prod": "http-pub/3rdparty/react/react.min.js"
	        }
        }
    ]

**Command**

    $ copy-files-from-to list.json

**Output**

    Copying node_modules/jquery/dist/jquery.js to http-pub/3rdparty/jquery/jquery.js ✓
    Copying node_modules/react/dist/react.js to http-pub/3rdparty/react/react.js ✓

**Also try out**

    $ copy-files-from-to list.json prod
    Starting copy operation in "prod" mode: (overwrite option is on)
    Copying node_modules/jquery/dist/jquery.js to http-pub/3rdparty/jquery/jquery.js ✓
    Copying node_modules/react/dist/react.js to http-pub/3rdparty/react/react.min.js ✓

**Use cases**

* This tool is useful when a small set of files needs to be copied.
* This works as a basic alternative for bower where you wish to copy the scripts out of node_modules folder.
