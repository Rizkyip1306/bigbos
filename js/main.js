/* --- js/main.js --- */

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
    
    if (!data || data.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-20 text-gray-400">Aplikasi tidak ditemukan...</div>`;
        return;
    }

    container.innerHTML = data.map(app => `
        <div onclick="openConfirmModal('${app.url}', '${app.title}')" 
             class="app-card bg-white dark:bg-zinc-800 p-6 rounded-2xl border-t-4 border-big-gold shadow-sm cursor-pointer group">
            <div class="flex justify-between items-start mb-4">
                <div class="p-3 bg-blue-50 dark:bg-zinc-700 rounded-lg group-hover:bg-big-blue group-hover:ring-4 group-hover:ring-blue-500/20 transition-all">
                    ${app.logo ? 
                        `<img src="${app.logo}" class="h-8 w-8 object-contain group-hover:brightness-0 group-hover:invert transition-all">` : 
                        `<i class="fas ${app.icon} text-2xl text-big-blue dark:text-big-gold group-hover:text-white transition-colors"></i>`
                    }
                </div>
                <i class="fas fa-external-link-alt text-gray-300 group-hover:text-big-blue dark:group-hover:text-big-gold transition-colors text-sm"></i>
            </div>
            
            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-big-blue dark:group-hover:text-big-gold transition-colors">${app.title}</h3>
            
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">${app.description}</p>
            <div class="flex flex-wrap gap-2">
                ${app.tags.map(tag => `<span class="text-[10px] font-bold px-2 py-1 bg-gray-100 dark:bg-zinc-700 rounded text-gray-500 dark:text-gray-300 uppercase">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function initTagFilter() {
    const searchInput = document.getElementById('app-search');
    const searchFlexBox = searchInput ? searchInput.closest('.mb-8.flex') : null;

    if (!searchFlexBox || !window.appsData) return;

    const allTags = [...new Set(window.appsData.flatMap(app => app.tags))];
    const tagWrapper = document.createElement('div');
    tagWrapper.id = "dynamic-tag-filters";
    tagWrapper.className = "w-full flex flex-wrap gap-2 mt-4 mb-4 justify-center md:justify-start";

    let html = `<button onclick="filterByTag('ALL', this)" class="tag-btn-item active-tag px-4 py-1.5 rounded-full text-[11px] font-bold bg-big-blue text-white transition-all shadow-sm">ALL</button>`;

    allTags.forEach(tag => {
        html += `<button onclick="filterByTag('${tag}', this)" class="tag-btn-item px-4 py-1.5 rounded-full text-[11px] font-bold bg-white dark:bg-zinc-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-zinc-700 hover:border-big-blue transition-all shadow-sm">#${tag}</button>`;
    });

    tagWrapper.innerHTML = html;
    searchFlexBox.after(tagWrapper);
}

window.filterByTag = function(tag, element) {
    document.querySelectorAll('.tag-btn-item').forEach(btn => {
        btn.classList.remove('bg-big-blue', 'text-white');
        btn.classList.add('bg-white', 'dark:bg-zinc-800', 'text-gray-500');
    });
    element.classList.add('bg-big-blue', 'text-white');

    const searchInput = document.getElementById('app-search');
    if (tag === 'ALL') {
        renderApps(window.appsData);
        if(searchInput) searchInput.value = "";
    } else {
        const filtered = window.appsData.filter(app => app.tags.includes(tag));
        renderApps(filtered);
        if(searchInput) searchInput.value = tag;
    }
}

function openConfirmModal(url, name) {
    currentTargetUrl = url;
    document.getElementById('modal-app-name').innerText = name;
    document.getElementById('confirmation-modal').classList.remove('hidden');
}

function closeConfirmModal() {
    document.getElementById('confirmation-modal').classList.add('hidden');
}

window.addEventListener('load', () => {
    updateClock();
    setInterval(updateClock, 1000);

    if (typeof appsData !== 'undefined') {
        renderApps(appsData);
        initTagFilter();
    }

    const searchInput = document.getElementById('app-search');
    if (searchInput) {
        searchInput.oninput = function(e) {
            const val = e.target.value.toLowerCase();
            const filtered = appsData.filter(app => 
                app.title.toLowerCase().includes(val) || 
                app.tags.some(t => t.toLowerCase().includes(val))
            );
            renderApps(filtered);
        };
    }

    document.getElementById('btn-cancel').onclick = closeConfirmModal;
    document.getElementById('btn-confirm').onclick = function() {
        window.open(currentTargetUrl, '_blank');
        closeConfirmModal();
    };

    document.getElementById('theme-toggle').onclick = function() {
        const isDark = document.documentElement.classList.toggle('dark');
        document.getElementById('theme-icon').className = isDark ? 'fas fa-moon text-blue-400' : 'fas fa-sun text-yellow-500';
    };
});
