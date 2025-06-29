import { PixiElement } from '../utils/PixiElement.js';
import { allTextureKeys } from '../common/assets.js';
import { elementType, labels } from '../common/enums.js';

export default function createRightScene(app) {
	const board = new PixiElement({
		type: elementType.CONTAINER,
	});
	const elementBoard = board.getElement();

	function onResizeHandler() {
	
	}

	return elementBoard;
}
