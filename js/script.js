window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".site-header .navbar");

    if (!navbar) return;

    if (window.scrollY >= 200) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// service slider  
$(document).ready(function () {
    // lenis smooth for smooth page
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1.2,
        touchMultiplier: 1.5,
        lerp: 0.08,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    window.addEventListener("resize", () => {
        ScrollTrigger.refresh();
    });
});
document.querySelectorAll('a[href*="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        const target = this.getAttribute("href");
        if (target.startsWith("#") && document.querySelector(target)) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -80 });
        }
    });
});


// testimonial slider and SERVE-JS
$(document).ready(function () {
    $('.testimonial-slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        arrows: false,
        dots: false,
        autoplay: true,
        speed: 500,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1.5,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    // centerMode: true,
                    // centerPadding: "40px"
                }
            }
        ]
    });

    // SERVE SLIDER
    $('.serve-slider').slick({
        arrows: false,
        dots: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '0px',
        infinite: true,
        speed: 500,

        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    centerMode: false
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerMode: false
                }
            }
        ]
    });


    // EXPERT-SLIDER-JS

    const $slider = $(".abt-track");
    const $fill = $(".scroll_bar_fill");
    const $thumb = $(".scroll_bar_thumb");
    const $trackBar = $(".scroll_bar_track");

    const DESKTOP_BREAKPOINT = 992;

    function isDesktopMode() {
        return window.innerWidth >= DESKTOP_BREAKPOINT;
    }
    /* ======== WAIT FOR ALL IMAGES ======== */
    function waitForImages($container, callback) {

        const $imgs = $container.find("img");

        let remaining = $imgs.length;

        if (remaining === 0) {
            callback();
            return;
        }

        $imgs.each(function () {

            const img = this;

            if (img.complete && img.naturalWidth) {

                remaining--;

                if (remaining === 0) {
                    callback();
                }

                return;
            }

            $(img).on("load error", function () {

                remaining--;

                if (remaining === 0) {
                    callback();
                }

            });

        });
    }
    /* ============ DESKTOP MODE ============== */
    function storeNaturalHeights() {

        if (!isDesktopMode()) {
            return;
        }

        $slider.find(".abt-item").each(function () {

            const $slide = $(this);

            /*
             * Remove JS height temporarily.
             */
            $slide.css("height", "auto");

            const naturalHeight =
                $slide.outerHeight();

            $slide.data(
                "natural-height",
                naturalHeight
            );

        });
    }
    function setFixedSliderHeight() {

        if (!isDesktopMode()) {
            return;
        }

        let maxHeight = 0;

        $slider.find(".abt-item").each(function () {

            const naturalHeight =
                parseFloat(
                    $(this).data("natural-height")
                ) || 0;

            if (naturalHeight > maxHeight) {
                maxHeight = naturalHeight;
            }

        });


        if (!maxHeight) {
            return;
        }


        /*
         * Keep Slick list fixed.
         */
        $slider
            .find(".slick-list")
            .css("height", maxHeight + "px");


        /*
         * Keep Slick track fixed.
         */
        $slider
            .find(".slick-track")
            .css("height", maxHeight + "px");


        $slider.data(
            "max-slider-height",
            maxHeight
        );
    }
    function updateSlideHeights() {

        /* * Don't do anything below 992px. */
        if (!isDesktopMode()) {
            return;
        }

        $slider.find(".abt-item").each(function () {

            const $slide = $(this);

            const naturalHeight =
                parseFloat(
                    $slide.data("natural-height")
                );


            if (!naturalHeight) {
                return;
            }


            /*
             * CURRENT SLIDE
             */
            if (
                $slide.hasClass("slick-current") &&
                $slide.hasClass("slick-active")
            ) {

                $slide.css({
                    "height":
                        naturalHeight + "px",

                    "transform":
                        "translateY(0px)"
                });

            }


            /*
             * OTHER SLIDES
             */
            else {

                $slide.css({
                    "height":
                        (naturalHeight * 0.5) + "px",

                    "transform":
                        "translateY(50px)"
                });

            }

        });

    }
    /* ========= from desktop mode to <=991px =========== */
    function resetCustomSliderStyles() {

        $slider
            .find(".abt-item")
            .css({
                "height": "",
                "transform": ""
            });


        $slider
            .find(".slick-list")
            .css("height", "");


        $slider
            .find(".slick-track")
            .css("height", "");


        /*
         * Remove stored heights.
         */
        $slider
            .find(".abt-item")
            .removeData("natural-height");

    }
    /* ======== PROGRESS BAR ====== */
    function updateProgress(slick) {

        const totalSlides =
            slick.slideCount;


        if (totalSlides <= 1) {
            return;
        }


        const current =
            slick.currentSlide;


        const progress =
            current /
            (totalSlides - 1);


        /*
         * Fill
         */
        $fill.css(
            "width",
            (progress * 100) + "%"
        );


        /*
         * Thumb
         */
        const barWidth =
            $trackBar.width() -
            $thumb.outerWidth();


        $thumb.css(
            "transform",
            "translateX(" +
            (progress * barWidth) +
            "px)"
        );

    }
    /* ======= INITIALIZE SLICK ========= */
    $slider.slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        arrows: false,
        dots: false,
        autoplay: false,
        speed: 600,
        swipe: true,
        draggable: true,
        touchMove: true,
        adaptiveHeight: false,
        responsive: [

            {
                breakpoint: 767,

                settings: {
                    slidesToShow: 1
                }

            }

        ]

    });
    /* ========= INITIAL SETUP ======= */
    waitForImages(
        $slider,
        function () {

            /*
             * Only apply custom behavior
             * at 992px and above.
             */
            if (isDesktopMode()) {

                storeNaturalHeights();

                setFixedSliderHeight();

                updateSlideHeights();

            }


            /*
             * Progress works everywhere.
             */
            updateProgress(
                $slider.slick("getSlick")
            );

        }
    );
    /* ===== BEFORE CHANGE  CUSTOM ANIMATION ONLY ON DESKTOP.
       At <=991px Slick behaves normally. ========== */
    $slider.on(
        "beforeChange",
        function (
            event,
            slick,
            currentSlide,
            nextSlide
        ) {

            /*
             * IMPORTANT:
             *
             * Below 992px do absolutely nothing.
             */
            if (!isDesktopMode()) {
                return;
            }


            $slider.find(".abt-item").each(function () {

                const $slide = $(this);

                const naturalHeight =
                    parseFloat(
                        $slide.data("natural-height")
                    );


                if (!naturalHeight) {
                    return;
                }


                /*
                 * Slick creates clones for infinite mode,
                 * so normalize the index.
                 */
                const slideCount =
                    slick.slideCount;


                const slideIndex =
                    parseInt(
                        $slide.attr("data-slick-index"),
                        10
                    );


                const normalizedIndex =
                    ((slideIndex % slideCount) +
                        slideCount) %
                    slideCount;


                /*
                 * Is this the target slide?
                 */
                const isNextSlide =
                    normalizedIndex === nextSlide;


                if (isNextSlide) {

                    /*
                     * TARGET:
                     *
                     * 50% -> 100%
                     * 50px -> 0px
                     */
                    $slide.css({
                        "height":
                            naturalHeight + "px",

                        "transform":
                            "translateY(0px)"
                    });

                } else {

                    /*
                     * OTHER:
                     *
                     * 100% -> 50%
                     * 0px -> 50px
                     */
                    $slide.css({
                        "height":
                            (naturalHeight * 0.5) + "px",

                        "transform":
                            "translateY(50px)"
                    });

                }

            });

        }
    );
    /* ======= AFTER CHANGE ======= */
    $slider.on(
        "afterChange",
        function (
            event,
            slick,
            currentSlide
        ) {

            /*
             * Only apply custom slide states
             * on desktop.
             */
            if (isDesktopMode()) {

                updateSlideHeights();

            }


            /*
             * Progress works on all sizes.
             */
            updateProgress(slick);

        }
    );
    let resizeTimer;
    let previousDesktopMode =
        isDesktopMode();
    $(window).on(
        "resize",
        function () {

            clearTimeout(resizeTimer);

            resizeTimer =
                setTimeout(
                    function () {

                        const currentDesktopMode =
                            isDesktopMode();


                        /*
                         * Detect crossing of the
                         * 992px breakpoint.
                         */
                        if (
                            currentDesktopMode !==
                            previousDesktopMode
                        ) {

                            /*
                             * We crossed 992px.
                             *
                             * First remove all custom
                             * desktop styles.
                             */
                            resetCustomSliderStyles();


                            /*
                             * If we are now desktop,
                             * rebuild custom behavior.
                             */
                            if (currentDesktopMode) {

                                storeNaturalHeights();

                                setFixedSliderHeight();

                                updateSlideHeights();

                            }


                            /*
                             * Update stored mode.
                             */
                            previousDesktopMode =
                                currentDesktopMode;

                        }


                        /*
                         * Normal desktop resize.
                         */
                        else if (currentDesktopMode) {

                            storeNaturalHeights();

                            setFixedSliderHeight();

                            updateSlideHeights();

                        }


                        /*
                         * Update progress.
                         */
                        updateProgress(
                            $slider.slick(
                                "getSlick"
                            )
                        );


                    },
                    150
                );

        }
    );

});

