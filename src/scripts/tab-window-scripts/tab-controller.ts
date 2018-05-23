import { TabWindowRenderer } from './tab-window-renderer'
import { Tab, Task, Tree } from '../commons/interfaces'

export class TabController {
  //Attributi
  private _currentTab: number = 0
  private _selectedTaskId: string = ''

  constructor(private tabs: Tab[], public tasks?: Tree<Task>) {
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
    this.tasks.removeNodeById(taskId)
    this.update()
  }

  update() {
    TabWindowRenderer.updateView(this.tabs[this._currentTab].view(this))
  }

}
