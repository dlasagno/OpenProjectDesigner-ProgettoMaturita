import { Tree, Task } from '../commons/interfaces'
//const { Tree, Task } = require('../commons/interfaces')
const fs = require('fs')

const FileManager = {
  toFile(tasks: Tree<Task>) {

    let array: Object[] = []

    tasks.forEach((task, id) => {
      const data = task.data
      array.push({data, id})
    })

    const fileString: string = JSON.stringify(array)
    fs.writeFileSync('src/data/prova.json', fileString, function(err) {
      if (err) throw err
      console.log('file scritto')
    })

  },

  fromFile(path: string): Tree<Task>{

    const data = fs.readFileSync(path, 'utf-8')
    const fileTask = JSON.parse(data)
    const tasks: Tree<Task> = new Tree(fileTask[0].data)
    
    for(let i = 1; i < fileTask.length; i++)
      tasks.getNodeById(fileTask[i].id.split('.').slice(0, -1).join('.')).appendChild(fileTask[i].data)
    
    return tasks
  }
}

module.exports = FileManager
