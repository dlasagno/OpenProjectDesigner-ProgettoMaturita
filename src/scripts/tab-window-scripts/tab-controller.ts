import { TabWindowRenderer } from './tab-window-renderer'
import { Tab, Task, Tree, TreeNode } from '../commons/interfaces'

export class TabController {
  //Attributi
  private _currentTab: number
  private _selectedTaskId: string

  constructor(private tabs: Tab[], public tasks: Tree<Task>) {
    //Open the first tab
    this.currentTab = 0
    
    //Open the project in the properties panel
    this.selectedTaskId = ''

    //Calculate values of the tasks
    this.tasks.forEach((node, id) => {
      if(node.children)
        this.cascadeEffect(id)
    })
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

      this.updatePropertiesPanel()
    }
  }

  removeTask(taskId: string) {
    this.tasks.removeNodeById(taskId)
    this.update()
  }
  appendToTask(taskId: string, task: Task) {
    this.tasks.getNodeById(taskId).appendChild(task)
    this.update()
  }

  update() {
    this.tasks.forEach((node, id) => {
      if(node.children)
        this.cascadeEffect(id)
    })
    this.updateMenu()
    this.updateView()
    this.updatePropertiesPanel()
  }
  updateMenu() {
    TabWindowRenderer.updateMenu(this.tabs[this._currentTab].menuItems)
  }
  updateView() {
    TabWindowRenderer.updateView(this.tabs[this._currentTab].view(this))
  }
  updatePropertiesPanel() {
    if(this.tasks.getNodeById(this._selectedTaskId).children.length > 0)
      TabWindowRenderer.updatePropertiesPanel(this._selectedTaskId, this, ['title', 'description', 'start_date', 'end_date', 'progress', 'cost'], true)
    else
      TabWindowRenderer.updatePropertiesPanel(this._selectedTaskId, this, ['title', 'description', 'start_date', 'end_date', 'progress', 'cost'], false)
  }

  cascadeEffect(taskId: string){
    const parentNode = this.tasks.getNodeById(taskId.split('.').slice(0, -1).join('.'))

    let cost: number = 0
    let progress: number = 0
    let start_date: Date = new Date(this.tasks.getNodeById(taskId).data.start_date)
    let end_date: Date = new Date(this.tasks.getNodeById(taskId).data.end_date)

    for(const child of parentNode.children){
      cost += parseInt(child.data.cost.toString())
      progress += parseInt(child.data.progress.toString())
      if(start_date.getTime() > child.data.start_date.getTime())
        start_date = new Date(child.data.start_date)
      if(end_date.getTime() < child.data.end_date.getTime())
        end_date = new Date(child.data.end_date)   
    }

    progress /= this.tasks.getNodeById(taskId.split('.').slice(0, -1).join('.')).children.length
    parentNode.data.cost = cost
    parentNode.data.progress = progress
    parentNode.data.start_date = new Date(start_date)
    parentNode.data.end_date = new Date(end_date)

    if(taskId != '')
      this.cascadeEffect(taskId.split('.').slice(0, -1).join('.'))
  }
}
