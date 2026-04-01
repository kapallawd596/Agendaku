// components/ProjectPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Board from './Board';

const ProjectPage = () => {
  const { boardId } = useParams();
  const { t } = useLanguage();

  const projectNames = {
    personal: t('personal'),
    work: t('work'),
    shopping: t('shopping')
  };

  const projectIcons = {
    personal: '📋',
    work: '💼',
    shopping: '🛒'
  };

  const projectName = projectNames[boardId] || t('personal');
  const projectIcon = projectIcons[boardId] || '📁';

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <span className="text-4xl">{projectIcon}</span>
          <div>
            <h1 className="text-2xl font-bold dark:text-white">{projectName} {t('project')}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('manageTasks')} {projectName.toLowerCase()} {t('project')}
            </p>
          </div>
        </div>
      </div>

      {/* Board untuk project tertentu */}
      <Board boardId={boardId} />
    </div>
  );
};

export default ProjectPage;