import {Readable} from "node:stream"

//simula a leitura de um arquivo grande 
class OneToHundred extends Readable {
    index = 20

    _read () {
        const i = this.index++

        setTimeout(() => {
            if(i > 30){
                this.push(null) //finaliza o processo
            }else{
                const buff = Buffer.from(String(`${i} `))
                this.push(buff)
            }
        }, 250)

    }
}

//simula o upload desse arquivo
const response = await fetch("http://localhost:3334", {
    method: 'POST',
    body: new OneToHundred(),
    duplex: 'half'
})

const data = await response.json()
console.log(data)
