const mockDisplay = {
  setUpControls: () => { },
  updateWasps: () => { },
  getAllWaspElements: () => [],
  zapEffect: () => { },
  updateWaspDisplay: () => { },
  animateWasp: () => { },
  clearGameContainer: () => { },
  clearMessage: () => { },
  toggleZapButton: () => { }
};

// GameEngine Tests
function testGameInitialization() {
  const game = new GameEngine(mockDisplay);
  return assertAllEqual(
    {
      queenCount: 1,
      droneCount: game.wasps.drones.length,
      workerCount: game.wasps.workers.length,
      gameStarted: false,
      gameOver: false
    },
    {
      queenCount: GAME_CONFIG.WASPS_COUNT.QUEEN,
      droneCount: GAME_CONFIG.WASPS_COUNT.DRONES,
      workerCount: GAME_CONFIG.WASPS_COUNT.WORKERS,
      gameStarted: false,
      gameOver: false
    },
    'Should initialize game with correct number of wasps and initial state'
  );
}

function testZapWasp() {
  const game = new GameEngine(mockDisplay);
  game.gameStarted = true;

  const targetWasp = game.zapWasp();
  const initialEnergy = targetWasp.maxEnergy;
  const expectedEnergy = initialEnergy - GAME_CONFIG.ZAP_DAMAGE;

  return assertEqual(
    targetWasp.energy,
    expectedEnergy,
    `Should reduce wasp energy by ${GAME_CONFIG.ZAP_DAMAGE}`
  );
}

function testKnockoutWasp() {
  const game = new GameEngine(mockDisplay);
  const wasp = game.wasps.workers[0];
  game.knockoutWasp(wasp);

  return assertAllEqual(
    {
      isKnockedOut: wasp.isKnockedOut,
      energy: wasp.energy,
      hasKnockoutTime: wasp.knockoutTime !== null
    },
    {
      isKnockedOut: true,
      energy: 0,
      hasKnockoutTime: true
    },
    'Should properly knockout a wasp'
  );
}

function testCheckGameOver() {
  const game = new GameEngine(mockDisplay);

  // Test queen knockout
  game.knockoutWasp(game.wasps.queen);
  game.checkGameOver();

  return assertAllEqual(
    {
      gameStarted: game.isGameStarted(),
      gameOver: game.isGameOver(),
      message: game.checkGameOver()
    },
    {
      gameStarted: false,
      gameOver: true,
      message: 'Queen knocked out!'
    },
    'Should end game when queen is knocked out'
  );
}

function testZapOnLastEnergy() {
  const game = new GameEngine(mockDisplay);
  game.gameStarted = true;

  // Set up test scenario: only one active wasp with exact damage amount of energy
  game.getAllWasps().forEach(w => {
    if (w !== game.wasps.workers[0]) {
      game.knockoutWasp(w);
    }
  });

  const wasp = game.wasps.workers[0];
  wasp.energy = GAME_CONFIG.ZAP_DAMAGE;

  game.zapWasp();

  return assertAllEqual(
    {
      energy: wasp.energy,
      isKnockedOut: wasp.isKnockedOut
    },
    {
      energy: 0,
      isKnockedOut: true
    },
    'Should knockout wasp when damage equals remaining energy'
  );
}

function testWaspRevivalMechanism() {
  const game = new GameEngine(mockDisplay);
  const wasp = game.wasps.workers[0];
  game.knockoutWasp(wasp);

  // Mock time passage
  wasp.knockoutTime = Date.now() - 41000; // Just past revival time
  game.getWaspRecoveryTime(wasp);

  return assertAllEqual(
    {
      energy: wasp.energy,
      isKnockedOut: wasp.isKnockedOut,
      knockoutTime: wasp.knockoutTime
    },
    {
      energy: wasp.maxEnergy,
      isKnockedOut: false,
      knockoutTime: null
    },
    'Should properly revive wasp after knockout period'
  );
}


function testGameReset() {
  const game = new GameEngine(mockDisplay);
  game.startGame();

  // Knockout some wasps
  game.knockoutWasp(game.wasps.workers[0]);
  game.knockoutWasp(game.wasps.drones[0]);

  // Reset game
  game.handleReset();

  // Check all wasps are restored
  const allWaspsRestored = game.getAllWasps().every(wasp =>
    wasp.energy === wasp.maxEnergy &&
    !wasp.isKnockedOut &&
    wasp.knockoutTime === null
  );

  return assertAllEqual(
    {
      gameStarted: game.isGameStarted(),
      gameOver: game.isGameOver(),
      allWaspsRestored
    },
    {
      gameStarted: true,
      gameOver: false,
      allWaspsRestored: true
    },
    'Should properly reset game state and all wasps'
  );
}

function testZapDuringGameOver() {
  const game = new GameEngine(mockDisplay);
  game.gameOver = true;

  return assertEqual(
    game.zapWasp(),
    null,
    'Should not allow zapping when game is over'
  );
}

// Add tests to test suite
window.gameEngineTests = [
  testGameInitialization,
  testZapWasp,
  testKnockoutWasp,
  testCheckGameOver,
  testZapOnLastEnergy,
  testWaspRevivalMechanism,
  testGameReset,
  testZapDuringGameOver
];
