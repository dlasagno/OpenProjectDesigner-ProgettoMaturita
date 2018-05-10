/* //------------------------------------------------interfaces.ts--------------------------------------------------npm
interface Property<T> {
  name: string;
  description: string;
  value: T;
}

//--------------------------------------------------tab-menu.ts--------------------------------------------------
interface MenuItem {
  name: string,
  action()
}

//----------------------------------------------------tab.ts-----------------------------------------------------
class Tab {
  constructor(private _name: string, private _icon: string, private _menu: MenuItem[]) { }

  get name() {return this._name}
  get icon() {return this._icon}
  get menu() {return this._menu}
}

//-------------------------------------------------tab-window.ts-------------------------------------------------
class TabWindow {
  private _currentTab: number = 0
  private propertiesPanel: Property<any>[]

  constructor(private windowObject: Element, private tabs: Tab[]) { }

  get currentTab() {return this._currentTab}
  set currentTab(n: number) {
    if(n < this.tabs.length && n >= 0){
      this._currentTab = n
      this.updateView()
      this.updateMenu()
    }
  }

  getPropertiesValues() {

  }

  updateView() {

  }

  updateMenu() {
    //Select the tab's menu
    const menu = this.windowObject.querySelector('#tab-menu .menu')
    //Empty the tab's menu
    while (menu.firstChild) {
      menu.removeChild(menu.firstChild)
    }
    //Populate the tab's menu
    for (const menuItem of this.tabs[this._currentTab].menu) {
      //create a new menu item to append to the menu
      const menuItemElement = document.createElement('li')
      menuItemElement.classList.add('button')
      menuItemElement.addEventListener('click', menuItem.action)
      menuItemElement.innerHTML = menuItem.name
      menu.appendChild(menuItemElement)
    }
  }

  updateNav() {
    //Select the tabs navigation
    const menu = this.windowObject.querySelector('#tab-nav')
    for (const tab of this.tabs) {
      //create a tab button to append to the tabs navigation
      const tabElement = document.createElement('div')
      tabElement.classList.add('button')

      //Create the text for the tab button
      const tabElementText = document.createElement('span')
      tabElementText.innerHTML = tab.name
      tabElement.appendChild(document.createElement('div'))
      tabElement.firstElementChild.appendChild(tabElementText)

      //Create an icon for the tab button
      const tabElementIcon = document.createElement('span')
      tabElementIcon.classList.add('fas', tab.icon)
      tabElement.appendChild(tabElementIcon)

      //Append all to the tabs navigation
      menu.appendChild(tabElement)
    }
  }
}

const tabWindowObject = new TabWindow(document.querySelector('#tab-window'), [
  new Tab('Tab1', 'fa-user',[
    {
      name: "Menu1",
      action() {
        console.log("Menu1-Funziona!!!")
      }
    },
    {
      name: "Menu2",
      action() {
        console.log("Menu2-Funziona!!!")
      }
    },
    {
      name: "Menu3",
      action() {
        console.log("Menu3-Funziona!!!")
      }
    }
  ])
])

tabWindowObject.updateMenu()
tabWindowObject.updateNav()
 */

interface MenuItem {
  name: string,
  action()
}

interface TabButton extends MenuItem {
  icon: string
}

interface Property<T> {
  name: string;
  description: string;
  value: T;
}

interface Tab {
  name: string,
  icon: string,
  menuItems: MenuItem[],
  view(): Element
}

interface Task {
  title: string
  description: string

  wbs_graphics?: {
    color: string
    alignment: string
  }

  gantt_graphics?:{
    
  }

  collapsed: boolean

  format: string[]

  start_date: string
  end_date: string

  progress: number
  cost: number
  appointee: string

  extra_info?: {}

  children?: Task[]
}



class TabWindowRenderer {
  
  private static windowElement = document.querySelector('#tab-window')

  static updateMenu(menuItems: MenuItem[]): void {
    //Select the tab's menu
    const menuElement = this.windowElement.querySelector('#tab-menu .menu')

    //Empty the tab's menu
    while (menuElement.firstChild) {
      menuElement.removeChild(menuElement.firstChild)
    }

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
    const menuElement = this.windowElement.querySelector('#tab-nav')

    for (const tab of tabs) {
      //create a tab button to append to the tabs navigation
      const tabElement = document.createElement('div')
      tabElement.classList.add('button')
      if(tab === tabs[activeTabIndex])
        tabElement.classList.add('active')
      tabElement.addEventListener('cilck', tab.action)

      //Create the text for the tab button
      const tabElementText = document.createElement('div')
      tabElementText.innerHTML = `<span>${tab.name}</span>`
      tabElement.appendChild(tabElementText)

      //Create an icon for the tab button
      const tabElementIcon = document.createElement('span')
      tabElementIcon.classList.add('fas', tab.icon)
      tabElement.appendChild(tabElementIcon)

      //Append all to the tabs navigation
      menuElement.appendChild(tabElement)
    }
  }
  
  static updatePropertiesPanel(properties: Property<string>[]): void {
    //Select the tabs navigation
    const propertiesPanelElement = this.windowElement.querySelector('#properties-panel .list')

    //Empty the tab's menu
    while (propertiesPanelElement.firstChild) {
      propertiesPanelElement.removeChild(propertiesPanelElement.firstChild)
    }

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
    while (viewElement.firstChild) {
      viewElement.removeChild(viewElement.firstChild)
    }

    //Append the new rendered view to the tab view
    viewElement.appendChild(view)
  }
  
}

class TabController {
  //Attributi
  private _currentTab: number = 0
  private _selectedTask: Task
  
  constructor(private tabs: Tab[], private tasks?: Task) {
    this.currentTab = 0
  }

  get currentTab () {return this._currentTab}
  set currentTab (tabNumber: number) {
    if(tabNumber >= 0 && tabNumber < this.tabs.length){
      this._currentTab = tabNumber
  
      TabWindowRenderer.updateMenu(this.tabs[this._currentTab].menuItems)
      TabWindowRenderer.updateView(this.tabs[this._currentTab].view())
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


TabWindowRenderer.updateNav([
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
], 1)

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

/*const tabController = new TabController([
  {
    name: 'test',
    icon: 'user',
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
      return document.createElement('div')
    }
  },
  {
    name: 'test2',
    icon: 'adjust',
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
  }
])

tabController.selectedTask = {
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
