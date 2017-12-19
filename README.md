
## Collaborative Whiteboard - Socket.IO 

A simple collaborative whiteboard using socketIO which enables multiple users to draw at the same time. Open links in two seperate tabs in your browser or Open link in another computer try drawing simultaneously in both. Cool, isn't ?

## How to use

Git clone the repo. 

```
$npm install
```

```
$ node index.js
```

And open browser to `http://localhost:3001`. Optionally, specify
a port by supplying the `PORT` env variable.

##### Enable heroku features:enable http-session-affinity in your instance while deploying to heroku. This is necessary to open communication ports for web sockets.


## Features

- Draw on the whiteboard and all other users will see you drawings live.
- Ability for each user to use their seperate drawing tool.
- Choose Colours, fonts, fontsizes and thinkness.



PS: Previous sessions are not saved on the server, it will not be available for newly joined. Saved sessions if you want.
