
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Send, 
  Bot,
  User,
  Sparkles,
  Clock,
  Search
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  meetingContext?: string;
}

interface AIMeetingChatProps {
  meetingId?: string;
  meetingTitle?: string;
}

export const AIMeetingChat = ({ meetingId, meetingTitle }: AIMeetingChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample queries for quick access
  const sampleQueries = [
    "What were the main action items?",
    "What did Sarah say about the timeline?",
    "Summarize the key decisions made",
    "Who was assigned to lead the project?",
    "What are the next steps discussed?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (query: string) => {
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date().toISOString(),
      meetingContext: meetingId
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(query),
        timestamp: new Date().toISOString(),
        meetingContext: meetingId
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (query: string): string => {
    // Mock AI responses based on query patterns
    if (query.toLowerCase().includes('action items')) {
      return "Based on the meeting transcript, here are the main action items:\n\n1. **Sarah** - Complete market research by Friday\n2. **Mike** - Prepare technical specification document\n3. **Team** - Schedule follow-up meeting for next week\n4. **John** - Review budget allocation for Q1";
    }
    
    if (query.toLowerCase().includes('timeline')) {
      return "Regarding the timeline discussion:\n\nSarah mentioned that the project should be completed within 6 weeks. She specifically said: 'We need to deliver this by March 15th to meet the client deadline. The development phase should take 4 weeks, with 2 weeks for testing and deployment.'";
    }
    
    if (query.toLowerCase().includes('decisions')) {
      return "Key decisions made in this meeting:\n\n• **Technology Stack**: Agreed to use React and Node.js\n• **Budget Approval**: $50,000 approved for Q1\n• **Team Structure**: Mike will lead development, Sarah handles project management\n• **Meeting Cadence**: Weekly status meetings every Tuesday at 2 PM";
    }
    
    return "I found relevant information in the meeting transcript. Based on the context of your question, here are the key points discussed that relate to your query. Would you like me to elaborate on any specific aspect?";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSampleQuery = (query: string) => {
    sendMessage(query);
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          <CardTitle className="text-xl font-semibold text-gray-900">
            AI Meeting Chat
          </CardTitle>
          {meetingTitle && (
            <Badge variant="outline" className="text-xs">
              {meetingTitle}
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">
          Ask anything about your meeting content
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Sample Queries */}
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 font-medium">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {sampleQueries.map((query, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSampleQuery(query)}
                  className="text-xs bg-white/80 hover:bg-blue-50"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {query}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex space-x-3 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type === 'ai' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white ml-auto'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                <div className="flex items-center mt-2 text-xs opacity-70">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {message.type === 'user' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-purple-100 text-purple-600">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about this meeting..."
            className="flex-1 bg-white/80"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
