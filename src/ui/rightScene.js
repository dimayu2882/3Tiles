import { UNITS } from '../common/constants.js';
import { PixiElement } from '../utils/PixiElement.js';
import { allTextureKeys } from '../common/assets.js';
import { elementType, labels } from '../common/enums.js';
import createCell from './cell.js';

export default function createRightScene(app) {
	const board = new PixiElement({
		type: elementType.CONTAINER,
		label: labels.board,
	}, onResizeHandler, true);
	const elementBoard = board.getElement();
	
	const boardBack = new PixiElement({
		type: elementType.CONTAINER,
		label: labels.boardBack,
	});
	const elementBoardBack = boardBack.getElement();
	
	const boardFront = new PixiElement({
		type: elementType.CONTAINER,
		label: labels.boardBack,
	});
	const elementBoardFront = boardFront.getElement();
	
	const arrayUnitsBoardBack = UNITS
		.flatMap((item) => [item, item, item])
		.sort(() => Math.random() - 0.5)
		.map((cellObject, index) => {
			const col = index % 3;
			const row = Math.floor(index / 3);
			
			return createCell(app, cellObject, row, col, app.renderer.width / 12);
		});
	
	const arrayUnitsBoardFront = UNITS
		.slice(0, 2)
		.flatMap((item) => [item, item, item])
		.sort(() => Math.random() - 0.5)
		.map((cellObject, index) => {
			const col = index % 2;
			const row = Math.floor(index / 2);
			
			return createCell(app, cellObject, row, col, app.renderer.width / 13);
		});
	
	boardBack.addChildren([...arrayUnitsBoardBack]);
	boardFront.addChildren([...arrayUnitsBoardFront]);
	
	board.addChildren([elementBoardBack, elementBoardFront]);
	elementBoard.pivot.set(elementBoard.width / 2, elementBoard.height / 2);
	elementBoard.position.set(
		app.renderer.width * 3 / 4,
		app.renderer.height / 2
	);
	
	elementBoardBack.pivot.set(elementBoard.width / 2, elementBoard.height / 2);
	elementBoardBack.position.set(elementBoard.width / 2, elementBoard.height / 2);
	elementBoardFront.pivot.set(elementBoard.width / 2, elementBoard.height / 2);
	elementBoardFront.position.set(elementBoard.width / 2, elementBoard.height / 2);

	function onResizeHandler() {
		elementBoard.pivot.set(elementBoard.width / 2, elementBoard.height / 2);
		elementBoard.position.set(
			app.renderer.width * 3 / 4,
			app.renderer.height / 2
		);
	}

	return elementBoard;
}
