import { Tree, Task } from '../commons/interfaces'
//const { Tree, Task } = require('../commons/interfaces')
const fs = require('fs')

const FileManager = {
  toFile(tasks: Tree<Task>) {
    const fileString: string = JSON.stringify(tasks)
    fs.writeFileSync('src/data/prova.json', fileString)
    console.log('file scritto')
  },

  fromFile(path: string): Tree<Task>{
    const data = fs.readFileSync(path, 'utf-8')
    const fileTask = JSON.parse(data)
    console.log(fileTask)
    return fileTask
  }
}

module.exports = FileManager
