import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { type RiskData } from '../data/api-types'

interface RiskDetailDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    riskData: RiskData | null
}

export function RiskDetailDialog({
    open,
    onOpenChange,
    riskData,
}: RiskDetailDialogProps) {
    if (!riskData) return null

    const { content, metadata } = riskData

    // Get risk level color
    const getRiskLevelColor = (level: string) => {
        switch (level) {
            case '상':
                return 'bg-red-500/10 text-red-700 border-red-200'
            case '중':
                return 'bg-amber-500/10 text-amber-700 border-amber-200'
            case '하':
                return 'bg-green-500/10 text-green-700 border-green-200'
            default:
                return 'bg-muted text-muted-foreground'
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-2xl max-h-[80vh]'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <span>위험요인 상세 정보</span>
                        <Badge className={getRiskLevelColor(metadata.위험등급)}>
                            위험등급: {metadata.위험등급}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className='max-h-[60vh] pr-4'>
                    <div className='space-y-4'>
                        {/* Metadata Info */}
                        <div className='grid grid-cols-2 gap-3 text-sm'>
                            {metadata.현장명 && (
                                <div>
                                    <span className='text-muted-foreground'>현장명:</span>{' '}
                                    <span className='font-medium'>{metadata.현장명}</span>
                                </div>
                            )}
                            {metadata.공종명 && (
                                <div>
                                    <span className='text-muted-foreground'>공종명:</span>{' '}
                                    <span className='font-medium'>{metadata.공종명}</span>
                                </div>
                            )}
                            {metadata.세부공종 && (
                                <div>
                                    <span className='text-muted-foreground'>세부공종:</span>{' '}
                                    <span className='font-medium'>{metadata.세부공종}</span>
                                </div>
                            )}
                            {metadata.단위작업 && (
                                <div>
                                    <span className='text-muted-foreground'>단위작업:</span>{' '}
                                    <span className='font-medium'>{metadata.단위작업}</span>
                                </div>
                            )}
                            {(metadata.재해유형 || metadata.재해유형명) && (
                                <div>
                                    <span className='text-muted-foreground'>재해유형:</span>{' '}
                                    <span className='font-medium'>
                                        {metadata.재해유형 || metadata.재해유형명}
                                    </span>
                                </div>
                            )}
                            {metadata.작업장소 && (
                                <div>
                                    <span className='text-muted-foreground'>작업장소:</span>{' '}
                                    <span className='font-medium'>{metadata.작업장소}</span>
                                </div>
                            )}
                            {metadata.적용년월 && (
                                <div>
                                    <span className='text-muted-foreground'>적용년월:</span>{' '}
                                    <span className='font-medium'>{metadata.적용년월}</span>
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Content */}
                        <div>
                            <h4 className='text-sm font-medium mb-2'>상세 내용</h4>
                            <div className='bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap'>
                                {content}
                            </div>
                        </div>

                        {/* Source Info */}
                        {metadata.파일명 && (
                            <>
                                <Separator />
                                <div className='text-xs text-muted-foreground'>
                                    <span>출처: {metadata.파일명}</span>
                                    {metadata.source && <span> ({metadata.source})</span>}
                                </div>
                            </>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
