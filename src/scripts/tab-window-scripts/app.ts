//File per il raggruppamento dei file sparsi, DEBUG per problemi ad import/export

//Interface for properties
interface Property {
  name: string
  description: string
  value: {
    task: Task
    key: string
  }
}


//Interface for tasks
interface Task {

  title: string
  description: string

  wbs_graphics?: {
    color: string
  }

  gantt_graphics?: {

  }

  collapsed: boolean

  format?: string[]

  start_date: string
  end_date: string

  progress: number
  cost?: number
  appointee?: string

  extra_info?: {}

  children?: Task[]

}

//Class with static methods to work on tasks
class Task {

  static getTaskById(task: Task, id: string): Task {
    if (id.length < 1)
      return task
    else {
      const ids: number[] = id.split('.').map(num => parseInt(num))
      task = task.children[ids[0] - 1]
      ids.shift()
      return this.getTaskById(task, ids.join('.'))
    }
  }

  static getParentTask(task: Task, id: string): Task {
    const parentId: string = id.split('.').slice(0, -1).join('.')
    return this.getTaskById(task, parentId)
  }

  static removeTask(task: Task, id: string): boolean {
    const parent: Task = this.getParentTask(task, id)
    const taskId: number = Number(id.split('.').pop()) - 1
    if(parent.children[taskId] != undefined) {
      parent.children.splice(taskId, 1)
      return true
    }
    return false
  }

}


//Interface for tabs
interface Tab {
  name: string
  icon: string
  menuItems: MenuItem[]
  view(tabController: TabController): Element
}


//Interface for tab menus
interface MenuItem {
  name: string
  action()
}

//Interface for tab buttons
interface TabButton extends MenuItem {
  icon: string
}

//---------------------------------------------------------------------------------------------------------------

class TabWindowRenderer {

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
    const task: Task = Task.getTaskById(tabController.tasks, taskId)
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

class TabController {
  //Attributi
  private _currentTab: number = 0
  private _selectedTaskId: string = ''

  constructor(private tabs: Tab[], public tasks?: Task) {
    this.currentTab = 0
  }

  get currentTab() { return this._currentTab }
  set currentTab(tabNumber: number) {
    if (tabNumber >= 0 && tabNumber < this.tabs.length) {
      this._currentTab = tabNumber

      TabWindowRenderer.updateNav(this.tabs.reduce((tabButtons, tab, tabId) => {
        tabButtons.push({
          name: tab.name,
          icon: tab.icon,
          action: () => this.currentTab = tabId
        })
        return tabButtons
      }, []), this._currentTab)
      TabWindowRenderer.updateMenu(this.tabs[this._currentTab].menuItems)
      TabWindowRenderer.updateView(this.tabs[this._currentTab].view(this))
    }
  }

  get selectedTaskId() { return this._selectedTaskId }
  set selectedTaskId(taskId: string) {
    if (taskId || taskId === '') {
      this._selectedTaskId = taskId

      TabWindowRenderer.updatePropertiesPanel(taskId, this)
    }
  }

  removeTask(taskId: string) {
    Task.removeTask(this.tasks, taskId)
    this.update()
  }

