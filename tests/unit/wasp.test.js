// Wasp Tests
function testWaspInstantiation() {
  const queen = new Queen();
  const worker = new Worker();
  const drone = new Drone();

  return assertAllEqual(
    {
      queenEnergy: queen.energy,
      workerEnergy: worker.energy,
      droneEnergy: drone.energy,
      queenType: queen.type,
      queenIcon: queen.icon,
      isKnockedOut: queen.isKnockedOut,
      knockoutTime: queen.knockoutTime
    },
    {
      queenEnergy: WASP_CONFIG.queen,
      workerEnergy: WASP_CONFIG.worker,
      droneEnergy: WASP_CONFIG.drone,
      queenType: 'queen',
      queenIcon: `${WASPS_PATH}queen.png`,
      isKnockedOut: false,
      knockoutTime: null
    },
    'Should correctly instantiate different wasp types with proper properties'
  );
}

function testInvalidWaspType() {
  let errorThrown = false;
  try {
    new Wasp('invalid');
  } catch (e) {
    errorThrown = e.message === 'Invalid wasp type supplied: invalid';
  }

  return assertTrue(
    errorThrown,
    'Should throw error for invalid wasp type'
  );
}

// Add tests to test suite
window.waspTests = [
  testWaspInstantiation,
  testInvalidWaspType
];
