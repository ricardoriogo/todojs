const fs = require('fs')
const os = require('os')
const path = require('path')

class TodoJS {
    constructor() {

        this.path = path.resolve((process.argv.includes('-g') ? os.homedir() : ''), 'todo.json')

        if (!fs.existsSync(this.path)) {
            this.json = {
                config: {},
                items: []
            }
        } else {
            this.json = require(this.path)
        }

        const commands = ['add', 'check']

        commands.forEach(cmd => {
            let text = this.parseCommand(cmd)
            text && this[cmd](text)
        })

        this.list()
        this.save()
    }

    parseCommand(cmd) {
        let index = process.argv.indexOf(cmd)
        if (index != -1) {
            return process.argv[(index + 1)]
        }
        return false
    }

    add(item) {
        this.json.items.push({
            name: item,
            done: false
        })
    }

    check(index) {
        this.json.items[index - 1].done = !this.json.items[index - 1].done;
    }

    list() {
        this.json.items.forEach((item, index) => {
            console.log(`${index + 1}: `, (item.done ? '✔' : '✗'), item.name);
        })
    }

    save() {
        fs.writeFile(this.path, JSON.stringify(this.json, null, 4), (err, file) => {
            if (err) throw err
            //console.log('Saved!')
        })
    }
}

new TodoJS();