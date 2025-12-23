import { createFileRoute } from '@tanstack/react-router'
import { WorkerDashboard } from '@/features/worker/dashboard'

export const Route = createFileRoute('/_authenticated/worker/dashboard/')({
  component: WorkerDashboard,
})
