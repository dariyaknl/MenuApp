import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Footprints,
  MessageSquare,
  QrCode,
  Receipt,
  RefreshCw,
  RotateCcw,
  Soup,
  Store,
  Users,
  X,
} from 'lucide-react';
import { OrderRecord, OrderStatus, StudentProfile } from '../types';

interface OrdersScreenProps {
  profile: StudentProfile;
  orders: OrderRecord[];
  onAdvanceOrderStatus: (orderId: string) => void;
  onReorder: (order: OrderRecord) => void;
}

const STATUS_LABELS: Record<OrderStatus, { pill: string; badgeClass: string }> = {
  placed: { pill: 'Order Sent', badgeClass: 'bg-[#EEECFD] text-[#3F32E5]' },
  confirmed: { pill: 'Confirmed', badgeClass: 'bg-[#EEECFD] text-[#3F32E5]' },
  preparing: { pill: 'In Kitchen', badgeClass: 'bg-[#FFEFE9] text-[#D94322]' },
  ready: { pill: 'Ready Now!', badgeClass: 'bg-[#E6F7EF] text-[#138A53]' },
  completed: { pill: 'Picked Up', badgeClass: 'bg-[#F3F1FC] text-[#6C6A82]' },
};

export const OrdersScreen: React.FC<OrdersScreenProps> = ({
  profile,
  orders,
  onAdvanceOrderStatus,
  onReorder,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'active' | 'history'>('active');
  const [receiptOrder, setReceiptOrder] = useState<OrderRecord | null>(null);
  const [helpOrder, setHelpOrder] = useState<OrderRecord | null>(null);
  const [barcodeOrder, setBarcodeOrder] = useState<OrderRecord | null>(null);
  const [helpMessage, setHelpMessage] = useState('');
  const [helpSent, setHelpSent] = useState(false);

  const activeOrders = orders.filter((o) => o.status !== 'completed');
  const pastOrders = orders.filter((o) => o.status === 'completed');

  const stageIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'placed':
        return 0;
      case 'confirmed':
        return 1;
      case 'preparing':
        return 2;
      case 'ready':
        return 3;
      case 'completed':
        return 4;
    }
  };

  return (
    <div className="px-4 pt-3.5 pb-10 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-[22px] font-extrabold tracking-tight text-[#16142A]">
            My Orders
          </h2>
          <p className="text-[12.5px] text-[#6C6A82]">
            Track active dorm cafeteria pickups
          </p>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-[#E6F7EF] text-[#138A53] text-[10.5px] font-bold flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#138A53] animate-pulse-soft" />
          <span>Kitchen Live</span>
        </div>
      </div>

      {/* Segmented Toggle */}
      <div className="bg-[#ECE9F9] p-1 rounded-full grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => setActiveSubTab('active')}
          className={`py-2 px-3 rounded-full text-[12px] font-bold flex items-center justify-center gap-1.5 transition ${
            activeSubTab === 'active'
              ? 'bg-white text-[#3F32E5] shadow-xs'
              : 'text-[#6C6A82]'
          }`}
        >
          <span>Active Orders</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold tabular-nums ${
              activeSubTab === 'active'
                ? 'bg-[#3F32E5] text-white'
                : 'bg-[#DCD7F4] text-[#4A4863]'
            }`}
          >
            {activeOrders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('history')}
          className={`py-2 px-3 rounded-full text-[12px] font-bold flex items-center justify-center gap-1.5 transition ${
            activeSubTab === 'history'
              ? 'bg-white text-[#3F32E5] shadow-xs'
              : 'text-[#6C6A82]'
          }`}
        >
          <span>Order History</span>
          <span className="px-1.5 py-0.5 rounded-full bg-[#DCD7F4] text-[#4A4863] text-[10px] font-extrabold tabular-nums">
            {pastOrders.length}
          </span>
        </button>
      </div>

      {activeSubTab === 'active' ? (
        <>
          {activeOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#ECEAF6] p-8 text-center">
              <Soup className="w-9 h-9 text-[#3F32E5] mx-auto mb-2" />
              <p className="text-[15px] font-extrabold text-[#16142A]">
                No active kitchen orders
              </p>
              <p className="text-[12px] text-[#6C6A82] mt-1">
                Place an order from Today&apos;s Menu or reorder a favorite below!
              </p>
            </div>
          ) : (
            activeOrders.map((order) => {
              const currentIdx = stageIndex(order.status);
              const statusMeta = STATUS_LABELS[order.status];
              const codeDigits = order.pickupCode.padStart(4, '0').slice(0, 4).split('');

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-[#ECEAF6] shadow-[0_6px_24px_rgba(34,28,70,0.05)] p-4 space-y-4"
                >
                  {/* Top Order ID & Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-extrabold text-[#3F32E5] tabular-nums">
                        {order.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${statusMeta.badgeClass}`}
                      >
                        {statusMeta.pill}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#EEECFD] text-[#3F32E5] text-[10.5px] font-bold flex items-center gap-1 tabular-nums">
                      <Clock className="w-3 h-3" />
                      <span>
                        {order.status === 'ready'
                          ? 'At Counter'
                          : `Ready in ~${order.readyInMinutes} min`}
                      </span>
                    </span>
                  </div>

                  {/* Dish Summary Box */}
                  <div className="bg-[#F6F5FA] rounded-2xl p-3 flex items-center gap-3">
                    <img
                      src={order.image}
                      alt={order.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#EFEBFB]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-extrabold text-[#16142A] truncate">
                        {order.title}
                      </p>
                      <p className="text-[11px] text-[#6C6A82] truncate mt-0.5">
                        {order.subtitle}
                      </p>
                      <div className="flex items-center justify-between gap-2 mt-1.5">
                        <span className="text-[13.5px] font-extrabold text-[#3F32E5] tabular-nums">
                          {order.totalKgs} KGS
                        </span>
                        <span className="text-[10.5px] font-bold text-[#138A53] flex items-center gap-1">
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>{order.paymentLabel}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pickup Station */}
                  <div className="flex items-center gap-2.5 px-1">
                    <div className="w-8 h-8 rounded-full bg-[#EEECFD] text-[#3F32E5] flex items-center justify-center shrink-0">
                      <Store className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10.5px] text-[#6C6A82]">Pickup Station</p>
                      <p className="text-[12.5px] font-bold text-[#16142A] truncate">
                        {order.pickupStation}
                      </p>
                    </div>
                  </div>

                  {/* Estimate Callout */}
                  <div className="bg-[#F4F2FC] rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-[11.5px] text-[#16142A]">
                      <Bell className="w-4 h-4 text-[#3F32E5] shrink-0" />
                      <span>
                        Estimated ready by{' '}
                        <strong className="font-extrabold">{order.estimatedReadyBy}</strong>
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-[#3F32E5] shrink-0">
                      {order.status === 'ready' ? 'Head down now!' : 'Stay in dorm!'}
                    </span>
                  </div>

                  {/* Live Order Progress Stepper */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#7A7891]">
                        Live Order Progress
                      </p>
                      <button
                        type="button"
                        onClick={() => onAdvanceOrderStatus(order.id)}
                        className="text-[11px] font-bold text-[#3F32E5] bg-[#EEECFD] hover:bg-[#E1DCFC] px-2.5 py-1 rounded-full flex items-center gap-1 active:scale-95 transition"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>
                          {order.status === 'ready'
                            ? 'Confirm Picked Up'
                            : 'Simulate Next Stage'}
                        </span>
                      </button>
                    </div>

                    <div className="space-y-3 relative pl-1">
                      {/* Vertical connector line */}
                      <div className="absolute left-[15px] top-3 bottom-3 w-[2px] bg-[#E5E2F4]" />

                      {/* Step 1: Placed */}
                      <div className="flex items-start gap-3 relative">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                            currentIdx >= 0
                              ? 'bg-[#138A53] text-white'
                              : 'bg-[#ECE9F6] text-[#8E8BA6]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </span>
                        <div className="flex-1 flex items-start justify-between gap-2 pt-0.5">
                          <div>
                            <p className="text-[12.5px] font-bold text-[#16142A]">
                              Order Placed
                            </p>
                            <p className="text-[11px] text-[#6C6A82]">
                              Sent to {profile.dormShort} Main Kitchen
                            </p>
                          </div>
                          <span className="text-[10.5px] text-[#6C6A82] tabular-nums">
                            {order.timestamps.placed}
                          </span>
                        </div>
                      </div>

                      {/* Step 2: Confirmed */}
                      <div className="flex items-start gap-3 relative">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                            currentIdx >= 1
                              ? 'bg-[#138A53] text-white'
                              : 'bg-[#ECE9F6] text-[#8E8BA6]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </span>
                        <div className="flex-1 flex items-start justify-between gap-2 pt-0.5">
                          <div>
                            <p className="text-[12.5px] font-bold text-[#16142A]">
                              Confirmed by Kitchen
                            </p>
                            <p className="text-[11px] text-[#6C6A82]">
                              Ingredients reserved & queued
                            </p>
                          </div>
                          <span className="text-[10.5px] text-[#6C6A82] tabular-nums">
                            {order.timestamps.confirmed || 'Pending'}
                          </span>
                        </div>
                      </div>

                      {/* Step 3: Preparing */}
                      <div className="flex items-start gap-3 relative">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                            currentIdx > 2
                              ? 'bg-[#138A53] text-white'
                              : currentIdx === 2
                              ? 'bg-[#3F32E5] text-white ring-4 ring-[#EEECFD]'
                              : 'bg-[#ECE9F6] text-[#8E8BA6]'
                          }`}
                        >
                          {currentIdx > 2 ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Soup className="w-3.5 h-3.5" />
                          )}
                        </span>
                        <div
                          className={`flex-1 rounded-2xl p-2.5 ${
                            currentIdx === 2 ? 'bg-[#F4F2FC]' : 'pt-0.5 px-0'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <p
                                className={`text-[12.5px] font-bold ${
                                  currentIdx === 2
                                    ? 'text-[#3F32E5]'
                                    : 'text-[#16142A]'
                                }`}
                              >
                                Preparing & Plating
                              </p>
                              {currentIdx === 2 ? (
                                <span className="px-1.5 py-0.5 rounded-md bg-[#F55A31] text-white text-[9px] font-extrabold uppercase">
                                  In Progress
                                </span>
                              ) : null}
                            </div>
                            <span className="text-[10.5px] font-bold text-[#3F32E5] tabular-nums">
                              {order.timestamps.preparing || 'Queued'}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#4A4863] mt-0.5 leading-snug">
                            Chef Ulan is boiling handmade noodles & garnishing tender beef broth.
                          </p>
                        </div>
                      </div>

                      {/* Step 4: Ready for Pickup */}
                      <div className="flex items-start gap-3 relative">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                            currentIdx >= 3
                              ? 'bg-[#138A53] text-white ring-4 ring-[#E6F7EF]'
                              : 'bg-[#ECE9F6] text-[#8E8BA6]'
                          }`}
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                        </span>
                        <div className="flex-1 flex items-start justify-between gap-2 pt-0.5">
                          <div>
                            <p
                              className={`text-[12.5px] font-bold ${
                                currentIdx >= 3 ? 'text-[#138A53]' : 'text-[#6C6A82]'
                              }`}
                            >
                              Ready for Pickup
                            </p>
                            <p className="text-[11px] text-[#8E8BA6]">
                              {currentIdx >= 3
                                ? 'Tray waiting at Counter 2!'
                                : 'Counter 2 buzzer will ring'}
                            </p>
                          </div>
                          <span className="text-[10.5px] text-[#8E8BA6] tabular-nums">
                            {order.timestamps.ready}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pickup Code Box */}
                  <div className="bg-[#F4F2FC] rounded-2xl p-4 text-center space-y-2.5">
                    <p className="text-[11.5px] font-semibold text-[#4A4863]">
                      Show this pickup code to cashier:
                    </p>
                    <div className="grid grid-cols-4 gap-2 max-w-[240px] mx-auto">
                      {codeDigits.map((digit, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-xl py-2.5 shadow-2xs text-[22px] font-extrabold text-[#3F32E5] tabular-nums"
                        >
                          {digit}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setBarcodeOrder(order)}
                      className="inline-flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#138A53] hover:underline"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Or scan barcode at express counter turnstile</span>
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setReceiptOrder(order)}
                      className="py-2.5 px-3 rounded-xl bg-[#F5F4FA] hover:bg-[#ECE9F9] text-[#16142A] text-[12.5px] font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>View Receipt</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setHelpSent(false);
                        setHelpMessage('');
                        setHelpOrder(order);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-[#EEECFD] hover:bg-[#E2DEFC] text-[#3F32E5] text-[12.5px] font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Help / Counter</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Counter Queue Card */}
          <div className="bg-white rounded-2xl border border-[#ECEAF6] p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E6F7EF] text-[#138A53] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[13px] font-extrabold text-[#16142A]">
                  Counter 2 Crowd: Light
                </p>
                <p className="text-[11px] text-[#6C6A82]">
                  ~3 students in queue right now
                </p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#F5F4FA] text-[#4A4863] flex items-center justify-center">
              <Footprints className="w-4 h-4" />
            </div>
          </div>

          {/* Recent Past Orders */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-[15.5px] font-extrabold text-[#16142A]">
                Recent Past Orders
              </h3>
              <button
                type="button"
                onClick={() => setActiveSubTab('history')}
                className="text-[11.5px] font-bold text-[#3F32E5]"
              >
                See all ({pastOrders.length})
              </button>
            </div>

            {pastOrders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#ECEAF6] p-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={order.image}
                    alt={order.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 bg-[#EFEBFB]"
                  />
                  <div className="min-w-0">
                    <p className="text-[13px] font-extrabold text-[#16142A] truncate">
                      {order.title}
                    </p>
                    <p className="text-[11px] text-[#6C6A82] tabular-nums">
                      {order.dateLabel} • {order.totalKgs} KGS
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onReorder(order)}
                  className="px-3 py-1.5 rounded-full bg-[#EEECFD] hover:bg-[#E1DCFC] text-[#3F32E5] text-[11.5px] font-bold flex items-center gap-1 shrink-0 active:scale-95 transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reorder</span>
                </button>
              </div>
            ))}
          </section>
        </>
      ) : (
        /* Order History Tab */
        <div className="space-y-2.5">
          {pastOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#ECEAF6] p-8 text-center">
              <p className="text-[14px] font-bold text-[#16142A]">No past orders yet</p>
            </div>
          ) : (
            pastOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#ECEAF6] p-3.5 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[12.5px] font-extrabold text-[#3F32E5] tabular-nums">
                    {order.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#E6F7EF] text-[#138A53] text-[10px] font-bold">
                    Completed • {order.dateLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={order.image}
                      alt={order.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-bold text-[#16142A] truncate">
                        {order.title}
                      </p>
                      <p className="text-[11px] text-[#6C6A82] truncate">
                        {order.subtitle} • {order.totalKgs} KGS
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onReorder(order)}
                    className="px-3 py-1.5 rounded-full bg-[#F55A31] text-white text-[11.5px] font-bold flex items-center gap-1 shrink-0 active:scale-95 transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* View Receipt Modal */}
      {receiptOrder ? (
        <div className="fixed inset-0 z-50 bg-[#16142A]/55 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-[380px] bg-white rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#ECEAF6] pb-3">
              <div>
                <h3 className="text-[16px] font-extrabold text-[#16142A]">
                  Cafeteria Receipt {receiptOrder.id}
                </h3>
                <p className="text-[11px] text-[#6C6A82]">
                  {profile.universityShort} • {receiptOrder.placedTime}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReceiptOrder(null)}
                className="w-8 h-8 rounded-full bg-[#F4F2FC] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-[12.5px]">
              {receiptOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between gap-2">
                  <span className="text-[#16142A] font-semibold">
                    {item.quantity}x {item.mealName} ({item.portionLabel})
                  </span>
                  <span className="font-bold tabular-nums">{item.lineTotalKgs} KGS</span>
                </div>
              ))}
              {receiptOrder.welcomeTeaApplied ? (
                <div className="flex justify-between text-[#138A53] font-semibold">
                  <span>Welcome Samarkand Tea</span>
                  <span>0 KGS</span>
                </div>
              ) : null}
            </div>
            <div className="border-t border-dashed border-[#D8D4EB] pt-3 flex items-center justify-between">
              <span className="font-bold text-[#6C6A82] text-[12.5px]">
                {receiptOrder.paymentLabel}
              </span>
              <span className="text-[18px] font-extrabold text-[#3F32E5] tabular-nums">
                {receiptOrder.totalKgs} KGS
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Help / Counter Modal */}
      {helpOrder ? (
        <div className="fixed inset-0 z-50 bg-[#16142A]/55 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-[380px] bg-white rounded-3xl p-5 space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-extrabold text-[#16142A]">
                Message {profile.dormShort} Counter
              </h3>
              <button
                type="button"
                onClick={() => setHelpOrder(null)}
                className="w-8 h-8 rounded-full bg-[#F4F2FC] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {helpSent ? (
              <div className="bg-[#E6F7EF] text-[#138A53] rounded-2xl p-4 text-[12.5px] font-semibold">
                Message sent to Counter 2 cashier for {helpOrder.id}. They will hold your tray warm!
              </div>
            ) : (
              <>
                <p className="text-[12px] text-[#6C6A82]">
                  Need extra napkins, running 5 mins late from class, or dietary question on{' '}
                  <strong>{helpOrder.id}</strong>?
                </p>
                <textarea
                  rows={3}
                  value={helpMessage}
                  onChange={(e) => setHelpMessage(e.target.value)}
                  placeholder="e.g. Please hold my tray warm until 12:50, lecture ran late!"
                  className="w-full bg-[#F4F2FC] rounded-2xl p-3 text-[12.5px] outline-none border border-transparent focus:border-[#3F32E5]"
                />
                <button
                  type="button"
                  onClick={() => setHelpSent(true)}
                  className="w-full py-3 rounded-2xl bg-[#3F32E5] text-white font-bold text-[13px]"
                >
                  Send Note to Kitchen Counter
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}

      {/* Express Barcode Modal */}
      {barcodeOrder ? (
        <div className="fixed inset-0 z-50 bg-[#16142A]/55 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-5 text-center space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-extrabold text-[#3F32E5]">
                Express Turnstile Pass
              </span>
              <button
                type="button"
                onClick={() => setBarcodeOrder(null)}
                className="w-8 h-8 rounded-full bg-[#F4F2FC] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-[#F4F2FC] rounded-2xl p-6 flex flex-col items-center">
              <QrCode className="w-28 h-28 text-[#16142A]" />
              <p className="mt-3 text-[20px] font-extrabold tracking-[0.25em] text-[#3F32E5] tabular-nums">
                {barcodeOrder.pickupCode}
              </p>
              <p className="text-[11px] text-[#6C6A82] mt-1">
                {barcodeOrder.pickupStation}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
