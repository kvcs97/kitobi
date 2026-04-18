import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface StepProfileProps {
  name: string
  studyProgram: string
  semester: string
  onChange: (field: 'name' | 'studyProgram' | 'semester', value: string) => void
  onNext: () => void
}

export default function StepProfile({ name, studyProgram, semester, onChange, onNext }: StepProfileProps) {
  const valid = name.trim().length > 0 && studyProgram.trim().length > 0

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (valid) onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2
          className="text-xl font-semibold mb-1"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          Hallo! Wie heißt du?
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Kitobi passt sich dir an — ein paar Angaben helfen dabei.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Dein Name"
          autoFocus
          value={name}
          onChange={e => onChange('name', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="studyProgram">Studiengang</Label>
        <Input
          id="studyProgram"
          placeholder="z. B. Informatik, BWL, Medizin …"
          value={studyProgram}
          onChange={e => onChange('studyProgram', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="semester">Semester <span style={{ color: 'var(--color-text-muted)' }}>(optional)</span></Label>
        <Input
          id="semester"
          type="number"
          min={1}
          max={20}
          placeholder="z. B. 3"
          value={semester}
          onChange={e => onChange('semester', e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={!valid}>
        Weiter
      </Button>
    </form>
  )
}
