import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { type RiskData } from '../data/api-types'
import { RiskDetailDialog } from './risk-detail-dialog'

interface RiskChipProps {
    riskData: RiskData
}

export function RiskChip({ riskData }: RiskChipProps) {
    const [dialogOpen, setDialogOpen] = useState(false)

    const { metadata } = riskData

    // Get risk level variant
    const getRiskLevelVariant = (level: string) => {
        switch (level) {
            case '상':
                return 'destructive'
            case '중':
                return 'secondary'
            case '하':
                return 'outline'
            default:
                return 'secondary'
        }
    }

    // Get display text (shorter for chip)
    const displayText = metadata.세부공종 || metadata.단위작업 || '위험요인'
    const disasterType = metadata.재해유형 || metadata.재해유형명 || ''

    return (
        <>
            <Badge
                variant={getRiskLevelVariant(metadata.위험등급) as 'destructive' | 'secondary' | 'outline'}
                className='cursor-pointer hover:opacity-80 transition-opacity text-xs'
                onClick={() => setDialogOpen(true)}
            >
                {displayText}
                {disasterType && ` · ${disasterType}`}
                <span className='ms-1 opacity-70'>({metadata.위험등급})</span>
            </Badge>

            <RiskDetailDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                riskData={riskData}
            />
        </>
    )
}

interface RiskChipListProps {
    riskDataList: RiskData[]
    maxDisplay?: number
}

export function RiskChipList({ riskDataList, maxDisplay = 5 }: RiskChipListProps) {
    const [showAll, setShowAll] = useState(false)

    if (!riskDataList || riskDataList.length === 0) return null

    const displayList = showAll ? riskDataList : riskDataList.slice(0, maxDisplay)
    const remainingCount = riskDataList.length - maxDisplay

    return (
        <div className='flex flex-wrap gap-1.5 mt-2'>
            {displayList.map((riskData, index) => (
                <RiskChip key={riskData.metadata._id || index} riskData={riskData} />
            ))}
            {!showAll && remainingCount > 0 && (
                <Badge
                    variant='outline'
                    className='cursor-pointer hover:bg-muted transition-colors text-xs'
                    onClick={() => setShowAll(true)}
                >
                    +{remainingCount}개 더보기
                </Badge>
            )}
            {showAll && riskDataList.length > maxDisplay && (
                <Badge
                    variant='outline'
                    className='cursor-pointer hover:bg-muted transition-colors text-xs'
                    onClick={() => setShowAll(false)}
                >
                    접기
                </Badge>
            )}
        </div>
    )
}
