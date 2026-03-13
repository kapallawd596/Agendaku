// components/AddProjectModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Home, 
  Briefcase, 
  ShoppingBag, 
  Folder, 
  Heart, 
  Book, 
  Code, 
  Camera, 
  Music,
  PenTool,
  Globe,
  Coffee,
  Dumbbell,
  Plane
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { toast } from 'react-hot-toast';

const iconOptions = [
  { name: 'Home', icon: Home, color: 'text-blue-500' },
  { name: 'Briefcase', icon: Briefcase, color: 'text-purple-500' },
  { name: 'ShoppingBag', icon: ShoppingBag, color: 'text-green-500' },
  { name: 'Folder', icon: Folder, color: 'text-yellow-500' },
  { name: 'Heart', icon: Heart, color: 'text-red-500' },
  { name: 'Book', icon: Book, color: 'text-indigo-500' },
  { name: 'Code', icon: Code, color: 'text-gray-700' },
  { name: 'Camera', icon: Camera, color: 'text-pink-500' },
  { name: 'Music', icon: Music, color: 'text-orange-500' },
  { name: 'PenTool', icon: PenTool, color: 'text-amber-500' },
  { name: 'Globe', icon: Globe, color: 'text-cyan-500' },
  { name: 'Coffee', icon: Coffee, color: 'text-brown-500' },
  { name: 'Dumbbell', icon: Dumbbell, color: 'text-lime-500' },
  { name: 'Plane', icon: Plane, color: 'text-sky-500' },
];

const colorOptions = [
  { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
  { name: 'Green', value: 'green', class: 'bg-green-500' },
  { name: 'Red', value: 'red', class: 'bg-red-500' },
  { name: 'Yellow', value: 'yellow', class: 'bg-yellow-500' },
  { name: 'Indigo', value: 'indigo', class: 'bg-indigo-500' },
  { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
  { name: 'Cyan', value: 'cyan', class: 'bg-cyan-500' },
  { name: 'Lime', value: 'lime', class: 'bg-lime-500' },
];

const AddProjectModal = ({ isOpen, onClose }) => {
  const { addBoard } = useTasks();
  const [projectName, setProjectName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Folder');
  const [selectedColor, setSelectedColor] = useState('blue');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      toast.error('Project name is required');
      return;
    }
    
    addBoard(projectName, selectedColor, selectedIcon);
    setProjectName('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
              <h2 className="text-xl font-semibold dark:text-white">Create New Project</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  placeholder="e.g., Marketing, Design, Fitness"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Choose Icon
                </label>
                <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1">
                  {iconOptions.map((icon) => {
                    const IconComponent = icon.icon;
                    return (
                      <button
                        key={icon.name}
                        type="button"
                        onClick={() => setSelectedIcon(icon.name)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedIcon === icon.name
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        title={icon.name}
                      >
                        <IconComponent size={20} className={icon.color} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Choose Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-8 h-8 rounded-full ${color.class} ${
                        selectedColor === color.value
                          ? 'ring-2 ring-offset-2 ring-blue-500'
                          : ''
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddProjectModal;