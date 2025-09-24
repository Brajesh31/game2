import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../ToastContainer';
import { Settings, User, Bell, Globe, Palette, Volume2, Eye, Shield } from 'lucide-react';

export const StudentSettings: React.FC = () => {
  const { user } = useAuth();
  const { classInfo } = useCurrentClass();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const [forceUpdate, setForceUpdate] = useState(0);
  
  const [settings, setSettings] = useState({
    notifications: {
      questReminders: true,
      achievementAlerts: true,
      dailyGoals: true,
      friendActivity: false
    },
    privacy: {
      profileVisibility: 'friends',
      showProgress: true,
      showAchievements: true,
      allowMessages: true
    },
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      screenReader: false,
      reducedMotion: false
    },
    learning: {
      difficulty: 'adaptive',
      language: 'english',
      hints: true,
      autoSave: true
    }
  });

  // Listen for class changes
  React.useEffect(() => {
    const handleClassChange = () => {
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('classChanged', handleClassChange);
    return () => window.removeEventListener('classChanged', handleClassChange);
  }, []);

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // Save to localStorage
    localStorage.setItem('student_settings', JSON.stringify(settings));
    
    showToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your preferences have been updated successfully',
      duration: 3000
    });
  };

  const handleClearCache = async () => {
    const { CacheManager } = await import('../../utils/cacheManager');
    CacheManager.smartCacheClear();
    
    showToast({
      type: 'success',
      title: 'Cache Cleared',
      message: 'Application cache has been cleared to improve performance',
      duration: 3000
    });
  };

  const getCacheSize = async () => {
    const { CacheManager } = await import('../../utils/cacheManager');
    return CacheManager.getCacheInfo();
  };

  const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (value: boolean) => void; label: string; description?: string }> = ({ 
    enabled, 
    onChange, 
    label, 
    description 
  }) => (
    <div className="flex items-center justify-between p-4 bg-student-background-secondary rounded-lg hover:shadow-student-card transition-all duration-300">
      <div className="flex-1">
        <h4 className="font-medium text-student-text">{label}</h4>
        {description && <p className="text-sm text-student-text-secondary mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
          enabled ? 'bg-student-primary' : 'bg-gray-300'
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
            enabled ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-8 bg-student-background min-h-screen text-student-text">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 student-text-gradient">⚙️ Settings</h1>
        <p className="text-xl text-student-text-secondary">Customize your learning experience</p>
      </div>

      {/* Profile Settings */}
      <div className="student-card p-6 animate-student-slide-up">
        <div className="flex items-center space-x-3 mb-6">
          <User className="w-6 h-6 text-student-primary" />
          <h2 className="text-2xl font-bold text-student-text">👤 Profile Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Display Name</label>
            <input
              type="text"
              defaultValue={user?.name}
              className="input-student w-full focus:ring-student-secondary focus:border-student-secondary"
              placeholder="Your display name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Current Class</label>
            <input
              type="text"
              value={classInfo?.displayName || 'Class 6'}
              className="input-student w-full bg-gray-100 cursor-not-allowed"
              disabled
              title="Use the class selector in the header to change your class"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Learning Language</label>
            <select
              value={settings.learning.language}
              onChange={(e) => handleSettingChange('learning', 'language', e.target.value)}
              className="input-student w-full focus:ring-student-secondary focus:border-student-secondary"
            >
              <option value="english">English</option>
              <option value="hindi">हिंदी (Hindi)</option>
              <option value="tamil">தமிழ் (Tamil)</option>
              <option value="telugu">తెలుగు (Telugu)</option>
              <option value="bengali">বাংলা (Bengali)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center space-x-3 mb-6">
          <Bell className="w-6 h-6 text-student-primary" />
          <h2 className="text-2xl font-bold text-student-text">🔔 Notifications</h2>
        </div>
        
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.notifications.questReminders}
            onChange={(value) => handleSettingChange('notifications', 'questReminders', value)}
            label="Quest Reminders"
            description="Get notified about incomplete quests and deadlines"
          />
          
          <ToggleSwitch
            enabled={settings.notifications.achievementAlerts}
            onChange={(value) => handleSettingChange('notifications', 'achievementAlerts', value)}
            label="Achievement Alerts"
            description="Celebrate when you earn new badges and achievements"
          />
          
          <ToggleSwitch
            enabled={settings.notifications.dailyGoals}
            onChange={(value) => handleSettingChange('notifications', 'dailyGoals', value)}
            label="Daily Goal Reminders"
            description="Stay motivated with daily learning goal notifications"
          />
          
          <ToggleSwitch
            enabled={settings.notifications.friendActivity}
            onChange={(value) => handleSettingChange('notifications', 'friendActivity', value)}
            label="Friend Activity"
            description="See when your friends complete quests or earn achievements"
          />
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-6 h-6 text-student-primary" />
          <h2 className="text-2xl font-bold text-student-text">🔒 Privacy & Safety</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Profile Visibility</label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
              className="input-student w-full focus:ring-student-secondary focus:border-student-secondary"
            >
              <option value="public">Public - Everyone can see</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private - Only me</option>
            </select>
          </div>
          
          <ToggleSwitch
            enabled={settings.privacy.showProgress}
            onChange={(value) => handleSettingChange('privacy', 'showProgress', value)}
            label="Show Learning Progress"
            description="Allow others to see your quest progress and statistics"
          />
          
          <ToggleSwitch
            enabled={settings.privacy.showAchievements}
            onChange={(value) => handleSettingChange('privacy', 'showAchievements', value)}
            label="Show Achievements"
            description="Display your badges and achievements on your profile"
          />
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center space-x-3 mb-6">
          <Eye className="w-6 h-6 text-student-primary" />
          <h2 className="text-2xl font-bold text-student-text">♿ Accessibility</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Font Size</label>
            <select
              value={settings.accessibility.fontSize}
              onChange={(e) => handleSettingChange('accessibility', 'fontSize', e.target.value)}
              className="input-student w-full focus:ring-student-secondary focus:border-student-secondary"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="extra-large">Extra Large</option>
            </select>
          </div>
          
          <ToggleSwitch
            enabled={settings.accessibility.highContrast}
            onChange={(value) => handleSettingChange('accessibility', 'highContrast', value)}
            label="High Contrast Mode"
            description="Increase contrast for better visibility"
          />
          
          <ToggleSwitch
            enabled={settings.accessibility.reducedMotion}
            onChange={(value) => handleSettingChange('accessibility', 'reducedMotion', value)}
            label="Reduced Motion"
            description="Minimize animations and transitions"
          />
        </div>
      </div>

      {/* Learning Preferences */}
      <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center space-x-3 mb-6">
          <Palette className="w-6 h-6 text-student-primary" />
          <h2 className="text-2xl font-bold text-student-text">🎯 Learning Preferences</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-student-text mb-2">Difficulty Level</label>
            <select
              value={settings.learning.difficulty}
              onChange={(e) => handleSettingChange('learning', 'difficulty', e.target.value)}
              className="input-student w-full focus:ring-student-secondary focus:border-student-secondary"
            >
              <option value="easy">Easy - More guidance and hints</option>
              <option value="adaptive">Adaptive - AI adjusts difficulty</option>
              <option value="challenging">Challenging - Minimal hints</option>
            </select>
          </div>
          
          <ToggleSwitch
            enabled={settings.learning.hints}
            onChange={(value) => handleSettingChange('learning', 'hints', value)}
            label="Show Hints"
            description="Display helpful hints during quests and quizzes"
          />
          
          <ToggleSwitch
            enabled={settings.learning.autoSave}
            onChange={(value) => handleSettingChange('learning', 'autoSave', value)}
            label="Auto-Save Progress"
            description="Automatically save your progress every few minutes"
          />
        </div>
      </div>

      {/* Theme Settings */}
      <div className="student-card p-6 animate-student-slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-center space-x-3 mb-6">
          <Palette className="w-6 h-6 text-student-primary" />
          <h2 className="text-2xl font-bold text-student-text">🎨 Appearance</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-student-background-secondary rounded-lg">
            <div>
              <h4 className="font-medium text-student-text">Theme</h4>
              <p className="text-sm text-student-text-secondary">Choose between light and dark mode</p>
            </div>
            <Button
              onClick={toggleTheme}
              className={theme === 'light' ? 'btn-student-primary' : 'btn-student-secondary'}
            >
              {theme === 'light' ? '☀️ Light' : '🌙 Dark'}
            </Button>
          </div>
        </div>
      </div>

      {/* Save Settings */}
      <div className="flex justify-center">
        <div className="flex space-x-4">
          <Button 
            size="lg" 
            onClick={handleSaveSettings}
            className="px-12 py-3 text-lg btn-student-primary student-click-bounce"
          >
            Save All Settings
          </Button>
          <Button 
            variant="outline"
            size="lg" 
            onClick={handleClearCache}
            className="px-8 py-3 text-lg border-student-secondary text-student-secondary hover:bg-student-secondary hover:text-student-on-primary"
          >
            Clear Cache
          </Button>
        </div>
      </div>

      {/* Settings Summary */}
      <div className="student-card bg-gradient-to-r from-student-primary/10 to-green-50 p-6 animate-student-slide-up" style={{ animationDelay: '0.6s' }}>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-student-text mb-4">⚡ Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-success">
                {Object.values(settings.notifications).filter(v => v === true).length}
              </div>
              <div className="text-student-text-secondary">Notifications On</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-student-primary">{settings.privacy.profileVisibility}</div>
              <div className="text-student-text-secondary">Profile Visibility</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-student-accent">{settings.accessibility.fontSize}</div>
              <div className="text-student-text-secondary">Font Size</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-500">{theme}</div>
              <div className="text-student-text-secondary">Theme Mode</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};