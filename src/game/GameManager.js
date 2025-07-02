import { gsap } from 'gsap';
import { BlurFilter, ColorMatrixFilter } from 'pixi.js';
import { allTextureKeys } from '../common/assets.js';

import { elementType, labels } from '../common/enums.js';
import { getUIElement } from '../helpers/index.js';
import { eventBus } from '../utils/EventBus.js';
import { PixiElement } from '../utils/PixiElement.js';
import { soundManager } from '../utils/SoundManager.js';
import { gameState } from './GameState.js';

export class GameManager {
	constructor(app) {
		this.app = app;
		
		// Инициализация UI элементов
		this.gameContainer = getUIElement(this.app.stage, labels.game);
		this.soundButton = getUIElement(this.gameContainer, labels.sound);
		this.error = getUIElement(this.gameContainer, labels.error);
		this.board = getUIElement(this.gameContainer, labels.board);
		this.boardFront = getUIElement(this.board, labels.boardFront);
		this.boardBack = getUIElement(this.board, labels.boardBack);
		this.leftScene = getUIElement(this.gameContainer, labels.leftScene);
		this.containerCells = getUIElement(this.leftScene, labels.containerUnits);
		this.slash = getUIElement(this.soundButton, labels.muteSlash);
		this.finishScene = getUIElement(this.gameContainer, labels.sceneFinish);
		this.finishSceneLeft = getUIElement(this.finishScene, labels.sceneFinishLeft);
		this.finishSceneRight = getUIElement(this.finishScene, labels.sceneFinishRight);
		
		// Инициализация фильтров
		this.grayscaleFilter = new ColorMatrixFilter();
		this.grayscaleFilter.grayscale(1, true);
		
		this.colorAdjustFilter = new ColorMatrixFilter();
		this.colorAdjustFilter.brightness(0.3, true);
		this.colorAdjustFilter.contrast(0.7, true);
		
		// Установка начального состояния интерактивности
		this.setBoardBackActive(true);
		
		// Подписка на события EventBus
		eventBus.on('onGridClick', this.onGridClick);
		eventBus.on('toggleSound', this.toggleSound);
		
		// Добавление обработчиков
		this.soundButton.on('pointerdown', () => eventBus.emit('toggleSound'));
		
		this.board.interactive = true;
		this.board.buttonMode = true;
		this.board.on('pointerdown', this.handleBoardClick);
	}
	
	handleBoardClick = (event) => {
		const clickedElement = event.target;
		
		let activeGameLayer = null;
		if (this.boardFront.interactive) {
			activeGameLayer = this.boardFront;
		} else if (this.boardBack.interactive) {
			activeGameLayer = this.boardBack;
		}
		
		if (!activeGameLayer) return;
		
		const isClickOnCell = activeGameLayer.children.includes(clickedElement);
		
		if (clickedElement === activeGameLayer || !isClickOnCell) return;
		
		eventBus.emit('onGridClick', event);
	};
	
	onGridClick = (event) => {
		if (gameState.getClickCount() >= 3) return;
		
		const clickedCell = event.target;
		
		if (!clickedCell.flags.isActive) {
			gameState.setActiveCell(clickedCell);
			gameState.incrementClickCount();
			this.setActiveCell(clickedCell);
		}
		
		this.checkAndShowError(gameState.activeCells);
		
		if (!clickedCell) return;
		
		if (gameState.getClickCount() === 3 && this.isMatchTree(gameState.activeCells)) {
			this.addToResultContainer(clickedCell.label);
			
			this.removeMatchedCells(gameState.activeCells, () => {
				gameState.activeCells = [];
				gameState.resetClickCount();
				
				this.boardFront.children.length === 0
					? this.setBoardBackActive(false)
					: this.setBoardBackActive(true);
				this.checkGameOver();
			});
		}
	};
	
	isMatchTree = (activeCells) => activeCells.length === 3 && activeCells.every(el => el.label === activeCells[0].label);
	
