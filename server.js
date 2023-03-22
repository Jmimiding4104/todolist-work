const http = require('http');

const requestListener = (req,res) => {
    console.log(55);
    res.end();
}

const server = http.createServer(requestListener);
server.listen( process.env.PORT || 3006 );