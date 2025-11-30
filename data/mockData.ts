export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: 'master' | 'admin' | 'member' | 'assistant';
  subtitle?: string; // Novo campo para "Equipe Wanessa"
  rg: string;
  cpf: string;
  phone: string;
  dob: string; // Format: DD/MM/YYYY
  address: string; 
  street?: string;
  number?: string;
  complement?: string;
  zipCode?: string;
  city: string;
  state: string;
  registrationDate: string; // YYYY-MM-DD
  socials: {
    instagram: string;
    twitter: string;
    facebook?: string;
    tiktok?: string;
    lastfm?: string;
  };
  profilePic: string;
  cardId: string;
  status: 'Ativo' | 'Pendente' | 'Desativado';
  pendingChanges?: Partial<User>; 
  whatsapp?: string;
  mustChangePassword?: boolean; 
  resetToken?: string; 
  camarimManualBlock?: {
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
  };
  lastModified?: number; 
  hasAcceptedTerms?: boolean;
  hasMetWanessa?: 'Sim' | 'Não' | 'Não informado';
  termsAcceptedAt?: string; // ISO string for when terms were accepted
}

export interface GiveawayEntry {
  id: string;
  userId: string;
  userName: string;
  userCardId: string;
  category: string;
  drawName: string;
  registrationDate: string;
  status?: 'pending' | 'won' | 'lost';
  isPublicWinner?: boolean;
}

export interface CamarimWinner {
    id: string;
    winnerId: string;
    winnerName: string;
    winnerProfilePic: string;
    drawDate: string; // YYYY-MM-DD
    registeredBy: string; // ID of master/admin
    observations?: string;
}

export interface AuditLogEntry {
    id: string;
    timestamp: string; // ISO string
    responsibleAdminId: string;
    responsibleAdminName: string;
    targetUserId: string;
    targetUserName: string;
    action: string;
    details: string; 
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'result' | 'announcement' | 'warning' | 'update';
  date: string; // ISO string
  read: boolean;
  targetUserId?: string; 
  link?: string;
}

export interface ContactMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  timestampSent: string; // ISO string
  status: 'Não Lida' | 'Lida' | 'Respondida';
  responseContent?: string;
  responseTimestamp?: string; // ISO string
  responderId?: string;
  responderName?: string;
}

export const TEMP_PASSWORD = 'WNews@2025!';
const STORAGE_KEY = 'wnews_auth_v24_DATA_RESET'; // Key updated to force reload
const defaultProfilePic = 'https://i.ibb.co/GcLf0Vz/heitor-2.png';

const usedIds = new Set<string>();
const generateId = (): string => {
    let id;
    do {
        id = `WC${Math.floor(100000 + Math.random() * 900000)}`;
    } while (usedIds.has(id));
    usedIds.add(id);
    return id;
};

