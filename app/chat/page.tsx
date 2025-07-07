"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Send, Settings, User, Bot, Heart, Activity, Thermometer, MoreVertical, Volume2, VolumeX } from "lucide-react"
import { useChat } from "ai/react"
import { FileUpload } from "@/components/file-upload"
import { VoiceInput } from "@/components/voice-input"
import { SmartSuggestions } from "@/components/smart-suggestions"
import { VoiceSettings } from "@/components/voice-settings"
import { useTheme } from "@/lib/theme-context"
import { getTranslation } from "@/lib/translations"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  attachments?: string[]
}

interface VitalSigns {
  heartRate: number
  bloodPressure: string
  temperature: number
  lastUpdated: Date
}

export default function ChatPage() {
  const { language } = useTheme()
  const t = (key: string) => getTranslation(language, key)

  const [isListening, setIsListening] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [vitalSigns] = useState<VitalSigns>({
    heartRate: 72,
    bloodPressure: "120/80",
    temperature: 36.5,
    lastUpdated: new Date(),
  })

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const speakMessage = (text: string) => {
    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)

    // Load saved voice settings
    const savedSettings = localStorage.getItem("docai-voice-settings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      const voices = speechSynthesis.getVoices()
      const selectedVoice = voices.find((voice) => voice.name === settings.voice)

      if (selectedVoice) utterance.voice = selectedVoice
      if (settings.speed) utterance.rate = settings.speed
      if (settings.pitch) utterance.pitch = settings.pitch
    }

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    speechSynthesis.speak(utterance)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === "fr" ? "fr-FR" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">DocIA</h1>
            <div className="flex items-center space-x-2">
              <LanguageToggle />
              <ThemeToggle />
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{t("voiceSettings")}</DialogTitle>
                  </DialogHeader>
                  <VoiceSettings />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Patient</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{language === "fr" ? "En ligne" : "Online"}</p>
            </div>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">
            {language === "fr" ? "Signes vitaux" : "Vital Signs"}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {language === "fr" ? "Rythme cardiaque" : "Heart Rate"}
                </span>
              </div>
              <Badge variant="secondary">{vitalSigns.heartRate} bpm</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {language === "fr" ? "Tension" : "Blood Pressure"}
                </span>
              </div>
              <Badge variant="secondary">{vitalSigns.bloodPressure}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {language === "fr" ? "Température" : "Temperature"}
                </span>
              </div>
              <Badge variant="secondary">{vitalSigns.temperature}°C</Badge>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {language === "fr" ? "Mis à jour" : "Updated"}: {formatTime(vitalSigns.lastUpdated)}
          </p>
        </div>

        {/* Smart Suggestions */}
        <div className="flex-1 p-4">
          <SmartSuggestions />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium text-gray-900 dark:text-white">
                  {language === "fr" ? "Assistant Médical DocIA" : "DocIA Medical Assistant"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {language === "fr" ? "Prêt à vous aider" : "Ready to help"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setIsSpeaking(!isSpeaking)}>
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {language === "fr" ? "Bonjour ! Comment puis-je vous aider ?" : "Hello! How can I help you?"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {language === "fr"
                    ? "Décrivez vos symptômes ou posez-moi une question médicale."
                    : "Describe your symptoms or ask me a medical question."}
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  } items-start space-x-2`}
                >
                  <Avatar className="w-8 h-8">
                    {message.role === "user" ? (
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-teal-500 text-white"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs opacity-70">{formatTime(new Date(message.createdAt || Date.now()))}</p>
                      {message.role === "assistant" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => speakMessage(message.content)}
                          className="h-6 w-6 p-0"
                        >
                          {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSubmit} className="flex items-end space-x-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <FileUpload />
                <VoiceInput isListening={isListening} onToggle={() => setIsListening(!isListening)} />
              </div>
              <div className="relative">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder={language === "fr" ? "Décrivez vos symptômes..." : "Describe your symptoms..."}
                  className="pr-12"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            {language === "fr"
              ? "DocIA peut faire des erreurs. Vérifiez les informations importantes."
              : "DocIA can make mistakes. Check important information."}
          </p>
        </div>
      </div>
    </div>
  )
}
