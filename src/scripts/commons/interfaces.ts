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

//Class for tabs
interface Tab {
  name: string
  icon: string
  menuItems: MenuItem[]
  view(): Element
}
