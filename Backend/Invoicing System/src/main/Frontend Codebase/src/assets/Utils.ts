import { useEffect, useRef } from "react";

export const useBackButton = (callback: () => void) => {
    const navigationMethodRef = useRef<'back' | 'navigate' | null>(null);
    const lastPathRef = useRef(window.location.pathname);

    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            // Check if this is a genuine back/forward navigation
            const currentPath = window.location.pathname;
            const isDifferentPath = currentPath !== lastPathRef.current;

            if (isDifferentPath && navigationMethodRef.current !== 'navigate') {
                callback();
            }

            // Update the last path
            lastPathRef.current = currentPath;
            navigationMethodRef.current = null;
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [callback]);

    // Function to call before programmatic navigation
    const beforeNavigate = () => {
        navigationMethodRef.current = 'navigate';
    };

    return { beforeNavigate };
};