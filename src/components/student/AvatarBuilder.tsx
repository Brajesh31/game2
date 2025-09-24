import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { Palette, User, Crown, Shirt, Eye, Save } from 'lucide-react';

export const AvatarBuilder: React.FC = () => {
  const { user } = useAuth();
  const [avatarConfig, setAvatarConfig] = useState({
    skinTone: 'medium',
    hairStyle: 'short',
    hairColor: 'brown',
    eyeColor: 'brown',
    outfit: 'casual',
    accessory: 'none',
    background: 'gradient'
  });

  const [selectedCategory, setSelectedCategory] = useState('skin');

  const customizationOptions = {
    skin: {
      label: 'Skin Tone',
      icon: User,
      options: [
        { id: 'light', name: 'Light', color: '#FDBCB4' },
        { id: 'medium', name: 'Medium', color: '#E0AC69' },
        { id: 'dark', name: 'Dark', color: '#8D5524' },
        { id: 'olive', name: 'Olive', color: '#C68642' }
      ]
    },
    hair: {
      label: 'Hair Style',
      icon: Crown,
      options: [
        { id: 'short', name: 'Short', preview: '✂️' },
        { id: 'long', name: 'Long', preview: '💇‍♀️' },
        { id: 'curly', name: 'Curly', preview: '🌀' },
        { id: 'braided', name: 'Braided', preview: '🎀' }
      ]
    },
    outfit: {
      label: 'Outfit',
      icon: Shirt,
      options: [
        { id: 'casual', name: 'Casual', preview: '👕' },
        { id: 'formal', name: 'Formal', preview: '👔' },
        { id: 'traditional', name: 'Traditional', preview: '🥻' },
        { id: 'sporty', name: 'Sporty', preview: '🏃‍♂️' }
      ]
    },
    accessories: {
      label: 'Accessories',
      icon: Eye,
      options: [
        { id: 'none', name: 'None', preview: '🚫' },
        { id: 'glasses', name: 'Glasses', preview: '👓' },
        { id: 'hat', name: 'Hat', preview: '🎩' },
        { id: 'headband', name: 'Headband', preview: '🎀' }
      ]
    }
  };

  const categories = Object.keys(customizationOptions);

  const updateAvatarConfig = (category: string, value: string) => {
    setAvatarConfig(prev => ({
      ...prev,
      [category === 'accessories' ? 'accessory' : category === 'skin' ? 'skinTone' : category === 'hair' ? 'hairStyle' : 'outfit']: value
    }));
  };

  const saveAvatar = () => {
    // Save to localStorage
    const userData = JSON.parse(localStorage.getItem('student_avatar') || '{}');
    userData[user?.id || 'student-001'] = avatarConfig;
    localStorage.setItem('student_avatar', JSON.stringify(userData));
  };

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">🎨 Avatar Builder</h1>
        <p className="text-xl text-student-text-secondary">Create your unique digital identity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Avatar Preview */}
        <div className="student-card p-8 animate-student-slide-up">
          <h2 className="text-2xl font-bold text-student-text mb-6 text-center">👤 Avatar Preview</h2>
          
          <div className="relative w-64 h-64 mx-auto mb-6 rounded-full bg-gradient-to-br from-student-primary/20 to-student-accent/20 flex items-center justify-center shadow-student-hover">
            {/* Mock Avatar Display */}
            <div className="text-center">
              <div className="text-8xl mb-2">
                {avatarConfig.outfit === 'traditional' ? '🥻' : 
                 avatarConfig.outfit === 'formal' ? '👔' : 
                 avatarConfig.outfit === 'sporty' ? '🏃‍♂️' : '👕'}
              </div>
              <div className="text-4xl">
                {avatarConfig.accessory === 'glasses' ? '👓' :
                 avatarConfig.accessory === 'hat' ? '🎩' :
                 avatarConfig.accessory === 'headband' ? '🎀' : ''}
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-student-text">{user?.name}</h3>
            <p className="text-student-text-secondary">Level 12 Adventurer</p>
            
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={saveAvatar}
                className="btn-student-primary student-click-bounce"
                icon={Save}
              >
                Save Avatar
              </Button>
              <Button 
                variant="outline"
                className="border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
              >
                Preview in Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Customization Panel */}
        <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold text-student-text mb-6">🛠️ Customization</h2>

          {/* Category Tabs */}
          <div className="flex space-x-2 mb-6">
            {categories.map((category) => {
              const categoryData = customizationOptions[category as keyof typeof customizationOptions];
              const IconComponent = categoryData.icon;
              
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-student-primary text-white shadow-student-card'
                      : 'bg-student-background-secondary text-student-text hover:bg-student-primary hover:text-white'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{categoryData.label}</span>
                </button>
              );
            })}
          </div>

          {/* Options Grid */}
          <div className="space-y-4">
            <h3 className="font-semibold text-student-text">
              {customizationOptions[selectedCategory as keyof typeof customizationOptions].label}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {customizationOptions[selectedCategory as keyof typeof customizationOptions].options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => updateAvatarConfig(selectedCategory, option.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    (selectedCategory === 'skin' && avatarConfig.skinTone === option.id) ||
                    (selectedCategory === 'hair' && avatarConfig.hairStyle === option.id) ||
                    (selectedCategory === 'outfit' && avatarConfig.outfit === option.id) ||
                    (selectedCategory === 'accessories' && avatarConfig.accessory === option.id)
                      ? 'border-student-primary bg-student-primary/10'
                      : 'border-border hover:border-student-primary/50'
                  }`}
                >
                  <div className="text-center">
                    {option.color ? (
                      <div 
                        className="w-12 h-12 mx-auto mb-2 rounded-full border-2 border-white shadow-student-card"
                        style={{ backgroundColor: option.color }}
                      ></div>
                    ) : (
                      <div className="text-3xl mb-2">{option.preview}</div>
                    )}
                    <span className="text-sm font-medium text-student-text">{option.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Unlockable Items */}
      <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-2xl font-bold text-student-text mb-6">🔓 Unlockable Items</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Wizard Hat', requirement: 'Complete 10 Math Quests', locked: false, preview: '🧙‍♂️' },
            { name: 'Lab Coat', requirement: 'Complete 5 Science Labs', locked: false, preview: '🥼' },
            { name: 'Crown', requirement: 'Reach Level 20', locked: true, preview: '👑' },
            { name: 'Cape', requirement: 'Help 10 Students', locked: true, preview: '🦸‍♂️' }
          ].map((item, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-2 text-center ${
                item.locked 
                  ? 'border-gray-300 bg-gray-50 opacity-60' 
                  : 'border-student-accent bg-student-accent/10 hover:shadow-student-card'
              }`}
            >
              <div className="text-3xl mb-2">{item.preview}</div>
              <h3 className="font-bold text-student-text text-sm mb-1">{item.name}</h3>
              <p className="text-xs text-student-text-secondary">{item.requirement}</p>
              {item.locked && (
                <div className="text-xs text-gray-500 mt-2">🔒 Locked</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Theme Selector */}
      <div className="student-card p-6 bg-gradient-to-r from-student-background-tertiary to-student-background-secondary animate-student-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-student-text mb-4">🌈 Profile Themes</h2>
          <p className="text-xl text-student-text-secondary mb-6">Choose a theme that reflects your personality</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Ocean', colors: 'from-blue-400 to-cyan-500', emoji: '🌊' },
              { name: 'Forest', colors: 'from-green-400 to-emerald-500', emoji: '🌲' },
              { name: 'Sunset', colors: 'from-orange-400 to-red-500', emoji: '🌅' },
              { name: 'Galaxy', colors: 'from-purple-400 to-indigo-500', emoji: '🌌' }
            ].map((theme) => (
              <button
                key={theme.name}
                className={`p-4 rounded-lg bg-gradient-to-r ${theme.colors} text-white hover:scale-105 transition-all duration-200 shadow-student-card hover:shadow-student-hover`}
              >
                <div className="text-2xl mb-2">{theme.emoji}</div>
                <span className="font-bold">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};