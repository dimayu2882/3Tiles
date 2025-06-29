import { PixiElement } from '../utils/PixiElement.js';
import { allTextureKeys } from '../common/assets.js';
import { elementType, labels } from '../common/enums.js';

export default function createLeftScene(app) {
	const textTitle = new PixiElement({
		type: elementType.TEXT,
		text: 'Match 3 \nthe same tiles',
		style: {
			fontFamily: 'Arial',
			fontSize: app.renderer.width / 20,
			fill: '#313131',
			align: 'center',
		}
	});
	const elementTextTitle = textTitle.getElement();
	
	const containerUnits = new PixiElement({
		type: elementType.SPRITE,
		texture: allTextureKeys.container,
		label: labels.containerUnits
	});
	const elementContainerUnits = containerUnits.getElement();
	
	const leftScene = new PixiElement({
			type: elementType.CONTAINER,
			label: labels.leftScene,
		}, onResizeHandlerLeftScene, true);
	const elementLeftScene = leftScene.getElement();
	
	leftScene.addChildren([elementTextTitle, elementContainerUnits]);
	
	elementContainerUnits.position.set(
		(elementTextTitle.width - elementContainerUnits.width) / 2,
		elementTextTitle.height + 20
	);
	
	elementLeftScene.pivot.set(elementLeftScene.width / 2, elementLeftScene.height / 2);
	elementLeftScene.position.set(
		app.renderer.width / 4,
		app.renderer.height / 2
	);

	function onResizeHandlerLeftScene() {
		onResizeHandlerTextTitle();
		onResizeHandlerContainerUnits();
		
		elementLeftScene.pivot.set(elementLeftScene.width / 2, elementLeftScene.height / 2);
		elementLeftScene.position.set(
			app.renderer.width / 4,
			app.renderer.height / 2
		);
	}
	
	function onResizeHandlerTextTitle() {
		elementTextTitle.style.fontSize = app.renderer.width / 20;
	}
	
	function onResizeHandlerContainerUnits() {
		elementContainerUnits.position.set(
			(elementTextTitle.width - elementContainerUnits.width) / 2,
			elementTextTitle.height + 20
		);
	}

	return elementLeftScene;
}
