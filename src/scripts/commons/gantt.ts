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


    function createRow(task: Task){
      const tr = document.createElement('tr')
      const td1 = document.createElement('td')
      th1.innerHTML = `1`
      const td2 = document.createElement('td')
      th2.innerHTML = task.title
      const td3 = document.createElement('td')
      th3.innerHTML = task.start_date
      const td4 = document.createElement('td')
      th4.innerHTML = task.end_date
      const td5 = document.createElement('td')
      th5.innerHTML = `<progress max="100" value="${task.progress}">`
      const td6 = document.createElement('td')

      if(task.cost != null)
        th6.innerHTML = task.cost
      else
        th6.innerHTML = `0`

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
      if(task.children[0]){
        for(const task of task.children){
          createRow(task)
        }
      }


    }


    const table = document.createElement('table')

    const tr = document.createElement('tr')
    const th1 = document.createElement('th')
    th1.innerHTML = `#`
    th1.setAttribute("rowspan", "2")
    const th2 = document.createELement('th')
    th2.innerHTML = `Task`
    th2.setAttribute("rowpan", "2")
    const th3 = document.createElement('th')
    th3.innerHTML = `Start date`
    th3.setAttribute("rowspan", "2")
    const th4 = document.createELement('th')
    th4.innerHTML = `End date`
    th4.setAttribute("rowpan", "2")
    const th5 = document.createElement('th')
    th5.innerHTML = `<progress max="100" value="50">`
    th5.setAttribute("rowspan", "2")
    const th6 = document.createELement('th')
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
    table.appendChild(tr)

    const trA = document.createElement('tr')
    const th1A = document.createElement('th')
    const th2A = document.createElement('th')
    const th3A = document.createElement('th')
    const th4A = document.createElement('th')
    const th5A = document.createElement('th')
    const th6A = document.createElement('th')
    trA.appendChild(th1A)
    trA.appendChild(th2A)
    trA.appendChild(th3A)
    trA.appendChild(th4A)
    trA.appendChild(th5A)
    trA.appendChild(th6A)

    //le celle con i giorni
    for(let i = 0; i < 8; i++){
        const th7A = document.createElement('th')
        th7A.innerHTML = i
        trA.appendChild(th7A)
    }
    table.appendChild(trA)

    for(const task of TabController.tasks.children){
      createRow(task)
    }

    return table
    }
  }
}