const defaultUsers: User[] = [
  // Administradores e Master
  {
    id: 'WC291843',
    email: 'heitor.lima@wnews.com',
    password: TEMP_PASSWORD,
    name: 'Heitor Pinheiro Lima',
    role: 'master',
    rg: 'Não informado',
    cpf: 'Não informado',
    phone: '11983802055',
    dob: '13/07/1993',
    address: 'Não informado', city: 'São Paulo', state: 'SP',
    registrationDate: '2025-01-01',
    socials: { instagram: '@heitorpinheiro.art', twitter: '@heitorpinheiro' },
    profilePic: 'https://i.ibb.co/C0v1b2y/Design-sem-nome-11.png',
    cardId: 'WC291843', status: 'Ativo', mustChangePassword: true,
    hasAcceptedTerms: false, hasMetWanessa: 'Não informado',
  },
  {
    id: 'WC502911',
    name: 'Lucas Rocha de Oliveira',
    email: 'luquinhasrocha@hotmail.com',
    dob: '06/08/1992',
    cpf: '409.506.718-78',
    phone: '11999115081',
    address: 'Trav. Dr. Jose Nunes de Almeida Prado, 21 - Jardim',
    socials: { instagram: '@lucas.rocha0692', twitter: '@lucasrochad', facebook: '', tiktok: '', lastfm: '' },
    role: 'admin',
    rg: 'Não informado', city: '', state: '',
    registrationDate: '2025-10-15', password: TEMP_PASSWORD, mustChangePassword: true,
    profilePic: defaultProfilePic, cardId: 'WC502911', status: 'Ativo',
    hasAcceptedTerms: false, hasMetWanessa: 'Não informado',
  },
  {
    id: 'WC813452',
    email: 'lis.gomes@wnews.com',
    password: TEMP_PASSWORD,
    name: 'Lis Gomes',
    role: 'admin',
    subtitle: 'Equipe Wanessa',
    rg: 'Não informado', cpf: 'Não informado', phone: 'Não informado', dob: 'Não informado',
    address: 'Não informado', city: 'Não informado', state: 'Não informado',
    registrationDate: '2025-01-01',
    socials: { instagram: '', twitter: '' },
    profilePic: defaultProfilePic, cardId: 'WC813452', status: 'Ativo', mustChangePassword: true,
    hasAcceptedTerms: false, hasMetWanessa: 'Não informado',
  },
  {
    id: 'WC112233',
    email: 'assistente@wnews.com',
    password: TEMP_PASSWORD,
    name: 'Carlos Assistente',
    role: 'assistant',
    rg: 'Não informado', cpf: 'Não informado', phone: 'Não informado', dob: 'Não informado',
    address: 'Não informado', city: 'Não informado', state: 'Não informado',
    registrationDate: '2025-01-01',
    socials: { instagram: '', twitter: '' },
    profilePic: defaultProfilePic, cardId: 'WC112233', status: 'Ativo', mustChangePassword: true,
    hasAcceptedTerms: false, hasMetWanessa: 'Não informado',
  },
  // Membros da Planilha
  {
    id: generateId(),
    name: 'Clicilane Melhorini Araújo',
    email: 'clicilane@gmail.com',
    dob: '31/01/1983',
    cpf: '296.554.548-84',
    phone: '13996260359',
    address: 'Rua Alberto Santos Dumont, 576 ap 16 Guilhermina',
    socials: { instagram: '@nanim', twitter: '', facebook: 'Clicilane Melhorini', tiktok: '', lastfm: '' },
    role: 'member',
    rg: 'Não informado', city: 'Guilhermina', state: '',
    registrationDate: '2025-10-17', password: TEMP_PASSWORD, mustChangePassword: true,
    profilePic: defaultProfilePic, cardId: usedIds.values().next().value, status: 'Ativo',
    hasAcceptedTerms: false, hasMetWanessa: 'Não informado',
  },
  {
    id: generateId(),
    name: 'Alessandro de Menezes',
    email: 'alessandrospte@msn.com',
    dob: '17/12/1987',
    cpf: '350.717.848-66',
    phone: '',
    address: 'Avenida João de Souza Franco 31 Mogi das Cruzes',
    socials: { instagram: '@Alle_menezeson', twitter: '', facebook: '', tiktok: '', lastfm: '' },
    role: 'member',
    rg: 'Não informado', city: 'Mogi das Cruzes', state: '',
    registrationDate: '2025-10-17', password: TEMP_PASSWORD, mustChangePassword: true,
    profilePic: defaultProfilePic, cardId: usedIds.values().next().value, status: 'Ativo',
    hasAcceptedTerms: false, hasMetWanessa: 'Não informado',
  },
  {
    id: generateId(),
    name: 'William Honorato Fiebig',
    email: 'williamvga@hotmail.com',
    dob: '28/01/1983',
    cpf: '061.452.496-25',
    phone: '11958421082',
    address: 'Rua Maria Nazaro da Silva 407, Freguesia do ó, São Paulo SP 02809-060',
    socials: { instagram: '', twitter: '', facebook: 'William Fiebig', tiktok: '', lastfm: '' },
    role: 'member',
    rg: 'Não informado', city: 'São Paulo', state: 'SP',
    registrationDate: '2025-10-17', password: TEMP_PASSWORD, mustChangePassword: true,
    profilePic: defaultProfilePic, cardId: usedIds.values().next().value, status: 'Ativo',
    hasAcceptedTerms: false, hasMetWanessa: 'Não informado',
  },
   {
    id: generateId(),
    name: 'Fabiano Quinonez Sirque',
    email: 'fabiano.torino16@gmail.com',
    dob: '28/04/1993',
    cpf: '045.516.661-73',
    phone: '67992378914',
    address: 'Rua Danilo Gustavo Vilhalva Paixão 1110',
    socials: { instagram: '@fabianoqsiqueira', twitter: '', facebook: '', tiktok: '', lastfm: '' },
    role: 'member',
    rg: 'Não informado', city: '', state: '',
    registrationDate: '2025-10-17', password: TEMP_PASSWORD, mustChangePassword: true,
    profilePic: defaultProfilePic, cardId: usedIds.values().next().value, status: 'Ativo',
    hasAcceptedTerms: false, hasMetWanessa: 'Não informado',
  },
  {
    id: generateId(),
    name: 'Erikzedek frança Silva',
    email: 'erikzedek@hotmail.com',
    dob: '01/04/1997',
    cpf: '469.324.658-17',
    phone: '11985201617',
    address: 'Travessa 5 de maio n 73 Piraporinha diadema - sac',
    socials: { instagram: '@erikzedek', twitter: '', facebook: '', tiktok: '', lastfm: '' },
    role: 'member',
    rg: 'Não informado', city: 'Diadema', state: 'SP',
    registrationDate: '2025-10-16', password: TEMP_PASSWORD, mustChangePassword: true,
    profilePic: defaultProfilePic, cardId: usedIds.values().next().value, status: 'Ativo',
    hasAcceptedTerms: false, hasMetWanessa: 'Não informado',
  },
  {
    id: generateId(),
    name: 'Patricia valerio de Farias',
    email: 'pathyfarias73@gmail.com',
    dob: '17/08/1973',
    cpf: '255.746.178-46',
    phone: '11970672771',
    address: 'Rua Epitácio pessoa 170 - centro Diadema SP',
    socials: { instagram: '@pathyfarias_valerio', twitter: '', facebook: '', tiktok: '', lastfm: '' },
    role: 'member',
    rg: 'Não informado', city: 'Diadema', state: 'SP',
    registrationDate: '2025-10-16', password: TEMP_PASSWORD, mustChangePassword: true,
    profilePic: defaultProfilePic, cardId: usedIds.values().next().value, status: 'Ativo',
    hasAcceptedTerms: false, hasMetWanessa: 'Não informado',
  },
  {
    id: generateId(),
    name: 'João Mateus Santos',
    email: 'joao_matheus_21@hotmail.com',
    dob: '12/09/1993',
    cpf: '419.100.778-52',
    phone: '11981805158',
    address: 'Rua Newton Braga 179, Vila Maria São Paulo',
    socials: { instagram: '@matheus01993', twitter: '', facebook: '', tiktok: '', lastfm: '' },
    role: 'member',
    rg: 'Não informado', city: 'São Paulo', state: 'SP',
    registrationDate: '2025-10-16', password: TEMP_PASSWORD, mustChangePassword: true,
    profilePic: defaultProfilePic, cardId: usedIds.values().next().value, status: 'Ativo',
    hasAcceptedTerms: false, hasMetWanessa: 'Não informado',
  },
   {
    id: generateId(),
    name: 'Jefferson William dos Santos',
    email: 'isjefferson20@gmail.com',
    dob: '21/07/1988',
    cpf: '340.114.338-70',
    phone: '19992541639',
    address: 'R. Ática, 673 - Vila Alexandria, São Paulo - SP',
    socials: { instagram: '@Jefferson_santos_br20', twitter: '', facebook: '', tiktok: '', lastfm: '' },
    role: 'member',
    rg: 'Não informado', city: 'São Paulo', state: 'SP',
    registrationDate: '2025-10-16', password: TEMP_PASSWORD, mustChangePassword: true,
    profilePic: defaultProfilePic, cardId: usedIds.values().next().value, status: 'Ativo',
    hasAcceptedTerms: false, hasMetWanessa: 'Não informado',
  },
  {
    id: generateId(),
    name: 'Antonio Wanderson Pinheiro',
    email: 'guerreirowanderson8@gmail.com',
    dob: '09/02/1985',
    cpf: '019.814.973-58',
    phone: '85999401046',
    address: 'Travessa Osório de Paiva 65',
    socials: { instagram: '', twitter: '', facebook: 'Antonio Wanderson Pinheiro', tiktok: '', lastfm: '' },
    role: 'member',
    rg: 'Não informado', city: '', state: '',
    registrationDate: '2025-10-16', password: TEMP_PASSWORD, mustChangePassword: true,
    profilePic: defaultProfilePic, cardId: usedIds.values().next().value, status: 'Ativo',
    hasAcceptedTerms: false, hasMetWanessa: 'Não informado',
  },
   {
    id: generateId(),
    name: 'Tâmara Ferreira Marques',
    email: 'tamfmarques@gmail.com',
    dob: '20/05/1988',
    cpf: '364.777.078-70',
    phone: '11952257328',
    address: 'Av. Circular, 579, Recanto da Prata, Jundiaí/SP',
    socials: { instagram: '@tammarques___', twitter: '', facebook: '', tiktok: '', lastfm: '' },
    role: 'member',
    rg: 'Não informado', city: 'Jundiaí', state: 'SP',
    registrationDate: '2025-10-15', password: TEMP_PASSWORD, mustChangePassword: true,
    profilePic: defaultProfilePic, cardId: usedIds.values().next().value, status: 'Ativo',
    hasAcceptedTerms: false, hasMetWanessa: 'Não informado',
  },
  {
    id: generateId(),
    name: 'Ananda Amaral Santos',
    email: 'cdanandasantos@gmail.com',
    dob: '15/04/1990',
    cpf: '037.387.621-16',
    phone: '62999657630',
    address: 'Av Maranhão. Qd 67 lote 12. Residencial solar do B',
    socials: { instagram: '@asantosananda', twitter: '', facebook: '', tiktok: '', lastfm: '' },
    role: 'member',
    rg: 'Não informado', city: '', state: '',
    registrationDate: '2025-10-15', password: TEMP_PASSWORD, mustChangePassword: true,
    profilePic: defaultProfilePic, cardId: usedIds.values().next().value, status: 'Ativo',
    hasAcceptedTerms: false, hasMetWanessa: 'Não informado',
  },
   {
    id: generateId(),
    name: 'Kauber Mansur Irffi Junior',
    email: 'kaubermansur@outlook.com',
    dob: '23/09/1995',
    cpf: '112.038.186-02',
    phone: '31992526161',
    address: 'Rua Montes Claros, 1060 / 301 - Anchieta, Belo Horizonte',
    socials: { instagram: '@kaubermansur', twitter: '', facebook: '', tiktok: '', lastfm: '' },
    role: 'member',
    rg: 'Não informado', city: 'Belo Horizonte', state: 'MG',
    registrationDate: '2025-10-15', password: TEMP_PASSWORD, mustChangePassword: true,
    profilePic: defaultProfilePic, cardId: usedIds.values().next().value, status: 'Ativo',
    hasAcceptedTerms: false, hasMetWanessa: 'Não informado',
  },
  {
    id: generateId(),
    name: 'Leandro Luís Barcasse Moretto',
    email: 'leandro.moretto@hotmail.com',
    dob: '20/03/1978',
    cpf: '246.083.018-10',
    phone: '13991913958',
    address: 'Rua Santa Rita de Cássia 842, Maracanã, Praia Grande',
    socials: { instagram: '@leandromorettoficial', twitter: '', facebook: '', tiktok: '', lastfm: '' },
    role: 'member',
    rg: 'Não informado', city: 'Praia Grande', state: 'SP',
    registrationDate: '2025-10-18', password: TEMP_PASSWORD, mustChangePassword: true,
    profilePic: defaultProfilePic, cardId: usedIds.values().next().value, status: 'Ativo',
    hasAcceptedTerms: false, hasMetWanessa: 'Não informado',
  },
   {
    id: generateId(),
    name: 'Fabio da Silva Vieira',
    email: 'fahbinhu.bs@gmail.com',
    dob: '12/09/1992',
    cpf: '408.106.268-45',
    phone: '11969067280',
    address: 'rua Sylvio, 234 São Bernardo do Campo',
    socials: { instagram: '@itsfahbinhu', twitter: '', facebook: '', tiktok: '', lastfm: '' },
    role: 'member',
    rg: 'Não informado', city: 'São Bernardo do Campo', state: 'SP',
    registrationDate: '2025-11-14', password: TEMP_PASSWORD, mustChangePassword: true,
    profilePic: defaultProfilePic, cardId: usedIds.values().next().value, status: 'Ativo',
    hasAcceptedTerms: false, hasMetWanessa: 'Não informado',
  },
  {
    id: generateId(),
    name: 'Bruno Henrique Ribeiro',
    email: 'bruno.ribeiro84@yahoo.com.br',
    dob: '31/10/1984',
    cpf: '063.392.016-95',
    phone: '35999167143',
    address: 'Avenida Manoel Augusto da Silva,615, Bairro: Resic',
    socials: { instagram: '@bruno.ribeiro84', twitter: '', facebook: '', tiktok: '', lastfm: '' },
    role: 'member',
    rg: 'Não informado', city: '', state: '',
    registrationDate: '2025-11-17', password: TEMP_PASSWORD, mustChangePassword: true,
    profilePic: defaultProfilePic, cardId: usedIds.values().next().value, status: 'Ativo',
    hasAcceptedTerms: false, hasMetWanessa: 'Não informado',
  },
  {
    id: generateId(),
    name: 'João Paulo Toledo',
    email: 'toledojp85@gmail.com',
    dob: '05/10/1985',
    cpf: '071.836.836-30',
    phone: '11987598803',
    address: 'Coronel Albino Bairao 437-2506, SP - Belenzinho',
    socials: { instagram: '@jpjoaopauloto', twitter: '', facebook: '', tiktok: '', lastfm: '' },
    role: 'member',
    rg: 'Não informado', city: 'São Paulo', state: 'SP',
    registrationDate: '2025-11-25', password: TEMP_PASSWORD, mustChangePassword: true,
    profilePic: defaultProfilePic, cardId: usedIds.values().next().value, status: 'Ativo',
    hasAcceptedTerms: false, hasMetWanessa: 'Não informado',
  },
];


