import React, { useState } from 'react';
import { ResponsiveButton } from './ResponsiveButton';
import { ButtonUtils } from '../../utils/buttonUtils';
import { useButtonInteraction } from '../../hooks/useButtonInteraction';
import { Modal } from '../ui/Modal';
import { Play, Target, Trophy, BookOpen, FlaskConical, Settings } from 'lucide-react';

interface ButtonTestResult {
  buttonId: string;
  testName: string;
  passed: boolean;
  details: string;
  timestamp: string;
}

export const ButtonTestSuite: React.FC = () => {
  const [showTestSuite, setShowTestSuite] = useState(false);
  const [testResults, setTestResults] = useState<ButtonTestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const { handleButtonClick, getButtonState } = useButtonInteraction();

  const runButtonTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    const tests = [
      {
        id: 'responsive_sizing',
        name: 'Responsive Sizing Test',
        test: () => testResponsiveSizing()
      },
      {
        id: 'accessibility_compliance',
        name: 'Accessibility Compliance Test',
        test: () => testAccessibilityCompliance()
      },
      {
        id: 'interaction_functionality',
        name: 'Interaction Functionality Test',
        test: () => testInteractionFunctionality()
      },
      {
        id: 'theme_consistency',
        name: 'Theme Consistency Test',
        test: () => testThemeConsistency()
      },
      {
        id: 'loading_states',
        name: 'Loading States Test',
        test: () => testLoadingStates()
      }
    ];

    for (const test of tests) {
      try {
        const result = await test.test();
        setTestResults(prev => [...prev, {
          buttonId: test.id,
          testName: test.name,
          passed: result.passed,
          details: result.details,
          timestamp: new Date().toISOString()
        }]);
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        setTestResults(prev => [...prev, {
          buttonId: test.id,
          testName: test.name,
          passed: false,
          details: `Test failed: ${error}`,
          timestamp: new Date().toISOString()
        }]);
      }
    }
    
    setIsRunningTests(false);
  };

  const testResponsiveSizing = async (): Promise<{ passed: boolean; details: string }> => {
    const testButton = document.createElement('button');
    testButton.className = 'responsive-btn-base responsive-btn-md btn-student-primary';
    testButton.textContent = 'Test Button';
    document.body.appendChild(testButton);
    
    const rect = testButton.getBoundingClientRect();
    const passed = rect.width >= 44 && rect.height >= 44;
    
    document.body.removeChild(testButton);
    
    return {
      passed,
      details: passed 
        ? `Button meets minimum size requirements (${rect.width}x${rect.height}px)`
        : `Button too small (${rect.width}x${rect.height}px), minimum is 44x44px`
    };
  };

  const testAccessibilityCompliance = async (): Promise<{ passed: boolean; details: string }> => {
    const issues: string[] = [];
    
    // Test focus indicators
    const buttons = document.querySelectorAll('.responsive-btn-base');
    buttons.forEach((button, index) => {
      const styles = window.getComputedStyle(button as Element);
      
      // Check if focus styles are defined
      if (!styles.getPropertyValue('outline') && !styles.getPropertyValue('box-shadow')) {
        issues.push(`Button ${index + 1} lacks focus indicator`);
      }
    });

    return {
      passed: issues.length === 0,
      details: issues.length === 0 
        ? 'All buttons pass accessibility checks'
        : `Issues found: ${issues.join(', ')}`
    };
  };

  const testInteractionFunctionality = async (): Promise<{ passed: boolean; details: string }> => {
    let clicksWorking = 0;
    let totalButtons = 0;

    // Test button click handlers
    const testButtons = [
      { id: 'test_primary', action: () => clicksWorking++ },
      { id: 'test_secondary', action: () => clicksWorking++ },
      { id: 'test_accent', action: () => clicksWorking++ }
    ];

    for (const button of testButtons) {
      totalButtons++;
      try {
        await handleButtonClick(button.id, button.action);
      } catch (error) {
        console.error(`Button ${button.id} failed:`, error);
      }
    }

    return {
      passed: clicksWorking === totalButtons,
      details: `${clicksWorking}/${totalButtons} button interactions working correctly`
    };
  };

  const testThemeConsistency = async (): Promise<{ passed: boolean; details: string }> => {
    const themeVariables = [
      '--student-btn-primary-bg',
      '--student-btn-secondary-bg',
      '--student-btn-accent-bg',
      '--student-primary',
      '--student-secondary',
      '--student-accent'
    ];

    const missingVariables: string[] = [];
    const root = document.documentElement;

    themeVariables.forEach(variable => {
      const value = getComputedStyle(root).getPropertyValue(variable);
      if (!value || value.trim() === '') {
        missingVariables.push(variable);
      }
    });

    return {
      passed: missingVariables.length === 0,
      details: missingVariables.length === 0
        ? 'All theme variables are properly defined'
        : `Missing theme variables: ${missingVariables.join(', ')}`
    };
  };

  const testLoadingStates = async (): Promise<{ passed: boolean; details: string }> => {
    // Test loading state functionality
    const testButton = document.createElement('button');
    testButton.className = 'responsive-btn-base responsive-btn-loading';
    document.body.appendChild(testButton);
    
    const styles = window.getComputedStyle(testButton);
    const hasLoadingStyles = styles.opacity !== '1' || styles.pointerEvents === 'none';
    
    document.body.removeChild(testButton);
    
    return {
      passed: hasLoadingStyles,
      details: hasLoadingStyles
        ? 'Loading states are properly implemented'
        : 'Loading states need improvement'
    };
  };

  const exportTestResults = () => {
    const results = {
      timestamp: new Date().toISOString(),
      totalTests: testResults.length,
      passedTests: testResults.filter(r => r.passed).length,
      failedTests: testResults.filter(r => !r.passed).length,
      details: testResults
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `button_test_results_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!showTestSuite) {
    return (
      <button
        onClick={() => setShowTestSuite(true)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg z-50 flex items-center justify-center transition-all duration-200 hover:scale-110"
        title="Open Button Test Suite"
      >
        <Settings className="w-6 h-6" />
      </button>
    );
  }

  return (
    <Modal
      isOpen={showTestSuite}
      onClose={() => setShowTestSuite(false)}
      title="Button Functionality Test Suite"
      size="xl"
    >
      <div className="space-y-6">
        {/* Test Controls */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <h3 className="font-semibold text-blue-800">Button System Testing</h3>
            <p className="text-sm text-blue-600">Comprehensive testing of all button functionality</p>
          </div>
          <div className="flex space-x-3">
            <ResponsiveButton
              onClick={runButtonTests}
              disabled={isRunningTests}
              loading={isRunningTests}
              variant="primary"
              size="md"
            >
              {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
            </ResponsiveButton>
            {testResults.length > 0 && (
              <ResponsiveButton
                onClick={exportTestResults}
                variant="outline"
                size="md"
              >
                Export Results
              </ResponsiveButton>
            )}
          </div>
        </div>

        {/* Sample Buttons for Testing */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-4">Sample Button Implementations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ResponsiveButton variant="primary" size="sm" icon={Play}>
              Start Quest (Small)
            </ResponsiveButton>
            <ResponsiveButton variant="secondary" size="md" icon={Target}>
              Continue Quest (Medium)
            </ResponsiveButton>
            <ResponsiveButton variant="accent" size="lg" icon={Trophy}>
              Complete Quest (Large)
            </ResponsiveButton>
            <ResponsiveButton variant="outline" size="md" icon={BookOpen}>
              Read Book
            </ResponsiveButton>
            <ResponsiveButton variant="ghost" size="md" icon={FlaskConical}>
              Start Experiment
            </ResponsiveButton>
            <ResponsiveButton variant="primary" size="md" disabled>
              Disabled Button
            </ResponsiveButton>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold">Test Results</h4>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.passed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className={`font-medium ${
                      result.passed ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.testName}
                    </h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      result.passed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    result.passed ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.details}
                  </p>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h5 className="font-semibold text-blue-800 mb-2">Test Summary</h5>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{testResults.length}</div>
                  <div className="text-sm text-blue-600">Total Tests</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {testResults.filter(r => r.passed).length}
                  </div>
                  <div className="text-sm text-green-600">Passed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {testResults.filter(r => !r.passed).length}
                  </div>
                  <div className="text-sm text-red-600">Failed</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Data */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-4">Button Analytics</h4>
          <div className="space-y-2">
            {ButtonUtils.getMostClickedButtons(5).map((button, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                <span className="text-sm font-medium">{button.buttonId}</span>
                <div className="text-right">
                  <div className="text-sm font-bold">{button.clickCount} clicks</div>
                  <div className="text-xs text-gray-500">
                    Last: {new Date(button.lastClicked).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-end">
            <ResponsiveButton
              onClick={() => ButtonUtils.clearButtonAnalytics()}
              variant="outline"
              size="sm"
            >
              Clear Analytics
            </ResponsiveButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};