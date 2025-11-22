



import React, { useState, useMemo, useRef } from 'react';
import { User } from '../data/mockData';
import { PrimaryButton } from './PrimaryButton';
import { InstagramIcon, TwitterIcon, FacebookIcon, TiktokIcon, LastfmIcon } from './icons/SocialIcons';

interface UserCardProps {
  user: User;
  currentUser: User;
  onUpdateUser?: (updatedFields: Partial<User>) => void;
}

interface EditableFieldProps {
  label: string;
  value: string;
  isEditable: boolean;
  type?: string;
  onChange: (value: string) => void;
}

const ProfileField: React.FC<EditableFieldProps> = ({ label, value, isEditable, type = 'text', onChange }) => {
  return (
    <div>
      <label className="text-xs font-bold text-brand-text/60 dark:text-dark-text-soft/60 uppercase tracking-wider">{label}</label>
      {isEditable ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border-b-2 border-brand-gold/30 dark:border-dark-icon focus:border-brand-gold dark:focus:border-dark-accent focus:outline-none pt-1 text-brand-text dark:text-dark-text-soft"
        />
      ) : (
        <p className="text-brand-text dark:text-dark-text-soft pt-1 font-medium">{value || 'Não informado'}</p>
      )}
    </div>
  );
};

const Section: React.FC<{title: string, children: React.ReactNode, hasPendingChanges?: boolean}> = ({ title, children, hasPendingChanges }) => (
    <div className="bg-brand-bg-light/50 dark:bg-dark-bg-secondary/70 backdrop-blur-sm rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4 border-b border-brand-gold/20 dark:border-dark-icon/50 pb-3">
            <h3 className="text-xl font-bold text-brand-text dark:text-dark-accent">{title}</h3>
            {hasPendingChanges && (
                <div className="text-xs font-semibold bg-yellow-200 text-yellow-800 px-2 py-1 rounded-md">
                    Alterações Pendentes
                </div>
            )}
        </div>
        {children}
    </div>
);

