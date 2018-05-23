import { TaskNoChildren } from '../commons/interfaces';
//File per il raggruppamento dei file sparsi, DEBUG per problemi ad import/
//Class for the management of a Tree Node
class TreeNode<T> {

  private _children: TreeNode<T>[]

  constructor(public data: T) {
    this._children = []
  }

  get children() { return this._children as ReadonlyArray<TreeNode<T>> }
  appendChild(childData: T): TreeNode<T>;
  appendChild(childNode: TreeNode<T>): TreeNode<T>;
  appendChild(child: T | TreeNode<T>): TreeNode<T> {
    return this.children[this._children.push(child instanceof TreeNode ? child : new TreeNode<T>(child as T)) - 1]
  }
  appendChildren(childrenData: T[]): ReadonlyArray<TreeNode<T>>;
  appendChildren(childrenNodes: TreeNode<T>[]): ReadonlyArray<TreeNode<T>>;
  appendChildren(children: T[] | TreeNode<T>[]): ReadonlyArray<TreeNode<T>> {
    for (const child of children)
      this._children.push(child instanceof TreeNode ? child : new TreeNode<T>(child as T))
    return this.children
  }
  
  removeChild(childIndex: number): void { this._children.splice(childIndex, 1) }
  removeChildren(): void { this._children = [] }

}

//Class for the management of a Tree
class Tree<T> {

  private _root: TreeNode<T>

  constructor(data: T) {
    this._root = new TreeNode<T>(data)
  }

  get root() { return this._root }

  getNodeById(id: string): TreeNode<T> {
    function getNodeById(root: TreeNode<T>, id: string): TreeNode<T> {
      if (id.length < 1)
        return root
      else {
        const ids: string[] = id.split('.')
        return getNodeById(root.children[parseInt(ids[0]) - 1], ids.slice(1).join('.'))
      }
    }

    return getNodeById(this._root, id)
  }

  removeNodeById(id: string): void {
    const parent: TreeNode<T> = this.getNodeById(id.split('.').slice(0, -1).join('.'))
    const taskId: number = Number(id.split('.').pop()) - 1
    if(parent && parent.children[taskId])
      parent.removeChild(taskId)
  }

  forEach(callback: (node?: TreeNode<T>,index?: string, tree?: Tree<T>) => void): void {
    function forEach(node: TreeNode<T>, index: string): void {
      callback(node, index, this)
      if (node.children)
        for (const childId in node.children)
          forEach(node.children[childId], `${index}.${childId + 1}`)
    }

    forEach(this._root, '')
  }
  
  reduce<K>(callback: (accumulator?: K, node?: TreeNode<T>,index?: string, tree?: Tree<T>) => K, initialValue: K): K {
    function reduce(accumulator: K, node: TreeNode<T>, index: string): K {
      accumulator = callback(accumulator, node, index, this)
      if (node.children)
        for (const childId in node.children)
          accumulator = reduce(accumulator, node.children[childId], `${index}.${childId + 1}`)
      return accumulator
    }

    let accumulator = initialValue
    return reduce(accumulator, this._root, '')
  }

  map<K>(callback: (node?: TreeNode<T>,index?: string, tree?: Tree<T>) => TreeNode<K>): Tree<K> {
    function map(node: TreeNode<T>, index: string): TreeNode<K> {
      const mappedNode: TreeNode<K> = callback(node, index, this)
      if (node.children)
        for (const childId in node.children)
          mappedNode.appendChild(map(node.children[childId], `${index}.${childId + 1}`))
      return mappedNode
    }

    const mappedTree: Tree<K> = new Tree<K>(null)
    mappedTree._root = map(this._root, '')
    return mappedTree
  }

}

//Debug interface for task without children reference
interface TaskNoChildren {

  title: string
  description: string

  wbs_graphics?: {
    color: string
  }

  gantt_graphics?: {

  }

  collapsed: boolean

  format?: string[]

  start_date: string
  end_date: string

  progress: number
  cost?: number
  appointee?: string

  extra_info?: {}

}


//Interface for properties
interface Property {
  name: string
  description: string
  value: {
    task: Task
    key: string
  }
}


