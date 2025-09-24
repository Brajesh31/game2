import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useToast } from '../ToastContainer';
import { Settings, Shield, Globe, Bell, Database, Zap } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { showToast } = useToast();
  
  // Settings state
  const [settings, setSettings] = useState({
    // Compliance
    nepGuidelines: true,
    dataPrivacy: true,
    accessibilityCompliance: true,
    
    // Feature Flags
    communityHub: true,
    arLabs: true,
    blockchainCertificates: true,
    aiRecommendations: true,
    offlineMode: true,
    multiLanguage: true,
    
    // System Configuration
    maxUsersPerClass: 30,
    sessionTimeout: 60,
    backupFrequency: 'daily',
    
    // Notifications
    systemAlerts: true,
    maintenanceNotifications: true,
    securityAlerts: true,
    performanceAlerts: false
  });

  const [alertForm, setAlertForm] = useState({
    title: '',
    message: '',
    type: 'info',
    targetAudience: 'all'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    showToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'All system settings have been updated successfully',
      duration: 3000
    });
  };

  const handleSendAlert = () => {
    if (!alertForm.title || !alertForm.message) {
      showToast({
        type: 'error',
        title: 'Missing Information',
        message: 'Please fill in both title and message fields',
        duration: 3000
      });
      return;
    }

    showToast({
      type: 'success',
      title: 'Alert Sent',
      message: `System-wide alert "${alertForm.title}" has been sent to ${alertForm.targetAudience} users`,
      duration: 3000
    });

    setAlertForm({ title: '', message: '', type: 'info', targetAudience: 'all' });
  };

  const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (value: boolean) => void; label: string; description?: string }> = ({ 
    enabled, 
    onChange, 
    label, 
    description 
  }) => (
    <div className="flex items-center justify-between p-4 bg-admin-background-tertiary rounded-lg hover:shadow-admin-card transition-all duration-300">
      <div className="flex-1">
        <h4 className="font-medium text-text">{label}</h4>
        {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
          enabled ? 'bg-admin-primary' : 'bg-gray-300'
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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-admin-primary mb-4">System Settings</h1>
        <p className="text-xl text-text-secondary">Configure platform-wide settings and preferences</p>
      </div>

      {/* Compliance Settings */}
      <div className="admin-card p-6 animate-admin-slide-up">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-6 h-6 text-admin-primary" />
          <h2 className="text-2xl font-bold text-text">Compliance & Regulations</h2>
        </div>
        
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.nepGuidelines}
            onChange={(value) => handleSettingChange('nepGuidelines', value)}
            label="Enforce NEP 2020 Guidelines"
            description="Ensure all content and assessments comply with National Education Policy 2020"
          />
          
          <ToggleSwitch
            enabled={settings.dataPrivacy}
            onChange={(value) => handleSettingChange('dataPrivacy', value)}
            label="Enhanced Data Privacy"
            description="Apply strict data protection measures for student information"
          />
          
          <ToggleSwitch
            enabled={settings.accessibilityCompliance}
            onChange={(value) => handleSettingChange('accessibilityCompliance', value)}
            label="Accessibility Compliance"
            description="Ensure platform meets WCAG 2.1 accessibility standards"
          />
        </div>
      </div>

      {/* Feature Flags */}
      <div className="admin-card p-6 animate-admin-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center space-x-3 mb-6">
          <Zap className="w-6 h-6 text-admin-primary" />
          <h2 className="text-2xl font-bold text-text">Feature Management</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToggleSwitch
            enabled={settings.communityHub}
            onChange={(value) => handleSettingChange('communityHub', value)}
            label="Community Hub"
            description="Enable community events and local connections"
          />
          
          <ToggleSwitch
            enabled={settings.arLabs}
            onChange={(value) => handleSettingChange('arLabs', value)}
            label="AR/VR Learning Labs"
            description="Enable augmented and virtual reality experiences"
          />
          
          <ToggleSwitch
            enabled={settings.blockchainCertificates}
            onChange={(value) => handleSettingChange('blockchainCertificates', value)}
            label="Blockchain Certificates"
            description="Issue tamper-proof achievement certificates"
          />
          
          <ToggleSwitch
            enabled={settings.aiRecommendations}
            onChange={(value) => handleSettingChange('aiRecommendations', value)}
            label="AI-Powered Recommendations"
            description="Personalized learning path suggestions"
          />
          
          <ToggleSwitch
            enabled={settings.offlineMode}
            onChange={(value) => handleSettingChange('offlineMode', value)}
            label="Offline Mode"
            description="Allow content access without internet connection"
          />
          
          <ToggleSwitch
            enabled={settings.multiLanguage}
            onChange={(value) => handleSettingChange('multiLanguage', value)}
            label="Multi-language Support"
            description="Enable content in multiple Indian languages"
          />
        </div>
      </div>

      {/* System Configuration */}
      <div className="admin-card p-6 animate-admin-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="w-6 h-6 text-admin-primary" />
          <h2 className="text-2xl font-bold text-text">System Configuration</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Max Users Per Class</label>
            <input
              type="number"
              value={settings.maxUsersPerClass}
              onChange={(e) => handleSettingChange('maxUsersPerClass', parseInt(e.target.value))}
              className="input-admin w-full focus:ring-admin-primary focus:border-admin-primary"
              min="10"
              max="50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
              className="input-admin w-full focus:ring-admin-primary focus:border-admin-primary"
              min="15"
              max="480"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text mb-2">Backup Frequency</label>
            <select
              value={settings.backupFrequency}
              onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
              className="input-admin w-full focus:ring-admin-primary focus:border-admin-primary"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text mb-2">Platform Language</label>
            <select
              className="input-admin w-full focus:ring-admin-primary focus:border-admin-primary"
              defaultValue="multi"
            >
              <option value="multi">Multi-language</option>
              <option value="en">English Only</option>
              <option value="hi">Hindi Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="admin-card p-6 animate-admin-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center space-x-3 mb-6">
          <Bell className="w-6 h-6 text-admin-primary" />
          <h2 className="text-2xl font-bold text-text">Notification Management</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <ToggleSwitch
            enabled={settings.systemAlerts}
            onChange={(value) => handleSettingChange('systemAlerts', value)}
            label="System Alerts"
            description="Critical system notifications"
          />
          
          <ToggleSwitch
            enabled={settings.maintenanceNotifications}
            onChange={(value) => handleSettingChange('maintenanceNotifications', value)}
            label="Maintenance Notifications"
            description="Scheduled maintenance alerts"
          />
          
          <ToggleSwitch
            enabled={settings.securityAlerts}
            onChange={(value) => handleSettingChange('securityAlerts', value)}
            label="Security Alerts"
            description="Security-related notifications"
          />
          
          <ToggleSwitch
            enabled={settings.performanceAlerts}
            onChange={(value) => handleSettingChange('performanceAlerts', value)}
            label="Performance Alerts"
            description="System performance warnings"
          />
        </div>
      </div>

      {/* System-wide Alert Creator */}
      <div className="admin-card p-6 animate-admin-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center space-x-3 mb-6">
          <Globe className="w-6 h-6 text-admin-primary" />
          <h2 className="text-2xl font-bold text-text">Send System-wide Alert</h2>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Alert Title</label>
              <input
                type="text"
                value={alertForm.title}
                onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
                className="input-admin w-full focus:ring-admin-primary focus:border-admin-primary"
                placeholder="Enter alert title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text mb-2">Alert Type</label>
              <select
                value={alertForm.type}
                onChange={(e) => setAlertForm({ ...alertForm, type: e.target.value })}
                className="input-admin w-full focus:ring-admin-primary focus:border-admin-primary"
              >
                <option value="info">Information</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="error">Critical</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text mb-2">Message</label>
            <textarea
              value={alertForm.message}
              onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
              rows={3}
              className="input-admin w-full focus:ring-admin-primary focus:border-admin-primary"
              placeholder="Enter alert message"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text mb-2">Target Audience</label>
            <select
              value={alertForm.targetAudience}
              onChange={(e) => setAlertForm({ ...alertForm, targetAudience: e.target.value })}
              className="input-admin w-full focus:ring-admin-primary focus:border-admin-primary"
            >
              <option value="all">All Users</option>
              <option value="students">Students Only</option>
              <option value="teachers">Teachers Only</option>
              <option value="guardians">Guardians Only</option>
            </select>
          </div>
          
          <Button onClick={handleSendAlert} className="w-full md:w-auto btn-admin-primary">
            Send Alert
          </Button>
        </div>
      </div>

      {/* Save Settings */}
      <div className="flex justify-center">
        <div className="flex space-x-4">
          <Button 
            size="lg" 
            onClick={handleSaveSettings}
            className="px-12 py-3 text-lg btn-admin-primary"
          >
            Save All Settings
          </Button>
          <Button 
            variant="outline"
            size="lg" 
            onClick={async () => {
              const { CacheManager } = await import('../../utils/cacheManager');
              CacheManager.clearAllCaches();
              showToast({
                type: 'success',
                title: 'System Cache Cleared',
                message: 'All application caches have been cleared',
                duration: 3000
              });
            }}
            className="px-8 py-3 text-lg border-admin-secondary text-admin-secondary hover:bg-admin-secondary hover:text-white"
          >
            Clear System Cache
          </Button>
        </div>
      </div>

      {/* Settings Summary */}
      <div className="admin-card bg-gradient-to-r from-admin-primary/10 to-green-50 p-6 animate-admin-slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-text mb-4">Configuration Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-success">
                {Object.values(settings).filter(v => v === true).length}
              </div>
              <div className="text-text-secondary">Features Enabled</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-admin-primary">{settings.maxUsersPerClass}</div>
              <div className="text-text-secondary">Max Class Size</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-admin-accent">{settings.sessionTimeout}m</div>
              <div className="text-text-secondary">Session Timeout</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-500">
                {settings.backupFrequency.charAt(0).toUpperCase() + settings.backupFrequency.slice(1)}
              </div>
              <div className="text-text-secondary">Backup Schedule</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};