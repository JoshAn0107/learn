import type { QuizQuestion, StudyRecommendation } from "@/types"
import { TOPIC_WEIGHTS, DIFFICULTY_POINTS } from "./quiz-data"

export function calculateQuizResults(questions: QuizQuestion[], answers: Record<string, string>) {
  const topicScores: Record<string, { correct: number; total: number; points: number; maxPoints: number }> = {}

  // Initialize topic scores
  questions.forEach((question) => {
    if (!topicScores[question.topic]) {
      topicScores[question.topic] = { correct: 0, total: 0, points: 0, maxPoints: 0 }
    }
  })

  // Calculate scores
  questions.forEach((question) => {
    const userAnswer = answers[question.id]
    const isCorrect = userAnswer === question.correctAnswer
    const points = DIFFICULTY_POINTS[question.difficulty]

    topicScores[question.topic].total += 1
    topicScores[question.topic].maxPoints += points

    if (isCorrect) {
      topicScores[question.topic].correct += 1
      topicScores[question.topic].points += points
    }
  })

  // Calculate percentages and overall score
  const topicPercentages: Record<string, number> = {}
  let totalWeightedScore = 0

  Object.entries(topicScores).forEach(([topic, scores]) => {
    const percentage = scores.maxPoints > 0 ? (scores.points / scores.maxPoints) * 100 : 0
    topicPercentages[topic] = percentage

    const weight = TOPIC_WEIGHTS[topic] || 0
    totalWeightedScore += percentage * weight
  })

  // Identify strengths and weaknesses
  const weaknesses: string[] = []
  const strengths: string[] = []

  Object.entries(topicPercentages).forEach(([topic, percentage]) => {
    if (percentage < 60) {
      weaknesses.push(topic)
    } else if (percentage > 75) {
      strengths.push(topic)
    }
  })

  return {
    topicScores: topicPercentages,
    overallScore: Math.round(totalWeightedScore),
    weaknesses,
    strengths,
  }
}

export function generateStudyPlan(
  weaknesses: string[],
  strengths: string[],
  topicScores: Record<string, number>,
): StudyRecommendation[] {
  const recommendations: StudyRecommendation[] = []

  // High priority recommendations for major weaknesses
  weaknesses.forEach((topic) => {
    const score = topicScores[topic]
    let priority: "high" | "medium" | "low" = "high"
    let estimatedTime = "3-4 weeks"

    if (score > 40) {
      priority = "medium"
      estimatedTime = "2-3 weeks"
    }

    recommendations.push({
      topic,
      priority,
      problems: getProblemsForTopic(topic, "beginner"),
      estimatedTime,
      description: getTopicDescription(topic, score),
    })
  })

  // Medium priority for topics that need improvement
  Object.entries(topicScores).forEach(([topic, score]) => {
    if (score >= 60 && score <= 75 && !weaknesses.includes(topic)) {
      recommendations.push({
        topic,
        priority: "medium",
        problems: getProblemsForTopic(topic, "intermediate"),
        estimatedTime: "1-2 weeks",
        description: `Strengthen your ${topic} skills with intermediate problems`,
      })
    }
  })

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}

function getProblemsForTopic(topic: string, level: "beginner" | "intermediate" | "advanced"): string[] {
  const problemSets = {
    arrays: {
      beginner: ["Two Sum", "Best Time to Buy and Sell Stock", "Contains Duplicate"],
      intermediate: ["3Sum", "Container With Most Water", "Product of Array Except Self"],
      advanced: ["Trapping Rain Water", "Sliding Window Maximum", "Median of Two Sorted Arrays"],
    },
    "linked-lists": {
      beginner: ["Reverse Linked List", "Merge Two Sorted Lists", "Remove Duplicates"],
      intermediate: ["Add Two Numbers", "Remove Nth Node From End", "Intersection of Two Linked Lists"],
      advanced: ["Merge k Sorted Lists", "Reverse Nodes in k-Group", "Copy List with Random Pointer"],
    },
    trees: {
      beginner: ["Maximum Depth of Binary Tree", "Same Tree", "Invert Binary Tree"],
      intermediate: ["Validate Binary Search Tree", "Lowest Common Ancestor", "Binary Tree Level Order Traversal"],
      advanced: ["Serialize and Deserialize Binary Tree", "Binary Tree Maximum Path Sum", "Recover Binary Search Tree"],
    },
    "dynamic-programming": {
      beginner: ["Climbing Stairs", "House Robber", "Maximum Subarray"],
      intermediate: ["Coin Change", "Longest Increasing Subsequence", "Word Break"],
      advanced: ["Edit Distance", "Regular Expression Matching", "Burst Balloons"],
    },
    graphs: {
      beginner: ["Number of Islands", "Clone Graph", "Course Schedule"],
      intermediate: ["Word Ladder", "Pacific Atlantic Water Flow", "Network Delay Time"],
      advanced: ["Alien Dictionary", "Critical Connections in a Network", "Minimum Cost to Connect All Points"],
    },
  }

  return problemSets[topic]?.[level] || [`${topic} practice problems`]
}

function getTopicDescription(topic: string, score: number): string {
  const descriptions = {
    arrays: "Master array manipulation, two pointers, and sliding window techniques",
    "linked-lists": "Learn pointer manipulation and linked list traversal patterns",
    trees: "Understand tree traversal, BST properties, and recursive thinking",
    "dynamic-programming": "Develop pattern recognition for optimal subproblems",
    graphs: "Practice BFS, DFS, and shortest path algorithms",
    sorting: "Compare sorting algorithms and their trade-offs",
    recursion: "Build intuition for recursive problem decomposition",
    "hash-tables": "Leverage hash maps for efficient lookups and counting",
    heaps: "Use priority queues for optimization problems",
    strings: "Master string manipulation and pattern matching",
    "bit-manipulation": "Learn bitwise operations and their applications",
    greedy: "Identify when greedy choices lead to optimal solutions",
  }

  const baseDescription = descriptions[topic] || `Improve your ${topic} skills`

  if (score < 30) {
    return `${baseDescription}. Start with fundamentals and basic concepts.`
  } else if (score < 50) {
    return `${baseDescription}. Focus on common patterns and medium difficulty problems.`
  } else {
    return `${baseDescription}. Practice advanced techniques and edge cases.`
  }
}
