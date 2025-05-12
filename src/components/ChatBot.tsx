
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockFAQs, motivationalQuotes } from '@/services/mockData';
import { useAuth } from '@/contexts/AuthContext';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const predefinedResponses: Record<string, string> = {
  'hello': 'Hey there! How can I help you today? 😊',
  'hi': 'Hello! What can I assist you with? 🙌',
  'help': "I'm here to help! You can ask me about your grades, black marks, upcoming events, or just chat if you're feeling stressed.",
  'black marks': 'Black marks are assigned for violations of college rules. You accrue points based on severity. 10 points triggers a review, and 15 may lead to suspension.',
  'syllabus': 'You can find your course syllabus in the Syllabus tab. It shows your progress through each topic!',
  'timetable': 'Your personal timetable is available in the Timetable tab. It shows all your scheduled classes and their locations.',
  'grades': 'All your grades are accessible through the Dashboard. You can see a breakdown by course and assignment.',
  "i'm stressed": getRandomMotivationalResponse(),
  'events': 'Check out the Events tab for upcoming campus events! You can RSVP directly through the platform.',
  'competitions': 'Interested in competitions? Visit the Competitions tab to see what\'s coming up and register for those you want to join.'
};

function getRandomMotivationalResponse() {
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  return `It's okay to feel that way sometimes. Remember: "${randomQuote}" 💪 Consider taking a short break or talking to a friend.`;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hi there! 👋 I\'m your Campus Buddy. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate bot typing
    setTimeout(() => {
      const botResponse = generateResponse(inputValue);
      
      setMessages(prev => [
        ...prev, 
        {
          id: (Date.now() + 1).toString(),
          content: botResponse,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Check for exact matches in predefined responses
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (input.includes(key)) {
        return response;
      }
    }
    
    // Check for FAQ matches
    for (const faq of mockFAQs) {
      const questionWords = faq.question.toLowerCase().split(' ');
      const matchCount = questionWords.filter(word => input.includes(word)).length;
      
      // If the input matches more than half the words in a question, return the answer
      if (matchCount > questionWords.length / 2) {
        return faq.answer;
      }
    }
    
    // Default responses based on input analysis
    if (input.includes('thank')) {
      return "You're welcome! Anything else I can help with? 😊";
    }
    
    if (input.includes('bye') || input.includes('goodbye')) {
      return "Bye for now! Remember, I'm here whenever you need assistance. 👋";
    }
    
    if (input.includes('joke') || input.includes('funny')) {
      return "Why don't scientists trust atoms? Because they make up everything! 😂";
    }
    
    // Default response
    return "I'm not sure how to respond to that. You can ask me about your grades, black marks, timetable, syllabus, or upcoming events! 🎓";
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[500px] max-h-[500px] shadow-md">
      <div className="bg-primary p-3 text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-primary-foreground">
            <AvatarFallback>CB</AvatarFallback>
            <AvatarImage src="/placeholder.svg" />
          </Avatar>
          <div>
            <h3 className="font-bold">Campus Buddy</h3>
            <p className="text-xs opacity-90">Your AI Assistant</p>
          </div>
        </div>
      </div>
      
      <CardContent className="flex flex-col flex-grow p-0">
        <ScrollArea className="flex-grow p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={cn(
                  "flex items-start gap-2 animate-fade-in",
                  message.sender === 'user' ? "flex-row-reverse" : ""
                )}
              >
                {message.sender === 'bot' ? (
                  <Avatar className="h-8 w-8 mt-0.5">
                    <AvatarFallback className="bg-primary text-primary-foreground">CB</AvatarFallback>
                    <AvatarImage src="/placeholder.svg" />
                  </Avatar>
                ) : (
                  <Avatar className="h-8 w-8 mt-0.5">
                    <AvatarFallback>{currentUser?.name.charAt(0) || 'U'}</AvatarFallback>
                    <AvatarImage src={currentUser?.profileImage} />
                  </Avatar>
                )}
                <div 
                  className={cn(
                    "rounded-xl p-3 max-w-[80%]",
                    message.sender === 'user' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">CB</AvatarFallback>
                  <AvatarImage src="/placeholder.svg" />
                </Avatar>
                <div className="flex gap-1 p-3 bg-muted rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t flex gap-2">
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isTyping}
            className="px-3"
          >
            <Send size={18} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBot;
