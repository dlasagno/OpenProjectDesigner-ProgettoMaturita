//--------------------------------------------------tab-menu.ts--------------------------------------------------
interface MenuItem {
  name: string,
  action()
}

//----------------------------------------------------tab.ts-----------------------------------------------------
class Tab {
  constructor(private _menu: MenuItem[]) { }

  get menu() {return this._menu}
}

//-------------------------------------------------tab-window.ts-------------------------------------------------
class TabWindow {
  private currentTab

  constructor(private windowObject: Element, private tabs: Tab[]/*, private propertiesPanel: Property<any>[]*/) {
    this.currentTab = tabs[0];
  }

  changeCurrentTab() {

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
    for (const menuItem of this.currentTab.menu) {
      //create a new menu item to append to the menu
      const menuItemElement = document.createElement('li')
      menuItemElement.classList.add('button')
      menuItemElement.addEventListener('click', menuItem.action)
      menuItemElement.innerHTML = menuItem.name
      menu.appendChild(menuItemElement)
    }
  }

  updateNav() {
    
  }
}

const tabWindowObject = new TabWindow(document.querySelector('#tab-window'), [
  new Tab([
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

document.querySelector('#tab-window').querySelector('#tab-view').innerHTML = 'Ciao, funziona!!!'
