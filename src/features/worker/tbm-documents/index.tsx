import { useState, useEffect } from 'react'
import {
    Search as SearchIcon,
    FileText,
    Download,
    Maximize2,
    Calendar,
    MapPin,
    User,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

import { type TbmDocument, MOCK_TBM_DATA } from '@/features/apps/data/tbm-data'

// ----------------------------------------------------------------------
// Worker용 TBM 문서 확인 페이지
// - 읽기 전용 (번역 요청 기능 없음)
// - 깔끔하고 단순한 UI
// ----------------------------------------------------------------------

export function WorkerTbmDocuments() {
    const [documents, setDocuments] = useState<TbmDocument[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    // PDF Viewer Modal State
    const [viewerOpen, setViewerOpen] = useState(false)
    const [selectedDoc, setSelectedDoc] = useState<TbmDocument | null>(null)

    // 데이터 로딩
    useEffect(() => {
        const timer = setTimeout(() => {
            setDocuments(MOCK_TBM_DATA)
            setIsLoading(false)
        }, 800)
        return () => clearTimeout(timer)
    }, [])

    // 검색 필터링
    const filteredDocs = documents.filter(
        (doc) =>
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.siteName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // PDF 뷰어 열기
    const openViewer = (doc: TbmDocument) => {
        setSelectedDoc(doc)
        setViewerOpen(true)
    }

    // PDF 다운로드
    const handleDownload = (url: string, filename: string) => {
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.click()
    }

    return (
        <>
            <Header fixed>
                <div className='flex w-full items-center justify-between gap-4 px-4'>
                    {/* 왼쪽: 타이틀 & 검색 */}
                    <div className='flex items-center gap-4'>
                        <h1 className='text-2xl font-bold tracking-tight'>TBM 문서 확인</h1>
                        <div className='relative hidden md:block w-72'>
                            <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                            <Input
                                type='search'
                                placeholder='문서 제목 또는 현장명으로 검색...'
                                className='pl-9 h-10 bg-background'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* 오른쪽: 프로필 */}
                    <div className='flex items-center gap-2'>
                        <ThemeSwitch />
                        <ProfileDropdown />
                    </div>
                </div>
            </Header>

            <Main fixed>
                <div className='p-6 h-full overflow-y-auto'>
                    {/* 로딩 스켈레톤 */}
                    {isLoading ? (
                        <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className='h-40 w-full rounded-xl' />
                            ))}
                        </div>
                    ) : filteredDocs.length === 0 ? (
                        // 검색 결과 없음
                        <div className='flex flex-col items-center justify-center h-64 text-muted-foreground'>
                            <FileText className='h-16 w-16 mb-4 opacity-30' />
                            <p className='text-lg font-medium'>문서를 찾을 수 없습니다</p>
                            <p className='text-sm mt-1'>다른 검색어를 입력해보세요</p>
                        </div>
                    ) : (
                        // 문서 그리드
                        <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-8'>
                            {filteredDocs.map((doc) => (
                                <WorkerDocCard
                                    key={doc.id}
                                    doc={doc}
                                    onView={openViewer}
                                    onDownload={handleDownload}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </Main>

            {/* PDF 뷰어 모달 */}
            <PdfViewerModal
                open={viewerOpen}
                onOpenChange={setViewerOpen}
                doc={selectedDoc}
                onDownload={handleDownload}
            />
        </>
    )
}

// ----------------------------------------------------------------------
// Worker용 문서 카드 (단순화된 디자인)
// ----------------------------------------------------------------------

interface WorkerDocCardProps {
    doc: TbmDocument
    onView: (doc: TbmDocument) => void
    onDownload: (url: string, filename: string) => void
}

function WorkerDocCard({ doc, onView, onDownload }: WorkerDocCardProps) {
    return (
        <Card className='group relative overflow-hidden border-border/50 transition-all hover:shadow-lg hover:border-primary/30 bg-card'>
            <CardContent className='p-5'>
                {/* 상단: 현장명 & 날짜 */}
                <div className='flex items-center justify-between mb-3'>
                    <Badge variant='secondary' className='text-xs font-medium'>
                        <MapPin className='h-3 w-3 mr-1' />
                        {doc.siteName}
                    </Badge>
                    <span className='text-xs text-muted-foreground flex items-center gap-1'>
                        <Calendar className='h-3 w-3' />
                        {doc.createdAt}
                    </span>
                </div>

                {/* 제목 */}
                <h3
                    className='text-base font-semibold leading-snug line-clamp-2 mb-2 min-h-[2.5rem]'
                    title={doc.title}
                >
                    {doc.title}
                </h3>

                {/* 작성자 */}
                <p className='text-sm text-muted-foreground flex items-center gap-1 mb-4'>
                    <User className='h-3.5 w-3.5' />
                    {doc.author}
                </p>

                {/* 액션 버튼 */}
                <div className='flex items-center gap-2'>
                    <Button
                        variant='default'
                        size='sm'
                        className='flex-1'
                        onClick={() => onView(doc)}
                    >
                        <Maximize2 className='h-4 w-4 mr-2' />
                        상세 보기
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onDownload(doc.pdfUrl, `${doc.title}.pdf`)}
                    >
                        <Download className='h-4 w-4' />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

// ----------------------------------------------------------------------
// PDF 뷰어 모달 (단일 뷰)
// ----------------------------------------------------------------------

interface PdfViewerModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    doc: TbmDocument | null
    onDownload: (url: string, filename: string) => void
}

function PdfViewerModal({
    open,
    onOpenChange,
    doc,
    onDownload,
}: PdfViewerModalProps) {
    if (!doc) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-5xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden'>
                {/* 헤더 */}
                <DialogHeader className='p-4 border-b flex flex-row items-center justify-between space-y-0 bg-muted/30'>
                    <div className='flex flex-col'>
                        <DialogTitle className='text-lg'>{doc.title}</DialogTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                            {doc.siteName} • {doc.author} • {doc.createdAt}
                        </p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button
                            size='sm'
                            onClick={() => onDownload(doc.pdfUrl, `${doc.title}.pdf`)}
                        >
                            <Download className='h-4 w-4 mr-2' />
                            다운로드
                        </Button>
                    </div>
                </DialogHeader>

                {/* PDF 뷰어 */}
                <div className='flex-1 bg-gray-100 dark:bg-zinc-900 overflow-hidden'>
                    <iframe
                        src={`${doc.pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                        className='w-full h-full border-0'
                        title={doc.title}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
