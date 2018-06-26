import { Tree, Task } from '../commons/interfaces'
import * as fs from 'fs'

export class FileManager {
  static toFile(path: string, tasks: Tree<Task>): void {
    //Create an array of tasks for an easier reading of the file
    const tasksArray: {data: any, id: string}[] = tasks.reduce((taskArray, {data}, id) => {
      taskArray.push({data, id})
      return taskArray
    }, [])

    //Write the tasks to the file
    const fileString: string = JSON.stringify(tasksArray)
    fs.writeFileSync(path, fileString)
  }

  static fromFile(path: string): Tree<Task>{
    //Read the tasks from the file
    const fileString: string = fs.readFileSync(path, 'utf-8')
    const fileTasks: {data: any, id: string}[] = JSON.parse(fileString)
    //Convert dates from string to Date
    fileTasks.forEach(task => {
      task.data.start_date = new Date(task.data.start_date)
      task.data.end_date = new Date(task.data.end_date)
    })

    //Generate the task's tree
    return fileTasks.slice(1, -1).reduce((tasks, {data: task, id}) => {
      tasks.getNodeById(id.split('.').slice(0, -1).join('.')).appendChild(task)
      return tasks
    }, new Tree(fileTasks[0].data))
  }
}
