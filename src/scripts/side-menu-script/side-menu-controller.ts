import { MenuItem } from '../commons/interfaces'

export class SideMenuController {

  private sideMenuElement: Element = document.querySelector('#side-menu')

  constructor(private menuItems: MenuItem[]) {
    this.loadMenu()
  }

  loadMenu() {
    //Select the side menu
    const menuElement = this.sideMenuElement.querySelector('.menu')

    //Empty the side menu
    while (menuElement.firstChild)
      menuElement.removeChild(menuElement.firstChild)

    //Populate the side menu
    for (const menuItem of this.menuItems) {
      //create a new menu item to append to the menu
      const menuItemElement = document.createElement('li')
      menuItemElement.classList.add('button')
      menuItemElement.addEventListener('click', menuItem.action)
      menuItemElement.innerHTML = `<span>${menuItem.name}</span>`
      menuElement.appendChild(menuItemElement)
    }
  }

}