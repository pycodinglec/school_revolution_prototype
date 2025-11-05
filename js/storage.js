// LocalStorage 유틸리티
const Storage = {
    // 버전 관리
    VERSION: '1.0.0',

    // 데이터 가져오기
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    },

    // 데이터 저장하기
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },

    // 데이터 삭제하기
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },

    // 모든 데이터 삭제하기
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    },

    // 모든 앱 데이터 내보내기
    exportAll() {
        const data = {
            version: this.VERSION,
            exportDate: new Date().toISOString(),
            ddays: this.get('ddays', []),
            timetable: this.get('timetable', {}),
            meals: this.get('meals', {}),
            timerStats: this.get('timerStats', {}),
            notices: this.get('notices', []),
            todos: this.get('todos', []),
            theme: this.get('theme', 'light')
        };

        return JSON.stringify(data, null, 2);
    },

    // 데이터 가져오기 (import)
    importAll(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            // 버전 확인 (향후 마이그레이션 로직 추가 가능)
            if (!data.version) {
                throw new Error('Invalid data format');
            }

            // 데이터 복원
            this.set('ddays', data.ddays || []);
            this.set('timetable', data.timetable || {});
            this.set('meals', data.meals || {});
            this.set('timerStats', data.timerStats || {});
            this.set('notices', data.notices || []);
            this.set('todos', data.todos || []);
            this.set('theme', data.theme || 'light');

            return true;
        } catch (error) {
            console.error('Storage import error:', error);
            return false;
        }
    }
};

// Toast 알림 유틸리티
const Toast = {
    show(message, type = 'success', duration = 3000) {
        // 기존 toast 제거
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // 새 toast 생성
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // 자동 제거
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    success(message) {
        this.show(message, 'success');
    },

    error(message) {
        this.show(message, 'error');
    }
};

// 날짜 유틸리티
const DateUtils = {
    // 오늘 날짜 (YYYY-MM-DD)
    today() {
        return new Date().toISOString().split('T')[0];
    },

    // D-Day 계산
    getDday(targetDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const target = new Date(targetDate);
        target.setHours(0, 0, 0, 0);

        const diff = target - today;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'D-Day';
        if (days > 0) return `D-${days}`;
        return `D+${Math.abs(days)}`;
    },

    // 요일 가져오기 (0: 일요일, 1: 월요일, ...)
    getDayOfWeek(date = new Date()) {
        return date.getDay();
    },

    // 이번 주 날짜들 가져오기 (월~금)
    getWeekDates() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const monday = new Date(today);

        // 월요일로 이동
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        monday.setDate(today.getDate() + diff);

        const dates = [];
        for (let i = 0; i < 5; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            dates.push(date.toISOString().split('T')[0]);
        }

        return dates;
    },

    // 날짜 포맷팅
    format(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
    },

    // 요일 이름
    getDayName(dayIndex) {
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return days[dayIndex];
    }
};
