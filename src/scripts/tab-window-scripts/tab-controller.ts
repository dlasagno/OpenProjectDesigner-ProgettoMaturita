import { TabWindowRenderer } from './tab-window-renderer'
import { Tab, Task } from '../commons/interfaces'

export class TabController {
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
