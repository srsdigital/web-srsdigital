/**
 * Theme Switcher
 *
 * Handles toggling between light and dark themes, persisting the choice
 * in localStorage, and updating theme-dependent assets like logos.
 */
document.addEventListener('DOMContentLoaded', () => {
  // --- 1. GET DOM ELEMENTS ---
  const themeToggleButton = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  const sunIcon = document.querySelector('.theme-icon-light');
  const moonIcon = document.querySelector('.theme-icon-dark');
  const headerLogo = document.getElementById('header-logo');
  const footerLogo = document.getElementById('footer-logo');
  const srsLogo = document.getElementById('srs-logo');

  // --- 2. DEFINE LOGO PATHS ---
  const logoPaths = {
    light: {
      header: '../images/klaimr-logo-dark.png',
      footer: '../images/klaimr-logo-light.png',
      srs: '../images/Logo_SRS_wobg.webp'
    },
    dark: {
      header: '../images/klaimr-logo-light.png',
      footer: '../images/klaimr-logo-dark.png',
      srs: '../images/Logo_SRS_wobg.webp'
    }
  };
  
  // --- 3. UTILITY FUNCTIONS ---

  /**
   * Applies the specified theme to the page.
   * @param {string} theme - The theme to apply ('light' or 'dark').
   */
  const applyTheme = (theme) => {
    // Set the data-theme attribute on the <html> element
    htmlElement.setAttribute('data-theme', theme);

    // Update icon visibility
    if (sunIcon && moonIcon) {
        sunIcon.classList.toggle('hidden', theme === 'dark');
        moonIcon.classList.toggle('hidden', theme === 'light');
    }

    // Update logos if they exist
    if (headerLogo) {
        headerLogo.src = logoPaths[theme].header;
    }
    if (footerLogo) {
        footerLogo.src = logoPaths[theme].footer;
    }
    if (srsLogo) {
        srsLogo.src = logoPaths[theme].srs;
    }
    
    // Store the preference
    localStorage.setItem('theme', theme);
  };

  // --- 4. INITIALIZATION ---

  // Get the stored theme or default to 'light'
  const storedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(storedTheme);

  // --- 5. EVENT LISTENER ---
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
      // Determine the new theme by checking the current one
      const newTheme = htmlElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      
      // Apply the new theme
      applyTheme(newTheme);

      // Optional: Track the event if analytics is set up
      if (typeof trackEvent === 'function') {
        trackEvent('Theme Changed', { theme: newTheme });
      }
    });
  }
});
