import { useState } from 'react';
import { Clock, Camera, Film, Check, X, Star, ChevronRight, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';
import StarRating from '@/components/StarRating';

const packages = [
  { id: 'basic', label: '基础版', desc: '适合简单拍摄需求' },
  { id: 'standard', label: '标准版', desc: '推荐大多数客户' },
  { id: 'premium', label: '高级版', desc: '电影级专业服务' },
];

export default function Quotes() {
  const { quotes, teams, updateQuoteStatus } = useStore();
  const [selectedPackage, setSelectedPackage] = useState('standard');

  const getTeamById = (teamId: string) => teams.find((t) => t.id === teamId);

  const handleAccept = (quoteId: string) => {
    updateQuoteStatus(quoteId, 'accepted');
  };

  const handleReject = (quoteId: string) => {
    updateQuoteStatus(quoteId, 'rejected');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">报价比选</h1>
        <p className="text-slate-400">对比多家团队报价，选择最适合的方案</p>
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

      <div className="space-y-6">
        {quotes.map((quote) => {
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

                {quote.status === 'pending' && (
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
