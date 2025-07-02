import { gsap } from 'gsap';

import { PixiElement } from '../utils/PixiElement.js';
import { allTextureKeys } from '../common/assets.js';
import { elementType, labels } from '../common/enums.js';

export default function createSceneFinish(app) {
	const sceneFinish = new PixiElement({
		type: elementType.CONTAINER,
		label: labels.sceneFinish,
		visible: false,
	});
	const elementSceneFinish = sceneFinish.getElement();
	
	// Logo left
	const leftSceneFinishLogo = new PixiElement({
		type: elementType.SPRITE,
		texture: allTextureKeys.logo,
		anchor: [0.5]
	});
	const elementSceneFinishLogo = leftSceneFinishLogo.getElement();
	
	// Text
	const leftSceneFinishText = new PixiElement({
		type: elementType.TEXT,
		text: '3 Tiles \nPuzzle\nmatch game',
		style: {
			fontFamily: 'Arial',
			fontSize: app.renderer.width / 25,
			fontWeight: 'bold',
			fill: '#313131',
			align: 'center'
		},
	});
	const elementLeftSceneFinishText = leftSceneFinishText.getElement();
	
	// Left container
	const leftSceneFinish = new PixiElement({
		type: elementType.CONTAINER,
		label: labels.sceneFinishLeft,
	});
	const elementLeftSceneFinish = leftSceneFinish.getElement();
	leftSceneFinish.addChildren([elementSceneFinishLogo, elementLeftSceneFinishText]);
	
	elementSceneFinishLogo.x = elementLeftSceneFinishText.width / 2;
	elementLeftSceneFinishText.position.set(0, elementSceneFinishLogo.height / 2 + 10);
	
	elementLeftSceneFinish.pivot.set(
		elementLeftSceneFinish.width / 2,
		(elementLeftSceneFinish.height - elementSceneFinishLogo.height /2) / 2
	);
	elementLeftSceneFinish.position.set(app.renderer.width / 4, app.renderer.height / 2);
	
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
	});
	const elementRightSceneFinishBtn = rightSceneFinishBtn.getElement();
	gsap.to(elementRightSceneFinishBtn.scale, {
		x: 1.1,
		y: 1.1,
		duration: 0.5,
		yoyo: true,
		repeat: -1,
		ease: 'power1.inOut',
	});
	
	rightSceneFinish.addChildren([elementRightSceneFinishBtn]);
	
	sceneFinish.addChildren([elementLeftSceneFinish, elementRightSceneFinish]);
	
	elementRightSceneFinish.position.set(app.renderer.width * 3 / 4, app.renderer.height / 2);
	
	function onResizeHandler() {
	}

	return elementSceneFinish;
}
