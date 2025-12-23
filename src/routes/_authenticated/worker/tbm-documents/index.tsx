import { createFileRoute } from '@tanstack/react-router'
import { WorkerTbmDocuments } from '@/features/worker/tbm-documents'

export const Route = createFileRoute('/_authenticated/worker/tbm-documents/')({
  component: WorkerTbmDocuments,
})
