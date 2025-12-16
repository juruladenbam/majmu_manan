import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@/features/auth/hooks';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending: isLoading } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password }, {
      onSuccess: () => navigate('/dashboard', { replace: true })
    });
  };

  return (
    <div className="font-display antialiased text-[#1c1c0d] dark:text-white bg-background-light dark:bg-background-dark min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Gradient and Pattern */}
      <div className="absolute inset-0 bg-pattern z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a5f4a]/10 to-transparent dark:from-[#f9f506]/5 z-0 pointer-events-none"></div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Main Layout Container */}
        <div className="w-full max-w-md">
          {/* Glass Card */}
          <div className="glass-card rounded-[2rem] p-8 sm:p-10 w-full transition-all duration-300">
            {/* Header Section */}
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 text-[#1a5f4a] dark:text-primary">
                <span className="material-symbols-outlined !text-[32px]">mosque</span>
              </div>
              <h1 className="font-arabic text-3xl font-bold text-[#1c1c0d] dark:text-white mb-2 leading-tight">مجموع منان</h1>
              <h2 className="text-sm uppercase tracking-wider font-semibold text-[#1c1c0d]/60 dark:text-white/60">Majmu' Manan Admin Panel</h2>
            </div>

            {/* Form Section */}
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="group">
                <label className="block text-sm font-medium text-[#1c1c0d]/80 dark:text-white/80 mb-2 ml-1" htmlFor="email">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1c1c0d]/40 dark:text-white/40">
                    <span className="material-symbols-outlined !text-[20px]">mail</span>
                  </div>
                  <input
                    type="email"
                    id="email"
                    placeholder="name@example.com"
                    className="form-input block w-full pl-11 pr-4 py-3.5 rounded-full bg-white/50 dark:bg-black/20 border-transparent focus:border-primary focus:ring-0 text-[#1c1c0d] dark:text-white placeholder-[#1c1c0d]/30 dark:placeholder-white/30 transition-all duration-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="block text-sm font-medium text-[#1c1c0d]/80 dark:text-white/80 mb-2 ml-1" htmlFor="password">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1c1c0d]/40 dark:text-white/40">
                    <span className="material-symbols-outlined !text-[20px]">lock</span>
                  </div>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    className="form-input block w-full pl-11 pr-12 py-3.5 rounded-full bg-white/50 dark:bg-black/20 border-transparent focus:border-primary focus:ring-0 text-[#1c1c0d] dark:text-white placeholder-[#1c1c0d]/30 dark:placeholder-white/30 transition-all duration-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#1c1c0d]/40 dark:text-white/40 hover:text-[#1c1c0d] dark:hover:text-white transition-colors cursor-pointer">
                    <span className="material-symbols-outlined !text-[20px]">visibility</span>
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between mt-2 px-1">
                <label className="inline-flex items-center cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 dark:border-white/20 text-primary focus:ring-primary/50 bg-white/50 dark:bg-black/20" />
                  <span className="ml-2 text-sm text-[#1c1c0d]/70 dark:text-white/70 group-hover:text-[#1c1c0d] dark:group-hover:text-white transition-colors">Ingat Saya</span>
                </label>
                <a href="#" className="text-sm font-medium text-[#1c1c0d]/70 dark:text-white/70 hover:text-primary transition-colors hover:underline decoration-primary decoration-2 underline-offset-4">
                  Lupa Kata Sandi?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 w-full h-14 bg-primary hover:bg-primary/90 text-[#1c1c0d] font-bold text-base rounded-full shadow-lg shadow-primary/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>Loading...</span>
                ) : (
                  <>
                    <span>MASUK</span>
                    <span className="material-symbols-outlined !text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-[#1c1c0d]/40 dark:text-white/40 font-medium">
              © 2024 Majmu' Manan. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
                }
                .dark .glass-card {
                    background: rgba(35, 34, 15, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
                }
                .bg-pattern {
                    background-color: #f8f8f5;
                    background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuAd6NeonKDpxQ63ZCRiISwcNPb-fMkHF1C0dd7_CHoy44qNUjVqcEfxPGd-cMa-6raftHO5STo2n2PG3MUeDlsssWBtFe19ujS1773P6o5NDi-6BmdA8iKJXjKJCooNQgPejBDk1rO1vxXXCsfF8p-ZTBXpASPbxXMGEtpGbq2F_Gq96F0uJL1qJf7GLbh8bELOyhcTlZYh5rd2iG30o74E8OPgWol8RLNxognoG8B5JTBO2HYgjmFG3iBzPok9q-_4UeQLQk3rUfsy);
                }
                .dark .bg-pattern {
                    background-color: #23220f;
                    background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuDkNlsrS8LwtG9ixa8L3DsCw_8VlDYs8809VeODh0oil7gfHWv1Koa0P2c-hxsa3hduhk6gcxivOGLEab04o2s9OC1Ti_je3pmRO6OR0KLYlrXw50FMyA7uS2eHptMVZumFVGaOmLBUiSHlh1eUALtB1r7QFQcsGE37_T_eRUYSDyCmcrfUaZNBEki0xfdqNOeM8gJlr_dN5hzlJL-FrDRfLpTdPnHw5loWP4xna0PxwNbs-Vc5cO9PFOg-M4bwwhrwdyV5zLjlRZ51);
                }
            `}</style>
    </div>
  );
};
