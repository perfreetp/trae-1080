import { useState } from 'react';
import { Star, MessageSquare, AlertCircle, Send, Check, Upload } from 'lucide-react';
import { useStore } from '@/store/useStore';
import StarRating from '@/components/StarRating';

export default function Review() {
  const { reviews, addReview, orders, addComplaint } = useStore();
  const [activeTab, setActiveTab] = useState<'review' | 'complaint'>('review');
  const [showSuccess, setShowSuccess] = useState(false);
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    professionalism: 5,
    timeliness: 5,
    communication: 5,
    comment: '',
  });

  const [complaintForm, setComplaintForm] = useState({
    orderId: '',
    reason: '',
    description: '',
  });

  const handleSubmitReview = () => {
    const overallRating = Math.round(
      (reviewForm.professionalism + reviewForm.timeliness + reviewForm.communication) / 3
    );

    const newReview = {
      id: `rev-${Date.now()}`,
      orderId: 'order-004',
      userId: 'user-001',
      teamId: 'team-006',
      teamName: '苍穹航拍',
      professionalism: reviewForm.professionalism,
      timeliness: reviewForm.timeliness,
      communication: reviewForm.communication,
      overallRating,
      comment: reviewForm.comment,
      createdAt: new Date().toISOString().split('T')[0],
    };

    addReview(newReview);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSubmitComplaint = () => {
    if (!complaintForm.orderId || !complaintForm.reason || !complaintForm.description) {
      return;
    }

    const complaint = {
      reason: complaintForm.reason,
      description: complaintForm.description,
      evidence: [],
      status: 'pending' as const,
    };

    const existingReview = reviews.find((r) => r.orderId === complaintForm.orderId);

    if (existingReview) {
      addComplaint(existingReview.id, complaint);
    } else {
      const order = orders.find((o) => o.id === complaintForm.orderId);
      const newReview = {
        id: `rev-${Date.now()}`,
        orderId: complaintForm.orderId,
        userId: 'user-001',
        teamId: order?.teamId || 'team-001',
        teamName: order?.teamName || '未知团队',
        professionalism: 0,
        timeliness: 0,
        communication: 0,
        overallRating: 0,
        comment: '',
        complaint,
        createdAt: new Date().toISOString().split('T')[0],
      };
      addReview(newReview);
    }

    setComplaintSuccess(true);
    
    setTimeout(() => {
      setComplaintSuccess(false);
      setComplaintForm({ orderId: '', reason: '', description: '' });
    }, 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">评价售后</h1>
        <p className="text-slate-400">评价服务质量，处理售后问题</p>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 font-medium">评价提交成功！感谢您的反馈。</span>
        </div>
      )}

      {complaintSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center gap-3">
          <Check className="w-5 h-5 text-teal-400" />
          <span className="text-teal-400 font-medium">投诉提交成功！我们会在24小时内处理您的投诉。</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab('review')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'review'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              服务评价
            </button>
            <button
              onClick={() => setActiveTab('complaint')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'complaint'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              投诉处理
            </button>
          </div>

          {activeTab === 'review' && (
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">发表评价</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                    <p className="text-slate-400 text-sm mb-2">专业度</p>
                    <StarRating
                      rating={reviewForm.professionalism}
                      onRate={(r) => setReviewForm({ ...reviewForm, professionalism: r })}
                      size={24}
                    />
                    <p className="text-2xl font-bold text-white mt-2">
                      {reviewForm.professionalism}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                    <p className="text-slate-400 text-sm mb-2">时效性</p>
                    <StarRating
                      rating={reviewForm.timeliness}
                      onRate={(r) => setReviewForm({ ...reviewForm, timeliness: r })}
                      size={24}
                    />
                    <p className="text-2xl font-bold text-white mt-2">
                      {reviewForm.timeliness}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                    <p className="text-slate-400 text-sm mb-2">沟通满意度</p>
                    <StarRating
                      rating={reviewForm.communication}
                      onRate={(r) => setReviewForm({ ...reviewForm, communication: r })}
                      size={24}
                    />
                    <p className="text-2xl font-bold text-white mt-2">
                      {reviewForm.communication}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    评价内容
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder="分享您的服务体验，帮助其他客户做出更好的选择..."
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    上传图片（选填）
                  </label>
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-teal-500/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">点击或拖拽上传对比图片</p>
                  </div>
                </div>

                <button
                  onClick={handleSubmitReview}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all"
                >
                  <Send className="w-5 h-5" />
                  提交评价
                </button>
              </div>
            </div>
          )}

          {activeTab === 'complaint' && (
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">提交投诉</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    相关订单
                  </label>
                  <select
                    value={complaintForm.orderId}
                    onChange={(e) => setComplaintForm({ ...complaintForm, orderId: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="">请选择相关订单</option>
                    {orders.map((order) => (
                      <option key={order.id} value={order.id}>
                        订单 #{order.id} - {order.teamName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    投诉原因
                  </label>
                  <select
                    value={complaintForm.reason}
                    onChange={(e) => setComplaintForm({ ...complaintForm, reason: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="">请选择投诉原因</option>
                    <option value="quality">拍摄质量问题</option>
                    <option value="delay">交付延误</option>
                    <option value="attitude">服务态度问题</option>
                    <option value="other">其他问题</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    详细描述
                  </label>
                  <textarea
                    value={complaintForm.description}
                    onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                    placeholder="请详细描述您遇到的问题，我们会尽快处理..."
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    上传证据（选填）
                  </label>
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-teal-500/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">上传相关证据图片或视频</p>
                  </div>
                </div>

                <button 
                  onClick={handleSubmitComplaint}
                  disabled={!complaintForm.orderId || !complaintForm.reason || !complaintForm.description}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <AlertCircle className="w-5 h-5" />
                  提交投诉
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">我的评价 / 投诉记录</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 rounded-xl bg-slate-900/50 border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{review.teamName}</span>
                    <span className="text-slate-500 text-xs">{review.createdAt}</span>
                  </div>
                  <div className="text-xs text-slate-500 mb-2">
                    订单号：{review.orderId}
                  </div>
                  {review.overallRating > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                      <StarRating rating={review.overallRating} readonly size={14} />
                      <span className="text-slate-400 text-sm ml-2">
                        {review.overallRating}分
                      </span>
                    </div>
                  )}
                  {review.comment && (
                    <p className="text-slate-400 text-sm line-clamp-2">{review.comment}</p>
                  )}
                  {review.complaint && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">投诉原因</span>
                          <span className="text-slate-300">
                            {review.complaint.reason === 'quality' ? '拍摄质量问题' :
                             review.complaint.reason === 'delay' ? '交付延误' :
                             review.complaint.reason === 'attitude' ? '服务态度问题' : '其他问题'}
                          </span>
                        </div>
                        {review.complaint.description && (
                          <div className="text-xs">
                            <span className="text-slate-500">投诉描述：</span>
                            <span className="text-slate-400 ml-1 line-clamp-2">{review.complaint.description}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md ${
                              review.complaint.status === 'pending'
                                ? 'bg-amber-500/10 text-amber-400'
                                : review.complaint.status === 'processing'
                                ? 'bg-blue-500/10 text-blue-400'
                                : 'bg-emerald-500/10 text-emerald-400'
                            }`}
                          >
                            {review.complaint.status === 'pending'
                              ? '待处理'
                              : review.complaint.status === 'processing'
                              ? '处理中'
                              : '已解决'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-6 h-6 text-teal-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-teal-400 font-medium mb-1">需要帮助？</h3>
                <p className="text-teal-200/70 text-sm">
                  如有任何问题，可联系平台客服，我们将在24小时内回复您。
                </p>
                <p className="text-teal-300 text-sm mt-2">客服热线：400-888-8888</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
