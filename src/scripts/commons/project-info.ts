import { TabController } from '../tab-window-scripts/tab-controller'
import { Task, Tab } from './interfaces'


const projectInfoTab: Tab = {
    name: 'Project Info',
    icon: 'fa-th-list',
    menuItems: [],
    view(tabController: TabController): Element {
        
        const projectInfoElement = document.createElement('div')
        const table = document.createElement('table')
    
        const infoHeader = document.createElement('tr')
              infoHeader.innerHTML = `
                <th>Title</th>
                <th>Cost</th>
                <th>Progress</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Description</th>
              `
                
        const infoContent = document.createElement('tr')
              infoContent.innerHTML = `
                <td>${tabController.tasks.root.data.title}</td>
                <td>${tabController.tasks.root.data.cost}</td>
                <td>${tabController.tasks.root.data.progress}</td>
                <td>${tabController.tasks.root.data.start_date.toLocaleDateString()}</td>
                <td>${tabController.tasks.root.data.end_date.toLocaleDateString()}</td>
                <td>${tabController.tasks.root.data.description}</td>
              `
              
        table.appendChild(infoHeader)
        table.appendChild(infoContent)
        projectInfoElement.appendChild(table)
    
        return projectInfoElement
    }
}
