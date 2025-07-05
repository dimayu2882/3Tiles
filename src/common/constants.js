import { allTextureKeys } from './assets.js';

const CONTAINER_ID = 'pixi-container';
const PRELOADER_ID = 'preloader';
const LOADER_FILL = 'loaderFill';
const CELL_SIZE = 100;
const UNITS = [
	{ name: 'unitOne', textureKey: allTextureKeys.unitOne },
	{ name: 'unitTwo', textureKey: allTextureKeys.unitTwo },
	{ name: 'unitThree', textureKey: allTextureKeys.unitThree },
	{ name: 'unitFour', textureKey: allTextureKeys.unitFour },
];

export { CONTAINER_ID, CELL_SIZE, LOADER_FILL, PRELOADER_ID, UNITS };
