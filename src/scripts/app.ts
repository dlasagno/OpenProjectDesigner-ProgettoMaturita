import { FileManager } from './file-managment-scripts/file-manager'
import { Tree, Task } from './commons/interfaces'
import { TabController } from './tab-window-scripts/tab-controller'
import { SideMenuController } from './side-menu-script/side-menu-controller'

//Tabs to display int he tab window
import { ganttTab } from './commons/tabs/gantt'
import { wbsTab } from './commons/tabs/wbs'
import { projectInfoTab } from './commons/tabs/project-info'

//File for the style of page
import '../styles/main.styl'
import '../../node_modules/@fortawesome/fontawesome-free/css/all.css'
import './style-scripts/style-script'


//Tasks for testing the software
const tasks: Tree<Task> = new Tree({
  title: 'Progetto',
  description: 'desrizione progetto',
  collapsed: false,
  start_date: new Date('2018-01-01'),
  end_date: new Date('2018-01-03'),
  progress: 50,
  cost: 3000
})
tasks.root.appendChildren([
  {
    title: 'Pianificazione',
    description: 'descrizione pianificazione',
    collapsed: false,
    start_date: new Date('2018-01-03'),
    end_date: new Date('2018-01-03'),
    progress: 50,
    cost: 500
  },
  {
    title: 'Preparazione',
    description: 'descrizione preparazione',
    collapsed: false,
    start_date: new Date('2018-01-03'),
    end_date: new Date('2018-01-03'),
    progress: 30,
    cost: 2000
  },
  {
    title: 'Realizzazione',
    description: 'descrizione realizzazione',
    collapsed: false,
    start_date: new Date('2018-01-03'),
    end_date: new Date('2018-01-03'),
    progress: 70,
    cost: 5000
  }
])
tasks.getNodeById('1').appendChildren([
  {
    title: 'Raccolta dati',
    description: 'descrizione raccolta dati',
    collapsed: false,
    start_date: new Date('2018-01-01'),
    end_date: new Date('2018-01-01'),
    progress: 50,
    cost: 100
  },
  {
    title: 'Esaminazione',
    description: 'descrizione esaminazione',
    collapsed: false,
    start_date: new Date('2018-01-02'),
    end_date: new Date('2018-01-03'),
    progress: 50,
    cost: 400
  }
])
tasks.getNodeById('1.1').appendChildren([
  {
    title: 'Raccolta richieste clienti',
    description: 'descrizione raccolta dati',
    collapsed: false,
    start_date: new Date('2018-01-01'),
    end_date: new Date('2018-01-01'),
    progress: 80,
    cost: 30
  },
  {
    title: 'Raccolta esigenze utenti',
    description: 'descrizione esaminazione',
    collapsed: false,
    start_date: new Date('2018-01-01'),
    end_date: new Date('2018-01-01'),
    progress: 20,
    cost: 70
  }
])

//Management of the files
//FileManager.toFile('src/data/prova.json', tasks)
const tasksFromFile: Tree<Task> = FileManager.fromFile('src/data/prova.json')

//Load the side menu
const sideMenuController = new SideMenuController([
  {
    name: 'Apri',
    action() {
      
    }
  },
  {
    name: 'Salva',
    action() {
      
    }
  },{
    name: 'Nuovo',
    action() {
      
    }
  }
])

//Load the tab window
const tabController = new TabController([wbsTab, ganttTab, projectInfoTab], tasksFromFile)
