"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Send,
  Plus,
  MessageCircle,
  User,
  LogOut,
  Menu,
  X,
  Heart,
  Brain,
  Pill,
  Activity,
  Shield,
  Thermometer,
  Stethoscope,
  FileText,
  Trash2,
  Settings,
  Edit,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { VoiceInput, TextToSpeech, FileUploadButton } from "@/components/voice-input"
import { TypingMarkdown } from "@/components/typing-effect"
import { AlertCircle } from "lucide-react" // Import AlertCircle

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  created_at: string
  has_files?: boolean
  metadata?: any
}

interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
  message_count?: number
}

const healthSuggestions = [
  {
    icon: Heart,
    title: "Cardiologie",
    question: "Comment prévenir les maladies cardiovasculaires ?",
    color: "bg-red-500",
    textColor: "text-red-600",
  },
  {
    icon: Brain,
    title: "Neurologie",
    question: "Quels sont les signes d'un AVC ?",
    color: "bg-purple-500",
    textColor: "text-purple-600",
  },
  {
    icon: Pill,
    title: "Médicaments",
    question: "Comment prendre correctement les antibiotiques ?",
    color: "bg-blue-500",
    textColor: "text-blue-600",
  },
  {
    icon: Activity,
    title: "Diabète",
    question: "Comment contrôler sa glycémie au quotidien ?",
    color: "bg-green-500",
    textColor: "text-green-600",
  },
  {
    icon: Shield,
    title: "Prévention",
    question: "Comment renforcer son système immunitaire ?",
    color: "bg-yellow-500",
    textColor: "text-yellow-600",
  },
  {
    icon: Thermometer,
    title: "Symptômes",
    question: "Que faire en cas de fièvre persistante ?",
    color: "bg-orange-500",
    textColor: "text-orange-600",
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [files, setFiles] = useState<File[]>([])
  const [showWelcome, setShowWelcome] = useState(true)
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [newFullName, setNewFullName] = useState("")
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    loadConversations()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setShowWelcome(messages.length === 0)
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
    setNewFullName(user.user_metadata?.full_name || "")
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
        message_count: 0,
      })
      .select()
      .single()

    if (data && !error) {
      setCurrentConversation(data.id)
      setMessages([])
      setFiles([])
      loadConversations()
      return data.id
    }
    return null
  }

  const selectConversation = (conversationId: string) => {
    setCurrentConversation(conversationId)
    setFiles([])
    loadMessages(conversationId)
  }

  const deleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    const { error } = await supabase.from("conversations").delete().eq("id", conversationId)

    if (!error) {
      if (currentConversation === conversationId) {
        setCurrentConversation(null)
        setMessages([])
      }
      loadConversations()
    }
  }

  const updateProfile = async () => {
    if (!user || !newFullName.trim()) return

    setProfileLoading(true)
    setProfileError(null)
    setProfileSuccess(null)

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: newFullName.trim(),
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(newFullName.trim())}&background=0d9488&color=fff`,
        },
      })

      if (error) {
        setProfileError(error.message)
        return
      }

      setProfileSuccess("Profil mis à jour avec succès !")
      setEditingProfile(false)

      // Recharger les données utilisateur
      setTimeout(() => {
        checkUser()
        setProfileSuccess(null)
      }, 2000)
    } catch (error: any) {
      setProfileError("Erreur lors de la mise à jour du profil")
    } finally {
      setProfileLoading(false)
    }
  }

  const deleteAccount = async () => {
    if (!user) return

    setProfileLoading(true)
    setProfileError(null)

    try {
      // Supprimer toutes les conversations de l'utilisateur
      await supabase.from("conversations").delete().eq("user_id", user.id)

      // Note: La suppression du compte utilisateur nécessite des privilèges admin
      // Pour l'instant, on déconnecte l'utilisateur
      await supabase.auth.signOut()
      router.push("/")
    } catch (error: any) {
      setProfileError("Erreur lors de la suppression du compte")
      setProfileLoading(false)
    }
  }

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || input
    if ((!content.trim() && files.length === 0) || loading) return

    let conversationId = currentConversation

    // Créer une nouvelle conversation si nécessaire
    if (!conversationId) {
      conversationId = await createNewConversation()
      if (!conversationId) return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content || "Fichier(s) envoyé(s)",
      created_at: new Date().toISOString(),
      has_files: files.length > 0,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)
    setShowWelcome(false)

    // Créer un message assistant temporaire pour l'effet de frappe
    const tempAssistantId = (Date.now() + 1).toString()
    setTypingMessageId(tempAssistantId)

    try {
      // Préparer FormData pour l'envoi avec fichiers
      const formData = new FormData()
      formData.append(
        "messages",
        JSON.stringify(
          [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        ),
      )
      formData.append("conversationId", conversationId)

      // Ajouter les fichiers
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file)
      })

      const response = await fetch("/api/chat/enhanced", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: Message = {
          id: tempAssistantId,
          role: "assistant",
          content: data.message,
          created_at: new Date().toISOString(),
          metadata: data.metadata,
        }

        setMessages((prev) => [...prev, assistantMessage])
        loadConversations()
      } else {
        throw new Error(data.error?.message || "Erreur lors de l'envoi du message")
      }
    } catch (error) {
      console.error("Erreur:", error)
      const errorMessage: Message = {
        id: tempAssistantId,
        role: "assistant",
        content: "Désolé, une erreur s'est produite. Veuillez réessayer dans quelques instants.",
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
      setFiles([])
      setTypingMessageId(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage()
  }

  const handleSuggestionClick = (question: string) => {
    sendMessage(question)
  }

  const handleVoiceTranscript = (transcript: string) => {
    setInput((prev) => prev + (prev ? " " : "") + transcript)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white/80 backdrop-blur-sm border-r border-teal-200 transition-all duration-300 flex flex-col shadow-lg",
          sidebarOpen ? "w-80" : "w-0 overflow-hidden",
        )}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-teal-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image src="/images/logo.png" alt="DocIA" width={40} height={40} className="rounded-full" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <span className="font-bold text-teal-900 text-lg">DocIA</span>
                <p className="text-xs text-teal-600">Assistant Santé</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={createNewConversation}
            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle conversation
          </Button>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "group relative rounded-xl transition-all",
                  currentConversation === conversation.id
                    ? "bg-teal-100 border border-teal-200 shadow-sm"
                    : "hover:bg-teal-50",
                )}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3 rounded-xl"
                  onClick={() => selectConversation(conversation.id)}
                >
                  <MessageCircle className="h-4 w-4 mr-3 flex-shrink-0 text-teal-600" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium text-sm">{conversation.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-xs text-gray-500">
                        {new Date(conversation.updated_at).toLocaleDateString("fr-FR")}
                      </div>
                      {conversation.message_count && (
                        <Badge variant="secondary" className="text-xs">
                          {conversation.message_count} msg
                        </Badge>
                      )}
                    </div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => deleteConversation(conversation.id, e)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* User Profile */}
        <div className="p-4 border-t border-teal-100 bg-teal-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <Avatar className="h-10 w-10 border-2 border-teal-200">
                <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-teal-100 text-teal-700">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate text-teal-900">
                  {user?.user_metadata?.full_name || user?.email}
                </div>
                <div className="text-xs text-teal-600">Patient</div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-teal-600">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setProfileDialogOpen(true)}>
                  <User className="h-4 w-4 mr-2" />
                  Modifier le profil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDeleteAccountDialogOpen(true)} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer le compte
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-teal-100 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!sidebarOpen && (
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Stethoscope className="h-8 w-8 text-teal-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="font-bold text-teal-900 text-lg">DocIA Assistant</h1>
                  <p className="text-sm text-teal-600">Douala General Hospital • En ligne</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                ✓ Sécurisé
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Gemini AI
              </Badge>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto p-6">
            {showWelcome ? (
              /* Welcome Screen */
              <div className="text-center py-12 space-y-8">
                {/* Logo et titre principal */}
                <div className="space-y-6">
                  <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full animate-pulse opacity-20"></div>
                    <div className="relative bg-gradient-to-r from-teal-500 to-blue-600 rounded-full p-6 shadow-lg">
                      <Stethoscope className="h-12 w-12 text-white" />
                    </div>
                  </div>

                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-3">
                      Comment puis-je vous aider aujourd'hui ?
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                      Posez-moi vos questions de santé, partagez vos documents médicaux ou décrivez vos symptômes. Je
                      peux analyser vos examens, photos et vous fournir des informations personnalisées.
                    </p>
                  </div>
                </div>

                {/* Zone de saisie principale */}
                <div className="max-w-3xl mx-auto space-y-4">
                  <form onSubmit={handleSubmit} className="relative">
                    <div className="relative">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Décrivez vos symptômes, posez une question ou envoyez des documents..."
                        className="w-full h-16 pl-6 pr-32 text-lg border-2 border-teal-200 rounded-2xl focus:border-teal-400 focus:ring-4 focus:ring-teal-100 bg-white/80 backdrop-blur-sm shadow-lg"
                        disabled={loading}
                      />

                      {/* Boutons dans l'input */}
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        <FileUploadButton onFilesChange={setFiles} disabled={loading} />
                        <VoiceInput onTranscript={handleVoiceTranscript} disabled={loading} />
                        <Button
                          type="submit"
                          disabled={(!input.trim() && files.length === 0) || loading}
                          className="h-10 w-10 p-0 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white rounded-full shadow-md"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Compteur de caractères */}
                    <div className="flex justify-between items-center mt-3 px-2">
                      <p className="text-xs text-gray-500">
                        DocIA peut analyser vos documents médicaux et images. Parlez ou tapez votre question.
                      </p>
                      <span className="text-xs text-gray-400">{input.length}/1000</span>
                    </div>
                  </form>
                </div>

                {/* Suggestions de santé */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">Suggestions populaires</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                    {healthSuggestions.map((suggestion, index) => {
                      const Icon = suggestion.icon
                      return (
                        <Card
                          key={index}
                          className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-teal-200 bg-white/80 backdrop-blur-sm"
                          onClick={() => handleSuggestionClick(suggestion.question)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <div
                                className={cn(
                                  "p-3 rounded-xl shadow-sm group-hover:shadow-md transition-all",
                                  suggestion.color.replace("bg-", "bg-").replace("-500", "-100"),
                                )}
                              >
                                <Icon className={cn("h-6 w-6", suggestion.textColor)} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
                                  {suggestion.title}
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed">{suggestion.question}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-8 border-t border-gray-200 mt-12">
                  <p className="text-sm text-gray-500">© 2025 DocIA - Douala General Hospital. Tous droits réservés.</p>
                </div>
              </div>
            ) : (
              /* Messages de conversation */
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex gap-4", message.role === "user" ? "justify-end" : "justify-start")}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-10 w-10 flex-shrink-0 border-2 border-teal-200">
                        <AvatarImage src="/images/logo.png" />
                        <AvatarFallback className="bg-teal-100 text-teal-600">
                          <Stethoscope className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-6 py-4 shadow-md",
                        message.role === "user"
                          ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white"
                          : "bg-white border border-gray-200",
                      )}
                    >
                      {message.role === "assistant" && typingMessageId === message.id ? (
                        <TypingMarkdown
                          text={message.content}
                          speed={20}
                          onComplete={() => setTypingMessageId(null)}
                          className="text-sm leading-relaxed"
                        />
                      ) : (
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
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
                          {message.has_files && (
                            <Badge variant="secondary" className="text-xs">
                              <FileText className="h-3 w-3 mr-1" />
                              Fichiers
                            </Badge>
                          )}
                          {message.metadata?.confidence && (
                            <Badge variant="outline" className="text-xs">
                              {message.metadata.confidence}% confiance
                            </Badge>
                          )}
                        </div>
                        {message.role === "assistant" && <TextToSpeech text={message.content} />}
                      </div>
                    </div>

                    {message.role === "user" && (
                      <Avatar className="h-10 w-10 flex-shrink-0 border-2 border-blue-200">
                        <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-4 justify-start">
                    <Avatar className="h-10 w-10 flex-shrink-0 border-2 border-teal-200">
                      <AvatarImage src="/images/logo.png" />
                      <AvatarFallback className="bg-teal-100 text-teal-600">
                        <Stethoscope className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-md">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area (visible seulement quand il y a des messages) */}
        {!showWelcome && (
          <div className="bg-white/80 backdrop-blur-sm border-t border-teal-100 p-4 shadow-lg">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="relative flex items-center space-x-3">
                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Continuez votre conversation..."
                    className="pr-24 py-3 text-base border-2 border-teal-200 focus:border-teal-400 rounded-2xl bg-white/80 backdrop-blur-sm"
                    disabled={loading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <FileUploadButton onFilesChange={setFiles} disabled={loading} />
                    <VoiceInput onTranscript={handleVoiceTranscript} disabled={loading} />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={(!input.trim() && files.length === 0) || loading}
                  className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white rounded-2xl px-6 py-3 shadow-md"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le profil</DialogTitle>
            <DialogDescription>Modifiez vos informations personnelles</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {profileError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{profileError}</AlertDescription>
              </Alert>
            )}

            {profileSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{profileSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-teal-100 text-teal-700 text-lg">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Photo de profil</p>
                <p className="text-xs text-gray-500">Générée automatiquement à partir de votre nom</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user?.email || ""} disabled className="bg-gray-50" />
              <p className="text-xs text-gray-500">L'email ne peut pas être modifié</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <div className="flex space-x-2">
                <Input
                  id="fullName"
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  disabled={!editingProfile || profileLoading}
                  placeholder="Votre nom complet"
                />
                {!editingProfile ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingProfile(true)}
                    disabled={profileLoading}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex space-x-1">
                    <Button
                      type="button"
                      size="sm"
                      onClick={updateProfile}
                      disabled={profileLoading || !newFullName.trim()}
                    >
                      {profileLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingProfile(false)
                        setNewFullName(user?.user_metadata?.full_name || "")
                        setProfileError(null)
                      }}
                      disabled={profileLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Supprimer le compte</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Toutes vos conversations seront supprimées.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {profileError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{profileError}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Attention</p>
                <p className="text-xs text-red-700">
                  Cette action supprimera définitivement votre compte et toutes vos données.
                </p>
              </div>
            </div>

            <div className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={() => setDeleteAccountDialogOpen(false)} disabled={profileLoading}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={deleteAccount} disabled={profileLoading}>
                {profileLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Supprimer définitivement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