  update() {
    TabWindowRenderer.updateView(this.tabs[this._currentTab].view(this))
  }

}

//---------------------------------------------------------------------------------------------------------------

const task: Task = {
  title: 'Progetto',
  description: 'desrizione progetto',
  collapsed: false,
  start_date: '01-01-2018',
  end_date: '03-01-2018',
  progress: 50,
  cost: 3000,
  children: [
    {
      title: 'Pianificazione',
      description: 'descrizione pianificazione',
      collapsed: false,
      start_date: '01-01-2018',
      end_date: '03-01-2018',
      progress: 50,
      cost: 500,
      children: [
        {
          title: 'Raccolta dati',
          description: 'descrizione raccolta dati',
          collapsed: false,
          start_date: '01-01-2018',
          end_date: '01-01-2018',
          progress: 50,
          cost: 100,
          children: [
            {
              title: 'Raccolta richieste clienti',
              description: 'descrizione raccolta dati',
              collapsed: false,
              start_date: '01-01-2018',
              end_date: '01-01-2018',
              progress: 80,
              cost: 30
            },
            {
              title: 'Raccolta esigenze utenti',
              description: 'descrizione esaminazione',
              collapsed: false,
              start_date: '01-01-2018',
              end_date: '01-01-2018',
              progress: 20,
              cost: 70
            }
          ]
        },
        {
          title: 'Esaminazione',
          description: 'descrizione esaminazione',
          collapsed: false,
          start_date: '02-01-2018',
          end_date: '03-01-2018',
          progress: 50,
          cost: 400
        }
      ]
    },
    {
      title: 'Preparazione',
      description: 'descrizione preparazione',
      collapsed: false,
      start_date: '03-01-2018',
      end_date: '03-01-2018',
      progress: 30,
      cost: 2000
    },
    {
      title: 'Realizzazione',
      description: 'descrizione realizzazione',
      collapsed: false,
      start_date: '03-01-2018',
      end_date: '03-01-2018',
      progress: 70,
      cost: 5000
    }
  ]
}

const tabController = new TabController([
  {
    name: 'WBS',
    icon: 'fa-sitemap',
    menuItems: [
      {
        name: "m-test-2 - 1",
        action() {
          console.log("Menu1 - Funziona!!!")
        }
      },
      {
        name: "m-test-2 - 2",
        action() {
          console.log("Menu2 - Funziona!!!")
        }
      }
    ],
    view() {
      return document.createElement('h1')
    }
  },
  {
    name: 'GANTT',
    icon: 'fa-th-list',
    menuItems: [],
    view(tabController: TabController): Element {

      function createRow(task: Task, taskId: string, taskChildId: string) {

        let idd
        if (taskChildId == '0')
          idd = `${taskId}`
        else
          idd = `${taskId}.${taskChildId}`

        const tr = document.createElement('tr')
          const td1 = document.createElement('td')
                td1.innerHTML = `${idd}`
                td1.addEventListener('click', () => tabController.selectedTaskId = idd)
          const td2 = document.createElement('td')
                td2.innerHTML = `${task.title}`
                td2.addEventListener('click', () => tabController.selectedTaskId = idd)
          const td3 = document.createElement('td')
                td3.innerHTML = `${task.start_date}`
                td3.addEventListener('click', () => tabController.selectedTaskId = idd)
          const td4 = document.createElement('td')
                td4.innerHTML = `${task.end_date}`
                td4.addEventListener('click', () => tabController.selectedTaskId = idd)
          const td5 = document.createElement('td')
                td5.innerHTML = `<progress max="100" value="${task.progress}">`
                td5.addEventListener('click', () => tabController.selectedTaskId = idd)
          const td6 = document.createElement('td')
                if (task.cost != null)
                  td6.innerHTML = `${task.cost}€`
                else
                  td6.innerHTML = `0€`
                td6.addEventListener('click', tabController.selectedTaskId = idd)
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        tr.appendChild(td5)
        tr.appendChild(td6)

        for (let i = 0; i < 8; i++) {
          const td7 = document.createElement('td')
                td7.innerHTML = ` `
                tr.appendChild(td7)
        }

        ganttTable.appendChild(tr)
        if (task.children)
          for (const childTask of task.children) {
            taskChildId = (parseInt(taskChildId) + 1).toString()
            createRow(childTask, taskId, taskChildId)
          }
  
      }

      //Create the gantt's table
      const ganttTable = document.createElement('table')

      //Craete the gantt's header row
      const ganttHeader = document.createElement('tr')
      ganttHeader.innerHTML = `
        <th rowspan="2">#</th>
        <th rowspan="2">Task</th>
        <th rowspan="2">Start date</th>
        <th rowspan="2">End date</th>
        <th rowspan="2"><progress max="100" value="50"></th>
        <th rowspan="2">Costo</th>
        <th colspan="8">Gennaio 2018</th>
      `
      ganttTable.appendChild(ganttHeader)
      
      //Add days to the gantt's header row
      const ganttDaysRow = document.createElement('tr')
      for (let i = 0; i < 8; i++) {
        const dayCell = document.createElement('th')
              dayCell.innerHTML = (i + 1).toString()
        ganttDaysRow.appendChild(dayCell)
      }
      ganttTable.appendChild(ganttDaysRow)

      //Add tasks rows to the gantt's table
      let taskId = '0'
      for (const task of tabController.tasks.children) {
        taskId = (parseInt(taskId) + 1).toString()
        createRow(task, taskId, '0')
      }
      return ganttTable
    }
  }
], task)
