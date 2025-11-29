export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: 'master' | 'admin' | 'member';
  rg: string;
  cpf: string;
  phone: string;
  dob: string; // Format: DD/MM/YYYY
  address: string; // Legacy field, kept for backward compatibility
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
  mustChangePassword?: boolean; // New field to force password change
  resetToken?: string; // Token for password recovery link
  camarimManualBlock?: {
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
  };
  lastModified?: number; // Timestamp for cache busting and sync
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
  targetUserId?: string; // If undefined, it's for everyone. If defined, only for that user.
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

// CRITICAL: GLOBAL TEMP PASSWORD CONFIGURATION
export const TEMP_PASSWORD = 'WNews@2025!';

// CRITICAL: STORAGE KEY UPDATE TO v23_DEFINITIVE_STABLE
// This key change forces a fresh load of the default users with the correct password, fixing persistence issues.
// DO NOT CHANGE THIS KEY AGAIN to ensure user data (like changed passwords) is not lost on future deployments.
const STORAGE_KEY = 'wnews_auth_v23_DEFINITIVE_STABLE';

const defaultUsers: User[] = [
  // 1. PRESIDENTE (MASTER)
  {
    id: 'MASTER-001',
    email: 'heitor.lima@wnews.com',
    password: TEMP_PASSWORD,
    name: 'Heitor Pinheiro Lima',
    role: 'master',
    rg: '00.000.000-0',
    cpf: '393.467.778-93',
    phone: '11983802055',
    dob: '13/07/1993',
    address: 'Rua Jaciara, 18A, Jardim Damasceno',
    street: 'Rua Jaciara',
    number: '18A',
    complement: 'Jardim Damasceno',
    zipCode: '02878-000',
    city: 'São Paulo',
    state: 'SP',
    registrationDate: '2025-01-01',
    socials: { instagram: '@heitorpinheiro.art', twitter: '@heitorpinheiro' },
    profilePic: 'https://i.ibb.co/C0v1b2y/Design-sem-nome-11.png',
    cardId: 'W001-MASTER',
    status: 'Ativo',
    whatsapp: 'https://wa.me/5511983802055',
    mustChangePassword: true,
  },
  // 2. VICE-PRESIDENTE (ADMIN)
  {
    id: 'ADMIN-002',
    email: 'jessica.martins@wnews.com',
    password: TEMP_PASSWORD,
    name: 'Jéssica Martins',
    role: 'admin',
    rg: '11.111.111-1',
    cpf: '111.111.111-11',
    phone: '21999999999',
    dob: '15/05/1990',
    address: 'Rua Exemplo, 456, Rio de Janeiro',
    street: 'Rua Exemplo',
    number: '456',
    zipCode: '20000-000',
    city: 'Rio de Janeiro',
    state: 'RJ',
    registrationDate: '2025-01-01',
    socials: { instagram: '@jessicamartins', twitter: '@jessicamartins' },
    profilePic: 'https://i.ibb.co/GcLf0Vz/heitor-2.png',
    cardId: 'W002-ADMIN',
    status: 'Ativo',
    whatsapp: 'https://wa.me/5521999999999',
    mustChangePassword: true,
  },
  // 3. MEMBRO ATIVO (PARA TESTES)
  {
    id: 'MEMBER-003',
    email: 'ana.silva@email.com',
    password: 'password123',
    name: 'Ana Silva',
    role: 'member',
    rg: '22.222.222-2',
    cpf: '222.222.222-22',
    phone: '11988888888',
    dob: '20/10/1995',
    address: 'Avenida Principal, 789, São Paulo',
    street: 'Avenida Principal',
    number: '789',
    zipCode: '01000-000',
    city: 'São Paulo',
    state: 'SP',
    registrationDate: '2025-02-15',
    socials: { instagram: '@anasilva', twitter: '@anasilva' },
    profilePic: 'https://i.ibb.co/GcLf0Vz/heitor-2.png',
    cardId: 'W003-MEMBER',
    status: 'Ativo',
    pendingChanges: {
      phone: '11988888887',
      socials: {
        instagram: '@anasilva_nova',
        // FIX: Added missing 'twitter' property to conform to the User['socials'] type.
        twitter: '@anasilva'
      }
    }
  },
   // 4. MEMBRO PENDENTE
  {
    id: 'MEMBER-004',
    email: 'carlos.souza@email.com',
    password: 'password123',
    name: 'Carlos Souza',
    role: 'member',
    rg: '33.333.333-3',
    cpf: '333.333.333-33',
    phone: '31977777777',
    dob: '05/03/1988',
    address: 'Rua dos Sonhos, 101, Belo Horizonte',
    street: 'Rua dos Sonhos',
    number: '101',
    zipCode: '30000-000',
    city: 'Belo Horizonte',
    state: 'MG',
    registrationDate: '2025-03-01',
    socials: { instagram: '@carlossouza', twitter: '@carlossouza' },
    profilePic: 'https://i.ibb.co/GcLf0Vz/heitor-2.png',
    cardId: 'W004-MEMBER',
    status: 'Pendente',
  },
];

