import { TabController } from "../tab-window-scripts/tab.controller"
import { Tab } from "./tab";
import { MenuItem } from './tab-menu';
import { TabController } from "../tab-window-scripts/tab-controller";

var fs = require('fs');
var data = fs.readFileSync('../../data/project.json', 'utf-8');
var projects = JSON.parse(data);


const ganttTab: Tab = {
  name: 'GANTT',
  icon: 'th-list',
  menuItems: [
    {

    }
  ],
  view(tabController: TabController): Element {


    function createRow(task: Task, id: string, idChild: string){
      const tr = document.createElement('tr')
      const td1 = document.createElement('td')
            if(idChild == 0)
              td1.innerHTML = `${id}`
            else
              td1.innerHTML = `${id}.${idChild}`
      const td2 = document.createElement('td')
            td2.innerHTML = `${task.title}`
      const td3 = document.createElement('td')
            td3.innerHTML = `${task.start_date}`
      const td4 = document.createElement('td')
            td4.innerHTML = `${task.end_date}`
      const td5 = document.createElement('td')
            td5.innerHTML = `<progress max="100" value="${task.progress}">`
      const td6 = document.createElement('td')

      if(task.cost != null)
        td6.innerHTML = `${task.cost}€`
      else
        td6.innerHTML = `0`

      tr.appendChild(td1)
      tr.appendChild(td2)
      tr.appendChild(td3)
      tr.appendChild(td4)
      tr.appendChild(td5)
      tr.appendChild(td6)

      for(let i = 0; i < 8; i++){
        const td7 = document.createElement('td')
        td7.innerHTML = ` `
        tr.appendChild(td7)
      }

      table.appendChild(tr)
      if(task.children)
        for(const childTask of task.children){
          idChild++
          createRow(childTask, id, idChild)
        }
    }


    const table = document.createElement('table')

    const tr = document.createElement('tr')
    const th1 = document.createElement('th')
    th1.innerHTML = `#`
    th1.setAttribute("rowspan", "2")
    const th2 = document.createElement('th')
    th2.innerHTML = `Task`
    th2.setAttribute("rowspan", "2")
    const th3 = document.createElement('th')
    th3.innerHTML = `Start date`
    th3.setAttribute("rowspan", "2")
    const th4 = document.createElement('th')
    th4.innerHTML = `End date`
    th4.setAttribute("rowspan", "2")
    const th5 = document.createElement('th')
    th5.innerHTML = `<progress max="100" value="50">`
    th5.setAttribute("rowspan", "2")
    const th6 = document.createElement('th')
    th6.innerHTML = `Costo`
    th6.setAttribute("rowspan", "2")
    const th7 = document.createElement('th')
    th7.innerHTML = `Gennaio 2018`
    th7.setAttribute("colspan", "8")

    tr.appendChild(th1)
    tr.appendChild(th2)
    tr.appendChild(th3)
    tr.appendChild(th4)
    tr.appendChild(th5)
    tr.appendChild(th6)
    tr.appendChild(th7)
    table.appendChild(tr)

    const trA = document.createElement('tr')

    //le celle con i giorni
    for(let i = 0; i < 8; i++){
        const th7A = document.createElement('th')
        th7A.innerHTML = (i + 1).toString()
        trA.appendChild(th7A)
    }
    table.appendChild(trA)

    const id = '0'
    for(const task of tabController.tasks.children){
      id++
      createRow(task, id, '0')
    }
    return table
  }
}
