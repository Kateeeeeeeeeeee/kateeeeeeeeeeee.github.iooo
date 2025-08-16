// 환경변수 설정
const config = {
    // Supabase 설정
    supabase: {
        url: getEnvVar('SUPABASE_URL', 'https://zfqmaxifaeuhsrfotphc.supabase.co'),
        anonKey: getEnvVar('SUPABASE_ANON_KEY', 'YOUR_ANON_KEY_HERE')
    }
};

// 환경변수 가져오기 함수
function getEnvVar(name, defaultValue) {
    // 브라우저 환경에서는 window 객체에서 가져오기
    if (typeof window !== 'undefined' && window.ENV && window.ENV[name]) {
        return window.ENV[name];
    }
    
    // Node.js 환경에서는 process.env에서 가져오기
    if (typeof process !== 'undefined' && process.env && process.env[name]) {
        return process.env[name];
    }
    
    return defaultValue;
}

// 보안 경고
if (config.supabase.anonKey === 'YOUR_ANON_KEY_HERE') {
    console.warn('⚠️ 보안 경고: Supabase API 키가 설정되지 않았습니다.');
    console.warn('📝 설정 방법:');
    console.warn('   1. .env 파일에 SUPABASE_ANON_KEY를 설정하세요');
    console.warn('   2. 또는 배포 플랫폼의 환경변수에 설정하세요');
    console.warn('   3. 현재는 로컬 스토리지를 사용합니다.');
}

// 전역으로 노출
window.config = config;
