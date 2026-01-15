import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast'; // <--- NEW IMPORT
import { api } from '../../hooks/useGetCurrentUser';
import AuthLayout from '../../components/layout/AuthLayout';
import AuthInput from '../../components/ui/AuthInput';
import GoogleButton from '../../components/ui/GoogleButton';
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/google";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // React Hot Toast allows us to use a "Promise Toast" for better UX
    const loginPromise = api.post('/auth/login', formData);

    toast.promise(loginPromise, {
      loading: 'Authenticating...',
      success: (response) => {
        const { data } = response;
        dispatch(setCredentials(data));
        
        // Navigate after a brief delay so user sees success message
        setTimeout(() => {
             if (data.user.role === 'doctor') {
                navigate('/doctor/dashboard');
              } else {
                navigate('/patient/dashboard');
              }
        }, 500);

        return `Welcome back, ${data.user.name.split(' ')[0]}!`;
      },
      error: (err) => {
        setLoading(false); // Stop local loading state on error
        return err.response?.data?.message || 'Invalid email or password';
      },
    });
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Securely access your IndriyaX dashboard"
    >
      <div className="space-y-6">
        {/* Google Auth */}
        <div>
           <GoogleButton onClick={handleGoogleLogin} />
           
           <div className="relative flex py-5 items-center">
             <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
             <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-wider font-semibold">Or continue with email</span>
             <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
           </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput 
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="doctor@hospital.com"
            icon={FaEnvelope}
          />

          <div>
            <AuthInput 
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={FaLock}
            />
            <div className="flex justify-end mt-2">
              <Link to="/forgot-password" class="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading} // Controlled by our local state + promise
            className="w-full flex justify-center items-center bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-600/40 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.99]"
          >
             {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          New to IndriyaX?{' '}
          <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;