import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState({});
  const [boards, setBoards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Load current user dari localStorage
  useEffect(() => {
    const loadUser = () => {
      const user = localStorage.getItem('currentUser');
      if (user) {
        setCurrentUser(JSON.parse(user));
      } else {
        setCurrentUser(null);
      }
    };

    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  // Load notifications dari localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  // Save notifications ke localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Fungsi untuk update user
  const updateCurrentUser = (user) => {
    setCurrentUser(user);
  };

  // Load data dari localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedBoards = localStorage.getItem('boards');
    
    if (savedBoards) {
      setBoards(JSON.parse(savedBoards));
    } else {
      const defaultBoards = [
        { id: 'personal', name: 'Personal', color: 'blue', icon: 'Home' },
        { id: 'work', name: 'Work', color: 'purple', icon: 'Briefcase' },
        { id: 'shopping', name: 'Shopping', color: 'green', icon: 'ShoppingBag' },
      ];
      setBoards(defaultBoards);
      localStorage.setItem('boards', JSON.stringify(defaultBoards));
    }
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const emptyTasks = {
        personal: { todo: [], inProgress: [], done: [] },
        work: { todo: [], inProgress: [], done: [] },
        shopping: { todo: [], inProgress: [], done: [] },
      };
      setTasks(emptyTasks);
      localStorage.setItem('tasks', JSON.stringify(emptyTasks));
    }
  }, []);

  // Save ke localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('boards', JSON.stringify(boards));
  }, [boards]);

  // NOTIFICATION FUNCTIONS
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Tampilkan toast notifikasi
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                {notification.sender?.avatar || '📬'}
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {notification.title}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationsForUser = (username) => {
    return notifications.filter(n => n.recipient === username);
  };

  const getUnreadCount = (username) => {
    return notifications.filter(n => n.recipient === username && !n.read).length;
  };

  // Cek apakah user adalah admin/manager
  const isAdminOrManager = () => {
    return currentUser?.role === 'Admin' || currentUser?.role === 'Manager';
  };

  // Cek apakah user terlibat dalam task (sebagai creator atau assignee)
  const isUserInvolved = (task) => {
    if (!currentUser) return false;
    
    // Admin/Manager bisa lihat semua task
    if (isAdminOrManager()) return true;
    
    // User biasa: hanya lihat task yang dia buat ATAU dia yang ditugaskan
    const isCreator = task.createdBy?.name === currentUser.name;
    const isAssignee = task.assignedTo?.name === currentUser.name;
    
    return isCreator || isAssignee;
  };

  // Fungsi untuk menambah board
  const addBoard = (boardName, boardColor = 'blue', boardIcon = 'Folder') => {
    const boardId = boardName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    
    const newBoard = {
      id: boardId,
      name: boardName,
      color: boardColor,
      icon: boardIcon,
      createdAt: new Date().toISOString()
    };

    setBoards(prev => [...prev, newBoard]);
    setTasks(prev => ({
      ...prev,
      [boardId]: { todo: [], inProgress: [], done: [] }
    }));

    toast.success(`Project "${boardName}" created successfully!`);
    return boardId;
  };

  // Fungsi untuk menghapus board
  const deleteBoard = (boardId) => {
    if (boardId === 'personal' || boardId === 'work' || boardId === 'shopping') {
      toast.error('Default projects cannot be deleted');
      return;
    }
    
    setBoards(prev => prev.filter(board => board.id !== boardId));
    setTasks(prev => {
      const newTasks = { ...prev };
      delete newTasks[boardId];
      return newTasks;
    });
    toast.success('Project deleted successfully!');
  };

  // Fungsi untuk update board
  const updateBoard = (boardId, updates) => {
    setBoards(prev => prev.map(board => 
      board.id === boardId ? { ...board, ...updates } : board
    ));
    toast.success('Project updated successfully!');
  };

  // ADD TASK - dengan createdBy dan notifikasi
  const addTask = (boardId, columnId, task) => {
    const currentUserData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    const newTask = {
      ...task,
      id: Date.now().toString(),
      status: columnId,
      createdAt: new Date().toISOString(),
      createdBy: {
        name: currentUserData.name,
        avatar: currentUserData.avatar
      },
      assignedTo: task.assignedTo || null
    };

    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };
      
      if (!updatedTasks[boardId]) {
        updatedTasks[boardId] = { todo: [], inProgress: [], done: [] };
      }
      
      if (!updatedTasks[boardId][columnId]) {
        updatedTasks[boardId][columnId] = [];
      }

      updatedTasks[boardId] = {
        ...updatedTasks[boardId],
        [columnId]: [...(updatedTasks[boardId][columnId] || []), newTask]
      };

      return updatedTasks;
    });

    // KIRIM NOTIFIKASI KE USER YANG DITUGASKAN
    if (task.assignedTo && task.assignedTo.name !== currentUserData.name) {
      addNotification({
        type: 'task_assigned',
        title: '📋 New Task Assigned',
        message: `${currentUserData.name} assigned a task to you: "${task.title}"`,
        sender: {
          name: currentUserData.name,
          avatar: currentUserData.avatar
        },
        recipient: task.assignedTo.name,
        taskId: newTask.id,
        boardId,
        columnId,
        priority: task.priority,
        dueDate: task.dueDate
      });
    }

    toast.success('Task created successfully!');
  };

  // UPDATE TASK
  const updateTask = (boardId, columnId, taskId, updatedTask) => {
    setTasks(prev => ({
      ...prev,
      [boardId]: {
        ...prev[boardId],
        [columnId]: prev[boardId][columnId].map(task =>
          task.id === taskId ? { ...task, ...updatedTask } : task
        )
      }
    }));

    toast.success('Task updated successfully!');
  };

  // DELETE TASK
  const deleteTask = (boardId, columnId, taskId) => {
    setTasks(prev => ({
      ...prev,
      [boardId]: {
        ...prev[boardId],
        [columnId]: prev[boardId][columnId].filter(task => task.id !== taskId)
      }
    }));

    toast.success('Task deleted successfully!');
  };

  // MOVE TASK
  const moveTask = (boardId, sourceColumn, destColumn, taskId) => {
    const taskToMove = tasks[boardId]?.[sourceColumn]?.find(task => task.id === taskId);
    if (!taskToMove) return;

    setTasks(prev => {
      const updatedSource = prev[boardId][sourceColumn].filter(task => task.id !== taskId);
      const updatedTask = { ...taskToMove, status: destColumn };
      const updatedDest = [...(prev[boardId][destColumn] || []), updatedTask];

      return {
        ...prev,
        [boardId]: {
          ...prev[boardId],
          [sourceColumn]: updatedSource,
          [destColumn]: updatedDest
        }
      };
    });

    toast.success('Task moved successfully!');
  };

  // FILTER TASKS - Hanya yang melibatkan user (createdBy ATAU assignedTo)
  const getFilteredTasks = (boardId, columnId) => {
    if (!tasks[boardId] || !tasks[boardId][columnId]) return [];
    
    const columnTasks = tasks[boardId][columnId] || [];
    
    return columnTasks.filter(task => {
      // CEK APAKAH USER TERLIBAT
      if (!isUserInvolved(task)) return false;
      
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      
      return matchesSearch && matchesPriority && matchesStatus;
    });
  };

  // KHUSUS UNTUK ADMIN - Lihat semua task (tanpa filter involvement)
  const getAllTasks = (boardId, columnId) => {
    if (!isAdminOrManager()) return []; // Panggil sebagai fungsi
    if (!tasks[boardId] || !tasks[boardId][columnId]) return [];
    
    const columnTasks = tasks[boardId][columnId] || [];
    
    return columnTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      
      return matchesSearch && matchesPriority && matchesStatus;
    });
  };

  // FILTER GLOBAL - Hanya yang melibatkan user
  const getGlobalFilteredTasks = () => {
    const filtered = {
      todo: [],
      inProgress: [],
      done: []
    };

    Object.keys(tasks).forEach(boardId => {
      if (tasks[boardId]) {
        ['todo', 'inProgress', 'done'].forEach(columnId => {
          const columnTasks = tasks[boardId][columnId] || [];
          const filteredTasks = columnTasks.filter(task => {
            // CEK APAKAH USER TERLIBAT
            if (!isUserInvolved(task)) return false;
            
            const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 task.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
            const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
            
            return matchesSearch && matchesPriority && matchesStatus;
          });

          filtered[columnId] = [
            ...filtered[columnId], 
            ...filteredTasks.map(task => ({ ...task, boardId }))
          ];
        });
      }
    });

    return filtered;
  };

  // STATS - Hitung berdasarkan task yang melibatkan user
  const getTotalStats = () => {
    let total = 0;
    let inProgress = 0;
    let completed = 0;
    let highPriority = 0;

    Object.values(tasks).forEach(board => {
      if (board) {
        const todoTasks = board.todo?.filter(task => isUserInvolved(task)) || [];
        const inProgressTasks = board.inProgress?.filter(task => isUserInvolved(task)) || [];
        const doneTasks = board.done?.filter(task => isUserInvolved(task)) || [];
        
        total += todoTasks.length + inProgressTasks.length + doneTasks.length;
        inProgress += inProgressTasks.length;
        completed += doneTasks.length;
        
        [...todoTasks, ...inProgressTasks, ...doneTasks].forEach(task => {
          if (task.priority === 'high') highPriority++;
        });
      }
    });

    return { total, inProgress, completed, highPriority };
  };

  // STATS DENGAN FILTER
  const getFilteredStats = () => {
    const filtered = getGlobalFilteredTasks();
    
    const total = filtered.todo.length + filtered.inProgress.length + filtered.done.length;
    const inProgress = filtered.inProgress.length;
    const completed = filtered.done.length;
    
    let highPriority = 0;
    [...filtered.todo, ...filtered.inProgress, ...filtered.done].forEach(task => {
      if (task.priority === 'high') highPriority++;
    });

    return { total, inProgress, completed, highPriority };
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      boards,
      currentUser,
      updateCurrentUser,
      addBoard,
      deleteBoard,
      updateBoard,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      getFilteredTasks,
      getGlobalFilteredTasks,
      getAllTasks,
      getTotalStats,
      getFilteredStats,
      isAdminOrManager: isAdminOrManager(),
      searchTerm,
      setSearchTerm,
      filterPriority,
      setFilterPriority,
      filterStatus,
      setFilterStatus,
      // NOTIFICATION FUNCTIONS
      notifications,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      deleteNotification,
      clearAllNotifications,
      getNotificationsForUser,
      getUnreadCount,
    }}>
      {children}
    </TaskContext.Provider>
  );
};
