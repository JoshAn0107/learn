"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { QUIZ_QUESTIONS } from "@/lib/quiz-data"
import { calculateQuizResults, generateStudyPlan } from "@/lib/assessment"
import { useRouter } from "next/navigation"
import { Brain, Clock, CheckCircle } from "lucide-react"

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeSpent, setTimeSpent] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (quizStarted) {
      const timer = setInterval(() => {
        setTimeSpent((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [quizStarted])

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [QUIZ_QUESTIONS[currentQuestion].id]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Calculate results
      const results = calculateQuizResults(QUIZ_QUESTIONS, answers)
      const studyPlan = generateStudyPlan(results.weaknesses, results.strengths, results.topicScores)

      // Save to database (for now, we'll use localStorage for demo)
      const quizAttempt = {
        id: crypto.randomUUID(),
        questions: QUIZ_QUESTIONS,
        answers,
        scores: results.topicScores,
        overall_score: results.overallScore,
        completed_at: new Date().toISOString(),
        time_spent: timeSpent,
      }

      const studyPlanData = {
        weaknesses: results.weaknesses,
        strengths: results.strengths,
        recommendations: studyPlan,
      }

      // Store in localStorage for demo
      localStorage.setItem("quizAttempt", JSON.stringify(quizAttempt))
      localStorage.setItem("studyPlan", JSON.stringify(studyPlanData))

      // Redirect to results
      router.push("/quiz/results")
    } catch (error) {
      console.error("Error submitting quiz:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <Brain className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
            <CardTitle className="text-3xl">Algorithms & Data Structures Assessment</CardTitle>
            <CardDescription className="text-lg">
              This diagnostic quiz will help us understand your current knowledge level and create a personalized
              learning plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">20 Questions</h3>
                <p className="text-sm text-gray-600">Covering key CS topics</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">15-20 Minutes</h3>
                <p className="text-sm text-gray-600">Take your time</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold">Instant Results</h3>
                <p className="text-sm text-gray-600">Personalized feedback</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Instructions:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Choose the best answer for each question</li>
                <li>• You can navigate back and forth between questions</li>
                <li>• There's no time limit, but try to answer intuitively</li>
                <li>• Your results will help create your personalized study plan</li>
              </ul>
            </div>

            <Button onClick={() => setQuizStarted(true)} className="w-full text-lg py-6" size="lg">
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = QUIZ_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100
  const isLastQuestion = currentQuestion === QUIZ_QUESTIONS.length - 1
  const canProceed = answers[question.id] !== undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Diagnostic Assessment</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Time: {formatTime(timeSpent)}</span>
              <span>
                Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium text-indigo-600 uppercase tracking-wide">
                {question.topic.replace("-", " ")} • {question.difficulty}
              </CardDescription>
              <div className="flex space-x-1">
                {question.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <CardTitle className="text-xl leading-relaxed">{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={answers[question.id] || ""} onValueChange={handleAnswerChange} className="space-y-4">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base leading-relaxed">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            Previous
          </Button>

          <div className="flex space-x-2">
            {QUIZ_QUESTIONS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  index === currentQuestion
                    ? "bg-indigo-600 text-white"
                    : answers[QUIZ_QUESTIONS[index].id]
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {isLastQuestion ? (
            <Button onClick={handleSubmit} disabled={!canProceed || isSubmitting} className="min-w-[100px]">
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
