import { TabController } from '../../tab-window-scripts/tab-controller'
import { Tab } from '../interfaces'



export const projectInfoTab: Tab = {
    name: 'info',
    icon: 'fa-info-circle',
    menuItems: [],
    view(tabController: TabController): Element {
        //Masks
        const propertiesMask = ['title', 'description', 'start_date', 'end_date', 'progress', 'cost']
        const disabledPropertiesMask = ['start_date', 'end_date', 'progress', 'cost']
        
        //Function to render properties of the project
        function renderProperty(propertyName: string, propertyValue: string): HTMLDivElement {
            //create a property to append to the properties list
            const propertyElement = document.createElement('div')
            propertyElement.classList.add('property')

            //Create the head of the property
            const propertyHeadElement = document.createElement('div')
                propertyHeadElement.classList.add('property-head')
                propertyHeadElement.innerHTML = `<span>${propertyName.replace('_', ' ')}</span>`
            propertyElement.appendChild(propertyHeadElement)

            //Create the body of the property
            const propertyBodyElement = document.createElement('div')
                propertyBodyElement.classList.add('property-body')
                const inputProperty = document.createElement('input')
                inputProperty.setAttribute('type', 'text')
                inputProperty.setAttribute('value', propertyValue)
                if(tabController.tasks.root.children.length && disabledPropertiesMask.includes(propertyName))
                    inputProperty.disabled = true
                inputProperty.addEventListener('keydown', event => {
                    if (event.key === "Enter") {
                        const value = (event.target as HTMLInputElement).value
                        tabController.tasks.root.data[propertyName] = tabController.tasks.root.data[propertyName] instanceof Date ? new Date(value) : value
                        tabController.update()
                    }
                })
                propertyBodyElement.appendChild(inputProperty)
            propertyElement.appendChild(propertyBodyElement)

            //Append all to the properties list
            return propertyElement
        }

        const projectInfoElement = document.createElement('div')
            projectInfoElement.id = 'project-info-view'
        const propertyListElement = document.createElement('div')
            propertyListElement.classList.add('list')
        projectInfoElement.appendChild(propertyListElement)

        for(const propertyName of Object.keys(tabController.tasks.root.data)) {
            if(!propertiesMask.includes(propertyName))
                continue
            propertyListElement.appendChild(renderProperty(
                propertyName,
                tabController.tasks.root.data[propertyName]
            ))
        }
        
        return projectInfoElement
    }
}
