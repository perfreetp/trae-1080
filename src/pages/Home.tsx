import { Link } from 'react-router-dom';
import { Plane, Camera, Shield, Clock, Star, ArrowRight, Zap, Users, Image, FileText, Calendar, Download, MessageSquare } from 'lucide-react';
import { useStore } from '@/store/useStore';
import StarRating from '@/components/StarRating';

export default function Home() {
  const { teams, portfolio } = useStore();
  const topTeams = teams.slice(0, 3);
  const featuredWorks = portfolio.slice(0, 4);

  const features = [
    { icon: Zap, title: '智能匹配', desc: 'AI 算法精准匹配最适合的航拍团队' },
    { icon: Shield, title: '资质保障', desc: '所有团队均经过严格资质审核' },
    { icon: Clock, title: '高效交付', desc: '标准化流程确保按时高质量交付' },
    { icon: Star, title: '透明评价', desc: '真实客户评价，选择更放心' },
  ];

  const steps = [
    { step: '01', title: '发布需求', desc: '填写场地、时段和拍摄要求' },
    { step: '02', title: '匹配团队', desc: '系统智能推荐合适的航拍团队' },
    { step: '03', title: '确认订单', desc: '在线比选报价，签署合同支付定金' },
    { step: '04', title: '拍摄交付', desc: '专业拍摄完成后获取高清素材' },
  ];

  return (
    <div className="space-y-20">
      <section className="relative py-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/10 to-transparent pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm mb-6">
            <Plane className="w-4 h-4" />
            专业低空航拍服务撮合平台
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            让每一帧天空视角
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
              都成为经典
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            连接婚礼、地产、活动主办方与专业航拍团队，从需求发布到素材交付，全流程保驾护航
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/requirement"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40"
            >
              立即发布需求
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/teams"
              className="inline-flex items-center gap-2 px-8 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-all border border-slate-700"
            >
              浏览团队库
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-teal-500/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4 group-hover:bg-teal-500/20 transition-colors">
                <feature.icon className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">四步开启您的航拍之旅</h2>
          <p className="text-slate-400">简单高效的流程，让航拍服务触手可及</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((item, idx) => (
            <div key={idx} className="relative">
              <div className="text-6xl font-bold text-slate-800 absolute -top-4 -left-2">
                {item.step}
              </div>
              <div className="relative pt-8">
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-slate-700 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">精选航拍团队</h2>
            <p className="text-slate-400">严格审核，专业可靠</p>
          </div>
          <Link
            to="/teams"
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium"
          >
            查看全部
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topTeams.map((team) => (
            <div
              key={team.id}
              className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-teal-500/30 transition-all group cursor-pointer"
            >
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
                  <p className="text-slate-400 text-sm">{team.location}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={team.rating} readonly size={14} />
                    <span className="text-slate-400 text-sm">({team.reviewCount})</span>
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
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <div>
                  <span className="text-slate-400 text-sm">起拍价</span>
                  <p className="text-xl font-bold text-teal-400">¥{team.basePrice}</p>
                </div>
                {team.insurance && (
                  <div className="flex items-center gap-1 text-xs text-emerald-400">
                    <Shield className="w-4 h-4" />
                    已投保
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">精选作品展示</h2>
            <p className="text-slate-400">来自专业团队的精彩航拍作品</p>
          </div>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium"
          >
            查看全部
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredWorks.map((work) => (
            <div
              key={work.id}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
            >
              <img
                src={work.thumbnail}
                alt={work.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold">{work.title}</h3>
                  <p className="text-slate-300 text-sm">{work.teamName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20 p-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">准备好开启您的航拍项目了吗？</h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
          立即发布需求，让专业航拍团队为您记录每一个珍贵瞬间
        </p>
        <Link
          to="/requirement"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/25"
        >
          免费发布需求
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-4xl font-bold text-teal-400 mb-2">500+</div>
          <div className="text-slate-400">专业航拍团队</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-teal-400 mb-2">10000+</div>
          <div className="text-slate-400">成功服务案例</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-teal-400 mb-2">98%</div>
          <div className="text-slate-400">客户满意度</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-teal-400 mb-2">24h</div>
          <div className="text-slate-400">快速响应</div>
        </div>
      </section>
    </div>
  );
}
