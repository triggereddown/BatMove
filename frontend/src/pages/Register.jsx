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
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-[4%] py-12 relative overflow-hidden" id="register-page">
      {/* Dynamic Background Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accentPrimary/10 rounded-full blur-[100px] -z-10 animate-[pulse_6s_ease-in-out_infinite_reverse]" />
      
      <div className="w-full max-w-[420px] bg-glass border border-borderLayer rounded-[24px] p-8 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl opacity-0 animate-[formSlideUp_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
        <div className="text-center mb-8">
          <h1 className="relative mb-3 font-heading text-3xl tracking-wide uppercase text-textPrimary group/header flex justify-center items-center overflow-hidden">
            <span className="inline-flex">
              {'CREATE ACCOUNT'.split('').map((char, i) => (
                <span 
                  key={i} 
                  className="inline-block opacity-0 animate-[charsReveal_0.6s_cubic-bezier(0.4,0,0.2,1)_forwards]"
                  style={{ animationDelay: `${0.1 + (i * 0.04)}s` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          </h1>
          <p className="text-textSecondary opacity-0 animate-[heroFadeIn_0.8s_ease_0.5s_forwards]">Join BatMove and start discovering movies</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="form-group opacity-0 animate-[inputSlideUp_0.6s_ease_0.6s_forwards]">
            <label className="form-label" htmlFor="username"><FiUser /> Username</label>
            <div className="relative group">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`form-input focus:border-accentPrimary transition-all duration-300 w-full ${errors.username ? 'form-input-error' : ''}`}
                placeholder="Choose a username"
              />
              <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-accentPrimary transition-all duration-300 group-focus-within:w-full group-focus-within:left-0" />
            </div>
            {errors.username && <span className="form-error">{errors.username}</span>}
          </div>

          <div className="form-group opacity-0 animate-[inputSlideUp_0.6s_ease_0.7s_forwards]">
            <label className="form-label" htmlFor="email"><FiMail /> Email</label>
            <div className="relative group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input focus:border-accentPrimary transition-all duration-300 w-full ${errors.email ? 'form-input-error' : ''}`}
                placeholder="Enter your email"
              />
              <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-accentPrimary transition-all duration-300 group-focus-within:w-full group-focus-within:left-0" />
            </div>
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group opacity-0 animate-[inputSlideUp_0.6s_ease_0.8s_forwards]">
            <label className="form-label" htmlFor="password"><FiLock /> Password</label>
            <div className="relative group">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input focus:border-accentPrimary transition-all duration-300 w-full ${errors.password ? 'form-input-error' : ''}`}
                placeholder="Min. 6 characters"
              />
              <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-accentPrimary transition-all duration-300 group-focus-within:w-full group-focus-within:left-0" />
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {error && <div className="text-center p-3 bg-red-600/10 text-red-500 border border-red-500/30 rounded-lg text-sm opacity-0 animate-[heroFadeIn_0.4s_ease_forwards]">{error}</div>}

          <button type="submit" className="btn btn-lg btn-primary w-full justify-center mt-2 group relative overflow-hidden isolate" disabled={loading} style={{ animation: 'inputSlideUp 0.6s ease 0.9s forwards', opacity: 0 }}>
            <span className="absolute inset-0 bg-white/20 transform scale-0 rounded-full transition-transform duration-500 ease-out origin-center group-hover:scale-[2]" />
            <FiUserPlus className="transition-transform group-hover:scale-110 relative z-10" /> 
            <span className="relative z-10">{loading ? 'Creating account...' : 'Create Account'}</span>
          </button>
        </form>

        <p className="text-center mt-8 text-textSecondary text-sm opacity-0 animate-[heroFadeIn_0.8s_ease_1s_forwards]">
          Already have an account?{' '}
          <Link to="/login" className="text-accentPrimary font-bold hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-accentPrimary after:origin-bottom-right after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300">Sign in</Link>
        </p>
      </div>
      
      <style>{`
        @keyframes formSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes inputSlideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes charsReveal {
          from { clip-path: inset(0 100% 0 0); opacity: 0; transform: translateX(-10px); }
          to { clip-path: inset(0 0% 0 0); opacity: 1; transform: translateX(0); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Register;
