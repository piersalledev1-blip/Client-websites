/* =========================================================
   ELEMENTS
========================================================= */

const header =
    document.getElementById("site-header");

const menuButton =
    document.getElementById("mobile-menu-button");

const drawer =
    document.getElementById("mobile-drawer");

const overlay =
    document.getElementById("mobile-overlay");

const closeButton =
    document.getElementById("drawer-close");

const mobileLinks =
    document.querySelectorAll(".mobile-nav a");


/* =========================================================
   DRAWER
========================================================= */

if (
    drawer &&
    menuButton &&
    overlay &&
    closeButton
) {

    let drawerOpen = false;

    let drawerWidth = 0;

    let drawerPosition = 0;

    let gestureActive = false;

    let horizontalGesture = false;

    let directionLocked = false;

    let startX = 0;

    let startY = 0;

    let startDrawerPosition = 0;


    function getDrawerWidth() {

        drawerWidth =
            drawer.getBoundingClientRect().width;

        return drawerWidth;
    }


    function setDrawerPosition(
        position,
        animate = false
    ) {

        const width = getDrawerWidth();

        const clamped =
            Math.max(
                0,
                Math.min(width, position)
            );

        drawerPosition = clamped;

        drawer.style.transition =
            animate
                ? "transform 0.28s ease"
                : "none";

        drawer.style.transform =
            `translate3d(${clamped}px, 0, 0)`;
    }


    function forceDrawerClosed() {

        const width = getDrawerWidth();

        drawerOpen = false;

        drawer.classList.remove("open");

        overlay.classList.remove("active");

        drawer.style.transition = "none";

        drawerPosition = width;

        drawer.style.transform =
            `translate3d(${width}px, 0, 0)`;

        drawer.setAttribute(
            "aria-hidden",
            "true"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.setAttribute(
            "aria-label",
            "Open menu"
        );

        document.body.style.overflow = "";
    }


    function openDrawer() {

        getDrawerWidth();

        drawerOpen = true;

        drawer.classList.add("open");

        overlay.classList.add("active");

        drawer.setAttribute(
            "aria-hidden",
            "false"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );

        menuButton.setAttribute(
            "aria-label",
            "Close menu"
        );

        setDrawerPosition(0, true);

        document.body.style.overflow = "hidden";
    }


    function closeDrawer() {

        const width = getDrawerWidth();

        drawerOpen = false;

        drawer.classList.remove("open");

        overlay.classList.remove("active");

        drawer.setAttribute(
            "aria-hidden",
            "true"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.setAttribute(
            "aria-label",
            "Open menu"
        );

        drawer.style.transition =
            "transform 0.28s ease";

        drawerPosition = width;

        drawer.style.transform =
            `translate3d(${width}px, 0, 0)`;

        document.body.style.overflow = "";
    }


    menuButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();
            event.stopPropagation();

            if (drawerOpen) {
                closeDrawer();
            } else {
                openDrawer();
            }

        }
    );


    closeButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();
            event.stopPropagation();

            closeDrawer();

        }
    );


    overlay.addEventListener(
        "click",
        function() {

            closeDrawer();

        }
    );


    mobileLinks.forEach(function(link) {

        link.addEventListener(
            "click",
            function(event) {

                const section =
                    link.getAttribute("data-section");

                if (!section) {

                    closeDrawer();

                    return;
                }

                event.preventDefault();

                mobileLinks.forEach(function(item) {

                    item.classList.remove("active");

                });

                link.classList.add("active");

                setTimeout(function() {

                    closeDrawer();

                    const target =
                        document.getElementById(section);

                    if (target) {

                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

                }, 150);

            }
        );

    });


    document.addEventListener(
        "touchstart",
        function(event) {

            if (event.touches.length !== 1) {
                return;
            }

            const touch =
                event.touches[0];

            startX =
                touch.clientX;

            startY =
                touch.clientY;

            startDrawerPosition =
                drawerOpen
                    ? 0
                    : getDrawerWidth();

            gestureActive = false;
            horizontalGesture = false;
            directionLocked = false;


            if (
                !drawerOpen &&
                startX < window.innerWidth - 45
            ) {
                return;
            }

            gestureActive = true;

            drawer.style.transition = "none";

        },
        {
            passive: true
        }
    );


    document.addEventListener(
        "touchmove",
        function(event) {

            if (!gestureActive) {
                return;
            }

            if (event.touches.length !== 1) {
                return;
            }

            const touch =
                event.touches[0];

            const deltaX =
                touch.clientX - startX;

            const deltaY =
                touch.clientY - startY;


            if (!directionLocked) {

                if (
                    Math.abs(deltaX) < 1 &&
                    Math.abs(deltaY) < 1
                ) {
                    return;
                }

                if (
                    Math.abs(deltaY) >
                    Math.abs(deltaX)
                ) {

                    gestureActive = false;

                    return;
                }

                directionLocked = true;

                horizontalGesture = true;
            }


            if (!horizontalGesture) {
                return;
            }


            setDrawerPosition(
                startDrawerPosition + deltaX,
                false
            );

            event.preventDefault();

        },
        {
            passive: false
        }
    );


    document.addEventListener(
        "touchend",
        function() {

            if (!gestureActive) {
                return;
            }

            gestureActive = false;

            if (!horizontalGesture) {
                return;
            }

            const threshold =
                drawerWidth * 0.40;


            if (drawerOpen) {

                if (
                    drawerPosition >= threshold
                ) {
                    closeDrawer();
                } else {
                    openDrawer();
                }

            } else {

                if (
                    drawerPosition <=
                    drawerWidth - threshold
                ) {
                    openDrawer();
                } else {
                    closeDrawer();
                }

            }

            horizontalGesture = false;

        },
        {
            passive: true
        }
    );


    document.addEventListener(
        "touchcancel",
        function() {

            gestureActive = false;
            horizontalGesture = false;

            if (drawerOpen) {
                openDrawer();
            } else {
                forceDrawerClosed();
            }

        },
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        function() {

            const newWidth =
                getDrawerWidth();


            if (!drawerOpen) {

                drawerPosition = newWidth;

                drawer.style.transition =
                    "none";

                drawer.style.transform =
                    `translate3d(${newWidth}px, 0, 0)`;

            } else {

                drawerPosition = 0;

                drawer.style.transition =
                    "none";

                drawer.style.transform =
                    "translate3d(0, 0, 0)";
            }


            if (window.innerWidth > 700) {

                forceDrawerClosed();

            }

        }
    );


    forceDrawerClosed();


    window.addEventListener(
        "load",
        function() {

            drawerWidth =
                drawer.getBoundingClientRect().width;

            drawerOpen = false;

            drawer.style.transition = "none";

            setDrawerPosition(
                drawerWidth
            );


            requestAnimationFrame(function() {

                drawer.style.transition =
                    "transform .28s cubic-bezier(.22,.61,.36,1)";

            });

        }
    );

}


