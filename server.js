const http = require("http")
const { v4: uuidv4 } = require("uuid")

const headers = require("./headers")
const errorHandle = require("./errorHandle");
const { title } = require("process");

const todos = [];

const requestListener = (req, res) => {
    let body = "";
    req.on('data', (chuck) => {
        body += chuck;
    });

    const urlTodos = req.url == '/todos';

    if (urlTodos && req.method == 'GET') {
        res.writeHead(200, headers);
        res.write(
            JSON.stringify({
                "status": "success",
                "data": todos
            })
        );
        res.end();
    } else if (urlTodos && req.method == 'OPTIONS') {
        res.writeHead(200, headers);
        res.end()
    } else if (urlTodos && req.method == 'POST') {
        req.on('end', () => {
            try {
                const title = JSON.parse(body).title;
                if (title !== undefined) {
                    const todo = {
                        title,
                        id: uuidv4()
                    };
                    todos.push(todo);

                    res.writeHead(200, headers);
                    res.write(
                        JSON.stringify({
                            "status": "success",
                            "data": todos
                        })
                    );
                    res.end();
                } else {
                    console.log(55)
                    errorHandle(res);
                }
            } catch (error) {
                console.log(555)
                errorHandle(res)
            }
        })
    } else if (urlTodos && req.method == 'DELETE') {
        todos.length = 0;
        res.writeHead(200, headers);
        res.write(
            JSON.stringify({
                "status": "success",
                "data": todos
            })
        );
        res.end();
    } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') {
        const id = req.url.split('/').pop();
        const index = todos.findIndex((i) => i.id == id);
        if (id !== undefined && index !== -1) {
            todos.splice(index, 1);
            res.writeHead(200, headers);
            res.write(
                JSON.stringify({
                    "status": "success",
                    "data": todos
                })
            )
            res.end();
        } else {
            errorHandle(res)
        }
    } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {
        const id = req.url.split('/').pop();
        const index = todos.findIndex((i) => i.id = id);
        req.on('end', () => {
            try {
                if (id !== undefined && index !== -1) {
                    const title = JSON.parse(body).title;
                    todos[index].title = title;
                    res.writeHead(200, headers);
                    res.write(
                        JSON.stringify({
                            "status": "success",
                            "data": todos
                        })
                    )
                    res.end()
                } else {
                    console.log(1)
                    errorHandle(res)
                }
            } catch (error) {
                console.log(2)
                errorHandle(res)
            }
        })
    }else {
        res.writeHead(404, headers);
        res.write(
            JSON.stringify({
                "status": "false",
                "message": "無此路由"
            })
        );
        res.end();
    }
}

const server = http.createServer(requestListener)
server.listen(process.env.PORT || 3006)
