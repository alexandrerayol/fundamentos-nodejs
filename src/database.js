import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor () {
        fs.readFile(databasePath, 'utf8')
        .then(data => {
            this.#database = JSON.parse(data)
        }).catch( error => {
            this.#persist()
        })
    }

    #persist () {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select (table, searchParam) {
        if(searchParam){
            const data = this.#database[table].filter( element => {
                if(element.name.includes(searchParam) || element.email.includes(searchParam)){
                    return element
                }
                return false
            })

            return data
        }

        const data = this.#database[table] ?? []
        return data
    }

    insert (table, data){
        if(Array.isArray(this.#database[table])){
            this.#database[table].push(data)
        }else{
            this.#database[table] = [data]
        }

        this.#persist() //atualiza o bd
        return data
    }

    update (table, id, data) {
        if(Array.isArray(this.#database[table])){
            const rowIndex = this.#database[table].findIndex(element => element.id === id)

            if(rowIndex > -1){
                this.#database[table][rowIndex] = {id, ...data}
                this.#persist()
                return true
            }

            return false
        }
    }

    delete (table, id){
        if(Array.isArray(this.#database[table])){
            const rowIndex = this.#database[table].findIndex(element => element.id === id)

            if(rowIndex > -1){
                this.#database[table].splice(rowIndex, 1)
                this.#persist()
                return true
            }

            return false
        }
    }
}