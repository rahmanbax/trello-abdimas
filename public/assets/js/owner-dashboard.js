
// owner-dashboard.js

const API_BASE_URL = "https://trelloapp.id/api";
// const API_BASE_URL = "http://127.0.0.1:8000/api";

const token = localStorage.getItem("access_token");
const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
};

// Load projects milik owner saja
function loadOwnerProjects() {
    $.ajax({
        url: `${API_BASE_URL}/projects`,
        type: "GET",
        headers: headers,
        success: function(response) {
            renderOwnerProjects(response.data || response);
        },
        error: function(xhr) {
            console.error("Gagal memuat projects:", xhr);
            $('#projects-container').html(`
                <div class="text-center py-10 text-red-500">
                    <p>Gagal memuat projects</p>
                    <button onclick="loadOwnerProjects()" class="mt-2 text-blue-600 hover:text-blue-500">
                        Coba Lagi
                    </button>
                </div>
            `);
        }
    });
}

// Render projects milik owner dengan tampilan horizontal task board
function renderOwnerProjects(projects) {
    const container = $('#projects-container');
    container.empty();

    if (!projects || projects.length === 0) {
        container.html(`
            <div class="text-center py-10 text-gray-500 w-full">
                <i class="ph-bold ph-folder-simple-open text-3xl mb-3"></i>
                <p class="text-lg">Belum ada project</p>
                <p class="text-sm text-gray-400 mt-1">Klik "Tambah Project" untuk membuat project pertama Anda</p>
            </div>
        `);
        $('#scroll-controls').addClass('hidden');
        return;
    }

    // Reset container styling untuk horizontal layout
    container.css({
        'display': 'inline-flex',
        'gap': '1.5rem',
        'padding': '0 1.25rem',
        'min-width': 'min-content',
        'white-space': 'nowrap'
    });

    projects.forEach(project => {
        // Buat list nama anggota
        let memberNames = '';
        let memberAvatars = '';
        if (project.users && project.users.length > 0) {
            memberNames = project.users.map(u => u.name).join(', ');

            // Bubble Avatar Bagian Dashboard Owner
                memberAvatars = project.users.map((u, idx) => `
                <span class="member-avatar relative inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold text-white border-2 border-white ${idx > 0 ? '-ml-2' : ''} shadow cursor-pointer transition-transform hover:scale-110 hover:z-10"
                style="background: ${generateGradient()};">
                ${getInitials(u.name)}
                <span class="bubble-tooltip">
                    ${u.name}
                </span>
            </span>
        `).join('');
    }

        const projectCard = `
            <div class="project-card bg-white rounded-lg shadow-sm border border-gray-200 flex-shrink-0 w-[400px]">
                <!-- Project Header -->
                <div class="p-3 border-b border-gray-200 mb-3">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex-1">
                            <h3 class="font-bold text-xl text-gray-900 mb-2">
                                ${project.nama_project}
                            </h3>
                        </div>
                        
                        <div class="flex gap-2">
                            <a href="/project/${project.idproject}" class="bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 rounded text-sm font-medium transition-colors flex items-center gap-2">
                                <i class="ph-bold ph-arrow-square-out"></i>
                                Buka Project
                            </a>
                            <button class="project-menu-btn p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded" data-project-id="${project.idproject}">
                                <i class="ph-bold ph-dots-three"></i>
                            </button>
                        </div>
                    </div>
                    <div class="flex items-center gap-4 text-sm text-gray-600 mb-2 mt-3">
                        <span class="flex items-center gap-1">
                            <i class="ph-bold ph-calendar"></i>
                            Dibuat: ${formatDate(project.created_at)}
                        </span>
                    </div>
                    ${memberNames ? `
                        <div class="flex items-center gap-2 mt-2">
                            <div class="flex items-center">
                                ${memberAvatars}
                            </div>
                        </div>
                    ` : ''}
                </div>

                <!-- Vertical Task Board -->
                <div class="p-1">
                    <h4 class="text-lg font-semibold text-gray-900 mb-4">Task Board</h4>
                    <div id="task-board-${project.idproject}" class="task-board-container">
                        <div class="text-center text-gray-500 py-8 p-2">
                            <i class="ph-bold ph-circle-notch animate-spin text-xl mb-2"></i>
                            <p>Memuat tasks...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.append(projectCard);

        // load tasks for this project
        loadProjectTasks(project.idproject);
    });

    // Tambahkan event listener untuk menu project
    $('.project-menu-btn').click(function() {
        const projectId = $(this).data('project-id');
        showProjectMenu(projectId, $(this));
    });

    // Initialize scroll handlers dan show controls jika diperlukan
    const updateScrollButtons = initScrollHandlers();
    
    // Tampilkan scroll controls jika projects lebih dari 2
    if (projects.length > 2) {
        $('#scroll-controls').removeClass('hidden');
        // Update button states setelah render
        setTimeout(updateScrollButtons, 100);
    } else {
        $('#scroll-controls').addClass('hidden');
    }
}

// Load tasks dan render vertikal task board
function loadProjectTasks(projectId) {
    $.ajax({
        url: `${API_BASE_URL}/tasks?idproject=${projectId}`,
        type: "GET",
        headers: headers,
        success: function(tasks) {
            updateTaskStatistics(projectId, tasks);
            renderVerticalTaskBoard(projectId, tasks);
        },
        error: function(xhr) {
            console.error(`Gagal memuat tasks project ${projectId}:`, xhr);
            $(`#task-board-${projectId}`).html(`
                <div class="text-center text-red-500 py-8">
                    <i class="ph-bold ph-warning-circle text-xl mb-2"></i>
                    <p>Gagal memuat tasks</p>
                </div>
            `);
        }
    });
}

// Update statistics
function updateTaskStatistics(projectId, tasks) {
    const todoCount = tasks.filter(task => task.status === '1').length;
    const progressCount = tasks.filter(task => task.status === '2').length;
    const completedCount = tasks.filter(task => task.status === '3').length;

    $(`#todo-count-${projectId}`).text(todoCount);
    $(`#progress-count-${projectId}`).text(progressCount);
    $(`#completed-count-${projectId}`).text(completedCount);
}

// Render horizontal task board (kanban style)
function renderHorizontalTaskBoard(projectId, tasks) {
    // Kelompokkan task per status
    const statusMap = {
        '1': { 
            label: 'To Do', 
            color: 'bg-blue-100 text-blue-800',
            borderColor: 'border-blue-200',
            icon: 'ph-list-checks',
            tasks: []
        },
        '2': { 
            label: 'In Progress', 
            color: 'bg-yellow-100 text-yellow-800',
            borderColor: 'border-yellow-200',
            icon: 'ph-timer',
            tasks: []
        },
        '3': { 
            label: 'Done', 
            color: 'bg-green-100 text-green-800',
            borderColor: 'border-green-200',
            icon: 'ph-check-circle',
            tasks: []
        }
    };

    // Kelompokkan tasks
    tasks.forEach(task => {
        if (statusMap[task.status]) {
            statusMap[task.status].tasks.push(task);
        }
    });

    // Render horizontal task board
    let html = `
        <div class="task-board flex gap-2 overflow-x-auto pb-2">
    `;

    Object.keys(statusMap).forEach(status => {
        const { tasks, color, borderColor, label, icon } = statusMap[status];
        const taskCount = tasks.length;

        html += `
            <div class="status-column flex-shrink-0 w-80 ${borderColor} border rounded-lg bg-gray-50">
                <div class="status-header flex items-center justify-between p-4 ${color} rounded-t-lg">
                    <div class="flex items-center gap-2">
                        <i class="ph-bold ${icon}"></i>
                        <h3 class="text-sm font-semibold">${label}</h3>
                    </div>
                </div>
                <div class="task-list p-3 space-y-3 min-h-40">
        `;

        if (tasks.length > 0) {
            tasks.forEach(task => {
                html += `
                    <div class="task-card bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                         onclick="window.location.href='/project/${projectId}'">
                        <h5 class="text-sm font-medium text-gray-800 mb-2 leading-tight">
                            ${task.nama_task || task.name || task.title }
                        </h5>
                        ${task.deskripsi ? `
                        <p class="text-xs text-gray-500 mb-3 line-clamp-2">
                            ${task.deskripsi}
                        </p>
                        ` : ''}
                        <div class="flex justify-between items-center text-xs text-gray-400">
                            <div class="flex items-center gap-1 mt-2">
                                <div class="flex items-center">
                                    ${memberAvatars}
                                </div>
                            </div>
                            ${task.updated_at ? `
                            <span>${formatRelativeTime(task.updated_at)}</span>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
        } else {
            html += `
                <div class="text-center py-8 text-gray-400">
                    <i class="ph-bold ph-clipboard-text text-xl mb-2"></i>
                    <p class="text-xs">Tidak ada task</p>
                </div>
            `;
        }

        html += `
                </div>
            </div>
        `;
    });

    html += `</div>`;

    $(`#task-board-${projectId}`).html(html);
}

// Render vertical task board (kanban style)
function generateGradient() {
    // Contoh: random gradient, bisa diganti sesuai kebutuhan
    const colors = [
        ['#6EE7B7', '#3B82F6'],
        ['#FDE68A', '#FCA5A5'],
        ['#A5B4FC', '#F472B6'],
        ['#F9A8D4', '#F87171'],
        ['#FCD34D', '#34D399'],
    ];
    const idx = Math.floor(Math.random() * colors.length);
    return `linear-gradient(135deg, ${colors[idx][0]}, ${colors[idx][1]})`;
}

function renderVerticalTaskBoard(projectId, tasks) {
    // Kelompokkan task per status
    const statusMap = {
        '1': { 
            label: 'To Do', 
            color: 'bg-blue-100 text-blue-800',
            borderColor: 'border-blue-200',
            icon: 'ph-list-checks',
            tasks: []
        },
        '2': { 
            label: 'In Progress', 
            color: 'bg-yellow-100 text-yellow-800',
            borderColor: 'border-yellow-200',
            icon: 'ph-timer',
            tasks: []
        },
        '3': { 
            label: 'Done', 
            color: 'bg-green-100 text-green-800',
            borderColor: 'border-green-200',
            icon: 'ph-check-circle',
            tasks: []
        }
    };

    tasks.forEach(task => {
        if (statusMap[task.status]) {
            statusMap[task.status].tasks.push(task);
        }
    });

    // Render VERTIKAL
    let html = `<div class="task-board flex flex-col gap-4 ">`;

    Object.keys(statusMap).forEach(status => {
        const { tasks, color, borderColor, label, icon } = statusMap[status];
        const taskCount = tasks.length;

        html += `
            <div class="status-column ${borderColor} border rounded-lg bg-gray-50 mb-2 ">
                <div class="status-header flex items-center justify-between p-4 ${color} rounded-t-lg">
                    <div class="flex items-center gap-2">
                        <i class="ph-bold ${icon}"></i>
                        <h3 class="text-sm font-semibold">${label}</h3>
                    </div>
                    <span class="bg-white bg-opacity-50 text-xs font-medium px-2 py-1 rounded-full">
                        ${taskCount}
                    </span>
                </div>
                <div class="task-list p-3 space-y-3 min-h-10 ">
        `;

        if (tasks.length > 0) {
            tasks.forEach(task => {
                // Ambil user dari task (misal: task.user atau task.users[0])
                let userAvatar = '';
                if (task.user && task.user.name) {
                    const initials = getInitials(task.user.name);
                    userAvatar = `
                        <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 px-2"
                             style="background: ${generateGradient()}">
                            ${initials}
                        </div>
                        <span class="text-xs text-gray-700">${task.user.name}</span>
                    `;
                } else if (task.users && task.users.length > 0) {
                    userAvatar = task.users.map(u => `
                        <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-1"
                             style="background: ${generateGradient()}" title="${u.name}">
                            ${getInitials(u.name)}
                        </div>
                    `).join('');
                }

                html += `
                    <div class="task-card bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer flex items-center">
                        <div class="flex-1">
                            <h5 class="text-sm font-medium text-gray-800 mb-2 leading-tight">
                                ${task.nama_task || task.name || task.title || 'Task #' + task.id}
                            </h5>
                            ${task.deskripsi ? `
                            <p class="text-xs text-gray-500 mb-3 line-clamp-2">
                                ${task.deskripsi}
                            </p>
                            ` : ''}
                            <div class="flex items-center mt-2">
                                ${userAvatar}
                            </div>
                        </div>
                        <div class="flex flex-col items-end text-xs text-gray-400 ml-2">
                            ${task.updated_at ? `
                            <span>${formatRelativeTime(task.updated_at)}</span>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
        } else {
            html += `
                <div class="text-center py-8 text-gray-400">
                    <i class="ph-bold ph-clipboard-text text-xl mb-2"></i>
                    <p class="text-xs">Tidak ada task</p>
                </div>
            `;
        }

        html += `
                </div>
            </div>
        `;
    });

    html += `</div>`;

    $(`#task-board-${projectId}`).html(html);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Format relative time (e.g., "2 hours ago")
function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'baru saja';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}j`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}h`;
    
    return formatDate(dateString);
}

// Project menu (edit/delete)
function showProjectMenu(projectId, buttonElement) {
    // Hapus menu yang sudah ada
    $('.project-menu').remove();
    
    const menu = `
        <div class="project-menu absolute bg-white shadow-lg border border-gray-200 rounded-md py-1 z-10">
            <button class="edit-project w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    data-project-id="${projectId}">
                <i class="ph-bold ph-pencil-simple"></i>Edit
            </button>
            <button class="delete-project w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    data-project-id="${projectId}">
                <i class="ph-bold ph-trash"></i>Hapus
            </button>
        </div>
    `;
    
    $(buttonElement).after(menu);
    const menuElement = $(buttonElement).next('.project-menu');
    
    // Position menu
    const rect = buttonElement[0].getBoundingClientRect();
    menuElement.css({
        top: rect.bottom + 5,
        right: window.innerWidth - rect.right
    });
    
    // Event listeners untuk menu
    menuElement.find('.edit-project').click(function() {
        editProject(projectId);
        menuElement.remove();
    });
    
    menuElement.find('.delete-project').click(function() {
        deleteProject(projectId);
        menuElement.remove();
    });
    
    // Close menu ketika klik di luar
    $(document).on('click.project-menu', function(e) {
        if (!$(e.target).closest('.project-menu, .project-menu-btn').length) {
            $('.project-menu').remove();
            $(document).off('click.project-menu');
        }
    });
}

function editProject(projectId) {
    const projectName = $(`.project-card [data-project-id="${projectId}"]`).closest('.project-card')
        .find('h3').text().trim();
    
    const newName = prompt('Edit nama project:', projectName);
    if (newName && newName.trim() !== '' && newName !== projectName) {
        $.ajax({
            url: `${API_BASE_URL}/projects/${projectId}`,
            type: "PUT",
            headers: headers,
            data: JSON.stringify({ nama_project: newName.trim() }),
            success: function(response) {
                loadOwnerProjects(); // Reload projects
            },
            error: function(xhr) {
                alert('Gagal mengupdate project');
            }
        });
    }
}

function deleteProject(projectId) {
    if (confirm('Apakah Anda yakin ingin menghapus project ini? Semua tugas yang terkait juga akan dihapus.')) {
        $.ajax({
            url: `${API_BASE_URL}/projects/${projectId}`,
            type: "DELETE",
            headers: headers,
            success: function(response) {
                loadOwnerProjects(); // Reload projects
            },
            error: function(xhr) {
                alert('Gagal menghapus project');
            }
        });
    }
}

// Modal handlers
function initModalHandlers() {
    $('#open-modal-create').click(function() {
        $('#modal-create-project').removeClass('hidden');
    });

    $('#close-modal-create, #cancel-create').click(function() {
        $('#modal-create-project').addClass('hidden');
        $('#project-name').val('');
    });

    // Create project form
    $('#create-project-form').submit(function(e) {
        e.preventDefault();
        
        const projectName = $('#project-name').val().trim();
        if (!projectName) {
            alert('Nama project tidak boleh kosong');
            return;
        }

        $.ajax({
            url: `${API_BASE_URL}/projects`,
            type: "POST",
            headers: headers,
            data: JSON.stringify({ nama_project: projectName }),
            success: function(response) {
                $('#modal-create-project').addClass('hidden');
                $('#project-name').val('');
                loadOwnerProjects(); // Reload projects
            },
            error: function(xhr) {
                console.error("Gagal membuat project:", xhr);
                alert('Gagal membuat project');
            }
        });
    });
}

// Initialize the dashboard
function initOwnerDashboard() {
    loadOwnerProjects();
    initModalHandlers();
}

// Load dashboard ketika document ready
$(document).ready(function() {
    initOwnerDashboard();
});

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

// Scroll handlers dengan debounce
function initScrollHandlers() {
    const wrapper = $('.projects-wrapper');
    const container = $('#projects-container');
    const scrollLeftBtn = $('#scroll-left');
    const scrollRightBtn = $('#scroll-right');
    const controls = $('#scroll-controls');

    function updateScrollButtons() {
        const scrollLeft = wrapper.scrollLeft();
        const maxScroll = Math.max(0, container.outerWidth(true) - wrapper.outerWidth());
        
        if (scrollLeftBtn.length) scrollLeftBtn.prop('disabled', scrollLeft <= 0);
        if (scrollRightBtn.length) scrollRightBtn.prop('disabled', scrollLeft >= maxScroll - 5); // Tolerance
    }

    if (scrollLeftBtn.length) {
        scrollLeftBtn.off('click').on('click', () => {
            wrapper.animate({ scrollLeft: Math.max(0, wrapper.scrollLeft() - 400) }, 300);
        });
    }
    if (scrollRightBtn.length) {
        scrollRightBtn.off('click').on('click', () => {
            const maxScroll = Math.max(0, container.outerWidth(true) - wrapper.outerWidth());
            wrapper.animate({ scrollLeft: Math.min(maxScroll, wrapper.scrollLeft() + 400) }, 300);
        });
    }

    // Update button states on scroll
    wrapper.off('scroll.initScroll').on('scroll.initScroll', updateScrollButtons);
    // Update on resize
    $(window).off('resize.initScroll').on('resize.initScroll', updateScrollButtons);

    // initial update
    setTimeout(updateScrollButtons, 50);

    return updateScrollButtons;
}