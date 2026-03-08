import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../features/auth/authSlice';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-[4%] py-12 animate-fade-in" id="login-page">
      <div className="w-full max-w-[420px] bg-bgCard border border-borderLayer rounded-[24px] p-8 md:p-10 shadow-modal">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl tracking-wide mb-2">Welcome Back</h1>
          <p className="text-textSecondary">Sign in to your BatMove account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="form-group">
            <label className="form-label" htmlFor="email"><FiMail /> Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input focus:border-accentPrimary ${errors.email ? 'form-input-error' : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password"><FiLock /> Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input focus:border-accentPrimary ${errors.password ? 'form-input-error' : ''}`}
              placeholder="Enter your password"
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {error && <div className="text-center p-3 bg-red-600/10 text-red-500 rounded-lg text-sm">{error}</div>}

          <button type="submit" className="btn btn-lg btn-primary w-full justify-center mt-2 group" disabled={loading}>
            <FiLogIn className="transition-transform group-hover:translate-x-1" /> 
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 text-textSecondary text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-accentPrimary font-bold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
