
document.addEventListener('DOMContentLoaded', function() {
    // Cursor and Particle Interaction
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update particle interactions
        updateParticleInteraction();
    });

    function updateParticleInteraction() {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            const rect = particle.getBoundingClientRect();
            const particleX = rect.left + rect.width / 2;
            const particleY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(mouseX - particleX, 2) + Math.pow(mouseY - particleY, 2)
            );
            
            if (distance < 150) {
                particle.classList.add('cursor-near');
                const force = (150 - distance) / 150;
                const angle = Math.atan2(particleY - mouseY, particleX - mouseX);
                const moveX = Math.cos(angle) * force * 20;
                const moveY = Math.sin(angle) * force * 20;
                
                particle.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + force * 0.5})`;
            } else {
                particle.classList.remove('cursor-near');
                particle.style.transform = '';
            }
        });
    }

    // Magnetic effect for buttons
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0px, 0px)';
        });
    });

    // Create particles
    function createParticles() {
        const particleContainer = document.querySelector('.particle-container');
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            particleContainer.appendChild(particle);
        }
    }
    createParticles();

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a, .btn[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Navigation scroll effect
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Active nav link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Special handling for reveal text
                if (entry.target.classList.contains('reveal-text')) {
                    entry.target.classList.add('revealed');
                }
                
                // Progress bar animation
                if (entry.target.classList.contains('skill-category')) {
                    const progressBars = entry.target.querySelectorAll('.progress-fill');
                    setTimeout(() => {
                        progressBars.forEach(bar => {
                            const width = bar.getAttribute('data-width');
                            bar.style.width = width + '%';
                        });
                    }, 300);
                }
                
                // Counter animation for stats
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up, .reveal-text, .skill-category, .stat-number');
    animatedElements.forEach(el => observer.observe(el));

    // Counter animation
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + '+';
        }, 16);
    }

    // Typing effect for hero text
    const heroName = document.querySelector('.typing-effect');
    if (heroName) {
        const text = "I'm Preetham";
        let index = 0;
        
        function typeWriter() {
            if (index < text.length) {
                heroName.textContent = text.slice(0, index + 1);
                index++;
                setTimeout(typeWriter, 150);
            } else {
                setTimeout(() => {
                    heroName.classList.remove('typing-effect');
                }, 1000);
            }
        }
        
        setTimeout(typeWriter, 1500);
    }

    // Parallax effect
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image');
        const parallaxElements = document.querySelectorAll('.floating');
        
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Interactive hover effects for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });

    // Tilt effect for service items and hobby cards
    const tiltElements = document.querySelectorAll('.hover-tilt');
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    });

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show success message (you can integrate with a real form service)
            const button = contactForm.querySelector('button');
            const originalText = button.textContent;
            
            button.textContent = 'Sending...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = 'Message Sent!';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    contactForm.reset();
                }, 2000);
            }, 1000);
        });
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
    }

    // Glitch effect trigger on click
    const glitchElement = document.querySelector('.glitch');
    if (glitchElement) {
        glitchElement.addEventListener('click', () => {
            glitchElement.style.animation = 'none';
            setTimeout(() => {
                glitchElement.style.animation = 'glitch 2s infinite';
            }, 10);
        });
    }

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Scroll-triggered animations for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        observer.observe(item);
        
        // Add staggered animation delay
        item.style.animationDelay = `${index * 0.2}s`;
    });

    // Skill tag hover effects
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            skillTags.forEach(otherTag => {
                if (otherTag !== tag) {
                    otherTag.style.opacity = '0.5';
                    otherTag.style.transform = 'scale(0.9)';
                }
            });
        });
        
        tag.addEventListener('mouseleave', () => {
            skillTags.forEach(otherTag => {
                otherTag.style.opacity = '1';
                otherTag.style.transform = 'scale(1)';
            });
        });
    });

    // Dynamic background color based on scroll position
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const scrollProgress = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
        
        // Create a subtle color shift based on scroll
        const hue = Math.floor(scrollProgress * 60); // 0 to 60 degrees
        document.documentElement.style.setProperty('--bg-primary', `hsl(${hue}, 5%, 4%)`);
    });

    // Lazy loading for images
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    images.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });

    // Performance optimization: Throttle scroll events
    let scrollTimeout;
    function throttleScroll(func, limit) {
        if (!scrollTimeout) {
            func();
            scrollTimeout = setTimeout(() => {
                scrollTimeout = null;
            }, limit);
        }
    }

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Trigger initial animations
        setTimeout(() => {
            const initialElements = document.querySelectorAll('.hero .slide-in-left, .hero .slide-in-right, .hero .fade-in-up');
            initialElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animate');
                }, index * 100);
            });
        }, 500);
        
        // Load existing ratings
        loadRatings();
    });

    // Rating and Review System
    let currentRating = 0;
    const starRating = document.getElementById('star-rating');
    const ratingText = document.getElementById('rating-text');
    const submitButton = document.getElementById('submit-rating');
    const reviewerName = document.getElementById('reviewer-name');
    const reviewComment = document.getElementById('review-comment');

    // Star rating interaction
    if (starRating) {
        const stars = starRating.querySelectorAll('.fas.fa-star');
        
        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', () => {
                highlightStars(index + 1);
            });
            
            star.addEventListener('click', () => {
                currentRating = index + 1;
                selectStars(currentRating);
                updateRatingText();
                updateSubmitButton();
            });
        });
        
        starRating.addEventListener('mouseleave', () => {
            selectStars(currentRating);
        });
    }

    function highlightStars(rating) {
        const stars = starRating.querySelectorAll('.fas.fa-star');
        stars.forEach((star, index) => {
            star.classList.toggle('hover', index < rating);
        });
    }

    function selectStars(rating) {
        const stars = starRating.querySelectorAll('.fas.fa-star');
        stars.forEach((star, index) => {
            star.classList.toggle('selected', index < rating);
            star.classList.remove('hover');
        });
    }

    function updateRatingText() {
        const ratingLabels = {
            1: "Poor - Needs significant improvement",
            2: "Fair - Below average",
            3: "Good - Satisfactory",
            4: "Very Good - Above average",
            5: "Excellent - Outstanding!"
        };
        
        if (currentRating > 0) {
            ratingText.textContent = `${currentRating}/5 - ${ratingLabels[currentRating]}`;
            ratingText.style.color = 'var(--accent-orange)';
        } else {
            ratingText.textContent = "Click a star to rate!";
            ratingText.style.color = 'var(--text-secondary)';
        }
    }

    function updateSubmitButton() {
        if (submitButton) {
            submitButton.disabled = currentRating === 0;
        }
    }

    // Submit rating
    if (submitButton) {
        submitButton.addEventListener('click', () => {
            if (currentRating > 0) {
                const rating = {
                    rating: currentRating,
                    name: reviewerName.value.trim() || 'Anonymous',
                    comment: reviewComment.value.trim(),
                    date: new Date().toISOString()
                };
                
                saveRating(rating);
                displayRating(rating);
                updateOverallRating();
                resetForm();
                
                // Show success message
                showSuccessMessage();
            }
        });
    }

    function saveRating(rating) {
        let ratings = JSON.parse(localStorage.getItem('portfolioRatings') || '[]');
        ratings.unshift(rating); // Add to beginning
        localStorage.setItem('portfolioRatings', JSON.stringify(ratings));
    }

    function loadRatings() {
        const ratings = JSON.parse(localStorage.getItem('portfolioRatings') || '[]');
        const reviewsList = document.getElementById('reviews-list');
        const noReviews = document.getElementById('no-reviews');
        
        if (ratings.length > 0) {
            noReviews.style.display = 'none';
            ratings.forEach(rating => displayRating(rating, false));
            updateOverallRating();
        }
    }

    function displayRating(rating, animate = true) {
        const reviewsList = document.getElementById('reviews-list');
        const noReviews = document.getElementById('no-reviews');
        
        if (noReviews) noReviews.style.display = 'none';
        
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        if (animate) {
            reviewItem.style.opacity = '0';
            reviewItem.style.transform = 'translateY(20px)';
        }
        
        const date = new Date(rating.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const stars = Array(5).fill(0).map((_, i) => 
            `<i class="fas fa-star${i < rating.rating ? ' active' : ''}"></i>`
        ).join('');
        
        reviewItem.innerHTML = `
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-name">${rating.name}</div>
                    <div class="review-date">${date}</div>
                </div>
                <div class="review-stars">${stars}</div>
            </div>
            ${rating.comment ? `<div class="review-comment">${rating.comment}</div>` : ''}
        `;
        
        reviewsList.insertBefore(reviewItem, reviewsList.firstChild);
        
        if (animate) {
            setTimeout(() => {
                reviewItem.style.transition = 'all 0.5s ease';
                reviewItem.style.opacity = '1';
                reviewItem.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    function updateOverallRating() {
        const ratings = JSON.parse(localStorage.getItem('portfolioRatings') || '[]');
        const overallRatingElement = document.getElementById('overall-rating');
        const overallStars = document.getElementById('overall-stars');
        const ratingCount = document.getElementById('rating-count');
        
        if (ratings.length > 0) {
            const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
            const roundedAverage = Math.round(average * 10) / 10;
            
            overallRatingElement.textContent = roundedAverage.toFixed(1);
            ratingCount.textContent = `${ratings.length} rating${ratings.length !== 1 ? 's' : ''}`;
            
            // Update visual stars
            const stars = overallStars.querySelectorAll('.fas.fa-star');
            stars.forEach((star, index) => {
                star.classList.toggle('active', index < Math.round(average));
            });
        }
    }

    function resetForm() {
        currentRating = 0;
        selectStars(0);
        updateRatingText();
        reviewerName.value = '';
        reviewComment.value = '';
        updateSubmitButton();
    }

    function showSuccessMessage() {
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Thank you! ✓';
        submitButton.style.background = 'var(--gradient-secondary)';
        
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.background = '';
        }, 2000);
    }
});

// Gallery functionality
const galleryData = {
    photography: {
        title: 'Photography Gallery',
        images: [
            {
                src: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=200&h=150&fit=crop',
                alt: 'Landscape Photography'
            },
            {
                src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop',
                alt: 'Mountain Photography'
            },
            {
                src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=150&fit=crop',
                alt: 'Forest Photography'
            },
            {
                src: 'https://images.unsplash.com/photo-1506194093974-e86101b9c05e?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1506194093974-e86101b9c05e?w=200&h=150&fit=crop',
                alt: 'Sunset Photography'
            }
        ]
    },
    music: {
        title: 'Music Gallery',
        images: [
            {
                src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=150&fit=crop',
                alt: 'Guitar Playing'
            },
            {
                src: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=150&fit=crop',
                alt: 'Music Studio'
            },
            {
                src: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=200&h=150&fit=crop',
                alt: 'Recording Session'
            },
            {
                src: 'https://images.unsplash.com/photo-1520166012956-add9ba0835cb?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1520166012956-add9ba0835cb?w=200&h=150&fit=crop',
                alt: 'Concert Performance'
            }
        ]
    },
    running: {
        title: 'Running Gallery',
        images: [
            {
                src: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=200&h=150&fit=crop',
                alt: 'Running Trail'
            },
            {
                src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop',
                alt: 'Marathon Running'
            },
            {
                src: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=200&h=150&fit=crop',
                alt: 'Running Gear'
            },
            {
                src: 'https://images.unsplash.com/photo-1502904550040-7534597429ae?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1502904550040-7534597429ae?w=200&h=150&fit=crop',
                alt: 'Beach Running'
            }
        ]
    },
    reading: {
        title: 'Reading Gallery',
        images: [
            {
                src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop',
                alt: 'Reading Books'
            },
            {
                src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=150&fit=crop',
                alt: 'Library'
            },
            {
                src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=200&h=150&fit=crop',
                alt: 'Tech Books'
            },
            {
                src: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=150&fit=crop',
                alt: 'Coffee & Books'
            }
        ]
    },
    gaming: {
        title: 'Gaming Gallery',
        images: [
            {
                src: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=150&fit=crop',
                alt: 'Gaming Setup'
            },
            {
                src: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=200&h=150&fit=crop',
                alt: 'Gaming Controller'
            },
            {
                src: 'https://images.unsplash.com/photo-1605902711834-8b11c3e0c1ad?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1605902711834-8b11c3e0c1ad?w=200&h=150&fit=crop',
                alt: 'Gaming Environment'
            },
            {
                src: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=200&h=150&fit=crop',
                alt: 'Competitive Gaming'
            }
        ]
    },
    travel: {
        title: 'Travel Gallery',
        images: [
            {
                src: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=150&fit=crop',
                alt: 'Travel Adventure'
            },
            {
                src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=150&fit=crop',
                alt: 'Beach Travel'
            },
            {
                src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=200&h=150&fit=crop',
                alt: 'Mountain Travel'
            },
            {
                src: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=200&h=150&fit=crop',
                alt: 'City Travel'
            }
        ]
    }
};

let currentGallery = '';
let currentImageIndex = 0;

function openGallery(hobbyType) {
    const modal = document.getElementById('gallery-modal');
    const title = document.getElementById('gallery-title');
    const mainImage = document.getElementById('gallery-main-image');
    const thumbnailsContainer = document.getElementById('gallery-thumbnails');
    
    currentGallery = hobbyType;
    currentImageIndex = 0;
    
    const gallery = galleryData[hobbyType];
    title.textContent = gallery.title;
    
    // Set main image
    mainImage.src = gallery.images[0].src;
    mainImage.alt = gallery.images[0].alt;
    
    // Create thumbnails
    thumbnailsContainer.innerHTML = '';
    gallery.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `gallery-thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.onclick = () => selectImage(index);
        
        const img = document.createElement('img');
        img.src = image.thumb;
        img.alt = image.alt;
        
        thumbnail.appendChild(img);
        thumbnailsContainer.appendChild(thumbnail);
    });
    
    // Show modal with animation
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeGallery() {
    const modal = document.getElementById('gallery-modal');
    
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

function selectImage(index) {
    const gallery = galleryData[currentGallery];
    const mainImage = document.getElementById('gallery-main-image');
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');
    
    currentImageIndex = index;
    
    // Fade out current image
    mainImage.style.opacity = '0';
    
    setTimeout(() => {
        mainImage.src = gallery.images[index].src;
        mainImage.alt = gallery.images[index].alt;
        mainImage.style.opacity = '1';
    }, 150);
    
    // Update active thumbnail
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function nextImage() {
    const gallery = galleryData[currentGallery];
    const nextIndex = (currentImageIndex + 1) % gallery.images.length;
    selectImage(nextIndex);
}

function previousImage() {
    const gallery = galleryData[currentGallery];
    const prevIndex = (currentImageIndex - 1 + gallery.images.length) % gallery.images.length;
    selectImage(prevIndex);
}

// Keyboard navigation for gallery
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('gallery-modal');
    if (modal.classList.contains('active')) {
        switch(e.key) {
            case 'Escape':
                closeGallery();
                break;
            case 'ArrowRight':
                nextImage();
                break;
            case 'ArrowLeft':
                previousImage();
                break;
        }
    }
});