/* =========================================================
   STICKY HEADER SHADOW
========================================================= */

if (header) {

    window.addEventListener(
        "scroll",
        function() {

            if (window.scrollY > 10) {

                header.classList.add("scrolled");

            } else {

                header.classList.remove("scrolled");

            }

        },
        {
            passive: true
        }
    );

}
/* =========================================================
   ACTIVE HOMEPAGE SECTION
========================================================= */

const sections = [

    {
        id: "hps-why-holiness",

        link: document.querySelector(
            '[data-section="hps-why-holiness"]'
        )
    },

    {
        id: "services",

        link: document.querySelector(
            '[data-section="services"]'
        )
    },

    {
        id: "location",

        link: document.querySelector(
            '[data-section="location"]'
        )
    }

];


function updateActiveSection() {

    const scrollPosition =
        window.scrollY +
        window.innerHeight * 0.30;

    let activeFound = false;


    sections.forEach(function(section) {

        const element =
            document.getElementById(
                section.id
            );

        if (
            !element ||
            !section.link
        ) {
            return;
        }


        const top =
            element.offsetTop;

        const bottom =
            top + element.offsetHeight;


        if (
            scrollPosition >= top &&
            scrollPosition < bottom
        ) {

            sections.forEach(function(item) {

                if (item.link) {

                    item.link.classList.remove(
                        "active"
                    );

                }

            });


            section.link.classList.add(
                "active"
            );

            activeFound = true;

        }

    });


    if (!activeFound) {

        const firstSection =
            document.getElementById(
                "hps-why-holiness"
            );

        if (
            firstSection &&
            scrollPosition <
                firstSection.offsetTop
        ) {

            sections.forEach(function(section) {

                if (section.link) {

                    section.link.classList.remove(
                        "active"
                    );

                }

            });

        }

    }

}