// Play button click
$(".video-wrapper").on("click", ".video-play", function () {

    const $box = $(this).closest(".video-wrapper");
    const video = $box.find(".teach-video")[0];

    if (!video) return;

    // Stop all other videos first
    stopAllVideos();

    // Hide thumbnail and play button
    $box.addClass("is-playing");

    // Show video controls
    video.controls = true;

    // Play video
    video.play().catch(function (error) {
        console.log("Video play failed:", error);
        $box.removeClass("is-playing");
    });
});

// Pause event
$(".video-wrapper").on("pause", ".teach-video", function () {
    const $box = $(this).closest(".video-wrapper");
    // Show thumbnail and play button again
    $box.removeClass("is-playing");
});

// Video ended
$(".video-wrapper").on("ended", ".teach-video", function () {
    const $box = $(this).closest(".video-wrapper");
    // Reset video
    this.currentTime = 0;
    this.controls = false;
    // Show thumbnail and play button
    $box.removeClass("is-playing");
});

// Stop all videos
function stopAllVideos() {

    $(".teach-video").each(function () {
        this.pause();
        this.currentTime = 0;
        this.controls = false;
        $(this)
            .closest(".video-wrapper")
            .removeClass("is-playing");
    });
}

// If you're using Slick slider
$(".video-wrapper").on("beforeChange", function () {
    stopAllVideos();
});

