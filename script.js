// Variables globales
let currentSection = 'accueil';
const sections = ['accueil', 'presentation', 'cv', 'experiences', 'missions', 'contact'];

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 DOM LOADED - Initialisation du portfolio...');
    
    initNavigation();
    initScrollAnimations();
    initSommaireCards();
    initCVAnimation();
    initExperienceTabs();
    initScrollIndicator();
    initIntersectionObserver();
    initHoverAnimations(); // Animations au survol
    
    // Initialiser les animations missions après un délai
    setTimeout(() => {
        console.log('🚀 Initialisation des animations missions...');
        try {
            initMissionsScrollAnimations();
            revealMissionFiches();
        } catch(error) {
            console.error('❌ Erreur animations:', error);
        }
    }, 500);
});

// Navigation
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Effet de scroll sur la navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Navigation active
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            // Mise à jour des liens actifs
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Fonction de scroll vers une section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Compensation pour la navbar fixe
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Animations au scroll
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.sommaire-card, .visual-card, .experience-card, .mission-card, .contact-card');
    
    animatedElements.forEach(element => {
        element.classList.add('fade-in-up');
    });
}

// Intersection Observer pour les animations
function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animation spéciale pour les cartes du sommaire
                if (entry.target.classList.contains('sommaire-card')) {
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                    }, Math.random() * 300);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    const elementsToObserve = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
    
    // Observer pour la navigation active
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                updateActiveNavLink(sectionId);
            }
        });
    }, {
        threshold: 0.3
    });
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            sectionObserver.observe(section);
        }
    });
}

// Mise à jour du lien de navigation actif
function updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// Cartes du sommaire
function initSommaireCards() {
    const sommaireCards = document.querySelectorAll('.sommaire-card');
    
    sommaireCards.forEach(card => {
        card.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            scrollToSection(target);
            
            // Effet de clic
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // Effet de survol avancé
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Animation CV simplifiée et rapide
function initCVAnimation() {
    const cvButton = document.getElementById('cv-reveal-btn');
    const cvDisplay = document.getElementById('cv-display');
    const cvFrame = document.querySelector('.cv-frame');
    const cvSection = document.getElementById('cv');
    let isRevealed = false;
    let isAnimating = false;
    
    cvButton.addEventListener('click', function() {
        if (isAnimating) return;
        
        if (!isRevealed) {
            isAnimating = true;
            
            // Phase 1: Court chargement
            this.innerHTML = '<span>Chargement...</span><i class="fas fa-spinner fa-spin"></i>';
            
            // Phase 2: Après 0.3 seconde, dessiner le contour
            setTimeout(() => {
                cvDisplay.style.display = 'block';
                cvFrame.classList.add('show-border');
                
                // Phase 3: Après 0.5 secondes, afficher le CV
                setTimeout(() => {
                    cvDisplay.classList.add('show');
                    if (cvSection) cvSection.classList.add('cv-expanded');
                    
                    // Phase 4: Finaliser après 0.3 seconde
                    setTimeout(() => {
                        this.innerHTML = '<span>Masquer le CV</span><i class="fas fa-eye-slash"></i>';
                        this.style.background = 'linear-gradient(135deg, #059669, #10b981)';
                        isRevealed = true;
                        isAnimating = false;
                    }, 300);
                }, 500);
            }, 300);
            
        } else {
            isAnimating = true;
            
            // Animation de fermeture rapide
            cvFrame.classList.remove('show-border');
            cvDisplay.classList.remove('show');
            if (cvSection) cvSection.classList.remove('cv-expanded');
            
            setTimeout(() => {
                cvDisplay.style.display = 'none';
                this.innerHTML = '<span>Afficher mon CV</span><i class="fas fa-eye"></i>';
                this.style.background = '';
                isRevealed = false;
                isAnimating = false;
            }, 800);
        }
        
        // Effet de clic sur le bouton
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
}

// Nouveau système de tableau interactif
function initExperienceTabs() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const experienceRows = document.querySelectorAll('.experience-row');
    const tableHeaders = document.querySelectorAll('.experiences-table th');
    
    // Gestion des boutons de catégorie
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Mise à jour des boutons actifs
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrage du tableau
            filterTableByCategory(category);
            
            // Effet visuel sur le bouton
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Animation d'entrée des lignes du tableau
    experienceRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            row.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, 100 * (index + 1));
    });
    
    // Effet de survol sur les en-têtes
    tableHeaders.forEach(header => {
        header.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.zIndex = '10';
        });
        
        header.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.zIndex = '';
        });
    });
    
    // Clic sur les lignes pour les mettre en évidence
    experienceRows.forEach(row => {
        row.addEventListener('click', function() {
            // Retirer la classe highlighted de toutes les lignes
            experienceRows.forEach(r => r.classList.remove('highlighted'));
            
            // Ajouter la classe à la ligne cliquée
            this.classList.add('highlighted');
            
            // Créer un effet de particules
            createRowParticles(this);
            
            // Retirer l'effet après 3 secondes
            setTimeout(() => {
                this.classList.remove('highlighted');
            }, 3000);
        });
    });
}

