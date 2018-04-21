import { Property } from "../commons/interfaces";

export class TabWindow {
  private currentTab;

  constructor(private tabs: Tab[], private propertiesPanel: Property<any>[]) {
    this.currentTab = tabs[0];
  }

  changeCurrentTab() {

  }

  getPropertiesValues() {

  }
}

