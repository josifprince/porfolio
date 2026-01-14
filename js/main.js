// ======= MOBILE NAVIGATION =======
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const navbar = document.querySelector('.navbar ul');

mobileNavToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => navbar.classList.remove('active'));
});

// ======= SMOOTH SCROLL =======
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if(targetSection){
            window.scrollTo({ top: targetSection.offsetTop - 70, behavior: 'smooth' });
        }
    });
});

// ======= DARK MODE TOGGLE =======
const darkModeButton = document.createElement('button');
darkModeButton.innerText = '🌙';
darkModeButton.style.position = 'fixed';
darkModeButton.style.bottom = '20px';
darkModeButton.style.right = '20px';
darkModeButton.style.padding = '10px 15px';
darkModeButton.style.borderRadius = '50px';
darkModeButton.style.border = 'none';
darkModeButton.style.cursor = 'pointer';
darkModeButton.style.backgroundColor = '#1E90FF';
darkModeButton.style.color = '#fff';
darkModeButton.style.zIndex = '1000';
document.body.appendChild(darkModeButton);

darkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    if(document.body.classList.contains('light-mode')){
        document.body.style.backgroundColor = '#f9f9f9';
        document.body.style.color = '#333';
        darkModeButton.innerText = '🌙';
    } else {
        document.body.style.backgroundColor = '#121212';
        document.body.style.color = '#f0f0f0';
        darkModeButton.innerText = '☀️';
    }
});

// Highlight active navbar link on scroll
const sections = document.querySelectorAll('section');
const navLi = document.querySelectorAll('.navbar a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 80;
        if(window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLi.forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href').substring(1) === current){
            link.classList.add('active');
        }
    });
});
