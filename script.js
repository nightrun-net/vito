const SUPABASE_URL ='https://supabase.vito-technology.com';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 15);
});

const navbar = document.getElementById('navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

const animationElements = document.querySelectorAll('.fade-up, .fade-in');

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    });

    animationElements.forEach(el => observer.observe(el));
} else {
    animationElements.forEach(el => el.classList.add('visible'));
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        if (!href || href === '#') return;

        const target = document.querySelector(href);

        if (target) {
            e.preventDefault();

            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-menu ul li a').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    });
});

const typeModal = document.getElementById('typeModal');
const openTypeModalBtn = document.getElementById('openTypeModalBtn');
const closeTypeModal = document.getElementById('closeTypeModal');
const typeOptionBtns = document.querySelectorAll('.type-option-btn');
const inquiryTypeInput = document.getElementById('inquiryTypeInput');
const selectedTypeText = document.getElementById('selectedTypeText');

if (openTypeModalBtn && typeModal) {
    openTypeModalBtn.addEventListener('click', () => {
        typeModal.classList.add('active');
    });
}

if (closeTypeModal && typeModal) {
    closeTypeModal.addEventListener('click', () => {
        typeModal.classList.remove('active');
    });
}

typeOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const selectedValue = btn.dataset.value;

        if (!selectedValue) return;

        if (inquiryTypeInput) {
            inquiryTypeInput.value = selectedValue;
        }

        if (selectedTypeText) {
            selectedTypeText.textContent = selectedValue;
        }

        if (openTypeModalBtn) {
            openTypeModalBtn.classList.add('selected');
        }

        if (typeModal) {
            typeModal.classList.remove('active');
        }
    });
});

window.addEventListener('click', e => {
    if (typeModal && e.target === typeModal) {
        typeModal.classList.remove('active');
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && typeModal) {
        typeModal.classList.remove('active');
    }
});

const contactForm = document.getElementById('contactForm');
const contactSubmitBtn = document.getElementById('contactSubmitBtn');
const contactFormStatus = document.getElementById('contactFormStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const inquiryType = document.getElementById('inquiryTypeInput').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!firstName || !lastName || !phone || !email || !inquiryType || !message) {
            contactFormStatus.textContent = 'Please fill in all required fields.';
            return;
        }

        contactSubmitBtn.disabled = true;
        contactSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        contactFormStatus.textContent = '';

        console.log('Sending to:', SUPABASE_URL);

        try {
            const insertRequest = supabaseClient
                .from('contact_support')
                .insert([
                    {
                        first_name: firstName,
                        last_name: lastName,
                        phone: phone,
                        email: email,
                        inquiry_type: inquiryType,
                        message: message
                    }
                ]);

            const timeout = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('Supabase connection timed out. Check your Supabase URL and Dokploy API.'));
                }, 12000);
            });

            const { error } = await Promise.race([
                insertRequest,
                timeout
            ]);

            if (error) {
                throw error;
            }

            contactFormStatus.textContent = 'Your message has been sent successfully.';

            contactForm.reset();

            inquiryTypeInput.value = '';
            selectedTypeText.textContent = 'Select Inquiry Type (Required)';
            openTypeModalBtn.classList.remove('selected');

        } catch (error) {
            console.error('CONTACT ERROR:', error);

            contactFormStatus.textContent =
                error.message || 'Failed to send message.';
        } finally {
            contactSubmitBtn.disabled = false;
            contactSubmitBtn.innerHTML = 'Send Message';
        }
    });
}
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showContactStatus(message, type) {
    if (!contactFormStatus) return;

    contactFormStatus.textContent = message;
    contactFormStatus.classList.remove('success', 'error');

    if (type) {
        contactFormStatus.classList.add(type);
    }

    if (message) {
        setTimeout(() => {
            contactFormStatus.textContent = '';
            contactFormStatus.classList.remove('success', 'error');
        }, 3000);
    }
}
