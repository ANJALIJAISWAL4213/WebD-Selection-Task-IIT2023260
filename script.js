document.addEventListener('DOMContentLoaded', () => {
    const accordionContainer = document.getElementById('accordion-container');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const searchBar = document.getElementById('search-bar');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const bookmarksLink = document.getElementById('bookmarks-link');
    const addCategoryButton = document.getElementById('add-category-button');
    const newCategoryTitle = document.getElementById('new-category-title');
    const addQuestionButton = document.getElementById('add-question-button');
    const categorySelect = document.getElementById('category-select');
    const newQuestionTitle = document.getElementById('new-question-title');
    const newQuestionTags = document.getElementById('new-question-tags');
    const newQuestionYtLink = document.getElementById('new-question-yt-link');
    const newQuestionP1Link = document.getElementById('new-question-p1-link');
    const newQuestionP2Link = document.getElementById('new-question-p2-link');

    const API_URL = 'https://test-data-gules.vercel.app/data.json'; // Replace with your actual API URL

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



    document.addEventListener('DOMContentLoaded', () => {
        const swipeContainer = document.getElementById('swipe-container');
        let startX;
    
        swipeContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
    
        swipeContainer.addEventListener('touchmove', (e) => {
            if (!startX) return;
    
            const currentX = e.touches[0].clientX;
            const diffX = startX - currentX;
    
            if (diffX > 50) {
                // Swiped left
                swipeContainer.scrollBy({ left: 200, behavior: 'smooth' });
            } else if (diffX < -50) {
                // Swiped right
                swipeContainer.scrollBy({ left: -200, behavior: 'smooth' });
            }
    
            startX = null;
        });
    });
    



    // Function to create accordion HTML
    function createAccordionItem(categoryTitle, questions) {
        const accordionButton = document.createElement('button');
        accordionButton.className = 'accordion';
        accordionButton.textContent = categoryTitle;

        const panel = document.createElement('div');
        panel.className = 'panel';

        const panelContent = document.createElement('div');
        panelContent.className = 'panel-content';

        questions.forEach(question => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question';
            questionDiv.dataset.id = question.id;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = getQuestionState(question.id);
            checkbox.addEventListener('change', (event) => {
                const isChecked = event.target.checked;
                questionDiv.classList.toggle('checked', isChecked);
                saveQuestionState(question.id, isChecked);
            });

            questionDiv.appendChild(checkbox);

            const title = document.createElement('h4');
            title.textContent = question.title;
            questionDiv.appendChild(title);

            const ytLink = document.createElement('a');
            ytLink.href = question.yt_link;
            ytLink.textContent = 'Watch Video';
            ytLink.target = '_blank';
            questionDiv.appendChild(ytLink);

            if (question.p1_link) {
                const p1Link = document.createElement('a');
                p1Link.href = question.p1_link;
                p1Link.textContent = 'Practice Problem 1';
                p1Link.target = '_blank';
                questionDiv.appendChild(p1Link);
            }

            if (question.p2_link) {
                const p2Link = document.createElement('a');
                p2Link.href = question.p2_link;
                p2Link.textContent = 'Practice Problem 2';
                p2Link.target = '_blank';
                questionDiv.appendChild(p2Link);
            }

            // Bookmark button
            const bookmarkButton = document.createElement('button');
            bookmarkButton.className = 'bookmark-button';
            bookmarkButton.innerHTML = '&#9733;'; // Star icon
            bookmarkButton.classList.toggle('bookmarked', getBookmarkState(question.id));
            bookmarkButton.addEventListener('click', () => {
                const isBookmarked = !bookmarkButton.classList.contains('bookmarked');
                bookmarkButton.classList.toggle('bookmarked', isBookmarked);
                saveBookmarkState(question.id, isBookmarked);
                updateBookmarks();
                updateProgress();
            });

            questionDiv.appendChild(bookmarkButton);
            panelContent.appendChild(questionDiv);
        });

        panel.appendChild(panelContent);
        accordionButton.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        });

        accordionContainer.appendChild(accordionButton);
        accordionContainer.appendChild(panel);
    }

    // Fetch data from API
    function fetchData() {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    localStorage.setItem('data', JSON.stringify(data.data));
                    renderCategoriesAndQuestions(data.data);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function renderCategoriesAndQuestions(data) {
        const categories = {};
        data.forEach(category => {
            categories[category.title] = category.ques;
        });

        // Populate categories dropdown
        categorySelect.innerHTML = '';
        Object.keys(categories).forEach(categoryTitle => {
            const option = document.createElement('option');
            option.value = categoryTitle;
            option.textContent = categoryTitle;
            categorySelect.appendChild(option);
        });

        // Create accordion items
        accordionContainer.innerHTML = '';
        Object.entries(categories).forEach(([categoryTitle, questions]) => {
            createAccordionItem(categoryTitle, questions);
        });

        updateProgress();
    }

    function updateProgress() {
        const allQuestions = document.querySelectorAll('.question');
        const checkedQuestions = document.querySelectorAll('.question.checked');
        const progress = (checkedQuestions.length / allQuestions.length) * 100;
        progressBar.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '% Completed';
    }

    function saveQuestionState(questionId, isChecked) {
        let completedQuestions = JSON.parse(localStorage.getItem('completedQuestions')) || {};
        completedQuestions[questionId] = isChecked;
        localStorage.setItem('completedQuestions', JSON.stringify(completedQuestions));
        updateProgress();
    }

    function getQuestionState(questionId) {
        let completedQuestions = JSON.parse(localStorage.getItem('completedQuestions')) || {};
        return completedQuestions[questionId] || false;
    }

    function saveBookmarkState(questionId, isBookmarked) {
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {};
        if (isBookmarked) {
            bookmarks[questionId] = true;
        } else {
            delete bookmarks[questionId];
        }
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }

    function getBookmarkState(questionId) {
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {};
        return bookmarks[questionId] || false;
    }

    function updateBookmarks() {
        // Functionality for bookmarks link to show bookmarked questions
        bookmarksLink.addEventListener('click', () => {
            const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {};
            const bookmarkedQuestions = Object.keys(bookmarks);
            const allQuestions = document.querySelectorAll('.question');

            allQuestions.forEach(question => {
                const id = question.dataset.id;
                question.classList.toggle('bookmarked', bookmarks[id]);
            });
        });
    }

    // Add category
    addCategoryButton.addEventListener('click', () => {
        const title = newCategoryTitle.value.trim();
        if (title) {
            const data = JSON.parse(localStorage.getItem('data')) || [];
            data.push({ title, ques: [] });
            localStorage.setItem('data', JSON.stringify(data));
            renderCategoriesAndQuestions(data);
            newCategoryTitle.value = '';
        }
    });

    // Add question
    addQuestionButton.addEventListener('click', () => {
        const title = newQuestionTitle.value.trim();
        const tags = newQuestionTags.value.trim();
        const ytLink = newQuestionYtLink.value.trim();
        const p1Link = newQuestionP1Link.value.trim();
        const p2Link = newQuestionP2Link.value.trim();
        const categoryTitle = categorySelect.value;

        if (title && categoryTitle) {
            const data = JSON.parse(localStorage.getItem('data')) || [];
            const category = data.find(cat => cat.title === categoryTitle);

            if (category) {
                category.ques.push({
                    id: new Date().toISOString(),
                    title,
                    tags,
                    yt_link: ytLink,
                    p1_link: p1Link,
                    p2_link: p2Link
                });

                localStorage.setItem('data', JSON.stringify(data));
                renderCategoriesAndQuestions(data);
                newQuestionTitle.value = '';
                newQuestionTags.value = '';
                newQuestionYtLink.value = '';
                newQuestionP1Link.value = '';
                newQuestionP2Link.value = '';
            }
        }
    });

    // Fetch initial data
    fetchData();
});
