import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import StepIndicator from '@/components/onboarding/StepIndicator'
import StepProfile from '@/components/onboarding/StepProfile'
import StepSubjects from '@/components/onboarding/StepSubjects'
import StepExamDates, { type ExamDate } from '@/components/onboarding/StepExamDates'
import StepGoals from '@/components/onboarding/StepGoals'
import StepSummary from '@/components/onboarding/StepSummary'

const STEP_LABELS = ['Profil', 'Fächer', 'Termine', 'Ziele', 'Start']
const TOTAL_STEPS = 5

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, setOnboardingCompleted } = useAuthStore()

  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  // Wizard data
  const [name, setName] = useState('')
  const [studyProgram, setStudyProgram] = useState('')
  const [semester, setSemester] = useState('')
  const [subjects, setSubjects] = useState<string[]>([])
  const [examDates, setExamDates] = useState<ExamDate[]>([])
  const [dailyGoalMin, setDailyGoalMin] = useState(30)
  const [daysBeforeExam, setDaysBeforeExam] = useState(14)

  function handleProfileChange(field: 'name' | 'studyProgram' | 'semester', value: string) {
    if (field === 'name') setName(value)
    else if (field === 'studyProgram') setStudyProgram(value)
    else setSemester(value)
  }

  function handleGoalChange(field: 'dailyGoalMin' | 'daysBeforeExam', value: number) {
    if (field === 'dailyGoalMin') setDailyGoalMin(value)
    else setDaysBeforeExam(value)
  }

  async function handleFinish() {
    if (!user) return
    setSaving(true)
    try {
      await supabase
        .from('user_profiles')
        .update({
          name: name.trim(),
          study_program: studyProgram.trim(),
          semester: semester ? parseInt(semester) : null,
          daily_goal_min: dailyGoalMin,
          onboarding_completed: true,
        })
        .eq('id', user.id)

      setOnboardingCompleted(true)
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Failed to save profile:', err)
    } finally {
      setSaving(false)
    }
  }

  function handleSkip() {
    if (!user) return
    supabase
      .from('user_profiles')
      .update({ onboarding_completed: true })
      .eq('id', user.id)
      .then(() => {
        setOnboardingCompleted(true)
        navigate('/', { replace: true })
      })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-10"
         style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="w-full max-w-md space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
          >
            Kitobi einrichten
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Schritt {step + 1} von {TOTAL_STEPS}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center">
          <StepIndicator current={step} total={TOTAL_STEPS} labels={STEP_LABELS} />
        </div>

        {/* Step content */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          {step === 0 && (
            <StepProfile
              name={name}
              studyProgram={studyProgram}
              semester={semester}
              onChange={handleProfileChange}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <StepSubjects
              studyProgram={studyProgram}
              subjects={subjects}
              onChange={setSubjects}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <StepExamDates
              subjects={subjects}
              examDates={examDates}
              onChange={setExamDates}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <StepGoals
              dailyGoalMin={dailyGoalMin}
              daysBeforeExam={daysBeforeExam}
              onChange={handleGoalChange}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <StepSummary
              name={name}
              studyProgram={studyProgram}
              semester={parseInt(semester) || 0}
              subjects={subjects}
              dailyGoalMin={dailyGoalMin}
              loading={saving}
              onFinish={handleFinish}
              onBack={() => setStep(3)}
            />
          )}
        </div>

        {/* Skip option */}
        {step < 4 && (
          <p className="text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <button
              type="button"
              onClick={handleSkip}
              className="underline hover:opacity-80 transition-opacity"
            >
              Onboarding überspringen
            </button>
            {' '}— später in den Einstellungen nachholen
          </p>
        )}

      </div>
    </div>
  )
}
