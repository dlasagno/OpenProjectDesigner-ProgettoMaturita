//File per il raggruppamento dei file sparsi, DEBUG per problemi ad import/

const path = require('path')


const FileManager = require('../src/scripts/file-managment-scripts/file-manager')

//---------------------------------------------------------------------------------------------------------------

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
          forEach(node.children[childId], (index ? `${index}.` : '') + (Number(childId) + 1))
    }

    forEach(this._root, '')
  }

  reduce<K>(callback: (accumulator?: K, node?: TreeNode<T>,index?: string, tree?: Tree<T>) => K, initialValue: K): K {
    function reduce(accumulator: K, node: TreeNode<T>, index: string): K {
      accumulator = callback(accumulator, node, index, this)
      if (node.children)
        for (const childId in node.children)
          accumulator = reduce(accumulator, node.children[childId], (index ? `${index}.` : '') + (Number(childId) + 1))
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
          mappedNode.appendChild(map(node.children[childId], (index ? `${index}.` : '') + (Number(childId) + 1)))
      return mappedNode
    }

    const mappedTree: Tree<K> = new Tree<K>(null)
    mappedTree._root = map(this._root, '')
    return mappedTree
  }

  some(callback: (node?: TreeNode<T>,index?: string, tree?: Tree<T>) => boolean): boolean {
    function some(node: TreeNode<T>, index: string): boolean {
      if (callback(node, index, this))
        return true
      else if (node.children)
        for (const childId in node.children)
          if (some(node.children[childId], (index ? `${index}.` : '') + (Number(childId) + 1)))
            return true

      return false
    }

    return some(this.root, '')
  }

  every(callback: (node?: TreeNode<T>,index?: string, tree?: Tree<T>) => boolean): boolean {
    function every(node: TreeNode<T>, index: string): boolean {
      if (!callback(node, index, this))
        return false
      else if (node.children)
        for (const childId in node.children)
          if (!every(node.children[childId], (index ? `${index}.` : '') + (Number(childId) + 1)))
            return false

      return true
    }

    return every(this.root, '')
  }

}


//Debug interface for task without children reference
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

  start_date: Date
  end_date: Date

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
    const task: Task = tabController.tasks.getNodeById(taskId).data
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
    const addButtonElement = document.createElement('div')
      addButtonElement.classList.add('button')
      addButtonElement.innerHTML = '<span class="fas fa-plus"></span>'
      addButtonElement.addEventListener('click', () => tabController.appendToTask(taskId, {
        title: "new task",
        description: "",
        collapsed: false,
        start_date: new Date(tabController.tasks.getNodeById(taskId).data.start_date),
        end_date: new Date(tabController.tasks.getNodeById(taskId).data.end_date),
        progress: 0
      }))
    actionButtonsElement.appendChild(addButtonElement)


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
              const value = (event.target as HTMLInputElement).value
              property.value.task[property.value.key] = property.value.task[property.value.key] instanceof Date ? new Date(value) : value
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

  constructor(private tabs: Tab[], public tasks?: Tree<Task>) {
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

  appendToTask(taskId: string, task: Task) {
    this.tasks.getNodeById(taskId).appendChild(task)
    this.update()
  }

  update() {
    TabWindowRenderer.updateView(this.tabs[this._currentTab].view(this))
  }

}
//---------------------------------------------------------------------------------------------------------------

/* const task = {
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
} */

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

FileManager.toFile(tasks)
const tasksFromFile: Tree<Task> = FileManager.fromFile('src/data/prova.json')
/* console.log('task dal file:\n', tasksFromFile)
console.log('task originale:\n', tasks) */

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
  },
  {
    name: 'GANTT',
    icon: 'fa-th-list',
    menuItems: [],
    view(tabController: TabController): Element {
  
      function createRow(task: Task, taskId: string): HTMLTableRowElement {
        const taskRow = document.createElement('tr')
        taskRow.innerHTML = `
          <td>${taskId}</td>
          <td>${(taskId.length > 1 ? '&nbsp;'.repeat(taskId.split('.').length*2) : '') + task.title}</td>
          <td>${task.start_date.toLocaleDateString()}</td>
          <td>${task.end_date.toLocaleDateString()}</td>
          <td><progress max="100" value="${task.progress}"></td>
          <td>${task.cost == undefined ? '' : task.cost}</td>
        `
        const endDate = new Date(tabController.tasks.root.data.end_date)
        endDate.setMonth(endDate.getMonth() + 1)
        endDate.setDate(1)
        const date = new Date(tabController.tasks.root.data.start_date)
        date.setDate(1)
        while (date.getTime() < endDate.getTime()){
          const dayCell: Element = document.createElement('td')
          dayCell.classList.add('day-cell')
          if (date.getTime() >= task.start_date.getTime() && date.getTime() <= task.end_date.getTime())
            dayCell.classList.add('fill')
          taskRow.appendChild(dayCell)
          date.setDate(date.getDate() + 1)
        }
  
        taskRow.addEventListener('click', () => tabController.selectedTaskId = taskId)
  
        return taskRow
      }
  
      //Create the gantt's table
      const ganttElement = document.createElement('div')
            ganttElement.id = 'gantt-view'
  
      //Create the gantt's table
      const ganttTable = document.createElement('table')
  
      //Craete the gantt's header row
      const ganttHeader = document.createElement('tr')
            ganttHeader.innerHTML = `
              <th rowspan="2">#</th>
              <th rowspan="2">Task</th>
              <th rowspan="2">Start date</th>
              <th rowspan="2">End date</th>
              <th rowspan="2">Progress</th>
              <th rowspan="2">Costo</th>
            `
  
      //Add days to the gantt's header row
      const ganttDaysRow = document.createElement('tr')
  
      //controlla in che mese è il progetto e dopodiché crea i giorni
      const date = new Date(tabController.tasks.root.data.start_date)
      date.setDate(1)
      while (date.getTime() < tabController.tasks.root.data.end_date.getTime()){
        const monthCell: Element = document.createElement('th')
        monthCell.innerHTML = date.toISOString().slice(0, 7)
  
        const nextMonth = new Date(date)
        nextMonth.setMonth(date.getMonth() + 1)
        let daysCounter: number = 0
        while (date.getTime() < nextMonth.getTime()) {
          const dayCell: Element = document.createElement('th')
          dayCell.innerHTML = date.getDate().toString()
  
          ganttDaysRow.appendChild(dayCell)
          date.setDate(date.getDate() + 1)
          daysCounter++
        }
  
        monthCell.setAttribute('colspan', daysCounter.toString())
        ganttHeader.appendChild(monthCell)
      }
      ganttTable.appendChild(ganttHeader)
      ganttTable.appendChild(ganttDaysRow)
  
      //Add tasks rows to the gantt's table
      tabController.tasks.forEach(({data: task}, id) => {
        ganttTable.appendChild(createRow(task, id))
      })
  
      //Add the gantt table to the gantt
      ganttElement.appendChild(ganttTable)
  
      return ganttElement
    }
  }
], tasksFromFile)
