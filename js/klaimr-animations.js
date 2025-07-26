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


    // --- REVISED: "How It Works" Tabs with Autoplay Sequence ---
    const hiwTabsContainer = document.getElementById('how-it-works-tabs');
    if (hiwTabsContainer) {
        const hiwButtons = Array.from(hiwTabsContainer.querySelectorAll('.tab-button'));
        const tabContents = Array.from(hiwTabsContainer.querySelectorAll('.tab-content'));
        let currentIndex = 0;

        // Function to switch tabs. Can be told to autoplay the video in the new tab.
        const activateTab = (index, playVideo = false) => {
            // Pause the video in the tab we are leaving
            const previousContent = tabContents[currentIndex];
            if (previousContent) {
                const prevVideo = previousContent.querySelector('video');
                if (prevVideo && !prevVideo.paused) {
                    prevVideo.pause();
                }
            }

            currentIndex = index;

            // Update button styles
            hiwButtons.forEach((btn, i) => {
                btn.classList.toggle('active', i === index);
                btn.classList.toggle('bg-white', i === index);
                btn.classList.toggle('text-gray-900', i === index);
                btn.classList.toggle('bg-gray-100', i !== index);
                btn.classList.toggle('text-gray-700', i !== index);
            });

            // Update content visibility
            tabContents.forEach((content, i) => {
                content.classList.toggle('active', i === index);
                content.classList.toggle('hidden', i !== index);
            });
            
            const newContent = tabContents[index];
            if (newContent) {
                const video = newContent.querySelector('video');
                if (video) {
                    video.currentTime = 0; // Always restart video
                    if (playVideo) {
                        // Use a promise to handle potential autoplay errors
                        const playPromise = video.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(error => {
                                // Autoplay was prevented by the browser.
                                console.error("Autoplay was prevented:", error);
                            });
                        }
                    }
                }
            }
        };

        // Add event listeners to all tab components
        tabContents.forEach((content, index) => {
            const videoContainer = content.querySelector('.video-container');
            const video = content.querySelector('video');
            const button = hiwButtons[index];
            const loadingBar = button ? button.querySelector('.loading-bar') : null;

            if (!video || !videoContainer || !button || !loadingBar) return;

            // REQUIREMENT 1: Click/tap video container to play/pause
            videoContainer.addEventListener('click', (e) => {
                // Don't interfere with custom controls, which have their own listeners
                if (e.target.closest('.video-controls')) {
                    return;
                }
                
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            });

            // REQUIREMENT 2: Auto-advance to next video on 'ended'
            video.addEventListener('ended', () => {
                const nextIndex = index + 1;
                // Only advance if there is a next tab
                if (nextIndex < hiwButtons.length) {
                    activateTab(nextIndex, true); // Activate and play next
                }
            });

            // --- Progress Bar Synchronization (maintains original behavior) ---
            video.addEventListener('play', () => {
                if (video.duration && isFinite(video.duration)) {
                    loadingBar.style.animation = 'none'; // Reset any existing animation
                    void loadingBar.offsetWidth; // Force browser reflow to restart animation
                    loadingBar.style.animation = `fill-up ${video.duration}s linear forwards`;
                    loadingBar.classList.add('running');
                }
            });

            // Reset the bar on pause, as per the original file's logic
            video.addEventListener('pause', () => {
                loadingBar.style.animation = 'none';
                loadingBar.classList.remove('running');
                loadingBar.style.width = '0%';
            });
            
            // Also reset the bar when the video finishes
            video.addEventListener('ended', () => {
                 loadingBar.style.animation = 'none';
                 loadingBar.classList.remove('running');
                 loadingBar.style.width = '0%';
            });
        });
        
        // Set up manual tab navigation via the buttons
        hiwButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                activateTab(index, false); // Don't autoplay when user clicks a tab button
            });
        });

        // Initialize the first tab on page load
        activateTab(0);
    }
});
