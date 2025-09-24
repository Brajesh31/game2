import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useStudentTheme } from '../../hooks/useStudentTheme';
import { useTheme } from '../../hooks/useTheme';
import { StudentThemeUtils } from '../../utils/themeUtils';
import { Palette, Eye, Code, CheckCircle, AlertTriangle } from 'lucide-react';

interface ThemeDebuggerProps {
  isVisible?: boolean;
}

export const ThemeDebugger: React.FC<ThemeDebuggerProps> = ({ isVisible = false }) => {
  const [showDebugger, setShowDebugger] = useState(isVisible);
  const [activeTab, setActiveTab] = useState<'variables' | 'validation' | 'preview'>('variables');
  const { generateStudentCSS, theme: studentTheme } = useStudentTheme();
  const { theme: globalTheme } = useTheme();
  const [themeVariables, setThemeVariables] = useState<Record<string, string>>({});
  const [validationResults, setValidationResults] = useState<any>(null);

  useEffect(() => {
    // Update theme variables when theme changes
    const variables = generateStudentCSS();
    setThemeVariables(variables as Record<string, string>);
    
    // Validate theme accessibility
    const validation = StudentThemeUtils.validateAccessibility(variables);
    setValidationResults(validation);
  }, [generateStudentCSS, globalTheme]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportThemeCSS = () => {
    const cssText = Object.entries(themeVariables)
      .map(([property, value]) => `  ${property}: ${value};`)
      .join('\n');
    
    const fullCSS = `:root {\n${cssText}\n}`;
    copyToClipboard(fullCSS);
  };

  if (!showDebugger) {
    return (
      <button
        onClick={() => setShowDebugger(true)}
        className="fixed bottom-4 left-4 w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg z-50 flex items-center justify-center transition-all duration-200 hover:scale-110"
        title="Open Theme Debugger"
      >
        <Palette className="w-6 h-6" />
      </button>
    );
  }

  return (
    <Modal
      isOpen={showDebugger}
      onClose={() => setShowDebugger(false)}
      title="Student Theme Debugger"
      size="xl"
    >
      <div className="space-y-6">
        {/* Theme Status */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${
              StudentThemeUtils.isStudentThemeActive() ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="font-medium">
              Student Theme: {StudentThemeUtils.isStudentThemeActive() ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Mode: {globalTheme} | Variables: {Object.keys(themeVariables).length}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'variables', label: 'CSS Variables', icon: Code },
            { key: 'validation', label: 'Validation', icon: CheckCircle },
            { key: 'preview', label: 'Preview', icon: Eye }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-96 max-h-96 overflow-y-auto">
          {/* CSS Variables Tab */}
          {activeTab === 'variables' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">CSS Custom Properties</h3>
                <Button size="sm" onClick={exportThemeCSS}>
                  Export CSS
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(themeVariables).map(([property, value]) => (
                  <div key={property} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <code className="text-sm font-mono text-blue-600">{property}</code>
                    <div className="flex items-center space-x-2">
                      {property.includes('color') || property.includes('bg') ? (
                        <div 
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: value }}
                        ></div>
                      ) : null}
                      <code className="text-sm font-mono text-gray-700">{value}</code>
                      <button
                        onClick={() => copyToClipboard(`${property}: ${value};`)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Tab */}
          {activeTab === 'validation' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Theme Validation Results</h3>
              
              {validationResults && (
                <div className={`p-4 rounded-lg ${
                  validationResults.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {validationResults.isValid ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      validationResults.isValid ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {validationResults.isValid ? 'Theme is valid' : 'Theme has issues'}
                    </span>
                  </div>
                  
                  {validationResults.issues.length > 0 && (
                    <ul className="space-y-1">
                      {validationResults.issues.map((issue: string, index: number) => (
                        <li key={index} className="text-sm text-red-700">
                          • {issue}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-medium">Theme Properties Check</h4>
                {[
                  'Primary Color',
                  'Background Colors',
                  'Text Colors',
                  'Button Styles',
                  'Navigation Styles',
                  'Card Styles'
                ].map((check, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{check}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Theme Preview</h3>
              
              {/* Color Palette */}
              <div>
                <h4 className="font-medium mb-3">Color Palette</h4>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { name: 'Primary', var: '--student-primary' },
                    { name: 'Secondary', var: '--student-secondary' },
                    { name: 'Accent', var: '--student-accent' },
                    { name: 'Background', var: '--student-app-bg' }
                  ].map((color) => (
                    <div key={color.name} className="text-center">
                      <div 
                        className="w-16 h-16 rounded-lg border border-gray-300 mx-auto mb-2"
                        style={{ backgroundColor: `var(${color.var})` }}
                      ></div>
                      <span className="text-xs text-gray-600">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Component Previews */}
              <div>
                <h4 className="font-medium mb-3">Component Previews</h4>
                <div className="space-y-3">
                  {/* Button Preview */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h5 className="text-sm font-medium mb-2">Buttons</h5>
                    <div className="flex space-x-2">
                      <button 
                        className="px-4 py-2 rounded-lg font-medium"
                        style={{
                          backgroundColor: 'var(--student-btn-primary-bg)',
                          color: 'var(--student-btn-primary-text)'
                        }}
                      >
                        Primary
                      </button>
                      <button 
                        className="px-4 py-2 rounded-lg font-medium"
                        style={{
                          backgroundColor: 'var(--student-btn-secondary-bg)',
                          color: 'var(--student-btn-secondary-text)'
                        }}
                      >
                        Secondary
                      </button>
                      <button 
                        className="px-4 py-2 rounded-lg font-medium"
                        style={{
                          backgroundColor: 'var(--student-btn-accent-bg)',
                          color: 'var(--student-btn-accent-text)'
                        }}
                      >
                        Accent
                      </button>
                    </div>
                  </div>

                  {/* Card Preview */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h5 className="text-sm font-medium mb-2">Card Component</h5>
                    <div 
                      className="p-4 rounded-lg"
                      style={{
                        backgroundColor: 'var(--student-card-bg)',
                        border: 'var(--student-card-border)',
                        boxShadow: 'var(--student-card-shadow)',
                        color: 'var(--student-body-text)'
                      }}
                    >
                      <h6 className="font-medium mb-2" style={{ color: 'var(--student-heading-text)' }}>
                        Sample Card
                      </h6>
                      <p className="text-sm" style={{ color: 'var(--student-body-text)' }}>
                        This is how cards will appear with the current theme.
                      </p>
                    </div>
                  </div>

                  {/* Input Preview */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h5 className="text-sm font-medium mb-2">Form Elements</h5>
                    <input
                      type="text"
                      placeholder="Sample input field"
                      className="w-full px-3 py-2 rounded-lg"
                      style={{
                        backgroundColor: 'var(--student-input-bg)',
                        border: '1px solid var(--student-input-border)',
                        color: 'var(--student-input-text)'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Theme Mode: <span className="font-medium">{globalTheme}</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => StudentThemeUtils.triggerThemeUpdate()}>
              Refresh Theme
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowDebugger(false)}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};