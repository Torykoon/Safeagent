import { useState, useEffect } from 'react'
import {
  Search as SearchIcon,
  LayoutGrid,
  List as ListIcon,
  Plus,
  FileText,
  Download,
  Printer,
  Loader2,
  Maximize2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner' // Shadcn의 Toast 라이브러리 (보통 sonner 사용)

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

// ----------------------------------------------------------------------
// [Backend Integration Guide] 1. 데이터 구조 정의
// 실제 백엔드 연동 시, 이 인터페이스에 맞춰 API 응답을 매핑하세요.
// ----------------------------------------------------------------------

type TranslationStatus = 'completed' | 'processing' | 'failed'

interface Translation {
  langCode: string // 'EN', 'VN', 'CN', etc.
  status: TranslationStatus
  translatedAt?: string
  pdfUrl?: string // 번역된 PDF URL (백엔드에서 제공)
}

interface TbmDocument {
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
const SAMPLE_PDF_URL = '/documents/TBM회의록(양식).pdf'

const MOCK_DATA: TbmDocument[] = [
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
      { langCode: 'CN', status: 'failed' }, // 실패 케이스 테스트용
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
      { langCode: 'VN', status: 'processing' }, // 초기 로딩 테스트용
    ],
  },
]

const SUPPORTED_LANGUAGES = ['EN', 'VN', 'CN', 'RU', 'TH']

export function Apps() {
  // ----------------------------------------------------------------------
  // State Management
  // ----------------------------------------------------------------------
  const [documents, setDocuments] = useState<TbmDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  // Viewer Modal State
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<TbmDocument | null>(null)
  const [targetLang, setTargetLang] = useState<string>('EN')

  // ----------------------------------------------------------------------
  // [Backend Integration Guide] 2. 데이터 페칭 (초기 로딩 시뮬레이션)
  // useEffect(() => {
  //   fetch('/api/tbm/documents').then(res => res.json()).then(data => setDocuments(data));
  // }, []);
  // ----------------------------------------------------------------------
  useEffect(() => {
    // 스켈레톤 UI를 보여주기 위한 인위적 지연
    const timer = setTimeout(() => {
      setDocuments(MOCK_DATA)
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // ----------------------------------------------------------------------
  // Actions: 번역 요청 시뮬레이션 (Optimistic UI)
  // ----------------------------------------------------------------------
  const handleRequestTranslation = (docId: string, langCode: string) => {
    // 1. UI에 즉시 반영 (Processing 상태)
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          // 이미 존재하면 무시
          if (doc.translations.some((t) => t.langCode === langCode)) return doc
          return {
            ...doc,
            translations: [
              ...doc.translations,
              { langCode, status: 'processing' as TranslationStatus },
            ],
          }
        }
        return doc
      })
    )

    // 2. [Backend Integration Guide] 백엔드 요청
    // await axios.post(`/api/tbm/${docId}/translate`, { targetLang: langCode });

    // 3. 가상의 서버 처리 완료 (3초 후)
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((doc) => {
          if (doc.id === docId) {
            return {
              ...doc,
              translations: doc.translations.map((t) =>
                t.langCode === langCode ? { ...t, status: 'completed' } : t
              ),
            }
          }
          return doc
        })
      )
      // Toast 알림
      toast.success('번역 완료', {
        description: `${docId} 문서의 ${langCode}어 변환이 완료되었습니다.`,
      })
    }, 3000)
  }

  const openViewer = (doc: TbmDocument, lang: string) => {
    setSelectedDoc(doc)
    setTargetLang(lang)
    setViewerOpen(true)
  }

  // 필터링 로직 (간단한 구현)
  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.siteName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Header fixed>
        <div className='flex w-full items-center justify-between gap-4 px-4'>
          {/* 왼쪽: 타이틀 & 검색 */}
          <div className='flex items-center gap-4'>
            <h1 className='text-2xl font-bold tracking-tight'>TBM 문서 관리</h1>
            <div className='relative hidden md:block w-64'>
              <SearchIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='제목, 현장명 검색...'
                className='pl-8 h-9 bg-background'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* 오른쪽: 컨트롤 (필터, 뷰모드, 프로필) */}
          <div className='flex items-center gap-2'>
            <Select defaultValue="latest">
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">최신순</SelectItem>
                <SelectItem value="site">현장별</SelectItem>
                <SelectItem value="author">작성자별</SelectItem>
              </SelectContent>
            </Select>

            <div className='flex items-center rounded-md border bg-background p-1'>
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size='icon'
                className='h-7 w-7 rounded-sm'
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size='icon'
                className='h-7 w-7 rounded-sm'
                onClick={() => setViewMode('list')}
              >
                <ListIcon size={16} />
              </Button>
            </div>

            <div className="ml-2 flex items-center gap-2">
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </Header>

      <Main fixed>
        <div className='p-4 h-full overflow-y-auto'>
          {/* 로딩 상태: 스켈레톤 UI */}
          {isLoading ? (
            <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='space-y-3'>
                  <Skeleton className='aspect-[1/1.414] w-full rounded-xl' />
                  <Skeleton className='h-4 w-2/3' />
                  <Skeleton className='h-4 w-1/2' />
                </div>
              ))}
            </div>
          ) : viewMode === 'grid' ? (
            // 그리드 뷰 (Masonry/Card Grid)
            <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-20'>
              {filteredDocs.map((doc) => (
                <TbmCard
                  key={doc.id}
                  doc={doc}
                  supportedLangs={SUPPORTED_LANGUAGES}
                  onTranslate={handleRequestTranslation}
                  onOpenViewer={openViewer}
                />
              ))}
            </div>
          ) : (
            // 리스트 뷰 (간단한 테이블 형태 대체)
            <div className="rounded-md border bg-card">
              <div className="p-8 text-center text-muted-foreground">
                테이블 뷰는 준비 중입니다. (그리드 뷰를 확인해주세요)
              </div>
            </div>
          )}
        </div>
      </Main>

      {/* 비교 뷰어 (Split View Modal) */}
      <SplitViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        doc={selectedDoc}
        targetLang={targetLang}
      />
    </>
  )
}

