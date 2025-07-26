document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const scrollLinks = document.querySelectorAll('.scroll-link');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElement = document.documentElement;
    const bodyElement = document.body; // Reference to the body element

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

    // --- Dynamic Background Gradient on Mouse Move ---
    bodyElement.addEventListener('mousemove', (e) => {
        // Get mouse position relative to the viewport
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calculate percentage for CSS variables
        const percentX = (mouseX / window.innerWidth) * 100;
        const percentY = (mouseY / window.innerHeight) * 100;

        // Update CSS custom properties
        htmlElement.style.setProperty('--mouse-x', `${percentX}%`);
        htmlElement.style.setProperty('--mouse-y', `${percentY}%`);
    });
});

// Enhanced Atmospheric Light Rays + Animated Particles
(function() {
  const canvas = document.getElementById('ambient-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
  let rayCount = 14;
  let rayColors = [
    'rgba(180,200,255,0.13)', // blue
    'rgba(120,180,255,0.11)', // cyan
    'rgba(255,220,180,0.10)', // gold
    'rgba(180,120,255,0.12)', // purple
    'rgba(255,255,220,0.10)', // warm
    'rgba(200,255,255,0.09)', // cool
    'rgba(255,240,200,0.09)'
  ];
  let darkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  function updateDarkMode() {
    darkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  }
  window.addEventListener('storage', updateDarkMode);
  window.addEventListener('DOMContentLoaded', updateDarkMode);
  // Animated floating particles (dust motes)
  const PARTICLE_COUNT = 32;
  let particles = [];
  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let angle = Math.random() * Math.PI * 2;
      let radius = 0.2 + Math.random() * 1.2;
      let speed = 0.1 + Math.random() * 0.25;
      let color = darkMode ? 'rgba(180,220,255,0.18)' : 'rgba(120,180,255,0.13)';
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: radius,
        baseR: radius,
        color,
        phase: Math.random()*Math.PI*2
      });
    }
  }
  createParticles();
  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  function animate(t) {
    updateDarkMode();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Light rays
    let cx = mouse.x;
    let cy = mouse.y;
    let baseAngle = Math.PI/2;
    let spread = Math.PI/1.3;
    for (let i = 0; i < rayCount; i++) {
      let angle = baseAngle + (i - (rayCount-1)/2) * (spread/(rayCount-1));
      let wave = Math.sin(t/1200 + i*0.7) * 0.18 + Math.cos(t/1800 + i) * 0.09;
      let a = angle + wave + (mouse.x-canvas.width/2)/canvas.width*0.5;
      let len = canvas.height * (1.1 + 0.08*Math.sin(t/2000+i));
      let endX = cx + Math.cos(a) * len;
      let endY = cy + Math.sin(a) * len;
      let grad = ctx.createLinearGradient(cx, cy, endX, endY);
      let col = rayColors[i%rayColors.length];
      if (darkMode) {
        col = col.replace('0.1', '0.18').replace('0.09', '0.15').replace('0.11', '0.16').replace('0.12', '0.18').replace('0.13', '0.19');
      }
      grad.addColorStop(0, col);
      grad.addColorStop(0.18, col.replace(/0\.[0-9]+\)/, '0.22)'));
      grad.addColorStop(0.7, 'rgba(255,255,255,0.01)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(endX + 120, endY + 120);
      ctx.lineTo(endX - 120, endY - 120);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.filter = 'blur(3.5px)';
      ctx.fill();
      ctx.restore();
    }
    // Animated particles
    for (let p of particles) {
      // Particle attraction to cursor
      let dx = mouse.x - p.x;
      let dy = mouse.y - p.y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      let attract = Math.max(0, 1 - dist/400);
      p.vx += dx * 0.00008 * attract;
      p.vy += dy * 0.00008 * attract;
      p.x += p.vx;
      p.y += p.vy;
      // Gentle shimmer
      p.r = p.baseR + Math.sin(t/700 + p.phase) * 0.5;
      // Wrap around
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.shadowColor = darkMode ? 'rgba(120,200,255,0.25)' : 'rgba(180,200,255,0.18)';
      ctx.shadowBlur = 16;
      ctx.globalAlpha = 0.7 + 0.3*Math.sin(t/900 + p.phase);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();
    }
    // Subtle vignette
    let vignette = ctx.createRadialGradient(
      canvas.width/2, canvas.height/2, Math.min(canvas.width,canvas.height)*0.3,
      canvas.width/2, canvas.height/2, Math.max(canvas.width,canvas.height)*0.7
    );
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, darkMode ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0.18)');
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = vignette;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.restore();
    requestAnimationFrame(animate);
  }
  animate(0);
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => {
    mouse.x = window.innerWidth/2;
    mouse.y = window.innerHeight/2;
  });
  // Recreate particles on theme change
  const observer = new MutationObserver(() => {
    updateDarkMode();
    createParticles();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();
