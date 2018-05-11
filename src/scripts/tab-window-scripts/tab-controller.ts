import { TabWindowRenderer } from './tab-window-renderer';

export class TabController {
  //Attributi
  private _currentTab: number = 0
  private _selectedTaskId: string = ''
  private selectedTask: Task
  
  constructor(private tabs: Tab[], private tasks?: Task) {
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
          action(){
            console.log('Funziona')
            this.currentTab = tabId
          }
        })
        return tabButtons
      }, []), this._currentTab)
      TabWindowRenderer.updateMenu(this.tabs[this._currentTab].menuItems)
      TabWindowRenderer.updateView(this.tabs[this._currentTab].view())
    }
  }

  get selectedTaskId () {return this._selectedTaskId}
  set selectedTaskId (taskId: string) {
    /*if(task != null) {
      this.selectedTask = task

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
    }*/
  }

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

//Debug
interface Tab {
  name: string
  icon: string
  menuItems: MenuItem[]
  view(): Element
}
