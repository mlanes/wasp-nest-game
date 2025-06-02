function load() {
	const loadingScreen = document.querySelector('.loading');
	const gameEngine = new GameEngine(DisplayEngine);

	// Initialize tutorial with callback for first-time completion
	const tutorialEngine = new TutorialEngine(() => {
		gameEngine.init();
	});

	// Fade out loading screen after delay
	setTimeout(() => {
		// Remove loading screen
		loadingScreen.classList.add('loading--fade-out');
		setTimeout(() => loadingScreen.remove(), 500);

		// If user has never seen tutorial, show it
		if (tutorialEngine.shouldShowOnStartup()) {
			tutorialEngine.show();
		} else {
			// User has seen tutorial before, start game directly
			gameEngine.init();
		}
	}, 2500);
}

document.addEventListener('DOMContentLoaded', load);
