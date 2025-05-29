import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Target, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">AlgoCoach</span>
          </div>
          <div className="space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Master Algorithms & Data Structures with AI</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get personalized learning paths, instant feedback, and AI-powered tutoring to accelerate your coding
            interview preparation and algorithmic thinking.
          </p>
          <Link href="/quiz">
            <Button size="lg" className="text-lg px-8 py-4">
              Start Your Diagnostic Quiz
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Target className="h-12 w-12 text-indigo-600 mb-4" />
              <CardTitle>Personalized Assessment</CardTitle>
              <CardDescription>
                Take our diagnostic quiz to identify your strengths and weaknesses across key algorithmic concepts.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Brain className="h-12 w-12 text-indigo-600 mb-4" />
              <CardTitle>AI-Powered Tutoring</CardTitle>
              <CardDescription>
                Get instant help and explanations from our AI tutor that adapts to your learning style and current
                level.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-indigo-600 mb-4" />
              <CardTitle>Track Your Progress</CardTitle>
              <CardDescription>
                Monitor your improvement over time with detailed analytics and personalized study recommendations.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Take the Quiz</h3>
              <p className="text-gray-600">Complete our 20-question diagnostic assessment</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Get Your Results</h3>
              <p className="text-gray-600">Receive detailed analysis of your algorithmic knowledge</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Follow Your Plan</h3>
              <p className="text-gray-600">Work through personalized study recommendations</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">Master Algorithms</h3>
              <p className="text-gray-600">Achieve your coding interview and career goals</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-6 w-6" />
            <span className="text-xl font-bold">AlgoCoach</span>
          </div>
          <p className="text-gray-400">Empowering developers to master algorithms and data structures</p>
        </div>
      </footer>
    </div>
  )
}
