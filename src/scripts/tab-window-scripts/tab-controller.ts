export class TabController {
  //Attributi
  private currentTab: number = 0
  private selectedTask?: Task = null
  
  constructor(private tabs: Tab[], private tasks?: Task) { }

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
  menuItems: MenuItem[],
  view
}

new TabController([
  {
    menuItems: [],
    view: 1
  }
])