import { getUIElement } from '../helpers/index.js';

class GameState {
	constructor() {
		this.gameState = [];
		this.activeCells = [];
		this.clickCount = 0;
		this.isGameOver = false;
		this.isMuted = false;
		
		this.initializeGrid();
	}
	
	initializeGrid = () => {
	};
	
	getClickCount = () => this.clickCount;
	resetClickCount = () => this.clickCount = 0;
	incrementClickCount = () => this.clickCount++;
	
	// getActiveStar = () => this.activeStar;
	
	setActiveCell = (cell) => {
		
		return getUIElement(cell, cell.label);
	};
	
	reset = () => {
		this.isGameOver = false;
		this.gameState.activeCells.forEach(cell => cell.deactivate());
		this.gameState.activeCells = [];
		this.gameState.clickCount = 0;
	};
}

export const gameState = new GameState();
