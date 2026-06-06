import { create } from 'zustand';
import type { Team, Requirement, Inquiry, Quote, Order, Schedule, Delivery, Review, PortfolioItem } from '@/types';
import { mockTeams } from '@/data/teams';
import { mockPortfolio } from '@/data/portfolio';
import { mockRequirements, mockQuotes, mockOrders, mockSchedules, mockDeliveries, mockReviews } from '@/data';

interface AppState {
  teams: Team[];
  portfolio: PortfolioItem[];
  requirements: Requirement[];
  inquiries: Inquiry[];
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
  submitShootListModify: (scheduleId: string, modifyRequest: { reason: string; newItems: { item: string; confirmed: boolean }[]; status: 'pending' | 'approved' | 'rejected' }) => void;
  submitReschedule: (scheduleId: string, reschedule: { reason: string; newDate: string; status: 'pending' | 'approved' | 'rejected' }) => void;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt'>) => void;
  simulateTeamReply: (inquiryId: string) => void;
  addReview: (review: Review) => void;
  addComplaint: (reviewId: string, complaint: { reason: string; description: string; evidence: string[]; status: 'pending' | 'processing' | 'resolved' }) => void;
  createOrderFromQuote: (quoteId: string) => Order | null;
}

export const useStore = create<AppState>((set) => ({
  teams: mockTeams,
  portfolio: mockPortfolio,
  requirements: mockRequirements,
  inquiries: [],
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

  addInquiry: (inquiry) => set((state) => {
    const newInquiry = {
      ...inquiry,
      id: `inquiry-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTimeout(() => {
      set((s) => ({
        inquiries: s.inquiries.map((i) =>
          i.id === newInquiry.id
            ? {
                ...i,
                status: 'replied' as const,
                replyMessage: '感谢您的询价！我们已根据您的需求准备了详细报价，期待与您合作。',
                quotePrice: Math.round(Number(inquiry.budget) * 0.95) || 4800,
                quoteDeliveryDays: inquiry.packageType === 'basic' ? 5 : inquiry.packageType === 'standard' ? 7 : 10,
                repliedAt: new Date().toISOString().split('T')[0],
              }
            : i
        ),
      }));
    }, 3000);

    return {
      inquiries: [...state.inquiries, newInquiry],
    };
  }),

  simulateTeamReply: (inquiryId) => set((state) => {
    const inquiry = state.inquiries.find((i) => i.id === inquiryId);
    if (!inquiry) return state;

    const packageConfig = {
      basic: { price: 3800, deliveryDays: 5, flightHours: 2, cameras: 1 },
      standard: { price: 6800, deliveryDays: 7, flightHours: 4, cameras: 2 },
      premium: { price: 12800, deliveryDays: 10, flightHours: 6, cameras: 3 },
    };
    const config = packageConfig[inquiry.packageType] || packageConfig.standard;

    const newQuote = {
      id: `quote-${Date.now()}`,
      teamId: inquiry.teamId,
      requirementId: inquiry.requirementId,
      packageType: inquiry.packageType,
      flightHours: config.flightHours,
      cameras: config.cameras,
      postProduction: inquiry.packageType !== 'basic',
      deliveryDays: config.deliveryDays,
      totalPrice: config.price,
      status: 'pending' as const,
      includes: inquiry.packageType === 'basic' 
        ? ['2小时飞行时间', '单机位拍摄', '原片全部交付', '5天交付']
        : inquiry.packageType === 'standard'
        ? ['4小时飞行时间', '双机位拍摄', '精修30张照片', '3分钟剪辑视频', '7天交付']
        : ['6小时飞行时间', '三机位电影级拍摄', '精修50张照片', '5分钟电影级剪辑', '10天交付', '版权授权'],
      inquiryId: inquiry.id,
    };

    return {
      inquiries: state.inquiries.map((i) =>
        i.id === inquiryId
          ? {
              ...i,
              status: 'replied' as const,
              replyMessage: '感谢您的询价！我们已根据您的需求准备了详细报价，期待与您合作。',
              quotePrice: config.price,
              quoteDeliveryDays: config.deliveryDays,
              repliedAt: new Date().toISOString().split('T')[0],
            }
          : i
      ),
      quotes: [...state.quotes, newQuote],
    };
  }),
  
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

  signContract: (orderId) => set((state) => {
    const order = state.orders.find((o) => o.id === orderId);
    const requirement = state.requirements.find((r) => r.id === order?.requirementId);
    
    const newSchedule = {
      id: `sch-${Date.now()}`,
      orderId: orderId,
      shootDate: requirement?.date || '2024-06-15',
      shootTime: `${requirement?.startTime || '08:00'}-${requirement?.endTime || '12:00'}`,
      shootList: [
        { item: '场地全景航拍', confirmed: false },
        { item: '关键场景拍摄', confirmed: false },
        { item: '细节特写拍摄', confirmed: false },
        { item: '备用素材补充', confirmed: false },
      ],
      shootListConfirmed: false,
      contactName: '客户本人',
      contactPhone: '138****8888',
      emergencyContact: '139****9999',
    };

    return {
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, contractSigned: true, status: 'confirmed' } : o
      ),
      schedules: [...state.schedules, newSchedule],
    };
  }),

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
      s.id === scheduleId ? { ...s, shootList, shootListConfirmed: true } : s
    ),
  })),

  submitShootListModify: (scheduleId, modifyRequest) => set((state) => ({
    schedules: state.schedules.map((s) =>
      s.id === scheduleId ? { ...s, shootListModifyRequest: modifyRequest } : s
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

  createOrderFromQuote: (quoteId) => {
    let newOrder: Order | null = null;
    set((state) => {
      const quote = state.quotes.find((q) => q.id === quoteId);
      const team = state.teams.find((t) => t.id === quote?.teamId);
      const requirement = state.requirements.find((r) => r.id === quote?.requirementId);
      
      if (!quote || !team) return state;

      newOrder = {
        id: `order-${Date.now()}`,
        requirementId: quote.requirementId,
        teamId: quote.teamId,
        quoteId: quote.id,
        teamName: team.name,
        requirementLocation: requirement?.location,
        requirementDate: requirement?.date,
        requirementStartTime: requirement?.startTime,
        requirementEndTime: requirement?.endTime,
        contractSigned: false,
        depositPaid: false,
        depositAmount: Math.round(quote.totalPrice * 0.3),
        balanceAmount: Math.round(quote.totalPrice * 0.7),
        totalAmount: quote.totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
      };

      return {
        orders: [...state.orders, newOrder],
        quotes: state.quotes.map((q) =>
          q.id === quoteId ? { ...q, status: 'accepted' } : q
        ),
      };
    });
    return newOrder;
  },
}));
