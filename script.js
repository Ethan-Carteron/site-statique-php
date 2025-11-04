// Attend que le contenu de la page soit chargé
document.addEventListener('DOMContentLoaded', () => {

    // ======== 1. GESTION DU MENU MOBILE ========
    const hamburgerButton = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('nav-mobile');
    const mobileNavLinks = document.querySelectorAll('.nav-mobile-link');

    hamburgerButton.addEventListener('click', () => {
        mobileNav.classList.toggle('is-open');
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('is-open')) {
                mobileNav.classList.remove('is-open');
            }
        });
    });

    // ======== 2. GESTION DU GRAPHIQUE BUDGET (CHART.JS) ========
    const ctx = document.getElementById('budget-chart');
    if (ctx) {
        // ... (Tout le code de configuration de Chart.js est INCHANGÉ) ...
        // ... Il crée le demi-cercle comme avant ...
        const data = {
            labels: [
                'Soirées & Événements', 'Activités Clubs', 'Communication & Matériel',
                'Voyages & Sorties', 'Imprévus & Admin'
            ],
            datasets: [{
                label: 'Répartition du budget',
                data: [40, 25, 15, 10, 10],
                backgroundColor: ['#3498db', '#e74c3c', '#f1c40f', '#2ecc71', '#9b59b6'],
                hoverOffset: 20,
                borderColor: 'rgba(0,0,0,0.1)'
            }]
        };
        const config = {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                rotation: -90,
                circumference: 180,
                cutout: '60%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Détail: ' + context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        };
        new Chart(ctx, config);
    }

    // ============================================================
    // ANIMATION AVANCÉE DU GRAPHIQUE
    // ============================================================

    const scrollContainer = document.querySelector('main.scroll-container');
    const budgetSection = document.getElementById('budget');
    const budgetChart = document.getElementById('budget-chart');
    const headerHeight = 65;

    let lastScrollTop = 0;
    let ticking = false;
    let attractionForce = 0;
    let currentVelocity = 0;
    const attractionRange = window.innerHeight * 1.5; // Zone d'attraction
    const maxAttractionForce = 0.15; // Force maximale d'attraction
    const dampening = 0.95; // Facteur d'amortissement

    function easeInOutQuart(x) {
        return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
    }

    function handleScrollAnimation() {
        const rect = budgetSection.getBoundingClientRect();
        const vh = window.innerHeight;
        const currentScrollTop = scrollContainer.scrollTop;
        
        // Variables pour les transformations
        let scale = 1;
        let translateY = 0;
        let opacity = 1;

        // Distance du centre du viewport au centre de la section budget
        const distanceFromCenter = Math.abs(rect.top + rect.height/2 - vh/2);
        
        // Calcul de la force d'attraction
        if (distanceFromCenter < attractionRange) {
            attractionForce = maxAttractionForce * (1 - distanceFromCenter/attractionRange);
        } else {
            attractionForce = 0;
        }

        // Calcul de la vitesse de défilement
        const scrollDelta = currentScrollTop - lastScrollTop;
        currentVelocity = scrollDelta * dampening + currentVelocity * (1 - dampening);

        // PHASE DE ZOOM-IN
        if (rect.top > headerHeight) {
            const progress = 1 - (rect.top - headerHeight) / (vh - headerHeight);
            const clampedProgress = Math.max(0, Math.min(1, progress));
            const easedProgress = easeInOutQuart(clampedProgress);
            
            scale = 0.3 + (easedProgress * 0.7);
            translateY = 200 - (easedProgress * 200);
            opacity = 0.3 + (easedProgress * 0.7);
        }
        // PHASE DE ZOOM-OUT
        else {
            const progress = (headerHeight - rect.top) / (vh * 0.5);
            const clampedProgress = Math.max(0, Math.min(1, progress));
            const easedProgress = easeInOutQuart(clampedProgress);
            
            scale = 1 - (easedProgress * 0.7);
            translateY = easedProgress * 200;
            opacity = 1 - (easedProgress * 0.7);
        }

        // Application de l'effet d'attraction
        if (Math.abs(currentVelocity) < 2 && attractionForce > 0) {
            const targetScrollTop = budgetSection.offsetTop - (vh - budgetSection.offsetHeight) / 2;
            const scrollDiff = targetScrollTop - currentScrollTop;
            scrollContainer.scrollTo({
                top: currentScrollTop + scrollDiff * attractionForce,
                behavior: 'auto'
            });
        }

        // Application des transformations avec une transition fluide
        if (budgetChart) {
            budgetChart.style.transform = `scale(${scale}) translateY(${translateY}px)`;
            budgetChart.style.opacity = opacity;
            budgetChart.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        }

        lastScrollTop = currentScrollTop;
        ticking = false;
    }

    // Écoute le scroll sur le conteneur principal (et non 'window')
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(handleScrollAnimation);
                ticking = true;
            }
        });
    }

});