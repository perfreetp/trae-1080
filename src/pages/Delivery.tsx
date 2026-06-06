import { useState } from 'react';
import { Download, Eye, Image as ImageIcon, Video, Check, X, CreditCard, FileCheck, Lock } from 'lucide-react';
import { useStore } from '@/store/useStore';

const licenseOptions = [
  { id: 'personal', label: '个人使用', desc: '仅限个人非商业用途', price: 0 },
  { id: 'commercial', label: '商业授权', desc: '可用于商业宣传推广', price: 500 },
  { id: 'exclusive', label: '独家版权', desc: '买断全部版权，团队不可再用', price: 2000 },
];

export default function Delivery() {
  const { deliveries, payBalance } = useStore();
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedLicense, setSelectedLicense] = useState('personal');
  const [showPayModal, setShowPayModal] = useState(false);

  const delivery = deliveries[0];

  const handlePayBalance = () => {
    if (delivery) {
      payBalance(delivery.id);
      setShowPayModal(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">素材交付</h1>
        <p className="text-slate-400">预览、下载拍摄素材，结算尾款</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">拍摄素材</h2>
                <p className="text-slate-400 text-sm mt-1">
                  交付时间：{delivery?.deliveredAt} · 共 {delivery?.materials.length} 个文件
                </p>
              </div>
              {!delivery?.balancePaid && (
                <span className="px-3 py-1 text-sm rounded-full bg-amber-500/10 text-amber-400">
                  待支付尾款
                </span>
              )}
              {delivery?.balancePaid && (
                <span className="px-3 py-1 text-sm rounded-full bg-emerald-500/10 text-emerald-400">
                  已解锁高清
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {delivery?.materials.map((material) => (
                <div
                  key={material.id}
                  onClick={() => setSelectedMaterial(material.id)}
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={material.thumbnail}
                    alt={material.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 text-white text-xs">
                      {material.type === 'video' ? (
                        <Video className="w-3 h-3" />
                      ) : (
                        <ImageIcon className="w-3 h-3" />
                      )}
                    </span>
                  </div>
                  {!delivery?.balancePaid && (
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/60">
                        <Lock className="w-3.5 h-3.5 text-white" />
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-xs truncate">{material.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">版权授权</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {licenseOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedLicense(opt.id)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    selectedLicense === opt.id
                      ? 'bg-teal-500/10 border-2 border-teal-500'
                      : 'bg-slate-900/50 border-2 border-transparent hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{opt.label}</span>
                    {opt.price > 0 && (
                      <span className="text-teal-400 font-medium">+¥{opt.price}</span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">费用结算</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">尾款金额</span>
                <span className="text-white">¥2,240</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">版权授权</span>
                <span className="text-white">
                  {licenseOptions.find((o) => o.id === selectedLicense)?.price === 0
                    ? '免费'
                    : `¥${licenseOptions.find((o) => o.id === selectedLicense)?.price}`}
                </span>
              </div>
              <div className="h-px bg-slate-700 my-3" />
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">应付金额</span>
                <span className="text-2xl font-bold text-teal-400">
                  ¥{2240 + (licenseOptions.find((o) => o.id === selectedLicense)?.price || 0)}
                </span>
              </div>
            </div>

            {delivery?.balancePaid ? (
              <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Check className="w-5 h-5" />
                <span className="font-medium">尾款已支付</span>
              </div>
            ) : (
              <button
                onClick={() => setShowPayModal(true)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all"
              >
                <CreditCard className="w-5 h-5" />
                支付尾款
              </button>
            )}
          </div>

          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">下载说明</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span>支付尾款后可下载高清无水印原图</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span>支持批量打包下载，文件有效期30天</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span>购买商业授权可用于商业用途</span>
              </div>
            </div>
          </div>

          <button
            disabled={!delivery?.balancePaid}
            className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
              delivery?.balancePaid
                ? 'bg-slate-700 text-white hover:bg-slate-600'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Download className="w-5 h-5" />
            下载全部素材
          </button>
        </div>
      </div>

      {selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <button
            onClick={() => setSelectedMaterial(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-5xl w-full">
            <img
              src={delivery?.materials.find((m) => m.id === selectedMaterial)?.watermarkedUrl}
              alt=""
              className="w-full rounded-xl"
            />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-white font-medium">
                {delivery?.materials.find((m) => m.id === selectedMaterial)?.name}
              </p>
              {delivery?.balancePaid ? (
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                  <Download className="w-4 h-4" />
                  下载原图
                </button>
              ) : (
                <span className="text-slate-400 text-sm flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  支付尾款后可下载高清原图
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-md">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">确认支付</h2>
                <button
                  onClick={() => setShowPayModal(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-slate-400 text-sm">应付金额</p>
                <p className="text-4xl font-bold text-teal-400 mt-2">
                  ¥{2240 + (licenseOptions.find((o) => o.id === selectedLicense)?.price || 0)}
                </p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800 border border-slate-700">
                  <span className="text-slate-300">拍摄尾款</span>
                  <span className="text-white">¥2,240</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800 border border-slate-700">
                  <span className="text-slate-300">版权授权</span>
                  <span className="text-white">
                    {licenseOptions.find((o) => o.id === selectedLicense)?.label}
                  </span>
                </div>
              </div>
              <button
                onClick={handlePayBalance}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all"
              >
                确认支付
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
