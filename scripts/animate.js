// animate.js

export function easeOutQuad(t) {
    return t * (2 - t);
}

export function animate({ from, to, duration = 400, onUpdate, onComplete, easing = easeOutQuad }) {
    const startTime = performance.now();

    function tick(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easing(progress);
        const value = from + (to - from) * eased;

        onUpdate(value);

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            if (onComplete) onComplete();
        }
    }

    requestAnimationFrame(tick);
}
