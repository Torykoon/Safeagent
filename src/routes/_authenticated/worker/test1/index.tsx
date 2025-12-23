import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/worker/test1/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/worker/test1/"!</div>
}
