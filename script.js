// Variables globales
let currentSection = 'accueil';
const sections = ['accueil', 'presentation', 'cv', 'experiences', 'missions', 'contact'];

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function () {
    console.log('🌐 DOM LOADED - Initialisation du portfolio...');

    initNavigation();
    initScrollAnimations();
    initSommaireCards();
    initCVAnimation();
    initExperienceTabs();
    initScrollIndicator();
    initIntersectionObserver();
    initHoverAnimations(); // Animations au survol
    initEqualizer(); // Animation égaliseur avec anime.js
    initRobotCircuit();   // Animation circuit projet robot (anime.js)
    initAnnexes();

    // Initialiser les animations missions après un délai
    setTimeout(() => {
        console.log('🚀 Initialisation des animations missions...');
        try {
            initMissionsScrollAnimations();
            revealMissionFiches();
        } catch (error) {
            console.error('❌ Erreur animations:', error);
        }
    }, 500);
});

// Navigation
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Effet de scroll sur la navbar
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Navigation active
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
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
        card.addEventListener('click', function () {
            const target = this.getAttribute('data-target');
            scrollToSection(target);

            // Effet de clic
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });

        // Effet de survol avancé
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
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

    cvButton.addEventListener('click', function () {
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
        button.addEventListener('click', function () {
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
        header.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.05)';
            this.style.zIndex = '10';
        });

        header.addEventListener('mouseleave', function () {
            this.style.transform = '';
            this.style.zIndex = '';
        });
    });

    // Clic sur les lignes pour les mettre en évidence
    experienceRows.forEach(row => {
        row.addEventListener('click', function () {
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

    window.addEventListener('scroll', function () {
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
window.addEventListener('scroll', function () {
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
        item.addEventListener('mouseenter', function () {
            const icon = this.querySelector('i');
            if (icon) icon.style.transform = 'scale(1.2) rotate(10deg)';
        });

        item.addEventListener('mouseleave', function () {
            const icon = this.querySelector('i');
            if (icon) icon.style.transform = '';
        });
    });

    // Animation des tags de compétences
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.1) translateY(-2px)';
        });

        tag.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // Animation des images de mission
    const missionImages = document.querySelectorAll('.mission-img');
    missionImages.forEach(img => {
        img.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.08) rotate(2deg)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
        });

        img.addEventListener('mouseleave', function () {
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
window.addEventListener('load', function () {
    createParticles();
});

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', function () {
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
// ANIMATION ÉQUALISEUR MUSIQUE AVEC ANIME.JS
// ========================================

function initMusicEqualizer() {
    console.log('🎵 Initialisation de l\'animation égaliseur...');

    // Assurer suffisamment de barres pour remplir la largeur
    const eqContainer = document.querySelector('.eq-container');
    if (!eqContainer) {
        console.log('❌ Conteneur equalizer introuvable');
        return;
    }

    const ensureBars = () => {
        const viewportWidth = eqContainer.clientWidth || window.innerWidth;
        const sidePadding = viewportWidth * 0.06; // correspond à ~3vw de chaque côté
        const gap = Math.max(2, Math.min(10, Math.floor(viewportWidth * 0.006)));
        const targetBarWidth = Math.max(12, Math.min(28, Math.floor(viewportWidth / 48)));
        const usable = Math.max(0, viewportWidth - sidePadding * 2);
        const estimatedBars = Math.max(24, Math.min(64, Math.floor(usable / (targetBarWidth + gap))));
        const current = eqContainer.querySelectorAll('.bar').length;
        const needed = estimatedBars - current;
        if (needed > 0) {
            const frag = document.createDocumentFragment();
            for (let i = 0; i < needed; i++) {
                const d = document.createElement('div');
                d.className = 'bar';
                frag.appendChild(d);
            }
            eqContainer.appendChild(frag);
        }
        return eqContainer.querySelectorAll('.bar');
    };

    let bars = ensureBars();
    if (bars.length === 0) {
        console.log('❌ Aucune barre d\'égaliseur trouvée après génération');
        return;
    }

    // Animation equalizer avec timeline
    let timeline = anime.timeline({
        autoplay: false,
        loop: false
    });

    // Ajouter les animations à la timeline
    timeline.add({
        targets: bars,
        height: () => anime.random(20, 250),
        background: () => {
            // Dégradés strictement BLEUS (sans cyan/vert)
            const gradients = [
                'linear-gradient(180deg, #0a1a3a, #1e3a8a, #3b82f6)',
                'linear-gradient(180deg, #0b1220, #1d4ed8, #60a5fa)',
                'linear-gradient(180deg, #0c2340, #123b8a, #2f66ff)',
                'linear-gradient(180deg, #0f172a, #1f3b94, #4361ee)',
                'linear-gradient(180deg, #0b1b3a, #274690, #4f7df3)'
            ];
            return gradients[anime.random(0, gradients.length - 1)];
        },
        boxShadow: () => `0 0 ${anime.random(10, 30)}px rgba(30, 64, 175, ${anime.random(0.3, 0.8)})`,
        // Départ strictement de gauche à droite
        delay: (_, i) => i * 80,
        duration: 400,
        easing: "easeInOutQuad"
    });

    // Gestion du scroll pour contrôler la timeline en fonction de la progression de la section
    const musicSection = document.querySelector('.music-scroll-animation');
    const onScroll = () => {
        if (!musicSection) return;
        const rect = musicSection.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const totalSpan = rect.height + vh; // entrée + sortie de l'écran
        const visibleProgress = Math.max(0, Math.min(1, (vh - rect.top) / totalSpan));
        const seekTime = visibleProgress * timeline.duration; // en ms
        timeline.seek(seekTime);
    };

    document.addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });
    window.addEventListener('resize', () => requestAnimationFrame(onScroll));
    // Positionner correctement au chargement
    onScroll();

    // Pas d'animation autonome: l'avancement est entièrement contrôlé par le scroll

    console.log('✅ Animation égaliseur initialisée avec succès');
}

// ========================================
// ANIMATION CIRCUIT ROBOT AVEC ANIME.JS (LIÉE AU SCROLL)
// ========================================

// ========================================
// ANIMATION CIRCUIT ROBOT TYPE "EXPANSION CENTRALE" (NON-CROISÉ & PLEIN ÉCRAN & DIAGONALES)
// ========================================

function initRobotCircuit() {
    const robotSection = document.querySelector('.robot-scroll-animation');
    const container = document.getElementById('robot-circuit-container');
    if (!robotSection || !container || typeof anime === 'undefined') return;

    // Nettoyer le conteneur
    container.innerHTML = '';

    // Création du SVG
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.classList.add('circuit-svg');
    svg.setAttribute("viewBox", "0 0 1200 800"); // Ratio plus large
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    container.appendChild(svg);

    // Définitions (Gradients & Filtres)
    const defs = document.createElementNS(svgNS, "defs");
    svg.appendChild(defs);

    // Gradient Base (Sombre)
    const gradBase = document.createElementNS(svgNS, "linearGradient");
    gradBase.id = "circuitGradBase";
    gradBase.setAttribute("x1", "0%");
    gradBase.setAttribute("y1", "0%");
    gradBase.setAttribute("x2", "100%");
    gradBase.setAttribute("y2", "0%");
    gradBase.innerHTML = `
        <stop offset="0%" stop-color="#003366" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#0055aa" stop-opacity="0.8"/>
    `;
    defs.appendChild(gradBase);

    // Gradient Néon (Lumineux)
    const gradNeon = document.createElementNS(svgNS, "linearGradient");
    gradNeon.id = "circuitGradNeon";
    gradNeon.setAttribute("x1", "0%");
    gradNeon.setAttribute("y1", "0%");
    gradNeon.setAttribute("x2", "100%");
    gradNeon.setAttribute("y2", "0%");
    gradNeon.innerHTML = `
        <stop offset="0%" stop-color="#00ffff" stop-opacity="0"/>
        <stop offset="20%" stop-color="#00ffff" stop-opacity="1"/>
        <stop offset="100%" stop-color="#0066ff" stop-opacity="1"/>
    `;
    defs.appendChild(gradNeon);

    // Glow Filter
    const filter = document.createElementNS(svgNS, "filter");
    filter.id = "glow";
    filter.innerHTML = `
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
    `;
    defs.appendChild(filter);

    const width = 1200;
    const height = 800;
    const tracesBase = [];
    const tracesNeon = [];

    // Fonction pour générer un chemin de gauche à droite
    function generateTrace(yStart) {
        let d = `M 0 ${yStart}`;
        let currentX = 0;
        let currentY = yStart;
        const steps = 4 + Math.floor(Math.random() * 3); // Nombre d'étapes

        for (let i = 0; i < steps; i++) {
            // Avancer horizontalement
            const advanceX = (width / steps) * (0.5 + Math.random());
            const nextX = Math.min(width, currentX + advanceX);

            d += ` L ${nextX - 20} ${currentY}`; // Ligne droite jusqu'au virage

            // Changement de hauteur (diagonale)
            if (nextX < width - 50) {
                const yChange = (Math.random() - 0.5) * 100; // Variation Y
                const nextY = Math.max(50, Math.min(height - 50, currentY + yChange));

                // Diagonale (chamfer)
                d += ` L ${nextX} ${nextY}`;
                currentY = nextY;
            } else {
                // Finir tout droit
                d += ` L ${width} ${currentY}`;
            }
            currentX = nextX;
        }

        return d;
    }

    // Générer ~25 traces
    for (let i = 0; i < 25; i++) {
        const yStart = (height / 25) * i + (Math.random() * 20);
        const pathData = generateTrace(yStart);

        // 1. Trace de base (plus sombre, arrière-plan)
        const pathBase = document.createElementNS(svgNS, "path");
        pathBase.setAttribute("d", pathData);
        pathBase.setAttribute("stroke", "url(#circuitGradBase)");
        pathBase.setAttribute("stroke-width", "2");
        pathBase.setAttribute("fill", "none");
        pathBase.classList.add('trace-base');
        svg.appendChild(pathBase);
        tracesBase.push(pathBase);

        // 2. Trace Néon (lumineuse, superposition)
        const pathNeon = document.createElementNS(svgNS, "path");
        pathNeon.setAttribute("d", pathData);
        pathNeon.setAttribute("stroke", "url(#circuitGradNeon)");
        pathNeon.setAttribute("stroke-width", "3"); // Un peu plus large pour l'éclat
        pathNeon.setAttribute("fill", "none");
        pathNeon.setAttribute("filter", "url(#glow)");
        pathNeon.classList.add('trace-neon');
        // On la met par dessus
        svg.appendChild(pathNeon);
        tracesNeon.push(pathNeon);
    }

    // --- ANIMATION ---

    // Préparer les traces (dashoffset)
    [...tracesBase, ...tracesNeon].forEach(p => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
    });

    // Timeline principale liée au scroll
    const tl = anime.timeline({
        autoplay: false,
        easing: 'linear'
    });

    // Étape 1 : Tracé des lignes de base (rapide)
    tl.add({
        targets: tracesBase,
        strokeDashoffset: [anime.setDashoffset, 0],
        duration: 1000,
        delay: anime.stagger(30),
        easing: 'easeInOutCubic'
    });

    // Étape 2 : "Allumage" progressif (Néon) qui suit
    tl.add({
        targets: tracesNeon,
        strokeDashoffset: [anime.setDashoffset, 0],
        duration: 1500,
        delay: anime.stagger(50), // Un peu plus lent et décalé
        easing: 'easeInOutSine'
    }, '-=800'); // Commence avant la fin de la base pour fluidité

    // Synchronisation Scroll
    const onScroll = () => {
        const rect = robotSection.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const totalSpan = rect.height + vh * 0.5;

        let progress = (vh - rect.top) / totalSpan;
        progress = Math.max(0, Math.min(1, progress));

        tl.seek(progress * tl.duration);
    };

    document.addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });
    window.addEventListener('resize', () => requestAnimationFrame(onScroll));

    onScroll();
}

