//Interface for properties
export interface Property<T> {
  name: string;
  description: string;
  value: T;
}


//Interface for tasks
export interface Task {

  title: string
  description: string

  wbs_graphics?: {
    color: string
  }

  gantt_graphics?:{
    
  }

  collapsed: boolean

  format?: string[]

  start_date: string
  end_date: string

  progress: number
  cost?: number
  appointee?: string

  extra_info?: {}

  children?: Task[]
  
}

//Class with static methods to work on tasks
export class Task {

  static ciao(){
    console.log("ciao")
  }

}


//Interface for tabs
interface Tab {
  name: string
  icon: string
  menuItems: MenuItem[]
  view(tabController: TabController): Element
}


//Interface for tab menus
export interface MenuItem {
  name: string,
  action()
}

//Interface for tab buttons
export interface TabButton extends MenuItem {
  icon: string
}



const ganttTab: Tab = {
  name: 'GANTT',
  icon: 'fa-th-list',
  menuItems: [],
  view(tabController: TabController): Element {
    return document.createElement('div')
  }
}
