"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, Target, Clock, BookOpen, ArrowRight } from "lucide-react"
import Link from "next/link"

interface QuizResults {
  overall_score: number
  scores: Record<string, number>
  time_spent: number
  completed_at: string
}

interface StudyPlan {
  weaknesses: string[]
  strengths: string[]
  recommendations: Array<{
    topic: string
    priority: "high" | "medium" | "low"
    problems: string[]
    estimatedTime: string
    description: string
  }>
}

export default function ResultsPage() {
  const [results, setResults] = useState<QuizResults | null>(null)
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null)

  useEffect(() => {
    // Load results from localStorage (in a real app, this would come from the database)
    const savedResults = localStorage.getItem("quizAttempt")
    const savedStudyPlan = localStorage.getItem("studyPlan")

    if (savedResults) {
      setResults(JSON.parse(savedResults))
    }
    if (savedStudyPlan) {
      setStudyPlan(JSON.parse(savedStudyPlan))
    }
  }, [])

  if (!results || !studyPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 text-indigo-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading your results...</p>
        </div>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-50 border-green-200"
    if (score >= 60) return "bg-yellow-50 border-yellow-200"
    return "bg-red-50 border-red-200"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Assessment Results</h1>
          <p className="text-lg text-gray-600">
            Based on your performance, we've created a personalized learning plan to help you improve.
          </p>
        </div>

        {/* Overall Score */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Overall Score</CardTitle>
            <div className="flex items-center justify-center space-x-8 mt-4">
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(results.overall_score)}`}>
                  {results.overall_score}%
                </div>
                <p className="text-gray-600 mt-2">Your Score</p>
              </div>
              <div className="text-center">
                <div className="flex items-center text-2xl text-gray-600">
                  <Clock className="h-6 w-6 mr-2" />
                  {formatTime(results.time_spent)}
                </div>
                <p className="text-gray-600 mt-2">Time Taken</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Topic Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Topic Breakdown
              </CardTitle>
              <CardDescription>Your performance across different algorithmic concepts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(results.scores).map(([topic, score]) => (
                <div key={topic} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{topic.replace("-", " ")}</span>
                    <span className={`font-bold ${getScoreColor(score)}`}>{Math.round(score)}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Strengths & Weaknesses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Analysis
              </CardTitle>
              <CardDescription>Areas where you excel and areas for improvement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {studyPlan.strengths.length > 0 && (
                <div>
                  <h4 className="font-semibold text-green-700 mb-3">Strengths</h4>
                  <div className="flex flex-wrap gap-2">
                    {studyPlan.strengths.map((strength) => (
                      <Badge key={strength} className="bg-green-100 text-green-800">
                        {strength.replace("-", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {studyPlan.weaknesses.length > 0 && (
                <div>
                  <h4 className="font-semibold text-red-700 mb-3">Areas for Improvement</h4>
                  <div className="flex flex-wrap gap-2">
                    {studyPlan.weaknesses.map((weakness) => (
                      <Badge key={weakness} className="bg-red-100 text-red-800">
                        {weakness.replace("-", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Study Plan */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Your Personalized Study Plan
            </CardTitle>
            <CardDescription>Recommended learning path based on your assessment results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {studyPlan.recommendations.map((recommendation, index) => (
                <div
                  key={recommendation.topic}
                  className={`p-6 rounded-lg border-2 ${getScoreBg(results.scores[recommendation.topic] || 0)}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold capitalize mb-2">
                        {recommendation.topic.replace("-", " ")}
                      </h3>
                      <p className="text-gray-600 mb-3">{recommendation.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Estimated time: {recommendation.estimatedTime}</span>
                        <Badge className={getPriorityColor(recommendation.priority)}>
                          {recommendation.priority} priority
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-400">{index + 1}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Recommended Problems:</h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {recommendation.problems.map((problem) => (
                        <div key={problem} className="text-sm bg-white bg-opacity-50 px-3 py-2 rounded">
                          {problem}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Learning?</h3>
            <p className="text-gray-600 mb-6">
              Your personalized study plan is ready. Start with your highest priority topics and work your way through
              the recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="flex items-center">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/study">
                <Button variant="outline" size="lg">
                  Start Studying
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
