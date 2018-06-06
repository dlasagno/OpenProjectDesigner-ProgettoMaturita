import { Tree, Task } from '../commons/interfaces'
//const { Tree, Task } = require('../commons/interfaces')
const fs = require('fs')

const FileManager = {
  toFile(tasks: Tree<Task>) {
    const fileString: string = JSON.stringify(tasks)
    fs.writeFileSync('src/data/prova.json', fileString, function(err) {
    if (err) throw err
    console.log('file scritto')}
    )
  },

  fromFile(path: string): Tree<Task>{
    

    const data = fs.readFileSync(path, 'utf-8')
    const fileTask = JSON.parse(data)
    const tasks: Tree<Task> = new Tree(fileTask._root.data)
    for(const child of fileTask._root._children){
      tasks.root.appendChild(child)
    }
    return tasks
  }
}

module.exports = FileManager
