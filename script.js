// Three.js 3D Background
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const scene = new THREE.Scene();
    scene.background = null;
    
    let camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    const particlesCount = 800;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    
    const colorCenter = new THREE.Color(0x00E5FF);
    const colorEdge = new THREE.Color(0x0044FF);
    
    for (let i = 0; i < particlesCount; i++) {
        positions[i*3] = (Math.random() - 0.5) * 2.2;
        positions[i*3+1] = (Math.random() - 0.5) * 1.8;
        positions[i*3+2] = (Math.random() - 0.5) * 1.5;
        
        const mixFactor = (Math.random() * 0.8) + 0.2;
        const color = colorCenter.clone().lerp(colorEdge, mixFactor);
        colors[i*3] = color.r;
        colors[i*3+1] = color.g;
        colors[i*3+2] = color.b;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({ size: 0.008, vertexColors: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    let mouseX = 0, mouseY = 0, targetRotationX = 0, targetRotationY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = (event.clientY / window.innerHeight) * 2 - 1;
        targetRotationY = mouseX * 0.5;
        targetRotationX = mouseY * 0.3;
    });
    
    let currentRotX = 0, currentRotY = 0;
    
    function animateParticles() {
        currentRotX += (targetRotationX - currentRotX) * 0.05;
        currentRotY += (targetRotationY - currentRotY) * 0.05;
        particles.rotation.x = currentRotX;
        particles.rotation.y = currentRotY;
        particles.rotation.z += 0.001;
        
        renderer.render(scene, camera);
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    if ('ontouchstart' in window) {
        material.opacity = 0.3;
    }
}

// Mobile Menu
const menuBtn = document.querySelector('.menu-btn');
const navMenu = document.querySelector('nav ul');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

document.querySelectorAll('nav ul a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Counters with updated numbers
const counters = document.querySelectorAll('.counter');
const startCounters = () => {
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let count = 0;
        const increment = Math.ceil(target / 60);
        const updateCounter = () => {
            if (count < target) {
                count += increment;
                if (count > target) count = target;
                counter.innerText = count;
                setTimeout(updateCounter, 20);
            } else {
                counter.innerText = target;
            }
        };
        updateCounter();
    });
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCounters();
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// Typing Effect
const words = ["Technology", "Business", "Security", "Future", "Success"];
let wordIndex = 0, charIndex = 0, isDeleting = false;
const typedTextElement = document.getElementById('typed-text');

function typeEffect() {
    if (!typedTextElement) return;
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typedTextElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(typeEffect, 1800);
        return;
    }
    
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
    }
    
    const speed = isDeleting ? 70 : 120;
    setTimeout(typeEffect, speed);
}

typeEffect();

// Live Business Status
function updateBusinessStatus() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour + minute / 60;
    
    let status = "", isOpen = false;
    
    if (day === 0) {
        status = "Closed Today";
        isOpen = false;
    } else if (day === 6) {
        if (currentTime >= 10 && currentTime < 16) {
            status = "Open Now (10 AM - 4 PM)";
            isOpen = true;
        } else {
            status = "Closed - Opens Saturday 10 AM";
            isOpen = false;
        }
    } else {
        if (currentTime >= 10 && currentTime < 19) {
            status = "Open Now (10 AM - 7 PM)";
            isOpen = true;
        } else {
            status = "Closed - Opens Tomorrow 10 AM";
            isOpen = false;
        }
    }
    
    const statusText = document.getElementById('statusText');
    const statusDot = document.querySelector('.status-dot');
    
    if (statusText) {
        statusText.textContent = status;
        if (statusDot) {
            statusDot.style.background = isOpen ? "#00FF88" : "#FF4444";
            statusDot.style.boxShadow = isOpen ? "0 0 8px #00FF88" : "none";
        }
    }
}

updateBusinessStatus();
setInterval(updateBusinessStatus, 60000);

// Testimonial Swiper
const testimonialSwiper = new Swiper('.testimonialSwiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
});

// Scroll Animation
const animateElements = document.querySelectorAll('.service-card, .achieve-card, .sector-card, .testimonial-card, .location-card, .team-card');

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            scrollObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
    el.style.willChange = 'transform, opacity';
    scrollObserver.observe(el);
});

// Contact Form
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                alert('✅ Message sent successfully! We will contact you within 2 hours.');
                contactForm.reset();
            } else {
                alert('❌ Error sending message. Please try again or call us directly.');
            }
        } catch (error) {
            alert('❌ Network error. Please try again.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Chatbot Functions
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;
    
    const chatMessages = document.getElementById('chatMessages');
    
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'user-msg';
    userMsgDiv.innerHTML = `<div class="user-text">${escapeHtml(message)}</div>`;
    chatMessages.appendChild(userMsgDiv);
    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    const response = getSmartBotResponse(message);
    
    setTimeout(() => {
        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = 'bot-msg';
        botMsgDiv.innerHTML = `<div class="bot-text">${response}</div>`;
        chatMessages.appendChild(botMsgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 300);
}

function getSmartBotResponse(message) {
    const msg = message.toLowerCase();
    
    if (msg.match(/refurbished|second hand|used|old laptop/)) {
        return "🖥️ Refurbished Products Available!\n\n💻 Laptops: HP, Dell, Lenovo, Apple\n✅ Warranty Available\n📞 Call +91 7620624981 for best price!";
    }
    else if (msg.match(/sell|buy used|exchange/)) {
        return "💰 We BUY & SELL used IT equipment!\n📞 Call +91 7620624981 for free inspection & instant quote!";
    }
    else if (msg.match(/hello|hi|hey/)) {
        return "👋 Namaste! Welcome to Auronix Solution.\n\n💻 Refurbished Laptops | Repair | CCTV | Networking\nHow can I help you today?";
    }
    else if (msg.match(/price|cost|how much/)) {
        return "💰 For pricing details, please call +91 7620624981 for best price!";
    }
    else if (msg.match(/contact|phone|number/)) {
        return "📞 Call/WhatsApp: +91 7620624981\n📧 Email: info@auronixsolution.in";
    }
    else if (msg.match(/thank|thanks/)) {
        return "😊 Thank you! Call +91 7620624981 for any IT needs!";
    }
    else {
        return "🤔 Thanks for your message!\n\n💻 Auronix Solution: Refurbished Laptops | Repair | CCTV | Networking\n📞 Call +91 7620624981 for any IT need!";
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.toggleChat = toggleChat;
window.sendChatMessage = sendChatMessage;

// Gallery Slider
const gallerySwiper = new Swiper('.gallerySwiper', {
    slidesPerView: 1,
    spaceBetween: 25,
    loop: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
});