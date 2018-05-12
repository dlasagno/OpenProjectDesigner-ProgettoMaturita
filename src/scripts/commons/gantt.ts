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

    const table = document.createElement('table')

    //Le celle con i nomi delle varie colonne
    const tr = document.createElement('tr')
    const th1 = document.createElement('th')
    th1.innerHTML = '#'
    const th2 = document.createElement('th')
    th2.innerHTML = 'activity'
    const th3 = document.createElement('th')
    th3.innerHTML = 'star date'
    const th4 = document.createElement('th')
    th4.innerHTML = 'end date'
    const th5 = document.createElement('th')
    th5.innerHTML = 'progress(max="100" value="50")'
    const th6 = document.createElement('th')
    th6.innerHTML = '01-01-2018'
    const th7 = document.createElement('th')
    th7.innerHTML = '02-01-2018'
    const th8 = document.createElement('th')
    th8.innerHTML = '03-01-2018'
    tr.appendChild(th1)
    tr.appendChild(th2)
    tr.appendChild(th3)
    tr.appendChild(th4)
    tr.appendChild(th5)
    tr.appendChild(th6)
    tr.appendChild(th7)
    tr.appendChild(th8)
    table.appendChild(tr)

    for (const project of projects){

      //Inserimento dei dati nelle celle
      const tr = document.createElement('tr')
      const td1 = document.createElement('td')
      td1.innerHTML = project.number
      const td2 = document.createElement('td')
      td2.innerHTML = project.title
      const td3 = document.createElement('td')
      td3.innerHTML = project.start_date
      const td4 = document.createElement('td')
      td4.innerHTML = project.end_date
      const td5 = document.createElement('td')
      td5.innerHTML = `progress(max="100" value=${project.progress})`
      const td6 = document.createElement('td')
      const td7 = document.createElement('td')
      const td8 = document.createElement('td')
      tr.appendChild(td1)
      tr.appendChild(td2)
      tr.appendChild(td3)
      tr.appendChild(td4)
      tr.appendChild(td5)
      tr.appendChild(td6)
      tr.appendChild(td7)
      tr.appendChild(td8)
      table.appendChild(tr)

      //Se la task ha delle task come children, vengono inserite nella tabella
      if(project.children[0]){
        for(const children of project.children){
          const tr = document.createElement('tr')
          const td1 = document.createElement('td')
          td1.innerHTML = children.number
          const td2 = document.createElement('td')
          td2.innerHTML = children.title
          const td3 = document.createElement('td')
          td3.innerHTML = children.start_date
          const td4 = document.createElement('td')
          td4.innerHTML = children.end_date
          const td5 = document.createElement('td')
          td5.innerHTML = `progress(max="100" value=${children.progress})`
          const td6 = document.createElement('td')
          const td7 = document.createElement('td')
          const td8 = document.createElement('td')
          tr.appendChild(td1)
          tr.appendChild(td2)
          tr.appendChild(td3)
          tr.appendChild(td4)
          tr.appendChild(td5)
          tr.appendChild(td6)
          tr.appendChild(td7)
          tr.appendChild(td8)
          table.appendChild(tr)
        }
      }
    }
    return table
  }
}
