// Attend que le contenu de la page soit chargé
document.addEventListener('DOMContentLoaded', () => {

    // Sélectionne les éléments du DOM
    const hamburgerButton = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('nav-mobile');
    const mobileNavLinks = document.querySelectorAll('.nav-mobile-link');

    // 1. Gérer l'ouverture/fermeture du menu mobile
    hamburgerButton.addEventListener('click', () => {
        // Ajoute ou retire la classe 'is-open' pour afficher/cacher le menu
        mobileNav.classList.toggle('is-open');
    });

    // 2. Fermer le menu mobile après avoir cliqué sur un lien
    // C'est utile pour une page unique (SPA)
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('is-open')) {
                mobileNav.classList.remove('is-open');
            }
        });
    });

});