import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchData } from "./Slicer1";
import "./App.css"; // ✅ Import the CSS file

function CreateCoin() {
  const { data, loading, error } = useSelector((state) => state.slice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FetchData(20));
  }, [dispatch]);

  if (loading) return <h1 className="loading-text">⏳ Loading coins...</h1>;
  if (error) return <h1 className="error-text">❌ Error: {error}</h1>;

  return (
    <div className="coin-container">
      {data.map((coin) => (
        <div key={coin.id} className="coin-card">
          <img src={coin.image} alt={coin.name} />
          <h3>{coin.name}</h3>
          <p className="price">💰 ${coin.current_price.toLocaleString()}</p>
          <p className="rank">🏆 Rank #{coin.market_cap_rank}</p>
          <p>📊 24h: {coin.price_change_percentage_24h?.toFixed(2)}%</p>
        </div>
      ))}
    </div>
  );
}

export default CreateCoin;
