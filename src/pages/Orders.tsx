import { useState } from 'react';
import { FileCheck, CreditCard, Clock, CheckCircle, XCircle, Calendar, ChevronRight, Eye, FileText, Check, X } from 'lucide-react';
import { useStore } from '@/store/useStore';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: '待确认', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  confirmed: { label: '已确认', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  shooting: { label: '拍摄中', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  delivered: { label: '已交付', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  completed: { label: '已完成', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  cancelled: { label: '已取消', color: 'text-red-400', bg: 'bg-red-500/10' },
};

export default function Orders() {
  const { orders, signContract, payDeposit, updateOrderStatus } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showContract, setShowContract] = useState<string | null>(null);
  const [showPayModal, setShowPayModal] = useState<string | null>(null);
  const [paySuccess, setPaySuccess] = useState(false);

  const handleSignContract = (orderId: string) => {
    signContract(orderId);
  };

  const handlePayDeposit = (orderId: string) => {
    payDeposit(orderId);
    setPaySuccess(true);
    setTimeout(() => {
      setPaySuccess(false);
      setShowPayModal(null);
    }, 2000);
  };

  const handleSignAndPay = (orderId: string) => {
    signContract(orderId);
    payDeposit(orderId);
    setShowContract(null);
    setShowPayModal(null);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">合同订单</h1>
        <p className="text-slate-400">管理您的所有航拍订单</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="text-2xl font-bold text-white">{orders.length}</div>
          <div className="text-slate-400 text-sm">全部订单</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="text-2xl font-bold text-blue-400">
            {orders.filter((o) => o.status === 'confirmed').length}
          </div>
          <div className="text-slate-400 text-sm">待拍摄</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="text-2xl font-bold text-purple-400">
            {orders.filter((o) => o.status === 'shooting').length}
          </div>
          <div className="text-slate-400 text-sm">拍摄中</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="text-2xl font-bold text-emerald-400">
            {orders.filter((o) => o.status === 'completed').length}
          </div>
          <div className="text-slate-400 text-sm">已完成</div>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = statusConfig[order.status];
          return (
            <div
              key={order.id}
              className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600 transition-all"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-teal-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">
                          订单 #{order.id}
                        </h3>
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-md ${status.bg} ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mt-1">
                        服务团队：{order.teamName}
                      </p>
                      <p className="text-slate-500 text-xs mt-1">
                        创建时间：{order.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-slate-500 text-sm">订单金额</p>
                      <p className="text-xl font-bold text-white">¥{order.totalAmount}</p>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                      <ChevronRight className={`w-5 h-5 transition-transform ${selectedOrder === order.id ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <FileCheck
                      className={`w-5 h-5 ${
                        order.contractSigned ? 'text-emerald-400' : 'text-slate-600'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        order.contractSigned ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {order.contractSigned ? '合同已签署' : '待签署合同'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard
                      className={`w-5 h-5 ${
                        order.depositPaid ? 'text-emerald-400' : 'text-slate-600'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        order.depositPaid ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {order.depositPaid ? '定金已支付' : '待支付定金'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-slate-600" />
                    <span className="text-sm text-slate-500">
                      定金 ¥{order.depositAmount} / 尾款 ¥{order.balanceAmount}
                    </span>
                  </div>
                </div>

                {!order.contractSigned && order.status === 'pending' && (
                  <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-700/50">
                    <button
                      onClick={() => setShowContract(order.id)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-700/50 text-slate-300 font-medium rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      查看合同
                    </button>
                    <button 
                      onClick={() => handleSignAndPay(order.id)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all"
                    >
                      签署并支付定金
                    </button>
                  </div>
                )}

                {order.contractSigned && !order.depositPaid && order.status === 'pending' && (
                  <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-700/50">
                    <button 
                      onClick={() => setShowPayModal(order.id)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all"
                    >
                      <CreditCard className="w-4 h-4" />
                      支付定金 ¥{order.depositAmount}
                    </button>
                  </div>
                )}
              </div>

              {selectedOrder === order.id && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-700/50">
                  {(order.requirementLocation || order.requirementDate) && (
                    <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-slate-300 mb-3">需求信息</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {order.requirementLocation && (
                          <div>
                            <span className="text-slate-500">拍摄地点</span>
                            <p className="text-white mt-1">{order.requirementLocation}</p>
                          </div>
                        )}
                        {order.requirementDate && (
                          <div>
                            <span className="text-slate-500">拍摄日期</span>
                            <p className="text-white mt-1">{order.requirementDate}</p>
                          </div>
                        )}
                        {(order.requirementStartTime || order.requirementEndTime) && (
                          <div>
                            <span className="text-slate-500">拍摄时段</span>
                            <p className="text-white mt-1">
                              {order.requirementStartTime} - {order.requirementEndTime}
                            </p>
                          </div>
                        )}
                        <div>
                          <span className="text-slate-500">订单金额</span>
                          <p className="text-teal-400 font-medium mt-1">¥{order.totalAmount}</p>
                          <p className="text-slate-500 text-xs mt-0.5">
                            定金 ¥{order.depositAmount} / 尾款 ¥{order.balanceAmount}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-slate-300 mb-4">订单进度</h4>
                    <div className="flex items-center">
                      {[
                        { key: 'pending', label: '创建订单' },
                        { key: 'confirmed', label: '确认订单' },
                        { key: 'shooting', label: '执行拍摄' },
                        { key: 'delivered', label: '素材交付' },
                        { key: 'completed', label: '订单完成' },
                      ].map((step, idx, arr) => {
                        const stepIndex = [
                          'pending',
                          'confirmed',
                          'shooting',
                          'delivered',
                          'completed',
                        ].indexOf(order.status);
                        const isCompleted = idx <= stepIndex;
                        const isCurrent = idx === stepIndex;

                        return (
                          <div key={step.key} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isCompleted
                                    ? 'bg-teal-500 text-white'
                                    : 'bg-slate-800 text-slate-500'
                                } ${isCurrent ? 'ring-2 ring-teal-500/50' : ''}`}
                              >
                                {isCompleted ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <span className="text-xs">{idx + 1}</span>
                                )}
                              </div>
                              <span
                                className={`text-xs mt-2 ${
                                  isCompleted ? 'text-slate-300' : 'text-slate-500'
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                            {idx < arr.length - 1 && (
                              <div
                                className={`flex-1 h-0.5 mx-2 ${
                                  isCompleted ? 'bg-teal-500' : 'bg-slate-700'
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">航拍服务合同</h2>
                <button
                  onClick={() => setShowContract(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4 text-slate-300 text-sm">
              <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
                <h4 className="text-white font-medium mb-3">订单详情</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500">服务团队</span>
                    <p className="text-white mt-1">{orders.find(o => o.id === showContract)?.teamName || '-'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">订单编号</span>
                    <p className="text-white mt-1">{showContract}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">合同总金额</span>
                    <p className="text-teal-400 font-medium mt-1">¥{orders.find(o => o.id === showContract)?.totalAmount || 4800}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">定金金额</span>
                    <p className="text-white mt-1">¥{orders.find(o => o.id === showContract)?.depositAmount || 1440}</p>
                  </div>
                </div>
              </div>

              <p>
                <strong className="text-white">第一条 服务内容</strong>
              </p>
              <p>
                1.1 甲方委托乙方进行航拍服务，具体拍摄内容、时间、地点以订单详情为准。
              </p>
              <p>
                1.2 乙方应按照行业标准提供专业的航拍服务，确保拍摄质量和交付时间。
              </p>

              <p>
                <strong className="text-white">第二条 费用与支付</strong>
              </p>
              <p>
                2.1 本合同总金额为人民币 ¥{orders.find(o => o.id === showContract)?.totalAmount || 4800} 元整。
              </p>
              <p>
                2.2 合同签署后，甲方应支付 30% 定金（¥{orders.find(o => o.id === showContract)?.depositAmount || 1440} 元），剩余 70%
                尾款（¥{orders.find(o => o.id === showContract)?.balanceAmount || 3360} 元）在素材交付确认后支付。
              </p>

              <p>
                <strong className="text-white">第三条 版权与使用</strong>
              </p>
              <p>
                3.1 乙方拥有航拍素材的原始版权。
              </p>
              <p>
                3.2 甲方在支付全部款项后，获得该项目素材的使用权。
              </p>

              <p>
                <strong className="text-white">第四条 违约责任</strong>
              </p>
              <p>
                4.1 如因甲方原因取消拍摄，定金不予退还。
              </p>
              <p>
                4.2 如因乙方原因未能完成拍摄，应双倍返还定金。
              </p>
            </div>
            <div className="p-6 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowContract(null)}
                className="px-6 py-2.5 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors"
              >
                关闭
              </button>
              <button 
                onClick={() => handleSignContract(showContract)}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all"
              >
                同意并签署
              </button>
            </div>
          </div>
        </div>
      )}

      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-md">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">支付定金</h2>
                <button
                  onClick={() => setShowPayModal(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {paySuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">支付成功！</h3>
                <p className="text-slate-400">定金已支付，订单已确认。请等待团队联系您确认拍摄细节。</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="text-center mb-6">
                  <p className="text-slate-400 text-sm">支付金额</p>
                  <p className="text-4xl font-bold text-teal-400 mt-2">
                    ¥{orders.find(o => o.id === showPayModal)?.depositAmount || 1440}
                  </p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800 border border-slate-700">
                    <span className="text-slate-300">订单编号</span>
                    <span className="text-white">{showPayModal}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800 border border-slate-700">
                    <span className="text-slate-300">支付方式</span>
                    <span className="text-white">微信支付</span>
                  </div>
                </div>
                <button
                  onClick={() => handlePayDeposit(showPayModal)}
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all"
                >
                  确认支付
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
