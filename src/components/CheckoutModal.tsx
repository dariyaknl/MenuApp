import React, { useMemo, useState } from 'react';
import {
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  Flame,
  Minus,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { CartItem, PaymentMethodId, StudentProfile } from '../types';

interface CheckoutModalProps {
  items: CartItem[];
  isTrayMode: boolean;
  profile: StudentProfile;
  isFirstOrder: boolean;
  onClose: () => void;
  onUpdateQty: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onConfirmOrder: (payload: {
    items: CartItem[];
    paymentMethod: PaymentMethodId;
    pickupWindow: string;
    includeWelcomeTea: boolean;
  }) => void;
}

const PICKUP_SLOTS = ['ASAP (~10 mins)', '12:30 Break', '13:15 Rush', '18:30 Dinner'];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  items,
  isTrayMode,
  profile,
  isFirstOrder,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onConfirmOrder,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>(
    profile.defaultPayment
  );
  const [pickupWindow, setPickupWindow] = useState(PICKUP_SLOTS[0]);
  const [includeWelcomeTea, setIncludeWelcomeTea] = useState(isFirstOrder);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalKgs = useMemo(
    () => items.reduce((sum, item) => sum + item.lineTotalKgs, 0),
    [items]
  );

  const handleConfirm = () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmOrder({
        items,
        paymentMethod,
        pickupWindow,
        includeWelcomeTea,
      });
    }, 550);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#16142A]/55 backdrop-blur-xs flex items-end justify-center">
      <div className="w-full max-w-[430px] bg-[#F5F4FA] rounded-t-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-white px-4 py-3.5 border-b border-[#ECEAF6] flex items-center justify-between">
          <div>
            <h2 className="text-[17px] font-extrabold text-[#16142A]">
              {isTrayMode ? 'Your DormEats Tray' : 'Confirm & Checkout'}
            </h2>
            <p className="text-[11.5px] text-[#6C6A82]">
              {profile.dormitory} • {profile.dormMealSpot}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="w-9 h-9 rounded-full bg-[#F4F2FC] text-[#16142A] flex items-center justify-center hover:bg-[#E7E3FA]"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center">
              <p className="text-[14px] font-bold text-[#16142A]">Your tray is empty</p>
              <p className="text-[12px] text-[#6C6A82] mt-1">
                Add a meal from Today&apos;s Menu to place a cafeteria pickup order.
              </p>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="space-y-2.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#ECEAF6] p-3 flex items-center gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.mealName}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#EFEBFB]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13.5px] font-bold text-[#16142A] truncate">
                          {item.mealName}
                        </p>
                        {isTrayMode ? (
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            aria-label="Remove item"
                            className="text-[#8E8BA6] hover:text-[#E11D48]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : null}
                      </div>
                      <p className="text-[11px] text-[#6C6A82] truncate">
                        {item.portionLabel}
                        {item.addons.length > 0
                          ? ` • ${item.addons.map((a) => a.label).join(', ')}`
                          : ''}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[13.5px] font-extrabold text-[#3F32E5] tabular-nums">
                          {item.lineTotalKgs} KGS
                        </span>
                        {isTrayMode ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.id, -1)}
                              className="w-6 h-6 rounded-full bg-[#F4F2FC] text-[#16142A] flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-[12.5px] font-bold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.id, 1)}
                              className="w-6 h-6 rounded-full bg-[#3F32E5] text-white flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11.5px] font-bold text-[#6C6A82]">
                            Qty: {item.quantity}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Welcome Tea Bonus */}
              <button
                type="button"
                onClick={() => setIncludeWelcomeTea((v) => !v)}
                className="w-full text-left bg-[#F4F2FC] border border-[#E2DCFB] rounded-2xl p-3 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4.5 h-4.5 text-[#F55A31] shrink-0" />
                  <div>
                    <p className="text-[12px] font-bold text-[#16142A]">
                      Free Samarkand Tea / Compote
                    </p>
                    <p className="text-[10.5px] text-[#6C6A82]">
                      Student welcome perk • 0 KGS
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold ${
                    includeWelcomeTea
                      ? 'bg-[#138A53] text-white'
                      : 'bg-white text-[#6C6A82]'
                  }`}
                >
                  {includeWelcomeTea ? 'Included ✓' : 'Add Free'}
                </span>
              </button>

              {/* Pickup Window */}
              <div className="bg-white rounded-2xl border border-[#ECEAF6] p-3.5">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Clock className="w-4 h-4 text-[#3F32E5]" />
                  <p className="text-[13px] font-bold text-[#16142A]">
                    Select Pickup Time
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PICKUP_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setPickupWindow(slot)}
                      className={`py-2 px-3 rounded-xl text-[11.5px] font-bold border transition ${
                        pickupWindow === slot
                          ? 'bg-[#3F32E5] border-[#3F32E5] text-white'
                          : 'bg-[#F6F5FA] border-transparent text-[#4A4863]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-[#ECEAF6] p-3.5 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[13px] font-bold text-[#16142A]">
                    Payment Method (Simulated)
                  </p>
                  <span className="text-[10.5px] font-semibold text-[#138A53] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Instant QR
                  </span>
                </div>

                {[
                  {
                    id: 'mbank' as PaymentMethodId,
                    title: 'MBank QR',
                    sub: '•••• 4821 • Zero student fee',
                    badge: 'MB',
                    badgeBg: 'bg-[#3F32E5] text-white',
                  },
                  {
                    id: 'optima' as PaymentMethodId,
                    title: 'Optima Bank',
                    sub: 'Instant campus wallet',
                    badge: 'OP',
                    badgeBg: 'bg-[#EAE7FA] text-[#3F32E5]',
                  },
                  {
                    id: 'cash' as PaymentMethodId,
                    title: 'Cash at Counter',
                    sub: 'Pay cashier on pickup with code',
                    badge: <Banknote className="w-4 h-4" />,
                    badgeBg: 'bg-[#E6F7EF] text-[#138A53]',
                  },
                ].map((opt) => {
                  const selected = paymentMethod === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentMethod(opt.id)}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition ${
                        selected
                          ? 'border-[#3F32E5] bg-[#FAF9FF]'
                          : 'border-[#ECEAF6] bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-extrabold ${opt.badgeBg}`}
                        >
                          {opt.badge}
                        </span>
                        <div className="text-left">
                          <p className="text-[12.5px] font-bold text-[#16142A]">
                            {opt.title}
                          </p>
                          <p className="text-[10.5px] text-[#6C6A82]">{opt.sub}</p>
                        </div>
                      </div>
                      {selected ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-[#3F32E5]" />
                      ) : (
                        <CreditCard className="w-4 h-4 text-[#C8C4DC]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer Confirm CTA */}
        {items.length > 0 ? (
          <div className="bg-white border-t border-[#ECEAF6] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12.5px] font-semibold text-[#6C6A82]">
                Total Payable
              </span>
              <span className="text-[20px] font-extrabold text-[#16142A] tabular-nums">
                {totalKgs} KGS
              </span>
            </div>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isProcessing}
              className="w-full bg-[#F55A31] hover:bg-[#E14A23] active:scale-[0.99] text-white font-bold text-[14.5px] py-3.5 rounded-2xl shadow-[0_6px_18px_rgba(245,90,49,0.28)] transition disabled:opacity-70"
            >
              {isProcessing
                ? 'Sending Order to Kitchen...'
                : `Confirm & Place Order • ${totalKgs} KGS`}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
