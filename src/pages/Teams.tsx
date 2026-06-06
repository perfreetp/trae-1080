import { useState } from 'react';
import { Search, MapPin, Shield, Award, Filter, X, ChevronDown, MessageSquare } from 'lucide-react';
import { useStore } from '@/store/useStore';
import StarRating from '@/components/StarRating';

export default function Teams() {
  const { teams, setSelectedTeam, selectedTeam } = useStore();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    minRating: 0,
    insuranceOnly: false,
  });

  const filteredTeams = teams.filter((team) => {
    if (searchQuery && !team.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.insuranceOnly && !team.insurance) {
      return false;
    }
    if (filters.minRating && team.rating < filters.minRating) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">航拍团队库</h1>
          <p className="text-slate-400">共找到 {filteredTeams.length} 家专业航拍团队</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            showFilters
              ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
              : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Filter className="w-4 h-4" />
          筛选
        </button>
      </div>

      {showFilters && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                所在城市
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                placeholder="输入城市名称"
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                最低价格
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                placeholder="¥"
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                最高价格
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                placeholder="¥"
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                最低评分
              </label>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
              >
                <option value={0}>不限</option>
                <option value={4}>4分以上</option>
                <option value={4.5}>4.5分以上</option>
                <option value={4.8}>4.8分以上</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.insuranceOnly}
                onChange={(e) => setFilters({ ...filters, insuranceOnly: e.target.checked })}
                className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-teal-500 focus:ring-teal-500"
              />
              <span className="text-slate-300 text-sm">仅显示已投保团队</span>
            </label>
          </div>
        </div>
      )}

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索团队名称..."
          className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            onClick={() => setSelectedTeam(team)}
            className="group bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-teal-500/30 transition-all cursor-pointer"
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-teal-400 transition-colors">
                    {team.name}
                  </h3>
                  <div className="flex items-center gap-1 text-slate-400 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    {team.location}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={team.rating} readonly size={14} />
                    <span className="text-slate-400 text-sm">({team.reviewCount}条评价)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {team.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-md bg-slate-700/50 text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
                {team.insurance && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-emerald-500/10 text-emerald-400">
                    <Shield className="w-3 h-3" />
                    已投保
                  </span>
                )}
              </div>

              <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                {team.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <div>
                  <span className="text-slate-500 text-xs">起拍价</span>
                  <p className="text-xl font-bold text-teal-400">¥{team.basePrice}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-500/10 text-teal-400 text-sm font-medium rounded-lg hover:bg-teal-500/20 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  在线询价
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <img
                    src={selectedTeam.logo}
                    alt={selectedTeam.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedTeam.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-400">{selectedTeam.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={selectedTeam.rating} readonly size={16} />
                      <span className="text-slate-400 text-sm">
                        {selectedTeam.rating} ({selectedTeam.reviewCount}条评价)
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">团队简介</h3>
                <p className="text-slate-400">{selectedTeam.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">资质证书</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTeam.certifications.map((cert) => (
                    <div
                      key={cert}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700"
                    >
                      <Award className="w-4 h-4 text-teal-400" />
                      <span className="text-slate-300 text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">设备清单</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedTeam.equipment.map((eq) => (
                    <div
                      key={eq}
                      className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm"
                    >
                      {eq}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <div>
                  <span className="text-slate-500 text-sm">起拍价格</span>
                  <p className="text-3xl font-bold text-teal-400">¥{selectedTeam.basePrice}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-6 py-2.5 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors border border-slate-700">
                    查看作品
                  </button>
                  <button className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all">
                    立即预约
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
