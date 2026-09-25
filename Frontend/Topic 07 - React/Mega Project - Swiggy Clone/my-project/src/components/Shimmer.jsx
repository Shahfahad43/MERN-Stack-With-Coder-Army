function Shimmer() {
  const num = 20;
  const cards = [];

  for (let i = 0; i < num; i++) {
    cards.push(
      <div key={i} className="w-80 rounded-2xl bg-white p-3 shadow-md mx-auto">
        <div className="relative h-44 w-full overflow-hidden rounded-xl bg-gray-200">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-gray-200 via-gray-300 to-gray-200" />
          <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between gap-2">
            <div className="h-4 w-32 rounded bg-gray-300" />
            <div className="h-4 w-10 rounded bg-gray-300" />
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="h-3 w-1/2 rounded bg-gray-200" />
            <div className="h-3 w-12 rounded bg-gray-200" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3 w-2/5 rounded bg-gray-200" />
            <div className="h-3 w-14 rounded bg-gray-200" />
          </div>
        </div>
      </div>,
    );
  }

  return (
    <div className="w-[80%] mx-auto flex flex-wrap justify-center gap-6">
      {cards}
    </div>
  );
}

export default Shimmer;
