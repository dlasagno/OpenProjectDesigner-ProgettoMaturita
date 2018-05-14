import { TabWindowRenderer } from './tab-window-renderer'
import { Tab, Task } from '../commons/interfaces'

export class TabController {
  //Attributi
  private _currentTab: number = 0
  private _selectedTaskId: string = ''
  
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

  get selectedTaskId () {return this._selectedTaskId}
  set selectedTaskId (task: string) {
    if(task) {
      this._selectedTaskId = task

      const currentTask = Task.getTaskById(this.tasks, task)

      const properties: Property<string>[] = []
      properties.push({
        name: 'title',
        description: 'title text',
        value: currentTask.title
      })
      properties.push({
        name: 'description',
        description: 'description text',
        value: currentTask.description
      })
      properties.push({
        name: 'start date',
        description: 'project\'s start date' ,
        value: currentTask.start_date
      })
      properties.push({
        name: 'end date',
        description: 'project\'s end date' ,
        value: currentTask.end_date
      })
      TabWindowRenderer.updatePropertiesPanel(properties)
    }
  }

}
