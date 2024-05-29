import {Readable, Writable, Transform} from 'node:stream'

class OneToHundred extends Readable {
    index = 1

    _read () {
        const i = this.index++

        setTimeout(() => {
            if(i > 100){
                this.push(null) //finaliza o processo
            }else{
                const buff = Buffer.from(String(`${i} `))
                this.push(buff)
            }
        }, 500)

    }
}

class InverseNumber extends Transform {
    _transform (chunk, encoding, callback) {
        const transformed = Number(chunk.toString()) * -1
        const buff = Buffer.from(transformed.toString())

        callback(null,buff)
    }
}

class MultiplyByTen extends Writable {
    _write(chunk, encoding, callback){
        console.log(Number(chunk.toString()) * 10)
        callback()
    }
}

new OneToHundred() //ler um arquivo que vai de 0 a 100 e passar essa info para frente //readable
.pipe(new InverseNumber()) //transformar essa info e passar para frente //transform
.pipe(new MultiplyByTen()) //processar essa info e escrever em algum lugar //writable


//readable
//transform
//Writable
