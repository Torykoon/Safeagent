import { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import { Bot, Send, Trash2, Sparkles, User, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TypingIndicator } from './components/typing-indicator'
import { RiskChipList } from './components/risk-chip'
import { MarkdownRenderer } from './components/markdown-renderer'
import {
  type ChatMessage,
  type ChatRequest,
  type ChatResponse,
} from './data/api-types'

const API_URL = 'http://43.200.214.138:8080/ragcon'

export function Chats() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      )
      if (scrollContainer) {
        // Use smooth scroll for better UX
        setTimeout(() => {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: 'smooth'
          })
        }, 100)
      }
    }
  }, [messages, isLoading])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const sendMessage = async (question: string) => {
    if (!question.trim() || isLoading) return

    // Add user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question.trim(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const request: ChatRequest = { question: question.trim() }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ChatResponse = await response.json()

      // Add assistant message with risk data
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          data.answer || data.state?.answer_text || '응답을 받지 못했습니다.',
        timestamp: new Date(),
        riskData: data.state?.risk_data,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat API error:', error)
      toast.error('메시지 전송에 실패했습니다. 다시 시도해주세요.')

      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          '죄송합니다. 응답을 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  const clearChat = () => {
    setMessages([])
    toast.success('대화 내용이 삭제되었습니다.')
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <div className="flex h-full flex-col">
          {/* Chat Container */}
          <div className="bg-gradient-to-b from-background via-background to-muted/30 flex flex-1 flex-col rounded-2xl border border-border/50 shadow-xl overflow-hidden backdrop-blur-sm">
            {/* Agent Header - Modern Glass Design */}
            <div className="relative overflow-hidden border-b border-border/50">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
              <div className="absolute -top-24 -right-24 size-48 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 size-48 bg-primary/5 rounded-full blur-3xl" />

              <div className="relative px-6 py-5 flex items-center justify-between backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                    <Avatar className="relative size-14 bg-gradient-to-br from-primary via-primary/80 to-primary/60 shadow-lg ring-2 ring-white/20">
                      <AvatarFallback className="bg-transparent">
                        <Bot className="size-7 text-primary-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5 size-4 bg-green-500 rounded-full ring-2 ring-background flex items-center justify-center">
                      <span className="size-2 bg-green-300 rounded-full animate-pulse" />
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="font-bold text-xl tracking-tight">
                        SafeAgent
                      </h2>
                      <span className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-primary/20 to-primary/10 text-primary px-2.5 py-1 rounded-full ring-1 ring-primary/20">
                        <Sparkles className="size-3" />
                        AI 어시스턴트
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      건설 안전 위험성 평가 전문 AI
                    </p>
                  </div>
                </div>
                {messages.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearChat}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 rounded-full transition-all duration-200"
                  >
                    <Trash2 className="size-4 me-1.5" />
                    초기화
                  </Button>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-6 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center py-16">
                  {/* Animated Logo */}
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                    <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full p-8 shadow-inner ring-1 ring-primary/20">
                      <MessageSquare className="size-12 text-primary" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    SafeAgent에게 질문하세요
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-md mb-8 leading-relaxed">
                    건설 현장의 위험요소, 안전 대책, 위험성 평가 등에 대해
                    <br />
                    AI 어시스턴트가 도움을 드립니다.
                  </p>

                  {/* Example Questions */}
                  <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                    {[
                      '사다리작업 위험요소 파악',
                      '고소작업 안전대책',
                      '철근작업 위험성평가',
                    ].map((example, idx) => (
                      <Button
                        key={example}
                        variant="outline"
                        size="sm"
                        onClick={() => sendMessage(example)}
                        className={cn(
                          'text-xs rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200',
                          'animate-in fade-in-50 slide-in-from-bottom-2',
                          idx === 1 && 'delay-75',
                          idx === 2 && 'delay-150'
                        )}
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-5 max-w-4xl mx-auto">
                  {messages.map((message, idx) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex gap-3 animate-in fade-in-50 slide-in-from-bottom-3 duration-300',
                        message.role === 'user'
                          ? 'justify-end'
                          : 'justify-start'
                      )}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      {message.role === 'assistant' && (
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 rounded-full blur-md" />
                          <Avatar className="relative size-10 shrink-0 bg-gradient-to-br from-primary via-primary/80 to-primary/60 shadow-md ring-1 ring-white/20">
                            <AvatarFallback className="bg-transparent">
                              <Bot className="size-5 text-primary-foreground" />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      <div
                        className={cn(
                          'shadow-md transition-all duration-200 overflow-hidden',
                          message.role === 'user'
                            ? 'max-w-[75%] bg-gradient-to-br from-primary via-primary/95 to-primary/85 text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 hover:shadow-lg hover:shadow-primary/20'
                            : 'max-w-[90%] bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl rounded-bl-md px-5 py-4 hover:shadow-lg'
                        )}
                      >
                        {message.role === 'assistant' ? (
                          <MarkdownRenderer content={message.content} />
                        ) : (
                          <div className="text-sm whitespace-pre-wrap leading-relaxed">
                            {message.content}
                          </div>
                        )}
                        {message.riskData && message.riskData.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-border/30">
                            <p className="text-xs text-muted-foreground mb-2.5 flex items-center gap-1.5">
                              <span className="size-1.5 bg-amber-500 rounded-full" />
                              관련 위험요인 ({message.riskData.length}건)
                            </p>
                            <RiskChipList riskDataList={message.riskData} />
                          </div>
                        )}
                        <div
                          className={cn(
                            'text-[10px] mt-2.5 flex items-center gap-1',
                            message.role === 'user'
                              ? 'text-primary-foreground/50 justify-end'
                              : 'text-muted-foreground/60'
                          )}
                        >
                          {format(message.timestamp, 'HH:mm')}
                        </div>
                      </div>
                      {message.role === 'user' && (
                        <div className="relative">
                          <div className="absolute inset-0 bg-slate-500/20 rounded-full blur-md" />
                          <Avatar className="relative size-10 shrink-0 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 shadow-md ring-1 ring-white/10">
                            <AvatarFallback className="bg-transparent">
                              <User className="size-5 text-white" />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 animate-in fade-in-50 slide-in-from-bottom-3 duration-300">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse" />
                        <Avatar className="relative size-10 shrink-0 bg-gradient-to-br from-primary via-primary/80 to-primary/60 shadow-md ring-1 ring-white/20">
                          <AvatarFallback className="bg-transparent">
                            <Bot className="size-5 text-primary-foreground" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl rounded-bl-md shadow-md">
                        <TypingIndicator />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input Area - Modern Floating Design */}
            <div className="relative p-4 pt-2">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-muted/80 via-muted/40 to-transparent pointer-events-none" />

              <form
                onSubmit={handleSubmit}
                className="relative flex gap-3 max-w-4xl mx-auto"
              >
                <div
                  className={cn(
                    'bg-background/95 backdrop-blur-md border-2 border-border/60 flex flex-1 items-center rounded-full px-5 shadow-lg',
                    'transition-all duration-300',
                    'focus-within:border-primary/50 focus-within:shadow-xl focus-within:shadow-primary/10',
                    'hover:border-border'
                  )}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="위험요소나 안전 관련 질문을 입력하세요..."
                    className="h-12 w-full bg-transparent text-sm focus-visible:outline-none placeholder:text-muted-foreground/50"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  size="icon"
                  className={cn(
                    'size-12 shrink-0 rounded-full shadow-lg',
                    'bg-gradient-to-br from-primary via-primary/95 to-primary/85',
                    'hover:from-primary/95 hover:via-primary/90 hover:to-primary/80 hover:shadow-xl hover:shadow-primary/25',
                    'transition-all duration-300 disabled:opacity-50',
                    'active:scale-95'
                  )}
                  disabled={!inputValue.trim() || isLoading}
                >
                  <Send className="size-5" />
                  <span className="sr-only">전송</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}
