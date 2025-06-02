class DisplayEngine {
  static container;
  static statusElement;

  static initialize() {
    this.container = document.querySelector('.game__container');
    this.statusElement = document.querySelector('.game__status');
  }

  static updateWasps(wasps) {
    const htmlCode = this.buildGameHTML(wasps);
    this.render(htmlCode);
  }

  static buildGameHTML(wasps) {
    return wasps.map(wasp => this.renderWaspHTML(wasp)).join('');
  }

  static renderWaspHTML(wasp) {
    const capitalizedWaspType = wasp.type.charAt(0).toUpperCase() + wasp.type.slice(1);
    return `
      <div class="wasp wasp--${wasp.type}" title="${capitalizedWaspType} wasp">
          <img src="${wasp.icon}" alt="${capitalizedWaspType} wasp"/>
          <div class="wasp__energy">
              <div class="wasp__energy-bar">
                  <div class="wasp__energy-fill wasp__energy-fill--full"></div>
              </div>
              <div class="wasp__energy-label">${wasp.energy}/${wasp.maxEnergy}</div>
          </div>
          <div class="wasp__zapper"></div>
      </div>
    `;
  }

  static render(htmlCode) {
    this.container.innerHTML = htmlCode;
  }

  static setUpControls(onZap, onReset) {
    const zapButton = document.querySelector('.game__button--zap');
    const resetButtons = document.querySelectorAll('.game__button--reset');

    zapButton.onclick = onZap;
    resetButtons.forEach(element => element.onclick = onReset);
  }

  static showMessage(message) {
    // Update message first
    const statusMessage = this.statusElement.querySelector('.game__status-message');
    statusMessage.textContent = message;

    // Then show element
    this.statusElement.style.display = 'flex';
    requestAnimationFrame(() => {
      this.statusElement.style.opacity = '1';
    });
  }

  static clearMessage() {
    // Clear message immediately while fading out
    const statusMessage = this.statusElement.querySelector('.game__status-message');
    statusMessage.textContent = '';

    // fadeOut Effect
    this.statusElement.style.removeProperty('opacity');
    setTimeout(() => {
      this.statusElement.style.removeProperty('display');
    }, 500);
  }

  static updateWaspDisplay(wasp, element, knockoutTimeRemaining = null) {
    if (!wasp || !element) {
      return;
    }

    // Build all content first
    const knockedOut = wasp.isKnockedOut;
    const energyFillSize = (wasp.energy / wasp.maxEnergy) * 100;
    let labelText = `${wasp.energy}/${wasp.maxEnergy}`;
    if (knockedOut && knockoutTimeRemaining > 0 && wasp.type !== 'queen') {
      const remainingSeconds = Math.ceil(knockoutTimeRemaining / 1000);
      labelText += ` (${remainingSeconds}s)`;
    }

    // Update DOM all at once
    element.classList.toggle('wasp--knocked-out', knockedOut);
    const energyFill = element.querySelector('.wasp__energy-fill');
    const energyLabel = element.querySelector('.wasp__energy-label');

    if (energyFill && energyLabel) {
      energyFill.style.width = `${energyFillSize}%`;
      this.updateEnergyBarColor(energyFill, energyFillSize);
      energyLabel.textContent = labelText;
    }
  }

  static updateEnergyBarColor(energyFill, energyFillSize) {
    energyFill.classList.remove('wasp__energy-fill--full', 'wasp__energy-fill--medium', 'wasp__energy-fill--low');

    if (energyFillSize <= 30) {
      energyFill.classList.add('wasp__energy-fill--low');
    } else if (energyFillSize <= 60) {
      energyFill.classList.add('wasp__energy-fill--medium');
    } else {
      energyFill.classList.add('wasp__energy-fill--full');
    }
  }

  /* Animate Wasp to move randomly **/
  static animateWasp(element, containerWidth, containerHeight) {
    if (!element) {
      return;
    }

    const x = Math.random() * (containerWidth - element.offsetWidth);
    const y = Math.random() * (containerHeight - element.offsetHeight);
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
  }

  static zapEffect(element) {
    if (!element) {
      return;
    }

    const zapper = element.querySelector('.wasp__zapper');

    zapper.style.visibility = 'visible';
    zapper.style.opacity = '1';
    element.classList.add('animate-electrocute');

    setTimeout(() => {
      zapper.style.removeProperty('visibility');
      zapper.style.removeProperty('opacity');
      element.classList.remove('animate-electrocute');
    }, 500);
  }

  static getAllWaspElements() {
    return document.querySelectorAll('.wasp');
  }

  static clearGameContainer() {
    this.container.innerHTML = '';
  }

  static toggleZapButton(disabled) {
    const zapButton = document.querySelector('.game__button--zap');
    if (zapButton) zapButton.disabled = disabled;
  }
}
