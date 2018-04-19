
export class PropertiesPanel {

  constructor(private properties: Property[]) { }

}

export interface Property {
  name: string,
  description: string,
  value: any
}
