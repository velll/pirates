class Shipyard {
  private designs: Design[];

  constructor(designs: Design[]) {
    this.designs = designs;
  }

  public findModel(fleet: string, type: string, golden = false, wreck = false) {
    const order = {fleet: fleet, type: type, golden: golden};

    return this.getDesigns(wreck).filter(el => this.isMatch(el, order))[0].model;
  }

  public findLiveModel(fleet: string, type: string, golden = false) {
    return this.findModel(fleet, type, golden, false);
  }

  public findWreckModel(fleet: string, type: string, golden = false) {
    return this.findModel(fleet, type, golden, false);
  }

  private getDesigns(wreck = false) {
    return this.designs.filter(el => (el.wreck == wreck));
  }

  private isMatch(design: Design, order: Order) {
    return design.type == order.type &&
           design.fleet == order.fleet &&
           design.golden == order.golden;
  }
}

interface Design {
  model: CanvasImageSource;
  type: string;
  fleet: string;
  wreck: boolean;
  golden: boolean;
}

interface Order {
  fleet: string,
  type: string,
  golden: boolean
}

enum ShipType {
  brigantine = "brigantine",
  galleon = "galleon"
}

export { Shipyard, Design, ShipType};
