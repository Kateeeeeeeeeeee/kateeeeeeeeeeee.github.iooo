# 🎴 카드 뒤집기 게임 (Memory Game)

간단한 웹 기술(HTML, CSS, JavaScript)로 만든 카드 뒤집기 게임입니다. Supabase를 사용하여 최고 점수를 저장하고 관리합니다.

## 🎮 게임 특징

- **16장의 카드** (8쌍의 매칭 카드)
- **실시간 점수 계산** (시간, 이동 횟수 기반)
- **최고 점수 기록** (Supabase 데이터베이스 연동)
- **반응형 디자인** (모바일/데스크톱 지원)
- **아름다운 애니메이션** (카드 뒤집기 효과)

## 🚀 시작하기

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd supa_game
```

### 2. Supabase 설정 (선택사항)

게임을 완전히 작동시키려면 Supabase 프로젝트를 설정하세요:

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL 편집기에서 다음 테이블 생성:

```sql
CREATE TABLE game_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name VARCHAR NOT NULL,
  score INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  matched_pairs INTEGER NOT NULL,
  total_pairs INTEGER NOT NULL,
  game_duration_seconds INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIME DEFAULT NOW()
);
```

3. 환경변수 설정:
   - `env.example` 파일을 `.env`로 복사
   - `.env` 파일에 실제 API 키 입력:
   ```
   SUPABASE_URL=https://your-project-url.supabase.co
   SUPABASE_ANON_KEY=your-actual-anon-key
   ```

**보안 주의사항:**
- `.env` 파일은 절대 Git에 커밋하지 마세요
- 배포 시에는 배포 플랫폼의 환경변수에 설정하세요

### 3. 로컬 서버 실행

간단한 HTTP 서버로 실행하세요:

```bash
# Python 3
python -m http.server 8000

# 또는 Node.js
npx http-server

# 또는 PHP
php -S localhost:8000
```

4. 브라우저에서 `http://localhost:8000` 접속

## 🎯 게임 규칙

1. **게임 시작**: "게임 시작" 버튼을 클릭
2. **카드 매칭**: 같은 심볼의 카드 2장을 찾아 클릭
3. **점수 계산**: 
   - 기본 점수: 1000점
   - 시간 보너스: 빠를수록 높은 점수
   - 이동 페널티: 클릭할 때마다 10점 차감
   - 매칭 보너스: 매칭할 때마다 100점 추가
4. **게임 완료**: 모든 카드를 매칭하면 완료
5. **점수 저장**: 이름을 입력하고 최고 점수에 기록

## 🛠 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL)
- **스타일링**: CSS Grid, Flexbox, CSS Animations
- **배포**: 정적 웹 호스팅 (GitHub Pages, Netlify 등)

## 📁 프로젝트 구조

```
supa_game/
├── index.html          # 메인 게임 페이지
├── styles.css          # 게임 스타일
├── script.js           # 게임 로직
├── supabase.js         # Supabase 연결 및 API
└── README.md           # 프로젝트 설명
```

## 🎨 주요 기능

### 게임 로직
- 카드 셔플 알고리즘 (Fisher-Yates)
- 매칭 검증 시스템
- 실시간 점수 계산
- 타이머 기능

### 사용자 경험
- 부드러운 카드 뒤집기 애니메이션
- 반응형 디자인
- 직관적인 UI/UX
- 게임 완료 축하 모달

### 데이터 관리
- 로컬 스토리지 백업 (Supabase 연결 실패 시)
- 실시간 최고 점수 업데이트
- 점수 저장/조회 API

## 🔧 커스터마이징

### 카드 심볼 변경
`script.js`에서 `symbols` 배열을 수정:

```javascript
this.symbols = ['🦄', '🐲', '🦋', '🌸', '⭐', '🌙', '☀️', '🌈'];
```

### 게임 보드 크기 변경
`styles.css`에서 그리드 설정 수정:

```css
.game-board {
    grid-template-columns: repeat(5, 1fr); /* 5x5 그리드 */
}
```

### 점수 계산 방식 변경
`script.js`의 `calculateScore()` 메서드 수정

## 🚀 배포

### GitHub Pages
1. GitHub 저장소에 코드 푸시
2. Settings > Pages에서 배포 설정
3. `https://username.github.io/repository-name` 접속

### Netlify
1. Netlify에 GitHub 저장소 연결
2. 자동 배포 설정
3. 커스텀 도메인 설정 (선택사항)

## 🐛 문제 해결

### Supabase 연결 실패
- API 키와 URL이 올바른지 확인
- 네트워크 연결 상태 확인
- 브라우저 콘솔에서 오류 메시지 확인

### 카드가 뒤집히지 않음
- JavaScript 콘솔에서 오류 확인
- CSS 애니메이션 지원 여부 확인

### 점수가 저장되지 않음
- Supabase 테이블 권한 설정 확인
- 브라우저 로컬 스토리지 확인

## 📝 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 연락처

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해주세요!

---

**즐거운 게임 되세요! 🎮✨**
