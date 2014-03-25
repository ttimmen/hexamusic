hexamusic
=========

* 1 node server for the app (default port 3000), 1 separate node process (no server) for twitter: node-twitter-stats
* correct twitter keys to be filled out in node-twitter-stats/config.js
* url of midiserver possibly to be adapted in app/app.js
* url of appserver possibly to be adapted in node-twitter-stats/app.js
* TODO: display tweets instead of hashtags on 1 year MiX?

## Installation

### Install Node.js
* Get Node.js from http://nodejs.org
* Install it

### Install Dependencies
Run
    
    npm install

from the ```app/``` folder.

AND Run
    
    npm install

from the ```node-twitter-stats/``` folder.

## Running the code

run

    node app.js

from the ```node-twitter-stats/``` folder.

AND run

    node app.js

from the ```app/``` folder.

### Visuals

Go to

    http://localhost:3000/projectie/scherm.html

### Leap Motion

Connection your Leap Motion and go to 

    http://localhost:3000/leapmotion/index.html



### Smartphone interface

Use your smartphone and go to

    http://localhost:3000/smartphone/index2.html

