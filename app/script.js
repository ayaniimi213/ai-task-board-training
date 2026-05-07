const groupSelector = document.getElementById('group-selector');
const appContent = document.getElementById('app-content');

groupSelector.addEventListener('change', (e) => {
    const groupId = e.target.value;
    if (groupId) {
        loadGroupData(groupId);
    } else {
        appContent.classList.add('hidden');
    }
});

async function loadGroupData(groupId) {
    try {
        // キャッシュを避けるためにタイムスタンプを付与
        const ts = new Date().getTime();
        const [configRes, tasksRes] = await Promise.all([
            fetch(`../groups/${groupId}/config.json?t=${ts}`),
            fetch(`../groups/${groupId}/tasks.json?t=${ts}`)
        ]);

        const config = await configRes.json();
        const tasks = await tasksRes.json();

        renderUI(config, tasks);
        appContent.classList.remove('hidden');
    } catch (error) {
        alert('データの読み込みに失敗しました。');
        console.error(error);
    }
}

function renderUI(config, tasks) {
    document.getElementById('display-group-name').textContent = config.groupName;
    document.getElementById('display-event-name').textContent = config.eventName;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(config.eventDate);
    const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
    document.getElementById('days-remaining').textContent = diffDays;

    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.setAttribute('data-status', task.status);
        card.innerHTML = `
            <div class="task-header">
                <div class="task-title">${task.title}</div>
                <span class="status-badge">${task.status}</span>
            </div>
            <div class="task-details">
                <span>👤 ${task.owner}</span>
                <span>📅 締切: ${task.deadline}</span>
            </div>
        `;
        taskList.appendChild(card);
    });
}
