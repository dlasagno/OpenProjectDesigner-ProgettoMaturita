import { TabWindowRenderer } from "./tab-window-renderer";

export class TabController {
  //Attributi
  private _currentTab: number = 0
  //private selectedTask: Task
  
  constructor(private tabs: Tab[], private tasks?: Task) {
    this.currentTab = 0
  }

  get currentTab () {return this._currentTab}
  set currentTab (tabNumber: number) {
    if(tabNumber >= 0 || tabNumber < this.tabs.length){
      this._currentTab = tabNumber
  
      TabWindowRenderer.updateMenu(this.tabs[this._currentTab].menuItems)
      TabWindowRenderer.updateView(document.createElement('div'))
    }
  }

}







interface Task {
  title: string,
  description: string,
  wbs_graphics?: {
    color: string,
    alignment: string
  },
  gantt_graphics?:{
    
  },
  collapsed: boolean,
  format: string[],
  start_date: string,
  end_date: string,
  progress: number,
  cost: number,
  appointee: string,
  extra_info?: {},
  children?: Task[]
}

//Debug
interface Tab {
  name: string,
  icon: string,
  menuItems: MenuItem[],
  view
}
