const GAME_CONFIG = Object.freeze({
	ZAP_DAMAGE: 11,
	KNOCKOUT_RECOVERY_TIME: 40000, // Time in milliseconds
	WASPS_COUNT: {
		QUEEN: 1,
		DRONES: 5,
		WORKERS: 7
	}
});

class GameEngine {
	gameOver = false;
	gameStarted = false;
	waspElements = new Map();
	waspMoveTimers = new Map();
	updateInterval = null;

	constructor(display) {
		this.display = display;
		this.wasps = {
			queen: new Queen(),
			drones: Array(GAME_CONFIG.WASPS_COUNT.DRONES).fill().map(() => new Drone()),
			workers: Array(GAME_CONFIG.WASPS_COUNT.WORKERS).fill().map(() => new Worker())
		};
	}

	isGameStarted() {
		return this.gameStarted;
	}

	isGameOver() {
		return this.gameOver;
	}

	init() {
		this.display.initialize();
		this.display.setUpControls(
			() => this.handleZap(),
			() => this.handleReset()
		);
		this.startGame();
	}

	handleZap() {
		const zappedWasp = this.zapWasp();
		if (zappedWasp) {
			const element = this.waspElements.get(zappedWasp);
			if (element) {
				this.display.zapEffect(element);
			}
		}
		this.refreshGameState();
	}

	handleReset() {
		// Clear current game state
		this.clearGameLoop();
		this.getAllWasps().forEach(wasp => {
			this.clearWaspAnimation(wasp);
			wasp.energy = wasp.maxEnergy;
			wasp.isKnockedOut = false;
			wasp.knockoutTime = null;
		});

		// Reset game flags
		this.gameOver = false;
		this.gameStarted = false;

		// Clear display
		this.display.clearGameContainer();
		this.display.clearMessage();

		// Enable zap button
		this.display.toggleZapButton(false);

		// Start fresh game
		this.startGame();
	}

	startGame() {
		if (this.gameOver) {
			return;
		}

		this.gameStarted = true;

		const wasps = this.getAllWasps();
		this.display.updateWasps(wasps);

		// Setup wasp elements and animations after render
		const waspElements = this.display.getAllWaspElements();
		wasps.forEach((wasp, index) => {
			const element = waspElements[index];
			this.waspElements.set(wasp, element);
			this.startWaspAnimation(wasp);
		});

		this.startGameLoop();
	}

	/* Start periodic game state updates to handle wasp recovery timers and game over conditions **/
	startGameLoop() {
		this.updateInterval = setInterval(() => this.refreshGameState(), 1000);
	}

	clearGameLoop() {
		if (this.updateInterval) {
			clearInterval(this.updateInterval);
			this.updateInterval = null;
		}
	}

	refreshGameState() {
		// Update display state for all wasps
		this.getAllWasps().forEach(wasp => {
			const element = this.waspElements.get(wasp);
			if (element) {
				const remaining = this.getWaspRecoveryTime(wasp);
				this.display.updateWaspDisplay(wasp, element, remaining);
			}
		});

		// Check game state
		const gameStatus = this.checkGameOver();
		// Handle game over state after display updates
		if (gameStatus && this.isGameOver()) {
			// Ensure wasps are knocked out without triggering more game over checks
			this.knockoutAllWasps();
			this.clearGameLoop();

			// Update game display
			this.display.showMessage(gameStatus);
			this.display.toggleZapButton(true);
		}
	}

	startWaspAnimation(wasp) {
		if (wasp.isKnockedOut || this.isGameOver()) {
			return;
		}

		const element = this.waspElements.get(wasp);
		if (!element) {
			return;
		}

		const spacingPixels = 48;

		this.display.animateWasp(
			element,
			this.display.container.offsetWidth,
			this.display.container.offsetHeight - spacingPixels
		);

		const moveTimer = setTimeout(
			() => this.startWaspAnimation(wasp),
			Math.random() * 3000 + 2000
		);
		this.setWaspMoveTimer(wasp, moveTimer);
	}

	zapWasp() {
		if (this.isGameOver() || !this.isGameStarted()) {
			return null;
		}

		const activeWasps = this.getAllWasps().filter(wasp => !wasp.isKnockedOut);
		if (activeWasps.length === 0) {
			return null;
		}

		const targetWasp = activeWasps[Math.floor(Math.random() * activeWasps.length)];
		const newEnergy = Math.max(0, targetWasp.energy - GAME_CONFIG.ZAP_DAMAGE);
		targetWasp.energy = newEnergy;

		if (targetWasp.energy <= 0) {
			this.knockoutWasp(targetWasp);
		}

		return targetWasp;
	}

	knockoutWasp(wasp) {
		// Set wasp state
		wasp.isKnockedOut = true;
		wasp.energy = 0;
		wasp.knockoutTime = Date.now();
		this.clearWaspAnimation(wasp);

		// Update display
		const element = this.waspElements.get(wasp);
		if (element) {
			this.display.updateWaspDisplay(
				wasp,
				element,
				GAME_CONFIG.KNOCKOUT_RECOVERY_TIME
			);
		}
	}

	knockoutAllWasps() {
		this.getAllWasps().forEach(wasp => {
			if (!wasp.isKnockedOut) {
				this.knockoutWasp(wasp);
			}
		});
	}

	reviveWasp(wasp) {
		wasp.isKnockedOut = false;
		wasp.energy = wasp.maxEnergy;
		wasp.knockoutTime = null;
		this.startWaspAnimation(wasp);
	}

	clearWaspAnimation(wasp) {
		const timer = this.waspMoveTimers.get(wasp);
		if (timer) {
			clearTimeout(timer);
			this.waspMoveTimers.delete(wasp);
		}
	}

	setWaspMoveTimer(wasp, timer) {
		this.clearWaspAnimation(wasp);
		this.waspMoveTimers.set(wasp, timer);
	}

	getAllWasps() {
		return [this.wasps.queen, ...this.wasps.drones, ...this.wasps.workers];
	}

	getWaspRecoveryTime(wasp) {
		if (!wasp.isKnockedOut) return 0;

		const elapsed = Date.now() - wasp.knockoutTime;
		const remaining = Math.max(0, GAME_CONFIG.KNOCKOUT_RECOVERY_TIME - elapsed);

		if (remaining <= 0) {
			this.reviveWasp(wasp);
		}

		return remaining;
	}

	checkGameOver() {
		const allKnockedOut = this.getAllWasps().every(wasp => wasp.isKnockedOut);

		if (allKnockedOut) {
			this.gameOver = true;
			this.gameStarted = false;
			return 'All wasps knocked out!';
		}

		if (this.wasps.queen.isKnockedOut) {
			this.gameOver = true;
			this.gameStarted = false;
			return 'Queen knocked out!';
		}

		return null;
	}
}
