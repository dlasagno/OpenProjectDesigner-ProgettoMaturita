import { MenuItem } from "./tab-menu"

//Classe per la creazione di tab da mostrare in tab-window
export class Tab {
    constructor(private _name: string, private _icon: string, private _menu: MenuItem[]) { }

    get name() {return this._name}
    get icon() {return this._icon}
    get menu() {return this._menu}
}

export interface TabButton extends MenuItem {
    icon: string
}
