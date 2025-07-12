import { gsap } from 'gsap';

import { allTextureKeys } from '../common/assets.js';
import { elementType, labels } from '../common/enums.js';
import { PixiElement } from '../utils/PixiElement.js';
import { getAdaptiveSize } from '../utils/utils.js';

export default function createLeftScene() {
	const leftScene = new PixiElement(
		{
			type: elementType.CONTAINER,
			label: labels.leftScene
		}, onResizeHandlerLeftScene, true);
	const elementLeftScene = leftScene.getElement();
	
	const textTitle = new PixiElement({
		type: elementType.SPRITE,
		texture: allTextureKeys.textMatch,
		anchor: [0.5],
		scale: [0.8]
	});
	const elementTextTitle = textTitle.getElement();
	
	const textClear = new PixiElement({
		type: elementType.SPRITE,
		texture: allTextureKeys.textClear,
		anchor: [0.5],
		visible: false,
	});
	const elementTextClear = textClear.getElement();
	
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
	
	leftScene.addChildren([elementTextTitle, elementTextClear, elementContainerUnits]);
	
	const heightText =  elementTextTitle.height;
	
	function setElementsPosition() {
		const maxWidth = Math.max(elementTextTitle.width, elementContainerUnits.width);
		elementTextTitle.position.set(maxWidth / 2, elementTextTitle.height / 2);
		elementTextClear.position.set(maxWidth / 2, elementTextClear.height / 2 - 10);
		elementContainerUnits.position.set(
			maxWidth / 2 - elementContainerUnits.width / 2,
			heightText + 20
		);
		
		const totalHeight = heightText + 20 + elementContainerUnits.height;
		elementLeftScene.pivot.set(maxWidth / 2, totalHeight / 2);
		
		const { width, height } = getAdaptiveSize();
		
		if (width > height) {
			elementLeftScene.position.set(width / 4, height / 2);
		} else {
			elementLeftScene.position.set(width / 2, height / 4);
		}
	}
	
	setElementsPosition();
	
	function switchSpriteAnimation(spriteOut, spriteIn, duration = 0.4) {
		const startScale = 0.1;
		
		spriteIn.visible = true;
		spriteIn.alpha = 0;
		spriteIn.scale.set(startScale);
		
		gsap.to(spriteOut, {
			alpha: 0,
			onComplete: () => {
				spriteOut.visible = false;
				spriteOut.alpha = 1;
				spriteOut.scale.set(1);
			},
			duration,
			ease: 'power2.inOut'
		});
		
		gsap.to(spriteOut.scale, {
			x: startScale,
			y: startScale,
			duration,
			ease: 'power2.inOut'
		});
		
		gsap.to(spriteIn, {
			alpha: 1,
			duration,
			ease: 'power2.inOut'
		});
		
		gsap.to(spriteIn.scale, {
			x: 1,
			y: 1,
			duration,
			ease: 'power2.inOut'
		});
	}
	
	setTimeout(() => {
		switchSpriteAnimation(elementTextTitle, elementTextClear);
	}, 5000);
	
	function onResizeHandlerLeftScene() {
		setElementsPosition();
	}
	
	return elementLeftScene;
}
