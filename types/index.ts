export interface User {
  id: string
  email: string
  name?: string
  created_at: string
  updated_at: string
}

export interface QuizQuestion {
  id: string
  topic: string
  difficulty: "easy" | "medium" | "hard"
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  tags: string[]
}

export interface QuizAttempt {
  id: string
  user_id: string
  questions: QuizQuestion[]
  answers: Record<string, string>
  scores: Record<string, number>
  overall_score: number
  completed_at: string
}

export interface StudyPlan {
  id: string
  user_id: string
  quiz_attempt_id: string
  plan_data: {
    weaknesses: string[]
    strengths: string[]
    recommendations: StudyRecommendation[]
  }
  created_at: string
}

export interface StudyRecommendation {
  topic: string
  priority: "high" | "medium" | "low"
  problems: string[]
  estimatedTime: string
  description: string
}

export interface Problem {
  id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  topic: string
  hints: string[]
  solution: string
  time_complexity: string
  space_complexity: string
}

export interface UserProgress {
  id: string
  user_id: string
  topic: string
  problems_completed: number
  last_activity: string
}
