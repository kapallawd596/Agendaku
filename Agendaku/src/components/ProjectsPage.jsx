// components/ProjectsPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import { Home, Briefcase, ShoppingBag } from 'lucide-react';

const ProjectsPage = () => {
  const { tasks } = useTasks();
  const navigate = useNavigate();

  // Data default projects
  const defaultProjects = [
    { id: 'personal', name: 'Personal', icon: Home, color: 'blue', bgColor: 'bg-blue-100 dark:bg-blue-900/20', textColor: 'text-blue-600 dark:text-blue-400' },
    { id: 'work', name: 'Work', icon: Briefcase, color: 'purple', bgColor: 'bg-purple-100 dark:bg-purple-900/20', textColor: 'text-purple-600 dark:text-purple-400' },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'green', bgColor: 'bg-green-100 dark:bg-green-900/20', textColor: 'text-green-600 dark:text-green-400' },
  ];

  // Hitung statistik untuk setiap project
  const getProjectStats = (boardId) => {
    const boardTasks = tasks[boardId] || { todo: [], inProgress: [], done: [] };
    const total = (boardTasks.todo?.length || 0) + 
                  (boardTasks.inProgress?.length || 0) + 
                  (boardTasks.done?.length || 0);
    const completed = boardTasks.done?.length || 0;
    const inProgress = boardTasks.inProgress?.length || 0;
    return { total, completed, inProgress };
  };

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Projects</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Select a project to manage your tasks
        </p>
      </div>

      {/* Projects Grid - 3 Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {defaultProjects.map((project, index) => {
          const Icon = project.icon;
          const stats = getProjectStats(project.id);
          const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleProjectClick(project.id)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100 dark:border-gray-700 p-6 group"
            >
              {/* Icon */}
              <div className={`w-14 h-14 ${project.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={28} className={project.textColor} />
              </div>

              {/* Project Name */}
              <h3 className="text-xl font-semibold dark:text-white mb-2">{project.name}</h3>

              {/* Stats */}
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>Total: {stats.total}</span>
                <span>In Progress: {stats.inProgress}</span>
                <span>Done: {stats.completed}</span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium dark:text-white">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className={`h-full bg-${project.color}-500`}
                  />
                </div>
              </div>

              {/* View Details Link */}
              <div className="mt-4 text-sm text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                View details →
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ProjectsPage;