export const UserCard: React.FC<UserCardProps> = ({ user, currentUser, onUpdateUser }) => {
  // Initialize state, migrating address to street for display if needed
  const [userData, setUserData] = useState(() => {
      const initial = { ...user };
      if (!initial.street && initial.address) {
          initial.street = initial.address;
      }
      return initial;
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwnProfile = user.id === currentUser.id;
  const canMasterEdit = currentUser.role === 'master';
  
  const getEditableStatus = (fieldName: keyof User | keyof User['socials']) => {
    if (canMasterEdit) return true;

    // Added detailed address fields to allow edits
    const nonSensitiveFields = [
        'phone', 'address', 'instagram', 'twitter', 'facebook', 'tiktok', 'lastfm', 'email',
        'street', 'number', 'complement', 'zipCode', 'city', 'state'
    ];
    
    if (isOwnProfile && currentUser.role === 'member') {
      return nonSensitiveFields.includes(fieldName as string);
    }
    if (currentUser.role === 'admin' && !isOwnProfile) {
       return nonSensitiveFields.includes(fieldName as string);
    }
    return false;
  };
  
  const canViewSensitive = useMemo(() => {
    if (currentUser.role === 'master' || isOwnProfile) return true;
    return false;
  }, [currentUser.role, isOwnProfile]);

  const handleFieldChange = (field: keyof User, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (field: keyof User['socials'], value: string) => {
    setUserData(prev => ({
      ...prev,
      socials: { ...prev.socials, [field]: value },
    }));
  };
  
  const handlePhotoClick = () => {
      if (isOwnProfile || canMasterEdit) {
          fileInputRef.current?.click();
      }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUserData(prev => ({ ...prev, profilePic: result }));
        // Propagate change upwards to sync with digital card
        if (onUpdateUser) {
            onUpdateUser({ profilePic: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const hasPendingChanges = user.pendingChanges && Object.keys(user.pendingChanges).length > 0;
  
  const showSaveChanges = isOwnProfile || canMasterEdit || (currentUser.role === 'admin' && !isOwnProfile);

  const renderProfileData = () => (
    <div className="space-y-6">
        <Section title="Meus Dados" hasPendingChanges={hasPendingChanges}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <ProfileField label="Nome Completo" value={userData.name} isEditable={getEditableStatus('name')} onChange={(v) => handleFieldChange('name', v)} />
              <ProfileField label="Data de Nascimento" value={userData.dob} isEditable={getEditableStatus('dob')} onChange={(v) => handleFieldChange('dob', v)} />
              {canViewSensitive && <ProfileField label="CPF" value={userData.cpf} isEditable={getEditableStatus('cpf')} onChange={(v) => handleFieldChange('cpf', v)} />}
              {canViewSensitive && <ProfileField label="RG" value={userData.rg} isEditable={getEditableStatus('rg')} onChange={(v) => handleFieldChange('rg', v)} />}
              
              {/* Email and Phone */}
              <ProfileField label="E-mail de Cadastro" value={userData.email} isEditable={getEditableStatus('email')} type="email" onChange={(v) => handleFieldChange('email', v)} />
              <ProfileField label="Telefone" value={userData.phone} isEditable={getEditableStatus('phone')} type="tel" onChange={(v) => handleFieldChange('phone', v)} />
              
              {/* Detailed Address Layout */}
              <div className="col-span-1 sm:col-span-2 mt-2 pt-4 border-t border-brand-gold/10 dark:border-dark-icon/20">
                  <h4 className="text-sm font-bold text-brand-text/70 dark:text-dark-text-soft/70 mb-4">Endereço Completo</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                       <div className="sm:col-span-2">
                           <ProfileField label="CEP" value={userData.zipCode || ''} isEditable={getEditableStatus('zipCode')} onChange={(v) => handleFieldChange('zipCode', v)} />
                       </div>
                       <div className="sm:col-span-4">
                            <ProfileField 
                                label="Rua" 
                                value={userData.street || ''} 
                                isEditable={getEditableStatus('street')} 
                                onChange={(v) => handleFieldChange('street', v)} 
                            />
                       </div>
                       <div className="sm:col-span-2">
                            <ProfileField label="Número" value={userData.number || ''} isEditable={getEditableStatus('number')} onChange={(v) => handleFieldChange('number', v)} />
                       </div>
                       <div className="sm:col-span-4">
                            <ProfileField label="Complemento" value={userData.complement || ''} isEditable={getEditableStatus('complement')} onChange={(v) => handleFieldChange('complement', v)} />
                       </div>
                       <div className="sm:col-span-4">
                           <ProfileField label="Cidade" value={userData.city} isEditable={getEditableStatus('city')} onChange={(v) => handleFieldChange('city', v)} />
                       </div>
                       <div className="sm:col-span-2">
                            <ProfileField label="Estado" value={userData.state} isEditable={getEditableStatus('state')} onChange={(v) => handleFieldChange('state', v)} />
                       </div>
                  </div>
              </div>
            </div>
        </Section>
      
        <Section title="Minhas Redes Sociais">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="flex items-center gap-3">
                      <InstagramIcon className="w-6 h-6 text-brand-accent dark:text-dark-icon" />
                      <ProfileField label="Instagram" value={userData.socials.instagram} isEditable={getEditableStatus('instagram')} onChange={(v) => handleSocialChange('instagram', v)} />
                  </div>
                   <div className="flex items-center gap-3">
                      <TwitterIcon className="w-6 h-6 text-brand-accent dark:text-dark-icon" />
                      <ProfileField label="Twitter/X" value={userData.socials.twitter} isEditable={getEditableStatus('twitter')} onChange={(v) => handleSocialChange('twitter', v)} />
                  </div>
                   <div className="flex items-center gap-3">
                      <FacebookIcon className="w-6 h-6 text-brand-accent dark:text-dark-icon" />
                      <ProfileField label="Facebook" value={userData.socials.facebook || ''} isEditable={getEditableStatus('facebook')} onChange={(v) => handleSocialChange('facebook', v)} />
                  </div>
                   <div className="flex items-center gap-3">
                      <TiktokIcon className="w-6 h-6 text-brand-accent dark:text-dark-icon" />
                      <ProfileField label="TikTok" value={userData.socials.tiktok || ''} isEditable={getEditableStatus('tiktok')} onChange={(v) => handleSocialChange('tiktok', v)} />
                  </div>
                   <div className="flex items-center gap-3">
                      <LastfmIcon className="w-6 h-6 text-brand-accent dark:text-dark-icon" />
                      <ProfileField label="Last.fm" value={userData.socials.lastfm || ''} isEditable={getEditableStatus('lastfm')} onChange={(v) => handleSocialChange('lastfm', v)} />
                  </div>
               </div>
          </Section>

        {showSaveChanges && (
            <div className="flex justify-end mt-6">
                <PrimaryButton type="submit">
                  {currentUser.role !== 'master' ? 'Enviar para Aprovação' : 'Salvar Alterações'}
                </PrimaryButton>
            </div>
        )}
    </div>
  );

  return (
    <div>
         <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            aria-hidden="true"
        />
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-brand-bg-light/50 dark:bg-dark-bg-secondary/70 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6">
            <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
                <img src={userData.profilePic} alt={`Foto de ${userData.name}`} className="w-24 h-24 rounded-full object-cover ring-4 ring-brand-gold/50 dark:ring-dark-accent/50" />
                { (isOwnProfile || canMasterEdit) && (
                     <>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <button className="absolute bottom-0 right-0 bg-brand-text dark:bg-dark-accent text-white rounded-full p-1.5 hover:opacity-80 transition-opacity shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                        </button>
                    </>
                )}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-brand-text dark:text-dark-accent">{userData.name}</h2>
              <p className="text-sm text-brand-text/70 dark:text-dark-text-soft">ID: {userData.id}</p>
               {hasPendingChanges && !isOwnProfile && (
                <div className="mt-2 text-xs font-semibold bg-yellow-200 text-yellow-800 px-2 py-1 rounded-md inline-block">
                  Aprovação Pendente
                </div>
              )}
            </div>
        </div>
      
       {renderProfileData()}
    </div>
  );
};
