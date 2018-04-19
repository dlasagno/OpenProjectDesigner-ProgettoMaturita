
export class TabMenu {

  constructor(private menuItems: MenuItem[]) { }

}

export interface MenuItem {
  name: string,
  action: Function
}
