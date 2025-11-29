import React, { useState, useEffect } from 'react';
import { ButterflyIcon } from './components/ButterflyIcon';
import { InputField } from './components/InputField';
import { PrimaryButton } from './components/PrimaryButton';
import { Dashboard } from './components/Dashboard';
import { mockUsers, User, saveUsersToStorage, refreshUsersFromStorage, updateUserInStorage, TEMP_PASSWORD } from './data/mockData';
import { ContactModal } from './components/ContactModal';
import { ForcePasswordChange } from './components/ForcePasswordChange';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import { TermsScreen } from './components/TermsScreen';
import { WelcomeModal } from './components/WelcomeModal';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState('light');
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState('');
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  
  // State for password change flow
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);

  // State for forgot/reset password flow
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resettingUser, setResettingUser] = useState<User | null>(null);

  // State to trigger re-renders in child components (like Gallery) when data changes
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  // New states for terms and welcome flow
  const [userForTerms, setUserForTerms] = useState<User | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Check for reset token in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resetToken = params.get('resetToken');

    if (resetToken) {
        // Ensure we check against fresh data
        const freshUsers = refreshUsersFromStorage();
        const user = freshUsers.find(u => u.resetToken === resetToken);
        if (user) {
            setResettingUser(user);
        } else {
            alert("Link de redefinição inválido ou expirado.");
            // Clean URL
            window.history.replaceState({}, document.title, "/");
        }
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const currentUsers = refreshUsersFromStorage();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    
    const foundUser = currentUsers.find(
      user => user.email.trim().toLowerCase() === cleanEmail && user.password === cleanPassword
    );

    if (foundUser) {
      if (!foundUser.hasAcceptedTerms) {
        setUserForTerms(foundUser);
      } else if (foundUser.mustChangePassword || foundUser.password === TEMP_PASSWORD) {
          setPendingUser(foundUser);
          setChangePasswordOpen(true);
      } else {
          setLoggedInUser(foundUser);
          setEmail('');
          setPassword('');
      }
    } else {
      setLoginError('E-mail ou senha inválidos. Tente novamente.');
    }
  };

  const handleAcceptTerms = () => {
      if (userForTerms) {
          const updatedUser = { ...userForTerms, hasAcceptedTerms: true, lastModified: Date.now() };
          updateUserInStorage(updatedUser);
          setUserForTerms(updatedUser); // Keep the updated user object
          setShowWelcome(true);
      }
  };

  const handleCloseWelcome = () => {
    if (userForTerms) {
      setShowWelcome(false);
      // Now proceed with the post-term-acceptance login flow
      if (userForTerms.mustChangePassword || userForTerms.password === TEMP_PASSWORD) {
        setPendingUser(userForTerms);
        setChangePasswordOpen(true);
      } else {
        setLoggedInUser(userForTerms);
        setEmail('');
        setPassword('');
      }
      setUserForTerms(null); // Clear the temporary user
    }
  };

  const handlePasswordChanged = (newPassword: string) => {
      if (pendingUser) {
          const updatedUser = { 
              ...pendingUser, 
              password: newPassword, 
              mustChangePassword: false,
              resetToken: undefined 
          };
          updateUserInStorage(updatedUser);
          setLoggedInUser(updatedUser);
          setPendingUser(null);
          setChangePasswordOpen(false);
          setEmail('');
          setPassword('');
          refreshUsersFromStorage();
      }
  };

  const handleCancelPasswordChange = () => {
      setPendingUser(null);
      setChangePasswordOpen(false);
      setPassword(''); 
  };
  
  const handleLogout = () => {
    setLoggedInUser(null);
  };

  const handleForgotPasswordClose = () => {
      setForgotPasswordOpen(false);
  };

  const handleResetPasswordSubmit = (newPassword: string) => {
      if (resettingUser) {
          const updatedResetUser = {
              ...resettingUser,
              password: newPassword, 
              mustChangePassword: false,
              resetToken: undefined
          };
          updateUserInStorage(updatedResetUser);
          alert("Senha alterada com sucesso! Você pode fazer login agora.");
          setResettingUser(null);
          window.history.replaceState({}, document.title, "/");
      }
  };

  const handleUserUpdate = (updatedFields: Partial<User>) => {
    if (!loggedInUser) return;
    const updatedUser = { ...loggedInUser, ...updatedFields };
    setLoggedInUser(updatedUser);
    updateUserInStorage(updatedUser);
    setLastUpdate(Date.now());
  };

  if (loggedInUser) {
    return (
      <>
        <Dashboard 
          user={loggedInUser} 
          onLogout={handleLogout} 
          theme={theme} 
          onToggleTheme={toggleTheme}
          onContactClick={() => setContactModalOpen(true)}
          onUserUpdate={handleUserUpdate}
          lastUpdate={lastUpdate}
        />
        <ContactModal 
          isOpen={isContactModalOpen} 
          onClose={() => setContactModalOpen(false)} 
          user={loggedInUser} 
        />
      </>
    );
  }

  // Render Terms screen
  if (userForTerms && !showWelcome) {
      return <TermsScreen onAccept={handleAcceptTerms} />;
  }
  
  // Render Welcome modal after terms
  if (userForTerms && showWelcome) {
      return <WelcomeModal onClose={handleCloseWelcome} />;
  }

  return (
    <div className="relative min-h-screen w-full font-sans text-brand-text flex flex-col items-center justify-center p-4 transition-colors duration-500">
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <img 
          src="https://i.ibb.co/nsFY5Z7v/580930255-18542360491037488-2395317763344905099-n.jpg" 
          alt="" 
          className="w-full h-full object-cover opacity-40 dark:opacity-50" 
        />
        <div className="absolute inset-0 bg-brand-bg-light/80 dark:bg-dark-bg-main/90"></div>
      </div>

      <div className="absolute top-6 right-6">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-brand-gold dark:text-dark-accent bg-brand-bg-light/50 dark:hover:bg-dark-icon transition-colors duration-300"
          aria-label={`Mudar para o tema ${theme === 'light' ? 'escuro' : 'claro'}`}
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          )}
        </button>
      </div>
      
      <main className="w-full max-w-sm bg-brand-bg-light/50 backdrop-blur-lg rounded-2xl shadow-2xl shadow-brand-accent/10 p-8 transition-colors duration-500 dark:bg-dark-bg-secondary/70 dark:shadow-dark-accent/10 relative z-10" role="main">
        <div className="flex flex-col items-center">
          <ButterflyIcon className="w-20 h-20 text-brand-gold dark:text-dark-accent animate-subtle-pulse mb-6" />

          <h1 className="text-3xl font-light text-brand-text mb-2 dark:text-dark-accent">Bem-vindo(a)</h1>
          <p className="text-brand-text/70 mb-8 text-center dark:text-dark-text-soft">Entre no W News e conecte-se ao universo de Wanessa Camargo.</p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <InputField
              id="email"
              label="Endereço de e-mail"
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              id="password"
              label="Senha"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            {loginError && (
              <p className="text-sm text-center text-red-600 dark:text-red-400 mt-2">{loginError}</p>
            )}

            <PrimaryButton type="submit">Entrar</PrimaryButton>
          </form>

          <div className="mt-1.5 w-full text-center">
            <button 
                onClick={() => setForgotPasswordOpen(true)}
                className="text-sm text-brand-text/80 hover:text-brand-gold dark:text-dark-text-soft dark:hover:text-dark-accent transition-colors duration-300" 
                aria-label="Recuperar sua senha"
            >
              Esqueci minha senha
            </button>
          </div>

          <div className="mt-2 pt-2 border-t border-brand-gold/10 dark:border-dark-icon/20 w-full text-center">
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSfmv1usPjQlIBkduxcMxP_NQPNfvhmNxYp8VSiCkUWzx-_HCA/viewform" target="_blank" rel="noopener noreferrer" className="block text-sm text-brand-text/80 hover:text-brand-gold dark:text-dark-text-soft dark:hover:text-dark-accent transition-colors duration-300" aria-label="Cadastre-se no fã clube W News">
              Sem acesso? <span className="font-semibold">Cadastre-se no fã clube W News.</span>
            </a>
          </div>
        </div>
      </main>

      <footer className="mt-8 text-center w-full px-4 relative z-10">
         <p className="text-xs text-brand-text/50 dark:text-dark-text-soft/50">
            W News Fã Clube Oficial
         </p>
      </footer>

      {/* Password Change Modal (First Login) */}
      {isChangePasswordOpen && pendingUser && (
          <ForcePasswordChange 
              user={pendingUser} 
              onPasswordChanged={handlePasswordChanged} 
              onCancel={handleCancelPasswordChange} 
          />
      )}

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
          <ForgotPasswordModal 
            onClose={handleForgotPasswordClose}
          />
      )}

      {/* Reset Password Modal (From Link) */}
      {resettingUser && (
          <ResetPasswordModal 
            user={resettingUser}
            onReset={handleResetPasswordSubmit}
            onCancel={() => {
                setResettingUser(null);
                window.history.replaceState({}, document.title, "/");
            }}
          />
      )}

    </div>
  );
}

export default App;