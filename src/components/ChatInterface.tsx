import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, Copy, CheckCircle } from "lucide-react";
import API_BASE_URL, { API_ENDPOINTS } from "@/api/config";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

const generateDemoResponse = (input: string): string => {
  const lowercaseInput = input.toLowerCase();
  
  if (lowercaseInput.includes('wallet') || lowercaseInput.includes('address')) {
    return 'Based on wallet analysis, I can see transaction patterns indicating active NFT trading. The wallet shows diversified holdings across multiple collections with strong performance metrics.';
  }
  
  if (lowercaseInput.includes('market') || lowercaseInput.includes('trend')) {
    return 'Current market analysis shows bullish trends for blue-chip NFT collections. Volume is up 15% this week, with increased activity in the art and gaming sectors.';
  }
  
  if (lowercaseInput.includes('risk') || lowercaseInput.includes('assessment')) {
    return 'Risk assessment indicates moderate exposure with good diversification. Recommend monitoring liquidity levels and consider rebalancing if concentration exceeds 30% in any single collection.';
  }
  
  if (lowercaseInput.includes('collection') || lowercaseInput.includes('nft')) {
    return 'Collection analysis reveals strong fundamentals with active community engagement. Floor price stability and consistent trading volume suggest healthy market dynamics.';
  }
  
  return 'I\'m analyzing your request using current NFT market data. The insights suggest maintaining a balanced approach with focus on established collections while monitoring emerging opportunities.';
};

export const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your NFT Intelligence AI assistant. Ask me anything about NFT analytics, market trends, or wallet analysis.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy message",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
  
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };
  
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);
  
    try {
      // Call your real backend API
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.chat}`, {
        message: userMessage.content,
        userId: 'frontend-user-' + Date.now()
      });
  
      // Add AI response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.data.response,
        timestamp: new Date()
      };
  
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error: any) {
      console.error('Chat API Error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error. Please make sure the backend server is running on http://localhost:3000',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            AI Chat Assistant
          </h2>
          <p className="text-muted-foreground text-lg">
            Get instant insights about NFTs, market trends, and portfolio analysis
          </p>
        </div>

        <Card className="glass border-primary/20 glow">
          <div className="p-6">
            {/* Chat Messages */}
            <ScrollArea className="h-96 mb-4" ref={scrollAreaRef}>
              <div className="space-y-4 pr-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-gradient-primary' 
                        : 'glass border border-primary/20'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Bot className="w-4 h-4 text-primary" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'text-right' : ''}`}>
                      <div className={`p-3 rounded-2xl ${
                        message.type === 'user' 
                          ? 'chat-bubble-user' 
                          : 'chat-bubble-ai'
                      } ${message.isTyping ? 'animate-pulse' : ''}`}>
                        {message.isTyping ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">{message.content}</span>
                          </div>
                        ) : (
                          <div className="group relative">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                            {message.type === 'ai' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                onClick={() => copyToClipboard(message.content)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 px-3">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about NFT trends, wallet analysis, or market insights..."
                className="glass border-primary/20 focus:border-primary/50 bg-muted/50"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground border-0 px-6"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center justify-center mt-4 gap-2">
              <div className="w-2 h-2 rounded-full status-online animate-pulse" />
              <span className="text-xs text-muted-foreground">
                AI Assistant Ready
              </span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};