	removeMatchedCells = (cells, onAllAnimationsComplete) => {
		if (cells.length === 0) {
			onAllAnimationsComplete?.();
			return;
		}
		
		let completedAnimationsCount = 0;
		const totalAnimations = cells.length;
		
		for (const cell of cells) {
			if (!cell || cell.destroyed) {
				completedAnimationsCount++;
				if (completedAnimationsCount === totalAnimations) onAllAnimationsComplete?.();
				continue;
			}
			
			const blur = new BlurFilter();
			cell.filters = [blur];
			
			const tl = gsap.timeline({
				onComplete: () => {
					if (cell && cell.destroy && !cell.destroyed) cell.destroy({ children: true });
					
					completedAnimationsCount++;
					
					if (completedAnimationsCount === totalAnimations) onAllAnimationsComplete?.();
				}
			});
			
			tl.to(cell.scale, { x: 1.5, y: 1.5, duration: 0.2, ease: 'back.out(2)' }, 0);
			tl.to(cell, {
				rotation: (Math.random() - 0.5) * 1.5,
				x: cell.x + (Math.random() - 0.5) * 30,
				y: cell.y + (Math.random() - 0.5) * 30,
				duration: 0.25,
				ease: 'sine.out'
			}, 0);
			tl.to(cell, { alpha: 0, duration: 0.3, ease: 'power1.out' }, 0.15);
			tl.to(blur, { strength: 8, duration: 0.3, ease: 'power1.out' }, 0.15);
		}
	};
	
	setBoardBackActive = (isActive) => {
		isActive
			? this.boardBack.filters = [this.grayscaleFilter, this.colorAdjustFilter]
			: this.boardBack.filters = null;
		
		this.boardFront.interactive = isActive;
		this.boardFront.buttonMode = isActive;
		this.boardFront.children.forEach(child => {
			child.interactive = isActive;
			child.buttonMode = isActive;
		});
		
		this.boardBack.interactive = !isActive;
		this.boardBack.buttonMode = !isActive;
		this.boardBack.children.forEach(child => {
			child.interactive = !isActive;
			child.buttonMode = !isActive;
		});
	};
	
	setActiveCell = (cell) => {
		const borderCell = getUIElement(cell, labels.unitBoard);
		borderCell.visible = true;
		cell.zIndex = cell.zIndex + 10;
		cell.flags.isActive = true;
		
		gsap.to(cell.scale, {
			duration: 1,
			x: 1.01,
			y: 1.01,
			ease: 'back.out(1.7)'
		});
	};
	
	checkAndShowError = (activeCells) => {
		if (!activeCells.every(el => el.label === activeCells[0].label)) {
			this.error.visible = true;
			this.error.alpha = 0;
			
			gsap.to(this.error, {
				alpha: 1,
				duration: 0.3,
				ease: 'power1.out',
				onComplete: () => this.error.visible = false,
			});
			
			activeCells.slice(0, -1).map((cell) => {
				const borderCell = getUIElement(cell, labels.unitBoard);
				borderCell.visible = false;
				
				cell.flags.isActive = false;
				gsap.to(cell.scale, {
					duration: 1,
					x: 1,
					y: 1,
					ease: 'back.out(1.7)'
				});
				cell.zIndex = cell.zIndex - 10;
			});
			
			activeCells.splice(0, activeCells.length - 1);
			gameState.clickCount = 1;
		}
	}
	
	addToResultContainer = (label) => {
		const spacing = 20;
		const cellSize = this.containerCells.height;
		const index = this.containerCells.children.length;
		
		const positionX = index === 0
			? cellSize / 4
			: cellSize / 2 + (index - 1) * (cellSize - spacing);
		const unit = new PixiElement({
			type: elementType.SPRITE,
			texture: allTextureKeys[label],
			anchor: [0.5],
			width: cellSize,
			height: cellSize,
			scale: [0],
			position: [positionX, cellSize / 2],
		});
		const elementUnit = unit.getElement();
		this.containerCells.addChild(elementUnit);
		
		gsap.to(elementUnit.scale, {
			duration: 1,
			x: 0.45,
			y: 0.45,
			ease: 'back.out(1.7)'
		});
	}
	
	checkGameOver = () => {
		console.log(this.boardFront.children.length, this.boardBack.children.length);
		if (!this.boardFront.children.length && !this.boardBack.children.length) {
			gameState.isGameOver = true;
			this.changeSceneFinished();
		}
	}
	
	changeSceneFinished = () => {
		this.finishScene.visible = true;
		this.finishSceneLeft.scale.set(0);
		this.finishSceneRight.scale.set(0);
		
		const tl = gsap.timeline();
		
		tl.to(this.leftScene.scale, {
			duration: 1,
			x: 0,
			y: 0,
			ease: 'power2.out',
		});
		
		tl.to(this.finishSceneLeft.scale, {
			duration: 1,
			x: 1,
			y: 1,
			ease: 'back.out(1.7)',
		});
		
		tl.to(this.finishSceneRight.scale, {
			duration: 1,
			x: 1,
			y: 1,
			ease: 'back.out(1.7)',
		});
	}
	
	toggleSound = () => {
		const isMuted = soundManager.toggleMute();
		
		gsap.to(this.slash, {
			visible: isMuted,
			duration: 0.25,
			ease: 'power2.out'
		});
	};
}