// STORAGE MANAGEMENT
let currentUsers: User[] = [...defaultUsers];
try {
  const storedUsers = localStorage.getItem(STORAGE_KEY);
  if (storedUsers) {
    const parsedUsers = JSON.parse(storedUsers);
    if (Array.isArray(parsedUsers) && parsedUsers.length > 0 && parsedUsers[0].id) {
        currentUsers = parsedUsers;
    } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    }
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  }
} catch (error) {
  console.error("Failed to load or parse users from localStorage:", error);
  currentUsers = [...defaultUsers];
}

export let mockUsers: User[] = currentUsers;

export const saveUsersToStorage = (users: User[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Failed to save users to localStorage:", error);
  }
};

export const updateUserInStorage = (updatedUser: Partial<User> & { id: string }) => {
    // FIX: This function is now atomic. It reads the latest state from storage,
    // applies the update, and then saves it back. This prevents race conditions
    // where one update overwrites another.
    const currentStorageUsers = refreshUsersFromStorage();
    
    const userIndex = currentStorageUsers.findIndex(u => u.id === updatedUser.id);
    
    if (userIndex !== -1) {
        const existingUser = currentStorageUsers[userIndex];
        
        // Merge the incoming changes ONTO the latest version from storage.
        const fullyUpdatedUser = { 
            ...existingUser, 
            ...updatedUser, 
            lastModified: Date.now() 
        };
        
        currentStorageUsers[userIndex] = fullyUpdatedUser;
        mockUsers = currentStorageUsers; // Keep module state in sync
        saveUsersToStorage(mockUsers);
    } else {
        console.warn(`User with ID ${updatedUser.id} not found for update.`);
    }
};

