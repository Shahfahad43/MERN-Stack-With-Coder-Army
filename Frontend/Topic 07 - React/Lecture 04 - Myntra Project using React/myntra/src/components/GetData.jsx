import React, { useState } from "react";
import initialData from "./DummyData";
import CreateCard from "./Card";

function GetData() {
  const [A, SetA] = useState(initialData);

  function handleSort() {
    const sortedArr = [...A].sort((a, b) => a.price - b.price);
    SetA(sortedArr);
    console.log(sortedArr);
  }

  function above499() {
    const abovePrice499 = initialData.filter((value) => value.price > 499);
    SetA(abovePrice499);
    console.log(abovePrice499);
  }

  function discountMore40() {
    const discounted = initialData.filter(
      (value) => value.maxOffer - value.minOffer > 40,
    );
    SetA(discounted);
  }

  return (
    <>
      <button className="sortBtn" onClick={handleSort}>
        Sort by price
      </button>

      <button className="sortBtn" onClick={above499}>
        Above 499
      </button>
      <button className="sortBtn" onClick={discountMore40}>
        More than 40% Discount
      </button>

      <div className="mainContainer">
        {A.map((value) => (
          <CreateCard
            key={value.id}
            image={value.image}
            name={value.name}
            minOffer={value.minOffer}
            maxOffer={value.maxOffer}
            price={value.price}
          />
        ))}
      </div>
    </>
  );
}

export default GetData;
