// D-Day 관리 모듈
const DdayManager = {
    ddays: [],
    selectedColor: '#4F46E5',

    init() {
        this.loadDdays();
        this.bindEvents();
        this.render();
    },

    loadDdays() {
        this.ddays = Storage.get('ddays', []);
    },

    saveDdays() {
        Storage.set('ddays', this.ddays);
    },

    bindEvents() {
        // D-Day 추가 버튼
        document.getElementById('addDdayBtn').addEventListener('click', () => {
            this.openModal();
        });

        // 모달 닫기
        document.getElementById('closeDdayModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelDdayBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // D-Day 저장
        document.getElementById('saveDdayBtn').addEventListener('click', () => {
            this.saveDday();
        });

        // 색상 선택
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.selectedColor = e.target.dataset.color;
            });
        });
    },

    openModal() {
        const modal = document.getElementById('ddayModal');
        modal.classList.add('active');

        // 초기화
        document.getElementById('ddayTitle').value = '';
        document.getElementById('ddayDate').value = '';
        this.selectedColor = '#4F46E5';
        document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('selected'));
        document.querySelector('.color-btn').classList.add('selected');
    },

    closeModal() {
        const modal = document.getElementById('ddayModal');
        modal.classList.remove('active');
    },

    saveDday() {
        const title = document.getElementById('ddayTitle').value.trim();
        const date = document.getElementById('ddayDate').value;

        if (!title || !date) {
            Toast.error('제목과 날짜를 입력해주세요');
            return;
        }

        const dday = {
            id: Date.now(),
            title,
            date,
            color: this.selectedColor,
            createdAt: new Date().toISOString()
        };

        this.ddays.push(dday);
        this.saveDdays();
        this.render();
        this.closeModal();

        Toast.success('D-Day가 추가되었습니다');
    },

    deleteDday(id) {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        this.ddays = this.ddays.filter(d => d.id !== id);
        this.saveDdays();
        this.render();

        Toast.success('D-Day가 삭제되었습니다');
    },

    render() {
        const container = document.getElementById('ddayGrid');

        if (this.ddays.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📅</div>
                    <div class="empty-state-text">D-Day를 추가해보세요</div>
                </div>
            `;
            return;
        }

        // 날짜순 정렬 (가까운 순)
        const sortedDdays = [...this.ddays].sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });

        container.innerHTML = sortedDdays.map(dday => {
            const ddayText = DateUtils.getDday(dday.date);
            const dateObj = new Date(dday.date);
            const formattedDate = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;

            // 색상에 따라 어두운 색상 계산
            const colorMap = {
                '#4F46E5': '#4338CA',
                '#06B6D4': '#0891B2',
                '#10B981': '#059669',
                '#F59E0B': '#D97706',
                '#EF4444': '#DC2626',
                '#8B5CF6': '#7C3AED'
            };

            const darkColor = colorMap[dday.color] || dday.color;

            return `
                <div class="dday-card" style="--card-color: ${dday.color}; --card-color-dark: ${darkColor}">
                    <div class="dday-title">${dday.title}</div>
                    <div class="dday-count">${ddayText}</div>
                    <div class="dday-date">${formattedDate}</div>
                    <button class="dday-delete" onclick="DdayManager.deleteDday(${dday.id})">×</button>
                </div>
            `;
        }).join('');
    }
};
