"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Brain, Pill, Activity, Shield, Thermometer } from "lucide-react"

interface SmartSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
  userHistory?: string[]
}

const healthCategories = [
  {
    icon: Heart,
    title: "Cardiologie",
    color: "bg-red-100 text-red-700",
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
    color: "bg-purple-100 text-purple-700",
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
    color: "bg-blue-100 text-blue-700",
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
    color: "bg-green-100 text-green-700",
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
    color: "bg-yellow-100 text-yellow-700",
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
    color: "bg-orange-100 text-orange-700",
    suggestions: [
      "Que faire en cas de fièvre persistante ?",
      "Quand consulter pour des maux de tête ?",
      "Douleurs abdominales : causes possibles",
      "Fatigue chronique : que faire ?",
    ],
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
    <div className="space-y-6">
      {/* Suggestions personnalisées */}
      {personalizedSuggestions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="bg-teal-100 text-teal-700">
              Personnalisé pour vous
            </Badge>
          </div>
          <div className="grid gap-2">
            {personalizedSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto p-3 border-teal-200 hover:bg-teal-50 bg-transparent"
                onClick={() => onSuggestionClick(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Catégories de santé */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Explorez par catégorie</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {healthCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <Button
                key={index}
                variant={selectedCategory === index ? "default" : "outline"}
                className={cn(
                  "h-auto p-3 flex flex-col items-center gap-2",
                  selectedCategory === index && "bg-teal-600 hover:bg-teal-700",
                )}
                onClick={() => setSelectedCategory(selectedCategory === index ? null : index)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{category.title}</span>
              </Button>
            )
          })}
        </div>

        {/* Suggestions de la catégorie sélectionnée */}
        {selectedCategory !== null && (
          <Card className="border-teal-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={healthCategories[selectedCategory].color}>
                  {healthCategories[selectedCategory].title}
                </Badge>
              </div>
              <div className="grid gap-2">
                {healthCategories[selectedCategory].suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="justify-start text-left h-auto p-2 hover:bg-teal-50"
                    onClick={() => onSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Suggestions rapides */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Questions fréquentes</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Que faire en cas d'urgence ?",
            "Comment prendre rendez-vous ?",
            "Horaires du DGH",
            "Services disponibles",
            "Numéros d'urgence",
          ].map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs border-gray-300 hover:bg-gray-50 bg-transparent"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
