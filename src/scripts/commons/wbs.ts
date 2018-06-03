import { TabController } from '../tab-window-scripts/tab-controller'
import { Tab } from './interfaces'


const ganttTab: Tab = {
  name: 'WBS',
  icon: 'fa-sitemap',
  menuItems: [],
  view(tabController: TabController): Element {
    const wbsElement = document.createElement('div')
    const paper = Raphael(wbsElement, 1000, 1000)

    let count = 1
    const taskCoo = tabController.tasks.map<{x: number, y: number}>((node, id) => {
      return new TreeNode({
        x: id ? id.split('.').length * 130 : 10,
        y: 80 * count++
      })
    })

    function createRect(x: number, y: number, id: string){
      const rect = paper.rect(x, y, 100, 50).attr({"fill": "white", "cursor": "pointer"}).click(function() {
        tabController.selectedTaskId = id
      }) 
    }
    
    function createLine(startX: number, startY: number, finishX: number, finishY: number){
      const path = paper.path(`M ${startX} ${startY} L ${finishX} ${startY} ${finishX} ${finishY}`)
    }

    function createTitle(text: string, x: number, y: number){
      const title = paper.text(x, y, text).attr({"font-size": 18, "text-anchor": "start"})
     }


    taskCoo.forEach((task, id) => { 
      createRect(task.data.x, task.data.y, id)
      //createTitle(tabController.tasks.getNodeById(id).data.title, (task.data.x + 10), (task.data.y))
      if(id != '')
        createLine(task.data.x, (task.data.y + 25), (taskCoo.getNodeById(id.split('.').slice(0, -1).join('.')).data.x + 50), (taskCoo.getNodeById(id.split('.').slice(0, -1).join('.')).data.y) + 50)
    })  
    
    
    return wbsElement
  }
}
