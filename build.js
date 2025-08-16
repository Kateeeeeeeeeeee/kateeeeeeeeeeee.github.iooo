const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('🔨 빌드 시작...');

// 환경변수 확인
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zfqmaxifaeuhsrfotphc.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_ANON_KEY) {
    console.warn('⚠️  경고: SUPABASE_ANON_KEY가 설정되지 않았습니다.');
    console.warn('   .env 파일에 SUPABASE_ANON_KEY를 추가하거나 환경변수를 설정하세요.');
}

// config.js 내용 생성
const configContent = `// 자동 생성된 설정 파일 (build.js에 의해 생성됨)
// 이 파일은 빌드 시 자동으로 생성되므로 수동으로 편집하지 마세요.

window.config = {
    supabase: {
        url: '${SUPABASE_URL}',
        anonKey: '${SUPABASE_ANON_KEY || 'YOUR_ANON_KEY_HERE'}'
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
`;

// config.js 파일 작성
try {
    fs.writeFileSync(path.join(__dirname, 'config.js'), configContent);
    console.log('✅ config.js 파일이 생성되었습니다.');
    
    // 환경변수 상태 출력
    console.log('📋 환경변수 상태:');
    console.log(`   SUPABASE_URL: ${SUPABASE_URL}`);
    console.log(`   SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ? '✅ 설정됨' : '❌ 설정되지 않음'}`);
    
} catch (error) {
    console.error('❌ config.js 생성 중 오류 발생:', error.message);
    process.exit(1);
}

console.log('🎉 빌드 완료!');
