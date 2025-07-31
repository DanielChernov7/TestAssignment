// Easing function: Ease out using a quadratic curve.
// Starts fast and slows down toward the end.
export function easeOutQuad(t) {
    return t * (2 - t);
}

/**
 * Generic JavaScript animation function (no external libraries).
 *
 * @param {number} from - Starting value.
 * @param {number} to - Ending value.
 * @param {number} duration - Duration in ms (default: 400).
 * @param {function} onUpdate - Callback for each animation frame. Receives current value.
 * @param {function} onComplete - Callback when animation completes.
 * @param {function} easing - Easing function (default: easeOutQuad).
 */
export function animate({
                            from,
                            to,
                            duration = 400,
                            onUpdate,
                            onComplete,
                            easing = easeOutQuad
                        }) {
    const startTime = performance.now(); // Capture the animation start time

    // Frame loop
    function tick(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // Clamp to [0,1]
        const eased = easing(progress); // Apply easing curve
        const value = from + (to - from) * eased; // Calculate current value

        onUpdate(value); // Call update callback with current value

        if (progress < 1) {
            requestAnimationFrame(tick); // Continue animation
        } else {
            if (onComplete) onComplete(); // Finalize
        }
    }

    requestAnimationFrame(tick); // Start animation
}
