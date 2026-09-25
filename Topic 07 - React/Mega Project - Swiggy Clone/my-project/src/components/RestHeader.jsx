import { useSelector } from "react-redux";
import { Link } from "react-router";

export default function RestHeader() {
  const counter = useSelector((state) => state.cartslice.count);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-linear-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-sm shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200"></div>
          <span className="text-xl sm:text-2xl font-black tracking-tight bg-linear-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
            Swiggy
          </span>
        </Link>

        {/* Cart Action */}
        <div className="flex items-center gap-3">
          <Link
            to="/Checkout"
            className="group relative flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-orange-600 active:scale-95 text-white transition-all duration-200 shadow-sm shadow-slate-900/10"
          >
            {/* Shopping Bag Icon */}
            <svg
              className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>

            <span className="text-sm font-semibold tracking-wide">Cart</span>

            {/* Item Counter Pill */}
            <span
              className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold rounded-full transition-colors ${
                counter > 0
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-700 text-slate-300 group-hover:bg-orange-700 group-hover:text-white"
              }`}
            >
              {counter ?? 0}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
