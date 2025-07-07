"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceInputProps {
  onTranscript: (text: string) => void
  disabled?: boolean
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        setIsSupported(true)
        recognitionRef.current = new SpeechRecognition()

        const recognition = recognitionRef.current
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "fr-FR"

        recognition.onstart = () => {
          setIsListening(true)
        }

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          onTranscript(transcript)
          setIsListening(false)
        }

        recognition.onerror = (event) => {
          console.error("Erreur de reconnaissance vocale:", event.error)
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onTranscript])

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={toggleListening}
      disabled={disabled}
      className={cn(
        "h-8 w-8 p-0 transition-colors",
        isListening ? "text-red-500 hover:text-red-600 animate-pulse" : "text-gray-400 hover:text-gray-600",
      )}
      title={isListening ? "Arrêter l'enregistrement" : "Commencer l'enregistrement vocal"}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  )
}

// Composant pour la synthèse vocale
interface TextToSpeechProps {
  text: string
  disabled?: boolean
}

export function TextToSpeech({ text, disabled }: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported("speechSynthesis" in window)
  }, [])

  const speak = () => {
    if (!isSupported || !text) return

    // Arrêter la lecture en cours
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "fr-FR"
    utterance.rate = 0.9
    utterance.pitch = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  if (!isSupported) {
    return null
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={isSpeaking ? stopSpeaking : speak}
      disabled={disabled}
      className={cn(
        "h-6 w-6 p-0 transition-colors",
        isSpeaking ? "text-blue-500 hover:text-blue-600 animate-pulse" : "text-gray-400 hover:text-gray-600",
      )}
      title={isSpeaking ? "Arrêter la lecture" : "Lire le message"}
    >
      <Volume2 className="h-3 w-3" />
    </Button>
  )
}
