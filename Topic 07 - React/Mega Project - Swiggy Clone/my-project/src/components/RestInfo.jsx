export default function RestInfo({ restData }) {
  return (
    <>
      <div className="flex w-full justify-between gap-6 mb-4 pb-4">
        <div className="w-[65%] md:w-[70%]">
          <p className="text-lg md:text-xl text-gray-800 font-semibold mb-2">
            {restData?.name}
          </p>

          <p className="text-base md:text-lg font-medium text-gray-700 mb-2">
            {"₹" +
              ("defaultPrice" in restData
                ? restData?.defaultPrice / 100
                : restData?.price / 100)}
          </p>

          <div className="mb-2">
            <span className="text-green-700 font-semibold">
              {restData?.ratings?.aggregatedRating?.rating}
            </span>

            <span className="text-gray-500 ml-1">
              {"(" + restData?.ratings?.aggregatedRating?.ratingCountV2 + ")"}
            </span>
          </div>

          <p className="text-sm md:text-base text-gray-500 leading-relaxed">
            {restData?.description}
          </p>
        </div>

        <div className="w-[30%] md:w-[20%] relative">
          <img
            className="w-full h-28 md:h-36 object-cover rounded-2xl md:rounded-3xl shadow-sm"
            src={
              "https://media-assets.swiggy.com/swiggy/image/upload/" +
              restData.imageId
            }
          ></img>

          <button className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-lg text-base md:text-lg font-semibold text-green-600 px-5 md:px-6 py-2 shadow-md border border-gray-200 bg-white hover:bg-green-50 transition-colors">
            ADD
          </button>
        </div>
      </div>

      <hr className="mb-5 mt-2 border-gray-200"></hr>
    </>
  );
}
