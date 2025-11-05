// 급식 메뉴 관리 모듈
const MealManager = {
    meals: {},

    init() {
        this.loadMeals();
        this.bindEvents();
        this.render();
    },

    loadMeals() {
        this.meals = Storage.get('meals', this.getDefaultMeals());
    },

    saveMeals() {
        Storage.set('meals', this.meals);
    },

    getDefaultMeals() {
        // 샘플 급식 데이터
        return {
            '월': ['현미밥', '미역국', '불고기', '김치', '과일'],
            '화': ['잡곡밥', '된장찌개', '생선구이', '나물', '요구르트'],
            '수': ['카레라이스', '단무지', '샐러드', '김치', '음료'],
            '목': ['비빔밥', '계란국', '만두', '김치', '과일'],
            '금': ['볶음밥', '짬뽕국', '탕수육', '깍두기', '과일']
        };
    },

    bindEvents() {
        // 급식 편집 버튼
        document.getElementById('editMealBtn').addEventListener('click', () => {
            Toast.show('급식 편집 기능은 추후 업데이트 예정입니다', 'success');
        });
    },

    render() {
        const container = document.getElementById('mealContainer');
        const days = ['월', '화', '수', '목', '금'];
        const today = new Date().getDay();
        const currentDay = today === 0 ? -1 : today === 6 ? -1 : today - 1;

        container.innerHTML = days.map((day, index) => {
            const items = this.meals[day] || [];
            const isToday = index === currentDay;

            return `
                <div class="meal-day ${isToday ? 'today' : ''}">
                    <div class="meal-day-name">${day}요일 ${isToday ? '(오늘)' : ''}</div>
                    <div class="meal-items">
                        ${items.map(item => `
                            <div class="meal-item">• ${item}</div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }
};