export const refreshUsersFromStorage = (): User[] => {
    try {
        const storedUsers = localStorage.getItem(STORAGE_KEY);
        if (storedUsers) {
            const parsed = JSON.parse(storedUsers);
            if (Array.isArray(parsed)) {
                mockUsers = parsed; 
                return parsed;
            }
        }
    } catch (error) {
        console.error("Error refreshing users from storage:", error);
    }
    return mockUsers;
};

// MOCK DATA (to be replaced by API calls)
export let mockGiveawayEntries: GiveawayEntry[] = [];

export let mockCamarimWinners: CamarimWinner[] = [
    {
        id: 'CAMARIM-001',
        winnerId: 'MEMBER-003',
        winnerName: 'Ana Silva',
        winnerProfilePic: 'https://i.ibb.co/GcLf0Vz/heitor-2.png',
        drawDate: '2024-05-10',
        registeredBy: 'MASTER-001',
        observations: 'Sorteio realizado no show de São Paulo.'
    }
];

export let mockAuditLog: AuditLogEntry[] = [];

export let mockNotifications: Notification[] = [
    {
      id: 'notif-1',
      title: 'Bem-vindo ao Novo App W News!',
      message: 'Explore todas as funcionalidades, personalize seu perfil e participe das nossas atividades exclusivas.',
      type: 'announcement',
      date: '2025-07-20T10:00:00Z',
      read: false,
    },
];

