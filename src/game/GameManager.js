import { gsap } from 'gsap';

import { labels } from '../common/enums.js';
import { getUIElement } from '../helpers/index.js';
import { eventBus } from '../utils/EventBus.js';
import { soundManager } from '../utils/SoundManager.js';
import { gameState } from './GameState.js';

export class GameManager {
	constructor(app) {
		this.app = app;
		
		this.gameContainer = getUIElement(this.app.stage, labels.game);
		const soundButton = getUIElement(this.gameContainer, labels.sound);
		
		this.soundButton = soundButton;
		this.slash = getUIElement(soundButton, labels.muteSlash);
		
		// Подписываемся на события
		eventBus.on('toggleSound', this.toggleSound);
		
		// Добавляем обработчики
		this.soundButton.on('pointerdown', () => eventBus.emit('toggleSound'));
	}
	
	restartGame = () => {
		gameState.reset();
	};
	
	onGridClick = (event) => {
		if (gameState.getClickCount() >= 3) return;
		
		const clickedCell = event.target;
		const clickedStar = gameState.setActiveCell(clickedCell);
		
		gameState.incrementClickCount();
		
		if (gameState.getClickCount() === 3
			&& this.isMatchTree(gameState.activeCells)
			&& gameState.getActiveStar().name === clickedCell.label) {
			const cloneClickedStar = this.cloneCell(clickedStar);
			
			clickedCell.addChild(cloneClickedStar);
			this.moveToTarget(
				cloneClickedStar,
				() => this.activeStar.getGlobalPosition(),
				() => {
					this.removeMatchedCells(gameState.activeCells);
				});
		}
	};
	
	isMatchTree = (activeCells) => activeCells.length === 3 && activeCells.every(el => el.label === activeCells[0].label);
	
	moveToTarget = (element, getTargetPosition, onComplete) => {
		const ticker = Ticker.shared;
		let t = 0;
		const duration = 60;
		
		const startPos = { x: element.x, y: element.y };
		
		const animate = () => {
			if (!element.parent) {
				ticker.remove(animate);
				return;
			}
			
			const globalTarget = getTargetPosition?.();
			if (!globalTarget) {
				ticker.remove(animate);
				return;
			}
			
			const targetPosition = element.parent.toLocal(globalTarget);
			
			if (t >= duration) {
				element.position.set(targetPosition.x, targetPosition.y);
				ticker.remove(animate);
				onComplete?.();
				gsap.to(element, {
					rotation: Math.PI * 2, alpha: 0, duration: 0.5, ease: 'power1.out',
					onComplete: () => {
						element.destroy();
						onComplete?.();
					}
				});
				return;
			}
			
			const progress = t / duration;
			const eased = 0.5 - 0.5 * Math.cos(Math.PI * progress);
			const arcY = Math.sin(Math.PI * progress) * 80;
			
			element.x = startPos.x + (targetPosition.x - startPos.x) * eased;
			element.y = startPos.y + (targetPosition.y - startPos.y) * eased - arcY;
			
			t++;
		};
		
		ticker.add(animate);
	};
	
	cloneCell = (originalSprite) => {
		const texture = originalSprite.texture;
		const clone = new originalSprite.constructor(texture);
		
		clone.x = originalSprite.x;
		clone.y = originalSprite.y;
		clone.scale.set(originalSprite.scale.x, originalSprite.scale.y);
		clone.anchor?.set?.(0.5);
		
		return clone;
	};
	
	removeMatchedCells = (cells) => {
		for (const cell of cells) {
			if (!cell || cell.destroyed) continue;
			
			// фильтр размытия
			const blur = new BlurFilter();
			cell.filters = [blur];
			
			// анимация взрыва
			const tl = gsap.timeline({
				onComplete: () => {
					if (cell && cell.destroy && !cell.destroyed) {
						cell.destroy({ children: true });
						
						// if (cells.every(c => !c || c.destroyed)) this.handleGridCollapse();
					}
				}
			});
			
			tl.to(cell.scale, {
				x: 1.5,
				y: 1.5,
				duration: 0.2,
				ease: 'back.out(2)'
			}, 0);
			
			tl.to(cell, {
				rotation: (Math.random() - 0.5) * 1.5,
				x: cell.x + (Math.random() - 0.5) * 30,
				y: cell.y + (Math.random() - 0.5) * 30,
				duration: 0.25,
				ease: 'sine.out'
			}, 0);
			
			tl.to(cell, {
				alpha: 0,
				duration: 0.3,
				ease: 'power1.out'
			}, 0.15);
			
			tl.to(blur, {
				strength: 8,
				duration: 0.3,
				ease: 'power1.out'
			}, 0.15);
		}
	};
	
	toggleSound = () => {
		const isMuted = soundManager.toggleMute();
		
		gsap.to(this.slash, {
			visible: isMuted,
			duration: 0.25,
			ease: 'power2.out'
		});
	};
}
