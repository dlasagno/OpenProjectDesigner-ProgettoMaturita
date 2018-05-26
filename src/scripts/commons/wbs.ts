import { TabController } from '../tab-window-scripts/tab-controller'
import { Tab } from './interfaces'
import 'raphael'


const ganttTab: Tab = {
  name: 'WBS',
  icon: 'fa-sitemap',
  menuItems: [],
  view(tabController: TabController): Element {
    var paper = Raphael(10, 50, 320, 320)
  }
}
