
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
  // Updated: pendingChanges can now include profilePic
  pendingChanges?: Partial<User>; 
  whatsapp?: string;
  mustChangePassword?: boolean; // New field to force password change
  resetToken?: string; // Token for password recovery link
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

export interface OuvidoriaMessage {
    id: string;
    author: 'member' | 'admin';
    text: string;
    timestamp: string; // ISO string
}

export type OuvidoriaTicketType = 'Sugestão' | 'Reclamação' | 'Elogio' | 'Dúvida' | 'Outro';

export interface OuvidoriaTicket {
    id: string;
    memberId: string; // This is kept for linking, but NEVER displayed to admins.
    subject: string;
    type: OuvidoriaTicketType;
    messages: OuvidoriaMessage[];
    status: 'Pendente' | 'Respondida' | 'Resolvida';
    createdAt: string; // ISO string
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

// Default temporary password for all imported users
export const TEMP_PASSWORD = 'Wnews@2025';

const defaultUsers: User[] = [
  // 1. PRESIDENTE (MASTER)
  {
    id: 'MASTER-001',
    email: 'heitor.lima@wnews.com', // Institutional email
    password: 'Wnews@2025', // Senha resetada para o padrão
    name: 'Heitor Pinheiro Lima',
    role: 'master',
    rg: '00.000.000-0', // Placeholder, update via edit
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
    registrationDate: '2025-10-15',
    socials: {
      instagram: '@heitorpinheirolima',
      twitter: '@eusouheitorlima',
      facebook: 'heitorpinheirolima'
    },
    profilePic: 'https://ui-avatars.com/api/?name=Heitor+Lima&background=CDBA9A&color=fff',
    cardId: 'WC-MASTER-001',
    status: 'Ativo',
    whatsapp: 'https://wa.me/5511983802055',
    mustChangePassword: true
  },
  // 2. VICE-PRESIDENTE (ADMIN)
  {
    id: 'ADMIN-001',
    email: 'lucas.oliveira@wnews.com', // Institutional email
    password: TEMP_PASSWORD,
    name: 'Lucas Rocha de Oliveira',
    role: 'admin',
    rg: '00.000.000-0', // Placeholder
    cpf: '409.506.718-78',
    phone: '11999115081',
    dob: '06/08/1992',
    address: 'Trav. Dr. Jose Nunes de Almeida Prado, 21',
    street: 'Trav. Dr. Jose Nunes de Almeida Prado',
    number: '21',
    complement: '',
    zipCode: '04810-040',
    city: 'São Paulo',
    state: 'SP',
    registrationDate: '2025-10-15',
    socials: {
      instagram: '@lucas.rocha0692',
      twitter: '@lucasrochadeo12'
    },
    profilePic: 'https://ui-avatars.com/api/?name=Lucas+Rocha&background=3C3633&color=fff',
    cardId: 'WC-ADMIN-001',
    status: 'Ativo',
    whatsapp: 'https://wa.me/5511999115081',
    mustChangePassword: true
  },
  // 3. GENERAL MEMBERS (Imported from List)
  {
    id: 'WC-100',
    email: 'clicilane@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Clicilane Melhorini Araújo Casonato',
    role: 'member',
    rg: '',
    cpf: '2965545484',
    phone: '13 996260359',
    dob: '31/01/1983',
    address: 'Rua Alberto Santos Dumont,576 ap 16 Guilhermina',
    city: 'Praia Grande',
    state: 'SP',
    registrationDate: '2025-10-17',
    socials: { instagram: 'nanimelhorini', twitter: 'clicilanem', facebook: 'Clicilane Melhorini' },
    profilePic: 'https://ui-avatars.com/api/?name=Clicilane+Araujo',
    cardId: 'WC-100',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-101',
    email: 'alessandrospte@msn.com',
    password: TEMP_PASSWORD,
    name: 'Alessandro', // Name incomplete in source, using placeholder
    role: 'member',
    rg: '',
    cpf: '35071784866',
    phone: '11986900288',
    dob: '17/12/1987',
    address: 'Avenida João de Souza Franco 31',
    city: 'Mogi das Cruzes',
    state: 'SP',
    registrationDate: '2025-10-17',
    socials: { instagram: '', twitter: 'Alle_menezeson' },
    profilePic: 'https://ui-avatars.com/api/?name=Alessandro',
    cardId: 'WC-101',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-102',
    email: 'williamvga@hotmail.com',
    password: TEMP_PASSWORD,
    name: 'William Honorato Fiebig',
    role: 'member',
    rg: '',
    cpf: '06145249625',
    phone: '11958421082',
    dob: '28/01/1983',
    address: 'Rua Maria Nazaro da Silva 407, Freguesia do ó',
    city: 'São Paulo',
    state: 'SP',
    registrationDate: '2025-10-17',
    socials: { instagram: '', twitter: 'William Fiebig' },
    profilePic: 'https://ui-avatars.com/api/?name=William+Fiebig',
    cardId: 'WC-102',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-103',
    email: 'fabiano.torino16@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Fabiano Quinonez Sirqueira',
    role: 'member',
    rg: '',
    cpf: '045.516.661-73',
    phone: '67992378914',
    dob: '28/04/1993',
    address: 'Rua Danilo Gustavo Vilhalva Paixão 1110',
    city: 'Dourados',
    state: 'MS',
    registrationDate: '2025-10-17',
    socials: { instagram: '@fabianoqsiqueira', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Fabiano+Sirqueira',
    cardId: 'WC-103',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-104',
    email: 'erikzedek@hotmail.com',
    password: TEMP_PASSWORD,
    name: 'Erikzedek frança Silva',
    role: 'member',
    rg: '',
    cpf: '46932465817',
    phone: '11985201617',
    dob: '01/04/1997',
    address: 'Travessa 5 de maio n 73 Piraporinha',
    city: 'Diadema',
    state: 'SP',
    registrationDate: '2025-10-16',
    socials: { instagram: '', twitter: '@erikzedek' },
    profilePic: 'https://ui-avatars.com/api/?name=Erikzedek+Silva',
    cardId: 'WC-104',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-105',
    email: 'pathyfarias73@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Patricia valerio de Farias',
    role: 'member',
    rg: '',
    cpf: '25574617846',
    phone: '11970672771',
    dob: '17/08/1973',
    address: 'Rua Epitácio pessoa 170 - centro',
    city: 'Diadema',
    state: 'SP',
    registrationDate: '2025-10-16',
    socials: { instagram: 'pathyfarias_valerio', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Patricia+Farias',
    cardId: 'WC-105',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-106',
    email: 'joao_matheus_21@hotmail.com',
    password: TEMP_PASSWORD,
    name: 'João Mateus Santos',
    role: 'member',
    rg: '',
    cpf: '41910077852',
    phone: '11981805158',
    dob: '12/09/1993',
    address: 'Rua Newton Braga 179, Vila Maria',
    city: 'São Paulo',
    state: 'SP',
    registrationDate: '2025-10-16',
    socials: { instagram: '@matheus01993', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Joao+Santos',
    cardId: 'WC-106',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-107',
    email: 'isjefferson20@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Jefferson William dos Santos',
    role: 'member',
    rg: '',
    cpf: '34011433870',
    phone: '19992541639',
    dob: '21/07/1988',
    address: 'R. Ática, 673 - Vila Alexandria',
    city: 'São Paulo',
    state: 'SP',
    registrationDate: '2025-10-16',
    socials: { instagram: 'Jefferson_santos_br20', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Jefferson+Santos',
    cardId: 'WC-107',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-108',
    email: 'guerreirowanderson8@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Antonio Wanderson Pinheiro guerreiro',
    role: 'member',
    rg: '',
    cpf: '01981497358',
    phone: '85999401046',
    dob: '09/02/1985',
    address: 'Travessa Osório de Paiva 65',
    city: 'Fortaleza', // Inferido pelo DDD 85
    state: 'CE',
    registrationDate: '2025-10-16',
    socials: { instagram: 'Antonio Guerreiro', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Antonio+Guerreiro',
    cardId: 'WC-108',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-109',
    email: 'paulogratao.pg@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Paulo Gratão',
    role: 'member',
    rg: '',
    cpf: '31473054818',
    phone: '11993817447',
    dob: '22/04/1986',
    address: 'Rua Doutor Zuquim, 757. Apto 121. Santana',
    city: 'São Paulo',
    state: 'SP',
    registrationDate: '2025-10-16',
    socials: { instagram: '@paulo_gratao', twitter: '@paulogratao' },
    profilePic: 'https://ui-avatars.com/api/?name=Paulo+Gratao',
    cardId: 'WC-109',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-110',
    email: 'tathiane_braga@yahoo.com.br',
    password: TEMP_PASSWORD,
    name: 'Tathiane Aparecida Braga de Campos',
    role: 'member',
    rg: '',
    cpf: '3045536980',
    phone: '11995873656',
    dob: '03/03/1984',
    address: 'Rua Leopoldo de Freitas 57 apto 73',
    city: 'São Paulo',
    state: 'SP',
    registrationDate: '2025-10-16',
    socials: { instagram: 'Tathiane Braga', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Tathiane+Braga',
    cardId: 'WC-110',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-111',
    email: 'samuellbrodrigues@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Samuel Leandro Barboza Rodrigues',
    role: 'member',
    rg: '',
    cpf: '45182293801',
    phone: '19971510718',
    dob: '26/09/1998',
    address: 'Rua Manoel Sylvestre de Freitas Filho, 1277',
    city: 'Campinas',
    state: 'SP',
    registrationDate: '2025-10-15',
    socials: { instagram: '@eu.samurodrigues', twitter: '@eusamurodrigues' },
    profilePic: 'https://ui-avatars.com/api/?name=Samuel+Rodrigues',
    cardId: 'WC-111',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-112',
    email: 'vinimatosfisio@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Vinicius Matos de Oliveira',
    role: 'member',
    rg: '',
    cpf: '40954968867',
    phone: '11972074519',
    dob: '19/01/1991',
    address: 'Rua Ana Ferreira de Oliveira, 255, Vila Municipal',
    city: 'Mogi das Cruzes',
    state: 'SP',
    registrationDate: '2025-10-15',
    socials: { instagram: '@vinimaatos', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Vinicius+Oliveira',
    cardId: 'WC-112',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-113',
    email: 'thiagomdocarmo@hotmail.com',
    password: TEMP_PASSWORD,
    name: 'Thiago Maciel do Carmo',
    role: 'member',
    rg: '',
    cpf: '10203610776',
    phone: '85981424023',
    dob: '22/10/1984',
    address: 'Rua Galiente 1860 apartamento 101 parque potira',
    city: 'Caucaia',
    state: 'CE',
    registrationDate: '2025-10-15',
    socials: { instagram: '', twitter: 'thiimaciell' },
    profilePic: 'https://ui-avatars.com/api/?name=Thiago+Maciel',
    cardId: 'WC-113',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-114',
    email: 'betaoliveira0709@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Roberta Regiane de Oliveira',
    role: 'member',
    rg: '',
    cpf: '37449956829',
    phone: '16982296211',
    dob: '07/09/1991',
    address: 'Rua: Guanabara, 180. Bairro: jardim Beatriz',
    city: 'Igarapava',
    state: 'SP',
    registrationDate: '2025-10-15',
    socials: { instagram: '@betah_oliveira', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Roberta+Oliveira',
    cardId: 'WC-114',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-115',
    email: 'deeivisom@hotmail.com',
    password: TEMP_PASSWORD,
    name: 'Deivisom Glaucio Aparecido Ribeiro de Souza',
    role: 'member',
    rg: '',
    cpf: '42403215813',
    phone: '5998221937',
    dob: '31/10/1994',
    address: 'Estrada Velha Tatuí a Laranjal Paulista',
    city: 'Tatuí', // Inferido
    state: 'SP',
    registrationDate: '2025-10-15',
    socials: { instagram: '@deeeivisomsouza', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Deivisom+Souza',
    cardId: 'WC-115',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-116',
    email: 'galletdiego@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Diego da Silva Gallet',
    role: 'member',
    rg: '',
    cpf: '07257827656',
    phone: '19991248191',
    dob: '27/12/1987',
    address: 'Rua João Carlos França Francischini,226',
    city: 'Hortolândia',
    state: 'SP',
    registrationDate: '2025-10-15',
    socials: { instagram: '@gallerdiego', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Diego+Gallet',
    cardId: 'WC-116',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-117',
    email: 'fernnandomoura@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Fernando Henrique Moura de Oliveira',
    role: 'member',
    rg: '',
    cpf: '11534689648',
    phone: '34996571411',
    dob: '19/02/1994',
    address: 'Rua: Caule, 1001 - Apartamento 203 - Granada',
    city: 'Uberlândia',
    state: 'MG',
    registrationDate: '2025-10-15',
    socials: { instagram: '@feermouura', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Fernando+Moura',
    cardId: 'WC-117',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-118',
    email: 'leandrorochamarques@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Leandro da Rocha Marques',
    role: 'member',
    rg: '',
    cpf: '411.749.858-44',
    phone: '11 98360-2866',
    dob: '21/04/1993',
    address: 'Rua Vicente Leporace 66, Vila Correia',
    city: 'Mauá',
    state: 'SP',
    registrationDate: '2025-10-15',
    socials: { instagram: '@leandromarquess_', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Leandro+Marques',
    cardId: 'WC-118',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-119',
    email: 'byrodrigo@outlook.com',
    password: TEMP_PASSWORD,
    name: 'Rodrigo Martins dos Santos',
    role: 'member',
    rg: '',
    cpf: '44595012870',
    phone: '11983271844',
    dob: '17/10/1995',
    address: 'Gaspar dos Santos',
    city: 'São Paulo', // Placeholder
    state: 'SP',
    registrationDate: '2025-10-15',
    socials: { instagram: 'irodrigom', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Rodrigo+Santos',
    cardId: 'WC-119',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-120',
    email: 'thalysaraujors@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Thalys Araujo da Silva',
    role: 'member',
    rg: '',
    cpf: '32770220600',
    phone: '51980811813',
    dob: '24/02/1997',
    address: 'Rua Francisco de Andrade, 359 - Campestre',
    city: 'São Leopoldo',
    state: 'RS',
    registrationDate: '2025-10-15',
    socials: { instagram: '@arrobathalys', twitter: '@onebadalo' },
    profilePic: 'https://ui-avatars.com/api/?name=Thalys+Silva',
    cardId: 'WC-120',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-121',
    email: 'elianerocha6@hotmail.com',
    password: TEMP_PASSWORD,
    name: 'Eliane Aparecida Rocha',
    role: 'member',
    rg: '',
    cpf: '12983807827',
    phone: '11999112994',
    dob: '24/05/1971',
    address: 'Trav. Dr. Jose Nunes de Almeida Prado, 21',
    city: 'São Paulo',
    state: 'SP',
    registrationDate: '2025-10-15',
    socials: { instagram: '@elianeaprocha', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Eliane+Rocha',
    cardId: 'WC-121',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-122',
    email: 'Priscillafarias2008@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Priscilla Camila de Farias Souza',
    role: 'member',
    rg: '',
    cpf: '347.596.878-90',
    phone: '1198489-2093',
    dob: '06/04/1987',
    address: 'Rua sergipe 43 torre Málaga Apartamento 114',
    city: 'São Paulo', // Placeholder
    state: 'SP',
    registrationDate: '2025-10-15',
    socials: { instagram: '@pri_sevarolli', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Priscilla+Souza',
    cardId: 'WC-122',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-123',
    email: 'thiago.nascimento1990@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Thiago do Nascimento Silva',
    role: 'member',
    rg: '',
    cpf: '02273693354',
    phone: '85985116660',
    dob: '26/03/1990',
    address: 'Rua nossa senhora das Graças 1116',
    city: 'Fortaleza', // Inferido pelo DDD 85
    state: 'CE',
    registrationDate: '2025-10-15',
    socials: { instagram: 'Thiago nascimentoo', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Thiago+Silva',
    cardId: 'WC-123',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-124',
    email: 'adrielsaul@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Adriel Saul Candido Vieira de Oliveira',
    role: 'member',
    rg: '',
    cpf: '035.824.983-01',
    phone: '11985577578',
    dob: '22/05/1991',
    address: 'Avenida professor Alceu Maynard Araújo 43 apart 42b',
    city: 'São Paulo', // Placeholder
    state: 'SP',
    registrationDate: '2025-10-15',
    socials: { instagram: '@adrielsaul', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Adriel+Oliveira',
    cardId: 'WC-124',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-125',
    email: 'jerryproducoesartisticas@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Jerry Cleiton da Silva',
    role: 'member',
    rg: '',
    cpf: '03987414413',
    phone: '15981327015',
    dob: '31/05/1981',
    address: 'Rua Marina carneiro schorr',
    city: 'Sorocaba', // Inferido pelo DDD 15
    state: 'SP',
    registrationDate: '2025-10-15',
    socials: { instagram: 'Jerry Cleiton da Silva', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Jerry+Silva',
    cardId: 'WC-125',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-126',
    email: 'hi.henriquevicentte@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Paulo Henrique Vicente de Melo',
    role: 'member',
    rg: '',
    cpf: '14684647790',
    phone: '21 982722440',
    dob: '02/04/1996',
    address: 'Rua Lopes Quintas 231, Apt. 201 Jardim Botânico',
    city: 'Rio de Janeiro',
    state: 'RJ',
    registrationDate: '2025-10-15',
    socials: { instagram: '@hentiquevicentte', tiktok: '@henriquevicenttte', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Paulo+Melo',
    cardId: 'WC-126',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-127',
    email: 'lucassmello@hotmail.com',
    password: TEMP_PASSWORD,
    name: 'Lucas de Souza Freitas Mello',
    role: 'member',
    rg: '',
    cpf: '09985349601',
    phone: '32991973185',
    dob: '27/12/1990',
    address: 'CA 09, Lote 20, Ap 119',
    city: 'Brasília',
    state: 'DF',
    registrationDate: '2025-10-15',
    socials: { instagram: '@lucas.smello', twitter: '@SLucasmello' },
    profilePic: 'https://ui-avatars.com/api/?name=Lucas+Mello',
    cardId: 'WC-127',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-128',
    email: 'otavioaugustosousa@outlook.com',
    password: TEMP_PASSWORD,
    name: 'Otávio Augusto de Sousa Gonçalves',
    role: 'member',
    rg: '',
    cpf: '43106802839',
    phone: '11 99234-3113',
    dob: '16/05/1994',
    address: 'Travessa rio reno 55 Jardim Dom José',
    city: 'São Paulo',
    state: 'SP',
    registrationDate: '2025-10-15',
    socials: { instagram: '@otavioaugustosousa', twitter: '@otavioaugustogonc' },
    profilePic: 'https://ui-avatars.com/api/?name=Otavio+Goncalves',
    cardId: 'WC-128',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-129',
    email: 'tatiassis.mello@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Tatiane de Assis',
    role: 'member',
    rg: '',
    cpf: '06062225613',
    phone: '19 999124 3345',
    dob: '26/01/1985',
    address: 'Rua Albânia, 358 bl 1 ap 602 vl Santa maria',
    city: 'Americana',
    state: 'SP',
    registrationDate: '2025-10-15',
    socials: { instagram: '@tathyassis', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Tatiane+Assis',
    cardId: 'WC-129',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-130',
    email: 'mic.leandro@yahoo.com.br',
    password: TEMP_PASSWORD,
    name: 'Michel Luís da Cruz Ramos Leandro',
    role: 'member',
    rg: '',
    cpf: '36734351831',
    phone: '16981397348',
    dob: '08/10/1989',
    address: 'Rua Ismar José Junqueira, Jardim Antônio Palocci',
    city: 'Ribeirão Preto',
    state: 'SP',
    registrationDate: '2025-10-15',
    socials: { instagram: '@michelleandroo', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Michel+Leandro',
    cardId: 'WC-130',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-131',
    email: 'wlisses.silva2009@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Wlisses Soares da Silva',
    role: 'member',
    rg: '',
    cpf: '07545501411',
    phone: '81 986424800',
    dob: '06/07/1989',
    address: 'Rua: Caruaru N° 176',
    city: 'Paulista',
    state: 'PE',
    registrationDate: '2025-10-15',
    socials: { instagram: '@silva_wlisses', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Wlisses+Silva',
    cardId: 'WC-131',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-132',
    email: 'master.saudeintegrativa@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Ernandes dos Santos Matias',
    role: 'member',
    rg: '',
    cpf: '22991872861',
    phone: '11956969079',
    dob: '19/10/1987',
    address: 'Soriano, 921 Ap. 6 - Centro',
    city: 'Montevideo',
    state: 'UY', // Uruguai
    registrationDate: '2025-10-15',
    socials: { instagram: '@masterhernandes', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Ernandes+Matias',
    cardId: 'WC-132',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-133',
    email: 'nascimentoofelipee@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Felipe André do Nascimento dos Santos',
    role: 'member',
    rg: '',
    cpf: '44420769874',
    phone: '11953496153',
    dob: '01/06/1995',
    address: 'Travessa Erva Mentruz, 136 - Jd Vista Linda',
    city: 'São Paulo',
    state: 'SP',
    registrationDate: '2025-10-15',
    socials: { instagram: '@felipeenascimentoo', twitter: '@FelipeANSantos_' },
    profilePic: 'https://ui-avatars.com/api/?name=Felipe+Santos',
    cardId: 'WC-133',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-134',
    email: 'trindadejessica1996@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Jéssica Inês de Barros Trindade',
    role: 'member',
    rg: '',
    cpf: '09403111437',
    phone: '81 99841-4778',
    dob: '19/11/2025', // Correction might be needed for year in source
    address: 'Rua Francisco Otaviano km 7 aldeia camaragibe',
    city: 'Camaragibe',
    state: 'PE',
    registrationDate: '2025-10-15',
    socials: { instagram: '', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Jessica+Trindade',
    cardId: 'WC-134',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-135',
    email: 'tamfmarques@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Tâmara Ferreira Marques',
    role: 'member',
    rg: '',
    cpf: '36477707870',
    phone: '11952257328',
    dob: '20/05/1988',
    address: 'Av. Circular, 579, Recanto da Prata',
    city: 'Jundiaí',
    state: 'SP',
    registrationDate: '2025-10-15',
    socials: { instagram: 'tammarques__', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Tamara+Marques',
    cardId: 'WC-135',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-136',
    email: 'cdanandasantos@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Ananda Amaral Santos',
    role: 'member',
    rg: '',
    cpf: '03738762116',
    phone: '62999657630',
    dob: '15/04/1990',
    address: 'Av Maranhão. Qd 67 lote 12. Residencial solar do bosque',
    city: 'Anápolis',
    state: 'GO',
    registrationDate: '2025-10-15',
    socials: { instagram: '@asantosananda', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Ananda+Santos',
    cardId: 'WC-136',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-137',
    email: 'lourencosilva18@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Pedro Henrique Lourenço da Silva',
    role: 'member',
    rg: '',
    cpf: '09725986423',
    phone: '21980348192',
    dob: '29/06/1994',
    address: 'Rua Mário agostinelli, 55 AP 804 bloco 1',
    city: 'Rio de Janeiro',
    state: 'RJ',
    registrationDate: '2025-10-15',
    socials: { instagram: '@phenriqueoff', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Pedro+Silva',
    cardId: 'WC-137',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-138',
    email: 'kaubermansur@outlook.com',
    password: TEMP_PASSWORD,
    name: 'Kauber Mansur Irffi Junior',
    role: 'member',
    rg: '112.038.186-02',
    cpf: '', // RG provided in place of CPF in one column, need verify
    phone: '(31) 99252-6161',
    dob: '23/09/1995',
    address: 'Rua Montes Claros, 1060 / 301 - Anchieta',
    city: 'Belo Horizonte',
    state: 'MG',
    registrationDate: '2025-10-15',
    socials: { instagram: 'kaubermansur', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Kauber+Junior',
    cardId: 'WC-138',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-139',
    email: 'leandro.moretto@hotmail.com',
    password: TEMP_PASSWORD,
    name: 'Leandro Luís Barcasse Moretto',
    role: 'member',
    rg: '246.083.018-10',
    cpf: '',
    phone: '13 99191-3958',
    dob: '20/03/1978',
    address: 'Rua Santa Rita de Cássia 842, Maracanã',
    city: 'Praia Grande',
    state: 'SP',
    registrationDate: '2025-10-18',
    socials: { instagram: '@leandromorettoficial', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Leandro+Moretto',
    cardId: 'WC-139',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-140',
    email: 'amandafulgoni.mendes@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Amanda Fulgoni Mendes',
    role: 'member',
    rg: '',
    cpf: '16674193747',
    phone: '(24)998221936',
    dob: '20/02/1995',
    address: 'Rua 539, número 08, bairro jardim Paraíba',
    city: 'Volta Redonda',
    state: 'RJ',
    registrationDate: '2025-10-19',
    socials: { instagram: '@amandafulgoni', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Amanda+Mendes',
    cardId: 'WC-140',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-141',
    email: 'guilhermejosesmoreira@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Guilherme José da Silva Moreira',
    role: 'member',
    rg: '',
    cpf: '01832498603',
    phone: '31982712323',
    dob: '25/08/1994',
    address: 'Rua Teófilo Nascimento, 35430193',
    city: 'Ponte Nova',
    state: 'MG',
    registrationDate: '2025-10-19',
    socials: { instagram: 'guilhermejsm', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Guilherme+Moreira',
    cardId: 'WC-141',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-142',
    email: 'mauricio.lds@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Mauricio Soares',
    role: 'member',
    rg: '',
    cpf: '37914370894',
    phone: '19989681696',
    dob: '24/01/1988',
    address: 'Av. São Jerônimo ,1725 Jardim Bela Vista',
    city: 'Americana',
    state: 'SP',
    registrationDate: '2025-10-22',
    socials: { instagram: 'mauusooares', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Mauricio+Soares',
    cardId: 'WC-142',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-143',
    email: 'thiago_mega07@hotmail.com',
    password: TEMP_PASSWORD,
    name: 'Enio Thiago do Nascimento',
    role: 'member',
    rg: '',
    cpf: '36109619884',
    phone: '19984570006',
    dob: '17/03/1988',
    address: 'Avenida Washington Luiz, 4400 - Bloco D apto 23',
    city: 'Campinas', // Inferred/Generic
    state: 'SP',
    registrationDate: '2025-10-22',
    socials: { instagram: '@abracadabramascotesvivos', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Enio+Nascimento',
    cardId: 'WC-143',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-144',
    email: 'fahbinhu.bs@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Fabio da Silva Vieira',
    role: 'member',
    rg: '',
    cpf: '40810626845',
    phone: '11969067280',
    dob: '12/09/1992',
    address: 'rua Sylvio, 234',
    city: 'São Bernardo do Campo',
    state: 'SP',
    registrationDate: '2025-11-14',
    socials: { instagram: '@itsfahbinhu', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Fabio+Vieira',
    cardId: 'WC-144',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-145',
    email: 'bruno.ribeiro84@yahoo.com.br',
    password: TEMP_PASSWORD,
    name: 'Bruno Henrique Ribeiro',
    role: 'member',
    rg: '',
    cpf: '06339201695',
    phone: '35999167143',
    dob: '31/10/1984',
    address: 'Avenida Manoel Augusto da Silva,615',
    city: 'Varginha',
    state: 'MG',
    registrationDate: '2025-11-17',
    socials: { instagram: '@bruno.ribeiro84', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Bruno+Ribeiro',
    cardId: 'WC-145',
    status: 'Ativo',
    mustChangePassword: true
  },
  {
    id: 'WC-146',
    email: 'sidney.pinheiro.lima@gmail.com',
    password: TEMP_PASSWORD,
    name: 'Sidney Pinheiro Lima',
    role: 'member',
    rg: '',
    cpf: '33706618885',
    phone: '1198526310',
    dob: '05/02/1992',
    address: 'Rua Jaciara, 18A, Jardim Damasceno',
    city: 'São Paulo',
    state: 'SP',
    registrationDate: '2025-11-07',
    socials: { instagram: 'sidney.pinheiro.limaa', twitter: '' },
    profilePic: 'https://ui-avatars.com/api/?name=Sidney+Lima',
    cardId: 'WC-146',
    status: 'Ativo',
    mustChangePassword: true
  }
];

// Persistence Logic
// Updated to V8 to ensure clean slate for optimized images
const STORAGE_KEY = 'wnews_mock_users_v8';

export const loadUsersFromStorage = (): User[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to load users from storage", e);
    }
    return defaultUsers;
};

// Helper to force refresh mockUsers array from storage
// This simulates fetching from a live database to ensure sync
export const refreshUsersFromStorage = () => {
    const freshData = loadUsersFromStorage();
    // We replace content in place to maintain reference if used elsewhere, 
    // though typically we should return the new array.
    mockUsers.length = 0;
    mockUsers.push(...freshData);
    return mockUsers;
};

export const saveUsersToStorage = (users: User[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
        console.error("Failed to save users to storage", e);
        // Handle QuotaExceededError specifically for mobile browsers
        if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
            alert("⚠️ Espaço cheio! A imagem selecionada é muito grande para o armazenamento local. O sistema tentou comprimi-la, mas ainda assim excedeu o limite do navegador. Tente uma imagem menor.");
        }
    }
};

// Helper to update a single user in storage immediately
export const updateUserInStorage = (updatedUser: User) => {
    // 1. Add Timestamp for Cache Busting
    updatedUser.lastModified = Date.now();

    // 2. Load current DB state
    const currentUsers = loadUsersFromStorage();
    const index = currentUsers.findIndex(u => u.id === updatedUser.id);
    
    if (index !== -1) {
        // 3. Update DB
        currentUsers[index] = updatedUser;
        saveUsersToStorage(currentUsers);
        
        // 4. Update In-Memory State (for current session)
        const memIndex = mockUsers.findIndex(u => u.id === updatedUser.id);
        if (memIndex !== -1) {
            mockUsers[memIndex] = updatedUser;
        }
    }
};

// Initialize mockUsers from storage if available, otherwise use defaults
export const mockUsers: User[] = loadUsersFromStorage();

// Initialize with some dummy data for demonstration if needed, or keep empty
export const mockGiveawayEntries: GiveawayEntry[] = [
    {
        id: 'ENTRY-001',
        userId: 'WC-137',
        userName: 'Pedro Henrique Lourenço da Silva',
        userCardId: 'WC-137',
        category: 'Camarim',
        drawName: 'Show na Audio',
        registrationDate: '2024-10-26T10:00:00Z',
        status: 'pending',
        isPublicWinner: false
    }
];

export const mockCamarimWinners: CamarimWinner[] = [
    {
        id: 'CAM-001',
        winnerId: 'WC-114',
        winnerName: 'Roberta Regiane de Oliveira',
        winnerProfilePic: 'https://ui-avatars.com/api/?name=Roberta+Oliveira',
        drawDate: '2024-05-20',
        registeredBy: 'MASTER-001',
        observations: 'Show de Lançamento Metamorfose - Rio de Janeiro'
    }
];

export const mockAuditLog: AuditLogEntry[] = [];

export let mockOuvidoriaTickets: OuvidoriaTicket[] = [
    {
        id: 'OUV-001',
        memberId: 'WC-100',
        subject: 'Sugestão para o App',
        type: 'Sugestão',
        createdAt: '2024-07-28T10:00:00Z',
        status: 'Respondida',
        messages: [
            { id: 'MSG-001', author: 'member', text: 'Seria legal ter uma galeria de fotos dos eventos.', timestamp: '2024-07-28T10:00:00Z' },
            { id: 'MSG-002', author: 'admin', text: 'Ótima sugestão! Estamos avaliando a possibilidade de implementar uma galeria em futuras atualizações. Obrigado pelo feedback!', timestamp: '2024-07-28T14:30:00Z' }
        ]
    }
];

export const mockNotifications: Notification[] = [
  {
    id: 'NOT-001',
    title: 'Bem-vindo ao W News!',
    message: 'Seu cadastro foi realizado com sucesso. Aproveite todas as vantagens exclusivas.',
    type: 'announcement',
    date: new Date().toISOString(),
    read: false
  }
];
