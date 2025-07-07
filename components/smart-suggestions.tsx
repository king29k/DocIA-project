"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Brain, Pill, Activity, Shield, Thermometer, Stethoscope, Users, Clock } from "lucide-react"

interface SmartSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
  userHistory?: string[]
}

const healthCategories = [
  {
    icon: Heart,
    title: "Cardiologie",
    color: "bg-red-100 text-red-700 border-red-200",
    hoverColor: "hover:bg-red-50",
    suggestions: [
      "Comment prévenir les maladies cardiovasculaires ?",
      "Quels sont les symptômes d'une crise cardiaque ?",
      "Comment gérer l'hypertension artérielle ?",
      "Quelle alimentation pour un cœur en bonne santé ?",
    ],
  },
  {
    icon: Brain,
    title: "Neurologie",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    hoverColor: "hover:bg-purple-50",
    suggestions: [
      "Quels sont les signes d'un AVC ?",
      "Comment prévenir la maladie d'Alzheimer ?",
      "Que faire en cas de migraine sévère ?",
      "Comment améliorer sa mémoire ?",
    ],
  },
  {
    icon: Pill,
    title: "Médicaments",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    hoverColor: "hover:bg-blue-50",
    suggestions: [
      "Quels sont les effets secondaires du paracétamol ?",
      "Comment prendre correctement les antibiotiques ?",
      "Interactions médicamenteuses à éviter",
      "Que faire en cas d'oubli de médicament ?",
    ],
  },
  {
    icon: Activity,
    title: "Diabète",
    color: "bg-green-100 text-green-700 border-green-200",
    hoverColor: "hover:bg-green-50",
    suggestions: [
      "Comment contrôler sa glycémie ?",
      "Quelle alimentation pour un diabétique ?",
      "Symptômes du diabète de type 2",
      "Comment prévenir les complications du diabète ?",
    ],
  },
  {
    icon: Shield,
    title: "Prévention",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    hoverColor: "hover:bg-yellow-50",
    suggestions: [
      "Calendrier de vaccination pour adultes",
      "Comment renforcer son système immunitaire ?",
      "Dépistages recommandés par âge",
      "Hygiène de vie pour rester en bonne santé",
    ],
  },
  {
    icon: Thermometer,
    title: "Symptômes",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    hoverColor: "hover:bg-orange-50",
    suggestions: [
      "Que faire en cas de fièvre persistante ?",
      "Quand consulter pour des maux de tête ?",
      "Douleurs abdominales : causes possibles",
      "Fatigue chronique : que faire ?",
    ],
  },
]

const quickSuggestions = [
  {
    icon: Stethoscope,
    text: "Que faire en cas d'urgence ?",
    color: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  },
  {
    icon: Clock,
    text: "Horaires du DGH",
    color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  },
  {
    icon: Users,
    text: "Services disponibles",
    color: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
  },
]

export function SmartSuggestions({ onSuggestionClick, userHistory = [] }: SmartSuggestionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [personalizedSuggestions, setPersonalizedSuggestions] = useState<string[]>([])

  useEffect(() => {
    // Générer des suggestions personnalisées basées sur l'historique
    if (userHistory.length > 0) {
      const suggestions = generatePersonalizedSuggestions(userHistory)
      setPersonalizedSuggestions(suggestions)
    }
  }, [userHistory])

  const generatePersonalizedSuggestions = (history: string[]): string[] => {
    // Logique simple pour générer des suggestions basées sur l'historique
    const keywords = history.join(" ").toLowerCase()
    const suggestions: string[] = []

    if (keywords.includes("diabète") || keywords.includes("glycémie")) {
      suggestions.push("Suivi de votre diabète : nouvelles recommandations")
    }
    if (keywords.includes("hypertension") || keywords.includes("tension")) {
      suggestions.push("Gestion de l'hypertension : conseils personnalisés")
    }
    if (keywords.includes("médicament") || keywords.includes("traitement")) {
      suggestions.push("Optimisation de votre traitement médicamenteux")
    }

    return suggestions.slice(0, 3)
  }

  return (
    <div className="space-y-8">
      {/* Suggestions personnalisées */}
      {personalizedSuggestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-teal-100 text-teal-700 border-teal-200 px-3 py-1">
              ✨ Personnalisé pour vous
            </Badge>
          </div>
          <div className="grid gap-3">
            {personalizedSuggestions.map((suggestion, index) => (
              <Card
                key={index}
                className="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-teal-200 bg-gradient-to-r from-teal-50 to-blue-50"
                onClick={() => onSuggestionClick(suggestion)}
              >
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-teal-800">{suggestion}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Catégories de santé */}
      <div className="space-y-6">
        <h3 className="font-semibold text-gray-900 text-lg">Explorez par spécialité</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {healthCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <Button
                key={index}
                variant={selectedCategory === index ? "default" : "outline"}
                className={cn(
                  "h-auto p-4 flex flex-col items-center gap-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
                  selectedCategory === index
                    ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white border-teal-400"
                    : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-teal-300",
                )}
                onClick={() => setSelectedCategory(selectedCategory === index ? null : index)}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-medium text-center">{category.title}</span>
              </Button>
            )
          })}
        </div>

        {/* Suggestions de la catégorie sélectionnée */}
        {selectedCategory !== null && (
          <Card className="border-teal-200 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={healthCategories[selectedCategory].color}>
                  {healthCategories[selectedCategory].title}
                </Badge>
              </div>
              <div className="grid gap-3">
                {healthCategories[selectedCategory].suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className={cn(
                      "justify-start text-left h-auto p-3 transition-all duration-200 hover:shadow-sm",
                      healthCategories[selectedCategory].hoverColor,
                    )}
                    onClick={() => onSuggestionClick(suggestion)}
                  >
                    <span className="text-sm">{suggestion}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Suggestions rapides */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Accès rapide</h3>
        <div className="flex flex-wrap gap-3">
          {quickSuggestions.map((suggestion, index) => {
            const Icon = suggestion.icon
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={cn("transition-all duration-200 hover:shadow-md hover:-translate-y-0.5", suggestion.color)}
                onClick={() => onSuggestionClick(suggestion.text)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {suggestion.text}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
