"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, BookOpen, Clock, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function StudyPage() {
  const [studyPlan, setStudyPlan] = useState<any>(null)
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set())

  useEffect(() => {
    const savedStudyPlan = localStorage.getItem("studyPlan")
    const savedProgress = localStorage.getItem("completedProblems")

    if (savedStudyPlan) setStudyPlan(JSON.parse(savedStudyPlan))
    if (savedProgress) setCompletedProblems(new Set(JSON.parse(savedProgress)))
  }, [])

  const markProblemComplete = (problem: string) => {
    const newCompleted = new Set(completedProblems)
    newCompleted.add(problem)
    setCompletedProblems(newCompleted)
    localStorage.setItem("completedProblems", JSON.stringify([...newCompleted]))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (!studyPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-8">
            <BookOpen className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">No Study Plan Found</h2>
            <p className="text-gray-600 mb-6">Take our diagnostic quiz to get your personalized study plan.</p>
            <Link href="/quiz">
              <Button size="lg">Take Assessment</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Study Plan</h1>
          <p className="text-gray-600">Work through these topics to improve your algorithmic skills</p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{studyPlan.recommendations.length}</div>
                <p className="text-gray-600">Topics to Study</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{completedProblems.size}</div>
                <p className="text-gray-600">Problems Completed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {studyPlan.recommendations.reduce((acc: number, rec: any) => acc + rec.problems.length, 0)}
                </div>
                <p className="text-gray-600">Total Problems</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Plan Items */}
        <div className="space-y-6">
          {studyPlan.recommendations.map((recommendation: any, index: number) => (
            <Card key={recommendation.topic} className={`border-2 ${getPriorityColor(recommendation.priority)}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl capitalize">{recommendation.topic.replace("-", " ")}</CardTitle>
                      <Badge className={getPriorityColor(recommendation.priority)}>
                        {recommendation.priority} priority
                      </Badge>
                    </div>
                    <CardDescription className="text-base">{recommendation.description}</CardDescription>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {recommendation.estimatedTime}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {recommendation.problems.length} problems
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-300">{index + 1}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-4">Practice Problems:</h4>
                <div className="grid gap-3">
                  {recommendation.problems.map((problem: string) => (
                    <div
                      key={problem}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        completedProblems.has(problem)
                          ? "bg-green-50 border-green-200"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {completedProblems.has(problem) ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                        )}
                        <span
                          className={`font-medium ${
                            completedProblems.has(problem) ? "text-green-700 line-through" : "text-gray-900"
                          }`}
                        >
                          {problem}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!completedProblems.has(problem) && (
                          <Button size="sm" variant="outline" onClick={() => markProblemComplete(problem)}>
                            Mark Complete
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Tutor CTA */}
        <Card className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="text-center py-8">
            <Brain className="h-16 w-16 mx-auto mb-4 text-white" />
            <h3 className="text-2xl font-bold mb-4">Need Help? Ask Our AI Tutor!</h3>
            <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
              Get instant explanations, hints, and step-by-step guidance for any problem you're working on.
            </p>
            <Button size="lg" variant="secondary">
              Chat with AI Tutor (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
