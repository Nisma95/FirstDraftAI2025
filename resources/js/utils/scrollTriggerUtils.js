// resources/js/utils/scrollTriggerUtils.js
export const cleanupScrollTrigger = () => {
    if (typeof window !== "undefined") {
        try {
            // Get all ScrollTrigger instances and kill them safely
            const triggers = window.ScrollTrigger?.getAll() || [];
            triggers.forEach((trigger) => {
                if (trigger && typeof trigger.kill === "function") {
                    trigger.kill();
                }
            });

            // Force refresh ScrollTrigger
            if (window.ScrollTrigger) {
                window.ScrollTrigger.refresh();
            }
        } catch (error) {
            console.warn("ScrollTrigger cleanup error:", error);
        }
    }
};

export const safeScrollTriggerCreate = (config) => {
    if (typeof window !== "undefined" && window.ScrollTrigger) {
        return window.ScrollTrigger.create(config);
    }
    return null;
};
