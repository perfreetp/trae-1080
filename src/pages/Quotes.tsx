import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Camera, Film, Check, X, Star, ChevronRight, Zap, FileText, MapPin, Calendar, DollarSign, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { useStore } from '@/store/useStore';
import StarRating from '@/components/StarRating';

const packages = [
  { id: 'basic', label: '基础版', desc: '适合简单拍摄需求' },
  { id: 'standard', label: '标准版', desc: '推荐大多数客户' },
  { id: 'premium', label: '高级版', desc: '电影级专业服务' },
];

const categoryLabels: Record<string, string> = {
  wedding: '婚礼航拍',
  realestate: '地产航拍',
  event: '活动航拍',
  other: '其他',
};

const inquiryStatusLabels: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: '待回复', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  replied: { label: '已回复', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  accepted: { label: '已采纳', color: 'text-teal-400', bg: 'bg-teal-500/10' },
  rejected: { label: '已拒绝', color: 'text-red-400', bg: 'bg-red-500/10' },
};

export default function Quotes() {
  const navigate = useNavigate();
  const { quotes, teams, requirements, inquiries, updateQuoteStatus, createOrderFromQuote } = useStore();
  const [selectedPackage, setSelectedPackage] = useState('standard');
  const latestRequirement = requirements.length > 0 ? requirements[requirements.length - 1] : null;
  const [showRequirementDetail, setShowRequirementDetail] = useState<string | null>(
    latestRequirement?.id || null
  );

  const getTeamById = (teamId: string) => teams.find((t) => t.id === teamId);
  const getRequirementById = (reqId: string) => requirements.find((r) => r.id === reqId);

  const groupedData = useMemo(() => {
    const groups: Record<string, { requirement: typeof requirements[0] | null; inquiries: typeof inquiries; quotes: typeof quotes }> = {};
    
    requirements.forEach((req) => {
      groups[req.id] = {
        requirement: req,
        inquiries: [],
        quotes: [],
      };
    });

    inquiries.forEach((inquiry) => {
      if (!groups[inquiry.requirementId]) {
        groups[inquiry.requirementId] = {
          requirement: getRequirementById(inquiry.requirementId) || null,
          inquiries: [],
          quotes: [],
        };
      }
      groups[inquiry.requirementId].inquiries.push(inquiry);
    });

    quotes.forEach((quote) => {
      if (!groups[quote.requirementId]) {
        groups[quote.requirementId] = {
          requirement: getRequirementById(quote.requirementId) || null,
          inquiries: [],
          quotes: [],
        };
      }
      groups[quote.requirementId].quotes.push(quote);
    });

    return groups;
  }, [requirements, inquiries, quotes, getRequirementById]);

  const hasAcceptedQuote = useMemo(() => {
    return quotes.some((q) => q.status === 'accepted');
  }, [quotes]);

  const handleAccept = (quoteId: string) => {
    const quote = quotes.find((q) => q.id === quoteId);
    if (!quote || quote.status === 'accepted') return;
    
    const newOrder = createOrderFromQuote(quoteId);
    if (newOrder) {
      setTimeout(() => {
        navigate('/orders');
      }, 500);
    }
  };

  const handleReject = (quoteId: string) => {
    updateQuoteStatus(quoteId, 'rejected');
  };

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">报价比选</h1>
          <p className="text-slate-400">对比多家团队报价，选择最适合的方案</p>
        </div>
        <button
          onClick={() => setShowRequirementDetail(latestRequirement?.id || requirements[0]?.id || null)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-slate-300 font-medium rounded-lg hover:bg-slate-700 transition-colors border border-slate-700"
        >
          <FileText className="w-4 h-4" />
          查看需求详情
        </button>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">套餐配置</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`p-4 rounded-xl text-left transition-all ${
                selectedPackage === pkg.id
                  ? 'bg-teal-500/10 border-2 border-teal-500'
                  : 'bg-slate-900/50 border-2 border-transparent hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">{pkg.label}</span>
                {selectedPackage === pkg.id && (
                  <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <p className="text-slate-400 text-sm">{pkg.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {hasAcceptedQuote && (
        <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-teal-400 flex-shrink-0" />
            <div>
              <p className="text-teal-400 font-medium">您已接受一份报价</p>
              <p className="text-teal-200/70 text-sm">已生成订单，请到合同订单页查看并签署合同</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(groupedData).map(([reqId, data]) => {
          if (data.inquiries.length === 0 && data.quotes.length === 0) return null;

          return (
            <div key={reqId}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-teal-500 rounded-full" />
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {data.requirement?.location || '未命名需求'}
                  </h2>
                  <p className="text-slate-400 text-sm">
                    {data.requirement ? `${categoryLabels[data.requirement.category] || '其他'} · ${data.requirement.date}` : `需求ID: ${reqId}`}
                  </p>
                </div>
              </div>

              {data.inquiries.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    询价记录 ({data.inquiries.length})
                  </h3>
                  <div className="space-y-3">
                    {data.inquiries.map((inquiry) => {
                      const team = getTeamById(inquiry.teamId);
                      const statusConfig = inquiryStatusLabels[inquiry.status];
                      return (
                        <div
                          key={inquiry.id}
                          className="bg-slate-800/30 rounded-xl border border-slate-700/30 p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              {team?.logo && (
                                <img
                                  src={team.logo}
                                  alt={team.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-medium">{inquiry.teamName}</span>
                                  <span className={`px-2 py-0.5 text-xs rounded-md ${statusConfig.bg} ${statusConfig.color}`}>
                                    {statusConfig.label}
                                  </span>
                                </div>
                                <div className="text-slate-400 text-sm mt-1">
                                  套餐：{inquiry.packageType === 'basic' ? '基础版' : inquiry.packageType === 'standard' ? '标准版' : '高级版'}
                                  {' · '}预算：¥{inquiry.budget}
                                </div>
                                {inquiry.message && (
                                  <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                                    留言：{inquiry.message}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right text-xs text-slate-500">
                              {inquiry.createdAt}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {data.quotes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    团队报价 ({data.quotes.length})
                  </h3>
                  <div className="space-y-6">
                    {data.quotes.map((quote) => {
                      const team = getTeamById(quote.teamId);
                      if (!team) return null;

                      return (
                        <div
                          key={quote.id}
                          className={`bg-slate-800/50 rounded-2xl border overflow-hidden transition-all ${
                            quote.status === 'accepted'
                              ? 'border-teal-500/50 ring-1 ring-teal-500/20'
                              : quote.status === 'rejected'
                              ? 'border-red-500/30 opacity-60'
                              : 'border-slate-700/50 hover:border-slate-600'
                          }`}
                        >
                          <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                              <div className="flex items-start gap-4">
                                <img
                                  src={team.logo}
                                  alt={team.name}
                                  className="w-16 h-16 rounded-xl object-cover"
                                />
                                <div>
                                  <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-semibold text-white">{team.name}</h3>
                                    {quote.status === 'accepted' && (
                                      <span className="px-2 py-1 text-xs rounded-md bg-teal-500/20 text-teal-400 font-medium">
                                        已接受
                                      </span>
                                    )}
                                    {quote.status === 'rejected' && (
                                      <span className="px-2 py-1 text-xs rounded-md bg-red-500/20 text-red-400 font-medium">
                                        已拒绝
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <StarRating rating={team.rating} readonly size={14} />
                                    <span className="text-slate-400 text-sm">
                                      ({team.reviewCount}条评价)
                                    </span>
                                  </div>
                                  <p className="text-slate-400 text-sm mt-2 line-clamp-1">
                                    {team.description}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="text-slate-500 text-sm">报价金额</span>
                                <p className="text-3xl font-bold text-teal-400">¥{quote.totalPrice}</p>
                                <p className="text-slate-500 text-sm">{quote.deliveryDays}天交付</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700/50">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                                  <Clock className="w-5 h-5 text-teal-400" />
                                </div>
                                <div>
                                  <p className="text-white font-medium">{quote.flightHours}小时</p>
                                  <p className="text-slate-500 text-xs">飞行时间</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                                  <Camera className="w-5 h-5 text-teal-400" />
                                </div>
                                <div>
                                  <p className="text-white font-medium">{quote.cameras}机位</p>
                                  <p className="text-slate-500 text-xs">相机数量</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                                  <Film className="w-5 h-5 text-teal-400" />
                                </div>
                                <div>
                                  <p className="text-white font-medium">
                                    {quote.postProduction ? '包含' : '不包含'}
                                  </p>
                                  <p className="text-slate-500 text-xs">后期制作</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                                  <Zap className="w-5 h-5 text-teal-400" />
                                </div>
                                <div>
                                  <p className="text-white font-medium capitalize">
                                    {quote.packageType === 'basic'
                                      ? '基础版'
                                      : quote.packageType === 'standard'
                                      ? '标准版'
                                      : '高级版'}
                                  </p>
                                  <p className="text-slate-500 text-xs">套餐类型</p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-700/50">
                              <h4 className="text-sm font-medium text-slate-300 mb-3">服务包含</h4>
                              <div className="flex flex-wrap gap-2">
                                {quote.includes.map((item) => (
                                  <span
                                    key={item}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-700/30 text-slate-300 text-sm"
                                  >
                                    <Check className="w-3.5 h-3.5 text-teal-400" />
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {quote.status === 'pending' && !hasAcceptedQuote && (
                              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-700/50">
                                <button
                                  onClick={() => handleReject(quote.id)}
                                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-700/50 text-slate-300 font-medium rounded-lg hover:bg-slate-700 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                  拒绝
                                </button>
                                <button
                                  onClick={() => handleAccept(quote.id)}
                                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all"
                                >
                                  接受报价
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            )}

                            {quote.status === 'pending' && hasAcceptedQuote && (
                              <div className="mt-6 pt-6 border-t border-slate-700/50 flex items-center justify-end">
                                <span className="text-slate-500 text-sm">
                                  您已接受其他报价，该报价暂不可操作
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showRequirementDetail && (() => {
        const req = getRequirementById(showRequirementDetail);
        if (!req) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">需求详情</h2>
                  <button
                    onClick={() => setShowRequirementDetail(null)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm">拍摄地点</p>
                      <p className="text-white font-medium">{req.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm">拍摄日期</p>
                      <p className="text-white font-medium">{req.date}</p>
                      <p className="text-slate-400 text-xs">{req.startTime} - {req.endTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm">预算范围</p>
                      <p className="text-teal-400 font-medium">¥{req.budget}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm">需求类型</p>
                      <p className="text-white font-medium">{categoryLabels[req.category] || '其他'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-slate-500 text-sm mb-2">需求描述</p>
                  <p className="text-slate-300">{req.description}</p>
                </div>

                {req.referenceImages && req.referenceImages.length > 0 && (
                  <div>
                    <p className="text-slate-500 text-sm mb-3">参考样片</p>
                    <div className="grid grid-cols-4 gap-2">
                      {req.referenceImages.map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-slate-700">
                          <img src={img} alt={`参考样片${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-slate-800 flex items-center justify-end">
                <button
                  onClick={() => setShowRequirementDetail(null)}
                  className="px-6 py-2.5 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
