import { Howl, Howler } from 'howler';

class SoundManager {
	constructor() {
		this.sounds = {
			click: new Howl({
				src: ['audio/click.mp3'],
				volume: 0.5,
			}),
			bubble: new Howl({
				src: ['audio/bubble.mp3'],
				volume: 0.7,
			}),
			freeze: new Howl({
				src: ['audio/freeze.mp3'],
				loop: true,
				volume: 0.2,
			}),
			minWin: new Howl({
				src: ['audio/minWin.mp3'],
				loop: true,
				volume: 0.2,
			}),
			music: new Howl({
				src: ['audio/music.mp3'],
				loop: true,
				volume: 0.2,
			}),
			rollBack: new Howl({
				src: ['audio/rollBack.mp3'],
				loop: true,
				volume: 0.2,
			}),
			tap: new Howl({
				src: ['audio/tap.mp3'],
				loop: true,
				volume: 0.2,
			}),
			win: new Howl({
				src: ['audio/win.mp3'],
				loop: true,
				volume: 0.2,
			}),
			womanAha: new Howl({
				src: ['audio/womanAha.mp3'],
				loop: true,
				volume: 0.2,
			}),
			wrong: new Howl({
				src: ['audio/wrong.mp3'],
				loop: true,
				volume: 0.2,
			}),
		};

		this.isMuted = false;
	}

	play(soundName) {
		if (this.sounds[soundName]) {
			this.sounds[soundName].play();
		}
	}

	toggleMute() {
		this.isMuted = !this.isMuted;
		Howler.mute(this.isMuted);
		return this.isMuted;
	}
}

export const soundManager = new SoundManager();
