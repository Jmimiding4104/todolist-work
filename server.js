const http = require('http');

const requestListener = (req,res) => {
    res.writeHead(200,{"Content-Type":"application/json"})
    res.write('{"obj":"123"}')
    res.end();
}

const server = http.createServer(requestListener);
server.listen( process.env.PORT || 3006 );