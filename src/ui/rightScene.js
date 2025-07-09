import { gsap } from 'gsap';

import { CELL_SIZE, UNITS } from '../common/constants.js';
import { elementType, labels } from '../common/enums.js';
import { watchIdleOnCanvas } from '../helpers/index.js';
import { PixiElement } from '../utils/PixiElement.js';
import { getAdaptiveSize } from '../utils/utils.js';
import createCell from './cell.js';
import { createFinger } from './index.js';

export default function createRightScene(app) {
	const board = new PixiElement({
		type: elementType.CONTAINER,
		label: labels.board,
		interactive: true
	}, onResizeHandler, true);
	const elementBoard = board.getElement();
	
	const boardBack = new PixiElement({
		type: elementType.CONTAINER,
		label: labels.boardBack,
		interactive: false
	});
	const elementBoardBack = boardBack.getElement();
	
	const boardFront = new PixiElement({
		type: elementType.CONTAINER,
		label: labels.boardFront,
		interactive: true
	});
	const elementBoardFront = boardFront.getElement();
	
	const arrayUnitsBoardBack = UNITS.flatMap(item => [item, item, item])
		.sort(() => Math.random() - 0.5)
		.map((cellObject, index) => {
			const col = index % 3;
			const row = Math.floor(index / 3);
			
			return createCell(
				app,
				cellObject,
				row,
				col,
				CELL_SIZE,
				false,
				index
			);
		});
	
	const arrayUnitsBoardFront = UNITS.slice(0, 2)
		.flatMap(item => [item, item, item])
		.sort(() => Math.random() - 0.5)
		.map((cellObject, index) => {
			const col = index % 2;
			const row = Math.floor(index / 2);
			
			return createCell(
				app,
				cellObject,
				row,
				col,
				CELL_SIZE,
				true,
				index
			);
		});
	
	const finger = createFinger();
	finger.zIndex = 99;
	
	boardBack.addChildren([...arrayUnitsBoardBack]);
	boardFront.addChildren([...arrayUnitsBoardFront]);
	
	board.addChildren([elementBoardBack, elementBoardFront, finger]);
	elementBoard.sortableChildren = true;
	
	function setElementsPosition() {
		const { width, height } = getAdaptiveSize();
		
		const boardBounds = elementBoard.getLocalBounds();
		const frontBounds = elementBoardFront.getLocalBounds();
		
		elementBoard.pivot.set(boardBounds.width / 2, boardBounds.height / 2);
		
		elementBoardBack.pivot.set(elementBoardBack.width / 2, elementBoardBack.height / 2);
		elementBoardBack.position.set(boardBounds.width / 2, boardBounds.height / 2);
		
		elementBoardFront.pivot.set(frontBounds.width / 2, frontBounds.height / 2);
		elementBoardFront.position.set(boardBounds.width / 2, boardBounds.height / 2);
		
		if (width > height) {
			elementBoard.position.set((app.renderer.width * 3) / 4, app.renderer.height / 2);
			
		} else {
			elementBoard.position.set(app.renderer.width / 2, (app.renderer.height * 2) / 3);
		}
	}
	
	setElementsPosition();
	
	function onResizeHandler() {
		setElementsPosition();
	}
	
	function getMatchedGroup() {
		if (elementBoardFront.children.length) {
			const label = elementBoardFront.children[0].label;
			return elementBoardFront.children.filter(cell => cell.label === label);
		}
		
		if (elementBoardBack.children.length && !elementBoardFront.children.length) {
			const label = elementBoardBack.children[0].label;
			return elementBoardBack.children.filter(cell => cell.label === label);
		}
	}
	
	watchIdleOnCanvas(app.canvas, 5000, () => {
		animateCursorSequence();
	});
	
	function scaleFinger() {
		return gsap.to(finger.scale, {
			x: 0.6,
			y: 0.6,
			duration: 0.3,
			yoyo: true,
			repeat: 1,
			ease: 'power1.inOut'
		}).then();
	}
	
	let isAnimating = false;
	
	function animateCursorSequence(onComplete) {
		if (isAnimating) return;
		
		const matchedGroup = getMatchedGroup();
		if (!matchedGroup || !matchedGroup.length) return;
		
		isAnimating = true;
		finger.visible = true;
		finger.position.set(0, 0);
		
		const tl = gsap.timeline({
			onComplete: () => {
				finger.visible = false;
				isAnimating = false;
				onComplete?.();
			}
		});
		
		matchedGroup.forEach(cell => {
			tl.to(finger.position, {
				x: cell.position.x + finger.width / 4,
				y: cell.position.y + finger.height / 2,
				duration: 1.5,
				ease: 'power2.inOut'
			});
			tl.add(() => scaleFinger());
		});
	}
	
	return elementBoard;
}
