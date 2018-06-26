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
        const titleContent = document.createElement('input')
              titleContent.setAttribute('type', 'text')
              titleContent.setAttribute('value', tabController.tasks.root.data.title)
              titleContent.addEventListener('keydown', event => {
                if (event.key === "Enter") {
                    const value = (event.target as HTMLInputElement).value
                    tabController.tasks.root.data.title = value
                    tabController.update()
                }
              })
        title.appendChild(titleContent)
        infoContent.appendChild(title)

        //td for the cost
        const cost = document.createElement('td')
        const costContent = document.createElement('input')
              costContent.setAttribute('type', 'text')
              costContent.setAttribute('value', tabController.tasks.root.data.cost.toString())
              costContent.addEventListener('keydown', event => {
                if (event.key === "Enter") {
                    const value = (event.target as HTMLInputElement).value
                    tabController.tasks.root.data.cost = parseInt(value)
                    tabController.update()
                }
              })
        cost.appendChild(costContent)
        infoContent.appendChild(cost)

        //td for the progress
        const progress = document.createElement('td')
        const progressContent = document.createElement('input')
              progressContent.setAttribute('type', 'text')
              progressContent.setAttribute('value', tabController.tasks.root.data.progress.toString())
              progressContent.addEventListener('keydown', event => {
                if (event.key === "Enter") {
                    const value = (event.target as HTMLInputElement).value
                    tabController.tasks.root.data.progress = parseInt(value)
                    tabController.update()
                }
              })
        progress.appendChild(progressContent)
        infoContent.appendChild(progress)

        //td for the start_date
        const startDate = document.createElement('td')
        const startDateContent = document.createElement('input')
              startDateContent.setAttribute('type', 'text')
              startDateContent.setAttribute('value', tabController.tasks.root.data.start_date.toLocaleDateString())
              startDateContent.addEventListener('keydown', event => {
                if (event.key === "Enter") {
                    const value = (event.target as HTMLInputElement).value
                    tabController.tasks.root.data.start_date = new Date(value)
                    tabController.update()
                }
              })
        startDate.appendChild(startDateContent)
        infoContent.appendChild(startDate)

        //td for the end_date
        const endDate = document.createElement('td')
        const endDateContent = document.createElement('input')
              endDateContent.setAttribute('type', 'text')
              endDateContent.setAttribute('value', tabController.tasks.root.data.end_date.toLocaleDateString())
              endDateContent.addEventListener('keydown', event => {
                if (event.key === "Enter") {
                    const value = (event.target as HTMLInputElement).value
                    tabController.tasks.root.data.end_date = new Date(value)
                    tabController.update()
                }
              })
        endDate.appendChild(endDateContent)
        infoContent.appendChild(endDate)

        //td for the description
        const description = document.createElement('td')
        const descriptionContent = document.createElement('input')
              descriptionContent.setAttribute('type', 'text')
              descriptionContent.setAttribute('value', tabController.tasks.root.data.description)
              descriptionContent.addEventListener('keydown', event => {
                if (event.key === "Enter") {
                    const value = (event.target as HTMLInputElement).value
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