// ========================================
// ANNEXES (cartes cliquables + modal)
// ========================================

function initAnnexes() {
    const cards = document.querySelectorAll('.annexe-item');
    const modal = document.getElementById('annexe-modal');
    if (!cards.length || !modal) return;

    const titleEl = modal.querySelector('.annexe-title');
    const textEl = modal.querySelector('.annexe-text');
    const kpEl = modal.querySelector('.annexe-keypoints');
    const heroIcon = modal.querySelector('.annexe-info-icon i');

    const data = {
        i2m: {
            title: 'I2M Bordeaux',
            text: "Institut de Mécanique et d'Ingénierie de Bordeaux: recherche en mécanique des matériaux, structures et procédés.",
            icon: 'fa-industry',
            kps: [
                { icon: 'fa-industry', text: 'Mécanique' },
                { icon: 'fa-microscope', text: 'Recherche' },
                { icon: 'fa-project-diagram', text: 'Projets' }
            ]
        },
        dumas: {
            title: 'Plateforme DUMAS',
            text: "Plateforme d’essais dynamiques et moyens expérimentaux avancés de l’I2M.",
            icon: 'fa-flask',
            kps: [
                { icon: 'fa-vial', text: 'Essais' },
                { icon: 'fa-wave-square', text: 'Dynamique' },
                { icon: 'fa-shield-alt', text: 'Sécurité' }
            ]
        },
        ableton: {
            title: 'Ableton Live 12',
            text: "Station audionumérique pour composer, enregistrer et mixer en workflow clip & arrangement.",
            icon: 'fa-compact-disc',
            kps: [
                { icon: 'fa-compact-disc', text: 'DAW' },
                { icon: 'fa-sliders-h', text: 'Mixage' },
                { icon: 'fa-wave-square', text: 'Sound design' }
            ]
        }
    };

    function open(key) {
        const d = data[key];
        if (!d) return;
        titleEl.textContent = d.title;
        textEl.textContent = d.text;
        kpEl.innerHTML = '';
        if (heroIcon) {
            heroIcon.className = `fas ${d.icon}`;
        }
        d.kps.forEach(k => {
            const item = document.createElement('div');
            item.className = 'passion-item-ultra annexe-mini';
            const i = document.createElement('i');
            i.className = `fas ${k.icon}`;
            const span = document.createElement('span');
            span.textContent = k.text;
            item.appendChild(i);
            item.appendChild(span);
            kpEl.appendChild(item);
        });
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
    }

    function close() {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
    }

    cards.forEach(c => c.addEventListener('click', () => open(c.dataset.key)));
    modal.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

// ========================================
// ANIMATION ÉGALISEUR (NEON & DYNAMIQUE)
// ========================================

function initEqualizer() {
    console.log('🔍 [DEBUT] initEqualizer appelée');

    const bars = document.querySelectorAll('.eq-container .bar');
    console.log('🔍 Barres trouvées:', bars.length);

    if (!bars.length) {
        console.error('❌ ERREUR: Aucune barre trouvée !');
        return;
    }

    console.log('🎵 Animation avec apparition RAPIDE au scroll');

    // Configuration CSS
    bars.forEach((bar, i) => {
        bar.style.opacity = '0';
        bar.style.transformOrigin = 'center';
        bar.style.transform = 'scaleY(0)';
        bar.style.transition = 'transform 0.5s ease-out, background-color 0.8s ease-in-out, opacity 0.3s ease-out';
    });

    const equalizerSection = document.querySelector('.music-scroll-animation');
    const center = Math.floor(bars.length / 2);
    let animationStarted = false;

    // Fonction de calcul de progression du scroll
    function handleScroll() {
        if (!equalizerSection) return;

        const rect = equalizerSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        let progress = 0;

        if (rect.top < windowHeight && rect.bottom > 0) {
            const visible = windowHeight - rect.top;
            const total = windowHeight + rect.height;
            progress = Math.max(0, Math.min(100, (visible / total) * 100));
        }

        // Apparition RAPIDE - seuil réduit de moitié
        bars.forEach((bar, index) => {
            const distanceFromCenter = Math.abs(index - center);
            const maxDistance = Math.floor(bars.length / 2);

            // Chaque barre apparaît sur 50% de progression au lieu de 100%
            const barThreshold = (distanceFromCenter / maxDistance) * 50;

            if (progress > barThreshold && bar.style.opacity === '0') {
                bar.style.opacity = '1';
                bar.style.transform = 'scaleY(3.0)'; // Overshoot
                bar.style.backgroundColor = 'hsl(200, 100%, 50%)';

                setTimeout(() => {
                    bar.style.transform = 'scaleY(1.0)';
                }, 300);
            }
        });

        // Animation continue dès 40% au lieu de 80%
        if (progress > 40 && !animationStarted) {
            animationStarted = true;
            startContinuousAnimation();
        }
    }

    // Animation continue
    function startContinuousAnimation() {
        console.log('🎶 Démarrage animation continue');

        bars.forEach((bar, index) => {
            function animateSingleBar() {
                const targetHeight = 0.3 + Math.random() * 4.7;
                const targetHue = 180 + Math.random() * 90;

                bar.style.transform = `scaleY(${targetHeight})`;
                bar.style.backgroundColor = `hsl(${targetHue}, 100%, 50%)`;
            }

            setTimeout(() => {
                animateSingleBar();
                setInterval(animateSingleBar, 800 + Math.random() * 400);
            }, index * 30);
        });

        console.log('✅ Animation continue lancée!');
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    console.log('👁️ Scroll listener (rapide) installé');
}

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

    // Gestionnaire de scroll SIMPLE (engrenages uniquement, circuit robot géré par anime.js)
    function handleScroll() {
        // Engrenages
        const i2mSection = document.querySelector('[data-section="i2m"]');
        if (i2mSection) {
            const progress = getScrollProgress(i2mSection);
            if (progress > 0) {
                animateGears(progress);
            }
        }
    }

    const i2mSection = document.querySelector('[data-section="i2m"]');

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Initialiser l'égaliseur
    initEqualizer();
}


// ========================================
// FONCTIONS D'ANIMATION
// ========================================

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

// ========================================
// INITIALISATION AU CHARGEMENT DE LA PAGE
// ========================================

// ATTENDRE que le DOM soit complètement chargé avant d'initialiser
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 DOM chargé, initialisation...');

    // Appel des fonctions d'initialisation
    initMissionsScrollAnimations();
    revealMissionFiches();

    console.log('✅ Initialisation terminée');
});
