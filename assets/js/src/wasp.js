const WASPS_PATH = './assets/img/wasps/';

// Configuration object containing energy levels for each wasp type
const WASP_CONFIG = Object.freeze({
  queen: 52,
  worker: 30,
  drone: 20
});

class Wasp {
  isKnockedOut = false;
  knockoutTime = null;

  constructor(type) {
    if (!(type in WASP_CONFIG)) {
      throw new Error(`Invalid wasp type supplied: ${type}`);
    }

    this.type = type;
    this.energy = WASP_CONFIG[type];
    this.maxEnergy = WASP_CONFIG[type];
    this.icon = `${WASPS_PATH}${type}.png`;
  }
}

class Queen extends Wasp {
  constructor() {
    super('queen');
  }
}

class Worker extends Wasp {
  constructor() {
    super('worker');
  }
}

class Drone extends Wasp {
  constructor() {
    super('drone');
  }
}
