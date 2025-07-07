"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Plus, MessageCircle, User, LogOut, Menu, X, Paperclip, MoreVertical } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { VoiceInput, TextToSpeech } from "@/components/voice-input"
import { SmartSuggestions } from "@/components/smart-suggestions"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [conversationHistory, setConversationHistory] = useState<string[]>([])

  useEffect(() => {
    checkUser()
    loadConversations()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth")
      return
    }
    setUser(user)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadConversations = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (data && !error) {
      setConversations(data)
    }
  }

  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (data && !error) {
      setMessages(data)
    }
  }

  const createNewConversation = async () => {
    if (!user) return

    const title = `Nouvelle conversation ${new Date().toLocaleDateString("fr-FR")}`

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        title,
      })
      .select()
      .single()

    if (data && !error) {
      setCurrentConversation(data.id)
      setMessages([])
      loadConversations()
    }
  }

  const selectConversation = (conversationId: string) => {
    setCurrentConversation(conversationId)
    loadMessages(conversationId)
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    let conversationId = currentConversation

    // Créer une nouvelle conversation si nécessaire
    if (!conversationId) {
      await createNewConversation()
      conversationId = currentConversation
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setConversationHistory((prev) => [...prev, input])
    setInput("")
    setLoading(true)
    setShowSuggestions(false)

    try {
      const response = await fetch("/api/chat/enhanced", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          conversationId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message,
          created_at: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        loadConversations()
      } else {
        throw new Error(data.error?.message || "Erreur lors de l'envoi du message")
      }
    } catch (error) {
      console.error("Erreur:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Désolé, une erreur s'est produite. Veuillez réessayer dans quelques instants.",
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    setShowSuggestions(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-80" : "w-0 overflow-hidden",
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Image src="/images/logo.png" alt="DocIA" width={32} height={32} className="rounded-full" />
              <span className="font-bold text-teal-900">DocIA</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={createNewConversation} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle conversation
          </Button>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <Button
                key={conversation.id}
                variant={currentConversation === conversation.id ? "secondary" : "ghost"}
                className="w-full justify-start text-left h-auto p-3"
                onClick={() => selectConversation(conversation.id)}
              >
                <MessageCircle className="h-4 w-4 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{conversation.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(conversation.updated_at).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user?.user_metadata?.full_name || user?.email}</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-500 hover:text-red-600">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {!sidebarOpen && (
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-4 w-4" />
                </Button>
              )}
              <div className="flex items-center space-x-3">
                <Image src="/images/logo.png" alt="DocIA Assistant" width={40} height={40} className="rounded-full" />
                <div>
                  <h1 className="font-bold text-teal-900">DocIA Assistant</h1>
                  <p className="text-sm text-gray-500">Votre assistant santé intelligent</p>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Image
                  src="/images/logo.png"
                  alt="DocIA"
                  width={80}
                  height={80}
                  className="mx-auto rounded-full mb-4"
                />
                <h2 className="text-2xl font-bold text-teal-900 mb-2">Comment puis-je vous aider aujourd'hui ?</h2>
                <p className="text-gray-600 mb-8">
                  Posez-moi vos questions de santé et je vous fournirai des informations fiables et personnalisées.
                </p>

                {showSuggestions && (
                  <SmartSuggestions onSuggestionClick={handleSuggestionClick} userHistory={conversationHistory} />
                )}
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-4", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src="/images/logo.png" />
                      <AvatarFallback className="bg-teal-100 text-teal-600">AI</AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 relative group",
                      message.role === "user" ? "bg-teal-600 text-white" : "bg-white border border-gray-200",
                    )}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                    <div className="flex items-center justify-between mt-2">
                      <div
                        className={cn(
                          "text-xs opacity-70",
                          message.role === "user" ? "text-teal-100" : "text-gray-500",
                        )}
                      >
                        {new Date(message.created_at).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      {message.role === "assistant" && <TextToSpeech text={message.content} />}
                    </div>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gray-100">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}

            {loading && (
              <div className="flex gap-4 justify-start">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src="/images/logo.png" />
                  <AvatarFallback className="bg-teal-100 text-teal-600">AI</AvatarFallback>
                </Avatar>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto">
            <div className="relative flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Posez votre question de santé..."
                  className="pr-20 py-3 text-base border-2 border-gray-200 focus:border-teal-500 rounded-2xl"
                  disabled={loading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <VoiceInput onTranscript={handleVoiceTranscript} disabled={loading} />
                </div>
              </div>
              <Button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl px-6 py-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center mt-2">
              <p className="text-xs text-gray-500">
                DocIA peut faire des erreurs. Vérifiez les informations importantes avec un professionnel de santé.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
