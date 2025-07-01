import { PixiElement } from '../utils/PixiElement.js';
import { allTextureKeys } from '../common/assets.js';
import { elementType, labels } from '../common/enums.js';

export default function createErrorBorder(app) {
	const errorBorder = new PixiElement(
		{
			type: elementType.SPRITE,
			texture: allTextureKeys.error,
			label: labels.error,
			width: app.renderer.width,
			height: app.renderer.height,
			visible: false
		},
		onResizeHandler,
		true
	);
	const elementErrorBorder = errorBorder.getElement();
	
	function onResizeHandler() {
		elementErrorBorder.width = app.renderer.width;
	}

	return elementErrorBorder;
}
