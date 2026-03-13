import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import Column from './Column';
import TaskCard from './TaskCard';
import { useTasks } from '../context/TaskContext';
import TaskModal from './TaskModal';

const Board = ({ boardId }) => {
  const { tasks, moveTask, getFilteredTasks, getAllTasks, searchTerm, filterPriority, isAdminOrManager, currentUser } = useTasks();
  const [activeId, setActiveId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalColumn, setModalColumn] = useState('todo');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = [
    { id: 'todo', title: 'To Do', color: 'blue' },
    { id: 'inProgress', title: 'In Progress', color: 'yellow' },
    { id: 'done', title: 'Done', color: 'green' },
  ];

  // Dapatkan tasks yang sudah difilter untuk setiap column (berdasarkan user)
  const getColumnTasks = (columnId) => {
    // Admin/Manager bisa lihat semua task
    if (isAdminOrManager) {
      return getAllTasks(boardId, columnId);
    }
    // User biasa hanya lihat task yang di-assign ke dirinya
    return getFilteredTasks(boardId, columnId);
  };

  // Hitung total tasks di board ini
  const getTotalBoardTasks = () => {
    let total = 0;
    columns.forEach(column => {
      total += getColumnTasks(column.id).length;
    });
    return total;
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    // Cari task yang di-drag
    let sourceColumn = null;
    for (const column of columns) {
      const found = tasks[boardId]?.[column.id]?.find(t => t.id === active.id);
      if (found) {
        sourceColumn = column.id;
        break;
      }
    }

    if (!sourceColumn) {
      setActiveId(null);
      return;
    }

    // Tentukan destination column
    let destColumn = over.id;

    // Jika over adalah task, ambil column dari task tersebut
    if (over.data.current?.type === 'task') {
      destColumn = over.data.current.columnId;
    }

    // Jika source dan destination berbeda, pindahkan task
    if (sourceColumn !== destColumn) {
      moveTask(boardId, sourceColumn, destColumn, active.id);
    }

    setActiveId(null);
  };

  const handleAddTask = (columnId) => {
    setModalColumn(columnId);
    setIsModalOpen(true);
  };

  // Cek apakah ada filter yang aktif
  const isFilterActive = searchTerm || filterPriority !== 'all';

  // Cek apakah semua column kosong
  const isBoardEmpty = columns.every(column => getColumnTasks(column.id).length === 0);

  // Cari task yang sedang di-drag untuk overlay
  const findActiveTask = () => {
    for (const column of columns) {
      const task = tasks[boardId]?.[column.id]?.find(t => t.id === activeId);
      if (task) return task;
    }
    return null;
  };

  const activeTask = findActiveTask();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        {/* Header Board dengan info user */}
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold dark:text-white">
              {isAdminOrManager ? 'All Tasks (Admin View)' : 'My Tasks'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isAdminOrManager ? (
                <>Total all tasks: {getTotalBoardTasks()} tasks</>
              ) : (
                <>You have {getTotalBoardTasks()} tasks assigned</>
              )}
            </p>
          </div>
          
          {/* Info user */}
          <div className="flex items-center space-x-3">
            {currentUser && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Logged in as: <span className="font-medium text-blue-600 dark:text-blue-400">{currentUser.name}</span>
                <span className="ml-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                  {currentUser.role}
                </span>
              </div>
            )}
            
            {/* Info filter jika aktif */}
            {isFilterActive && (
              <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                Filter aktif
              </div>
            )}
          </div>
        </div>

        {/* Empty state untuk user biasa yang tidak punya task */}
        {!isAdminOrManager && isBoardEmpty && !isFilterActive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center mb-6"
          >
            <p className="text-blue-700 dark:text-blue-400 font-medium mb-2">
              You don't have any tasks yet
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-500">
              Tasks assigned to you will appear here
            </p>
          </motion.div>
        )}

        {/* Empty state untuk admin (board kosong) */}
        {isAdminOrManager && isBoardEmpty && !isFilterActive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center mb-6"
          >
            <p className="text-blue-700 dark:text-blue-400 font-medium mb-2">
              This board is empty
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-500">
              Click the + button on any column to add your first task
            </p>
          </motion.div>
        )}

        {/* Pesan jika tidak ada hasil filter */}
        {isBoardEmpty && isFilterActive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center mb-6"
          >
            <p className="text-yellow-700 dark:text-yellow-400 font-medium mb-2">
              No tasks match your filter
            </p>
            <p className="text-sm text-yellow-600 dark:text-yellow-500">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => {
              const columnTasks = getColumnTasks(column.id);
              
              return (
                <Column
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  color={column.color}
                  boardId={boardId}
                  onAddTask={() => handleAddTask(column.id)}
                >
                  <SortableContext
                    items={columnTasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        columnId={column.id}
                        boardId={boardId}
                      />
                    ))}
                  </SortableContext>
                </Column>
              );
            })}
          </div>

          <DragOverlay>
            {activeId && activeTask ? (
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-blue-500 rotate-3 scale-105">
                <h3 className="text-sm font-medium dark:text-white">{activeTask.title}</h3>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </motion.div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        boardId={boardId}
        columnId={modalColumn}
      />
    </>
  );
};

export default Board;