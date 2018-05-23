import { TabController } from '../tab-window-scripts/tab-controller'

//Class for the management of a Tree Node
export class TreeNode<T> {

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
export class Tree<T> {

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
export interface Task {

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
export interface Property {
  name: string
  description: string
  value: {
    task: Task
    key: string
  }
}


//Interface for tabs
export interface Tab {
  name: string
  icon: string
  menuItems: MenuItem[]
  view(tabController: TabController): Element
}


//Interface for tab menus
export interface MenuItem {
  name: string
  action()
}

//Interface for tab buttons
export interface TabButton extends MenuItem {
  icon: string
}

