import { Application } from 'pixi.js';

import { CONTAINER_ID, GAME_HEIGHT, GAME_WIDTH } from '../common/constants.js';
import { MainGame } from '../game/MainGame.js';
import { initResizeManager, subscribeToResize } from '../utils/resizeManager.js';
import { setAppInstance } from '../utils/utils.js';

export class AppGame {
	constructor() {
		this.app = null;
		this.container = document.getElementById(CONTAINER_ID);
		this.game = new MainGame(this.app);
	}

	async initGame() {
		this.app = new Application();
		await this.app.init({
			width: window.innerWidth,
			height: window.innerWidth / 2,
			backgroundAlpha: 0,
			antialias: true,
			autoDensity: true,
		});

		globalThis.__PIXI_APP__ = this.app;

		this.container.appendChild(this.app.canvas);

		this.game = new MainGame(this.app);
		setAppInstance(this.app);

		await this.game.initializeGameElements();
		
		// Resize window
		function getAdaptiveSize() {
			const ww = window.innerWidth;
			const wh = window.innerHeight;
			let width, height;
			
			if (ww >= wh) {
				width = ww;
				height = width / 2;
			} else {
				height = window.innerHeight;
				width = window.innerWidth;
			}
			return { width, height };
		}
		subscribeToResize(this.app);
		this.app.onResize = () => {
			const { width, height } = getAdaptiveSize();
			this.app.renderer.resize(width, height);
		}
		initResizeManager();
	}
}