window.addEventListener(
    "scroll",
    updateActiveSection,
    {
        passive: true
    }
);


window.addEventListener(
    "load",
    function() {

        updateActiveSection();

    }
);


/* =========================================================
   HOLINESS PLUMBING & CONSTRUCTION
   VIDEO LAZY LOADING
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const videos =
            document.querySelectorAll(
                ".hps-video-player video"
            );

        if (!videos.length) {
            return;
        }


        function loadVideo(video) {

            const source =
                video.querySelector("source");

            if (
                !source ||
                !source.dataset.src
            ) {
                return;
            }

            if (source.src) {
                return;
            }

            source.src =
                source.dataset.src;

            video.load();

        }


        if (
            "IntersectionObserver" in window
        ) {

            const videoObserver =
                new IntersectionObserver(
                    function(
                        entries,
                        observer
                    ) {

                        entries.forEach(
                            function(entry) {

                                if (
                                    !entry.isIntersecting
                                ) {
                                    return;
                                }

                                loadVideo(
                                    entry.target
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }
                        );

                    },
                    {
                        rootMargin:
                            "300px 0px",
                        threshold: 0
                    }
                );


            videos.forEach(
                function(video) {

                    videoObserver.observe(
                        video
                    );

                }
            );

        } else {

            videos.forEach(
                function(video) {

                    loadVideo(video);

                }
            );

        }

    }
);


/* =========================================================
   SELECTED WORK
   FILTER
========================================================= */

const workFilters =
    document.querySelectorAll(
        ".work-filter"
    );

const workItems =
    document.querySelectorAll(
        ".work-item"
    );


if (
    workFilters.length &&
    workItems.length
) {

    workFilters.forEach(
        function(filterButton) {

            filterButton.addEventListener(
                "click",
                function() {

                    const selectedFilter =
                        this.dataset.filter;


                    workFilters.forEach(
                        function(button) {

                            button.classList.remove(
                                "active"
                            );

                        }
                    );


                    this.classList.add(
                        "active"
                    );


                    workItems.forEach(
                        function(item) {

                            const itemCategory =
                                item.dataset.category;


                            if (
                                selectedFilter === "all" ||
                                itemCategory === selectedFilter
                            ) {

                                item.style.display =
                                    "";

                            } else {

                                item.style.display =
                                    "none";

                            }

                        }
                    );

                }
            );

        }
    );

}


/* =========================================================
   LIGHTBOX
========================================================= */

const workImageButtons =
    document.querySelectorAll(
        ".work-image-button"
    );

const workLightbox =
    document.getElementById(
        "work-lightbox"
    );

const lightboxImage =
    document.getElementById(
        "lightbox-image"
    );

const lightboxTitle =
    document.getElementById(
        "lightbox-title"
    );

const lightboxClose =
    document.querySelector(
        ".lightbox-close"
    );


if (
    workImageButtons.length &&
    workLightbox &&
    lightboxImage &&
    lightboxTitle &&
    lightboxClose
) {

    workImageButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const imageSource =
                        this.dataset.image;

                    const imageTitle =
                        this.dataset.title;


                    lightboxImage.src =
                        imageSource;

                    lightboxImage.alt =
                        imageTitle;

                    lightboxTitle.textContent =
                        imageTitle;


                    workLightbox.classList.add(
                        "active"
                    );

                    workLightbox.setAttribute(
                        "aria-hidden",
                        "false"
                    );

                    document.body.style.overflow =
                        "hidden";

                }
            );

        }
    );


    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );


    workLightbox.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                workLightbox
            ) {

                closeLightbox();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape" &&
                workLightbox.classList.contains(
                    "active"
                )
            ) {

                closeLightbox();

            }

        }
    );


    function closeLightbox() {

        workLightbox.classList.remove(
            "active"
        );

        workLightbox.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow =
            "";

        lightboxImage.src =
            "";

        lightboxImage.alt =
            "";

        lightboxTitle.textContent =
            "";

    }

}


/* =========================================================
   HOLINESS PLUMBING
   TRUST COUNTERS
========================================================= */