export let mockContactMessages: ContactMessage[] = [
    {
        id: 'MSG-001',
        senderId: 'WC012345',
        senderName: 'Ana Silva',
        senderEmail: 'ana.silva@email.com',
        subject: 'Dúvida sobre Sorteio',
        message: 'Olá! Gostaria de saber quando será o próximo sorteio para o show de Belo Horizonte. Obrigada!',
        timestampSent: new Date('2025-07-25T10:30:00Z').toISOString(),
        status: 'Não Lida',
    }
];


export const getCamarimStatus = (user: User) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let automaticBlockEndDate: Date | null = null;
    const lastWin = mockCamarimWinners
        .filter(w => w.winnerId === user.id)
        .sort((a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime())[0];

    if (lastWin) {
        const date = new Date(lastWin.drawDate + 'T00:00:00');
        date.setMonth(date.getMonth() + 6);
        automaticBlockEndDate = date;
    }

    let manualBlockEndDate: Date | null = null;
    if (user.camarimManualBlock?.endDate) {
        manualBlockEndDate = new Date(user.camarimManualBlock.endDate + 'T00:00:00');
    }

    const finalBlockEndDate = [automaticBlockEndDate, manualBlockEndDate]
        .filter((d): d is Date => d !== null) 
        .sort((a, b) => b.getTime() - a.getTime())[0] || null;

    if (finalBlockEndDate && finalBlockEndDate >= today) {
        return {
            status: 'Bloqueado',
            releaseDate: finalBlockEndDate.toLocaleDateString('pt-BR'),
            isBlocked: true,
        };
    }

    return {
        status: 'Elegível',
        isBlocked: false,
    };
};
export function addUserToStorage(newUser: Omit<User, 'id' | 'password' | 'mustChangePassword' | 'status' | 'cardId' | 'registrationDate' | 'profilePic'>): User {
  const fullUser: User = {
    ...newUser,
    id: generateId(),
    password: TEMP_PASSWORD,
    mustChangePassword: true,
    status: 'Ativo',
    cardId: generateId(), 
    registrationDate: new Date().toISOString().split('T')[0],
    profilePic: defaultProfilePic,
  };

  mockUsers.push(fullUser);
  saveUsersToStorage(mockUsers);
  return fullUser;
}