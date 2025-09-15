import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import PreviewClient from './PreviewClient'

interface PageProps {
  params: Promise<{ project_id: string }>
}

export default async function PreviewPage({ params }: PageProps) {
  const resolvedParams = await params

  return (
    <main className="py-24 sm:py-32">
      <Container>
        <FadeIn>
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Migration Preview
              </h1>
              <p className="mt-2 text-lg text-slate-600">
                Preview your migration data before processing
              </p>
            </div>
            
            <PreviewClient projectId={resolvedParams.project_id} />
          </div>
        </FadeIn>
      </Container>
    </main>
  )
}