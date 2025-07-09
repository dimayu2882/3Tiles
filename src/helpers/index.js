export const getUIElement = (container, label) => container.getChildByLabel(label);

export function watchIdleOnCanvas(canvas, timeoutMs, onIdle) {
	let idleTimeout = null;
	let idleInterval = null;
	let isIdle = false;
	
	const clearAllTimers = () => {
		clearTimeout(idleTimeout);
		clearInterval(idleInterval);
		idleTimeout = null;
		idleInterval = null;
	};
	
	const becomeIdle = () => {
		if (isIdle) return;
		
		isIdle = true;
		onIdle();
		
		idleInterval = setInterval(() => {
			onIdle();
		}, timeoutMs);
	};
	
	const onUserActive = () => {
		if (isIdle) {
			isIdle = false;
			clearAllTimers();
		}
		resetIdleTimer();
	};
	
	const resetIdleTimer = () => {
		clearAllTimers();
		
		idleTimeout = setTimeout(() => {
			becomeIdle();
		}, timeoutMs);
	};
	
	const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
	
	activityEvents.forEach(event =>
		canvas.addEventListener(event, onUserActive, {
			passive: event !== 'touchstart'
		})
	);
	
	resetIdleTimer();
	
	return () => {
		clearAllTimers();
		activityEvents.forEach(event =>
			canvas.removeEventListener(event, onUserActive)
		);
	};
}
