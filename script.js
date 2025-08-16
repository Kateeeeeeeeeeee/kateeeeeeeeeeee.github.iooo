// 게임 상태 관리
class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.gameStarted = false;
        this.gameCompleted = false;
        this.timer = null;
        this.timeElapsed = 0;
        this.startTime = null;
        
        // 카드 심볼 (이모지 사용)
        this.symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
        
        this.initializeGame();
        this.bindEvents();
        this.loadHighScores();
    }

    // 게임 초기화
    initializeGame() {
        this.createCards();
        this.renderGame();
        this.updateDisplay();
    }

    // 카드 생성
    createCards() {
        this.cards = [];
        const allSymbols = [...this.symbols, ...this.symbols]; // 각 심볼을 2개씩
        this.shuffleArray(allSymbols);
        
        allSymbols.forEach((symbol, index) => {
            this.cards.push({
                id: index,
                symbol: symbol,
                isFlipped: false,
                isMatched: false
            });
        });
    }

    // 배열 셔플 (Fisher-Yates 알고리즘)
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // 게임 보드 렌더링
    renderGame() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
        
        this.cards.forEach(card => {
            const cardElement = this.createCardElement(card);
            gameBoard.appendChild(cardElement);
        });
    }

    // 카드 요소 생성
    createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.dataset.cardId = card.id;
        
        if (card.isFlipped) cardDiv.classList.add('flipped');
        if (card.isMatched) cardDiv.classList.add('matched');
        
        cardDiv.innerHTML = `
            <div class="card-front">🎴</div>
            <div class="card-back">${card.symbol}</div>
        `;
        
        cardDiv.addEventListener('click', () => this.handleCardClick(card));
        
        return cardDiv;
    }

    // 카드 클릭 처리
    handleCardClick(card) {
        if (!this.gameStarted || this.gameCompleted || 
            card.isFlipped || card.isMatched || 
            this.flippedCards.length >= 2) {
            return;
        }

        this.flipCard(card);
        this.flippedCards.push(card);
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.checkMatch();
        }
        
        this.updateDisplay();
    }

    // 카드 뒤집기
    flipCard(card) {
        card.isFlipped = true;
        const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
        cardElement.classList.add('flipped');
    }

    // 카드 매칭 확인
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.symbol === card2.symbol) {
            // 매칭 성공
            card1.isMatched = true;
            card2.isMatched = true;
            this.matchedPairs++;
            
            // 매칭된 카드 스타일 적용
            setTimeout(() => {
                document.querySelector(`[data-card-id="${card1.id}"]`).classList.add('matched');
                document.querySelector(`[data-card-id="${card2.id}"]`).classList.add('matched');
            }, 300);
            
            this.flippedCards = [];
            
            // 게임 완료 확인
            if (this.matchedPairs === this.symbols.length) {
                this.completeGame();
            }
        } else {
            // 매칭 실패
            setTimeout(() => {
                this.flipBackCards();
            }, 1000);
        }
    }

    // 카드 뒤집기 취소
    flipBackCards() {
        this.flippedCards.forEach(card => {
            card.isFlipped = false;
            const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
            cardElement.classList.remove('flipped');
        });
        this.flippedCards = [];
    }

    // 게임 시작
    startGame() {
        this.gameStarted = true;
        this.startTime = Date.now();
        this.startTimer();
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('resetBtn').disabled = false;
    }

    // 게임 재시작
    resetGame() {
        this.stopTimer();
        this.gameStarted = false;
        this.gameCompleted = false;
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.timeElapsed = 0;
        this.flippedCards = [];
        
        this.createCards();
        this.renderGame();
        this.updateDisplay();
        
        // 진행률 바 리셋
        const progressBar = document.querySelector('.progress-fill');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('resetBtn').disabled = true;
        document.getElementById('timer').textContent = '00:00';
    }

    // 타이머 시작
    startTimer() {
        this.timer = setInterval(() => {
            this.timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
            this.updateTimer();
        }, 1000);
    }

    // 타이머 정지
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    // 타이머 업데이트
    updateTimer() {
        const minutes = Math.floor(this.timeElapsed / 60);
        const seconds = this.timeElapsed % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timer').textContent = timeString;
    }

    // 점수 계산
    calculateScore() {
        const baseScore = 1000;
        const timeBonus = Math.max(0, 300 - this.timeElapsed) * 2; // 시간 보너스
        const movePenalty = this.moves * 10; // 이동 페널티
        const matchBonus = this.matchedPairs * 100; // 매칭 보너스
        
        return Math.max(0, baseScore + timeBonus - movePenalty + matchBonus);
    }

    // 게임 완료
    completeGame() {
        this.gameCompleted = true;
        this.stopTimer();
        this.score = this.calculateScore();
        
        setTimeout(() => {
            this.showGameOverModal();
        }, 500);
    }

    // 게임 오버 모달 표시
    showGameOverModal() {
        const modal = document.getElementById('gameOverModal');
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalTime').textContent = document.getElementById('timer').textContent;
        document.getElementById('finalMoves').textContent = this.moves;
        
        modal.style.display = 'block';
    }

    // 게임 오버 모달 숨기기
    hideGameOverModal() {
        document.getElementById('gameOverModal').style.display = 'none';
        document.getElementById('playerName').value = '';
    }

    // 점수 저장
    async saveScore(playerName) {
        try {
            console.log('점수 저장 시작...');
            console.log('사용 중인 API:', window.gameAPI === dbAPI ? 'Supabase' : '로컬 스토리지');
            
            await window.gameAPI.saveHighScore(
                playerName, 
                this.score, 
                this.timeElapsed, 
                this.moves, 
                this.matchedPairs, 
                this.symbols.length
            );
            
            await this.loadHighScores();
            alert('점수가 저장되었습니다!');
        } catch (error) {
            console.error('점수 저장 오류:', error);
            alert('점수 저장에 실패했습니다: ' + error.message);
        }
    }

    // 최고 점수 로드
    async loadHighScores() {
        try {
            const highScores = await window.gameAPI.getHighScores();
            this.displayHighScores(highScores);
        } catch (error) {
            console.error('최고 점수 로드 오류:', error);
        }
    }

    // 최고 점수 표시
    displayHighScores(highScores) {
        const highScoresList = document.getElementById('highScoresList');
        highScoresList.innerHTML = '';
        
        if (highScores.length === 0) {
            highScoresList.innerHTML = '<p>아직 기록이 없습니다.</p>';
            return;
        }
        
        highScores.forEach((score, index) => {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'high-score-item';
            
            const timeString = this.formatTime(score.game_duration_seconds || score.time_taken);
            const attempts = score.attempts || score.moves || 0;
            scoreItem.innerHTML = `
                <span>${index + 1}. ${score.player_name}</span>
                <span>${score.score}점 (${timeString}, ${attempts}회)</span>
            `;
            
            highScoresList.appendChild(scoreItem);
        });
    }

    // 시간 포맷팅
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // 디스플레이 업데이트
    updateDisplay() {
        document.getElementById('score').textContent = this.calculateScore();
        document.getElementById('moves').textContent = this.moves;
        this.updateProgressBar();
    }
    
    // 진행률 표시 업데이트
    updateProgressBar() {
        const progress = (this.matchedPairs / this.symbols.length) * 100;
        const progressBar = document.querySelector('.progress-fill');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }

    // 이벤트 바인딩
    bindEvents() {
        // 게임 시작 버튼
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });

        // 게임 재시작 버튼
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });

        // 점수 저장 버튼
        document.getElementById('saveScoreBtn').addEventListener('click', () => {
            const playerName = document.getElementById('playerName').value.trim();
            if (playerName) {
                this.saveScore(playerName);
                this.hideGameOverModal();
            } else {
                alert('이름을 입력해주세요.');
            }
        });

        // 다시 플레이 버튼
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.hideGameOverModal();
            this.resetGame();
        });

        // 모달 외부 클릭 시 닫기
        document.getElementById('gameOverModal').addEventListener('click', (e) => {
            if (e.target.id === 'gameOverModal') {
                this.hideGameOverModal();
            }
        });

        // Enter 키로 점수 저장
        document.getElementById('playerName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('saveScoreBtn').click();
            }
        });
    }
}

// 게임 인스턴스 생성 (페이지 로드 후)
document.addEventListener('DOMContentLoaded', () => {
    // Supabase 연결 확인 후 게임 시작
    setTimeout(() => {
        new MemoryGame();
    }, 1000);
});
