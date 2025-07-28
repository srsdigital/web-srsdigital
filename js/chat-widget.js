// Chat Widget Script
document.addEventListener('DOMContentLoaded', () => {
    const chatWidget = document.getElementById('chat-widget');
    const chatButton = document.getElementById('chat-widget-button');

    if (chatButton) {
        chatButton.addEventListener('click', (e) => {
            // Stop propagation to prevent the document click listener from firing immediately
            e.stopPropagation();
            chatWidget.classList.toggle('open');
        });
    }

    // Close when clicking outside the widget
    document.addEventListener('click', (e) => {
        if (chatWidget && !chatWidget.contains(e.target)) {
            chatWidget.classList.remove('open');
        }
    });
});

// Initialize Lucide Icons after the DOM is loaded
lucide.createIcons();