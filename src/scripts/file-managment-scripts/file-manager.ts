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

    const data: string = fs.readFileSync(path, 'utf-8')
    const fileTask = JSON.parse(data)
    fileTask[0].data.start_date = new Date(fileTask[0].data.start_date)
    fileTask[0].data.end_date = new Date(fileTask[0].data.end_date)
    const tasks: Tree<Task> = new Tree(fileTask[0].data)
    
    for(let i = 1; i < fileTask.length; i++) {
      fileTask[i].data.start_date = new Date(fileTask[i].data.start_date)
      fileTask[i].data.end_date = new Date(fileTask[i].data.end_date)
      tasks.getNodeById(fileTask[i].id.split('.').slice(0, -1).join('.')).appendChild(fileTask[i].data)
    }
    
    return tasks
  }
}

module.exports = FileManager