// Close gallery when clicking outside
document.getElementById('gallery-modal').addEventListener('click', (e) => {
    if (e.target.id === 'gallery-modal') {
        closeGallery();
    }
});
// Certification Gallery Data
const certificationGalleryData = {
    'aws-solutions-architect': {
        title: 'AWS Solutions Architect Associate',
        images: [
            {
                src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=150&fit=crop',
                alt: 'AWS Certificate'
            },
            {
                src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=150&fit=crop',
                alt: 'AWS Badge'
            },
            {
                src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&h=150&fit=crop',
                alt: 'Certificate Document'
            }
        ]
    },
    'react-advanced': {
        title: 'React Advanced Developer',
        images: [
            {
                src: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=150&fit=crop',
                alt: 'React Certificate'
            },
            {
                src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=150&fit=crop',
                alt: 'React Badge'
            },
            {
                src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=150&fit=crop',
                alt: 'Achievement Badge'
            }
        ]
    },
    'nodejs-professional': {
        title: 'Node.js Professional Developer',
        images: [
            {
                src: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=200&h=150&fit=crop',
                alt: 'Node.js Certificate'
            },
            {
                src: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&h=150&fit=crop',
                alt: 'Professional Badge'
            },
            {
                src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=150&fit=crop',
                alt: 'Certification Document'
            }
        ]
    },
    'fullstack-web': {
        title: 'Full Stack Web Development',
        images: [
            {
                src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=150&fit=crop',
                alt: 'Full Stack Certificate'
            },
            {
                src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=150&fit=crop',
                alt: 'Web Development Badge'
            },
            {
                src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&h=150&fit=crop',
                alt: 'Achievement Certificate'
            }
        ]
    },
    'docker-kubernetes': {
        title: 'Docker & Kubernetes Certified',
        images: [
            {
                src: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=200&h=150&fit=crop',
                alt: 'Docker Certificate'
            },
            {
                src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=150&fit=crop',
                alt: 'Kubernetes Badge'
            },
            {
                src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=150&fit=crop',
                alt: 'Container Technology Certificate'
            }
        ]
    },
    'mongodb-developer': {
        title: 'MongoDB Certified Developer',
        images: [
            {
                src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&h=150&fit=crop',
                alt: 'MongoDB Certificate'
            },
            {
                src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=150&fit=crop',
                alt: 'Database Developer Badge'
            },
            {
                src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
                thumb: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=150&fit=crop',
                alt: 'Professional Certification'
            }
        ]
    }
};


