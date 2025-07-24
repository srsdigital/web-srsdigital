document.addEventListener('DOMContentLoaded', () => {

    // --- Setup for Universal Mute/Unmute Buttons ---
    const muteButtons = document.querySelectorAll('.video-mute-toggle');
    muteButtons.forEach(button => {
        const container = button.closest('.relative');
        if (!container) return;

        const video = container.querySelector('video');
        const unmuteIcon = button.querySelector('.unmute-icon');
        const muteIcon = button.querySelector('.mute-icon');

        if (!video || !unmuteIcon || !muteIcon) return;

        // Set initial state based on video's muted property
        if (video.muted) {
            unmuteIcon.classList.remove('hidden');
            muteIcon.classList.add('hidden');
        } else {
            unmuteIcon.classList.add('hidden');
            muteIcon.classList.remove('hidden');
        }

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            video.muted = !video.muted;
            if (video.muted) {
                unmuteIcon.classList.remove('hidden');
                muteIcon.classList.add('hidden');
            } else {
                unmuteIcon.classList.add('hidden');
                muteIcon.classList.remove('hidden');
            }
        });
    });

    // --- Card Carousel Logic ---
    const carouselContainer = document.getElementById('problem-solution-carousel');
    if (carouselContainer) {
        const track = carouselContainer.querySelector('.carousel-track');
        const cards = Array.from(track.querySelectorAll('.carousel-card'));
        const prevButton = document.getElementById('carousel-button-prev');
        const nextButton = document.getElementById('carousel-button-next');
        const cardCount = cards.length;
        let currentIndex = 0;
        let autoSlideInterval;
        const SLIDE_DURATION = 5000; // 5 seconds per slide

        const updateCarousel = () => {
            cards.forEach((card, index) => {
                card.classList.remove('is-active', 'is-prev', 'is-next');

                const progress = card.querySelector('.progress-bar');
                if (progress) {
                    progress.style.animation = 'none';
                    progress.style.width = '0%';
                }

                const prevIndex = (currentIndex - 1 + cardCount) % cardCount;
                const nextIndex = (currentIndex + 1) % cardCount;

                if (index === currentIndex) {
                    card.classList.add('is-active');
                    if (progress) {
                        setTimeout(() => {
                            progress.style.animation = `fill-progress ${SLIDE_DURATION / 1000}s linear forwards`;
                        }, 50);
                    }
                } else if (index === prevIndex) {
                    card.classList.add('is-prev');
                } else if (index === nextIndex) {
                    card.classList.add('is-next');
                }
            });
        };

        const startAutoSlide = () => {
            stopAutoSlide();
            autoSlideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % cardCount;
                updateCarousel();
            }, SLIDE_DURATION);
        };

        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % cardCount;
                updateCarousel();
                startAutoSlide();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + cardCount) % cardCount;
                updateCarousel();
                startAutoSlide();
            });
        }

        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if (index !== currentIndex) {
                    currentIndex = index;
                    updateCarousel();
                    startAutoSlide();
                }
            });
        });

        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);

        updateCarousel();
        startAutoSlide();
    }


    // --- "How It Works" Auto-Cycling Tabs ---
    const hiwTabsContainer = document.getElementById('how-it-works-tabs');
    if (hiwTabsContainer) {
        const hiwButtons = Array.from(hiwTabsContainer.querySelectorAll('.tab-button'));
        const DURATION_PER_TAB = 6000;
        let currentIndex = 0;
        let autoCycleTimer = null;

        const activateTab = (index, isManualClick = false) => {
            if (isManualClick && autoCycleTimer) {
                clearTimeout(autoCycleTimer);
                autoCycleTimer = null;
            }

            currentIndex = index;

            hiwButtons.forEach((btn) => {
                btn.classList.remove('active', 'bg-white', 'text-gray-900');
                btn.classList.add('bg-gray-100', 'text-gray-700');

                const loadingBar = btn.querySelector('.loading-bar');
                if (loadingBar) {
                    loadingBar.classList.remove('running');
                    loadingBar.style.animation = 'none';
                    loadingBar.offsetHeight;
                }
            });

            hiwTabsContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
                content.classList.add('hidden');
                const video = content.querySelector('video');
                if (video) {
                    video.pause();
                }
            });

            const button = hiwButtons[index];
            const content = document.getElementById(button.getAttribute('data-tab'));

            button.classList.add('active', 'bg-white', 'text-gray-900');
            button.classList.remove('bg-gray-100', 'text-gray-700');
            content.classList.add('active');
            content.classList.remove('hidden');

            const activeVideo = content.querySelector('video');
            let duration = DURATION_PER_TAB;

            if (activeVideo) {
                if (activeVideo.duration && isFinite(activeVideo.duration)) {
                    duration = activeVideo.duration * 1000;
                }
                activeVideo.currentTime = 0;
                activeVideo.play().catch(e => console.error("Video play failed:", e));
            }

            const loadingBar = button.querySelector('.loading-bar');
            if (loadingBar) {
                loadingBar.style.animation = `fill-up ${duration / 1000}s linear forwards`;
                loadingBar.classList.add('running');
            }
            
            if (autoCycleTimer !== null) {
                autoCycleTimer = setTimeout(() => {
                    activateTab((currentIndex + 1) % hiwButtons.length);
                }, duration);
            }
        };
        
        hiwButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                activateTab(index, true);
            });
        });

        const startAutoCycle = () => {
            if (autoCycleTimer === null) { 
                autoCycleTimer = setTimeout(() => {
                    activateTab(0);
                }, 100); 
            }
        };

        const firstVideo = hiwTabsContainer.querySelector('video');
        if (firstVideo) {
            if (firstVideo.readyState >= 3) {
                startAutoCycle();
            } else {
                firstVideo.addEventListener('canplay', startAutoCycle, {
                    once: true
                });
            }
        } else {
            startAutoCycle();
        }
    }
});
