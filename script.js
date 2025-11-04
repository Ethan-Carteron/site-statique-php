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
    // NOUVEAU : ANIMATION DE SCROLL POUR LE GRAPHIQUE (Requête 2)
    // ============================================================

    // On cible les éléments nécessaires pour l'animation
    const scrollContainer = document.querySelector('main.scroll-container');
    const budgetSection = document.getElementById('budget');
    const budgetChart = document.getElementById('budget-chart');
    const headerHeight = 65; // Doit correspondre à --header-height en CSS

    // On utilise requestAnimationFrame pour une animation fluide
    let ticking = false;

    function handleScrollAnimation() {
        // 1. Obtenir la position de la section budget
        const rect = budgetSection.getBoundingClientRect();
        const vh = window.innerHeight;

        // `rect.top` est la distance entre le haut du viewport et le haut de la section #budget

        let scale = 1;
        let translateY = 0;

        // 2. PHASE ZOOM-IN : Quand on scroll depuis l'ACCUEIL
        // `rect.top` va de `vh` (bas de l'écran) à `headerHeight` (sticky)
        if (rect.top > headerHeight) {
            // Calcule le progrès de 0 (tout en bas) à 1 (en position sticky)
            const progress = 1 - (rect.top - headerHeight) / (vh - headerHeight);

            // On s'assure que le progrès est entre 0 et 1
            const clampedProgress = Math.max(0, Math.min(1, progress));

            // Le scale va de 0.5 (début) à 1 (fin)
            scale = 0.5 + (clampedProgress * 0.5);
            // Le translate va de 100px (bas) à 0 (position normale)
            translateY = 100 - (clampedProgress * 100);
        }

            // 3. PHASE ZOOM-OUT : Quand la section ANNONCES recouvre le budget
        // `rect.top` va de `headerHeight` (sticky) à 0 puis en négatif
        else {
            // Calcule le progrès de 0 (début du recouvrement) à 1 (totalement recouvert)
            // On calcule sur une distance de 50% du viewport pour un effet plus rapide
            const progress = (headerHeight - rect.top) / (vh * 0.5);

            // On s'assure que le progrès est entre 0 et 1
            const clampedProgress = Math.max(0, Math.min(1, progress));

            // Le scale va de 1 (début) à 0.5 (fin)
            scale = 1 - (clampedProgress * 0.5);
            // Le translate va de 0 (position normale) à 100px (vers le bas)
            translateY = clampedProgress * 100;
        }

        // 4. Appliquer la transformation
        // On cible le canvas pour ne pas affecter le "Solde"
        if (budgetChart) {
            budgetChart.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        }

        ticking = false; // On autorise la prochaine frame
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