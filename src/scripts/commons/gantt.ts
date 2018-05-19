import { TabController } from '../tab-window-scripts/tab-controller'
import { Task, Tab } from './interfaces'


const ganttTab: Tab = {
  name: 'GANTT',
  icon: 'fa-th-list',
  menuItems: [],
  view(tabController: TabController): Element {

    const months = [
      'Gennaio',
      'Febbraio',
      'Marzo',
      'Aprile',
      'Maggio',
      'Giugno',
      'Luglio',
      'Agosto',
      'Settembre',
      'Ottobre',
      'Novembre',
      'Dicembre'
    ]

    //giorni di ogni mese...
    const days = [
      ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ],
      ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'],
      ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ],
      ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
      ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ],
      ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
      ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ],
      ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ],
      ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
      ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ],
      ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
      ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ],
    ]


    function getStartMonthTask(task: Task){
      return parseInt(task.start_date.split('-')[1])
    }


    function getYearTask(task: Task){
      return parseInt(task.start_date.split('-')[2])
    }

    function createRow(task: Task, taskId: string, taskChildId: string) {

      let idd
      if (taskChildId == '0')
        idd = `${taskId}`
      else
        idd = `${taskId}.${taskChildId}`

      const tr = document.createElement('tr')
        const td1 = document.createElement('td')
              td1.innerHTML = `${idd}`
              td1.addEventListener('click', () => tabController.selectedTaskId = idd)
        const td2 = document.createElement('td')
              td2.innerHTML = `${task.title}`
              td2.addEventListener('click', () => tabController.selectedTaskId = idd)
        const td3 = document.createElement('td')
              td3.innerHTML = `${task.start_date}`
              td3.addEventListener('click', () => tabController.selectedTaskId = idd)
        const td4 = document.createElement('td')
              td4.innerHTML = `${task.end_date}`
              td4.addEventListener('click', () => tabController.selectedTaskId = idd)
        const td5 = document.createElement('td')
              td5.innerHTML = `<progress max="100" value="${task.progress}">`
              td5.addEventListener('click', () => tabController.selectedTaskId = idd)
        const td6 = document.createElement('td')
              if (task.cost != null)
                td6.innerHTML = `${task.cost}€`
              else
                td6.innerHTML = `0€`
              td6.addEventListener('click', tabController.selectedTaskId = idd)
      tr.appendChild(td1)
      tr.appendChild(td2)
      tr.appendChild(td3)
      tr.appendChild(td4)
      tr.appendChild(td5)
      tr.appendChild(td6)

      for (let i = 0; i < 8; i++) {
        const td7 = document.createElement('td')
              td7.innerHTML = ` `
              tr.appendChild(td7)
      }

      ganttTable.appendChild(tr)
      if (task.children)
        for (const childTask of task.children) {
          taskChildId = (parseInt(taskChildId) + 1).toString()
          createRow(childTask, taskId, taskChildId)
        }

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
      <th colspan="${days[getStartMonthTask(tabController.tasks) - 1].length}">${months[getStartMonthTask(tabController.tasks) - 1]} ${getYearTask(tabController.tasks)}</th>
    `


    ganttTable.appendChild(ganttHeader)

    //Add days to the gantt's header row
    const ganttDaysRow = document.createElement('tr')

    //controlla in che mese è il progetto e dopodiché crea i giorni
    for (let i = 0; i < days[getStartMonthTask(tabController.tasks) - 1].length; i++) {
      const dayCell = document.createElement('th')
            dayCell.innerHTML = (i + 1).toString()
      ganttDaysRow.appendChild(dayCell)
    }
    ganttTable.appendChild(ganttDaysRow)

    //Add tasks rows to the gantt's table
    let taskId = '0'
    for (const task of tabController.tasks.children) {
      taskId = (parseInt(taskId) + 1).toString()
      createRow(task, taskId, '0')
    }
    return ganttTable
  }
}
