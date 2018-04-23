import { MenuItem } from "./tab-menu"

//Classe per la creazione di tab da mostrare in tab-window
export class Tab {
    constructor(private _menu: MenuItem[]) { }

    get menu() {return this._menu}
}
