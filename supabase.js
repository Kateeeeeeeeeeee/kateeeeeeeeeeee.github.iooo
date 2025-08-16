// Supabase 설정
// config.js에서 설정을 가져옴
const SUPABASE_URL = window.config?.supabase?.url || 'https://zfqmaxifaeuhsrfotphc.supabase.co';
const SUPABASE_ANON_KEY = window.config?.supabase?.anonKey || 'YOUR_ANON_KEY_HERE';

// Supabase 클라이언트 초기화
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 데이터베이스 API 함수들
const dbAPI = {
    // 최고 점수 저장
    async saveHighScore(playerName, score, timeTaken, attempts, matchedPairs, totalPairs) {
        try {
            console.log('점수 저장 시도:', {
                player_name: playerName,
                score: score,
                game_duration_seconds: timeTaken,
                attempts: attempts,
                matched_pairs: matchedPairs,
                total_pairs: totalPairs
            });
            
            const { data, error } = await supabase
                .from('game_scores')
                .insert([
                    {
                        player_name: playerName,
                        score: score,
                        game_duration_seconds: timeTaken,
                        attempts: attempts,
                        matched_pairs: matchedPairs,
                        total_pairs: totalPairs
                    }
                ])
                .select();

            if (error) {
                console.error('점수 저장 오류:', error);
                console.error('오류 코드:', error.code);
                console.error('오류 메시지:', error.message);
                console.error('오류 상세:', error.details);
                throw error;
            }

            console.log('점수 저장 성공:', data[0]);
            return data[0];
        } catch (error) {
            console.error('점수 저장 실패:', error);
            throw error;
        }
    },

    // 최고 점수 조회 (상위 10개)
    async getHighScores() {
        try {
            const { data, error } = await supabase
                .from('game_scores')
                .select('*')
                .order('score', { ascending: false })
                .limit(10);

            if (error) {
                console.error('점수 조회 오류:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('점수 조회 실패:', error);
            return [];
        }
    },

    // 실시간 최고 점수 업데이트 구독
    subscribeToHighScores(callback) {
        return supabase
            .channel('game_scores_changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'game_scores' },
                (payload) => {
                    callback(payload);
                }
            )
            .subscribe();
    }
};

// 개발용 모의 데이터 (Supabase 연결 전 테스트용)
const mockAPI = {
    async saveHighScore(playerName, score, timeTaken, attempts, matchedPairs, totalPairs) {
        // 로컬 스토리지에 저장
        const highScores = JSON.parse(localStorage.getItem('highScores') || '[]');
        const newScore = {
            id: Date.now(),
            player_name: playerName,
            score: score,
            game_duration_seconds: timeTaken,
            attempts: attempts,
            matched_pairs: matchedPairs,
            total_pairs: totalPairs,
            created_at: new Date().toISOString()
        };
        
        highScores.push(newScore);
        highScores.sort((a, b) => b.score - a.score);
        
        // 상위 10개만 유지
        const topScores = highScores.slice(0, 10);
        localStorage.setItem('highScores', JSON.stringify(topScores));
        
        return newScore;
    },

    async getHighScores() {
        const highScores = JSON.parse(localStorage.getItem('highScores') || '[]');
        return highScores;
    },

    subscribeToHighScores(callback) {
        // 모의 환경에서는 구독 기능 없음
        return null;
    }
};

// Supabase 연결 상태 확인 및 API 선택
let isSupabaseConnected = false;

async function checkSupabaseConnection() {
    try {
        // 간단한 연결 테스트
        const { data, error } = await supabase.from('game_scores').select('count').limit(1);
        isSupabaseConnected = !error;
        console.log('Supabase 연결 상태:', isSupabaseConnected ? '성공' : '실패');
        
        if (error) {
            console.error('Supabase 연결 오류 상세:', error);
        }
        
        // 테이블 구조 확인
        const { data: tableInfo, error: tableError } = await supabase
            .from('game_scores')
            .select('*')
            .limit(0);
            
        if (tableError) {
            console.error('테이블 접근 오류:', tableError);
        } else {
            console.log('테이블 접근 성공');
        }
        
    } catch (error) {
        console.log('Supabase 연결 실패, 모의 데이터 사용:', error);
        isSupabaseConnected = false;
    }
}

// 사용할 API 결정 (초기에는 모의 데이터 사용)
let api = mockAPI;

// 초기 연결 확인 후 API 업데이트
async function initializeAPI() {
    console.log('Supabase 초기화 시작...');
    console.log('URL:', SUPABASE_URL);
    console.log('API Key:', SUPABASE_ANON_KEY.substring(0, 20) + '...');
    
    try {
        await checkSupabaseConnection();
        if (isSupabaseConnected) {
            api = dbAPI;
            console.log('✅ Supabase 연결 성공 - 실제 데이터베이스 사용');
        } else {
            api = mockAPI;
            console.log('⚠️ Supabase 연결 실패 - 로컬 스토리지 사용');
        }
    } catch (error) {
        console.error('❌ Supabase 초기화 오류:', error);
        api = mockAPI;
        console.log('🔄 로컬 스토리지로 대체');
    }
    
    // 전역 API 업데이트
    window.gameAPI = api;
}

// 전역으로 API 노출 (초기값)
window.gameAPI = mockAPI;

// 초기화 실행
initializeAPI();