// ----------------------------------------------------------------------
// Components: TBM 문서 카드
// ----------------------------------------------------------------------

interface TbmCardProps {
  doc: TbmDocument
  supportedLangs: string[]
  onTranslate: (id: string, lang: string) => void
  onOpenViewer: (doc: TbmDocument, lang: string) => void
}

function TbmCard({ doc, supportedLangs, onTranslate, onOpenViewer }: TbmCardProps) {
  return (
    <Card className='group relative flex flex-col overflow-hidden border-border/50 transition-all hover:shadow-lg hover:border-primary/50'>
      {/* 1. Visual Thumbnail Area (A4 비율 유지) */}
      <div className='relative aspect-[1/1.414] w-full bg-muted/30 overflow-hidden'>
        {doc.thumbnailUrl ? (
          <img
            src={doc.thumbnailUrl}
            alt={doc.title}
            className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
        ) : (
          <div className='flex h-full w-full flex-col items-center justify-center text-muted-foreground/30'>
            <FileText size={64} strokeWidth={1} />
            <p className='mt-2 text-xs font-medium'>Preview Not Available</p>
          </div>
        )}

        {/* Hover Overlay */}
        <div className='absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2'>
          <Button variant="secondary" size="sm" onClick={() => onOpenViewer(doc, 'KR')}>
            <Maximize2 className="mr-2 h-4 w-4" /> 상세 보기
          </Button>
        </div>
      </div>

      {/* 2. Info Section */}
      <CardContent className='p-4'>
        <div className='mb-2 flex items-center justify-between'>
          <span className='text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded'>
            {doc.siteName}
          </span>
          <span className='text-xs text-muted-foreground'>{doc.createdAt}</span>
        </div>
        <h3 className='line-clamp-1 text-base font-semibold leading-tight' title={doc.title}>
          {doc.title}
        </h3>
        <p className='text-xs text-muted-foreground mt-1'>{doc.author}</p>
      </CardContent>

      <Separator />

      {/* 3. Translation Management (Badge Group) */}
      <CardFooter className='p-3 bg-muted/20 flex flex-wrap gap-2 items-center min-h-[50px]'>
        {/* 기본 언어 */}
        <Badge variant='secondary' className='cursor-pointer hover:bg-secondary/80'>
          KR
        </Badge>

        {/* 변환된 언어들 */}
        {doc.translations.map((t) => (
          <Badge
            key={t.langCode}
            variant={t.status === 'failed' ? 'destructive' : 'default'}
            className={`
                relative cursor-pointer transition-all
                ${t.status === 'processing' ? 'animate-pulse bg-primary/70 pr-6' : 'hover:bg-primary/80'}
                ${t.status === 'completed' ? 'bg-primary' : ''}
            `}
            onClick={() => t.status === 'completed' && onOpenViewer(doc, t.langCode)}
          >
            {t.langCode}
            {t.status === 'processing' && (
              <Loader2 className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 animate-spin" />
            )}
            {t.status === 'failed' && (
              <AlertCircle className="ml-1 h-3 w-3" />
            )}
          </Badge>
        ))}

        {/* 언어 추가 버튼 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full border border-dashed ml-auto hover:border-primary hover:text-primary">
              <Plus size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {supportedLangs.map(lang => {
              const isExist = doc.translations.some(t => t.langCode === lang);
              return (
                <DropdownMenuItem
                  key={lang}
                  disabled={isExist}
                  onClick={() => onTranslate(doc.id, lang)}
                >
                  <span>{lang} 변환 추가</span>
                  {isExist && <CheckCircle2 className="ml-2 h-3 w-3" />}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}

// ----------------------------------------------------------------------
// Components: Split View Modal (비교 뷰어)
// ----------------------------------------------------------------------

interface SplitViewerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  doc: TbmDocument | null
  targetLang: string
}

function SplitViewer({ open, onOpenChange, doc, targetLang }: SplitViewerProps) {
  if (!doc) return null;

  // 번역된 PDF URL 가져오기 (없으면 원본 사용 - 데모용)
  const translatedDoc = doc.translations.find(t => t.langCode === targetLang);
  const translatedPdfUrl = translatedDoc?.pdfUrl || doc.pdfUrl;
  const isTranslationReady = translatedDoc?.status === 'completed';

  // PDF 다운로드 핸들러
  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  // 인쇄 핸들러
  const handlePrint = (url: string) => {
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0 bg-muted/30">
          <div className="flex flex-col">
            <DialogTitle>{doc.title}</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {doc.siteName} | {doc.author}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePrint(doc.pdfUrl)}
            >
              <Printer className="mr-2 h-4 w-4" /> 인쇄
            </Button>
            <Button
              size="sm"
              onClick={() => handleDownload(
                targetLang === 'KR' ? doc.pdfUrl : translatedPdfUrl,
                `${doc.title}_${targetLang}.pdf`
              )}
            >
              <Download className="mr-2 h-4 w-4" /> {targetLang} PDF 다운로드
            </Button>
          </div>
        </DialogHeader>

        {/* Body - Split View */}
        <div className="flex-1 grid grid-cols-2 divide-x h-full overflow-hidden">
          {/* Left: Original (KR) */}
          <div className="flex flex-col h-full bg-background">
            <div className="p-2 bg-muted/50 text-xs font-bold text-center border-b uppercase">
              Original (KR)
            </div>
            <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-zinc-900">
              {/* PDF Viewer - iframe 사용 */}
              <iframe
                src={`${doc.pdfUrl}#toolbar=1&navpanes=0`}
                className="w-full h-full border-0"
                title={`${doc.title} - Original`}
              />
            </div>
          </div>

          {/* Right: Translated (Target Lang) */}
          <div className="flex flex-col h-full bg-background">
            <div className="p-2 bg-blue-50/50 dark:bg-blue-950/20 text-xs font-bold text-center border-b uppercase text-primary">
              Translated ({targetLang})
            </div>
            <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-zinc-900">
              {targetLang === 'KR' ? (
                // 원본 언어 선택 시 동일 문서 표시
                <iframe
                  src={`${doc.pdfUrl}#toolbar=1&navpanes=0`}
                  className="w-full h-full border-0"
                  title={`${doc.title} - Original`}
                />
              ) : isTranslationReady ? (
                // 번역 완료 시 번역된 PDF 표시
                <iframe
                  src={`${translatedPdfUrl}#toolbar=1&navpanes=0`}
                  className="w-full h-full border-0"
                  title={`${doc.title} - ${targetLang}`}
                />
              ) : (
                // 번역 미완료 시 플레이스홀더
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  {translatedDoc?.status === 'processing' ? (
                    <>
                      <Loader2 className="h-12 w-12 animate-spin mb-4" />
                      <p className="text-lg font-medium">번역 중...</p>
                      <p className="text-sm mt-2">{targetLang}어로 변환하고 있습니다</p>
                    </>
                  ) : translatedDoc?.status === 'failed' ? (
                    <>
                      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                      <p className="text-lg font-medium text-destructive">번역 실패</p>
                      <p className="text-sm mt-2">다시 시도해 주세요</p>
                    </>
                  ) : (
                    <>
                      <FileText className="h-12 w-12 mb-4" />
                      <p className="text-lg font-medium">번역 문서 없음</p>
                      <p className="text-sm mt-2">{targetLang}어 번역을 먼저 요청해 주세요</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}