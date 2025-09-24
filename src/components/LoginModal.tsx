import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { User, LogIn, Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  selectedRole
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { getLoginTheme, generateThemeCSS } = useThemeStyles();

  const loginTheme = getLoginTheme(selectedRole);
  const themeStyles = generateThemeCSS(loginTheme);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { username, password, selectedRole });
      const success = await login(username, password, selectedRole);
      console.log('Login result:', success);
      
      if (success) {
        console.log('Login successful, closing modal and navigating...');
        onClose();
        // Navigate to the appropriate dashboard
        navigate(`/${selectedRole}`);
      } else {
        console.log('Login failed - invalid credentials');
        setError('Invalid credentials. Please use the demo credentials shown on the main page.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setUsername('');
      setPassword('');
      setError('');
      setShowPassword(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  // Don't render if no role is selected
  if (!selectedRole) {
    return null;
  }

  const isTeacherLogin = selectedRole === 'teacher';
  const isAdminLogin = selectedRole === 'admin';
  const isStudentLogin = selectedRole === 'student';
  
  const getModalClass = () => {
    if (isStudentLogin) return 'student-modal';
    if (isTeacherLogin) return 'teacher-modal';
    if (isAdminLogin) return 'admin-modal';
    if (selectedRole === 'guardian') return 'guardian-modal';
    return 'modal-professional';
  };
  
  const getInputClass = () => {
    if (isStudentLogin) return 'input-student';
    if (isTeacherLogin) return 'input-teacher';
    if (isAdminLogin) return 'input-admin';
    if (selectedRole === 'guardian') return 'input-guardian';
    return 'input-professional';
  };
  
  const getButtonClass = () => {
    if (isStudentLogin) return 'btn-student-primary';
    if (isTeacherLogin) return 'btn-teacher-primary';
    if (isAdminLogin) return 'btn-admin-primary';
    if (selectedRole === 'guardian') return 'btn-guardian-primary';
    return '';
  };
  
  const getTitleColor = () => {
    if (isStudentLogin) return 'text-student-primary';
    if (isTeacherLogin) return 'text-teacher-primary';
    if (isAdminLogin) return 'text-admin-primary';
    if (selectedRole === 'guardian') return 'text-guardian-primary';
    return 'text-primary';
  };
  
  const getFocusRing = () => {
    if (isStudentLogin) return 'focus:ring-student-secondary focus:border-student-secondary';
    if (isTeacherLogin) return 'focus:ring-teacher-primary focus:border-teacher-primary';
    if (isAdminLogin) return 'focus:ring-admin-primary focus:border-admin-primary';
    if (selectedRole === 'guardian') return 'focus:ring-guardian-primary focus:border-guardian-primary';
    return 'focus:ring-primary focus:border-primary';
  };
  
  const getBackgroundClass = () => {
    if (isStudentLogin) return 'student-login-bg';
    if (isAdminLogin) return 'admin-login-bg';
    if (selectedRole === 'guardian') return 'guardian-login-bg';
    return '';
  };

  const modalClass = getModalClass();
  const inputClass = getInputClass();
  const buttonClass = getButtonClass();
  const titleColor = getTitleColor();
  const focusRing = getFocusRing();
  const backgroundClass = getBackgroundClass();

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: loginTheme.backgroundGradient }}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose} />
        
        <div 
          className="inline-block w-full max-w-md p-8 my-8 text-left align-middle transition-all transform rounded-xl relative shadow-2xl"
          style={{ 
            backgroundColor: loginTheme.cardBackground,
            color: loginTheme.text,
            border: `1px solid ${loginTheme.inputBorder}`,
            transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease'
          }}
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-2" style={{ color: loginTheme.primary }}>
              {selectedRole === 'admin' ? 'Administrator Login' : 
               selectedRole === 'student' ? 'Student Login' :
               selectedRole === 'teacher' ? 'Teacher Login' : 
               selectedRole === 'guardian' ? 'Guardian Login' :
               `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Login`}
            </h3>
            <p className="text-lg" style={{ color: loginTheme.text, opacity: 0.7 }}>
              {selectedRole === 'admin' ? 'Access the command center' : 
               selectedRole === 'student' ? 'Begin your learning adventure' :
               selectedRole === 'guardian' ? 'Welcome to your family portal' :
               'Welcome to your professional workspace'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2" style={{ color: loginTheme.text }}>
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-4 w-5 h-5" style={{ color: loginTheme.primary }} />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: loginTheme.inputBackground,
                    borderColor: loginTheme.inputBorder,
                    color: loginTheme.text,
                    '--focus-ring-color': loginTheme.inputFocus
                  } as React.CSSProperties}
                  onFocus={(e) => {
                    e.target.style.borderColor = loginTheme.inputFocus;
                    e.target.style.boxShadow = `0 0 0 2px ${loginTheme.inputFocus}33`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = loginTheme.inputBorder;
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: loginTheme.text }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: loginTheme.inputBackground,
                    borderColor: loginTheme.inputBorder,
                    color: loginTheme.text
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = loginTheme.inputFocus;
                    e.target.style.boxShadow = `0 0 0 2px ${loginTheme.inputFocus}33`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = loginTheme.inputBorder;
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 transition-colors"
                  style={{ color: loginTheme.primary }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div 
                className="p-3 border rounded-lg text-sm"
                style={{ 
                  backgroundColor: '#FEF2F2',
                  borderColor: '#FECACA',
                  color: '#DC2626'
                }}
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ 
                background: loginTheme.buttonGradient,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              isLoading={isLoading}
              icon={LogIn}
              size="lg"
            >
              {selectedRole === 'admin' ? 'Access Command Center' : 
               selectedRole === 'student' ? 'Start Learning Adventure' :
               selectedRole === 'guardian' ? 'Enter Family Portal' :
               'Login'}
            </Button>

          </form>
        </div>
      </div>
    </div>
  );
};