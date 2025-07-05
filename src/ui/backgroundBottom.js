import { allTextureKeys } from '../common/assets.js';
import { elementType } from '../common/enums.js';
import { PixiElement } from '../utils/PixiElement.js';
import { getAdaptiveSize } from '../utils/utils.js';

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

	const aspectRatio =
		elementBackgroundBottom.texture.width /
		elementBackgroundBottom.texture.height;
	elementBackgroundBottom.height = elementBackgroundBottom.width / aspectRatio;
	elementBackgroundBottom.position.set(
		0,
		app.renderer.height - elementBackgroundBottom.height
	);

	function onResizeHandler() {
		const { width } = getAdaptiveSize();
		elementBackgroundBottom.width = width;
		const aspectRatio =
			elementBackgroundBottom.texture.width /
			elementBackgroundBottom.texture.height;
		elementBackgroundBottom.height =
			elementBackgroundBottom.width / aspectRatio;
		elementBackgroundBottom.position.set(
			0,
			app.renderer.height - elementBackgroundBottom.height
		);
	}

	return elementBackgroundBottom;
}
