// Force Page to Scroll to Top on Load / Refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('load', function() {
    setTimeout(function() {
        window.scrollTo(0, 0);
    }, 15);
});

// Sticky Navbar logic
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Animations
const animationElements = document.querySelectorAll('.fade-up, .fade-in');
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

animationElements.forEach(el => observer.observe(el));

// Smooth Scroll for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Only apply smooth scroll if it's an internal link
        if(this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, 
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Mobile Menu (3 Lines) Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-menu ul li a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Contact Modal Logic
const typeModal = document.getElementById('typeModal');
const openTypeModalBtn = document.getElementById('openTypeModalBtn');
const closeTypeModal = document.getElementById('closeTypeModal');
const typeOptionBtns = document.querySelectorAll('.type-option-btn');
const inquiryTypeInput = document.getElementById('inquiryTypeInput');
const selectedTypeText = document.getElementById('selectedTypeText');

if(openTypeModalBtn) {
    openTypeModalBtn.addEventListener('click', () => {
        typeModal.classList.add('active');
    });
}

if(closeTypeModal) {
    closeTypeModal.addEventListener('click', () => {
        typeModal.classList.remove('active');
    });
}

// Handle Option Selection in Modal
typeOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const selectedValue = btn.getAttribute('data-value');
        
        // Update Form hidden input and text
        inquiryTypeInput.value = selectedValue;
        selectedTypeText.textContent = selectedValue;
        
        // Style the button to show it has been successfully selected
        openTypeModalBtn.classList.add('selected');
        
        // Close modal
        typeModal.classList.remove('active');
    });
});

// Close Modal when clicking outside the box
window.addEventListener('click', (e) => {
    if (e.target === typeModal) {
        typeModal.classList.remove('active');
    }
});