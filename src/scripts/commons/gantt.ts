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
      const th1 = document.createElement('th')
      th1.innerHTML = `1`
      const th2 = document.createElement('th')
      th2.innerHTML = task.title
      const th3 = document.createElement('th')
      th3.innerHTML = task.start_date
      const th4 = document.createElement('th')
      th4.innerHTML = task.end_date
      const th5 = document.createElement('th')
      th5.innerHTML = `<progress max="100" value="${task.progress}">`
      const th6 = document.createElement('th')

      if(task.cost != null)
        th6.innerHTML = task.cost
      else
        th6.innerHTML = `0`

      tr.appendChild(th1)
      tr.appendChild(th2)
      tr.appendChild(th3)
      tr.appendChild(th4)
      tr.appendChild(th5)
      tr.appendChild(th6)
      return tr

    }


    const table = document.createElement('table')

    const tr = document.createElement('tr')
    const th1 = document.createElement('th')
    th1.innerHTML = `#`
    const th2 = document.createELement('th')
    th2.innerHTML = `Task`
    const th3 = document.createElement('th')
    th3.innerHTML = `Start date`
    const th4 = document.createELement('th')
    th4.innerHTML = `End date`
    const th5 = document.createElement('th')
    th5.innerHTML = `<progress max="100" value="50">`
    const th6 = document.createELement('th')
    th6.innerHTML = `Costo`
    tr.appendChild(th1)
    tr.appendChild(th2)
    tr.appendChild(th3)
    tr.appendChild(th4)
    tr.appendChild(th5)
    tr.appendChild(th6)
    table.appendChild(tr)


    table.appendChild(createRow(tasks))
    if(tasks.children[0]){
      for(const task of tasks.children){
        table.appendChild(createRow(task))
        if(task.children[0]){
          for(const task of task.children){
            table.appendChild(createRow(task))
          }
        }
      }
    }

    return table

  }
}
