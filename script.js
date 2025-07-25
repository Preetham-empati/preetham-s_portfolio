document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const scrollLinks = document.querySelectorAll('.scroll-link');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElement = document.documentElement;

    // --- Theme Toggle ---
    // Set currentTheme to 'dark' by default
    const currentTheme = localStorage.getItem('theme') || 'dark'; // Changed default to 'dark'
    htmlElement.setAttribute('data-theme', currentTheme);
    themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'; // Initial icon based on default theme

    themeToggleBtn.addEventListener('click', () => {
        let theme = htmlElement.getAttribute('data-theme');
        if (theme === 'light') {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.className = 'fas fa-sun';
        } else {
            htmlElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.className = 'fas fa-moon';
        }
    });

    // --- Smooth Scrolling for all internal links ---
    function smoothScrollTo(targetId) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            window.scrollTo({
                top: targetSection.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        }
    }

    // Function to activate section and update nav link
    function activateSection(id) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check for the updated "about-me" ID
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }

    // --- Intersection Observer for Scroll Reveal & Nav Link Highlighting ---
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40% 0px', // When 40% of the section is visible
        threshold: 0.1 // When 10% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active'); // General section reveal
                activateSection(entry.target.id); // Highlight nav link

                // Specific animations for elements inside sections
                if (entry.target.id === 'skills') {
                    // Animate skill-items with progress bars
                    const skillItems = entry.target.querySelectorAll('.skill-item');
                    skillItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('revealed');
                            const progress = item.querySelector('.progress');
                            if (progress) { // Check if progress element exists
                                progress.style.width = item.dataset.progress + '%';
                            }
                        }, index * 150); // Staggered animation
                    });
                } else if (entry.target.id === 'education' || entry.target.id === 'experience' || entry.target.id === 'volunteering') {
                    const timelineItems = entry.target.querySelectorAll('.timeline-item');
                    timelineItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('revealed');
                        }, index * 150);
                    });
                } else if (entry.target.id === 'projects') {
                    const projectCards = entry.target.querySelectorAll('.project-card');
                    projectCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('revealed');
                        }, index * 100);
                    });
                } else if (entry.target.id === 'hobbies') {
                    const hobbyItems = entry.target.querySelectorAll('.hobby-item');
                    hobbyItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('revealed');
                        }, index * 100);
                    });
                }
            } else {
                // Optional: remove 'active' class when out of view, to re-trigger animation on scroll back
                // entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Scroll to Top Button ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) { // Show after scrolling 400px
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Event listeners for all scroll-to-section links ---
    document.querySelectorAll('.scroll-link, .nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            smoothScrollTo(targetId);
        });
    });

    // --- Rating System ---
    const submitRatingBtn = document.getElementById('submitRatingBtn');
    const ratingMessage = document.getElementById('ratingMessage');
    const starInputs = document.querySelectorAll('.star-rating input[type="radio"]');

    submitRatingBtn.addEventListener('click', () => {
        let selectedRating = 0;
        for (const input of starInputs) {
            if (input.checked) {
                selectedRating = input.value;
                break;
            }
        }

        if (selectedRating > 0) {
            ratingMessage.textContent = `Thank you for rating ${selectedRating} stars! Your feedback is valuable.`;
            ratingMessage.style.color = 'var(--primary-color)';
            // In a real application, you would send this rating to a server
            // console.log(`User rated: ${selectedRating} stars`);

            // Optionally clear the selection after submission
            starInputs.forEach(input => input.checked = false);
        } else {
            ratingMessage.textContent = 'Please select a star rating.';
            ratingMessage.style.color = 'red';
        }
    });

    // --- Comment Section (Client-Side Only) ---
    const submitCommentBtn = document.getElementById('submitCommentBtn');
    const commentNameInput = document.getElementById('commentName');
    const commentTextInput = document.getElementById('commentText');
    const commentsList = document.getElementById('commentsList');
    const noCommentsMessage = document.getElementById('noCommentsMessage');
    const commentMessage = document.getElementById('commentMessage');

    submitCommentBtn.addEventListener('click', () => {
        const name = commentNameInput.value.trim() || 'Anonymous';
        const comment = commentTextInput.value.trim();
        const now = new Date();
        const dateString = now.getFullYear() + '-' +
                           ('0' + (now.getMonth() + 1)).slice(-2) + '-' +
                           ('0' + now.getDate()).slice(-2); // YYYY-MM-DD

        if (comment) {
            const newCommentItem = document.createElement('div');
            newCommentItem.classList.add('comment-item');
            newCommentItem.innerHTML = `
                <strong>${name}</strong> - <small>${dateString}</small>
                <p>${comment}</p>
            `;
            commentsList.prepend(newCommentItem); // Add new comment to the top

            commentNameInput.value = ''; // Clear form
            commentTextInput.value = '';
            commentMessage.textContent = 'Your comment has been posted (for this session).';
            commentMessage.style.color = 'var(--primary-color)';
            noCommentsMessage.style.display = 'none'; // Hide "No comments yet" if visible
        } else {
            commentMessage.textContent = 'Please enter a comment before submitting.';
            commentMessage.style.color = 'red';
        }
    });

    // Hide no comments message if there are already comments
    if (commentsList.children.length > 1) { // >1 because noCommentsMessage is a child
        noCommentsMessage.style.display = 'none';
    } else {
        noCommentsMessage.style.display = 'block';
    }


    // Initial activation for the 'about-me' section on load
    const initialSection = document.getElementById('about-me');
    if (initialSection) {
        initialSection.classList.add('active');
        activateSection('about-me');
    }

    // --- Image Slider Functionality ---
    const makingArtsHobby = document.getElementById('makingArtsHobby');
    const imageSliderModal = document.getElementById('imageSliderModal');
    const closeModalButton = document.querySelector('.modal .close-button');
    const sliderImages = document.querySelectorAll('.slider-image');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    let currentImageIndex = 0;

    function showImage(index) {
        sliderImages.forEach((img, i) => {
            img.style.display = (i === index) ? 'block' : 'none';
        });
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % sliderImages.length;
        showImage(currentImageIndex);
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + sliderImages.length) % sliderImages.length;
        showImage(currentImageIndex);
    }

    if (makingArtsHobby) {
        makingArtsHobby.addEventListener('click', () => {
            imageSliderModal.style.display = 'flex'; // Use flex to center
            currentImageIndex = 0; // Reset to first image
            showImage(currentImageIndex);
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            imageSliderModal.style.display = 'none';
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', prevImage);
    }

    if (nextButton) {
        nextButton.addEventListener('click', nextImage);
    }

    // Close modal when clicking outside the content
    window.addEventListener('click', (event) => {
        if (event.target === imageSliderModal) {
            imageSliderModal.style.display = 'none';
        }
    });
});