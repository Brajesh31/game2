import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { LocalStorageService, TutorSession, TutorMessage } from '../../services/LocalStorageService';
import { MessageCircle, Send, Mic, MicOff, Volume2, VolumeX, Lightbulb, X } from 'lucide-react';

export const AITutor: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSession, setCurrentSession] = useState<TutorSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const studentId = user?.id || 'student-001';

  // Simulated AI responses based on common student questions
  const aiResponses = {
    math: [
      "Great question about math! Let me break this down step by step for you.",
      "I can help you understand this concept better. Let's start with the basics.",
      "Math can be tricky, but once you see the pattern, it becomes much easier!"
    ],
    science: [
      "Science is all about understanding how things work! Let me explain this concept.",
      "That's a fantastic scientific question! Let's explore this together.",
      "Science is everywhere around us. Here's how this concept applies to real life."
    ],
    general: [
      "I'm here to help you learn! What specific part would you like me to explain?",
      "That's a great question! Let me think about the best way to explain this.",
      "Learning is a journey, and I'm here to guide you every step of the way."
    ]
  };

  const quickHelp = [
    "How do I solve fractions?",
    "What is photosynthesis?",
    "Explain gravity to me",
    "Help with multiplication",
    "What are chemical reactions?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startNewSession = () => {
    const session: TutorSession = {
      id: `session_${Date.now()}`,
      studentId,
      startTime: new Date().toISOString(),
      endTime: '',
      messages: [],
      topic: 'General Help',
      helpfulness: 0
    };
    
    setCurrentSession(session);
    setMessages([]);
    
    // Add welcome message
    const welcomeMessage: TutorMessage = {
      id: `msg_${Date.now()}`,
      sender: 'tutor',
      message: "Hi there! I'm your AI learning companion. I'm here to help you understand any topic you're curious about. What would you like to learn today?",
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    
    setMessages([welcomeMessage]);
    setIsOpen(true);
  };

  const sendMessage = (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text || !currentSession || !user?.id) return;

    const userMessage: TutorMessage = {
      id: `msg_${Date.now()}`,
      sender: 'student',
      message: text,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(text);
      const tutorMessage: TutorMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'tutor',
        message: aiResponse,
        timestamp: new Date().toISOString(),
        type: 'text'
      };

      const updatedMessages = [...newMessages, tutorMessage];
      setMessages(updatedMessages);

      // Update session
      const updatedSession = {
        ...currentSession,
        messages: updatedMessages
      };
      setCurrentSession(updatedSession);
    }, 1000 + Math.random() * 2000); // Random delay for realism
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Determine topic
    let topic = 'general';
    if (lowerMessage.includes('math') || lowerMessage.includes('number') || lowerMessage.includes('calculate') || lowerMessage.includes('fraction') || lowerMessage.includes('multiply')) {
      topic = 'math';
    } else if (lowerMessage.includes('science') || lowerMessage.includes('chemistry') || lowerMessage.includes('physics') || lowerMessage.includes('biology') || lowerMessage.includes('photosynthesis') || lowerMessage.includes('gravity')) {
      topic = 'science';
    }

    // Get appropriate response
    const responses = aiResponses[topic as keyof typeof aiResponses];
    const baseResponse = responses[Math.floor(Math.random() * responses.length)];

    // Add specific help based on keywords
    if (lowerMessage.includes('fraction')) {
      return baseResponse + " When working with fractions, remember that the top number (numerator) tells you how many parts you have, and the bottom number (denominator) tells you how many parts make up the whole. Would you like me to show you some examples?";
    } else if (lowerMessage.includes('photosynthesis')) {
      return baseResponse + " Photosynthesis is how plants make their own food using sunlight, water, and carbon dioxide. Think of it as the plant's kitchen where sunlight is the energy source! The plant takes in CO₂ from the air and water from its roots, and with sunlight, it creates glucose (sugar) for energy and releases oxygen as a bonus for us to breathe.";
    } else if (lowerMessage.includes('gravity')) {
      return baseResponse + " Gravity is the force that pulls objects toward each other. Earth's gravity pulls everything toward its center, which is why things fall down instead of floating away! The bigger an object is, the stronger its gravitational pull. That's why the Moon orbits Earth, and Earth orbits the Sun.";
    } else if (lowerMessage.includes('multiply')) {
      return baseResponse + " Multiplication is like repeated addition! For example, 4 × 3 means adding 4 three times: 4 + 4 + 4 = 12. You can also think of it as making groups - 4 groups of 3 things each gives you 12 things total.";
    }

    return baseResponse + " Can you tell me more specifically what you'd like help with?";
  };

  const endSession = () => {
    if (currentSession) {
      const endedSession = {
        ...currentSession,
        endTime: new Date().toISOString(),
        messages
      };
      
      LocalStorageService.saveTutorSession(endedSession);
    }
    
    setIsOpen(false);
    setCurrentSession(null);
    setMessages([]);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real implementation, this would use Web Speech API
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInputMessage("This is a simulated voice input feature.");
      }, 2000);
    }
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    // In a real implementation, this would use Speech Synthesis API
    if (!isSpeaking && messages.length > 0) {
      const lastTutorMessage = messages.filter(m => m.sender === 'tutor').pop();
      if (lastTutorMessage) {
        // Simulate speaking
        setTimeout(() => setIsSpeaking(false), 3000);
      }
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={startNewSession}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-student-primary to-student-secondary rounded-full shadow-student-hover hover:shadow-student-glow transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center student-achievement-glow"
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </button>

      {/* Chat Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={endSession} 
        title="AI Learning Companion"
        size="lg"
      >
        <div className="flex flex-col h-96">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-student-background rounded-lg">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.sender === 'student'
                      ? 'bg-student-primary text-white shadow-student-card'
                      : 'bg-white border border-border shadow-student-card'
                  }`}
                >
                  {message.sender === 'tutor' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-student-primary" />
                      <span className="text-xs font-semibold text-student-primary">AI Tutor</span>
                    </div>
                  )}
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'student' ? 'text-white opacity-80' : 'text-student-text-secondary'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Help Buttons */}
          <div className="p-4 border-t border-border">
            <div className="mb-3">
              <p className="text-sm text-student-text-secondary mb-2">Quick help topics:</p>
              <div className="flex flex-wrap gap-2">
                {quickHelp.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(topic)}
                    className="px-3 py-1 bg-student-primary/10 text-student-primary rounded-full text-xs hover:bg-student-primary/20 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask me anything about your studies..."
                  className="input-student w-full pr-12 focus:ring-student-secondary focus:border-student-secondary"
                />
                <button
                  onClick={toggleListening}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                    isListening 
                      ? 'text-red-500 bg-red-50' 
                      : 'text-student-secondary hover:bg-student-background'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>

              <Button
                onClick={toggleSpeaking}
                variant="ghost"
                size="sm"
                className={`${
                  isSpeaking 
                    ? 'text-student-primary bg-student-primary/10' 
                    : 'text-student-secondary hover:bg-student-background'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>

              <Button
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim()}
                className="btn-student-primary student-click-bounce"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Demo Note */}
          <div className="p-3 bg-student-primary/10 rounded-lg border border-student-primary/20">
            <p className="text-student-primary text-xs">
              🤖 <strong>AI Tutor Demo:</strong> This simulates our intelligent tutoring system. 
              In the full version, the AI would provide personalized explanations, adaptive hints, 
              and real-time voice interaction using advanced natural language processing.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};