//Interface for tasks
interface Task {

  title: string
  description: string

  wbs_graphics?: {
    color: string
  }

  gantt_graphics?: {

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
class Task {

  static getTaskById(task: Task, id: string): Task {
    if (id.length < 1)
      return task
    else {
      const ids: number[] = id.split('.').map(num => parseInt(num))
      task = task.children[ids[0] - 1]
      ids.shift()
      return this.getTaskById(task, ids.join('.'))
    }
  }

  static getParentTask(task: Task, id: string): Task {
    return this.getTaskById(task, id.slice(0, -1))
  }

  static removeTask(task: Task, id: string): boolean {
    const parent: Task = this.getParentTask(task, id)
    const taskId: number = Number(id.split('.').pop())
    if(parent.children[taskId] != undefined) {
      parent.children.splice(taskId, 1)
      return true
    }
    return false
  }

}


//Interface for tabs
interface Tab {
  name: string
  icon: string
  menuItems: MenuItem[]
  view(tabController: TabController): Element
}


//Interface for tab menus
interface MenuItem {
  name: string
  action()
}

//Interface for tab buttons
interface TabButton extends MenuItem {
  icon: string
}



//---------------------------------------------------------------------------------------------------------------

class TabWindowRenderer {
  
  private static windowElement = document.querySelector('#tab-window')


  static updateMenu(menuItems: MenuItem[]): void {
    //Select the tab's menu
    const menuElement = this.windowElement.querySelector('#tab-menu .menu')

    //Empty the tab's menu
    while (menuElement.firstChild)
      menuElement.removeChild(menuElement.firstChild)

    //Populate the tab's menu
    for (const menuItem of menuItems) {
      //create a new menu item to append to the menu
      const menuItemElement = document.createElement('li')
      menuItemElement.classList.add('button')
      menuItemElement.addEventListener('click', menuItem.action)
      menuItemElement.innerHTML = `<span>${menuItem.name}</span>`
      menuElement.appendChild(menuItemElement)
    }
  }

  static updateNav(tabs: TabButton[], activeTabIndex: number): void {
    //Select the tabs navigation
    const navElement = this.windowElement.querySelector('#tab-nav')

    //Empty the tabs navigation
    Array.from(navElement.children).forEach(tabElement => {
      if (tabElement.id.endsWith('tab-button'))
        tabElement.remove()
    })

    //Populate the tabs navigation
    for (const tab of tabs) {
      //create a tab button
      const tabElement = document.createElement('div')
      tabElement.id = `${tab.name}-tab-button`
      tabElement.classList.add('button')
      if (tab === tabs[activeTabIndex])
        tabElement.classList.add('active')
      else
        tabElement.addEventListener('click', tab.action)
      tabElement.innerHTML = `
        <div>
          <span>${tab.name}</name>
        </div>
        <span class="fas ${tab.icon}"></span>
      `
      //Append the new tab button to the tabs navigation
      navElement.appendChild(tabElement)
    }
  }

  static updatePropertiesPanel(taskId: string, tabController: TabController): void {
    //Create a list of properties of the task
    const task: TaskNoChildren = tabController.tasks.getNodeById(taskId).data
    const properties: Property[] = []
    for(const prop in task)
      properties.push({
        name: prop,
        description: '',
        value: {
          task: task,
          key: prop
        }
      })

    //Select the properties list
    const propertiesPanelElement = this.windowElement.querySelector('#properties-panel')


    //Select the action buttons
    const actionButtonsElement = propertiesPanelElement.querySelector('#action-buttons')

    //Empty the action buttons
    while (actionButtonsElement.firstChild)
      actionButtonsElement.removeChild(actionButtonsElement.firstChild)

    //Append buttons to the action buttons
    const deleteButtonElement = document.createElement('div')
      deleteButtonElement.classList.add('button', 'delete-button')
      deleteButtonElement.innerHTML = '<span class="fas fa-trash-alt"></span>'
      deleteButtonElement.addEventListener('click', () => tabController.removeTask(taskId) ) 
    actionButtonsElement.appendChild(deleteButtonElement)


    //Select the properties list
    const propertiesListElement = propertiesPanelElement.querySelector('#properties-list')

    //Empty the properties list
    while (propertiesListElement.firstChild)
      propertiesListElement.removeChild(propertiesListElement.firstChild)

    for (const property of properties) {
      //create a property to append to the properties list
      const propertyElement = document.createElement('div')
      propertyElement.classList.add('property')

      //Create the head of the property
      const propertyHeadElement = document.createElement('div')
        propertyHeadElement.classList.add('property-head')
        propertyHeadElement.innerHTML = `<span>${property.name}</span>`
      propertyElement.appendChild(propertyHeadElement)

      //Create the body of the property
      const propertyBodyElement = document.createElement('div')
        propertyBodyElement.classList.add('property-body')
        const descriptionProperty = document.createElement('span')
          descriptionProperty.innerHTML = property.description
        const inputProperty = document.createElement('input')
          inputProperty.setAttribute('type', 'text')
          inputProperty.setAttribute('value', property.value.task[property.value.key])
          inputProperty.addEventListener('keydown', event => {
            if (event.key === "Enter") {
              property.value.task[property.value.key] = (event.target as HTMLInputElement).value
              tabController.update()
            }
          })
        propertyBodyElement.appendChild(descriptionProperty)
        propertyBodyElement.appendChild(inputProperty)
      propertyElement.appendChild(propertyBodyElement)

      //Append all to the properties list
      propertiesListElement.appendChild(propertyElement)
    }

    propertiesPanelElement.appendChild(actionButtonsElement)
    propertiesPanelElement.appendChild(propertiesListElement)
  }

  static updateView(view: Element): void {
    //Select the tab view
    const viewElement = this.windowElement.querySelector('#tab-view')

    //Empty the tab view
    while (viewElement.firstChild)
      viewElement.removeChild(viewElement.firstChild)

    //Append the new rendered view to the tab view
    viewElement.appendChild(view)
  }

}

class TabController {
  //Attributi
  private _currentTab: number = 0
  private _selectedTaskId: string = ''

  constructor(private tabs: Tab[], public tasks?: Tree<TaskNoChildren>) {
    this.currentTab = 0
  }

  get currentTab() { return this._currentTab }
  set currentTab(tabNumber: number) {
    if (tabNumber >= 0 && tabNumber < this.tabs.length) {
      this._currentTab = tabNumber

      TabWindowRenderer.updateNav(this.tabs.reduce((tabButtons, tab, tabId) => {
        tabButtons.push({
          name: tab.name,
          icon: tab.icon,
          action: () => this.currentTab = tabId
        })
        return tabButtons
      }, []), this._currentTab)
      TabWindowRenderer.updateMenu(this.tabs[this._currentTab].menuItems)
      TabWindowRenderer.updateView(this.tabs[this._currentTab].view(this))
    }
  }

  get selectedTaskId() { return this._selectedTaskId }
  set selectedTaskId(taskId: string) {
    if (taskId || taskId === '') {
      this._selectedTaskId = taskId

      TabWindowRenderer.updatePropertiesPanel(taskId, this)
    }
  }

  removeTask(taskId: string) {
    this.tasks.removeNodeById(taskId)
    this.update()
  }

  update() {
    TabWindowRenderer.updateView(this.tabs[this._currentTab].view(this))
  }

}

//---------------------------------------------------------------------------------------------------------------

const task: Task = {
  title: 'Progetto',
  description: 'desrizione progetto',
  collapsed: false,
  start_date: '01-01-2018',
  end_date: '03-01-2018',
  progress: 50,
  cost: 3000,
  children: [
    {
      title: 'Pianificazione',
      description: 'descrizione pianificazione',
      collapsed: false,
      start_date: '01-01-2018',
      end_date: '03-01-2018',
      progress: 50,
      cost: 500,
      children: [
        {
          title: 'Raccolta dati',
          description: 'descrizione raccolta dati',
          collapsed: false,
          start_date: '01-01-2018',
          end_date: '01-01-2018',
          progress: 50,
          cost: 100,
          children: [
            {
              title: 'Raccolta richieste clienti',
              description: 'descrizione raccolta dati',
              collapsed: false,
              start_date: '01-01-2018',
              end_date: '01-01-2018',
              progress: 80,
              cost: 30
            },
            {
              title: 'Raccolta esigenze utenti',
              description: 'descrizione esaminazione',
              collapsed: false,
              start_date: '01-01-2018',
              end_date: '01-01-2018',
              progress: 20,
              cost: 70
            }
          ]
        },
        {
          title: 'Esaminazione',
          description: 'descrizione esaminazione',
          collapsed: false,
          start_date: '02-01-2018',
          end_date: '03-01-2018',
          progress: 50,
          cost: 400
        }
      ]
    },
    {
      title: 'Preparazione',
      description: 'descrizione preparazione',
      collapsed: false,
      start_date: '03-01-2018',
      end_date: '03-01-2018',
      progress: 30,
      cost: 2000
    },
    {
      title: 'Realizzazione',
      description: 'descrizione realizzazione',
      collapsed: false,
      start_date: '03-01-2018',
      end_date: '03-01-2018',
      progress: 70,
      cost: 5000
    }
  ]
}

const tabController = new TabController([
  {
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
    view() {
      return document.createElement('h1')
    }
  },
  {
    name: 'GANTT',
    icon: 'fa-th-list',
    menuItems: [],
    view(tabController: TabController): Element {

      const months = [
        'Gennaio',
        'Febbraio',
        'Marzo',
        'Aprile',
        'Maggio',
        'Giugno',
        'Luglio',
        'Agosto',
        'Settembre',
        'Ottobre',
        'Novembre',
        'Dicembre'
      ]

      //giorni di ogni mese...
      const days = [
        ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ],
        ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'],
        ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ],
        ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
        ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ],
        ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
        ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ],
        ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ],
        ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
        ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ],
        ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
        ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ],
      ]


      function getStartMonthTask(task: TaskNoChildren){
        return parseInt(task.start_date.split('-')[1])
      }


      function getYearTask(task: TaskNoChildren){
        return parseInt(task.start_date.split('-')[2])
      }

      function createRow(task: TaskNoChildren, taskId: string, taskChildId: string) {
        const tr = document.createElement('tr')
        tr.innerHTML = `
          <td>${taskId}</td>
          <td>${task.title}</td>
          <td>${task.start_date}</td>
          <td>${task.end_date}</td>
          <td><progress max="100" value="${task.progress}"></td>
          <td>${task.cost ? '' : task.cost}</td>
        `
        tr.addEventListener('click', () => tabController.selectedTaskId = taskId)

        for (let i = 0; i < 8; i++) {
          const td7 = document.createElement('td')
                td7.innerHTML = ` `
                tr.appendChild(td7)
        }

      }

      //Create the gantt's table
      const ganttTable = document.createElement('table')

      //Craete the gantt's header row
      const ganttHeader = document.createElement('tr')
      ganttHeader.innerHTML = `
        <th rowspan="2">#</th>
        <th rowspan="2">Task</th>
        <th rowspan="2">Start date</th>
        <th rowspan="2">End date</th>
        <th rowspan="2"><progress max="100" value="50"></th>
        <th rowspan="2">Costo</th>
        <th colspan="${days[getStartMonthTask(tabController.tasks.root.data) - 1].length}">${months[getStartMonthTask(tabController.tasks.root.data) - 1]} ${getYearTask(tabController.tasks.root.data)}</th>
      `
      ganttTable.appendChild(ganttHeader)

      //Add days to the gantt's header row
      const ganttDaysRow = document.createElement('tr')

      //controlla in che mese è il progetto e dopodiché crea i giorni
      for (let i = 0; i < days[getStartMonthTask(tabController.tasks.root.data) - 1].length; i++) {
        const dayCell = document.createElement('th')
              dayCell.innerHTML = (i + 1).toString()
        ganttDaysRow.appendChild(dayCell)
      }
      ganttTable.appendChild(ganttDaysRow)

      //Add tasks rows to the gantt's table
      let taskId = '0'
      for (const task of tabController.tasks.root.children) {
        taskId = (parseInt(taskId) + 1).toString()
        createRow(task.data, taskId, '0')
      }
      return ganttTable
    }
  }
], task)
