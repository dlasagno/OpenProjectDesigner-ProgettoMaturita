import { TabController } from '../tab-window-scripts/tab-controller'
import { Tab, Tree, TreeNode } from './interfaces'


const wbsTab: Tab = {
  name: 'WBS',
  icon: 'fa-sitemap',
  menuItems: [
    {
      name: "m-test-2 - 1",
      action() {
        console.log("Menu1 - Funziona!!!")
      }
    },
    {
      name: "m-test-2 - 2",
      action() {
        console.log("Menu2 - Funziona!!!")
      }
    }
  ],
  view(tabController: TabController): Element {
    const xOffset: number = 100
    const yOffset: number = 50
    const rectWidth: number = 200
    const rectHeight: number = 50
    const rectSpacing: number = 30
    const fontSize: number = 16

    function createRect(x: number, y: number, id: string, text: string){
      const rect = paper.rect(x, y, rectWidth, rectHeight)
        .attr({"fill": "white", "cursor": "pointer"})
        .click(function() {
          tabController.selectedTaskId = id
        })
      const title = paper.text(x + rectWidth / 2, y + rectHeight / 2, text)
        .attr({"font-size": fontSize, "cursor": "pointer"})
        .click(function() {
          tabController.selectedTaskId = id
        })
      title.node.querySelector('tspan')
        .setAttribute('dy', fontSize / 4)
    }
    
    function createLine(startX: number, startY: number, finishX: number, finishY: number){
      const path = paper.path(`M ${startX} ${startY} L ${finishX} ${startY} ${finishX} ${finishY}`)
    }


    const wbsElement: Element = document.createElement('div')
    
    const paper = Raphael(wbsElement, 1000, 1000)

    let count = 0
    const tasksCoordinates = tabController.tasks.map<{x: number, y: number}>((node, id) => {
      return new TreeNode({
        x: (id ? id.split('.').length * (rectWidth + rectSpacing) : 0) + xOffset,
        y: ((rectHeight + rectSpacing) * count++) + yOffset
      })
    })

    tasksCoordinates.forEach((task, id) => { 
      createRect(task.data.x, task.data.y, id, tabController.tasks.getNodeById(id).data.title)
      if(id != '')
        createLine(
          task.data.x,
          task.data.y + rectHeight / 2,
          tasksCoordinates.getNodeById(id.split('.').slice(0, -1).join('.')).data.x + rectWidth / 2,
          tasksCoordinates.getNodeById(id.split('.').slice(0, -1).join('.')).data.y + rectHeight
        )
    })  
    
    
    return wbsElement
  }
}
