document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.querySelector('.profile-image');
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    const revealItems = document.querySelectorAll('.skill-card, .service-card, .page-card, .sitemap-item, .profile-card, .footer-column');
    const navLinks = document.querySelectorAll('nav a');

    if (profileImage) {
        let startTimestamp = null;
        const animateBorder = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const elapsed = (timestamp - startTimestamp) / 1000;
            const offset = 18 * Math.sin(elapsed * 1.4);
            const radius = 50 + offset;
            const rotate = 3 * Math.sin(elapsed * 0.9);
            profileImage.style.borderRadius = `${radius}%`;
            profileImage.style.transform = `rotate(${rotate}deg)`;
            requestAnimationFrame(animateBorder);
        };
        requestAnimationFrame(animateBorder);
    }

    if (scrollLinks.length) {
        scrollLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    const target = document.querySelector(targetId);
                    if (target) {
                        event.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    }

    if (revealItems.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px',
        });

        revealItems.forEach(item => {
            item.classList.add('reveal');
            observer.observe(item);
        });
    } else {
        revealItems.forEach(item => item.classList.add('visible'));
    }

    const sectionMap = Array.from(document.querySelectorAll('section[id]')).map((section) => ({
        id: section.id,
        offsetTop: section.offsetTop,
    }));

    const updateNav = () => {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        sectionMap.forEach(({ id }) => {
            const section = document.getElementById(id);
            if (!section) return;
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const isActive = scrollPosition >= top && scrollPosition < bottom;
            const activeLink = document.querySelector(`nav a[href="#${id}"]`);
            if (activeLink) {
                activeLink.classList.toggle('active-link', isActive);
            }
        });
    };

    if (navLinks.length) {
        window.addEventListener('scroll', updateNav);
        updateNav();
    }
});
