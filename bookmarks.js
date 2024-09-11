document.addEventListener('DOMContentLoaded', () => {
    const bookmarkedContainer = document.getElementById('bookmarked-container');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const backLink = document.getElementById('back-link');

    // Check for saved dark mode preference
    if (localStorage.getItem('dark-mode') === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️ Light Mode';
    }

    // Toggle dark mode
    darkModeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            darkModeToggle.textContent = '🌙 Dark Mode';
            localStorage.setItem('dark-mode', 'disabled');
        } else {
            body.classList.add('dark-mode');
            darkModeToggle.textContent = '☀️ Light Mode';
            localStorage.setItem('dark-mode', 'enabled');
        }
    });

    // Load and display bookmarked questions
    function loadBookmarks() {
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {};
        Object.keys(bookmarks).forEach(questionId => {
            const questionTitle = bookmarks[questionId];

            const questionDiv = document.createElement('div');
            questionDiv.className = 'question';

            const title = document.createElement('h4');
            title.textContent = questionTitle;

            questionDiv.appendChild(title);
            bookmarkedContainer.appendChild(questionDiv);
        });

        if (bookmarkedContainer.children.length === 0) {
            const noBookmarks = document.createElement('p');
            noBookmarks.textContent = 'No bookmarked questions.';
            bookmarkedContainer.appendChild(noBookmarks);
        }
    }

    loadBookmarks();
});
