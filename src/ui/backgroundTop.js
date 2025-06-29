import { PixiElement } from '../utils/PixiElement.js';
import { allTextureKeys } from '../common/assets.js';
import { elementType, labels } from '../common/enums.js';

export default function createBackgroundTop(app) {
	const backgroundTop = new PixiElement(
		{
			type: elementType.SPRITE,
			texture: allTextureKeys.bgTop,
			position: [0],
			width: app.renderer.width,
		},
		onResizeHandler,
		true
	);
	const elementBackgroundTop = backgroundTop.getElement();
	const aspectRatio = elementBackgroundTop.texture.width / elementBackgroundTop.texture.height;
	elementBackgroundTop.height = elementBackgroundTop.width / aspectRatio;

	function onResizeHandler() {
		elementBackgroundTop.width = app.renderer.width;
		const aspectRatio = elementBackgroundTop.texture.width / elementBackgroundTop.texture.height;
		elementBackgroundTop.height = elementBackgroundTop.width / aspectRatio;
	}

	return elementBackgroundTop;
}
