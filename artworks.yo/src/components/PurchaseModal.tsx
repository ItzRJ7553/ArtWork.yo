import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Lock,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PurchaseRecord } from '../types';

export const PurchaseModal: React.FC = () => {
  const { 
    isPurchaseModalOpen, 
    closePurchaseModal, 
    purchasingArtwork, 
    completePurchase,
    setActiveTab
  } = useApp();

  const { user } = useAuth();

  const [step, setStep] = useState<'review' | 'success'>('review');
  const [fullName, setFullName] = useState(user?.name || 'Alex Mercer');
  const [street, setStreet] = useState('452 Broadway, Suite 4B');
  const [city, setCity] = useState('New York');
  const [postalCode, setPostalCode] = useState('10013');
  const [country, setCountry] = useState('United States');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedRecord, setCompletedRecord] = useState<PurchaseRecord | null>(null);

  if (!isPurchaseModalOpen || !purchasingArtwork) return null;

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const record = await completePurchase(purchasingArtwork, {
        fullName,
        street,
        city,
        postalCode,
        country
      });
      setCompletedRecord(record);
      setStep('success');
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setStep('review');
    closePurchaseModal();
  };

  const handleViewPurchases = () => {
    handleClose();
    setActiveTab('account');
  };

  return (
    <AnimatePresence>
      <div 
        id="purchase-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200"
        >
          {/* Header */}
          <div className="p-6 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <h2 className="text-lg font-extrabold text-black">
                {step === 'review' ? 'Artwork Acquisition' : 'Acquisition Confirmed!'}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-zinc-400 hover:text-black rounded-full hover:bg-zinc-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {step === 'review' ? (
            <form onSubmit={handleConfirmOrder} className="p-6 space-y-5">
              {/* Artwork Summary Card */}
              <div className="flex gap-4 p-3.5 bg-zinc-50 rounded-2xl border border-zinc-100 items-center">
                <img
                  src={purchasingArtwork.image}
                  alt={purchasingArtwork.title}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl object-cover border border-zinc-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    {purchasingArtwork.category} • {purchasingArtwork.year}
                  </span>
                  <h3 className="text-base font-extrabold text-black truncate">
                    {purchasingArtwork.title}
                  </h3>
                  <p className="text-xs text-zinc-600 font-medium truncate">
                    By {purchasingArtwork.creator.name}
                  </p>
                  <p className="text-sm font-extrabold text-black mt-1 font-display">
                    ${purchasingArtwork.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Shipping Address Inputs */}
              <div>
                <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Insured Delivery Address</span>
                </h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Recipient Name"
                    required
                    className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Street Address"
                    required
                    className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-black"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      required
                      className="px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-black"
                    />
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Postal Code"
                      required
                      className="px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-black"
                    />
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Country"
                      required
                      className="px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-zinc-100 pt-3 space-y-1.5 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Artwork Price</span>
                  <span className="font-semibold text-black">${purchasingArtwork.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Art Courier & Climate-Controlled Packing</span>
                  <span className="font-semibold text-emerald-600">Complimentary</span>
                </div>
                <div className="flex justify-between">
                  <span>Museum Certificate of Authenticity</span>
                  <span className="font-semibold text-emerald-600">Included (Free)</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-black pt-2 border-t border-zinc-100">
                  <span>Total Amount</span>
                  <span className="font-display">${purchasingArtwork.price.toLocaleString()} USD</span>
                </div>
              </div>

              {/* Confirm Purchase Button */}
              <button
                type="submit"
                id="purchase-confirm-btn"
                disabled={isProcessing}
                className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isProcessing ? (
                  <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm Purchase • ${purchasingArtwork.price.toLocaleString()}</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-zinc-400 text-center">
                Prototype Purchase Flow • No real payment captured • Records to My Purchases
              </p>
            </form>
          ) : (
            /* Success Step */
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-black">
                  Congratulations!
                </h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                  You are now the certified owner of <strong>{completedRecord?.artworkTitle}</strong> by {completedRecord?.creatorName}.
                </p>
              </div>

              {/* Authenticity Plaque */}
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Certificate of Authenticity
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Registered
                  </span>
                </div>
                <p className="text-sm font-mono font-bold text-zinc-800">
                  {completedRecord?.certificateId}
                </p>
                <p className="text-[11px] text-zinc-500">
                  Shipped to: {completedRecord?.shippingAddress.street}, {completedRecord?.shippingAddress.city}
                </p>
              </div>

              <div className="space-y-2">
                <button
                  id="purchase-view-account-btn"
                  onClick={handleViewPurchases}
                  className="w-full py-3 bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  View in My Purchases
                </button>
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
