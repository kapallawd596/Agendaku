// components/AllBoards.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DndContext, closestCenter, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import { Plus } from 'lucide-react';

const AllBoards = () => {
  const { tasks, moveTask, getGlobalFilteredTasks, searchTerm, filterPriority } = useTasks();
  const [activeId, setActiveId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Gunakan filtered tasks
  const allTasks = getGlobalFilteredTasks();

  const columns = [
    { id: 'todo', title: 'To Do', color: 'blue' },
    { id: 'inProgress', title: 'In Progress', color: 'yellow' },
    { id: 'done', title: 'Done', color: 'green' },
  ];

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeTask = allTasks.todo.find(t => t.id === active.id) ||
                      allTasks.inProgress.find(t => t.id === active.id) ||
                      allTasks.done.find(t => t.id === active.id);

    if (!activeTask) {
      setActiveId(null);
      return;
    }

    const sourceColumn = activeTask.status;
    let destColumn = over.id;

    if (over.data.current?.type === 'task') {
      destColumn = over.data.current.columnId;
    }

    if (sourceColumn !== destColumn) {
      moveTask(activeTask.boardId, sourceColumn, destColumn, active.id);
    }

    setActiveId(null);
  };

  const handleAddTask = (columnId) => {
    setSelectedColumn(columnId);
    setIsModalOpen(true);
  };

  // Tampilkan pesan jika tidak ada hasil filter
  const hasNoResults = allTasks.todo.length === 0 && 
                      allTasks.inProgress.length === 0 && 
                      allTasks.done.length === 0 && 
                      (searchTerm || filterPriority !== 'all');

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold dark:text-white">All Projects</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Drag and drop tasks to move them between columns
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Tasks: {allTasks.todo.length + allTasks.inProgress.length + allTasks.done.length}
            </p>
          </div>

          {/* Pesan ketika tidak ada hasil filter */}
          {hasNoResults && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center"
            >
              <p className="text-yellow-700 dark:text-yellow-400">
                No tasks match your search or filter criteria
              </p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <div
                key={column.id}
                className={`flex flex-col h-full min-h-[500px] rounded-xl border-2 ${
                  column.id === 'todo' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                  column.id === 'inProgress' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                  'border-green-500 bg-green-50 dark:bg-green-900/20'
                }`}
              >
                {/* Column Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h2 className={`font-semibold ${
                        column.id === 'todo' ? 'text-blue-700 dark:text-blue-300' :
                        column.id === 'inProgress' ? 'text-yellow-700 dark:text-yellow-300' :
                        'text-green-700 dark:text-green-300'
                      }`}>
                        {column.title}
                      </h2>
                      <span className="px-2 py-0.5 text-xs bg-white dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
                        {allTasks[column.id].length}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddTask(column.id)}
                      className="p-1 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title={`Add task to ${column.title}`}
                    >
                      <Plus size={18} className="text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                </div>

                {/* Tasks Container */}
                <SortableContext
                  items={allTasks[column.id].map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {allTasks[column.id].map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        columnId={column.id}
                        boardId={task.boardId}
                      />
                    ))}

                    {allTasks[column.id].length === 0 && (
                      <div 
                        className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer group"
                        onClick={() => handleAddTask(column.id)}
                      >
                        <Plus size={24} className="text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">No tasks yet</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click to add your first task</p>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeId && (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-blue-500 rotate-3 scale-105">
              <p className="font-medium dark:text-white">
                {allTasks.todo.find(t => t.id === activeId)?.title ||
                 allTasks.inProgress.find(t => t.id === activeId)?.title ||
                 allTasks.done.find(t => t.id === activeId)?.title}
              </p>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedColumn(null);
        }}
        boardId="personal"
        columnId={selectedColumn}
      />
    </>
  );
};

export default AllBoards;