// This script handles all the language switching logic.

document.addEventListener('DOMContentLoaded', () => {
    const langSwitcher = document.getElementById('lang-switcher');
    const langSwitcherMobile = document.getElementById('lang-switcher-mobile');
    let allTranslations = {};

    // Fetches the translation file for the given language
    async function fetchTranslations(lang) {
        try {
            // Use an absolute path from the site's root.
            // This requires running on a server (like VS Code's Live Server)
            // and assumes the `locales` folder is at the root.
            const response = await fetch(`/locales/${lang}/translation.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Could not fetch translations. Make sure you are running this on a local server.", error);
            return {}; // Return empty object on error
        }
    }

    // Updates the UI of a single toggle switch
    const updateSwitchUI = (switcherContainer, lang) => {
        if (!switcherContainer) return;

        const slider = switcherContainer.querySelector('.toggle-slider');
        const enOption = switcherContainer.querySelector('[data-lang="en"]');
        const idOption = switcherContainer.querySelector('[data-lang="id"]');

        if (!slider || !enOption || !idOption) return;

        enOption.classList.remove('active');
        idOption.classList.remove('active');

        if (lang === 'id') {
            slider.style.transform = 'translateX(100%)';
            idOption.classList.add('active');
        } else {
            slider.style.transform = 'translateX(0%)';
            enOption.classList.add('active');
        }
    };

    // Sets the language for the page
    const setLanguage = async (lang) => {
        // Save the selected language to localStorage to persist across pages
        localStorage.setItem('preferredLanguage', lang);

        allTranslations = await fetchTranslations(lang);
        
        const pageKey = document.body.dataset.page || 'srsdigital';
        const pageTranslations = allTranslations[pageKey];

        // Dynamically update the year in the footer copyright
        if (pageTranslations && pageTranslations.footer_copyright) {
            const currentYear = new Date().getFullYear();
            pageTranslations.footer_copyright = pageTranslations.footer_copyright.replace(/2025/g, currentYear);
        }

        if (!pageTranslations) {
            console.error(`No translations found for "${pageKey}" page.`);
            return;
        }

        document.documentElement.lang = lang;
        
        document.querySelectorAll('[data-key]').forEach(elem => {
            const key = elem.getAttribute('data-key');
            if (pageTranslations[key] !== undefined) {
                if (elem.tagName.toLowerCase() === 'title') {
                    elem.textContent = pageTranslations[key];
                } else {
                    elem.innerHTML = pageTranslations[key];
                }
            }
        });

        // Update UI for all available switchers
        updateSwitchUI(langSwitcher, lang);
        updateSwitchUI(langSwitcherMobile, lang);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    // Toggles the language between English and Indonesian
    const toggleLanguage = () => {
        const currentLang = localStorage.getItem('preferredLanguage') || document.documentElement.lang;
        const newLang = currentLang === 'en' ? 'id' : 'en';
        setLanguage(newLang);
    };

    // Add event listeners only if the language switchers exist
    if (langSwitcher) {
        langSwitcher.addEventListener('click', toggleLanguage);
    }
    if (langSwitcherMobile) {
        langSwitcherMobile.addEventListener('click', toggleLanguage);
    }

    // --- Initial Language Detection ---
    // 1. Check localStorage for a saved preference.
    const savedLang = localStorage.getItem('preferredLanguage');
    // 2. If not found, fall back to browser's language.
    const userLang = navigator.language || navigator.userLanguage;
    // 3. Determine the final initial language.
    const initialLang = savedLang || (userLang.startsWith('id') ? 'id' : 'en');
    
    setLanguage(initialLang);
});
