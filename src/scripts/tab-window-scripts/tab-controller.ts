export class TabController {
  
  constructor(private tasks: Task) { }

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
  extra_info: string,
  children?: Task[]
}