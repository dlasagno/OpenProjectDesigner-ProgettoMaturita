import { FileManager } from './file-managment-scripts/file-manager'
import { Tree, Task } from './commons/interfaces'
import { TabController } from './tab-window-scripts/tab-controller'
import { SideMenuController } from './side-menu-script/side-menu-controller'
import { ModalController } from './style-scripts/modal-controller'

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
let currentFile: string = 'src/data/prova.json'

//Create a modal for testing
const modalController = new ModalController()

//Load the side menu
const sideMenuController = new SideMenuController([
  {
    name: 'Apri',
    action() {
      const modalHeader = document.createElement('span')
        modalHeader.textContent = 'Choose the project to open'

      const modalBody = document.createElement('div')
        modalBody.classList.add('list')

      FileManager.filesFromFolder('src/data').forEach(file => {
        const fileDiv = document.createElement('button')
              fileDiv.classList.add('button')
              fileDiv.textContent = file.split('.')[0].replace('-', ' ')
              fileDiv.addEventListener('click', () => {
                currentFile = `src/data/${file}`
                tabController.tasks = FileManager.fromFile(currentFile)
                tabController.update()
                modalController.closeModal()
              })
        modalBody.appendChild(fileDiv)
      })

      modalController.createModal({
        header: modalHeader,
        body: modalBody
      })
    }
  },
  {
    name: 'Salva',
    action() {
      FileManager.toFile(currentFile, tabController.tasks)
      
      const modalHeader = document.createElement('span')
        modalHeader.textContent = 'Project saved'

      const modalBody = document.createElement('span')
        modalBody.textContent = 'The current project has been saved'
      
      modalController.createModal({
        header: modalHeader,
        body: modalBody
      })
    }
  },
  {
    name: 'Nuovo',
    action(){
      const modalHeader = document.createElement('span')
            modalHeader.textContent = 'Insert the name of the project' 
      const modalBody = document.createElement('p') 
            modalBody.textContent = 'Project: ' 
      const inputText = document.createElement('input') 
            inputText.setAttribute('type', 'text')
      const modalFooter = document.createElement('button')
            modalFooter.classList.add('button')
            modalFooter.textContent = 'New' 
            modalFooter.addEventListener('click', () => { 
              FileManager.toFile(`src/data/${inputText.value}`, new Tree({ 
                                                            title: inputText.value, 
                                                            description: '', 
                                                            collapsed: false, 
                                                            start_date: new Date('2018-01-01'), 
                                                            end_date: new Date('2018-01-03'), 
                                                            progress: 0, 
                                                            cost: 0 
                                                          })) 
              currentFile = `src/data/${inputText.value}` 
              tabController.tasks = FileManager.fromFile(currentFile) 
              tabController.update() 
              modalController.closeModal()
            }) 
      
      modalBody.appendChild(inputText)
      modalController.createModal({ 
        header: modalHeader, 
        body: modalBody,
        footer: modalFooter
        }) 
      }
  }
])

//Load the tab window
const tabController = new TabController([wbsTab, ganttTab, projectInfoTab], tasksFromFile)
