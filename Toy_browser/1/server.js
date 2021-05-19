const http = require('http')

const port = process.env.PORT || 8000

const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end(`
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <title>Title</title>
            <style>
                body #myid {
                    width: 100px;
                    background: darkblue;
                }
                body img {
                    width: 200px;
                }
            </style>
        </head>
        <body>
            <img id="myid" />
            <img />
        </body>
        </html>
    `)
})

server.listen(port, () => {
    console.log(`Server running at port ${port}`)
})