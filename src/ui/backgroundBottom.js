import { PixiElement } from '../utils/PixiElement.js';
import { allTextureKeys } from '../common/assets.js';
import { elementType, labels } from '../common/enums.js';

export default function createBackgroundBottom(app) {
	const backgroundBottom = new PixiElement(
		{
			type: elementType.SPRITE,
			texture: allTextureKeys.bgBottom,
			width: app.renderer.width,
		},
		onResizeHandler,
		true
	);
	const elementBackgroundBottom = backgroundBottom.getElement();
	
	const aspectRatio = elementBackgroundBottom.texture.width / elementBackgroundBottom.texture.height;
	elementBackgroundBottom.height = elementBackgroundBottom.width / aspectRatio;
	elementBackgroundBottom.position.set(0, app.renderer.height - elementBackgroundBottom.height);

	function onResizeHandler() {
		elementBackgroundBottom.width = app.renderer.width;
		const aspectRatio = elementBackgroundBottom.texture.width / elementBackgroundBottom.texture.height;
		elementBackgroundBottom.height = elementBackgroundBottom.width / aspectRatio;
		elementBackgroundBottom.position.set(0, app.renderer.height - elementBackgroundBottom.height);
	}

	return elementBackgroundBottom;
}
