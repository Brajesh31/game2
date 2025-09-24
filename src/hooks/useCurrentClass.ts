import { useState, useEffect } from 'react';
import { ClassManagementService, ClassInfo } from '../services/ClassManagementService';
import { useAuth } from './useAuth';

export const useCurrentClass = () => {
  const { user } = useAuth();
  const [currentClass, setCurrentClass] = useState<string>('class_6');
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const userClass = ClassManagementService.getCurrentClass(user.id);
      setCurrentClass(userClass);
      setClassInfo(ClassManagementService.getClassInfo(userClass));
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    // Listen for class changes
    const cleanup = ClassManagementService.onClassChange((newClassId, newClassInfo) => {
      setCurrentClass(newClassId);
      setClassInfo(newClassInfo);
    });

    return cleanup;
  }, []);

  const changeClass = (newClassId: string) => {
    if (user?.id && ClassManagementService.isValidClass(newClassId)) {
      ClassManagementService.setCurrentClass(user.id, newClassId);
    }
  };

  const getAvailableClasses = () => {
    return ClassManagementService.getAvailableClasses();
  };

  return {
    currentClass,
    classInfo,
    loading,
    changeClass,
    getAvailableClasses,
    isValidClass: ClassManagementService.isValidClass
  };
};