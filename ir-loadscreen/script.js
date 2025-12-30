const music = document.getElementById('background-music');
const progressBar = document.getElementById('progress-bar');
const statusText = document.getElementById('loading-status');
const musicToggle = document.getElementById('music-toggle');
const tipElement = document.getElementById('current-tip');

const rulesModal = document.getElementById('rules-modal');
const staffModal = document.getElementById('staff-modal');
const rulesList = document.getElementById('rules-list');
const staffListElement = document.getElementById('staff-list');


const loadingTips = [
    "Press M to access the phone menu and community features.",
    "Did you know? Every action has a consequence in the city.",
    "Your character's story starts now. Roleplay is encouraged!",
    "Use /report for administrative issues, not for questions.",
    "Visit the Mechanic Shop for high-performance upgrades and repairs."
];

const serverRules = [
    "<p><strong>1. Respect All Players:</strong> Harassment, bigotry, or discrimination is strictly forbidden.</p>",
    "<p><strong>2. Value Roleplay:</strong> Always attempt to create a roleplay scenario before escalating conflict.</p>",
    "<p><strong>3. Use Common Sense:</strong> Do not exploit bugs or perform actions unrealistic for the scenario.</p>",
    "<p><strong>4. Meta-Gaming:</strong> Using outside information (Discord, Stream) to influence in-game actions is prohibited.</p>",
    "<p><strong>5. Report Issues:</strong> Use the Discord channel for all reports, bugs, or concerns.</p>",
];

const staffList = [
    { rank: "Owner", name: "Dean", status: "Available" },
    { rank: "Co_owner", name: "Razaveno", status: "Available" },
    { rank: "Admin", name: "NONE", status: "In-Game" },
    { rank: "Moderator", name: "NONE", status: "Off-Duty" },
    { rank: "Support", name: "IR Overlord", status: "Online 24/7" },
];


let currentTipIndex = 0;

const updateProgress = (data) => {
    const progress = Math.min(data.loadFraction * 100, 100); 
    progressBar.style.width = `${progress}%`;
    
    if (data.status) {
        statusText.textContent = data.status;
    } else {
        statusText.textContent = `Loading Assets... ${Math.round(progress)}%`;
    }
    
    if (progress > 0 && music.paused) {
        music.volume = 0.6; 
        music.play().catch(error => console.error("Music playback failed:", error));
    }
};

const changeTip = () => {
    currentTipIndex = (currentTipIndex + 1) % loadingTips.length;
    
    $(tipElement).fadeOut(300, function() {
        tipElement.textContent = loadingTips[currentTipIndex];
        $(tipElement).fadeIn(300);
    });
};

const renderStaff = () => {
    let html = '';
    staffList.forEach(staff => {
        let statusColor = '#7f8c8d'; 
        if (staff.status === 'Available') {
            statusColor = '#00BCD4'; 
        } else if (staff.status === 'In-Game') {
            statusColor = 'yellow';
        }
        
        html += `
            <div class="staff-member">
                <span class="staff-rank">${staff.rank}</span>
                <span>${staff.name}</span>
                <span style="color: ${statusColor};">${staff.status}</span>
            </div>
        `;
    });
    staffListElement.innerHTML = html;
}

const renderRules = () => {
    rulesList.innerHTML = serverRules.join('');
}


renderRules();
renderStaff();

musicToggle.addEventListener('click', (e) => {
    e.preventDefault();
    if (music.muted) {
        music.muted = false;
        musicToggle.innerHTML = '<i class="fas fa-volume-up"></i> Music';
    } else {
        music.muted = true;
        musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i> Music';
    }
});

document.getElementById('rules-button').addEventListener('click', (e) => {
    e.preventDefault();
    rulesModal.style.display = 'block';
});

document.getElementById('staff-button').addEventListener('click', (e) => {
    e.preventDefault();
    staffModal.style.display = 'block';
});

document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const modalId = e.target.getAttribute('data-modal');
        document.getElementById(modalId).style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    if (event.target == rulesModal) {
        rulesModal.style.display = 'none';
    }
    if (event.target == staffModal) {
        staffModal.style.display = 'none';
    }
});

window.addEventListener('message', (e) => {
    if (e.data.loadFraction !== undefined) {
        updateProgress(e.data);
    }
});

tipElement.textContent = loadingTips[currentTipIndex];
setInterval(changeTip, 7000); 

setTimeout(() => {
    if (progressBar.style.width === '0%') {
        statusText.textContent = "Waiting for game assets...";
    }
}, 5000);