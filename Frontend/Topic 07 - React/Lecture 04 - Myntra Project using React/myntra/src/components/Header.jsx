function Header() {
  return (
    <>
      <div className="header">
        <img src="../images/logo.png" alt="" />

        <div className="options">
          <button className="optBtn">Men</button>
          <button className="optBtn">Women</button>
          <button className="optBtn">Kids</button>
          <button className="optBtn">Home</button>
          <button className="optBtn">Beauty</button>
          <button className="optBtn">Genz</button>
          <button className="optBtn">Studio</button>
        </div>

        <input type="text" placeholder="Search for products, brands and more" />

        <div className="profile">
          <button className="profBtn">Profile</button>
          <button className="profBtn">Whishlist</button>
          <button className="profBtn">Bag</button>
        </div>
      </div>
    </>
  );
}

export default Header;
