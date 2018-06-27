import { TabController } from '../tab-window-scripts/tab-controller'
import { Tab } from './interfaces'



export const projectInfoTab: Tab = {
    name: 'info',
    icon: 'fa-info-circle',
    menuItems: [],
    view(tabController: TabController): Element {

        function createCell(cellValue: string, onEnterKeyDown: (event: KeyboardEvent) => void): HTMLTableDataCellElement {
            const cell = document.createElement('td')
            const cellContent = document.createElement('div')
                cellContent.textContent = cellValue
                cellContent.setAttribute('contenteditable', 'true')
                cellContent.addEventListener('keydown', event => {
                    if (event.key === "Enter") {
                        onEnterKeyDown(event)
                    }
                })
            cell.appendChild(cellContent)
            return cell
        }
        
        const projectInfoElement = document.createElement('div')
        const table = document.createElement('table')
        
        const projectInfoHeader = document.createElement('tr')
              projectInfoHeader.innerHTML = `
                <th>Title</th>
                <th>Cost</th>
                <th>Progress</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Description</th>
              `
        
        const projectInfoContent = document.createElement('tr')

        //Create the cell for the title
        projectInfoContent.appendChild(createCell(tabController.tasks.root.data.title, event => {
            const value = (event.target as Element).textContent
            tabController.tasks.root.data.title = value
            tabController.update()
        }))

        //Create the cell for the cost
        projectInfoContent.appendChild(createCell(tabController.tasks.root.data.cost.toString(), event => {
            const value = (event.target as Element).textContent
            tabController.tasks.root.data.cost = parseInt(value)
            tabController.update()
        }))

        //Create the cell for the progress
        projectInfoContent.appendChild(createCell(tabController.tasks.root.data.progress.toString(), event => {
            const value = (event.target as Element).textContent
            tabController.tasks.root.data.progress = parseInt(value)
            tabController.update()
        }))

        //Create the cell for the start date
        projectInfoContent.appendChild(createCell(tabController.tasks.root.data.start_date.toString(), event => {
            const value = (event.target as Element).textContent
            tabController.tasks.root.data.start_date = new Date(value)
            tabController.update()
        }))

        //Create the cell for the end date
        projectInfoContent.appendChild(createCell(tabController.tasks.root.data.end_date.toString(), event => {
            const value = (event.target as Element).textContent
            tabController.tasks.root.data.end_date = new Date(value)
            tabController.update()
        }))

        //Create the cell for the description
        projectInfoContent.appendChild(createCell(tabController.tasks.root.data.description, event => {
            const value = (event.target as Element).textContent
            tabController.tasks.root.data.description = value
            tabController.update()
        }))

        table.appendChild(projectInfoHeader)
        table.appendChild(projectInfoContent)
        projectInfoElement.appendChild(table)
    
        return projectInfoElement
    }
}
