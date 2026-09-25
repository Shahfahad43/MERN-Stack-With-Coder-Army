import { Link } from "react-router";

function Home() {
  return (
    <div className="bg-[#FF5200]">
      <nav className="flex text-black justify-between mx-20 my-5">
        <div>
          <a href="">
            <img
              className="w-30"
              src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/static-assets/images/swiggy_logo_white.png"
              alt="swiggy logo"
            />
          </a>
        </div>
        <div className="flex gap-10 items-center text-white justify-center font-bold">
          <a href="">Swiggy Coorporate</a>
          <a href="">Partner With Us</a>
          <a href="" className="border p-2 rounded">
            Get the App
          </a>
          <a href="" className="bg-black border p-2 rounded">
            Sign in
          </a>
        </div>
      </nav>

      <div className="flex flex-col items-center text-white relative">
        <p className="text-4xl w-[60%]  font-bold">
          Order food & groceries. Discover best restaurants. Swiggy it!
        </p>
        <div className="w-[50%] m-10 flex gap-4">
          <input
            className="border bg-white rounded p-2 text-gray-600 w-[40%] border-gray-400"
            type="text"
            placeholder="Delhi, Inda"
          />
          <input
            className="border bg-white rounded p-2 text-gray-600 w-[60%] border-gray-400"
            type="text"
            placeholder="Search for more resuturants"
          />
        </div>

        <img
          className="absolute right-0 top-1/2 -translate-y-1/2 w-40 object-contain"
          src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/testing/seo-home/Sushi_replace.png"
          alt="left-image"
        />
        <img
          className="absolute left-0 top-1/2 -translate-y-1/2 w-40 object-contain"
          src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/testing/seo-home/Veggies_new.png"
          alt="right-image"
        />
      </div>

      <div className="*:w-100 flex justify-center ">
        <Link to="/resturant">
          <img
            src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/ec86a309-9b06-48e2-9adc-35753f06bc0a_Food3BU.png"
            alt=""
          />
        </Link>

        <a
          href="https://www.swiggy.com/instamart?entryId=1234&entryName=mainTileEntry4&v=1"
          target="_blank"
        >
          <img
            src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/b5c57bbf-df54-4dad-95d1-62e3a7a8424d_IM3BU.png"
            alt=""
          />
        </a>
        <a href="https://www.swiggy.com/dineout" target="_blank">
          <img
            src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/b6d9b7ab-91c7-4f72-9bf2-fcd4ceec3537_DO3BU.png"
            alt=""
          />
        </a>
      </div>
    </div>
  );
}

export default Home;
