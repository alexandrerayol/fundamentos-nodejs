export async function json (req, res){
    const buffers = []

    for await (const chunk of req){
        buffers.push(chunk)
    }

    try {
        req.body = JSON.parse(buffers.concat().toString())
    } catch (error) {
        req.body = null
    }

    return res.setHeader('Content-Type', 'application/json')
}