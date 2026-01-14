// Dark Mode Toggle with Persistence
const darkModeBtn = document.createElement('button');
darkModeBtn.innerHTML = "🌙";
darkModeBtn.className = "dark-mode-toggle";
document.body.appendChild(darkModeBtn);

// Style the toggle button via JS for simplicity
Object.assign(darkModeBtn.style, {
    position: 'fixed', bottom: '20px', right: '20px', padding: '12px',
    borderRadius: '50%', border: 'none', cursor: 'pointer', z-index: '2000'
});

darkModeBtn.onclick = () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    darkModeBtn.innerHTML = isLight ? "☀️" : "🌙";
};

// Check for saved theme
if(localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');

// Contact Form AJAX
document.getElementById('contact-form').onsubmit = async function(e) {
    e.preventDefault();
    const status = document.getElementById('form-status');
    status.innerHTML = "Sending...";
    
    const formData = new FormData(this);
    try {
        const response = await fetch('send_email.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.text();
        if(result.trim() === "success") {
            status.innerHTML = "<span class='success'>Message sent!</span>";
            this.reset();
        } else {
            status.innerHTML = "<span class='error'>Error sending message.</span>";
        }
    } catch (err) {
        status.innerHTML = "<span class='error'>Connection error.</span>";
    }
};
