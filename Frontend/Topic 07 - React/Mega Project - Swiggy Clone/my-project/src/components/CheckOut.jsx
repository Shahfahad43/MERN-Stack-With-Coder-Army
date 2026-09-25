import { useSelector } from "react-redux";

export default function CheckOut() {
  const data = useSelector((state) => state.cartslice.items) || [];

  // Calculate overall cart total (Swiggy API stores prices in paise, so divide by 100)
  const totalPrice = data.reduce((acc, item) => {
    const itemPrice = item.price || item.defaultPrice || 0;
    return acc + itemPrice / 100;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Secure Checkout
            </h2>
          </div>
          <button className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-100">
            Help
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 sm:mt-10">
        {data.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto">
            <p className="text-slate-500 text-lg font-medium">
              Your cart is empty.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Column: Checkout Steps (Rendered ONCE) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Step 1: Account */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
                  <div className="flex-1 space-y-3 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-xs flex items-center justify-center">
                        1
                      </span>
                      <p className="font-bold text-lg text-slate-900">
                        Account
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed max-w-md">
                      To place your order now, log in to your existing account
                      or sign up.
                    </p>
                    <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-3">
                      <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-xs transition-all duration-150">
                        Login
                      </button>
                      <button className="px-5 py-2.5 bg-white hover:bg-emerald-50 active:scale-95 text-emerald-700 border border-emerald-300 text-sm font-semibold rounded-xl transition-all duration-150">
                        Sign Up
                      </button>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-center">
                    <img
                      className="w-24 sm:w-28 h-auto object-contain drop-shadow-xs"
                      src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_147,h_140/Image-login_btpq7r"
                      alt="Account authentication"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery Address */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex items-center gap-3 text-slate-400">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 font-semibold text-xs flex items-center justify-center">
                  2
                </span>
                <span className="font-semibold text-base">
                  Delivery address
                </span>
              </div>

              {/* Step 3: Payment */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex items-center gap-3 text-slate-400">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 font-semibold text-xs flex items-center justify-center">
                  3
                </span>
                <span className="font-semibold text-base">Payment</span>
              </div>
            </div>

            {/* Right Column: Order Summary & Cart Items List */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">
                    Order Summary
                  </h3>
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                    {data.length} {data.length === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Items List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 pr-1">
                  {data.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="flex gap-3.5 items-center py-3.5 first:pt-0 last:pb-0"
                    >
                      <div className="shrink-0 relative overflow-hidden rounded-xl border border-slate-100 bg-slate-100 shadow-xs">
                        <img
                          className="w-16 h-16 sm:w-18 sm:h-18 object-cover"
                          src={
                            "https://media-assets.swiggy.com/swiggy/image/upload/" +
                            item.imageId
                          }
                          alt={item.name || "Food item"}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500 font-medium capitalize mt-0.5 truncate">
                          {item.category}
                        </p>
                        <p className="text-xs font-semibold text-slate-700 mt-1">
                          ₹{(item.price || item.defaultPrice || 0) / 100}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="my-5 border-slate-100" />

                {/* Bill Breakdown */}
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                </div>

                {/* Final Total Row */}
                <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-800">
                    To Pay
                  </span>
                  <span className="text-lg font-bold text-emerald-600">
                    ₹{totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
