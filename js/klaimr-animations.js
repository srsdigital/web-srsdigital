document.addEventListener('DOMContentLoaded', () => {

    // --- Comprehensive Video Handling ---
    const allVideos = document.querySelectorAll('video');

    // Intersection Observer to pause videos when they are off-screen
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (!entry.isIntersecting) {
                video.pause();
            }
        });
    }, { threshold: 0.25 }); // 25% of video must be visible

    allVideos.forEach(video => {
        videoObserver.observe(video);
    });

    // Setup custom controls for each video
    document.querySelectorAll('.video-container').forEach(container => {
        const video = container.querySelector('video');
        const playPauseBtn = container.querySelector('.video-play-pause');
        const muteBtn = container.querySelector('.video-mute-toggle');

        if (!video || !playPauseBtn || !muteBtn) return;

        const playIcon = playPauseBtn.querySelector('.play-icon');
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');
        const unmuteIcon = muteBtn.querySelector('.unmute-icon');
        const muteIcon = muteBtn.querySelector('.mute-icon');

        // Function to update play/pause button UI
        const updatePlayPauseIcon = () => {
            if (video.paused) {
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
            } else {
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
            }
        };

        // Function to update mute/unmute button UI
        const updateMuteIcon = () => {
            if (video.muted) {
                unmuteIcon.classList.remove('hidden');
                muteIcon.classList.add('hidden');
            } else {
                unmuteIcon.classList.add('hidden');
                muteIcon.classList.remove('hidden');
            }
        };

        // Event Listeners for buttons
        playPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });

        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            video.muted = !video.muted;
        });

        // Sync UI with video state changes
        video.addEventListener('play', updatePlayPauseIcon);
        video.addEventListener('pause', updatePlayPauseIcon);
        video.addEventListener('volumechange', updateMuteIcon);

        // Set initial state
        updatePlayPauseIcon();
        updateMuteIcon();
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


    // --- REVISED: "How It Works" Tabs on User Interaction ---
    const hiwTabsContainer = document.getElementById('how-it-works-tabs');
    if (hiwTabsContainer) {
        const hiwButtons = Array.from(hiwTabsContainer.querySelectorAll('.tab-button'));
        let currentIndex = 0;
        let autoCycleTimer = null;

        // This function now just handles the visual switching of tabs
        const activateTab = (index) => {
            // Stop any running timer and pause video from the previous tab
            if (autoCycleTimer) clearTimeout(autoCycleTimer);
            const previousActiveContent = hiwTabsContainer.querySelector('.tab-content.active');
            if (previousActiveContent) {
                const prevVideo = previousActiveContent.querySelector('video');
                if (prevVideo) {
                    prevVideo.pause();
                }
            }

            currentIndex = index;

            // Reset all buttons and loading bars
            hiwButtons.forEach((btn) => {
                btn.classList.remove('active', 'bg-white', 'text-gray-900');
                btn.classList.add('bg-gray-100', 'text-gray-700');
                const loadingBar = btn.querySelector('.loading-bar');
                if (loadingBar) {
                    loadingBar.style.animation = 'none';
                    loadingBar.style.width = '0%';
                }
            });

            // Hide all content panels
            hiwTabsContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
                content.classList.add('hidden');
            });

            // Activate the new tab button and content panel
            const button = hiwButtons[index];
            const content = document.getElementById(button.getAttribute('data-tab'));

            button.classList.add('active', 'bg-white', 'text-gray-900');
            button.classList.remove('bg-gray-100', 'text-gray-700');
            content.classList.add('active');
            content.classList.remove('hidden');
            
            const video = content.querySelector('video');
            if (video) {
                video.currentTime = 0; // Reset video for new viewing
            }
        };

        // Add click listeners to tab buttons for manual navigation
        hiwButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                activateTab(index);
            });
        });

        // Add listeners to videos to control the progress bar and auto-cycling
        hiwTabsContainer.querySelectorAll('.tab-content video').forEach(video => {
            // When user clicks play, start the progress bar and the cycle timer
            video.addEventListener('play', () => {
                const contentId = video.closest('.tab-content').id;
                const button = hiwTabsContainer.querySelector(`.tab-button[data-tab="${contentId}"]`);
                
                if (button && button.classList.contains('active')) {
                    const loadingBar = button.querySelector('.loading-bar');
                    const duration = video.duration;

                    if (loadingBar && isFinite(duration)) {
                        loadingBar.style.animation = `fill-up ${duration}s linear forwards`;
                    }

                    if (autoCycleTimer) clearTimeout(autoCycleTimer);
                    if (isFinite(duration)) {
                        autoCycleTimer = setTimeout(() => {
                            activateTab((currentIndex + 1) % hiwButtons.length);
                        }, duration * 1000);
                    }
                }
            });

            // When user pauses, clear the timer and reset the bar
            video.addEventListener('pause', () => {
                const contentId = video.closest('.tab-content').id;
                const button = hiwTabsContainer.querySelector(`.tab-button[data-tab="${contentId}"]`);
                if (button) {
                    const loadingBar = button.querySelector('.loading-bar');
                    if(loadingBar) {
                        // Resetting the bar on pause gives clear feedback
                        loadingBar.style.animation = 'none';
                        loadingBar.style.width = '0%';
                    }
                }
                if (autoCycleTimer) {
                    clearTimeout(autoCycleTimer);
                    autoCycleTimer = null;
                }
            });
        });

        // Set the initial state without starting any timers
        activateTab(0);
    }
});
