import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/worker/test2/')({
  component: Test2Page,
})

function Test2Page() {
  return (
    <div className='flex h-full flex-col items-center justify-center'>
      <div className='space-y-4 text-center'>
        <h1 className='text-4xl font-bold'>Test2 Page</h1>
        <p className='text-muted-foreground'>
          Worker 전용 테스트 페이지입니다.
        </p>
        <p className='text-muted-foreground text-sm'>
          이 페이지를 수정하면 된다.
        </p>
      </div>
    </div>
  )
}
