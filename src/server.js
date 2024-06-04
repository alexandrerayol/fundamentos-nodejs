import http from "node:http"
import { randomUUID } from "node:crypto"
import { Database } from "./database.js"

const database = new Database()

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

            const {name, email } = body

            if(!email || !name){
                throw Error
            }

            const newUser = {
                id: randomUUID(),
                name,
                email
            }

            database.insert('users', newUser)
        }catch{
            return res
            .writeHead(400, {'Content-Type': 'application/json'})
            .end(JSON.stringify({
                error: "bad request && invalid body"
            }))
        }

        const {name} = body

        return res
        .writeHead(201, {'Content-Type': 'application/json'})
        .end(JSON.stringify({
            message: `user ${name} saved`
        }))
    }

    if(method === 'GET' && url === '/users'){
        const users = database.select('users')
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