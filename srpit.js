// Attend que le contenu de la page soit chargé
document.addEventListener('DOMContentLoaded', () => {

    // ======== GESTION DU MENU MOBILE ========
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


    // ======== NOUVEAU : GESTION DU GRAPHIQUE BUDGET ========

    // 1. On récupère le canvas
    const ctx = document.getElementById('budget-chart');

    // S'assure que l'élément existe avant de créer le graphique
    if (ctx) {
        // 2. Les données (les mêmes qu'avant)
        const data = {
            labels: [
                'Soirées & Événements',
                'Activités Clubs',
                'Communication & Matériel',
                'Voyages & Sorties',
                'Imprévus & Admin'
            ],
            datasets: [{
                label: 'Répartition du budget',
                data: [40, 25, 15, 10, 10], // Les pourcentages
                backgroundColor: [
                    '#3498db',
                    '#e74c3c',
                    '#f1c40f',
                    '#2ecc71',
                    '#9b59b6'
                ],
                // C'est l'effet de "soulèvement" au survol
                hoverOffset: 20,
                borderColor: 'rgba(0,0,0,0.1)' // Petite bordure
            }]
        };

        // 3. La configuration du graphique
        const config = {
            type: 'doughnut', // Type "donut" (camembert avec un trou)
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,

                // --- C'EST ICI QU'ON LE TRANSFORME EN DEMI-CERCLE ---
                rotation: -90,      // Commence à gauche (9h)
                circumference: 180, // Fait un tour de 180° (un demi-cercle)
                // ----------------------------------------------------

                cutout: '60%', // La taille du trou au milieu

                // On enlève la légende par défaut (on l'a déjà)
                plugins: {
                    legend: {
                        display: false
                    },
                    // Configuration de la "bulle" au survol (détail des dépenses)
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += context.parsed + '%';
                                }
                                return 'Détail: ' + label;
                            }
                        }
                    }
                }
            }
        };

        // 4. On crée le graphique !
        new Chart(ctx, config);
    }
});