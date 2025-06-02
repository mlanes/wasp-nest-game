// DisplayEngine Tests
function testBuildGameHTML() {
  const mockWasps = [
    {
      type: 'queen',
      icon: 'assets/img/wasps/queen.png',
      energy: 52,
      maxEnergy: 52,
    }
  ];

  const result = DisplayEngine.buildGameHTML(mockWasps);
  return assertEqual(
    result.includes('wasp--queen') &&
    result.includes('52/52'),
    true,
    'Should generate correct HTML structure for wasps with energy bars and type-specific classes'
  );
}


function testToggleZapButton() {
  // Create mock button
  const button = document.createElement('button');
  button.className = 'game__button--zap';
  document.body.appendChild(button);

  DisplayEngine.toggleZapButton(true);
  const disabledResult = assertTrue(
    button.disabled,
    'Should disable zap button interaction when passed true'
  );

  DisplayEngine.toggleZapButton(false);
  const enabledResult = assertFalse(
    button.disabled,
    'Should enable zap button interaction when passed false'
  );

  // Cleanup
  document.body.removeChild(button);
  return enabledResult;
}

function testEnergyBarColorThresholds() {
  const energyFill = document.createElement('div');

  // Test color transitions at boundaries
  const thresholds = [
    { energy: 20, class: 'wasp__energy-fill--low', message: 'Should apply low energy visual indicator when energy is at 20%' },
    { energy: 30, class: 'wasp__energy-fill--low', message: 'Should maintain low energy visual indicator when energy is at boundary 30%' },
    { energy: 31, class: 'wasp__energy-fill--medium', message: 'Should switch to medium energy visual indicator when energy is above 30%' },
    { energy: 60, class: 'wasp__energy-fill--medium', message: 'Should maintain medium energy visual indicator when energy is at  boundary 60%' },
    { energy: 61, class: 'wasp__energy-fill--full', message: 'Should switch to full energy visual indicator when energy is above 60%' },
    { energy: 100, class: 'wasp__energy-fill--full', message: 'Should maintain full energy visual indicator when energy is at max 100%' }
  ];

  let lastResult;
  thresholds.forEach(({ energy, class: expectedClass, message }) => {
    DisplayEngine.updateEnergyBarColor(energyFill, energy);
    lastResult = assertTrue(
      energyFill.classList.contains(expectedClass),
      message
    );
  });

  return lastResult;
}

function testWaspDisplayUpdate() {
  // Setup mock DOM
  const waspDiv = document.createElement('div');
  const energyFill = document.createElement('div');
  energyFill.className = 'wasp__energy-fill';
  const energyLabel = document.createElement('div');
  energyLabel.className = 'wasp__energy-label';
  waspDiv.appendChild(energyFill);
  waspDiv.appendChild(energyLabel);

  const mockWasp = {
    energy: 52,
    maxEnergy: 52,
    isKnockedOut: false
  };

  DisplayEngine.updateWaspDisplay(mockWasp, waspDiv);

  return assertAllEqual(
    {
      energyWidth: energyFill.style.width,
      energyLabel: energyLabel.textContent,
      hasFullClass: energyFill.classList.contains('wasp__energy-fill--full')
    },
    {
      energyWidth: '100%',
      energyLabel: '52/52',
      hasFullClass: true
    },
    'Should update wasp energy bar width, label text, and apply correct energy level class'
  );
}

function testMessageManagement() {
  // Setup mock DOM
  const statusDiv = document.createElement('div');
  statusDiv.className = 'game__status';
  const messageDiv = document.createElement('div');
  messageDiv.className = 'game__status-message';
  statusDiv.appendChild(messageDiv);
  document.body.appendChild(statusDiv);

  // Ensure display is set before showing message
  statusDiv.style.display = 'none';
  statusDiv.style.opacity = '0';

  // Set the mock element as the DisplayEngine's statusElement
  DisplayEngine.statusElement = statusDiv;

  // Test show message
  DisplayEngine.showMessage('Test Message');
  const showResult = assertEqual(
    messageDiv.textContent,
    'Test Message',
    'Should display game status message with correct text and fade-in animation'
  );

  // Test clear message
  DisplayEngine.clearMessage();
  const clearResult = assertEqual(
    messageDiv.textContent,
    '',
    'Should clear game status message with fade-out animation'
  );

  // Cleanup
  document.body.removeChild(statusDiv);
  return clearResult;
}

function testKnockedOutWaspDisplay() {
  const waspDiv = document.createElement('div');
  const energyFill = document.createElement('div');
  energyFill.className = 'wasp__energy-fill';
  const energyLabel = document.createElement('div');
  energyLabel.className = 'wasp__energy-label';
  waspDiv.appendChild(energyFill);
  waspDiv.appendChild(energyLabel);

  const mockWasp = {
    energy: 0,
    maxEnergy: 52,
    isKnockedOut: true
  };

  DisplayEngine.updateWaspDisplay(mockWasp, waspDiv, 5000); // 5 seconds remaining

  return assertAllEqual(
    {
      hasKnockedOutClass: waspDiv.classList.contains('wasp--knocked-out'),
      energyWidth: energyFill.style.width,
      energyLabelIncludesTime: energyLabel.textContent.includes('5s')
    },
    {
      hasKnockedOutClass: true,
      energyWidth: '0%',
      energyLabelIncludesTime: true
    },
    'Should display knocked out wasp with zero energy, countdown timer, and knocked-out visual state'
  );
}

// Add tests to test suite
window.displayEngineTests = [
  testBuildGameHTML,
  testEnergyBarColorThresholds,
  testToggleZapButton,
  testWaspDisplayUpdate,
  testMessageManagement,
  testKnockedOutWaspDisplay
];
