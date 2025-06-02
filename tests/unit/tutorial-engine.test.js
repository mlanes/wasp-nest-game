// TutorialEngine Tests
function setupTutorialElements() {
  // Clear any existing localStorage state
  localStorage.removeItem('hasSeenTutorial');
  
  // Create mock tutorial elements
  const tutorial = document.createElement('div');
  tutorial.className = 'tutorial tutorial--hidden';
  tutorial.style.display = 'none';

  const helpButton = document.createElement('button');
  helpButton.className = 'game__button game__button--help';

  const startButton = document.createElement('button');
  startButton.className = 'tutorial__button';

  document.body.appendChild(tutorial);
  document.body.appendChild(helpButton);
  document.body.appendChild(startButton);

  return { tutorial, helpButton, startButton };
}

function cleanupTutorialElements() {
  // Remove all test elements from DOM
  const elements = document.querySelectorAll('.tutorial, .game__button--help, .tutorial__button');
  elements.forEach(element => element.remove());
  
  // Clear localStorage state
  localStorage.removeItem('hasSeenTutorial');
}

function testTutorialInitialState() {
  const elements = setupTutorialElements();
  const onComplete = () => {};
  const tutorial = new TutorialEngine(onComplete);

  const result = assertAllEqual(
    {
      isHidden: elements.tutorial.classList.contains('tutorial--hidden'),
      display: elements.tutorial.style.display,
      hasSeenTutorial: tutorial.hasSeenTutorial
    },
    {
      isHidden: true,
      display: 'none',
      hasSeenTutorial: false
    },
    'Should initialize tutorial in hidden state with correct properties'
  );

  cleanupTutorialElements();
  return result;
}

function testTutorialShow() {
  const elements = setupTutorialElements();
  const tutorial = new TutorialEngine(() => {});

  tutorial.show();

  const result = assertAllEqual(
    {
      isHidden: elements.tutorial.classList.contains('tutorial--hidden'),
      display: elements.tutorial.style.display
    },
    {
      isHidden: false,
      display: 'flex'
    },
    'Should show tutorial with correct display properties'
  );

  cleanupTutorialElements();
  return result;
}

function testTutorialHide() {
  const elements = setupTutorialElements();
  const tutorial = new TutorialEngine(() => {});

  tutorial.show();
  tutorial.hide();

  const result = assertAllEqual(
    {
      isHidden: elements.tutorial.classList.contains('tutorial--hidden'),
      hasClass: elements.tutorial.classList.contains('tutorial--hidden')
    },
    {
      isHidden: true,
      hasClass: true
    },
    'Should hide tutorial and add hidden class'
  );

  cleanupTutorialElements();
  return result;
}

function testTutorialFirstTimeCompletion() {
  const elements = setupTutorialElements();
  let completionCalled = false;
  
  const tutorial = new TutorialEngine(() => {
    completionCalled = true;
  });

  tutorial.hide();

  const result = assertAllEqual(
    {
      completionCalled,
      hasSeenTutorial: localStorage.getItem('hasSeenTutorial'),
      tutorialState: tutorial.hasSeenTutorial
    },
    {
      completionCalled: true,
      hasSeenTutorial: 'true',
      tutorialState: true
    },
    'Should handle first-time tutorial completion correctly'
  );

  cleanupTutorialElements();
  return result;
}

function testTutorialSubsequentHide() {
  const elements = setupTutorialElements();
  let completionCallCount = 0;
  
  localStorage.setItem('hasSeenTutorial', 'true');
  const tutorial = new TutorialEngine(() => {
    completionCallCount++;
  });

  tutorial.show();
  tutorial.hide();

  const result = assertAllEqual(
    {
      completionCallCount,
      hasSeenTutorial: localStorage.getItem('hasSeenTutorial')
    },
    {
      completionCallCount: 0,
      hasSeenTutorial: 'true'
    },
    'Should not trigger completion callback on subsequent tutorial views'
  );

  cleanupTutorialElements();
  return result;
}

function testHelpButtonShowsTutorial() {
  const elements = setupTutorialElements();
  const tutorial = new TutorialEngine(() => {});

  elements.helpButton.click();

  const result = assertAllEqual(
    {
      isHidden: elements.tutorial.classList.contains('tutorial--hidden'),
      display: elements.tutorial.style.display
    },
    {
      isHidden: false,
      display: 'flex'
    },
    'Should show tutorial when help button is clicked'
  );

  cleanupTutorialElements();
  return result;
}

// Add tests to test suite
window.tutorialEngineTests = [
  testTutorialInitialState,
  testTutorialShow,
  testTutorialHide,
  testTutorialFirstTimeCompletion,
  testTutorialSubsequentHide,
  testHelpButtonShowsTutorial
];