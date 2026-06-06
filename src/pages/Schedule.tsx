import { useState } from 'react';
import { Calendar, Clock, User, Phone, AlertTriangle, Check, X, Edit3, ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function Schedule() {
  const { schedules, orders } = useStore();
  const [showReschedule, setShowReschedule] = useState(false);
  const [shootList, setShootList] = useState(schedules[0]?.shootList || []);

  const toggleShootItem = (index: number) => {
    setShootList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, confirmed: !item.confirmed } : item))
    );
  };

  const schedule = schedules[0];
  const order = orders.find((o) => o.id === schedule?.orderId);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">拍摄日程</h1>
        <p className="text-slate-400">管理拍摄时间、确认拍摄清单</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">拍摄信息</h2>
              {order && (
                <span className="px-3 py-1 text-sm rounded-full bg-purple-500/10 text-purple-400">
                  拍摄中
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">拍摄日期</p>
                  <p className="text-white font-medium">{schedule?.shootDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">拍摄时段</p>
                  <p className="text-white font-medium">{schedule?.shootTime}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">拍摄清单</h3>
                <span className="text-slate-400 text-sm">
                  {shootList.filter((i) => i.confirmed).length}/{shootList.length} 已确认
                </span>
              </div>
              <div className="space-y-3">
                {shootList.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleShootItem(idx)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      item.confirmed
                        ? 'bg-teal-500/10 border border-teal-500/30'
                        : 'bg-slate-900/50 border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center ${
                        item.confirmed
                          ? 'bg-teal-500 text-white'
                          : 'bg-slate-700 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span
                      className={`${
                        item.confirmed ? 'text-teal-400' : 'text-slate-300'
                      }`}
                    >
                      {item.item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700/50">
              <button
                onClick={() => setShowReschedule(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                申请改期
              </button>
              <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all">
                <Check className="w-4 h-4" />
                确认拍摄清单
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">现场联系人</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  联系人姓名
                </label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                  <User className="w-5 h-5 text-slate-500" />
                  <span className="text-white">{schedule?.contactName}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  联系电话
                </label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                  <Phone className="w-5 h-5 text-slate-500" />
                  <span className="text-white">{schedule?.contactPhone}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  紧急联系人
                </label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                  <Phone className="w-5 h-5 text-amber-500" />
                  <span className="text-white">{schedule?.emergencyContact}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">拍摄日历</h3>
            <div className="bg-slate-900/50 rounded-xl p-4">
              <div className="text-center mb-4">
                <p className="text-white font-semibold">2024年6月</p>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
                  <div key={day} className="text-slate-500 py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }).map((_, idx) => {
                  const day = idx - 5;
                  const isShootDay = day === 10;
                  const isToday = day === 6;
                  return (
                    <div
                      key={idx}
                      className={`py-2 rounded-lg text-sm ${
                        day <= 0 || day > 30
                          ? 'text-slate-700'
                          : isShootDay
                          ? 'bg-teal-500 text-white font-medium'
                          : isToday
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {day > 0 && day <= 30 ? day : ''}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-amber-400 font-medium mb-1">温馨提示</h3>
                <p className="text-amber-200/70 text-sm">
                  拍摄前一天请确保场地无障碍，天气情况将提前24小时通知，如需改期请至少提前48小时申请。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showReschedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-md">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">申请改期</h2>
                <button
                  onClick={() => setShowReschedule(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  改期原因
                </label>
                <textarea
                  placeholder="请详细说明改期原因..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  期望新日期
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowReschedule(false)}
                className="px-6 py-2.5 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => setShowReschedule(false)}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
              >
                提交申请
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
