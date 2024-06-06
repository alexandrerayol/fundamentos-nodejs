import http from "node:http"
import { routes } from "./routes.js"
import { json } from "./middleware/json.js"

const server = http.createServer( async (req, res) => {
    await json(req,res) //middleware

    const { method, url } = req
    
    const route = routes.find(route => {
        return route.method === method
         && route.path.test(url) //se a url respeitar o padrão da regex a função retorna true
    })

    if(route){
        const routeParams = req.url.match(route.path)
        const params = {...routeParams.groups}

        req.params = params

        return route.handler(req, res)
    }

    return res.writeHead(404).end(JSON.stringify({
        error: "not found"
    }))
})

server.listen(3333)