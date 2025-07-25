import { allTextureKeys } from '../common/assets.js';
import { PixiElement } from '../utils/PixiElement.js';
import { elementType, labels } from '../common/enums.js';

export default function createCell(app, cellObject, row, col, cellSize, interactive, index) {
	const unit = new PixiElement({
		type: elementType.SPRITE,
		texture: cellObject.textureKey,
		anchor: [0.5],
		width: cellSize,
		height: cellSize
	});
	const elementUnit = unit.getElement();
	
	const unitActive = new PixiElement({
		type: elementType.SPRITE,
		texture: allTextureKeys.borderUnit,
		label: labels.unitBoard,
		anchor: [0.5],
		visible: false
	});
	const elementUnitActive = unitActive.getElement();
	
	const unitContainer = new PixiElement({
		type: elementType.CONTAINER,
		label: cellObject.name,
		interactive: interactive,
		buttonMode: interactive,
		cursor: 'pointer',
		zIndex: index
	}, onResizeHandler, true);
	unitContainer.registerFlag('isActive', false);
	const elementUnitContainer = unitContainer.getElement();
	
	elementUnitContainer.position.set(
		col * (cellSize - cellSize / 4.5) + cellSize / 2,
		row * (cellSize - cellSize / 4.5) + cellSize / 2
	);
	
	unitContainer.addChildren([elementUnit, elementUnitActive]);
	
	elementUnitActive.position.set(elementUnit.x - elementUnit.width / 11, elementUnit.y - elementUnit.width / 11);
	elementUnitActive.width = elementUnit.width * 1.2;
	elementUnitActive.height = elementUnit.height * 1.2;
	
	function onResizeHandler() {
		elementUnitContainer.position.set(
			col * (cellSize - cellSize / 4.5) + cellSize / 2,
			row * (cellSize - cellSize / 4.5) + cellSize / 2
		);
	}
	
	return elementUnitContainer;
}
