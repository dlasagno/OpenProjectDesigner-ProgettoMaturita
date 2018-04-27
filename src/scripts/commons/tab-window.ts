import { Property } from "../commons/interfaces"
import { Tab } from "./tab"

export class TabWindow {
  private _currentTab: number = 0
  //private propertiesPanel: Property<any>[]

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