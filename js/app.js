// 메인 애플리케이션
const App = {
    init() {
        console.log('ClassHub 초기화 중...');

        // 테마 설정
        this.initTheme();

        // 모든 모듈 초기화
        DdayManager.init();
        TimetableManager.init();
        MealManager.init();
        TimerManager.init();
        GradeManager.init();
        NoticeManager.init();

        // 전역 이벤트 바인딩
        this.bindGlobalEvents();

        // 주기적 업데이트 (1분마다)
        setInterval(() => {
            this.periodicUpdate();
        }, 60000);

        console.log('ClassHub 초기화 완료! 🎓');

        // 첫 방문시 환영 메시지
        if (!Storage.get('visited')) {
            setTimeout(() => {
                Toast.success('ClassHub에 오신 것을 환영합니다! 🎉');
                Storage.set('visited', true);
            }, 500);
        }
    },

    initTheme() {
        const savedTheme = Storage.get('theme', 'light');
        this.setTheme(savedTheme);
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        Storage.set('theme', theme);

        // 테마 아이콘 업데이트
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);

        Toast.success(`${newTheme === 'dark' ? '다크' : '라이트'} 모드로 전환되었습니다`);
    },

    bindGlobalEvents() {
        // 테마 토글
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // 설정 버튼
        document.getElementById('settingsBtn').addEventListener('click', () => {
            Toast.show('설정 기능은 추후 업데이트 예정입니다', 'success');
        });

        // 데이터 내보내기
        document.getElementById('exportDataBtn').addEventListener('click', () => {
            this.exportData();
        });

        // 데이터 가져오기
        document.getElementById('importDataBtn').addEventListener('click', () => {
            document.getElementById('importFileInput').click();
        });

        document.getElementById('importFileInput').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        // 모달 외부 클릭시 닫기
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        // ESC 키로 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
        });
    },

    periodicUpdate() {
        // 시간표 현재 수업 업데이트
        TimetableManager.render();

        // 타이머 통계 날짜 확인
        TimerManager.loadStats();
        TimerManager.renderStats();
    },

    exportData() {
        try {
            const data = Storage.exportAll();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `classhub_backup_${DateUtils.format(new Date(), 'YYYY-MM-DD')}.json`;
            a.click();

            URL.revokeObjectURL(url);

            Toast.success('데이터가 내보내기 되었습니다');
        } catch (error) {
            console.error('Export error:', error);
            Toast.error('데이터 내보내기 실패');
        }
    },

    importData(file) {
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const success = Storage.importAll(e.target.result);

                if (success) {
                    Toast.success('데이터를 가져왔습니다. 페이지를 새로고침합니다...');

                    setTimeout(() => {
                        location.reload();
                    }, 1500);
                } else {
                    Toast.error('데이터 가져오기 실패');
                }
            } catch (error) {
                console.error('Import error:', error);
                Toast.error('잘못된 파일 형식입니다');
            }
        };

        reader.readAsText(file);

        // 파일 입력 초기화
        document.getElementById('importFileInput').value = '';
    }
};

// DOM 로드 완료 후 앱 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// 페이지 종료 전 타이머 정지
window.addEventListener('beforeunload', () => {
    if (TimerManager.isRunning) {
        TimerManager.pause();
    }
});
