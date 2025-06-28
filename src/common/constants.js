import { allTextureKeys } from './assets.js';

const CONTAINER_ID = 'pixi-container';
const PRELOADER_ID = 'preloader';
const LOADER_FILL = 'loaderFill';
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 640;
const UNITS = [
	{ name: 'unitOne', textureKey: allTextureKeys.unitOne },
	{ name: 'unitTwo', textureKey: allTextureKeys.unitTwo },
	{ name: 'unitThree', textureKey: allTextureKeys.unitThree },
	{ name: 'unitFour', textureKey: allTextureKeys.unitFour },
];

export { CONTAINER_ID, GAME_HEIGHT, GAME_WIDTH, LOADER_FILL, PRELOADER_ID, UNITS };
