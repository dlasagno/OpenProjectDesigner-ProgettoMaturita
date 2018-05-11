import { TabController } from "../tab-window-scripts/tab.controller"
import { Tab } from "./tab";
import { MenuItem } from './tab-menu';
import { TabController } from "../tab-window-scripts/tab-controller";

var fs = require('fs');
var data = fs.readFileSync('../../data/project.json', 'utf-8');
var projects = JSON.parse(data);



/*for ( const project of projects) {
  const task: Task {
    title: project.title
    description: project.description
    collapsed: project.collapsed
    format: project.format
    start_date: project.start_date
    end_date: project.end_date
    progress: project.progress
    cost: project.const
    appointee: project.appointee
  }

}*/

const ganttTab: Tab = {
  name: 'GANTT',
  icon: 'th-list',
  menuItems: [
    {
      
    }
  ],
  view(tabController: TabController): Element {

    return document.createElement('a')
  }
}
