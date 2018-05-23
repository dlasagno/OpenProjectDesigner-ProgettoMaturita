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

    function createRow(task: Task, taskId: string): HTMLTableRowElement {
      const tr = document.createElement('tr')
      tr.innerHTML = `
        <td>${taskId}</td>
        <td>${task.title}</td>
        <td>${task.start_date}</td>
        <td>${task.end_date}</td>
        <td><progress max="100" value="${task.progress}"></td>
        <td>${task.cost ? '' : task.cost}</td>
      `
      tr.addEventListener('click', () => {
        console.log(taskId)
        tabController.selectedTaskId = taskId
      })

      for (let i = 0; i < 8; i++) {
        const td7 = document.createElement('td')
              td7.innerHTML = ` `
              tr.appendChild(td7)
      }

      return tr
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
      <th colspan="${days[getStartMonthTask(tabController.tasks.root.data) - 1].length}">${months[getStartMonthTask(tabController.tasks.root.data) - 1]} ${getYearTask(tabController.tasks.root.data)}</th>
    `
    ganttTable.appendChild(ganttHeader)

    //Add days to the gantt's header row
    const ganttDaysRow = document.createElement('tr')

    //controlla in che mese è il progetto e dopodiché crea i giorni
    for (let i = 0; i < days[getStartMonthTask(tabController.tasks.root.data) - 1].length; i++) {
      const dayCell = document.createElement('th')
            dayCell.innerHTML = (i + 1).toString()
      ganttDaysRow.appendChild(dayCell)
    }
    ganttTable.appendChild(ganttDaysRow)

    //Add tasks rows to the gantt's table
    tabController.tasks.forEach(({data: task}, id) => {
      if(id)
        ganttTable.appendChild(createRow(task, id))
    })
    return ganttTable
  }
}
