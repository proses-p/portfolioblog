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

// Sidebar / hamburger toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    const sidebarClose = document.querySelector('.sidebar-close');

    const closeSidebar = () => {
        if (!sidebar) return;
        sidebar.classList.remove('open');
        overlay && overlay.classList.remove('active');
        sidebar.setAttribute('aria-hidden', 'true');
    };

    const openSidebar = () => {
        if (!sidebar) return;
        sidebar.classList.add('open');
        overlay && overlay.classList.add('active');
        sidebar.setAttribute('aria-hidden', 'false');
    };

    menuToggle && menuToggle.addEventListener('click', openSidebar);
    sidebarClose && sidebarClose.addEventListener('click', closeSidebar);
    overlay && overlay.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
    });
});

// Move header nav links into the sidebar so sidebar is the single nav source
document.addEventListener('DOMContentLoaded', () => {
    const sidebarList = document.querySelector('.sidebar ul');
    if (!sidebarList) return;

    // find all header nav lists
    const headerNavLists = document.querySelectorAll('header nav ul');
    headerNavLists.forEach(list => {
        const items = Array.from(list.querySelectorAll('li'));
        items.forEach(li => {
            const a = li.querySelector('a');
            if (!a) return;
            const href = a.getAttribute('href');
            // avoid duplicates by href
            const exists = sidebarList.querySelector(`a[href="${href}"]`);
            if (!exists) {
                const clone = li.cloneNode(true);
                sidebarList.appendChild(clone);
            }
        });
        // clear header nav to avoid duplicate presentation
        list.innerHTML = '';
    });
});

// Animated binary rain and code snippets in profile card background
document.addEventListener('DOMContentLoaded', () => {
    const binaryRain = document.querySelector('.binary-rain');
    const codeSnippets = document.querySelector('.code-snippets');
    if (!binaryRain || !codeSnippets) return;

    // Code snippets to float across the background
    const codeLines = [
        'function encrypt() { }',
        'const cipher = new Crypto();',
        'if (secure) { activate(); }',
        'while (true) { protect(); }',
        'data.map(x => x.encode());',
        'async init() { await load(); }',
        'class DevOps { build() {} }',
        'socket.emit("ready");'
    ];

    // Create binary rain characters
    const binaryCount = 25;
    for (let i = 0; i < binaryCount; i++) {
        const char = document.createElement('div');
        char.className = 'binary-char';
        char.textContent = Math.random() > 0.5 ? '1' : '0';
        char.style.left = Math.random() * 100 + '%';
        char.style.animationDuration = (3 + Math.random() * 4) + 's';
        char.style.animationDelay = Math.random() * 2 + 's';
        binaryRain.appendChild(char);
    }

    // Create floating code snippets
    const codeCount = 6;
    for (let i = 0; i < codeCount; i++) {
        const code = document.createElement('div');
        code.className = 'code-line';
        code.textContent = codeLines[Math.floor(Math.random() * codeLines.length)];
        code.style.top = Math.random() * 80 + 10 + '%';
        code.style.animationDuration = (6 + Math.random() * 4) + 's';
        code.style.animationDelay = Math.random() * 3 + 's';
        codeSnippets.appendChild(code);
    }

    // Regenerate elements periodically for continuous animation
    setInterval(() => {
        // Randomly regenerate binary characters
        if (Math.random() > 0.7) {
            const existingChars = binaryRain.querySelectorAll('.binary-char');
            if (existingChars.length > 0) {
                const randomChar = existingChars[Math.floor(Math.random() * existingChars.length)];
                randomChar.textContent = Math.random() > 0.5 ? '1' : '0';
            }
        }
    }, 2000);
});
