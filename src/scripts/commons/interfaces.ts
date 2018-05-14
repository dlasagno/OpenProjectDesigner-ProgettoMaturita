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

  static findTaskById(task: Task, id: string): Task {
    id.split('.')
    return task.children[0]
  }

}


//Interface for tabs
export interface Tab {
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


const task: Task = {
  title: '',
  description: '',
  collapsed: false,
  start_date: '',
  end_date: '',
  progress: 0
}
