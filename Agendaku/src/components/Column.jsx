// components/Column.jsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const Column = ({ id, title, color, boardId, children, onAddTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: {
      columnId: id,
      boardId,
    },
  });

  const colorClasses = {
    blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
    yellow: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    green: 'border-green-500 bg-green-50 dark:bg-green-900/20',
  };

  const headerColors = {
    blue: 'text-blue-700 dark:text-blue-300',
    yellow: 'text-yellow-700 dark:text-yellow-300',
    green: 'text-green-700 dark:text-green-300',
  };

  // Hitung jumlah children
  const childCount = React.Children.count(children);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`flex flex-col h-full min-h-[500px] rounded-xl border-2 ${
        colorClasses[color]
      } ${isOver ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className={`font-semibold ${headerColors[color]}`}>{title}</h2>
            <span className="px-2 py-0.5 text-xs bg-white dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
              {childCount}
            </span>
          </div>
          <button
            onClick={onAddTask}
            className="p-1 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Plus size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Tasks Container */}
      <div
        ref={setNodeRef}
        className="flex-1 p-4 overflow-y-auto space-y-3"
      >
        <AnimatePresence>
          {children}
        </AnimatePresence>

        {childCount === 0 && (
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Drop tasks here</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Column;