import { PixiElement } from '../utils/PixiElement.js';
import { elementType } from '../common/enums.js';

export default function createCell(app, cellObject, row, col, cellSize) {
	const unit = new PixiElement({
		type: elementType.SPRITE,
		texture: cellObject.textureKey,
		label: cellObject.name,
		anchor: [0.5],
		width: cellSize,
		height: cellSize,
		interactive: true,
		buttonMode: true,
		cursor: 'pointer',
	}, onResizeHandler, true);
	const elementUnit = unit.getElement();
	
	elementUnit.x = col * (cellSize - cellSize / 4.5) + cellSize / 2;
	elementUnit.y = row * (cellSize - cellSize / 4.5) + cellSize / 2;
	
	function onResizeHandler() {
	}

	return elementUnit;
}
