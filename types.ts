
export type UserType = 'Standard' | 'Business';

export type UserRole = 'customer' | 'shop' | 'admin';

export interface User {
  email: string;
  role: UserRole;
  userType?: UserType;
  primaryShopId?: number;
}

export interface ManagedUser extends User {
    jobCount: number;
    userType: UserType;
    totalSpent: number;
    lastActivity: string;
}

export interface ClientDetails {
    name: string;
    address: string;
}

export interface ShopService {
    id: string;
    name: string;
    price: number;
    duration: number; // in hours
}

export interface StaffMember {
    id: string;
    name: string;
    role: 'Estimator' | 'Bodytech' | 'Painter' | 'Detailer' | 'Manager';
    email: string;
    phone: string;
    hireDate: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    photoUrl: string;
    performanceNotes: {
        date: string;
        note: string;
        reviewer: string;
    }[];
    salary: number; // For demo purposes
}


export interface Part {
    id: string;
    name: string;
    supplier: string;
    price: number;
    status: 'Needed' | 'Ordered' | 'Received';
}

export interface InventoryPart {
    id: string;
    name: string;
    supplier: string;
    stock: number;
    price: number;
}

export interface Shop {
  id: number;
  name:string;
  address: string;
  phone?: string;
  rating: number;
  reviewCount: number;
  position: { x: string; y:string; };
  status?: 'Approved' | 'Pending' | 'Suspended';
  availability: boolean;
  services: ShopService[];
  staff: StaffMember[];
  priceRange: 'low' | 'medium' | 'high';
  inventory: InventoryPart[];
}

export interface CarDetails {
  make: string;
  model: string;
  year: string;
  vin: string;
  registrationNo: string;
}

export type JobStatus = 
  | 'New' // For manual quotes
  | 'Estimate' // For AI quotes
  | 'Quote Requested' // Legacy, can be merged with New
  | 'Quote Provided'
  | 'Booking Confirmed'
  | 'In Repair'
  | 'Painting'
  | 'Final Check'
  | 'Awaiting Payment'
  | 'Completed'
  | 'Cancelled';

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'shop' | 'system' | 'admin';
  text: string;
  timestamp: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  date: string;
}

export interface ManualQuote {
  items: InvoiceItem[];
  total: number;
  notes?: string;
}

export interface AIAnalysisResult {
    damageType: string;
    estimatedCost: string;
    estimatedTime: string;
    confidence: number;
}

export interface Job {
  id:string;
  customerEmail: string;
  clientDetails?: ClientDetails;
  shop: Shop;
  carDetails: CarDetails;
  photos: {
      damage: string[];
      inProgress: string[];
      completed: string[];
  };
  status: JobStatus;
  bookingDate?: string;
  lastUpdate: string;
  chatHistory: ChatMessage[];
  quote?: ManualQuote;
  invoice?: Invoice;
  rating?: number;
  reviewText?: string;
  aiAnalysis?: AIAnalysisResult;
  assignedStaff?: StaffMember[];
  parts?: Part[];
  notes?: string;
}

export interface SupportTicket {
    id: string;
    customerEmail: string;
    subject: string;
    status: 'Open' | 'In Progress' | 'Closed';
    lastUpdate: string;
    chatHistory: ChatMessage[];
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'sm' | 'md' | 'lg';
}

export interface Notification {
  id: string;
  type: 'feedback' | 'status_update' | 'general';
  message: string;
  jobId?: string;
  timestamp: string;
  read: boolean;
}


export type CustomerPage = 'new_estimate' | 'bookings' | 'profile' | 'job_details' | 'notifications' | 'support_chat';
export type ShopPage = 'dashboard' | 'workflow' | 'jobs' | 'staff' | 'services' | 'parts' | 'profile' | 'earnings' | 'calendar';
export type AdminPage = 'dashboard' | 'shops' | 'users' | 'analytics' | 'support' | 'settings' | 'transactions';