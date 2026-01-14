// Advanced Portfolio Interactivity & Animations

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for nav links
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hash) {
                e.preventDefault();
                document.querySelector(this.hash).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animated project cards (example data)
    const projects = [
        {
            name: 'School Management System',
            tech: 'PHP | CodeIgniter | MySQL',
            desc: 'A web application designed to manage student records, attendance, exams, and payments for secondary schools.',
            img: 'images/school-mgt.jpg',
            code: 'https://github.com/josephawe/school-mgt',
            demo: '#'
        },
        {
            name: 'CBT Exam System',
            tech: 'PHP | MySQL | JavaScript',
            desc: 'Online examination system with timer, auto grading, and result summary.',
            img: 'images/cbt.jpg',
            code: 'https://github.com/josephawe/cbt-exam',
            demo: '#'
        },
        {
            name: 'Student Attendance System',
            tech: 'PHP | MySQL | JavaScript',
            desc: 'Daily attendance tracking with color-coded and printable reports.',
            img: 'images/attendance.jpg',
            code: 'https://github.com/josephawe/attendance',
            demo: '#'
        },
        {
            name: 'Payment Integration (Interswitch)',
            tech: 'PHP | MySQL | Interswitch API',
            desc: 'Online school fee payment with transaction verification.',
            img: 'images/payment.jpg',
            code: 'https://github.com/josephawe/payment-integration',
            demo: '#'
        },
        {
            name: 'Simple Blog / Admin Dashboard',
            tech: 'PHP | CodeIgniter | MySQL',
            desc: 'Blog platform with login, CRUD posts, and role-based access.',
            img: 'images/blog.jpg',
            code: 'https://github.com/josephawe/simple-blog',
            demo: '#'
        }
    ];

    const grid = document.querySelector('.projects-grid');
    if (grid) {
        projects.forEach((p, i) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.style.animationDelay = (0.1 + i * 0.1) + 's';
            card.innerHTML = `
                <img src="${p.img}" alt="${p.name}" class="project-img" onerror="this.style.display='none'">
                <h4>${p.name}</h4>
                <div class="tech">${p.tech}</div>
                <p>${p.desc}</p>
                <div class="project-links">
                    <a href="${p.code}" target="_blank">View Code</a>
                    ${p.demo !== '#' ? `<a href="${p.demo}" target="_blank">Live Demo</a>` : ''}
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Animate sections on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.section').forEach(sec => {
        observer.observe(sec);
    });
});
