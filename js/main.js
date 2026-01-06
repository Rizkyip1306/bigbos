/* --- js/main.js --- */

// JANGAN gunakan 'let' atau 'const' jika variabel sudah ada di file lain
// Cukup gunakan variabelnya saja
var currentTargetUrl = ""; 

function updateClock() {
    const clockElement = document.getElementById('realtime-clock');
    if (clockElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', year: 'numeric', month: 'long', 
            day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' 
        };
        clockElement.innerText = now.toLocaleDateString('id-ID', options);
    }
}

function renderApps(data) {
    const container = document.getElementById('apps-container');
    if (!container) return;
    
    container.innerHTML = data.map(app => `
        <div onclick="openConfirmModal('${app.url}', '${app.title}')" 
             class="app-card bg-white dark:bg-zinc-800 p-6 rounded-2xl border-t-4 border-big-gold shadow-sm cursor-pointer group">
            <div class="flex justify-between items-start mb-4">
                <div class="p-3 bg-blue-50 dark:bg-zinc-700 rounded-lg group-hover:bg-big-blue transition-all">
                    <i class="fas ${app.icon} text-2xl text-big-blue dark:text-big-gold group-hover:text-white"></i>
                </div>
                <i class="fas fa-external-link-alt text-gray-300 group-hover:text-big-blue transition-colors text-sm"></i>
            </div>
            <h3 class="font-bold text-gray-800 dark:text-white mb-2 group-hover:text-big-blue transition-colors uppercase">${app.title}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">${app.description}</p>
            <div class="flex flex-wrap gap-2">
                ${app.tags.map(tag => `<span class="text-[10px] font-bold px-2 py-1 bg-gray-100 dark:bg-zinc-700 rounded text-gray-500 dark:text-gray-300 uppercase">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function openConfirmModal(url, name) {
    currentTargetUrl = url;
    document.getElementById('modal-app-name').innerText = name;
    document.getElementById('confirmation-modal').classList.remove('hidden');
}

function closeConfirmModal() {
    document.getElementById('confirmation-modal').classList.add('hidden');
}

// EKSEKUSI SETELAH SEMUA ELEMEN HTML TERSEDIA
window.onload = function() {
    setInterval(updateClock, 1000);
    updateClock();

    if (typeof appsData !== 'undefined') {
        renderApps(appsData);
    }

    // Pastikan elemen ada sebelum memberikan onclick
    const btnCancel = document.getElementById('btn-cancel');
    const btnConfirm = document.getElementById('btn-confirm');

    if (btnCancel) btnCancel.onclick = closeConfirmModal;
    if (btnConfirm) {
        btnConfirm.onclick = function() {
            window.open(currentTargetUrl, '_blank');
            closeConfirmModal();
        };
    }

    // Logic Dark Mode
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.onclick = function() {
            const isDark = document.documentElement.classList.toggle('dark');
            const icon = document.getElementById('theme-icon');
            if (icon) icon.className = isDark ? 'fas fa-moon text-blue-400' : 'fas fa-sun text-yellow-500';
        };
    }
};