import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  User, 
  Lock, 
  AlertCircle, 
  Users,
  LogIn,
  Eye,
  EyeOff,
  Fingerprint
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Data user yang valid
const validUsers = [
  { id: 1, username: 'ditho dewangga', password: 'ditho123', name: 'Ditho Dewangga', avatar: 'DD', role: 'Admin' },
  { id: 2, username: 'Ziyaddatan', password: 'ziyad123', name: 'Ziyaddatan', avatar: 'ZD', role: 'Manager' },
  { id: 3, username: 'Arifin ilham', password: 'arifin123', name: 'Arifin Ilham', avatar: 'AI', role: 'Developer' },
  { id: 4, username: 'Nur wahyudi', password: 'nur123', name: 'Nur Wahyudi', avatar: 'NW', role: 'Designer' },
];

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Username and password cannot be empty');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const user = validUsers.find(
        (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );

      if (user) {
        toast.success(`Welcome back, ${user.name}!`, {
          icon: '👋',
          duration: 3000,
        });
        
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        localStorage.setItem('isAuthenticated', 'true');
        
        onLogin(userWithoutPassword);
      } else {
        setError('Invalid username or password');
        toast.error('Login failed! Please check your credentials.', {
          duration: 3000,
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const fillCredentials = (user) => {
    setUsername(user.username);
    setPassword(user.password);
    setError('');
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 fixed inset-0">
      
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Login Card - Fixed Height */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
        style={{ height: '600px' }}
      >
        <div className="h-full backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="flex-none px-8 pt-8 pb-4 text-center bg-gradient-to-b from-white/20 to-transparent">
            
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-3"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500 rounded-2xl blur-xl opacity-50"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-2xl">
                  <CheckSquare size={32} className="text-white" />
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-1"
            >
              Agendaku
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-white/60"
            >
              Manage your tasks efficiently
            </motion.p>
          </div>

          {/* Form */}
          <div className="flex-1 px-8 pb-8 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="backdrop-blur-lg bg-red-500/20 border border-red-500/30 rounded-xl p-3 flex items-center space-x-2"
                >
                  <AlertCircle size={16} className="text-red-300 flex-shrink-0" />
                  <span className="text-xs text-red-200">{error}</span>
                </motion.div>
              )}

              {/* Username Field */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-white/80 ml-1">
                  Username
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 group-hover:text-white/60 transition-colors" size={16} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 text-sm bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder-white/40 transition-all backdrop-blur-lg"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-white/80 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 group-hover:text-white/60 transition-colors" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-3 text-sm bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder-white/40 transition-all backdrop-blur-lg"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium relative overflow-hidden group shadow-lg text-sm"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={16} />
                      <span>Sign In</span>
                    </>
                  )}
                </span>
              </motion.button>

              {/* Demo Users Section */}
              <div className="pt-4">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="h-px w-10 bg-white/20"></div>
                  <div className="flex items-center space-x-1">
                    <Users size={14} className="text-purple-300" />
                    <span className="text-xs text-white/60">Demo Accounts</span>
                  </div>
                  <div className="h-px w-10 bg-white/20"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {validUsers.map((user, index) => (
                    <motion.button
                      key={user.id}
                      type="button"
                      onClick={() => fillCredentials(user)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group"
                    >
                      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-2 hover:border-purple-400/50 transition-all">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br flex-shrink-0 ${
                            user.id === 1 ? 'from-red-400 to-orange-400' :
                            user.id === 2 ? 'from-blue-400 to-cyan-400' :
                            user.id === 3 ? 'from-green-400 to-emerald-400' :
                            'from-purple-400 to-indigo-400'
                          } flex items-center justify-center text-xs font-bold text-white shadow-lg`}>
                            {user.avatar}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-xs font-medium text-white truncate">{user.name}</p>
                            <p className="text-[10px] text-white/40 truncate">{user.role}</p>
                          </div>
                          <Fingerprint size={12} className="text-white/30 group-hover:text-purple-300 transition-colors flex-shrink-0" />
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Custom animation delay */}
      <style>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;