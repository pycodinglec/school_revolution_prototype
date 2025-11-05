// 공지사항 및 할일 관리 모듈
const NoticeManager = {
    notices: [],
    todos: [],

    init() {
        this.loadData();
        this.bindEvents();
        this.render();
    },

    loadData() {
        this.notices = Storage.get('notices', []);
        this.todos = Storage.get('todos', []);
    },

    saveNotices() {
        Storage.set('notices', this.notices);
    },

    saveTodos() {
        Storage.set('todos', this.todos);
    },

    bindEvents() {
        // 공지사항 추가
        document.getElementById('addNoticeBtn').addEventListener('click', () => {
            this.openNoticeModal();
        });

        document.getElementById('closeNoticeModal').addEventListener('click', () => {
            this.closeNoticeModal();
        });

        document.getElementById('cancelNoticeBtn').addEventListener('click', () => {
            this.closeNoticeModal();
        });

        document.getElementById('saveNoticeBtn').addEventListener('click', () => {
            this.saveNotice();
        });

        // 할일 추가
        document.getElementById('addTodoBtn').addEventListener('click', () => {
            document.getElementById('todoInput').focus();
        });

        document.getElementById('addTodoSubmitBtn').addEventListener('click', () => {
            this.addTodo();
        });

        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
    },

    // === 공지사항 관련 ===
    openNoticeModal() {
        const modal = document.getElementById('noticeModal');
        modal.classList.add('active');

        document.getElementById('noticeTitle').value = '';
        document.getElementById('noticeContent').value = '';
        document.getElementById('noticeImportant').checked = false;
    },

    closeNoticeModal() {
        const modal = document.getElementById('noticeModal');
        modal.classList.remove('active');
    },

    saveNotice() {
        const title = document.getElementById('noticeTitle').value.trim();
        const content = document.getElementById('noticeContent').value.trim();
        const important = document.getElementById('noticeImportant').checked;

        if (!title || !content) {
            Toast.error('제목과 내용을 입력해주세요');
            return;
        }

        const notice = {
            id: Date.now(),
            title,
            content,
            important,
            date: new Date().toISOString(),
            createdAt: DateUtils.format(new Date(), 'YYYY-MM-DD')
        };

        this.notices.unshift(notice);
        this.saveNotices();
        this.renderNotices();
        this.closeNoticeModal();

        Toast.success('공지사항이 추가되었습니다');
    },

    deleteNotice(id) {
        if (!confirm('공지사항을 삭제하시겠습니까?')) return;

        this.notices = this.notices.filter(n => n.id !== id);
        this.saveNotices();
        this.renderNotices();

        Toast.success('공지사항이 삭제되었습니다');
    },

    renderNotices() {
        const container = document.getElementById('noticeList');

        if (this.notices.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📢</div>
                    <div class="empty-state-text">등록된 공지사항이 없습니다</div>
                </div>
            `;
            return;
        }

        container.innerHTML = this.notices.map(notice => `
            <div class="notice-item ${notice.important ? 'important' : ''}">
                <div class="notice-header">
                    <div class="notice-title">
                        ${notice.important ? '<span class="notice-badge">중요</span> ' : ''}
                        ${notice.title}
                    </div>
                    <button class="notice-delete" onclick="NoticeManager.deleteNotice(${notice.id})">×</button>
                </div>
                <div class="notice-content">${notice.content}</div>
                <div class="notice-date">${notice.createdAt}</div>
            </div>
        `).join('');
    },

    // === 할일 관련 ===
    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();

        if (!text) {
            Toast.error('할일을 입력해주세요');
            return;
        }

        const todo = {
            id: Date.now(),
            text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.push(todo);
        this.saveTodos();
        this.renderTodos();

        input.value = '';
        Toast.success('할일이 추가되었습니다');
    },

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.renderTodos();
        }
    },

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.renderTodos();

        Toast.success('할일이 삭제되었습니다');
    },

    renderTodos() {
        const container = document.getElementById('todoList');

        if (this.todos.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🎯</div>
                    <div class="empty-state-text">할일을 추가해보세요</div>
                </div>
            `;
        } else {
            container.innerHTML = this.todos.map(todo => `
                <div class="todo-item ${todo.completed ? 'completed' : ''}">
                    <div class="todo-checkbox ${todo.completed ? 'checked' : ''}"
                         onclick="NoticeManager.toggleTodo(${todo.id})">
                    </div>
                    <div class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</div>
                    <span class="todo-delete" onclick="NoticeManager.deleteTodo(${todo.id})">×</span>
                </div>
            `).join('');
        }

        // 통계 업데이트
        const completed = this.todos.filter(t => t.completed).length;
        const remaining = this.todos.length - completed;

        document.getElementById('completedCount').textContent = completed;
        document.getElementById('remainingCount').textContent = remaining;
    },

    render() {
        this.renderNotices();
        this.renderTodos();
    }
};
