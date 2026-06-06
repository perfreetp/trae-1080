import { useState } from 'react';
import { Calendar, Clock, User, Phone, AlertTriangle, Check, X, Edit3, ChevronRight, FileText } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function Schedule() {
  const { schedules, orders, confirmShootList, submitReschedule, submitShootListModify } = useStore();
  const [showReschedule, setShowReschedule] = useState(false);
  const [showModifyList, setShowModifyList] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(schedules.length > 0 ? schedules[0].id : '');
  const [rescheduleForm, setRescheduleForm] = useState({
    reason: '',
    newDate: '',
  });
  const [rescheduleSubmitted, setRescheduleSubmitted] = useState(false);
  const [modifyForm, setModifyForm] = useState({
    reason: '',
  });
  const [modifySubmitted, setModifySubmitted] = useState(false);

  const currentSchedule = schedules.find(s => s.id === selectedScheduleId) || schedules[0];
  const currentOrder = currentSchedule ? orders.find(o => o.id === currentSchedule.orderId) : null;
  const [shootList, setShootList] = useState(currentSchedule?.shootList || []);
  const [modifyShootList, setModifyShootList] = useState(currentSchedule?.shootList || []);

  const shootListConfirmed = currentSchedule?.shootListConfirmed || false;

  const toggleShootItem = (index: number) => {
    if (shootListConfirmed) return;
    setShootList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, confirmed: !item.confirmed } : item))
    );
  };

  const toggleModifyShootItem = (index: number) => {
    setModifyShootList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, confirmed: !item.confirmed } : item))
    );
  };

  const handleConfirmShootList = () => {
    if (currentSchedule) {
      confirmShootList(currentSchedule.id, shootList);
    }
  };

  const handleSubmitReschedule = () => {
    if (currentSchedule && rescheduleForm.reason && rescheduleForm.newDate) {
      submitReschedule(currentSchedule.id, {
        reason: rescheduleForm.reason,
        newDate: rescheduleForm.newDate,
        status: 'pending',
      });
      setRescheduleSubmitted(true);
      setTimeout(() => {
        setShowReschedule(false);
        setRescheduleSubmitted(false);
        setRescheduleForm({ reason: '', newDate: '' });
      }, 2000);
    }
  };

  const handleOpenModifyList = () => {
    setModifyShootList(currentSchedule?.shootList || []);
    setModifyForm({ reason: '' });
    setModifySubmitted(false);
    setShowModifyList(true);
  };

  const handleSubmitModifyList = () => {
    if (currentSchedule && modifyForm.reason) {
      submitShootListModify(currentSchedule.id, {
        reason: modifyForm.reason,
        newItems: modifyShootList,
        status: 'pending',
      });
      setModifySubmitted(true);
      setTimeout(() => {
        setShowModifyList(false);
        setModifySubmitted(false);
      }, 2000);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">拍摄日程</h1>
            <p className="text-slate-400">管理拍摄时间、确认拍摄清单</p>
          </div>
          {schedules.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">选择订单：</span>
              <select
                value={selectedScheduleId}
                onChange={(e) => {
                  setSelectedScheduleId(e.target.value);
                  const sch = schedules.find(s => s.id === e.target.value);
                  if (sch) {
                    setShootList(sch.shootList);
                    setModifyShootList(sch.shootList);
                  }
                }}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-teal-500"
              >
                {schedules.map((sch) => {
                  const ord = orders.find(o => o.id === sch.orderId);
                  return (
                    <option key={sch.id} value={sch.id}>
                      {ord?.teamName || '未知团队'} - {sch.shootDate}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {currentSchedule?.rescheduleRequest && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-amber-400 font-medium mb-2">改期申请审核中</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-amber-200/70">期望新日期</span>
                      <span className="text-white">{currentSchedule.rescheduleRequest.newDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-200/70">改期原因</span>
                      <span className="text-white">{currentSchedule.rescheduleRequest.reason}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-200/70">审核状态</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md bg-amber-500/20 text-amber-400">
                        待审核
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentSchedule?.shootListModifyRequest && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-blue-400 font-medium mb-2">清单修改申请审核中</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-200/70">修改原因</span>
                      <span className="text-white">{currentSchedule.shootListModifyRequest.reason}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200/70">审核状态</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md bg-blue-500/20 text-blue-400">
                        待审核
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">拍摄信息</h2>
              <span className="px-3 py-1 text-sm rounded-full bg-purple-500/10 text-purple-400">
                拍摄中
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">拍摄日期</p>
                  <p className="text-white font-medium">{currentSchedule?.shootDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">拍摄时段</p>
                  <p className="text-white font-medium">{currentSchedule?.shootTime}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">拍摄清单</h3>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-sm">
                    {shootList.filter((i) => i.confirmed).length}/{shootList.length} 已确认
                  </span>
                  {shootListConfirmed && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md bg-emerald-500/20 text-emerald-400">
                      <Check className="w-3 h-3" />
                      已提交
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {shootList.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleShootItem(idx)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      item.confirmed
                        ? 'bg-teal-500/10 border border-teal-500/30'
                        : 'bg-slate-900/50 border border-slate-700 hover:border-slate-600'
                    } ${shootListConfirmed ? 'cursor-default' : 'cursor-pointer'}`}
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
              <div className="flex items-center gap-3">
                {shootListConfirmed && !currentSchedule?.shootListModifyRequest && (
                  <button
                    onClick={handleOpenModifyList}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 text-slate-300 font-medium rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    申请修改清单
                  </button>
                )}
                {!shootListConfirmed ? (
                  <button 
                    onClick={handleConfirmShootList}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    确认拍摄清单
                  </button>
                ) : (
                  <button 
                    disabled
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500/20 text-emerald-400 font-medium rounded-lg cursor-default"
                  >
                    <Check className="w-4 h-4" />
                    拍摄清单已确认
                  </button>
                )}
              </div>
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
                  <span className="text-white">{currentSchedule?.contactName}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  联系电话
                </label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                  <Phone className="w-5 h-5 text-slate-500" />
                  <span className="text-white">{currentSchedule?.contactPhone}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  紧急联系人
                </label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                  <Phone className="w-5 h-5 text-amber-500" />
                  <span className="text-white">{currentSchedule?.emergencyContact}</span>
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

            {rescheduleSubmitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-teal-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">改期申请已提交！</h3>
                <p className="text-slate-400">团队将在24小时内审核您的改期申请，请耐心等待。</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    改期原因
                  </label>
                  <textarea
                    value={rescheduleForm.reason}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, reason: e.target.value })}
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
                    value={rescheduleForm.newDate}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, newDate: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            )}

            {!rescheduleSubmitted && (
              <div className="p-6 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowReschedule(false)}
                  className="px-6 py-2.5 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmitReschedule}
                  disabled={!rescheduleForm.reason || !rescheduleForm.newDate}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  提交申请
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showModifyList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">申请修改清单</h2>
                <button
                  onClick={() => setShowModifyList(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {modifySubmitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-teal-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">修改申请已提交！</h3>
                <p className="text-slate-400">团队将在24小时内审核您的清单修改申请，请耐心等待。</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    修改原因
                  </label>
                  <textarea
                    value={modifyForm.reason}
                    onChange={(e) => setModifyForm({ ...modifyForm, reason: e.target.value })}
                    placeholder="请详细说明修改清单的原因..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-3">
                    修改后的清单
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {modifyShootList.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleModifyShootItem(idx)}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                          item.confirmed
                            ? 'bg-teal-500/10 border border-teal-500/30'
                            : 'bg-slate-800 border border-slate-700 hover:border-slate-600'
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
              </div>
            )}

            {!modifySubmitted && (
              <div className="p-6 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowModifyList(false)}
                  className="px-6 py-2.5 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmitModifyList}
                  disabled={!modifyForm.reason}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  提交申请
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
