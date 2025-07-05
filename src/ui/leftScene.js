import { allTextureKeys } from '../common/assets.js';
import { elementType, labels } from '../common/enums.js';
import { PixiElement } from '../utils/PixiElement.js';
import { getAdaptiveSize } from '../utils/utils.js';

export default function createLeftScene(app) {
	const leftScene = new PixiElement(
		{
			type: elementType.CONTAINER,
			label: labels.leftScene
		}, onResizeHandlerLeftScene, true);
	const elementLeftScene = leftScene.getElement();
	
	const textTitle = new PixiElement({
		type: elementType.TEXT,
		text: 'Match 3 \nthe same tiles',
		style: {
			fontFamily: 'Arial',
			fontSize: app.renderer.width / 20,
			fill: '#313131',
			align: 'center'
		},
		anchor: [0.5]
	});
	const elementTextTitle = textTitle.getElement();
	
	const containerUnits = new PixiElement({
		type: elementType.CONTAINER,
		label: labels.containerUnits
	});
	const elementContainerUnits = containerUnits.getElement();
	
	const containerUnitsSprite = new PixiElement({
		type: elementType.SPRITE,
		texture: allTextureKeys.container,
		width: 325
	});
	containerUnitsSprite.addToContainer(elementContainerUnits);
	
	leftScene.addChildren([elementTextTitle, elementContainerUnits]);
	
	function setElementsPosition() {
		const maxWidth = Math.max(elementTextTitle.width, elementContainerUnits.width);
		elementTextTitle.position.set(maxWidth / 2, elementTextTitle.height / 2);
		elementContainerUnits.position.set(
			maxWidth / 2 - elementContainerUnits.width / 2,
			elementTextTitle.height + 20
		);
		
		const totalHeight = elementTextTitle.height + 20 + elementContainerUnits.height;
		elementLeftScene.pivot.set(maxWidth / 2, totalHeight / 2);
		
		const { width, height } = getAdaptiveSize();
		
		if (width > height) {
			elementLeftScene.position.set(width / 4, height / 2);
		} else {
			elementLeftScene.position.set(width / 2, height / 4);
		}
	}
	
	setElementsPosition();
	
	function textChangeAnimation(textObject, newText) {
		const duration = 400;
		const startScale = 0.1;
		const initialAlpha = textObject.alpha;
		const initialScaleX = textObject.scale.x;
		const initialScaleY = textObject.scale.y;
		
		textObject.text = newText;
		textObject.alpha = 0;
		textObject.scale.set(startScale * initialScaleX, startScale * initialScaleY);
		
		let elapsed = 0;
		
		const onTick = () => {
			elapsed += app.ticker.elapsedMS;
			const progress = Math.min(1, elapsed / duration);
			
			textObject.alpha = initialAlpha * progress;
			
			textObject.scale.set(
				initialScaleX * (startScale + (1 - startScale) * progress),
				initialScaleY * (startScale + (1 - startScale) * progress)
			);
			
			if (progress >= 1) {
				textObject.alpha = initialAlpha;
				textObject.scale.set(initialScaleX, initialScaleY);
				app.ticker.remove(onTick);
			}
		};
		
		app.ticker.add(onTick);
	}
	
	setTimeout(() => {
		textChangeAnimation(elementTextTitle, 'Clear \nthe board');
	}, 5000);
	
	function onResizeHandlerLeftScene() {
		onResizeHandlerTextTitle();
		onResizeHandlerContainerUnits();
		setElementsPosition();
	}
	
	function onResizeHandlerTextTitle() {
		elementTextTitle.style.fontSize = app.renderer.width / 20;
		elementTextTitle.position.set(elementTextTitle.width / 2, elementTextTitle.height / 2);
	}
	
	function onResizeHandlerContainerUnits() {
		elementContainerUnits.position.set(
			(elementTextTitle.width - elementContainerUnits.width) / 2,
			elementTextTitle.height + 20
		);
	}
	
	return elementLeftScene;
}
