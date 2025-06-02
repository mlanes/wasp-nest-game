class TutorialEngine {
	constructor(onFirstTimeTutorialComplete) {
		this.tutorialScreen = document.querySelector('.tutorial');
		this.tutorialButton = document.querySelector('.tutorial__button');
		this.helpButton = document.querySelector('.game__button--help');
		this.onFirstTimeTutorialComplete = onFirstTimeTutorialComplete;

		// Initialize tutorial state
		this.hasSeenTutorial = localStorage.getItem('hasSeenTutorial') === 'true';
		this.tutorialScreen.classList.add('tutorial--hidden');

		this.init();
	}

	init() {
		this.helpButton.addEventListener('click', () => this.show());
		this.tutorialButton.addEventListener('click', () => this.hide());
	}

	show() {
		this.tutorialScreen.style.display = 'flex';
		// Force browser reflow
		this.tutorialScreen.offsetHeight;
		this.tutorialScreen.classList.remove('tutorial--hidden');
	}

	hide() {
		this.tutorialScreen.classList.add('tutorial--hidden');

		// First time tutorial completion
		if (!this.hasSeenTutorial) {
			this.hasSeenTutorial = true;
			localStorage.setItem('hasSeenTutorial', 'true');
			this.onFirstTimeTutorialComplete?.();
		}

		setTimeout(() => {
			this.tutorialScreen.style.display = 'none';
		}, 500);
	}

	shouldShowOnStartup() {
		return !this.hasSeenTutorial;
	}
}
