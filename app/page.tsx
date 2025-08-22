"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Send,
  Bot,
  User,
  Loader2,
  CheckCircle,
  Briefcase,
  Target,
  Calendar,
  Users,
  Copy,
  Edit3,
  Check,
  X,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const suggestedPrompts = [
  {
    icon: Target,
    title: "Konsep Dasar",
    prompt: "Jelaskan konsep dasar manajemen proyek dan mengapa penting dalam organisasi",
  },
  {
    icon: Users,
    title: "Peran Project Manager",
    prompt: "Apa saja peran dan tanggung jawab seorang project manager?",
  },
  {
    icon: Calendar,
    title: "Siklus Hidup Proyek",
    prompt: "Jelaskan tahapan-tahapan dalam siklus hidup proyek beserta karakteristiknya",
  },
  {
    icon: Briefcase,
    title: "Metodologi Proyek",
    prompt: "Bandingkan metodologi Waterfall dan Agile dalam manajemen proyek",
  },
]

const renderMarkdown = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
    .replace(/\n/g, "<br>")
}

export default function APABot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Halo! Saya APA Agent - agen kecerdasan buatan yang dirancang untuk membantu Anda memahami mata kuliah Manajemen Proyek. Sebagai panduan belajar interaktif, saya akan memberikan jawaban dan wawasan berdasarkan dokumentasi yang tersedia.\n\nGunakan saya untuk:\n• Memperdalam pemahaman konsep\n• Mencari informasi spesifik\n• Meninjau materi pelajaran\n• Mendapatkan penjelasan dengan contoh praktis\n\nSilakan pilih salah satu topik di bawah atau tanyakan langsung!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)

  const sendMessage = async (messageText?: string) => {
    const messageToSend = messageText || input
    if (!messageToSend.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageToSend,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setShowSuggestions(false)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          history: messages,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Maaf, terjadi kesalahan saat menghubungi sistem. Silakan coba lagi dalam beberapa saat.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const startEditing = (messageId: string, content: string) => {
    setEditingMessageId(messageId)
    setEditingContent(content)
  }

  const saveEdit = () => {
    if (editingMessageId && editingContent.trim()) {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === editingMessageId ? { ...msg, content: editingContent.trim() } : msg)),
      )
      setEditingMessageId(null)
      setEditingContent("")
    }
  }

  const cancelEdit = () => {
    setEditingMessageId(null)
    setEditingContent("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleSuggestionClick = (prompt: string) => {
    sendMessage(prompt)
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="h-[calc(100vh-2rem)] flex flex-col shadow-xl border-0">
          <CardHeader className="bg-primary text-primary-foreground shrink-0 py-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg p-1">
                <img src="/apa-agent-logo.png" alt="APA Agent Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">APA Agent</span>
                <span className="text-sm font-normal opacity-90">Asisten Pembelajaran Manajemen Proyek</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Siap Membantu
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4 space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="w-8 h-8 bg-accent shrink-0">
                        <AvatarFallback>
                          <Bot className="w-4 h-4 text-accent-foreground" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-[75%] rounded-xl p-4 group relative ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-card-foreground border shadow-sm"
                      }`}
                    >
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-background/20"
                          onClick={() => copyToClipboard(message.content, message.id)}
                        >
                          {copiedMessageId === message.id ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                        {message.role === "user" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-background/20"
                            onClick={() => startEditing(message.id, message.content)}
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>

                      {editingMessageId === message.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="min-h-[80px] bg-background/50 border-border/50"
                            placeholder="Edit your message..."
                          />
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={cancelEdit} className="h-7 px-2 text-xs">
                              <X className="w-3 h-3 mr-1" />
                              Cancel
                            </Button>
                            <Button size="sm" onClick={saveEdit} className="h-7 px-2 text-xs">
                              <Check className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="prose prose-sm max-w-none">
                          <div
                            className="whitespace-pre-wrap leading-relaxed text-sm mb-0 break-words"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                          />
                        </div>
                      )}

                      <span className="text-xs opacity-60 mt-3 block">{message.timestamp.toLocaleTimeString()}</span>
                    </div>

                    {message.role === "user" && (
                      <Avatar className="w-8 h-8 bg-secondary shrink-0">
                        <AvatarFallback>
                          <User className="w-4 h-4 text-secondary-foreground" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {showSuggestions && messages.length === 1 && (
                  <div className="mt-8 px-2">
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Target className="w-4 h-4 text-accent" />
                      Saran Topik Diskusi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {suggestedPrompts.map((suggestion, index) => (
                        <Card
                          key={index}
                          className="cursor-pointer hover:bg-accent/5 hover:border-accent/20 transition-all duration-200 border-border/50"
                          onClick={() => handleSuggestionClick(suggestion.prompt)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex items-center justify-center w-9 h-9 bg-accent/10 rounded-lg shrink-0">
                                <suggestion.icon className="w-4 h-4 text-accent" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm mb-2 text-foreground">{suggestion.title}</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                                  {suggestion.prompt}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="w-8 h-8 bg-accent shrink-0">
                      <AvatarFallback>
                        <Bot className="w-4 h-4 text-accent-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-card border rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-4 h-4 animate-spin text-accent" />
                        <span className="text-sm text-muted-foreground">APA Agent sedang menganalisis...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t bg-card/30 p-4 shrink-0">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tanyakan tentang konsep manajemen proyek..."
                  disabled={isLoading}
                  className="flex-1 bg-background border-border/50 focus:border-accent/50 h-11"
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="bg-primary hover:bg-primary/90 h-11 px-4"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>

              <div className="mt-3 text-xs text-muted-foreground text-center">
                <span className="font-medium">APA Agent</span> • Powered by DeepSeek R1 • Asisten Pembelajaran Manajemen
                Proyek
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