// Fonction de filtrage du tableau
function filterTableByCategory(category) {
    const experienceRows = document.querySelectorAll('.experience-row');
    const tableHeaders = document.querySelectorAll('.experiences-table th');
    
    if (category === 'all') {
        // Afficher tout
        experienceRows.forEach(row => {
            row.classList.remove('filtered-out');
        });
        
        tableHeaders.forEach(header => {
            header.style.opacity = '1';
        });
    } else {
        // Filtrer par catégorie
        experienceRows.forEach(row => {
            row.classList.add('filtered-out');
        });
        
        // Mettre en évidence la colonne correspondante
        tableHeaders.forEach(header => {
            if (header.classList.contains(`${category}-col`)) {
                header.style.opacity = '1';
                header.style.transform = 'scale(1.1)';
            } else {
                header.style.opacity = '0.3';
                header.style.transform = 'scale(0.95)';
            }
        });
        
        // Animation de révélation progressive
        setTimeout(() => {
            experienceRows.forEach((row, index) => {
                setTimeout(() => {
                    row.classList.remove('filtered-out');
                }, 100 * index);
            });
        }, 300);
        
        // Restaurer les en-têtes après l'animation
        setTimeout(() => {
            tableHeaders.forEach(header => {
                header.style.opacity = '1';
                header.style.transform = '';
            });
        }, 1500);
    }
}

// Créer des particules lors du clic sur une ligne
function createRowParticles(row) {
    const rect = row.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: var(--electric-blue);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${centerX}px;
            top: ${centerY}px;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (i / 12) * Math.PI * 2;
        const velocity = 150;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.animate([
            { 
                transform: 'translate(0, 0) scale(1)', 
                opacity: 1,
                background: 'var(--electric-blue)'
            },
            { 
                transform: `translate(${vx}px, ${vy}px) scale(0)`, 
                opacity: 0,
                background: 'var(--cyan-blue)'
            }
        ], {
            duration: 1200,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            particle.remove();
        };
    }
}

// Indicateur de scroll
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled / (document.body.offsetHeight - window.innerHeight);
        
        if (scrolled > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
}

// Effets de parallaxe légers
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.animated-shapes');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Animation des éléments au survol (sera appelé depuis le DOMContentLoaded principal)
function initHoverAnimations() {
    // Animation des icônes de passion
    const passionItems = document.querySelectorAll('.passion-item');
    passionItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) icon.style.transform = 'scale(1.2) rotate(10deg)';
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) icon.style.transform = '';
        });
    });
    
    // Animation des tags de compétences
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) translateY(-2px)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Animation des images de mission
    const missionImages = document.querySelectorAll('.mission-img');
    missionImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.08) rotate(2deg)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

// Fonction pour créer des particules animées (effet bonus)
function createParticles() {
    const hero = document.querySelector('.hero');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary-blue);
            border-radius: 50%;
            opacity: 0.3;
            animation: floatParticle ${5 + Math.random() * 5}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        particlesContainer.appendChild(particle);
    }
    
    hero.appendChild(particlesContainer);
}

