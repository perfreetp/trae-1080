import { create } from 'zustand';
import type { Team, Requirement, Quote, Order, Schedule, Delivery, Review, PortfolioItem } from '@/types';
import { mockTeams } from '@/data/teams';
import { mockPortfolio } from '@/data/portfolio';
import { mockRequirements, mockQuotes, mockOrders, mockSchedules, mockDeliveries, mockReviews } from '@/data';

interface AppState {
  teams: Team[];
  portfolio: PortfolioItem[];
  requirements: Requirement[];
  quotes: Quote[];
  orders: Order[];
  schedules: Schedule[];
  deliveries: Delivery[];
  reviews: Review[];
  selectedTeam: Team | null;
  selectedPortfolio: PortfolioItem | null;
  activeFilter: string;
  portfolioCategory: string;
  
  setSelectedTeam: (team: Team | null) => void;
  setSelectedPortfolio: (item: PortfolioItem | null) => void;
  setActiveFilter: (filter: string) => void;
  setPortfolioCategory: (category: string) => void;
  addRequirement: (req: Requirement) => void;
  updateQuoteStatus: (quoteId: string, status: 'pending' | 'accepted' | 'rejected') => void;
  addQuote: (quote: Quote) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  signContract: (orderId: string) => void;
  payDeposit: (orderId: string) => void;
  payBalance: (deliveryId: string) => void;
  updateCopyrightLicense: (deliveryId: string, license: 'personal' | 'commercial' | 'exclusive') => void;
  confirmShootList: (scheduleId: string, shootList: { item: string; confirmed: boolean }[]) => void;
  submitReschedule: (scheduleId: string, reschedule: { reason: string; newDate: string; status: 'pending' | 'approved' | 'rejected' }) => void;
  addReview: (review: Review) => void;
  addComplaint: (reviewId: string, complaint: { reason: string; evidence: string[]; status: 'pending' | 'processing' | 'resolved' }) => void;
}

export const useStore = create<AppState>((set) => ({
  teams: mockTeams,
  portfolio: mockPortfolio,
  requirements: mockRequirements,
  quotes: mockQuotes,
  orders: mockOrders,
  schedules: mockSchedules,
  deliveries: mockDeliveries,
  reviews: mockReviews,
  selectedTeam: null,
  selectedPortfolio: null,
  activeFilter: 'all',
  portfolioCategory: 'all',

  setSelectedTeam: (team) => set({ selectedTeam: team }),
  setSelectedPortfolio: (item) => set({ selectedPortfolio: item }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  setPortfolioCategory: (category) => set({ portfolioCategory: category }),
  
  addRequirement: (req) => set((state) => ({
    requirements: [...state.requirements, req],
  })),
  
  updateQuoteStatus: (quoteId, status) => set((state) => ({
    quotes: state.quotes.map((q) =>
      q.id === quoteId ? { ...q, status } : q
    ),
  })),

  addQuote: (quote) => set((state) => ({
    quotes: [...state.quotes, quote],
  })),
  
  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map((o) =>
      o.id === orderId ? { ...o, status } : o
    ),
  })),

  signContract: (orderId) => set((state) => ({
    orders: state.orders.map((o) =>
      o.id === orderId ? { ...o, contractSigned: true } : o
    ),
  })),

  payDeposit: (orderId) => set((state) => ({
    orders: state.orders.map((o) =>
      o.id === orderId ? { ...o, depositPaid: true, status: 'confirmed' } : o
    ),
  })),
  
  payBalance: (deliveryId) => set((state) => ({
    deliveries: state.deliveries.map((d) =>
      d.id === deliveryId ? { ...d, balancePaid: true } : d
    ),
  })),

  updateCopyrightLicense: (deliveryId, license) => set((state) => ({
    deliveries: state.deliveries.map((d) =>
      d.id === deliveryId ? { ...d, copyrightLicense: license } : d
    ),
  })),

  confirmShootList: (scheduleId, shootList) => set((state) => ({
    schedules: state.schedules.map((s) =>
      s.id === scheduleId ? { ...s, shootList } : s
    ),
  })),

  submitReschedule: (scheduleId, reschedule) => set((state) => ({
    schedules: state.schedules.map((s) =>
      s.id === scheduleId ? { ...s, rescheduleRequest: reschedule } : s
    ),
  })),
  
  addReview: (review) => set((state) => ({
    reviews: [...state.reviews, review],
  })),

  addComplaint: (reviewId, complaint) => set((state) => ({
    reviews: state.reviews.map((r) =>
      r.id === reviewId ? { ...r, complaint } : r
    ),
  })),
}));
