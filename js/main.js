// This script handles general site functionality like the mobile menu and smooth scrolling.

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // --- Tailwind CSS Configuration ---
    // This is kept here to be configured before the rest of the scripts run.
    tailwind.config = {
        theme: {
            extend: {
                colors: {
                    'srs-violet': '#5F00FF',
                    'srs-fuchsia': '#DB00FF',
                    'srs-charcoal-grey': '#333333',
                    'srs-light-grey': '#F5F5F5',
                    'srs-teal': '#00BCD4',
                    'srs-gold': '#FFD700',
                }
            }
        }
    };

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
            // Hide mobile menu after clicking a link
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
});
