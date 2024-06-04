import http from "node:http"

const users = []
const server = http.createServer( async (req, res) => {
    const allowedMethods = ["GET", "POST"]
    const { method, url } = req
    
    if(!allowedMethods.includes(method)){
        
        return res
        .writeHead(405, {'Content-Type': 'application/json'})
        .end(JSON.stringify({
            error: "method not allowed"
        }))
    }
    
    const buffers = []
    let body = null

    for await (const chunk of req){
        buffers.push(chunk)
    }

    if(method === 'POST' && url === '/users' ){
        try{    
            body = JSON.parse(buffers.concat().toString())

            const {email, name } = body

            if(!email || !name){
                throw Error
            }

            users.push({email, name})
        }catch{
            return res
            .writeHead(400, {'Content-Type': 'application/json'})
            .end(JSON.stringify({
                error: "bad request && invalid body"
            }))
        }

        const {name, email} = body

        return res
        .writeHead(201, {'Content-Type': 'application/json'})
        .end(JSON.stringify({
            message: `${name} and ${email} saved`
        }))
    }

    if(method === 'GET' && url === '/users'){
        return res
        .writeHead(200, {'Content-Type': 'application/json'})
        .end(JSON.stringify({
            data: {
                users
            }
        }))
    }
})

server.listen(3333)