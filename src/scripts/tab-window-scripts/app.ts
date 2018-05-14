//File per il raggruppamento dei file sparsi, DEBUG per problemi ad import/export

//Interface for properties
interface Property<T> {
  name: string;
  description: string;
  value: T;
}


//Interface for tasks
interface Task {

  title: string
  description: string

  wbs_graphics?: {
    color: string
  }

  gantt_graphics?:{

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

  static findTaskById(task: Task, id: string): Task {
    if(id.length < 1)
      return task
    else {
      const ids: number[] = id.split('.').map(parseInt)
      task = task.children[ids[0]+1]
      ids.shift()
      return this.findTaskById(task, ids.join('.'))
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
  name: string,
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
      //create a tab button to append to the tabs navigation
      const tabElement = document.createElement('div')
      tabElement.id = `${tab.name}-tab-button`
      tabElement.classList.add('button')
      if(tab === tabs[activeTabIndex])
        tabElement.classList.add('active')
      else
        tabElement.addEventListener('click', tab.action)

      //Create the text for the tab button
      const tabElementText = document.createElement('div')
      tabElementText.innerHTML = `<span>${tab.name}</span>`
      tabElement.appendChild(tabElementText)

      //Create an icon for the tab button
      const tabElementIcon = document.createElement('span')
      tabElementIcon.classList.add('fas', tab.icon)
      tabElement.appendChild(tabElementIcon)

      //Append all to the tabs navigation
      navElement.appendChild(tabElement)
    }
  }

  static updatePropertiesPanel(properties: Property<string>[]): void {
    //Select the tabs navigation
    const propertiesPanelElement = this.windowElement.querySelector('#properties-panel .list')

    //Empty the tab's menu
    while (propertiesPanelElement.firstChild)
      propertiesPanelElement.removeChild(propertiesPanelElement.firstChild)

    for (const property of properties) {
      //create a tab button to append to the tabs navigation
      const propertyElement = document.createElement('div')
      propertyElement.classList.add('property')

      //Create the text for the tab button
      const propertyHeadElement = document.createElement('div')
      propertyHeadElement.classList.add('property-head')
      propertyHeadElement.innerHTML = `<span>${property.name}</span>`
      propertyElement.appendChild(propertyHeadElement)

      //Create the text for the tab button
      const propertyBodyElement = document.createElement('div')
      propertyBodyElement.classList.add('property-body')
      propertyBodyElement.innerHTML = `
        <span>${property.description}:</span>
        <input type="text" value="${property.value}">
      `
      propertyElement.appendChild(propertyBodyElement)

      //Append all to the tabs navigation
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
  private _selectedTask: Task

  constructor(private tabs: Tab[], public tasks?: Task) {
    this.currentTab = 0
  }

  get currentTab () {return this._currentTab}
  set currentTab (tabNumber: number) {
    if(tabNumber >= 0 && tabNumber < this.tabs.length){
      this._currentTab = tabNumber

      TabWindowRenderer.updateNav(this.tabs.reduce((tabButtons, tab, tabId) => {
        tabButtons.push({
          name: tab.name,
          icon: tab.icon,
          action: () => {
            this.currentTab = tabId
          }
        })
        return tabButtons
      }, []), this._currentTab)
      TabWindowRenderer.updateMenu(this.tabs[this._currentTab].menuItems)
      TabWindowRenderer.updateView(this.tabs[this._currentTab].view(this))
    }
  }

  get selectedTask () {return this._selectedTask}
  set selectedTask (task: Task) {
    if(task != null) {
      this._selectedTask = task

      const properties: Property<string>[] = []
      properties.push({
        name: 'title',
        description: 'title text',
        value: task.title
      })
      properties.push({
        name: 'description',
        description: 'description text',
        value: task.description
      })
      properties.push({
        name: 'start date',
        description: 'project\'s start date' ,
        value: task.start_date
      })
      properties.push({
        name: 'end date',
        description: 'project\'s end date' ,
        value: task.end_date
      })
      TabWindowRenderer.updatePropertiesPanel(properties)
    }
  }

}


//---------------------------------------------------------------------------------------------------------------

/*TabWindowRenderer.updateNav([
  {
    name: "info",
    icon: 'fa-info',
    action() {
      console.log("Info - Funziona!!!")
    }
  },
  {
    name: "bell",
    icon: 'fa-bell',
    action() {
      console.log("Bell - Funziona!!!")
    }
  },
  {
    name: "bolt",
    icon: 'fa-bolt',
    action() {
      console.log("Bolt - Funziona!!!")
    }
  }
], 1)*/

TabWindowRenderer.updatePropertiesPanel([
  {
    name: 'prop 1',
    description: 'testo prop 1',
    value: 'Mario Rossi'
  },
  {
    name: 'prop 2',
    description: 'testo prop 2',
    value: 'Roma'
  },
  {
    name: 'prop 3',
    description: 'testo prop 3',
    value: 'insegnante'
  }
])

const tabController = new TabController([
  {
    name: 'test',
    icon: 'fa-user',
    menuItems: [
      {
        name: "m-test - 1",
        action() {
          console.log("Menu1 - Funziona!!!")
        }
      },
      {
        name: "m-test - 2",
        action() {
          console.log("Menu2 - Funziona!!!")
        }
      },
      {
        name: "m-test - 3",
        action() {
          console.log("Menu3 - Funziona!!!")
        }
      }
    ],
    view() {
      return document.querySelector('#gantt-view')
    }
  },
  {
    name: 'test2',
    icon: 'fa-adjust',
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


      function createRow(task: Task){
        const tr = document.createElement('tr')
        const td1 = document.createElement('td')
              td1.innerHTML = `1`
        const td2 = document.createElement('td')
              td2.innerHTML = task.title
        const td3 = document.createElement('td')
              td3.innerHTML = task.start_date
        const td4 = document.createElement('td')
              td4.innerHTML = task.end_date
        const td5 = document.createElement('td')
              td5.innerHTML = `<progress max="100" value="${task.progress}">`
        const td6 = document.createElement('td')

        if(task.cost != null)
          td6.innerHTML = task.cost.toString()
        else
          td6.innerHTML = `0`

        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        tr.appendChild(td5)
        tr.appendChild(td6)

        for(let i = 0; i < 8; i++){
          const td7 = document.createElement('td')
          td7.innerHTML = ` `
          tr.appendChild(td7)
        }

        table.appendChild(tr)
        if(task.children)
          for(const childTask of task.children)
            createRow(childTask)
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
      for(let i = 0; i < 8; i++){
          const th7A = document.createElement('th')
          th7A.innerHTML = (i + 1).toString()
          trA.appendChild(th7A)
      }
      table.appendChild(trA)

      for(const task of tabController.tasks.children)
        createRow(task)

      return table
    }
  }
],
{
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
)

/*tabController.selectedTask = {
  title: 'titolo',
  description: 'descrizione',
  collapsed: false,
  format: [],
  start_date: '10/5/2019',
  end_date: '10/5/2020',
  progress: 0,
  cost: 2000000,
  appointee: 'Daniele'
}*/

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

//console.log(Task.findTaskById(task, ''))
