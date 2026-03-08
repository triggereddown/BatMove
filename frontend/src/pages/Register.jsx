import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../features/auth/authSlice';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.trim().length < 3) newErrors.username = 'Username must be at least 3 characters';
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
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created! Welcome to BatMove!');
      navigate('/');
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-[4%] py-12 animate-fade-in" id="register-page">
      <div className="w-full max-w-[420px] bg-bgCard border border-borderLayer rounded-[24px] p-8 md:p-10 shadow-modal">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl tracking-wide mb-2">Create Account</h1>
          <p className="text-textSecondary">Join BatMove and start discovering movies</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="form-group">
            <label className="form-label" htmlFor="username"><FiUser /> Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`form-input focus:border-accentPrimary ${errors.username ? 'form-input-error' : ''}`}
              placeholder="Choose a username"
            />
            {errors.username && <span className="form-error">{errors.username}</span>}
          </div>

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
              placeholder="Min. 6 characters"
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {error && <div className="text-center p-3 bg-red-600/10 text-red-500 rounded-lg text-sm">{error}</div>}

          <button type="submit" className="btn btn-lg btn-primary w-full justify-center mt-2 group" disabled={loading}>
            <FiUserPlus className="transition-transform group-hover:scale-110" /> 
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-8 text-textSecondary text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-accentPrimary font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
