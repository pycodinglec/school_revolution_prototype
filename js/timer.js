// 학습 타이머 모듈
const TimerManager = {
    timer: null,
    remainingTime: 25 * 60, // 초 단위
    focusTime: 25, // 분
    breakTime: 5, // 분
    isRunning: false,
    isFocusMode: true,
    stats: {
        today: 0,
        week: 0,
        lastDate: null
    },

    init() {
        this.loadSettings();
        this.loadStats();
        this.bindEvents();
        this.render();
        this.renderStats();
    },

    loadSettings() {
        const settings = Storage.get('timerSettings', {
            focusTime: 25,
            breakTime: 5
        });

        this.focusTime = settings.focusTime;
        this.breakTime = settings.breakTime;
        this.remainingTime = this.focusTime * 60;

        document.getElementById('focusTime').value = this.focusTime;
        document.getElementById('breakTime').value = this.breakTime;
    },

    saveSettings() {
        Storage.set('timerSettings', {
            focusTime: this.focusTime,
            breakTime: this.breakTime
        });
    },

    loadStats() {
        this.stats = Storage.get('timerStats', {
            today: 0,
            week: 0,
            lastDate: DateUtils.today()
        });

        // 날짜가 바뀌었으면 오늘 카운트 초기화
        if (this.stats.lastDate !== DateUtils.today()) {
            this.stats.today = 0;
            this.stats.lastDate = DateUtils.today();
            this.saveStats();
        }
    },

    saveStats() {
        Storage.set('timerStats', this.stats);
    },

    bindEvents() {
        // 시작/정지 버튼
        document.getElementById('startTimerBtn').addEventListener('click', () => {
            this.toggle();
        });

        // 초기화 버튼
        document.getElementById('resetTimerBtn').addEventListener('click', () => {
            this.reset();
        });

        // 설정 변경
        document.getElementById('focusTime').addEventListener('change', (e) => {
            this.focusTime = parseInt(e.target.value) || 25;
            if (!this.isRunning) {
                this.remainingTime = this.focusTime * 60;
                this.render();
            }
            this.saveSettings();
        });

        document.getElementById('breakTime').addEventListener('change', (e) => {
            this.breakTime = parseInt(e.target.value) || 5;
            this.saveSettings();
        });
    },

    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    },

    start() {
        this.isRunning = true;
        this.timer = setInterval(() => {
            this.tick();
        }, 1000);

        const btn = document.getElementById('startTimerBtn');
        btn.textContent = '정지';
        btn.classList.add('running');
    },

    pause() {
        this.isRunning = false;
        clearInterval(this.timer);

        const btn = document.getElementById('startTimerBtn');
        btn.textContent = '시작';
        btn.classList.remove('running');
    },

    reset() {
        this.pause();
        this.remainingTime = this.isFocusMode ? this.focusTime * 60 : this.breakTime * 60;
        this.render();
    },

    tick() {
        this.remainingTime--;

        if (this.remainingTime <= 0) {
            this.complete();
        }

        this.render();
    },

    complete() {
        this.pause();

        if (this.isFocusMode) {
            // 집중 시간 완료
            this.stats.today++;
            this.stats.week++;
            this.saveStats();
            this.renderStats();

            Toast.success('집중 시간이 끝났습니다! 🎉 잠깐 쉬어가세요.');

            // 휴식 모드로 전환
            this.isFocusMode = false;
            this.remainingTime = this.breakTime * 60;
        } else {
            // 휴식 시간 완료
            Toast.success('휴식 시간이 끝났습니다! 다시 집중해볼까요?');

            // 집중 모드로 전환
            this.isFocusMode = true;
            this.remainingTime = this.focusTime * 60;
        }

        this.render();

        // 알림음 (선택사항)
        this.playNotificationSound();
    },

    playNotificationSound() {
        // 간단한 비프음
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    },

    render() {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;

        const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.getElementById('timerDisplay').textContent = display;

        const label = this.isFocusMode ? '집중 시간' : '휴식 시간';
        document.getElementById('timerLabel').textContent = label;
    },

    renderStats() {
        document.getElementById('todayCount').textContent = this.stats.today;
        document.getElementById('weekCount').textContent = this.stats.week;
    }
};
