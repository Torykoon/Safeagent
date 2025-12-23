import { cn } from '@/lib/utils'

interface TypingIndicatorProps {
    className?: string
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
    return (
        <div
            className={cn(
                'flex items-center space-x-1.5 px-4 py-3',
                className
            )}
        >
            <span className='flex space-x-1'>
                <span
                    className='bg-muted-foreground/60 size-2 animate-bounce rounded-full'
                    style={{ animationDelay: '0ms', animationDuration: '600ms' }}
                />
                <span
                    className='bg-muted-foreground/60 size-2 animate-bounce rounded-full'
                    style={{ animationDelay: '150ms', animationDuration: '600ms' }}
                />
                <span
                    className='bg-muted-foreground/60 size-2 animate-bounce rounded-full'
                    style={{ animationDelay: '300ms', animationDuration: '600ms' }}
                />
            </span>
            <span className='text-muted-foreground text-sm'>AI가 응답 중...</span>
        </div>
    )
}
