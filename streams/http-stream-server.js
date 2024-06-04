import http from "node:http"
import {Transform, Writable} from "node:stream"

class InverseNumber extends Transform {
    _transform (chunk, encoding, callback) {
        const transformed = Number(chunk.toString()) * -1
        const buff = Buffer.from(transformed.toString())
        callback(null,buff)
    }
}

class PrintUploadDataStream extends Writable {
    _write(chunk, encoding, callback) {
        console.log(Number(chunk))
        callback()
    }
}

const server = http.createServer( async (req, res) => {
    const buffers = []

    for await (const chunk of req) {
        buffers.push(Number(chunk))
    }

    console.log(buffers)
    res.end(JSON.stringify(buffers))
})

server.listen(3334)