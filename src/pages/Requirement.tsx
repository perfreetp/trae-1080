import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, DollarSign, Upload, FileText, Send, Check, Sparkles, X, Image as ImageIcon } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Requirement } from '@/types';

const categories = [
  { id: 'wedding', label: '婚礼航拍' },
  { id: 'realestate', label: '地产航拍' },
  { id: 'event', label: '活动航拍' },
  { id: 'other', label: '其他' },
];

export default function Requirement() {
  const navigate = useNavigate();
  const { addRequirement, requirements } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    budget: '',
    category: '',
    description: '',
    referenceImages: [] as string[],
    styleNote: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (formData.referenceImages.length >= 9) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          updateField('referenceImages', [...formData.referenceImages, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = formData.referenceImages.filter((_, i) => i !== index);
    updateField('referenceImages', newImages);
  };

  const handleSubmit = () => {
    const newRequirement: Requirement = {
      id: `req-${Date.now()}`,
      userId: 'user-001',
      location: formData.location,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      budget: Number(formData.budget) || 0,
      category: (formData.category as Requirement['category']) || 'other',
      description: formData.description,
      referenceImages: formData.referenceImages,
      status: 'published',
      createdAt: new Date().toISOString().split('T')[0],
    };

    addRequirement(newRequirement);
    setSubmitted(true);
    setTimeout(() => {
      navigate('/teams');
    }, 2000);
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-20 h-20 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-teal-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">需求发布成功！</h2>
        <p className="text-slate-400 mb-8">
          系统正在为您智能匹配最合适的航拍团队，即将跳转到团队库...
        </p>
        <p className="text-slate-500 text-sm">
          您当前共有 {requirements.length} 条需求记录
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">发布航拍需求</h1>
        <p className="text-slate-400">填写以下信息，让我们为您匹配最合适的航拍团队</p>
      </div>

      <div className="flex items-center justify-center mb-10">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= s
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {step > s ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`w-20 h-1 mx-2 rounded transition-all ${
                  step > s ? 'bg-teal-500' : 'bg-slate-800'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">基础信息</h2>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                拍摄场地地址
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="请输入详细地址"
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                拍摄类型
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateField('category', cat.id)}
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                      formData.category === cat.id
                        ? 'bg-teal-500/20 border border-teal-500 text-teal-400'
                        : 'bg-slate-900/50 border border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  拍摄日期
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  开始时间
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => updateField('startTime', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  结束时间
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => updateField('endTime', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                预算范围
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => updateField('budget', e.target.value)}
                  placeholder="请输入预算金额（元）"
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">参考样片</h2>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-teal-500/50 transition-colors cursor-pointer"
            >
              <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-300 font-medium mb-2">拖拽或点击上传参考样片</p>
              <p className="text-slate-500 text-sm">支持 JPG、PNG 格式，最多上传 9 张（已上传 {formData.referenceImages.length}/9）</p>
            </div>

            {formData.referenceImages.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {formData.referenceImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={img} alt={`参考样片 ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(idx);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                风格备注（选填）
              </label>
              <textarea
                value={formData.styleNote}
                onChange={(e) => updateField('styleNote', e.target.value)}
                placeholder="描述您期望的拍摄风格、色调或其他参考说明..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors resize-none"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">需求说明</h2>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                详细需求描述
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="请详细描述您的拍摄需求，包括必拍场景、特殊要求、交付标准等..."
                  rows={6}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white mb-2">智能匹配服务</h3>
                  <p className="text-slate-400 text-sm">
                    提交需求后，系统将根据您的位置、预算和拍摄类型，自动匹配 3-5
                    家最合适的航拍团队供您选择。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold text-white mb-4">需求摘要</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">拍摄地点</span>
                  <span className="text-white">{formData.location || '未填写'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">拍摄类型</span>
                  <span className="text-white">{categories.find(c => c.id === formData.category)?.label || '未选择'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">拍摄时间</span>
                  <span className="text-white">{formData.date ? `${formData.date} ${formData.startTime}-${formData.endTime}` : '未填写'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">预算金额</span>
                  <span className="text-white">¥{formData.budget || '未填写'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">参考样片</span>
                  <span className="text-white">{formData.referenceImages.length} 张</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-700/50">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="px-6 py-2.5 text-slate-300 hover:text-white font-medium transition-colors"
            >
              上一步
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={nextStep}
              className="px-8 py-2.5 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
            >
              下一步
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all"
            >
              <Send className="w-4 h-4" />
              发布需求
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
