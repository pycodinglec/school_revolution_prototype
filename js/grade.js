// 성적 계산기 모듈
const GradeManager = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        // 탭 전환
        document.querySelectorAll('.grade-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // 내신 계산
        document.getElementById('calculateNaesinBtn').addEventListener('click', () => {
            this.calculateNaesin();
        });

        // 수능 계산
        document.getElementById('calculateSuneungBtn').addEventListener('click', () => {
            this.calculateSuneung();
        });
    },

    switchTab(tabName) {
        // 탭 버튼 활성화
        document.querySelectorAll('.grade-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // 탭 컨텐츠 표시
        document.querySelectorAll('.grade-tab-content').forEach(content => {
            const contentId = tabName === 'naesin' ? 'naesinTab' : 'suneungTab';
            content.classList.toggle('active', content.id === contentId);
        });
    },

    calculateNaesin() {
        const totalStudents = parseInt(document.getElementById('totalStudents').value);
        const myRank = parseInt(document.getElementById('myRank').value);

        if (!totalStudents || !myRank) {
            Toast.error('총 인원과 등수를 입력해주세요');
            return;
        }

        if (myRank > totalStudents) {
            Toast.error('등수는 총 인원보다 클 수 없습니다');
            return;
        }

        // 내신 등급 계산
        const percentage = (myRank / totalStudents) * 100;
        let grade;

        if (percentage <= 4) grade = 1;
        else if (percentage <= 11) grade = 2;
        else if (percentage <= 23) grade = 3;
        else if (percentage <= 40) grade = 4;
        else if (percentage <= 60) grade = 5;
        else if (percentage <= 77) grade = 6;
        else if (percentage <= 89) grade = 7;
        else if (percentage <= 96) grade = 8;
        else grade = 9;

        const resultDiv = document.getElementById('naesinResult');
        resultDiv.className = 'grade-result success';
        resultDiv.innerHTML = `
            <div>
                <div class="result-grade">${grade}등급</div>
                <div class="result-detail">
                    상위 ${percentage.toFixed(2)}%<br>
                    (${myRank}등 / ${totalStudents}명)
                </div>
            </div>
        `;

        Toast.success('내신 등급이 계산되었습니다');
    },

    calculateSuneung() {
        const rawScore = parseFloat(document.getElementById('rawScore').value);
        const avgScore = parseFloat(document.getElementById('avgScore').value);
        const stdDev = parseFloat(document.getElementById('stdDev').value);

        if (!rawScore || !avgScore || !stdDev) {
            Toast.error('모든 값을 입력해주세요');
            return;
        }

        if (rawScore < 0 || rawScore > 100 || avgScore < 0 || avgScore > 100) {
            Toast.error('점수는 0~100 사이여야 합니다');
            return;
        }

        if (stdDev <= 0) {
            Toast.error('표준편차는 0보다 커야 합니다');
            return;
        }

        // 표준점수 계산 (Z-score)
        const zScore = (rawScore - avgScore) / stdDev;
        const standardScore = Math.round(zScore * 20 + 100);

        // 등급 계산 (정규분포 가정)
        // Z-score를 백분위로 변환
        const percentile = this.zScoreToPercentile(zScore);
        let grade;

        if (percentile >= 96) grade = 1;
        else if (percentile >= 89) grade = 2;
        else if (percentile >= 77) grade = 3;
        else if (percentile >= 60) grade = 4;
        else if (percentile >= 40) grade = 5;
        else if (percentile >= 23) grade = 6;
        else if (percentile >= 11) grade = 7;
        else if (percentile >= 4) grade = 8;
        else grade = 9;

        const resultDiv = document.getElementById('suneungResult');
        resultDiv.className = 'grade-result success';
        resultDiv.innerHTML = `
            <div>
                <div class="result-grade">${grade}등급</div>
                <div class="result-detail">
                    표준점수: ${standardScore}점<br>
                    예상 백분위: ${percentile.toFixed(1)}%
                </div>
            </div>
        `;

        Toast.success('수능 등급이 계산되었습니다');
    },

    // Z-score를 백분위로 변환 (정규분포 근사)
    zScoreToPercentile(z) {
        // 간단한 근사 공식 사용
        const t = 1 / (1 + 0.2316419 * Math.abs(z));
        const d = 0.3989423 * Math.exp(-z * z / 2);
        const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

        let percentile;
        if (z >= 0) {
            percentile = (1 - probability) * 100;
        } else {
            percentile = probability * 100;
        }

        return Math.max(0, Math.min(100, percentile));
    }
};
