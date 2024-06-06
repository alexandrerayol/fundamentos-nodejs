import { Database } from "./database.js"
import { randomUUID } from "node:crypto"
import { buildRoutePath } from "./utils/build-route-path.js"
import { extractQueryParams } from './utils/extract-query-params.js'
const database = new Database()

export const routes = [
    {
        method: "GET",
        path: buildRoutePath("/users") ,
        handler: (req, res) => {

            let users = null

            const { query } = req.params


            if(query){
                const queryParams = extractQueryParams(query)
                const searchParam = queryParams['search']

                if(searchParam){
                    users = database.select('users', searchParam)

                    return res
                    .writeHead(200)
                    .end(JSON.stringify({
                        data: {
                            users
                        }
                    }))
                }
            }


            users = database.select('users', null)

            return res
            .writeHead(200)
            .end(JSON.stringify({
                data: {
                    users
                }
            }))
        }
    },
    {
        method: "POST",
        path: buildRoutePath("/users") ,
        handler: (req, res) => {
            const {name, email} = req.body

            const newUser = {
                id: randomUUID(),
                name,
                email
            }
    
            database.insert('users', newUser)

            return res
            .writeHead(201)
            .end(JSON.stringify({
                message: `user was saved`
            }))
        }
    },
    {
        method: "PUT",
        path: buildRoutePath("/users/:id"),
        handler: (req, res) => {
            const { id } = req.params
            const {name, email} = req.body
            const data = {name, email}

            const isUserWasUpdated = database.update('users', id, data)

            if(!isUserWasUpdated){
                return res.writeHead(400).end(JSON.stringify({
                    message: 'user not found'
                }))
            }

            return res.writeHead(200).end(JSON.stringify({
                message: `user id ${id} was updated`
            }))
        }
    },
    {
        method: "DELETE",
        path: buildRoutePath("/users/:id"),
        handler: (req, res) => {
            const { id } = req.params
            const isUserWasDeleted = database.delete('users', id)

            if(!isUserWasDeleted){
                return res.writeHead(400).end(JSON.stringify({
                    message: 'user not found'
                }))
            }

            return res.writeHead(200).end(JSON.stringify({
                message: `user id ${id} was deleted`
            }))
        }
    },
]