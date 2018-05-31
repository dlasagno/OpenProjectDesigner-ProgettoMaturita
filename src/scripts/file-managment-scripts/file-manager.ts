import { Tree, Task } from '../commons/interfaces'
//const { Tree, Task } = require('../commons/interfaces')
const fs = require('fs')

const FileManager = {
  toFile(tasks: Tree<Task>) {
    const fileString: string = JSON.stringify(tasks)
  }
}

module.exports = FileManager
