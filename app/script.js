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
        // config.json と tasks.json を並行して取得
        const [configRes, tasksRes] = await Promise.all([
            fetch(`../groups/${groupId}/config.json`),
            fetch(`../groups/${groupId}/tasks.json`)
        ]);

        const config = await configRes.json();
        const tasks = await tasksRes.json();

        renderUI(config, tasks);
        appContent.classList.remove('hidden');
    } catch (error) {
        alert('データの読み込みに失敗しました。ファイルが存在するか確認してください。');
        console.error(error);
    }
}

function renderUI(config, tasks) {
    // ヘッダー情報の更新
    document.getElementById('display-group-name').textContent = config.groupName;
    document.getElementById('display-event-name').textContent = config.eventName;

    // 残り日数の計算
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(config.eventDate);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById('days-remaining').textContent = diffDays;

    // タスク一覧の更新
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // 一旦空にする

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