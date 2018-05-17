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

  static updatePropertiesPanel(properties: Property[], tabController: TabController): void {
    //Select the properties panel
    const propertiesPanelElement = this.windowElement.querySelector('#properties-panel .list')

    //Empty the properties panel
    while (propertiesPanelElement.firstChild)
      propertiesPanelElement.removeChild(propertiesPanelElement.firstChild)

    for (const property of properties) {
      //create a property to append to the properties panel
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
      inputProperty.addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
          property.value.task[property.value.key] = (event.target as HTMLInputElement).value
          tabController.update()
        }
      })
      propertyBodyElement.appendChild(descriptionProperty)
      propertyBodyElement.appendChild(inputProperty)
      propertyElement.appendChild(propertyBodyElement)

      //Append all to the properties panel
      propertiesPanelElement.appendChild(propertyElement)
    }
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
      const currentTask = Task.getTaskById(this.tasks, taskId)

      const properties: Property[] = []
      for(const prop in currentTask)
        properties.push({
          name: prop,
          description: '',
          value: {
            task: currentTask,
            key: prop
          }
        })

      TabWindowRenderer.updatePropertiesPanel(properties, this)
    }
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
          cost: 100
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
      progress: 50,
      cost: 2000
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

      function createRow(task: Task, id: string, idChild: string) {

        let idd
        if (idChild == '0')
          idd = `${id}`
        else
          idd = `${id}.${idChild}`

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
          td6.innerHTML = `0`
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

        table.appendChild(tr)
        if (task.children)
          for (const childTask of task.children) {
            idChild = (parseInt(idChild) + 1).toString()
            createRow(childTask, id, idChild)
          }
      }


      const table = document.createElement('table')

      const tr = document.createElement('tr')
      const th1 = document.createElement('th')
      th1.innerHTML = `#`
      th1.setAttribute("rowspan", "2")
      const th2 = document.createElement('th')
      th2.innerHTML = `Task`
      th2.setAttribute("rowspan", "2")
      const th3 = document.createElement('th')
      th3.innerHTML = `Start date`
      th3.setAttribute("rowspan", "2")
      const th4 = document.createElement('th')
      th4.innerHTML = `End date`
      th4.setAttribute("rowspan", "2")
      const th5 = document.createElement('th')
      th5.innerHTML = `<progress max="100" value="50">`
      th5.setAttribute("rowspan", "2")
      const th6 = document.createElement('th')
      th6.innerHTML = `Costo`
      th6.setAttribute("rowspan", "2")
      const th7 = document.createElement('th')
      th7.innerHTML = `Gennaio 2018`
      th7.setAttribute("colspan", "8")

      tr.appendChild(th1)
      tr.appendChild(th2)
      tr.appendChild(th3)
      tr.appendChild(th4)
      tr.appendChild(th5)
      tr.appendChild(th6)
      tr.appendChild(th7)
      table.appendChild(tr)

      const trA = document.createElement('tr')

      //le celle con i giorni
      for (let i = 0; i < 8; i++) {
        const th7A = document.createElement('th')
        th7A.innerHTML = (i + 1).toString()
        trA.appendChild(th7A)
      }
      table.appendChild(trA)

      let id = '0'
      for (const task of tabController.tasks.children) {
        id = (parseInt(id) + 1).toString()
        createRow(task, id, '0')
      }
      return table
    }
  }
], task)
