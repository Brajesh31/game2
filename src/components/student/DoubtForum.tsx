import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { MessageSquare, Plus, ThumbsUp, CheckCircle, Clock, User } from 'lucide-react';

export const DoubtForum: React.FC = () => {
  const { user } = useAuth();
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    description: '',
    subject: 'Mathematics',
    tags: [] as string[]
  });

  const forumPosts = [
    {
      id: 'post-1',
      title: 'How to solve quadratic equations using factorization?',
      description: 'I\'m struggling with factoring quadratic equations. Can someone explain the steps?',
      author: 'Priya Singh',
      subject: 'Mathematics',
      timestamp: '2 hours ago',
      upvotes: 15,
      answers: 8,
      solved: true,
      tags: ['algebra', 'quadratic', 'factorization'],
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 'post-2',
      title: 'Difference between mitosis and meiosis?',
      description: 'I get confused between these two types of cell division. What are the key differences?',
      author: 'Rahul Kumar',
      subject: 'Biology',
      timestamp: '4 hours ago',
      upvotes: 23,
      answers: 12,
      solved: true,
      tags: ['cell-division', 'biology', 'genetics'],
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 'post-3',
      title: 'Help with chemical bonding concepts',
      description: 'Can someone explain ionic vs covalent bonding with examples?',
      author: 'Aarav Sharma',
      subject: 'Chemistry',
      timestamp: '1 day ago',
      upvotes: 8,
      answers: 5,
      solved: false,
      tags: ['chemistry', 'bonding', 'ionic', 'covalent'],
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  const mockAnswers = [
    {
      id: 'answer-1',
      author: 'Math Expert',
      content: 'To factor quadratic equations, follow these steps: 1) Look for common factors, 2) Find two numbers that multiply to give \'c\' and add to give \'b\', 3) Write as (x + m)(x + n)',
      timestamp: '1 hour ago',
      upvotes: 12,
      verified: true,
      isTeacher: true
    },
    {
      id: 'answer-2',
      author: 'Ananya Patel',
      content: 'I found this method helpful: For ax² + bx + c, multiply \'a\' and \'c\', then find factors of this product that add up to \'b\'.',
      timestamp: '30 minutes ago',
      upvotes: 8,
      verified: false,
      isTeacher: false
    }
  ];

  const handleCreatePost = () => {
    if (!newQuestion.title || !newQuestion.description) return;

    if (!newQuestion.title || !newQuestion.description) return;

    // Save to localStorage
    const posts = JSON.parse(localStorage.getItem('forum_posts') || '[]');
    posts.push({
      ...newQuestion,
      id: `post-${Date.now()}`,
      author: user?.name,
      timestamp: new Date().toISOString(),
      upvotes: 0,
      answers: 0,
      solved: false
    });
    localStorage.setItem('forum_posts', JSON.stringify(posts));

    setNewQuestion({ title: '', description: '', subject: 'Mathematics', tags: [] });
    setShowCreateModal(false);
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'Mathematics': 'bg-blue-100 text-blue-800',
      'Physics': 'bg-purple-100 text-purple-800',
      'Chemistry': 'bg-green-100 text-green-800',
      'Biology': 'bg-teal-100 text-teal-800',
      'English': 'bg-orange-100 text-orange-800'
    };
    return colors[subject] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">❓ Doubt Solving Forum</h1>
        <p className="text-xl text-student-text-secondary">Ask questions, share knowledge, and learn together</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="student-card text-center p-6 animate-student-slide-up">
          <MessageSquare className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">{forumPosts.length}</div>
          <div className="text-student-text-secondary">Total Questions</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.1s' }}>
          <CheckCircle className="w-8 h-8 mx-auto text-student-accent mb-2" />
          <div className="text-2xl font-bold text-student-text">{forumPosts.filter(p => p.solved).length}</div>
          <div className="text-student-text-secondary">Solved</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
          <ThumbsUp className="w-8 h-8 mx-auto text-student-secondary mb-2" />
          <div className="text-2xl font-bold text-student-text">46</div>
          <div className="text-student-text-secondary">Total Upvotes</div>
        </div>
        
        <div className="student-card text-center p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
          <User className="w-8 h-8 mx-auto text-student-primary mb-2" />
          <div className="text-2xl font-bold text-student-text">25</div>
          <div className="text-student-text-secondary">Total Answers</div>
        </div>
      </div>

      {/* Create Question Button */}
      <div className="flex justify-center">
        <Button 
          icon={Plus}
          onClick={() => setShowCreateModal(true)}
          className="btn-student-primary student-click-bounce"
          size="lg"
        >
          Ask a Question
        </Button>
      </div>

      {/* Forum Posts */}
      <div className="space-y-6">
        {forumPosts.map((post, index) => (
          <div 
            key={post.id} 
            className="student-card p-6 hover:shadow-student-hover transition-all duration-300 animate-student-slide-up student-hover-lift cursor-pointer"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelectedPost(post)}
          >
            <div className="flex items-start space-x-4">
              <img 
                src={post.avatar} 
                alt={post.author}
                className="w-12 h-12 rounded-full object-cover shadow-student-card"
              />
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-student-text">{post.title}</h3>
                  {post.solved && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Solved
                    </span>
                  )}
                </div>

                <p className="text-student-text-secondary mb-3">{post.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-student-text-secondary">
                    <span>by {post.author}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getSubjectColor(post.subject)}`}>
                      {post.subject}
                    </span>
                    <span>{post.timestamp}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4 text-student-primary" />
                      <span className="text-student-text">{post.upvotes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4 text-student-secondary" />
                      <span className="text-student-text">{post.answers}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-student-background-secondary text-student-text-secondary rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Detail Modal */}
      <Modal 
        isOpen={!!selectedPost} 
        onClose={() => setSelectedPost(null)} 
        title="Question Details"
        size="xl"
      >
        {selectedPost && (
          <div className="space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-2xl font-bold text-student-text mb-2">{selectedPost.title}</h2>
              <p className="text-student-text-secondary mb-4">{selectedPost.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={selectedPost.avatar} 
                    alt={selectedPost.author}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-student-text">{selectedPost.author}</span>
                  <span className="text-student-text-secondary">•</span>
                  <span className="text-student-text-secondary">{selectedPost.timestamp}</span>
                </div>
                
                <Button variant="ghost" size="sm" icon={ThumbsUp} className="text-student-primary">
                  {selectedPost.upvotes}
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-student-text mb-4">Answers ({mockAnswers.length})</h3>
              <div className="space-y-4">
                {mockAnswers.map((answer) => (
                  <div key={answer.id} className="p-4 bg-student-background-secondary rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-student-text">{answer.author}</span>
                        {answer.isTeacher && (
                          <span className="px-2 py-1 bg-student-primary text-white rounded-full text-xs font-bold">
                            Teacher
                          </span>
                        )}
                        {answer.verified && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" icon={ThumbsUp} className="text-student-primary">
                          {answer.upvotes}
                        </Button>
                        <span className="text-xs text-student-text-secondary">{answer.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-student-text">{answer.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="font-semibold text-student-text mb-3">Your Answer</h4>
              <textarea
                className="input-student w-full h-24 focus:ring-student-secondary focus:border-student-secondary"
                placeholder="Share your knowledge to help solve this question..."
              />
              <div className="flex justify-end mt-3">
                <Button className="btn-student-primary student-click-bounce">
                  Post Answer
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Question Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        title="Ask a Question"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Question Title</label>
            <input
              type="text"
              value={newQuestion.title}
              onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
              className="input-student w-full focus:ring-student-secondary focus:border-student-secondary"
              placeholder="What's your question?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Subject</label>
            <select
              value={newQuestion.subject}
              onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
              className="input-student w-full focus:ring-student-secondary focus:border-student-secondary"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="English">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Detailed Description</label>
            <textarea
              value={newQuestion.description}
              onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
              className="input-student w-full h-32 focus:ring-student-secondary focus:border-student-secondary"
              placeholder="Provide more details about your question..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setShowCreateModal(false)}
              className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePost}
              className="btn-student-primary student-click-bounce"
            >
              Post Question
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};