import { Howl, Howler } from 'howler';

class SoundManager {
	constructor() {
		this.sounds = {
			tap: new Howl({
				src: ['audio/tap.mp3'],
				volume: 0.2,
			}),
			win: new Howl({
				src: ['audio/win.mp3'],
				volume: 0.2,
			}),
			wrong: new Howl({
				src: ['audio/wrong.mp3'],
				volume: 0.2,
			}),
			bg: new Howl({
				src: ['audio/bg.mp3'],
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