// Add CSS for animations that couldn't be included in the main CSS
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .loaded {
        opacity: 1;
        transition: opacity 0.5s ease;
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--bg-primary);
            padding: 2rem;
            border-top: 1px solid var(--border-color);
        }
    }
`;
document.head.appendChild(additionalStyles);
function nextImage() {
    if (currentGallery in certificationGalleryData) {
        nextCertificationImage();
    } else {
        const gallery = galleryData[currentGallery];
        const nextIndex = (currentImageIndex + 1) % gallery.images.length;
        selectImage(nextIndex);
    }
}

function previousImage() {
    if (currentGallery in certificationGalleryData) {
        previousCertificationImage();
    } else {
        const gallery = galleryData[currentGallery];
        const prevIndex = (currentImageIndex - 1 + gallery.images.length) % gallery.images.length;
        selectImage(prevIndex);
    }
}

// Keyboard navigation for gallery
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('gallery-modal');
    if (modal.classList.contains('active')) {
        switch(e.key) {
            case 'Escape':
                closeGallery();
                break;
            case 'ArrowRight':
                nextImage();
                break;
            case 'ArrowLeft':
                previousImage();
                break;
        }
    }
});

// Close gallery when clicking outside
document.getElementById('gallery-modal').addEventListener('click', (e) => {
    if (e.target.id === 'gallery-modal') {
        closeGallery();
    }
});

// Certification Gallery Functions
function openCertificationGallery(certificationType) {
    const modal = document.getElementById('gallery-modal');
    const title = document.getElementById('gallery-title');
    const mainImage = document.getElementById('gallery-main-image');
    const thumbnailsContainer = document.getElementById('gallery-thumbnails');
    
    currentGallery = certificationType;
    currentImageIndex = 0;
    
    const gallery = certificationGalleryData[certificationType];
    title.textContent = gallery.title;
    
    // Set main image
    mainImage.src = gallery.images[0].src;
    mainImage.alt = gallery.images[0].alt;
    
    // Create thumbnails
    thumbnailsContainer.innerHTML = '';
    gallery.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `gallery-thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.onclick = () => selectCertificationImage(index);
        
        const img = document.createElement('img');
        img.src = image.thumb;
        img.alt = image.alt;
        
        thumbnail.appendChild(img);
        thumbnailsContainer.appendChild(thumbnail);
    });
    
    // Show modal with animation
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function selectCertificationImage(index) {
    const gallery = certificationGalleryData[currentGallery];
    const mainImage = document.getElementById('gallery-main-image');
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');
    
    currentImageIndex = index;
    
    // Fade out current image
    mainImage.style.opacity = '0';
    
    setTimeout(() => {
        mainImage.src = gallery.images[index].src;
        mainImage.alt = gallery.images[index].alt;
        mainImage.style.opacity = '1';
    }, 150);
    
    // Update active thumbnail
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function nextCertificationImage() {
    const gallery = certificationGalleryData[currentGallery];
    const nextIndex = (currentImageIndex + 1) % gallery.images.length;
    selectCertificationImage(nextIndex);
}

function previousCertificationImage() {
    const gallery = certificationGalleryData[currentGallery];
    const prevIndex = (currentImageIndex - 1 + gallery.images.length) % gallery.images.length;
    selectCertificationImage(prevIndex);
}

// Update keyboard navigation to work with certifications
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('gallery-modal');
    if (modal.classList.contains('active')) {
        switch(e.key) {
            case 'Escape':
                closeGallery();
                break;
            case 'ArrowRight':
                if (currentGallery in certificationGalleryData) {
                    nextCertificationImage();
                } else {
                    nextImage();
                }
                break;
            case 'ArrowLeft':
                if (currentGallery in certificationGalleryData) {
                    previousCertificationImage();
                } else {
                    previousImage();
                }
                break;
        }
    }
});
