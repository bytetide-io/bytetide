import { NewProjectForm } from '@/components/NewProjectForm'
import { FadeIn } from '@/components/FadeIn'

export default function NewProjectPage() {
  return (
    <FadeIn>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          New Migration Project
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Start your data migration journey with ByteTide&apos;s expert team
        </p>
      </div>
      
      <NewProjectForm />
    </FadeIn>
  )
}