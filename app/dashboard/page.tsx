"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, BookOpen, Target, TrendingUp, Clock, Play } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [results, setResults] = useState<any>(null)
  const [studyPlan, setStudyPlan] = useState<any>(null)

  useEffect(() => {
    const savedResults = localStorage.getItem("quizAttempt")
    const savedStudyPlan = localStorage.getItem("studyPlan")

    if (savedResults) setResults(JSON.parse(savedResults))
    if (savedStudyPlan) setStudyPlan(JSON.parse(savedStudyPlan))
  }, [])

  if (!results || !studyPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-8">
            <Brain className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Welcome to AlgoCoach!</h2>
            <p className="text-gray-600 mb-6">
              Take our diagnostic quiz to get started with your personalized learning journey.
            </p>
            <Link href="/quiz">
              <Button size="lg">Take Assessment</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">AlgoCoach</span>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/study">
                <Button variant="ghost">Study</Button>
              </Link>
              <Link href="/quiz">
                <Button variant="outline">Retake Quiz</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Learning Dashboard</h1>
          <p className="text-gray-600">Track your progress and continue your algorithmic journey</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(results.overall_score)}`}>
                    {results.overall_score}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Strengths</p>
                  <p className="text-3xl font-bold text-green-600">{studyPlan.strengths.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Areas to Improve</p>
                  <p className="text-3xl font-bold text-red-600">{studyPlan.weaknesses.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Study Plan Items</p>
                  <p className="text-3xl font-bold text-indigo-600">{studyPlan.recommendations.length}</p>
                </div>
                <Clock className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Current Study Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Your Study Plan</CardTitle>
              <CardDescription>Prioritized topics based on your assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {studyPlan.recommendations.slice(0, 3).map((rec: any, index: number) => (
                <div key={rec.topic} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium capitalize">{rec.topic.replace("-", " ")}</h4>
                      <Badge className={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{rec.estimatedTime}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </Button>
                </div>
              ))}
              <Link href="/study">
                <Button className="w-full mt-4">View Full Study Plan</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Topic Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Topic Performance</CardTitle>
              <CardDescription>Your scores across different areas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(results.scores)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 6)
                .map(([topic, score]) => (
                  <div key={topic} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize text-sm">{topic.replace("-", " ")}</span>
                      <span className={`font-bold text-sm ${getScoreColor(score as number)}`}>
                        {Math.round(score as number)}%
                      </span>
                    </div>
                    <Progress value={score as number} className="h-2" />
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Continue your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/study">
                <Button variant="outline" className="w-full h-20 flex flex-col">
                  <BookOpen className="h-6 w-6 mb-2" />
                  Start Studying
                </Button>
              </Link>
              <Link href="/quiz">
                <Button variant="outline" className="w-full h-20 flex flex-col">
                  <Target className="h-6 w-6 mb-2" />
                  Retake Assessment
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <Brain className="h-6 w-6 mb-2" />
                AI Tutor (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
