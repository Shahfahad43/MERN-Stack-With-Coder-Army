function CreateCard(props) {
  return (
    <div className="card">
      <img src={props.image} alt={props.name} />
      <div className="text">
        <h2>{props.name}</h2>
        <h1>
          {props.minOffer} - {props.maxOffer}% OFF
        </h1>
        <h2>Price: {props.price} Rs</h2>
        <button>Shop Now</button>
      </div>
    </div>
  );
}

export default CreateCard;
