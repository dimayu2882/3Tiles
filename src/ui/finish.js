import { gsap } from 'gsap';

import { PixiElement } from '../utils/PixiElement.js';
import { allTextureKeys } from '../common/assets.js';
import { elementType, labels } from '../common/enums.js';
import { getAdaptiveSize } from '../utils/utils.js';

export default function createSceneFinish(app) {
	const sceneFinish = new PixiElement({
		type: elementType.CONTAINER,
		label: labels.sceneFinish,
		visible: false,
	}, onResizeHandler, true);
	const elementSceneFinish = sceneFinish.getElement();
	
	// Logo left
	const leftSceneFinishLogo = new PixiElement({
		type: elementType.SPRITE,
		texture: allTextureKeys.logo,
		anchor: [0.5],
		width: 150,
		height: 150,
	});
	const elementSceneFinishLogo = leftSceneFinishLogo.getElement();
	
	// Text
	const leftSceneFinishText = new PixiElement({
		type: elementType.SPRITE,
		texture: allTextureKeys.textMatch,
		anchor: [0.5],
		scale: [0.8]
	});
	const elementLeftSceneFinishText = leftSceneFinishText.getElement();
	
	// Left container
	const leftSceneFinish = new PixiElement({
		type: elementType.CONTAINER,
		label: labels.sceneFinishLeft,
	});
	const elementLeftSceneFinish = leftSceneFinish.getElement();
	
	// Right container
	const rightSceneFinish = new PixiElement({
		type: elementType.CONTAINER,
		interactive: true,
		buttonMode: true,
		cursor: 'pointer',
		label: labels.sceneFinishRight,
	});
	const elementRightSceneFinish = rightSceneFinish.getElement();
	
	// Button
	const rightSceneFinishBtn = new PixiElement({
		type: elementType.SPRITE,
		texture: allTextureKeys.button,
		label: labels.button,
		anchor: [0.5],
		width: 250,
	});
	const elementRightSceneFinishBtn = rightSceneFinishBtn.getElement();
	elementRightSceneFinishBtn.height =
		elementRightSceneFinishBtn.width / (elementRightSceneFinishBtn.texture.width / elementRightSceneFinishBtn.texture.height);
	gsap.to(elementRightSceneFinishBtn.scale, {
		x: 0.55,
		y: 0.55,
		duration: 0.5,
		yoyo: true,
		repeat: -1,
		ease: 'power1.inOut',
	});
	
	leftSceneFinish.addChildren([elementSceneFinishLogo, elementLeftSceneFinishText]);
	rightSceneFinish.addChildren([elementRightSceneFinishBtn]);
	sceneFinish.addChildren([elementLeftSceneFinish, elementRightSceneFinish]);
	
	function setElementsPosition() {
		const { width, height } = getAdaptiveSize();
		elementSceneFinishLogo.x = elementSceneFinishLogo.width / 2;
		elementLeftSceneFinishText.position.set(elementSceneFinishLogo.width / 2, elementSceneFinishLogo.height);
		
		const bounds = elementLeftSceneFinish.getLocalBounds();
		
		if (width > height) {
			elementLeftSceneFinish.position.set(app.renderer.width / 4, app.renderer.height / 2);
			elementLeftSceneFinish.pivot.set(bounds.minX + bounds.width / 2, bounds.minY + bounds.height / 2);
			
			elementRightSceneFinish.position.set(app.renderer.width * 3 / 4, app.renderer.height / 2);
		} else {
			elementLeftSceneFinish.position.set(app.renderer.width / 2, app.renderer.height / 3);
			elementLeftSceneFinish.pivot.set(bounds.minX + bounds.width / 2, bounds.minY + bounds.height / 2);
			
			elementRightSceneFinish.position.set(app.renderer.width / 2, app.renderer.height * 3 / 4);
		}
	}
	
	setElementsPosition();
	
	function onResizeHandler() {
		setElementsPosition();
	}

	return elementSceneFinish;
}
