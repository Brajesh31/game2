import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useGlobalState } from '../../hooks/useGlobalState';
import { useToast } from '../ToastContainer';
import { MessageSquare, Send, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export const ParentCommunication: React.FC = () => {
  const { state, addMessage, getMessagesForUser } = useGlobalState();
  const { showToast } = useToast();
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messageForm, setMessageForm] = useState({
    toId: '',
    studentId: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const students = Object.values(state.users).filter((user: any) => user.role === 'student');
  const guardians = Object.values(state.users).filter((user: any) => user.role === 'guardian');
  
  // Get all conversations grouped by guardian
  const conversations = guardians.map((guardian: any) => {
    const messages = getMessagesForUser(guardian.id);
    const lastMessage = messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    const unreadCount = messages.filter(m => !m.read && m.toId === guardian.id).length;
    
    return {
      guardian,
      messages,
      lastMessage,
      unreadCount,
      student: guardian.children.map((childId: string) => state.users[childId]).filter(Boolean)[0]
    };
  });

  const messageTypes = [
    { value: 'general', label: 'General Update' },
    { value: 'progress_update', label: 'Progress Report' },
    { value: 'concern', label: 'Concern/Issue' },
    { value: 'achievement', label: 'Achievement/Praise' },
    { value: 'meeting_request', label: 'Meeting Request' }
  ];

  const handleSendMessage = () => {
    if (!messageForm.toId || !messageForm.subject || !messageForm.message) {
      showToast({
        type: 'error',
        title: 'Missing Information',
        message: 'Please fill in all required fields',
        duration: 3000
      });
      return;
    }

    addMessage({
      fromId: 'teacher-001',
      ...messageForm
    });

    showToast({
      type: 'success',
      title: 'Message Sent!',
      message: 'Your message has been sent to the guardian',
      duration: 3000
    });

    setMessageForm({
      toId: '',
      studentId: '',
      subject: '',
      message: '',
      type: 'general'
    });
    setShowComposeModal(false);
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'concern': return 'text-red-600 bg-red-50';
      case 'achievement': return 'text-green-600 bg-green-50';
      case 'progress_update': return 'text-blue-600 bg-blue-50';
      case 'meeting_request': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-teacher-primary mb-4">Parent Communication</h1>
        <p className="text-xl text-text-secondary">Stay connected with your students' families</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="teacher-card text-center p-6 animate-teacher-slide-up">
          <MessageSquare className="w-8 h-8 mx-auto text-teacher-primary mb-2" />
          <div className="text-2xl font-bold text-text">{state.messages.length}</div>
          <div className="text-text-secondary">Total Messages</div>
        </div>
        
        <div className="teacher-card text-center p-6 animate-teacher-slide-up" style={{ animationDelay: '0.1s' }}>
          <User className="w-8 h-8 mx-auto text-teacher-primary mb-2" />
          <div className="text-2xl font-bold text-text">{guardians.length}</div>
          <div className="text-text-secondary">Guardian Contacts</div>
        </div>
        
        <div className="teacher-card text-center p-6 animate-teacher-slide-up" style={{ animationDelay: '0.2s' }}>
          <Clock className="w-8 h-8 mx-auto text-teacher-accent mb-2" />
          <div className="text-2xl font-bold text-text">
            {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
          </div>
          <div className="text-text-secondary">Unread Messages</div>
        </div>
        
        <div className="teacher-card text-center p-6 cursor-pointer animate-teacher-slide-up" style={{ animationDelay: '0.3s' }} onClick={() => setShowComposeModal(true)}>
          <Send className="w-8 h-8 mx-auto text-teacher-primary mb-2" />
          <div className="text-lg font-bold text-text">Compose</div>
          <div className="text-text-secondary">New Message</div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="teacher-card p-6 animate-teacher-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text">Recent Conversations</h2>
          <Button variant="outline" size="sm" className="border-teacher-primary text-teacher-primary hover:bg-teacher-primary hover:text-white">
            Mark All Read
          </Button>
        </div>
        
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <div 
              key={conversation.guardian.id} 
              className="p-4 bg-teacher-background-tertiary rounded-lg hover:shadow-teacher-card transition-all duration-300 cursor-pointer hover:bg-teacher-background-secondary"
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={conversation.guardian.avatar}
                    alt={conversation.guardian.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-text">{conversation.guardian.name}</h3>
                    <p className="text-sm text-text-secondary">
                      Parent of {conversation.student?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {conversation.unreadCount > 0 && (
                    <span className="bg-teacher-accent text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                  <span className="text-sm text-text-secondary">
                    {conversation.lastMessage ? new Date(conversation.lastMessage.timestamp).toLocaleDateString() : 'No messages'}
                  </span>
                </div>
              </div>
              
              {conversation.lastMessage && (
                <div className="pl-15">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getMessageTypeColor(conversation.lastMessage.type)}`}>
                      {messageTypes.find(t => t.value === conversation.lastMessage.type)?.label}
                    </span>
                  </div>
                  <p className="text-text font-medium">{conversation.lastMessage.subject}</p>
                  <p className="text-text-secondary text-sm mt-1 line-clamp-2">
                    {conversation.lastMessage.message}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Compose Message Modal */}
      <Modal 
        isOpen={showComposeModal} 
        onClose={() => setShowComposeModal(false)} 
        title="Compose Message"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Student *</label>
              <select
                value={messageForm.studentId}
                onChange={(e) => {
                  const studentId = e.target.value;
                  const student = state.users[studentId];
                  const guardian = Object.values(state.users).find((u: any) => 
                    u.role === 'guardian' && u.children.includes(studentId)
                  );
                  setMessageForm({ 
                    ...messageForm, 
                    studentId,
                    toId: guardian?.id || ''
                  });
                }}
                className="input-teacher w-full focus:ring-teacher-primary focus:border-teacher-primary"
              >
                <option value="">Select a student</option>
                {students.map((student: any) => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text mb-2">Message Type</label>
              <select
                value={messageForm.type}
                onChange={(e) => setMessageForm({ ...messageForm, type: e.target.value })}
                className="input-teacher w-full focus:ring-teacher-primary focus:border-teacher-primary"
              >
                {messageTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Subject *</label>
            <input
              type="text"
              value={messageForm.subject}
              onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
              className="input-teacher w-full focus:ring-teacher-primary focus:border-teacher-primary"
              placeholder="Enter message subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Message *</label>
            <textarea
              value={messageForm.message}
              onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
              rows={6}
              className="input-teacher w-full focus:ring-teacher-primary focus:border-teacher-primary"
              placeholder="Write your message here..."
            />
          </div>

          {messageForm.studentId && (
            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="font-semibold text-teal-800 mb-2">Message Preview</h4>
              <div className="text-teal-700 text-sm">
                <p><strong>To:</strong> {state.users[messageForm.toId]?.name}</p>
                <p><strong>Regarding:</strong> {state.users[messageForm.studentId]?.name}</p>
                <p><strong>Type:</strong> {messageTypes.find(t => t.value === messageForm.type)?.label}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowComposeModal(false)}>
              Cancel
            </Button>
            <Button icon={Send} onClick={handleSendMessage} className="btn-teacher-primary">
              Send Message
            </Button>
          </div>
        </div>
      </Modal>

      {/* Conversation Detail Modal */}
      <Modal 
        isOpen={!!selectedConversation} 
        onClose={() => setSelectedConversation(null)} 
        title={`Conversation with ${selectedConversation?.guardian.name}`}
        size="lg"
      >
        {selectedConversation && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-background-secondary rounded-lg">
              <img
                src={selectedConversation.guardian.avatar}
                alt={selectedConversation.guardian.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-bold text-text">{selectedConversation.guardian.name}</h3>
                <p className="text-text-secondary">Parent of {selectedConversation.student?.name}</p>
                <p className="text-sm text-text-secondary">{selectedConversation.guardian.email}</p>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-4">
              {selectedConversation.messages.length > 0 ? (
                selectedConversation.messages
                  .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                  .map((message: any) => (
                    <div key={message.id} className="p-4 bg-teacher-background-tertiary rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${getMessageTypeColor(message.type)}`}>
                            {messageTypes.find(t => t.value === message.type)?.label}
                          </span>
                          {!message.read && <span className="w-2 h-2 bg-teacher-accent rounded-full"></span>}
                        </div>
                        <span className="text-sm text-text-secondary">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <h4 className="font-semibold text-text mb-2">{message.subject}</h4>
                      <p className="text-text">{message.message}</p>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-text-secondary">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-teacher-primary opacity-50" />
                  <p>No messages yet. Start a conversation!</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={() => {
                  setMessageForm({
                    ...messageForm,
                    toId: selectedConversation.guardian.id,
                    studentId: selectedConversation.student?.id || ''
                  });
                  setSelectedConversation(null);
                  setShowComposeModal(true);
                }}
                className="btn-teacher-primary"
              >
                Reply
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};