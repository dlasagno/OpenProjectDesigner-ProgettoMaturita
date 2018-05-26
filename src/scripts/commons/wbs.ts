import { TabController } from '../tab-window-scripts/tab-controller'
import { Tab } from './interfaces'
import 'raphael'


const ganttTab: Tab = {
  name: 'WBS',
  icon: 'fa-sitemap',
  menuItems: [],
  view(tabController: TabController): Element {
    const paper = Raphael(0 , 0, 500, 400)
    const rect = paper.rect(1, 1, 20, 30).attr('fill', 'red')

    return paper
  }
}