const hpsTrustCounters =
    document.querySelectorAll(
        "#hps-trust-section .c"
    );


if (
    hpsTrustCounters.length &&
    "IntersectionObserver" in window
) {

    const hpsTrustObserver =
        new IntersectionObserver(

            function(entries) {

                entries.forEach(
                    function(entry) {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        const hpsTrustCounter =
                            entry.target;

                        const hpsTrustTarget =
                            Number(
                                hpsTrustCounter.dataset.t
                            );

                        const hpsTrustDuration =
                            2000;

                        const hpsTrustStartTime =
                            performance.now();


                        function hpsTrustAnimate(
                            currentTime
                        ) {

                            const hpsTrustProgress =
                                Math.min(
                                    (
                                        currentTime -
                                        hpsTrustStartTime
                                    ) /
                                    hpsTrustDuration,
                                    1
                                );

                            const hpsTrustEased =
                                1 -
                                Math.pow(
                                    1 -
                                    hpsTrustProgress,
                                    3
                                );

                            hpsTrustCounter.textContent =
                                Math.floor(
                                    hpsTrustEased *
                                    hpsTrustTarget
                                );


                            if (
                                hpsTrustProgress < 1
                            ) {

                                requestAnimationFrame(
                                    hpsTrustAnimate
                                );

                            } else {

                                hpsTrustCounter.textContent =
                                    hpsTrustTarget;

                            }

                        }


                        requestAnimationFrame(
                            hpsTrustAnimate
                        );


                        hpsTrustObserver.unobserve(
                            hpsTrustCounter
                        );

                    }
                );

            },

            {
                threshold: 0.5
            }

        );


    hpsTrustCounters.forEach(
        function(hpsTrustCounter) {

            hpsTrustObserver.observe(
                hpsTrustCounter
            );

        }
    );

}
const testimonialTrack =
    document.getElementById("testimonial-track");

const testimonialCards =
    document.querySelectorAll(".testimonial-card");

const testimonialDots =
    document.getElementById("testimonial-dots");

const testimonialPrev =
    document.getElementById("testimonial-prev");

const testimonialNext =
    document.getElementById("testimonial-next");

const testimonialSlider =
    document.querySelector(".testimonial-slider");

let testimonialIndex = 0;
let testimonialTimer;


testimonialCards.forEach((_, index) => {

    const dot = document.createElement("button");

    dot.className = "testimonial-dot";
    dot.type = "button";

    dot.setAttribute(
        "aria-label",
        `Show testimonial ${index + 1}`
    );

    dot.addEventListener("click", () => {
        showTestimonial(index);
        restartTestimonialTimer();
    });

    testimonialDots.appendChild(dot);

});


const testimonialDotItems =
    testimonialDots.querySelectorAll(".testimonial-dot");


function showTestimonial(index) {

    testimonialIndex =
        (index + testimonialCards.length)
        % testimonialCards.length;

    testimonialTrack.style.transform =
        `translateX(-${testimonialIndex * 100}%)`;

    testimonialDotItems.forEach((dot, dotIndex) => {

        dot.classList.toggle(
            "active",
            dotIndex === testimonialIndex
        );

    });

}


function nextTestimonial() {
    showTestimonial(testimonialIndex + 1);
}


function previousTestimonial() {
    showTestimonial(testimonialIndex - 1);
}


function startTestimonialTimer() {

    clearInterval(testimonialTimer);

    testimonialTimer =
        setInterval(nextTestimonial, 5000);

}


function stopTestimonialTimer() {
    clearInterval(testimonialTimer);
}


function restartTestimonialTimer() {
    stopTestimonialTimer();
    startTestimonialTimer();
}


testimonialNext.addEventListener("click", () => {
    nextTestimonial();
    restartTestimonialTimer();
});


testimonialPrev.addEventListener("click", () => {
    previousTestimonial();
    restartTestimonialTimer();
});


testimonialSlider.addEventListener(
    "mouseenter",
    stopTestimonialTimer
);


testimonialSlider.addEventListener(
    "mouseleave",
    startTestimonialTimer
);


testimonialSlider.addEventListener(
    "touchstart",
    stopTestimonialTimer,
    { passive: true }
);


testimonialSlider.addEventListener(
    "touchend",
    startTestimonialTimer,
    { passive: true }
);


showTestimonial(0);
startTestimonialTimer();