// 자동 생성된 설정 파일 (build.js에 의해 생성됨)
// 이 파일은 빌드 시 자동으로 생성되므로 수동으로 편집하지 마세요.

window.config = {
    supabase: {
        url: 'https://zfqmaxifaeuhsrfotphc.supabase.co',
        anonKey: 'YOUR_ANON_KEY_HERE'
    }
};

// 환경변수 가져오기 함수
function getEnvVar(name, defaultValue = '') {
    return window.config?.supabase?.[name] || defaultValue;
}

// 보안 경고
if (!window.config.supabase.anonKey || window.config.supabase.anonKey === 'YOUR_ANON_KEY_HERE') {
    console.warn('⚠️  보안 경고: Supabase API 키가 설정되지 않았습니다.');
    console.warn('   환경변수 SUPABASE_ANON_KEY를 설정하거나 .env 파일을 확인하세요.');
}

console.log('✅ config.js가 성공적으로 생성되었습니다.');
