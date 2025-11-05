// 시간표 관리 모듈
const TimetableManager = {
    timetable: {},
    currentDay: 0,
    editingTimetable: {},

    init() {
        this.loadTimetable();
        this.setCurrentDay();
        this.bindEvents();
        this.render();
    },

    loadTimetable() {
        this.timetable = Storage.get('timetable', this.getDefaultTimetable());
    },

    saveTimetable() {
        Storage.set('timetable', this.timetable);
    },

    getDefaultTimetable() {
        const defaultPeriods = [
            { subject: '', teacher: '', time: '09:00-09:50' },
            { subject: '', teacher: '', time: '10:00-10:50' },
            { subject: '', teacher: '', time: '11:00-11:50' },
            { subject: '', teacher: '', time: '12:00-12:50' },
            { subject: '점심시간', teacher: '', time: '12:50-13:40' },
            { subject: '', teacher: '', time: '13:40-14:30' },
            { subject: '', teacher: '', time: '14:40-15:30' },
            { subject: '', teacher: '', time: '15:40-16:30' }
        ];

        return {
            0: [...defaultPeriods], // 월
            1: [...defaultPeriods], // 화
            2: [...defaultPeriods], // 수
            3: [...defaultPeriods], // 목
            4: [...defaultPeriods]  // 금
        };
    },

    setCurrentDay() {
        const today = new Date();
        let dayOfWeek = today.getDay();

        // 일요일(0)과 토요일(6)은 월요일(0)로 설정
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            dayOfWeek = 1;
        }

        // 월요일을 0으로 매핑
        this.currentDay = dayOfWeek - 1;
    },

    bindEvents() {
        // 요일 선택
        document.querySelectorAll('.day-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentDay = parseInt(e.target.dataset.day);
                this.render();
            });
        });

        // 시간표 편집 버튼
        document.getElementById('editTimetableBtn').addEventListener('click', () => {
            this.openEditModal();
        });

        // 모달 닫기
        document.getElementById('closeTimetableModal').addEventListener('click', () => {
            this.closeEditModal();
        });

        document.getElementById('cancelTimetableBtn').addEventListener('click', () => {
            this.closeEditModal();
        });

        // 시간표 저장
        document.getElementById('saveTimetableBtn').addEventListener('click', () => {
            this.saveEditedTimetable();
        });
    },

    openEditModal() {
        const modal = document.getElementById('timetableModal');
        modal.classList.add('active');

        // 편집용 복사본 생성
        this.editingTimetable = JSON.parse(JSON.stringify(this.timetable));

        this.renderEditor();
    },

    closeEditModal() {
        const modal = document.getElementById('timetableModal');
        modal.classList.remove('active');
    },

    renderEditor() {
        const editor = document.getElementById('timetableEditor');
        const days = ['월요일', '화요일', '수요일', '목요일', '금요일'];

        editor.innerHTML = days.map((dayName, dayIndex) => {
            const periods = this.editingTimetable[dayIndex] || [];

            return `
                <div class="editor-day">
                    <div class="editor-day-title">${dayName}</div>
                    <div class="editor-periods">
                        ${periods.map((period, periodIndex) => `
                            <div class="editor-period">
                                <div class="editor-period-number">${periodIndex + 1}교시</div>
                                <input type="text"
                                    placeholder="과목명"
                                    value="${period.subject}"
                                    data-day="${dayIndex}"
                                    data-period="${periodIndex}"
                                    data-field="subject">
                                <input type="text"
                                    placeholder="교사명"
                                    value="${period.teacher}"
                                    data-day="${dayIndex}"
                                    data-period="${periodIndex}"
                                    data-field="teacher">
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        // 입력 이벤트 바인딩
        editor.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', (e) => {
                const day = parseInt(e.target.dataset.day);
                const period = parseInt(e.target.dataset.period);
                const field = e.target.dataset.field;

                this.editingTimetable[day][period][field] = e.target.value;
            });
        });
    },

    saveEditedTimetable() {
        this.timetable = JSON.parse(JSON.stringify(this.editingTimetable));
        this.saveTimetable();
        this.render();
        this.closeEditModal();

        Toast.success('시간표가 저장되었습니다');
    },

    render() {
        // 요일 버튼 활성화
        document.querySelectorAll('.day-btn').forEach((btn, index) => {
            btn.classList.toggle('active', index === this.currentDay);
        });

        // 시간표 렌더링
        const container = document.getElementById('timetable');
        const periods = this.timetable[this.currentDay] || [];

        if (periods.length === 0 || periods.every(p => !p.subject)) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📚</div>
                    <div class="empty-state-text">시간표를 등록해주세요</div>
                </div>
            `;
            return;
        }

        // 현재 시간 확인
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinute;

        container.innerHTML = periods.map((period, index) => {
            if (!period.subject) return '';

            // 현재 수업 중인지 확인
            const [startTime, endTime] = period.time.split('-');
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);

            const periodStart = startHour * 60 + startMinute;
            const periodEnd = endHour * 60 + endMinute;

            const isCurrent = currentTime >= periodStart && currentTime <= periodEnd;

            return `
                <div class="period ${isCurrent ? 'current' : ''}">
                    <div class="period-number">${index + 1}</div>
                    <div class="period-info">
                        <div class="period-subject">${period.subject}</div>
                        ${period.teacher ? `<div class="period-teacher">${period.teacher}</div>` : ''}
                    </div>
                    <div class="period-time">${period.time}</div>
                </div>
            `;
        }).join('');
    }
};
