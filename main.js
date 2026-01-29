document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === "undefined") {
        console.error("GSAP not found. Ensure gsap is included before main.js");
        return;
    }

    // Register ScrollTrigger if present (used for hero timeline)
    const hasScrollTrigger = typeof ScrollTrigger !== "undefined";
    if (hasScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // Page load animations
    gsap.from('header .logo', { scale: 0, duration: 0.6, ease: "back.out(1.4)" });
    gsap.from(".h1-hero-section h1", { y: 40, opacity: 0, duration: 0.8, ease: "power2.out" });
    gsap.from('.divider', { width: 0, duration: 0.9, ease: "power2.out" });

    // Hero video handling
    const hero = document.querySelector(".hero-section");
    const videoInner = document.querySelector(".video-inner");
    const videoWrapper = document.querySelector(".video-wrapper");

    if (!hero || !videoInner || !videoWrapper) {
        console.warn("Hero or video elements missing; continuing to set up other animations.");
    }

    if (isMobile || !hasScrollTrigger) {
        if (videoInner) gsap.to(videoInner, { scale: 0.95, duration: 0.8, ease: "power2.out" });
    } else {
        function getInset() {
            const verticalOffset = 90;
            return { top: verticalOffset, left: 0, right: 0, bottom: verticalOffset };
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "+=120%",
                scrub: 1,
                pin: true,
                invalidateOnRefresh: true
            }
        });

        tl.to(videoWrapper, {
            clipPath: () => {
                const i = getInset();
                return `inset(${i.top}px ${i.right}px ${i.bottom}px ${i.left}px round var(--radius, 16px))`;
            },
            ease: "power2.out",
            duration: 1
        }, 0);

        tl.to(videoInner, { scale: 0.8, ease: "power2.out", duration: 1 }, 0);
        tl.to(".hero-content", { opacity: 0, ease: "power2.out", duration: 1 }, 0);

        if (videoInner) videoInner.style.willChange = "transform";
    }

    // ---------- Idea-section reveal on enter / hide on leave ----------
    const ideaHeading = document.querySelector(".h1-idea-section h2");
    const ideaSub = document.querySelector(".subtext-idea");

    if (ideaHeading) gsap.set(ideaHeading, { x: -28, y: 12, opacity: 0 });
    if (ideaSub) gsap.set(ideaSub, { x: 28, y: 12, opacity: 0 });

    function revealElement(el) {
        gsap.to(el, {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            overwrite: true
        });
    }

    function hideElement(el) {
        const isHeading = (el === ideaHeading);
        gsap.to(el, {
            x: isHeading ? -28 : 28,
            y: 12,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            overwrite: true
        });
    }

    if ('IntersectionObserver' in window) {
        const ioOptions = { root: null, rootMargin: "0px", threshold: 0.15 };
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const el = entry.target;
                if (entry.isIntersecting) revealElement(el);
                else hideElement(el);
            });
        }, ioOptions);

        if (ideaHeading) io.observe(ideaHeading);
        if (ideaSub) io.observe(ideaSub);
    } else if (hasScrollTrigger) {
        if (ideaHeading) {
            ScrollTrigger.create({
                trigger: ideaHeading,
                start: "top 85%",
                onEnter: () => revealElement(ideaHeading),
                onEnterBack: () => revealElement(ideaHeading),
                onLeave: () => hideElement(ideaHeading),
                onLeaveBack: () => hideElement(ideaHeading)
            });
        }

        if (ideaSub) {
            ScrollTrigger.create({
                trigger: ideaSub,
                start: "top 85%",
                onEnter: () => revealElement(ideaSub),
                onEnterBack: () => revealElement(ideaSub),
                onLeave: () => hideElement(ideaSub),
                onLeaveBack: () => hideElement(ideaSub)
            });
        }
    } else {
        if (ideaHeading) revealElement(ideaHeading);
        if (ideaSub) revealElement(ideaSub);
    }

    // ---------- Launch-section ----------
    const launchHeading = document.querySelector(".launch-section .h2-launch h2");
    const launchPara = document.querySelector(".launch-section .p-launch p");

    if (launchHeading) gsap.set(launchHeading, { x: -28, y: 12, opacity: 0 });
    if (launchPara) gsap.set(launchPara, { x: 28, y: 12, opacity: 0 });

    if ('IntersectionObserver' in window) {
        const ioLaunch = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const el = entry.target;
                if (entry.isIntersecting) revealElement(el);
                else hideElement(el);
            });
        }, { root: null, rootMargin: "0px", threshold: 0.15 });

        if (launchHeading) ioLaunch.observe(launchHeading);
        if (launchPara) ioLaunch.observe(launchPara);
    } else if (hasScrollTrigger) {
        if (launchHeading) {
            ScrollTrigger.create({
                trigger: launchHeading,
                start: "top 85%",
                onEnter: () => revealElement(launchHeading),
                onEnterBack: () => revealElement(launchHeading),
                onLeave: () => hideElement(launchHeading),
                onLeaveBack: () => hideElement(launchHeading)
            });
        }
        if (launchPara) {
            ScrollTrigger.create({
                trigger: launchPara,
                start: "top 85%",
                onEnter: () => revealElement(launchPara),
                onEnterBack: () => revealElement(launchPara),
                onLeave: () => hideElement(launchPara),
                onLeaveBack: () => hideElement(launchPara)
            });
        }
    } else {
        if (launchHeading) revealElement(launchHeading);
        if (launchPara) revealElement(launchPara);
    }
});

// ========== STACK CARDS EFFECT ==========

document.addEventListener('DOMContentLoaded', () => {
    const stackCards = document.querySelectorAll('.stack-cards__item');
    const hasScrollTrigger = typeof ScrollTrigger !== "undefined";

    if (stackCards.length > 0 && hasScrollTrigger) {
        console.log('Initializing stack cards:', stackCards.length);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.impact-section',
                start: 'top top',
                end: '+=200%',
                pin: true,
                scrub: 1
            }
        });

        stackCards.forEach((card, index) => {
            gsap.set(card, {
                zIndex: stackCards.length - index,
                y: index * 20,
                scale: 1 - (index * 0.05)
            });
        });

        stackCards.forEach((card, index) => {
            if (index < stackCards.length - 1) {
                tl.to(card, {
                    y: -600,
                    opacity: 0,
                    scale: 0.8,
                    rotation: 10,
                    duration: 1,
                    ease: 'power2.inOut'
                }, index * 0.8);
            }
        });
    } else {
        console.warn('Stack cards or ScrollTrigger not available');
    }
});