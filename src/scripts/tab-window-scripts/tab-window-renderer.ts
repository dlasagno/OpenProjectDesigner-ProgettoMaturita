import { TabController } from './tab-controller'
import { Property, TabButton, MenuItem, TaskNoChildren } from "../commons/interfaces"

export class TabWindowRenderer {

  private static windowElement = document.querySelector('#tab-window')


  static updateMenu(menuItems: MenuItem[]): void {
    //Select the tab's menu
    const menuElement = this.windowElement.querySelector('#tab-menu .menu')

    //Empty the tab's menu
    while (menuElement.firstChild)
      menuElement.removeChild(menuElement.firstChild)

    //Populate the tab's menu
    for (const menuItem of menuItems) {
      //create a new menu item to append to the menu
      const menuItemElement = document.createElement('li')
      menuItemElement.classList.add('button')
      menuItemElement.addEventListener('click', menuItem.action)
      menuItemElement.innerHTML = `<span>${menuItem.name}</span>`
      menuElement.appendChild(menuItemElement)
    }
  }

  static updateNav(tabs: TabButton[], activeTabIndex: number): void {
    //Select the tabs navigation
    const navElement = this.windowElement.querySelector('#tab-nav')

    //Empty the tabs navigation
    Array.from(navElement.children).forEach(tabElement => {
      if (tabElement.id.endsWith('tab-button'))
        tabElement.remove()
    })

    //Populate the tabs navigation
    for (const tab of tabs) {
      //create a tab button
      const tabElement = document.createElement('div')
      tabElement.id = `${tab.name}-tab-button`
      tabElement.classList.add('button')
      if (tab === tabs[activeTabIndex])
        tabElement.classList.add('active')
      else
        tabElement.addEventListener('click', tab.action)
      tabElement.innerHTML = `
        <div>
          <span>${tab.name}</name>
        </div>
        <span class="fas ${tab.icon}"></span>
      `
      //Append the new tab button to the tabs navigation
      navElement.appendChild(tabElement)
    }
  }

  static updatePropertiesPanel(taskId: string, tabController: TabController): void {
    //Create a list of properties of the task
    const task: TaskNoChildren = tabController.tasks.getNodeById(taskId).data
    const properties: Property[] = []
    for(const prop in task)
      properties.push({
        name: prop,
        description: '',
        value: {
          task: task,
          key: prop
        }
      })

    //Select the properties list
    const propertiesPanelElement = this.windowElement.querySelector('#properties-panel')


    //Select the action buttons
    const actionButtonsElement = propertiesPanelElement.querySelector('#action-buttons')

    //Empty the action buttons
    while (actionButtonsElement.firstChild)
      actionButtonsElement.removeChild(actionButtonsElement.firstChild)

    //Append buttons to the action buttons
    const deleteButtonElement = document.createElement('div')
      deleteButtonElement.classList.add('button', 'delete-button')
      deleteButtonElement.innerHTML = '<span class="fas fa-trash-alt"></span>'
      deleteButtonElement.addEventListener('click', () => tabController.removeTask(taskId) ) 
    actionButtonsElement.appendChild(deleteButtonElement)


    //Select the properties list
    const propertiesListElement = propertiesPanelElement.querySelector('#properties-list')

    //Empty the properties list
    while (propertiesListElement.firstChild)
      propertiesListElement.removeChild(propertiesListElement.firstChild)

    for (const property of properties) {
      //create a property to append to the properties list
      const propertyElement = document.createElement('div')
      propertyElement.classList.add('property')

      //Create the head of the property
      const propertyHeadElement = document.createElement('div')
        propertyHeadElement.classList.add('property-head')
        propertyHeadElement.innerHTML = `<span>${property.name}</span>`
      propertyElement.appendChild(propertyHeadElement)

      //Create the body of the property
      const propertyBodyElement = document.createElement('div')
        propertyBodyElement.classList.add('property-body')
        const descriptionProperty = document.createElement('span')
          descriptionProperty.innerHTML = property.description
        const inputProperty = document.createElement('input')
          inputProperty.setAttribute('type', 'text')
          inputProperty.setAttribute('value', property.value.task[property.value.key])
          inputProperty.addEventListener('keydown', event => {
            if (event.key === "Enter") {
              property.value.task[property.value.key] = (event.target as HTMLInputElement).value
              tabController.update()
            }
          })
        propertyBodyElement.appendChild(descriptionProperty)
        propertyBodyElement.appendChild(inputProperty)
      propertyElement.appendChild(propertyBodyElement)

      //Append all to the properties list
      propertiesListElement.appendChild(propertyElement)
    }

    propertiesPanelElement.appendChild(actionButtonsElement)
    propertiesPanelElement.appendChild(propertiesListElement)
  }

  static updateView(view: Element): void {
    //Select the tab view
    const viewElement = this.windowElement.querySelector('#tab-view')

    //Empty the tab view
    while (viewElement.firstChild)
      viewElement.removeChild(viewElement.firstChild)

    //Append the new rendered view to the tab view
    viewElement.appendChild(view)
  }

}
