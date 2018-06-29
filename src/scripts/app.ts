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


//Management of the files
let currentFile: string

//Create a modal for testing
const modalController = new ModalController()

//Inizializzazione del tabController
let tabController
if(FileManager.filesFromFolder('src/data').length){
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
            const tasks = FileManager.fromFile(currentFile)
            tabController = new TabController([wbsTab, ganttTab, projectInfoTab], tasks)
            tabController.update()
            modalController.closeModal()
          })
    modalBody.appendChild(fileDiv)
  })

  modalController.createModal({
    header: modalHeader,
    body: modalBody,
    canBeClosed: false
  })
}
else {
  const modalHeader = document.createElement('span')
    modalHeader.textContent = 'Insert the name of the project'

  const inputText = document.createElement('input') 
    inputText.setAttribute('type', 'text')
    inputText.required = true
    inputText.addEventListener('keydown', event => {
      if(event.key === 'Enter'&& inputText.value){
        FileManager.toFile(`src/data/${inputText.value}.json`, new Tree<Task>({ 
          title: inputText.value, 
          description: '', 
          collapsed: false, 
          start_date: new Date('2018-01-01'), 
          end_date: new Date('2018-01-01'), 
          progress: 0, 
          cost: 0 
        })) 
        currentFile = `src/data/${inputText.value}.json`
        const tasks = FileManager.fromFile(currentFile)
        tabController = new TabController([wbsTab, ganttTab, projectInfoTab], tasks)
        tabController.update() 
        modalController.closeModal()
      }
    })

  const modalBody = document.createElement('p') 
    modalBody.textContent = 'Project name: ' 
    modalBody.appendChild(inputText)
    
  const modalFooter = document.createElement('button')
    modalFooter.classList.add('button')
    modalFooter.textContent = 'New' 
    modalFooter.addEventListener('click', () => {
      if(inputText.value){
        FileManager.toFile(`src/data/${inputText.value}.json`, new Tree<Task>({ 
          title: inputText.value, 
          description: '', 
          collapsed: false, 
          start_date: new Date('2018-01-01'), 
          end_date: new Date('2018-01-01'), 
          progress: 0, 
          cost: 0 
        })) 
        currentFile = `src/data/${inputText.value}.json` 
        tabController.tasks = FileManager.fromFile(currentFile) 
        tabController.update() 
        modalController.closeModal()
      }
    }) 
  
  modalController.createModal({ 
    header: modalHeader, 
    body: modalBody,
    footer: modalFooter,
    canBeClosed: false
  })
}

//Side menu actions
function openProjectModal() {
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
            const tasks = FileManager.fromFile(currentFile)
            tabController.tasks = tasks
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
function saveProjectModal() {
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
function newProjectModal() {
  const modalHeader = document.createElement('span')
    modalHeader.textContent = 'Insert the name of the project'

  const inputText = document.createElement('input') 
    inputText.setAttribute('type', 'text')
    inputText.required = true
    inputText.addEventListener('keydown', event => {
      if(event.key === 'Enter')
        createProject()
    })

  const modalBody = document.createElement('p') 
    modalBody.textContent = 'Project name: ' 
    modalBody.appendChild(inputText)
    
  const modalFooter = document.createElement('button')
    modalFooter.classList.add('button')
    modalFooter.textContent = 'New' 
    modalFooter.addEventListener('click', createProject) 
  
  modalController.createModal({ 
    header: modalHeader, 
    body: modalBody,
    footer: modalFooter
  })

  function createProject(){
    if(inputText.value){
      FileManager.toFile(`src/data/${inputText.value}.json`, new Tree<Task>({ 
        title: inputText.value, 
        description: '', 
        collapsed: false, 
        start_date: new Date('2018-01-01'), 
        end_date: new Date('2018-01-01'), 
        progress: 0, 
        cost: 0 
      })) 
      currentFile = `src/data/${inputText.value}.json` 
      tabController.tasks = FileManager.fromFile(currentFile) 
      tabController.update() 
      modalController.closeModal()
    }
  }
}

//Load the side menu
const sideMenuController = new SideMenuController([
  {
    name: 'Open project',
    action: openProjectModal
  },
  {
    name: 'Save project',
    action: saveProjectModal
  },
  {
    name: 'New project',
    action: newProjectModal
  }
])