// Initializing mock data from LocalStorage or using defaults
let currentUsers: User[] = [...defaultUsers];
try {
  const storedUsers = localStorage.getItem(STORAGE_KEY);
  if (storedUsers) {
    const parsedUsers = JSON.parse(storedUsers);
    // Basic validation to prevent corrupted data from breaking the app
    if (Array.isArray(parsedUsers) && parsedUsers.length > 0 && parsedUsers[0].id) {
        currentUsers = parsedUsers;
    } else {
        // Stored data is invalid, fall back to defaults and save it
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    }
  } else {
    // No stored data, save the defaults
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  }
} catch (error) {
  console.error("Failed to load or parse users from localStorage:", error);
  // Fallback to default users in case of any error
  currentUsers = [...defaultUsers];
}

export let mockUsers: User[] = currentUsers;

// Function to save the entire user array to LocalStorage
export const saveUsersToStorage = (users: User[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Failed to save users to localStorage:", error);
  }
};

// Function to update a single user and persist
export const updateUserInStorage = (updatedUser: User) => {
    const userIndex = mockUsers.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
        // Add timestamp for cache busting on gallery
        const userWithTimestamp = { ...updatedUser, lastModified: Date.now() };
        mockUsers[userIndex] = userWithTimestamp;
        saveUsersToStorage(mockUsers);
    } else {
        console.warn(`User with ID ${updatedUser.id} not found for update.`);
    }
};

// Function to get the latest user data from storage
// This is crucial for components that need the absolute latest state, like the login validation.
export const refreshUsersFromStorage = (): User[] => {
    try {
        const storedUsers = localStorage.getItem(STORAGE_KEY);
        if (storedUsers) {
            const parsed = JSON.parse(storedUsers);
            if (Array.isArray(parsed)) {
                mockUsers = parsed; // Update the in-memory array as well
                return parsed;
            }
        }
    } catch (error) {
        console.error("Error refreshing users from storage:", error);
    }
    // Fallback to the current in-memory version if storage fails
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
     {
      id: 'notif-2',
      title: 'Aviso Importante: Atualize Seus Dados',
      message: 'Para garantir que você não perca nenhuma novidade ou sorteio, por favor, revise e atualize seus dados cadastrais na seção "Meu Perfil".',
      type: 'warning',
      date: '2025-07-21T11:00:00Z',
      read: true, // Example of a read notification
    },
    {
      id: 'notif-3',
      title: 'Resultado do Sorteio "Show SP"',
      message: 'O resultado do sorteio para o show de São Paulo já está disponível! Confira se você foi um dos ganhadores.',
      type: 'result',
      date: '2025-07-22T15:30:00Z',
      read: false,
      targetUserId: 'MEMBER-003', // Specific to Ana Silva
    }
];

export let mockContactMessages: ContactMessage[] = [
    {
        id: 'MSG-001',
        senderId: 'MEMBER-003',
        senderName: 'Ana Silva',
        senderEmail: 'ana.silva@email.com',
        subject: 'Dúvida sobre Sorteio',
        message: 'Olá! Gostaria de saber quando será o próximo sorteio para o show de Belo Horizonte. Obrigada!',
        timestampSent: new Date('2025-07-25T10:30:00Z').toISOString(),
        status: 'Não Lida',
    }
];

/**
 * Determines a user's eligibility for camarim lotteries.
 * It considers both automatic blocks (from winning) and manual blocks (set by an admin).
 * The most restrictive block (latest end date) is applied.
 * @param user The user object to check.
 * @returns An object with the eligibility status and release date if blocked.
 */
export const getCamarimStatus = (user: User) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day for accurate comparison

    let automaticBlockEndDate: Date | null = null;
    const lastWin = mockCamarimWinners
        .filter(w => w.winnerId === user.id)
        .sort((a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime())[0];

    if (lastWin) {
        // Use 'T00:00:00' to avoid timezone issues with date parsing
        const date = new Date(lastWin.drawDate + 'T00:00:00');
        date.setMonth(date.getMonth() + 6);
        automaticBlockEndDate = date;
    }

    let manualBlockEndDate: Date | null = null;
    if (user.camarimManualBlock?.endDate) {
        manualBlockEndDate = new Date(user.camarimManualBlock.endDate + 'T00:00:00');
    }

    // Find the latest block date among all possible blocks
    const finalBlockEndDate = [automaticBlockEndDate, manualBlockEndDate]
        .filter((d): d is Date => d !== null) // Type guard to filter out nulls
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