// -video - scrpt--

document.querySelectorAll(".video-wrapper").forEach(function (wrapper) {
    const video = wrapper.querySelector("video");
    const button = wrapper.querySelector(".video-play-btn");

    button.addEventListener("click", function () {
        video.play();
        button.style.display = "none";
        video.controls = true;
    });

    video.addEventListener("ended", function () {
        button.style.display = "flex";
        video.controls = false;
    });
});

// residential page gsap

document.addEventListener("DOMContentLoaded", () => {

    gsap.registerPlugin(ScrollTrigger);

    let mm = gsap.matchMedia();

    mm.add("(min-width: 992px)", function () {

        const HEADER_H = 120;          // your fixed header height
        const HOLD_DELAY = 0.8;        // pause (timeline seconds) before next card slides in
        const PIXELS_PER_SECOND = 600; // scroll speed: higher = more scroll distance per timeline second
        const END_HOLD_PX = 1400;      // scroll distance (px) to hold pinned AFTER last card settles (~2-3 scrolls)

        const sec = document.querySelector(".res-bxx-sec");
        const cont = document.querySelector(".res-bxx-cont");
        const wrap = document.querySelector(".res-boxx-wrpp");
        const sections = gsap.utils.toArray(".res-bxx");
        const total = sections.length;

        if (!sec || !cont || !total) return;

        let cardHeight = 0;
        let viewportH = 0;

        // ==============================
        // MEASURE TALLEST CARD + AVAILABLE VIEWPORT SPACE
        // ==============================
        function measureCardHeight() {
            cardHeight = 0;
            sections.forEach(s => {
                gsap.set(s, { clearProps: "transform" });
                const h = s.offsetHeight;
                if (h > cardHeight) cardHeight = h;
            });

            viewportH = window.innerHeight - HEADER_H;

            sec.style.height = viewportH + "px";
            wrap.style.height = viewportH + "px";
            cont.style.height = cardHeight + "px";
        }

        function refreshLayout() {
            measureCardHeight();
        }

        refreshLayout();

        // ==============================
        // INITIAL STATES
        // ==============================
        gsap.set(sections, {
            yPercent: 100,
            scale: 0.85,
            opacity: 0,
            transformOrigin: "center top"
        });

        gsap.set(sections[0], {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            zIndex: 1
        });

        // ==============================
        // TIMELINE (built first, NOT yet tied to scroll)
        // ==============================
        const tl = gsap.timeline({ paused: true });

        sections.forEach((section, i) => {
            if (i === 0) return;
            const prev = sections[i - 1];

            tl.set(section, { zIndex: i + 1 });

            tl.to(section, {
                yPercent: 0,
                scale: 1,
                opacity: 1,
                duration: 1,
                ease: "power2.out"
            }, `+=${HOLD_DELAY}`);

            tl.to(prev, {
                scale: 0.85,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            }, "<");

        });

        // ==============================
        // FINAL HOLD — empty tween reserves real scroll distance
        // after the last card settles, before the section unpins.
        // ==============================
        tl.to({}, { duration: END_HOLD_PX / PIXELS_PER_SECOND });

        // ==============================
        // SCROLLTRIGGER — end distance now includes the hold automatically
        // ==============================
        ScrollTrigger.create({
            trigger: sec,
            start: `top top+=${HEADER_H}`,
            end: () => "+=" + (tl.duration() * PIXELS_PER_SECOND),
            scrub: 1,
            pin: sec,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            animation: tl
        });

        // ==============================
        // RESIZE
        // ==============================
        const resizeHandler = () => {
            refreshLayout();
            ScrollTrigger.refresh();
        };
        window.addEventListener("resize", resizeHandler);

        return () => {
            window.removeEventListener("resize", resizeHandler);
        };
    });

    mm.add("(max-width: 991px)", function () {
        // no animation on mobile — normal flow
    });

});
