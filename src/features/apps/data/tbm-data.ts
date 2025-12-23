// ----------------------------------------------------------------------
// TBM 문서 공통 타입 및 Mock 데이터
// Admin과 Worker가 공유합니다.
// ----------------------------------------------------------------------

export type TranslationStatus = 'completed' | 'processing' | 'failed'

export interface Translation {
    langCode: string // 'EN', 'VN', 'CN', etc.
    status: TranslationStatus
    translatedAt?: string
    pdfUrl?: string // 번역된 PDF URL (백엔드에서 제공)
}

export interface TbmDocument {
    id: string
    title: string
    thumbnailUrl?: string // 썸네일 이미지 URL
    pdfUrl: string // 원본 PDF URL
    siteName: string // 현장명
    author: string // 작성자
    createdAt: string // 작성일
    status: 'draft' | 'published' | 'archived'
    translations: Translation[] // 번역된 언어 목록
}

// ----------------------------------------------------------------------
// [Mock Data] 가상 데이터 생성
// ----------------------------------------------------------------------
// [Backend Integration Guide] 실제 연동 시 pdfUrl과 translations[].pdfUrl은 
// 백엔드 서버에서 제공하는 S3/GCS 등의 URL로 대체됩니다.
export const SAMPLE_PDF_URL = '/documents/TBM회의록(양식).pdf'

export const MOCK_TBM_DATA: TbmDocument[] = [
    {
        id: 'TBM-20251205-01',
        title: '12월 5일 A구역 고소작업 안전 교육',
        pdfUrl: SAMPLE_PDF_URL,
        siteName: '평택 P4 현장',
        author: '김안전 관리자',
        createdAt: '2025-12-05',
        status: 'published',
        translations: [
            { langCode: 'EN', status: 'completed', pdfUrl: SAMPLE_PDF_URL },
            { langCode: 'VN', status: 'completed', pdfUrl: SAMPLE_PDF_URL },
        ],
    },
    {
        id: 'TBM-20251205-02',
        title: '용접 작업 화재 예방 수칙',
        pdfUrl: SAMPLE_PDF_URL,
        siteName: '천안 2공구',
        author: '이공사 팀장',
        createdAt: '2025-12-04',
        status: 'published',
        translations: [
            { langCode: 'CN', status: 'failed' },
        ],
    },
    {
        id: 'TBM-20251205-03',
        title: '동절기 미끄러짐 사고 예방',
        pdfUrl: SAMPLE_PDF_URL,
        siteName: '서울 본사 현장',
        author: '박현장 소장',
        createdAt: '2025-12-03',
        status: 'published',
        translations: [],
    },
    {
        id: 'TBM-20251205-04',
        title: '밀폐공간 작업 절차서',
        pdfUrl: SAMPLE_PDF_URL,
        siteName: '부산 에코델타',
        author: '최관리',
        createdAt: '2025-12-01',
        status: 'published',
        translations: [
            { langCode: 'EN', status: 'completed', pdfUrl: SAMPLE_PDF_URL },
            { langCode: 'VN', status: 'processing' },
        ],
    },
]

export const SUPPORTED_LANGUAGES = ['EN', 'VN', 'CN', 'RU', 'TH']