// Ajout des keyframes pour les particules
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes floatParticle {
        0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
        }
        50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
        }
    }
`;
document.head.appendChild(particleStyle);

// Initialiser les particules après le chargement
window.addEventListener('load', function() {
    createParticles();
});

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', function() {
    // Recalculer les positions si nécessaire
    const navbar = document.getElementById('navbar');
    if (window.innerWidth <= 768) {
        // Mode mobile
        navbar.classList.add('mobile');
    } else {
        navbar.classList.remove('mobile');
    }
});

// Fonction utilitaire pour déboguer (peut être supprimée en production)
function debugLog(message) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[Portfolio Debug]: ${message}`);
    }
}

// Smooth scroll pour tous les navigateurs
function smoothScrollTo(element, duration = 1000) {
    const targetPosition = element.offsetTop - 80;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Préchargement des images pour de meilleures performances
function preloadImages() {
    const images = [
        'PHOTO/PHOTOAWB.png',
        'PHOTO/I2M 1.png',
        'PHOTO/I2M 2.png',
        'PHOTO/I2M 3.png',
        'PHOTO/MUSIQUE 1.png',
        'PHOTO/VINYLE 1.png',
        'CV/CV Wirtz-Berry Antoine juin 2025 (1).pdf.png'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialiser le préchargement
preloadImages();

console.log('[Portfolio Debug]: Portfolio JavaScript initialized successfully!');

// ========================================
// ANIMATIONS SCROLL SIMPLES (SANS BLOCAGE)
// ========================================

function initMissionsScrollAnimations() {
    
    // Fonction de calcul de progression
    function getScrollProgress(element) {
        if (!element) return 0;
        
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Quand l'élément entre dans la vue
        if (rect.top > windowHeight) return 0;
        
        // Quand l'élément sort de la vue
        if (rect.bottom < 0) return 100;
        
        // Progression entre 0 et 100
        const visible = windowHeight - rect.top;
        const total = windowHeight + rect.height;
        const progress = (visible / total) * 100;
        
        return Math.max(0, Math.min(100, progress));
    }
    
    // Gestionnaire de scroll SIMPLE
    function handleScroll() {
        // Robot
        const robotSection = document.querySelector('[data-section="robot"]');
        if (robotSection) {
            const progress = getScrollProgress(robotSection);
            if (progress > 0) {
                animateBuggy(progress);
            }
        }
        
        // Engrenages
        const i2mSection = document.querySelector('[data-section="i2m"]');
        if (i2mSection) {
            const progress = getScrollProgress(i2mSection);
            if (progress > 0) {
                animateGears(progress);
            }
        }
        
        // Musique
        const musicSection = document.querySelector('[data-section="music"]');
        if (musicSection) {
            const progress = getScrollProgress(musicSection);
            if (progress > 0) {
                animatePianoRoll(progress);
            }
        }
    }
    
    // Vérifier que les sections existent
    const robotSection = document.querySelector('[data-section="robot"]');
    const i2mSection = document.querySelector('[data-section="i2m"]');
    const musicSection = document.querySelector('[data-section="music"]');
    
    // Activer le scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Appel initial
    handleScroll();
}

// ========================================
// FONCTIONS D'ANIMATION
// ========================================

function animateBuggy(progress) {
    const buggyGroup = document.getElementById('buggy-group');
    const wheelRL = document.getElementById('wheel-rear-left');
    const wheelRR = document.getElementById('wheel-rear-right');
    const wheelFL = document.getElementById('wheel-front-left');
    const wheelFR = document.getElementById('wheel-front-right');
    
    if (!buggyGroup) return;
    
    // Position X : de 100 à 1000
    const x = 100 + (progress / 100) * 900;
    // Retourner la voiture pour qu'elle regarde vers la droite
    buggyGroup.setAttribute('transform', `translate(${x}, 0) scale(-1, 1)`);
    
    // Rotation des roues (proportionnelle au déplacement)
    // Sens inversé car la voiture est retournée avec scale(-1, 1)
    const rotation = -((progress / 100) * 360 * 3); // 3 tours complets (sens inverse)
    
    if (wheelRL) wheelRL.setAttribute('transform', `translate(-45, 270) rotate(${rotation})`);
    if (wheelRR) wheelRR.setAttribute('transform', `translate(-45, 270) rotate(${rotation})`);
    if (wheelFL) wheelFL.setAttribute('transform', `translate(40, 270) rotate(${rotation})`);
    if (wheelFR) wheelFR.setAttribute('transform', `translate(40, 270) rotate(${rotation})`);
    
    // Particules de poussière aléatoires
    if (progress > 5 && Math.random() > 0.7) {
        createDustParticle(x - 50);
    }
}

function createDustParticle(x) {
    const container = document.getElementById('dust-particles');
    if (!container) return;
    
    const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    particle.setAttribute('cx', x);
    particle.setAttribute('cy', 285);
    particle.setAttribute('r', 3);
    particle.setAttribute('fill', '#999');
    particle.setAttribute('opacity', 0.6);
    container.appendChild(particle);
    
    // Animation fade out
    let opacity = 0.6;
    const fadeInterval = setInterval(() => {
        opacity -= 0.1;
        particle.setAttribute('opacity', opacity);
        if (opacity <= 0) {
            clearInterval(fadeInterval);
            particle.remove();
        }
    }, 50);
}

function animateGears(progress) {
    // 8 engrenages avec rotations alternées
    const gearRotations = [
            { id: 'gear-1', speed: 1, direction: 1 },      // Horaire
            { id: 'gear-2', speed: 1.5, direction: -1 },   // Anti-horaire
            { id: 'gear-3', speed: 2, direction: 1 },      // Horaire
            { id: 'gear-4', speed: 1.2, direction: -1 },   // Anti-horaire
            { id: 'gear-5', speed: 2, direction: 1 },      // Horaire
            { id: 'gear-6', speed: 1, direction: -1 },     // Anti-horaire
            { id: 'gear-7', speed: 1.5, direction: 1 },    // Horaire
            { id: 'gear-8', speed: 2, direction: -1 }      // Anti-horaire
    ];
    
    gearRotations.forEach(gear => {
        const element = document.getElementById(gear.id);
        if (!element) return;
        
        const baseTransform = element.getAttribute('transform').split('data-rotation')[0];
        const rotation = (progress / 100) * 360 * gear.speed * gear.direction;
        
        // Extraire translate
        const translateMatch = baseTransform.match(/translate\([^)]+\)/);
        const translateStr = translateMatch ? translateMatch[0] : '';
        
        element.setAttribute('transform', `${translateStr} rotate(${rotation})`);
    });
}

function animatePianoRoll(progress) {
    const playhead = document.getElementById('playhead');
    if (!playhead) return;
    
    // Déplacer le playhead de x=100 à x=1150
    const x = 100 + (progress / 100) * 1050;
    playhead.setAttribute('transform', `translate(${x - 100}, 0)`);
    
    // Illuminer les notes quand le playhead passe dessus
    illuminateNotes(x);
}

function illuminateNotes(playheadX) {
    const notes = document.querySelectorAll('#midi-notes rect');
    notes.forEach(note => {
        const noteX = parseFloat(note.getAttribute('x'));
        const noteWidth = parseFloat(note.getAttribute('width'));
        
        if (playheadX >= noteX && playheadX <= noteX + noteWidth) {
            note.style.filter = 'brightness(1.5) drop-shadow(0 0 10px currentColor)';
        } else {
            note.style.filter = 'brightness(1)';
        }
    });
}

// Révéler les fiches missions au scroll
function revealMissionFiches() {
    const fiches = document.querySelectorAll('.mission-fiche');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });
    
    fiches.forEach(fiche => observer.observe(fiche));
}

// Variable globale pour le controller (déjà initialisé dans DOMContentLoaded principal)
