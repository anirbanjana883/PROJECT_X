import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast'; // <--- NEW IMPORT
import { api } from '../../hooks/useGetCurrentUser';
import AuthLayout from '../../components/layout/AuthLayout';
import AuthInput from '../../components/ui/AuthInput';
import GoogleButton from '../../components/ui/GoogleButton';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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

    const signupPromise = api.post('/auth/register', formData);

    toast.promise(signupPromise, {
      loading: 'Creating your account...',
      success: (response) => {
        const { data } = response;
        dispatch(setCredentials(data));
        
        setTimeout(() => {
             navigate('/patient/dashboard');
        }, 500);

        return 'Account created successfully!';
      },
      error: (err) => {
        setLoading(false);
        return err.response?.data?.message || 'Registration failed';
      },
    });
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join the vision therapy platform"
    >
       <div className="space-y-6">
        <div>
           <GoogleButton onClick={handleGoogleLogin} text="Sign up with Google" />
           <div className="relative flex py-5 items-center">
             <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
             <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-wider font-semibold">Or sign up with email</span>
             <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput 
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            icon={FaUser}
          />

          <AuthInput 
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            icon={FaEnvelope}
          />

          <AuthInput 
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min 6 characters"
            icon={FaLock}
            minLength={6}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-600/40 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.99]"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
          
           <p className="text-xs text-center text-gray-500 mt-4 px-4">
            By creating an account, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;