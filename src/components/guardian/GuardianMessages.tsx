import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useGlobalState } from '../../hooks/useGlobalState';
import { Guardian } from '../../types';
import { Send, Volume2, Mic, MessageSquare } from 'lucide-react';

export const GuardianMessages: React.FC = () => {
  const { userData } = useAuth();
  const { state, addMessage } = useGlobalState();
  const [newMessage, setNewMessage] = useState('');
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  
  const guardian = userData as Guardian;

  if (!guardian || !guardian.user) {
    return <div>Loading...</div>;
  }

  const currentChild = guardian.childrenProgress[selectedChildIndex];
  
  // Get messages between guardian and teacher about current child
  const getMessagesForChild = () => {
    const studentId = currentChild?.id;
    if (!studentId) return [];
    
    return state.messages?.filter((m: any) => 
      m.studentId === studentId && 
      (m.toId === guardian.user.id || m.fromId === guardian.user.id)
    ).sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) || [];
  };

  const messages = getMessagesForChild();

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentChild) return;

    // Validate message content
    if (newMessage.length > 1000) {
      showToast({
        type: 'error',
        title: 'Message Too Long',
        message: 'Please keep your message under 1000 characters.',
        duration: 3000
      });
      return;
    }
    
    // Find teacher ID (simplified - in real app would be more robust)
    const teacherId = 'teacher-001';

    console.log('Guardian sending message about child:', currentChild.id);
    
    addMessage({
      fromId: guardian.user.id,
      toId: teacherId,
      studentId: currentChild.id,
      subject: `Message about ${currentChild.name}`,
      message: newMessage,
      type: 'general'
    });

    setNewMessage('');
    
    showToast({
      type: 'success',
      title: 'Message Sent',
      message: 'Your message has been sent to the teacher.',
      duration: 3000
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-guardian-slide-up">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-guardian-text mb-4">Messages</h1>
        <p className="text-2xl text-guardian-text-secondary">
          Chat with your child's teacher
        </p>
      </div>

      {/* Child Selector - Only show if multiple children */}
      {guardian.childrenProgress.length > 1 && (
        <div className="guardian-card p-6 animate-guardian-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold text-guardian-text mb-4 text-center">Select Your Child</h2>
          <div className="flex justify-center space-x-4">
            {guardian.childrenProgress.map((child, index) => (
              <Button
                key={child.id}
                className={selectedChildIndex === index ? 'btn-guardian-primary' : 'border-guardian-primary text-guardian-primary hover:bg-guardian-primary hover:text-guardian-on-primary'}
                size="lg"
                onClick={() => setSelectedChildIndex(index)}
              >
                {child.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Container - WhatsApp-like interface */}
      <div className="guardian-card flex flex-col h-[600px] animate-guardian-slide-up" style={{ animationDelay: '0.2s' }}>
        {/* Chat Header */}
        <div className="p-6 border-b border-border bg-guardian-background-tertiary rounded-t-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-guardian-primary rounded-full flex items-center justify-center shadow-guardian-card">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-guardian-text">Teacher Chat</h3>
              <p className="text-guardian-text-secondary">About {currentChild?.name}</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-guardian-background">
          {messages.length > 0 ? (
            messages.map((message: any) => {
              const isFromGuardian = message.fromId === guardian.user.id;
              
              return (
                <div key={message.id} className={`flex ${isFromGuardian ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-6 py-4 ${
                    isFromGuardian 
                      ? 'guardian-message-outgoing text-white' 
                      : 'guardian-message-incoming'
                  }`}>
                    {!isFromGuardian && (
                      <p className="text-sm font-semibold mb-2 text-guardian-primary">Teacher</p>
                    )}
                    <p className="text-lg">{message.message}</p>
                    <p className={`text-sm mt-2 ${
                      isFromGuardian ? 'text-white opacity-80' : 'text-guardian-text-secondary'
                    }`}>
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 mx-auto text-guardian-text-muted mb-4" />
              <h3 className="text-2xl font-bold text-guardian-text mb-2">No messages yet</h3>
              <p className="text-xl text-guardian-text-secondary">
                Start a conversation with {currentChild?.name}'s teacher!
              </p>
            </div>
          )}
        </div>

        {/* Message Input Area */}
        <div className="p-6 border-t border-border bg-guardian-background-secondary rounded-b-xl">
          <div className="flex items-center space-x-4">
            {/* Accessibility Features - Mocked */}
            <Button 
              variant="ghost" 
              size="lg"
              className="text-guardian-secondary hover:bg-guardian-background-tertiary"
              title="Read messages aloud (Coming Soon)"
            >
              <Volume2 className="w-6 h-6" />
            </Button>
            
            {/* Message Input */}
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="input-guardian w-full resize-none"
                rows={2}
              />
            </div>
            
            {/* Voice Input - Mocked */}
            <Button 
              variant="ghost" 
              size="lg"
              className="text-guardian-secondary hover:bg-guardian-background-tertiary"
              title="Voice message (Coming Soon)"
            >
              <Mic className="w-6 h-6" />
            </Button>
            
            {/* Send Button */}
            <Button 
              size="lg"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="px-6 btn-guardian-primary"
            >
              <Send className="w-5 h-5 mr-2" />
              Send
            </Button>
          </div>
          
          {/* Accessibility Note */}
          <div className="mt-4 p-3 bg-guardian-background-tertiary rounded-lg border border-guardian-accent/20">
            <p className="text-guardian-accent text-sm">
              🎤 <strong>Coming Soon:</strong> Voice messages and read-aloud features for easier communication
            </p>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="guardian-card p-6 bg-gradient-to-r from-guardian-background-tertiary to-guardian-background-secondary animate-guardian-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-guardian-text mb-3">Need Help?</h3>
          <p className="text-lg text-guardian-text-secondary mb-4">
            Feel free to ask the teacher about {currentChild?.name}'s progress, homework, or any concerns you have.
          </p>
          <div className="text-4xl mb-2">💬</div>
          <p className="text-guardian-text-secondary">
            Teachers usually respond within 24 hours during school days.
          </p>
        </div>
      </div>
    </div>
  );
};