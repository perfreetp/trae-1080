import { useState } from 'react';
import { Search, X, Play, Tag, User } from 'lucide-react';
import { useStore } from '@/store/useStore';

const categories = [
  { id: 'all', label: '全部' },
  { id: 'wedding', label: '婚礼' },
  { id: 'realestate', label: '地产' },
  { id: 'event', label: '活动' },
  { id: 'cityscape', label: '城市风光' },
];

export default function Portfolio() {
  const { portfolio, portfolioCategory, setPortfolioCategory, setSelectedPortfolio, selectedPortfolio } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPortfolio = portfolio.filter((item) => {
    if (portfolioCategory !== 'all' && item.category !== portfolioCategory) {
      return false;
    }
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">作品展示</h1>
          <p className="text-slate-400">来自专业航拍团队的精彩作品</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setPortfolioCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              portfolioCategory === cat.id
                ? 'bg-teal-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索作品..."
            className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-teal-500 w-48"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPortfolio.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedPortfolio(item)}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <User className="w-3.5 h-3.5" />
                  {item.teamName}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedPortfolio.images[0]}
                alt={selectedPortfolio.title}
                className="w-full aspect-video object-cover"
              />
              <button
                onClick={() => setSelectedPortfolio(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedPortfolio.title}
                  </h2>
                  <div className="flex items-center gap-4 text-slate-400 text-sm">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {selectedPortfolio.teamName}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedPortfolio.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-500/10 text-teal-400 text-xs"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-slate-400 mb-6">{selectedPortfolio.description}</p>

              {selectedPortfolio.images.length > 1 && (
                <div>
                  <h3 className="text-white font-semibold mb-3">更多图片</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {selectedPortfolio.images.slice(1).map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-lg overflow-hidden"
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-800">
                <button className="px-6 py-2.5 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors border border-slate-700">
                  收藏作品
                </button>
                <button className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all">
                  预约该团队
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
