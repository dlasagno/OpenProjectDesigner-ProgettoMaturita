import { TabController } from '../tab-window-scripts/tab-controller'
import { Property, Task, Tab } from './interfaces'



export const projectInfoTab: Tab = {
    name: 'Info',
    icon: 'fa-info-circle',
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
            
        //td for the title
        const title = document.createElement('td')
        const titleContent = document.createElement('div')
              titleContent.innerHTML = tabController.tasks.root.data.title
              titleContent.setAttribute('contenteditable', 'true')
              titleContent.addEventListener('keydown', event => {
                if (event.key === "Enter") {
                    const value = titleContent.innerHTML
                    tabController.tasks.root.data.title = value
                    tabController.update()
                }
              })
        title.appendChild(titleContent)
        infoContent.appendChild(title)

        //td for the cost
        const cost = document.createElement('td')
        const costContent = document.createElement('div')
              costContent.innerHTML = tabController.tasks.root.data.cost.toString()
              costContent.setAttribute('contenteditable', 'true')
              costContent.addEventListener('keydown', event => {
                if (event.key === "Enter") {
                    const value = costContent.innerHTML
                    tabController.tasks.root.data.cost = parseInt(value)
                    tabController.update()
                }
              })
        cost.appendChild(costContent)
        infoContent.appendChild(cost)

        //td for the progress
        const progress = document.createElement('td')
        const progressContent = document.createElement('div')
              progressContent.innerHTML = tabController.tasks.root.data.progress.toString()
              progressContent.setAttribute('contenteditable', 'true')
              progressContent.addEventListener('keydown', event => {
                if (event.key === "Enter") {
                    const value = progressContent.innerHTML
                    tabController.tasks.root.data.progress = parseInt(value)
                    tabController.update()
                }
              })
        progress.appendChild(progressContent)
        infoContent.appendChild(progress)

        //td for the start_date
        const startDate = document.createElement('td')
        const startDateContent = document.createElement('div')
              startDateContent.innerHTML = tabController.tasks.root.data.start_date.toLocaleDateString()
              startDateContent.setAttribute('contenteditable', 'true')
              startDateContent.addEventListener('keydown', event => {
                if (event.key === "Enter") {
                    const value = startDateContent.innerHTML
                    tabController.tasks.root.data.start_date = new Date(value)
                    tabController.update()
                }
              })
        startDate.appendChild(startDateContent)
        infoContent.appendChild(startDate)

        //td for the end_date
        const endDate = document.createElement('td')
        const endDateContent = document.createElement('div')
              endDateContent.innerHTML = tabController.tasks.root.data.end_date.toLocaleDateString()
              endDateContent.setAttribute('contenteditable', 'true')
              endDateContent.addEventListener('keydown', event => {
                if (event.key === "Enter") {
                    const value = endDateContent.innerHTML
                    tabController.tasks.root.data.end_date = new Date(value)
                    tabController.update()
                }
              })
        endDate.appendChild(endDateContent)
        infoContent.appendChild(endDate)

        //td for the description
        const description = document.createElement('td')
        const descriptionContent = document.createElement('div')
              descriptionContent.innerHTML = tabController.tasks.root.data.description
              descriptionContent.setAttribute('contenteditable', 'true')
              descriptionContent.addEventListener('keydown', event => {
                if (event.key === "Enter") {
                    const value = descriptionContent.innerHTML
                    tabController.tasks.root.data.description = value
                    tabController.update()
                }
              })
        description.appendChild(descriptionContent)
        infoContent.appendChild(description)

        table.appendChild(infoHeader)
        table.appendChild(infoContent)
        projectInfoElement.appendChild(table)
    
        return projectInfoElement
    }
}
