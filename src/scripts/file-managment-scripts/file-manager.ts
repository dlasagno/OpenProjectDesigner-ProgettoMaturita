import { Tree, Task } from '../commons/interfaces'
//const { Tree, Task } = require('../commons/interfaces')
const fs = require('fs')

const FileManager = {
  toFile(tasks: Tree<Task>) {
    const fileString: string = JSON.stringify(tasks)
    fs.writeFile('src/data/prova.json', fileString, function(err) {
    if (err) throw err
    console.log('file scritto')}
    )
  },

  fromFile(path: string){
    const data = fs.readFileSync(path, 'utf-8')
    const fileTask = JSON.parse(data)
    console.log(fileTask)
  }
}

module.exports = FileManager
