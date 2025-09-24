import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Heart, Play, Pause, Volume2, VolumeX, Clock, Eye, Moon } from 'lucide-react';

export const WellbeingMode: React.FC = () => {
  const [focusMode, setFocusMode] = useState(false);
  const [breakTimer, setBreakTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState('nature');
  const [studyTime, setStudyTime] = useState(25); // Pomodoro default

  const mindfulAudios = [
    { id: 'nature', name: 'Nature Sounds', description: 'Calming forest and water sounds', icon: '🌿' },
    { id: 'rain', name: 'Gentle Rain', description: 'Peaceful rainfall ambiance', icon: '🌧️' },
    { id: 'ocean', name: 'Ocean Waves', description: 'Soothing ocean wave sounds', icon: '🌊' },
    { id: 'meditation', name: 'Meditation Bell', description: 'Tibetan singing bowls', icon: '🔔' }
  ];

  const wellnessTips = [
    {
      title: 'Take Regular Breaks',
      description: 'Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds',
      icon: '👀'
    },
    {
      title: 'Stay Hydrated',
      description: 'Drink water regularly to keep your brain functioning optimally',
      icon: '💧'
    },
    {
      title: 'Practice Deep Breathing',
      description: 'Take 5 deep breaths when feeling stressed or overwhelmed',
      icon: '🫁'
    },
    {
      title: 'Maintain Good Posture',
      description: 'Sit up straight and adjust your screen to eye level',
      icon: '🪑'
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (breakTimer > 0) {
      interval = setInterval(() => {
        setBreakTimer(prev => {
          if (prev <= 1) {
            // Break time over
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breakTimer]);

  const startFocusSession = () => {
    setFocusMode(true);
    setBreakTimer(studyTime * 60); // Convert minutes to seconds
  };

  const endFocusSession = () => {
    setFocusMode(false);
    setBreakTimer(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">💚 Well-being Mode</h1>
        <p className="text-xl text-student-text-secondary">Take care of your mental and physical health while learning</p>
      </div>

      {/* Focus Mode */}
      <div className="student-card p-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 animate-student-slide-up">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center shadow-student-hover">
            {focusMode ? <Pause className="w-12 h-12 text-white" /> : <Play className="w-12 h-12 text-white" />}
          </div>
          
          <h2 className="text-3xl font-bold text-student-text mb-4">
            {focusMode ? 'Focus Session Active' : 'Focus Mode'}
          </h2>
          
          {focusMode ? (
            <div className="space-y-4">
              <div className="text-6xl font-bold text-green-600 mb-4">
                {formatTime(breakTimer)}
              </div>
              <p className="text-xl text-student-text-secondary">Stay focused! You're doing great.</p>
              <Button 
                onClick={endFocusSession}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                End Session
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xl text-student-text-secondary mb-6">
                Set a focused study session with break reminders
              </p>
              
              <div className="flex justify-center items-center space-x-4 mb-6">
                <label className="text-student-text">Study Time:</label>
                <select 
                  value={studyTime}
                  onChange={(e) => setStudyTime(parseInt(e.target.value))}
                  className="input-student focus:ring-student-secondary focus:border-student-secondary"
                >
                  <option value={15}>15 minutes</option>
                  <option value={25}>25 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
              </div>
              
              <Button 
                size="lg"
                onClick={startFocusSession}
                className="btn-student-primary student-click-bounce"
              >
                Start Focus Session
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mindful Audio */}
        <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold text-student-text mb-6">🎵 Mindful Audio</h2>
          
          <div className="space-y-4 mb-6">
            {mindfulAudios.map((audio) => (
              <div 
                key={audio.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedAudio === audio.id 
                    ? 'border-student-primary bg-student-primary/10' 
                    : 'border-border hover:border-student-primary/50'
                }`}
                onClick={() => setSelectedAudio(audio.id)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{audio.icon}</span>
                  <div>
                    <h3 className="font-bold text-student-text">{audio.name}</h3>
                    <p className="text-student-text-secondary text-sm">{audio.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={isPlaying ? 'btn-student-accent' : 'btn-student-primary'}
              icon={isPlaying ? Pause : Play}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button 
              variant="outline" 
              icon={isPlaying ? VolumeX : Volume2}
              className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
            >
              {isPlaying ? 'Mute' : 'Volume'}
            </Button>
          </div>
        </div>

        {/* Wellness Tips */}
        <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-bold text-student-text mb-6">💡 Wellness Tips</h2>
          
          <div className="space-y-4">
            {wellnessTips.map((tip, index) => (
              <div key={index} className="p-4 bg-student-background-secondary rounded-lg shadow-student-card">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{tip.icon}</span>
                  <div>
                    <h3 className="font-bold text-student-text mb-2">{tip.title}</h3>
                    <p className="text-student-text-secondary text-sm">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Break Reminder */}
      {breakTimer > 0 && breakTimer <= 300 && ( // Show when 5 minutes or less
        <div className="fixed bottom-6 right-6 student-card p-6 bg-yellow-50 border-2 border-yellow-300 shadow-student-hover z-50 animate-student-bounce-in">
          <div className="text-center">
            <Clock className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
            <h3 className="font-bold text-yellow-800 mb-2">Break Time Soon!</h3>
            <p className="text-yellow-700 text-sm mb-3">
              {formatTime(breakTimer)} until your break
            </p>
            <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white">
              Take Break Now
            </Button>
          </div>
        </div>
      )}

      {/* Daily Wellness Check */}
      <div className="student-card p-6 bg-gradient-to-r from-student-background-tertiary to-student-background-secondary animate-student-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-student-text mb-4">🌟 Daily Wellness Check</h2>
          <p className="text-xl text-student-text-secondary mb-6">How are you feeling today?</p>
          
          <div className="flex justify-center space-x-4 mb-6">
            {['😊', '😐', '😔', '😰', '😴'].map((emoji, index) => (
              <button
                key={index}
                className="w-16 h-16 text-3xl rounded-full bg-student-background hover:bg-student-primary hover:text-white transition-all duration-200 hover:scale-110"
              >
                {emoji}
              </button>
            ))}
          </div>
          
          <p className="text-student-text-secondary">
            Your well-being matters! Take breaks, stay hydrated, and remember that learning is a journey.
          </p>
        </div>
      </div>
    </div>
  );
};