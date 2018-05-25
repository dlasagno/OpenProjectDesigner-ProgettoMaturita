import { TabController } from '../tab-window-scripts/tab-controller'
import { Task, Tab } from './interfaces'


const ganttTab: Tab = {
  name: 'GANTT',
  icon: 'fa-th-list',
  menuItems: [],
  view(tabController: TabController): Element {

    function createRow(task: Task, taskId: string): HTMLTableRowElement {
      const taskRow = document.createElement('tr')
      taskRow.innerHTML = `
        <td>${taskId}</td>
        <td>${task.title}</td>
        <td>${task.start_date.toLocaleDateString()}</td>
        <td>${task.end_date.toLocaleDateString()}</td>
        <td><progress max="100" value="${task.progress}"></td>
        <td>${task.cost ? '' : task.cost}</td>
      `
      const date = new Date(tabController.tasks.root.data.start_date)
      date.setDate(1)
      while (date.getTime() < tabController.tasks.root.data.end_date.getTime()){
        const dayCell: Element = document.createElement('td')
        if (date.getTime() >= task.start_date.getTime() && date.getTime() <= task.end_date.getTime())
          dayCell.classList.add('fill')
        taskRow.appendChild(dayCell)
        date.setDate(date.getDate() + 1)
      }

      taskRow.addEventListener('click', () => {
        console.log(taskId)
        tabController.selectedTaskId = taskId
      })

      return taskRow
    }


    //Create the gantt's table
    const ganttTable = document.createElement('table')

    //Craete the gantt's header row
    const ganttHeader = document.createElement('tr')
          ganttHeader.innerHTML = `
            <th rowspan="2">#</th>
            <th rowspan="2">Task</th>
            <th rowspan="2">Start date</th>
            <th rowspan="2">End date</th>
            <th rowspan="2"><progress max="100" value="50"></th>
            <th rowspan="2">Costo</th>
          `
    
    //Add days to the gantt's header row
    const ganttDaysRow = document.createElement('tr')
    
    //controlla in che mese è il progetto e dopodiché crea i giorni
    const date = new Date(tabController.tasks.root.data.start_date)
    date.setDate(1)
    while (date.getTime() < tabController.tasks.root.data.end_date.getTime()){
      const monthCell: Element = document.createElement('th')
      monthCell.innerHTML = date.toISOString().slice(0, 7)
      
      const nextMonth = new Date(date)
      nextMonth.setMonth(date.getMonth() + 1)
      let daysCounter: number = 0
      while (date.getTime() < nextMonth.getTime()) {
        const dayCell: Element = document.createElement('th')
        dayCell.innerHTML = date.getDate().toString()
        
        ganttDaysRow.appendChild(dayCell)
        date.setDate(date.getDate() + 1)
        daysCounter++
      }
      
      monthCell.setAttribute('colspan', daysCounter.toString())
      ganttHeader.appendChild(monthCell)
    }
    ganttTable.appendChild(ganttHeader)
    ganttTable.appendChild(ganttDaysRow)

    //Add tasks rows to the gantt's table
    tabController.tasks.forEach(({data: task}, id) => {
      if(id)
        ganttTable.appendChild(createRow(task, id))
    })

    return ganttTable
  }
}







const task = {
  title: 'Progetto',
  description: 'desrizione progetto',
  collapsed: false,
  start_date: new Date('2018-01-01'),
  end_date: new Date('2018-01-03'),
  progress: 50,
  cost: 3000
}

const taskRow = {
  appendChild(arg){}
}

const startDate = new Date('2018-08-05')
const endDate = new Date('2019-02-23')

let date = new Date(startDate)
date.setDate(1)

while (date.getTime() < endDate.getTime()){
  const nextMonth = new Date(date)
  nextMonth.setMonth(date.getMonth() + 1)

  while (date.getTime() < nextMonth.getTime()) {
    //CODE HERE ...
    date.setDate(date.getDate() + 1)
  }
}

date = new Date(startDate)
date.setDate(1)
while (date.getTime() < endDate.getTime()){
  const dayCell = {
    classList: {
      add(arg){}
    }
  }
  if (date.getTime() >= task.start_date.getTime() && date.getTime() <= task.end_date.getTime())
    dayCell.classList.add('fill')
  taskRow.appendChild(dayCell)
  date.setDate(date.getDate() + 1)
}

console.log(date.toISOString().slice(0, 7))
