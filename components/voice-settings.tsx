"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Volume2, Play, Square } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { getTranslation } from "@/lib/translations"

interface VoiceOption {
  name: string
  lang: string
  gender: "male" | "female"
  description: string
}

export function VoiceSettings() {
  const { language } = useTheme()
  const t = (key: string) => getTranslation(language, key)

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [speed, setSpeed] = useState([1])
  const [pitch, setPitch] = useState([1])
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices()
      setVoices(availableVoices)

      // Set default voice based on language
      const defaultVoice = availableVoices.find((voice) => voice.lang.startsWith(language === "fr" ? "fr" : "en"))
      if (defaultVoice && !selectedVoice) {
        setSelectedVoice(defaultVoice.name)
      }
    }

    loadVoices()
    speechSynthesis.addEventListener("voiceschanged", loadVoices)

    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices)
    }
  }, [language, selectedVoice])

  const testVoice = () => {
    if (isPlaying) {
      speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    const testText =
      language === "fr"
        ? "Bonjour, je suis votre assistant médical DocIA. Comment puis-je vous aider aujourd'hui ?"
        : "Hello, I am your medical assistant DocIA. How can I help you today?"

    const utterance = new SpeechSynthesisUtterance(testText)
    const voice = voices.find((v) => v.name === selectedVoice)

    if (voice) {
      utterance.voice = voice
    }

    utterance.rate = speed[0]
    utterance.pitch = pitch[0]

    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    speechSynthesis.speak(utterance)
  }

  const getVoicesByLanguage = () => {
    return voices.filter((voice) => {
      if (language === "fr") {
        return voice.lang.startsWith("fr")
      } else {
        return voice.lang.startsWith("en")
      }
    })
  }

  const saveVoiceSettings = () => {
    const settings = {
      voice: selectedVoice,
      speed: speed[0],
      pitch: pitch[0],
    }
    localStorage.setItem("docai-voice-settings", JSON.stringify(settings))
  }

  useEffect(() => {
    const savedSettings = localStorage.getItem("docai-voice-settings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      if (settings.voice) setSelectedVoice(settings.voice)
      if (settings.speed) setSpeed([settings.speed])
      if (settings.pitch) setPitch([settings.pitch])
    }
  }, [])

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          {language === "fr" ? "Paramètres Vocaux" : "Voice Settings"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voice Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{language === "fr" ? "Sélectionner une voix" : "Select Voice"}</label>
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger>
              <SelectValue placeholder={language === "fr" ? "Choisir une voix" : "Choose a voice"} />
            </SelectTrigger>
            <SelectContent>
              {getVoicesByLanguage().map((voice) => (
                <SelectItem key={voice.name} value={voice.name}>
                  <div className="flex flex-col">
                    <span>{voice.name}</span>
                    <span className="text-xs text-muted-foreground">{voice.lang}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">{language === "fr" ? "Vitesse" : "Speed"}</label>
            <span className="text-sm text-muted-foreground">{speed[0]}x</span>
          </div>
          <Slider value={speed} onValueChange={setSpeed} max={2} min={0.5} step={0.1} className="w-full" />
        </div>

        {/* Pitch Control */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">{language === "fr" ? "Tonalité" : "Pitch"}</label>
            <span className="text-sm text-muted-foreground">{pitch[0]}</span>
          </div>
          <Slider value={pitch} onValueChange={setPitch} max={2} min={0.5} step={0.1} className="w-full" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={testVoice} className="flex-1" variant={isPlaying ? "destructive" : "default"}>
            {isPlaying ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isPlaying ? (language === "fr" ? "Arrêter" : "Stop") : language === "fr" ? "Tester la voix" : "Test Voice"}
          </Button>
          <Button onClick={saveVoiceSettings} variant="outline">
            {language === "fr" ? "Sauvegarder" : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
