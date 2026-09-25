const restaurants = [
  {
    name: "Broast Laguna",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG90ZWx8ZW58MHx8MHx8fDI%3D",
    rating: 4.2,
    location: "Khamis Mushait, Asir",
    cost: "SAR 25",
    open: true,
    offers: "10% off on weekends",
    petFriendly: false,
    outdoorSeating: true,
  },
  {
    name: "Moment Burger",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWx8ZW58MHx8MHx8fDI%3D",
    rating: 4.5,
    location: "Abha, Asir",
    cost: "SAR 30",
    open: true,
    offers: "Free fries with combo",
    petFriendly: false,
    outdoorSeating: false,
  },
  {
    name: "Fresh Burger",
    image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWx8ZW58MHx8MHx8fDI%3D",
    rating: 4.1,
    location: "Khamis Mushait, Asir",
    cost: "SAR 22",
    open: true,
    offers: "Buy 1 Get 1",
    petFriendly: false,
    outdoorSeating: true,
  },
  {
    name: "Furn Al Dayaa",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG90ZWx8ZW58MHx8MHx8fDI%3D",
    rating: 4.6,
    location: "Abha, Asir",
    cost: "SAR 35",
    open: true,
    offers: "Family meal discount",
    petFriendly: false,
    outdoorSeating: true,
  },

  {
    name: "Al Majlis Al Khaleeji",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWx8ZW58MHx8MHx8fDI%3D",
    rating: 4.3,
    location: "Khamis Mushait, Asir",
    cost: "SAR 40",
    open: false,
    offers: "20% off lunch",
    petFriendly: false,
    outdoorSeating: true,
  },

  {
    name: "Taj Al Nakhlah",
    image:
      "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG90ZWx8ZW58MHx8MHx8fDI%3D",
    rating: 4.4,
    location: "Abha, Asir",
    cost: "SAR 28",
    open: true,
    offers: "Free drink",
    petFriendly: true,
    outdoorSeating: true,
  },

  {
    name: "Desert Flame",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdGVsfGVufDB8fDB8fHwy",
    rating: 4.0,
    location: "Abha, Asir",
    cost: "SAR 20",
    open: true,
    offers: "15% off dinner",
    petFriendly: false,
    outdoorSeating: false,
  },

  {
    name: "Qahwa Corner",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG90ZWx8ZW58MHx8MHx8fDI%3D",
    rating: 4.7,
    location: "Abha, Asir",
    cost: "SAR 18",
    open: true,
    offers: "Free coffee refill",
    petFriendly: true,
    outdoorSeating: true,
  },

  {
    name: "Arabian Nights Cafe",
    image:
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdGVsfGVufDB8fDB8fHwy",
    rating: 4.3,
    location: "Khamis Mushait, Asir",
    cost: "SAR 20",
    open: false,
    offers: "Student discount",
    petFriendly: true,
    outdoorSeating: true,
  },

  {
    name: "Sahara Bites",
    image:
      "https://images.unsplash.com/photo-1495365200479-c4ed1d35e1aa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGhvdGVsfGVufDB8fDB8fHwy",
    rating: 4.1,
    location: "Abha, Asir",
    cost: "SAR 15",
    open: true,
    offers: "Combo deals",
    petFriendly: false,
    outdoorSeating: false,
  },

  {
    name: "Falafel Hub",
    image:
      "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhvdGVsfGVufDB8fDB8fHwy",
    rating: 4.0,
    location: "Abha, Asir",
    cost: "SAR 12",
    open: true,
    offers: "Buy 2 Get 1",
    petFriendly: false,
    outdoorSeating: false,
  },

  {
    name: "Spice Route",
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsfGVufDB8fDB8fHwy",
    rating: 4.5,
    location: "Khamis Mushait, Asir",
    cost: "SAR 35",
    open: true,
    offers: "Free dessert",
    petFriendly: false,
    outdoorSeating: true,
  },

  {
    name: "Grill Master",
    image:
      "https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvdGVsfGVufDB8fDB8fHwy",
    rating: 4.2,
    location: "Abha, Asir",
    cost: "SAR 45",
    open: true,
    offers: "BBQ nights",
    petFriendly: false,
    outdoorSeating: true,
  },

  {
    name: "Olive Garden Cafe",
    image:
      "https://images.unsplash.com/photo-1535827841776-24afc1e255ac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGhvdGVsfGVufDB8fDB8fHwy",
    rating: 4.6,
    location: "Abha, Asir",
    cost: "SAR 38",
    open: false,
    offers: "20% off",
    petFriendly: true,
    outdoorSeating: true,
  },

  {
    name: "Mountain View Dine",
    image:
      "https://images.unsplash.com/reserve/8T8J12VQxyqCiQFGa2ct_bahamas-atlantis.jpg?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI4fHxob3RlbHxlbnwwfHwwfHx8Mg%3D%3D",
    rating: 4.8,
    location: "Abha, Asir",
    cost: "SAR 50",
    open: true,
    offers: "Romantic dinner deals",
    petFriendly: false,
    outdoorSeating: true,
  },

  {
    name: "Urban Bites",
    image:
      "https://images.unsplash.com/photo-1590447158019-883d8d5f8bc7?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTM1fHxob3RlbHxlbnwwfHwwfHx8Mg%3D%3D",
    rating: 4.1,
    location: "Khamis Mushait, Asir",
    cost: "SAR 20",
    open: true,
    offers: "Student offer",
    petFriendly: false,
    outdoorSeating: false,
  },

  {
    name: "Golden Spoon",
    image:
      "https://images.unsplash.com/photo-1578898886615-0c4719f932dc?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQ5fHxob3RlbHxlbnwwfHwwfHx8Mg%3D%3D",
    rating: 4.7,
    location: "Abha, Asir",
    cost: "SAR 60",
    open: true,
    offers: "Luxury deals",
    petFriendly: false,
    outdoorSeating: true,
  },

  {
    name: "Cafe Breeze",
    image:
      "https://images.unsplash.com/photo-1631049035634-c04c637651b1?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTU0fHxob3RlbHxlbnwwfHwwfHx8Mg%3D%3D",
    rating: 4.3,
    location: "Abha, Asir",
    cost: "SAR 15",
    open: false,
    offers: "Free cookie",
    petFriendly: true,
    outdoorSeating: true,
  },

  {
    name: "Sunset Grill",
    image:
      "https://images.unsplash.com/photo-1698752822280-8a1b285a7709?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTYyfHxob3RlbHxlbnwwfHwwfHx8Mg%3D%3D",
    rating: 4.6,
    location: "Abha, Asir",
    cost: "SAR 45",
    open: true,
    offers: "Evening discount",
    petFriendly: false,
    outdoorSeating: true,
  },

  {
    name: "Skyline Cafe",
    image:
      "https://images.unsplash.com/photo-1584132905271-512c958d674a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTY0fHxob3RlbHxlbnwwfHwwfHx8Mg%3D%3D",
    rating: 4.4,
    location: "Khamis Mushait, Asir",
    cost: "SAR 18",
    open: true,
    offers: "Free upgrade",
    petFriendly: true,
    outdoorSeating: true,
  },
];
const container = document.querySelector(".container");
const mainContainer = document.querySelector(".mainContainer");
const footer = document.querySelector("footer");

function setupNavigation() {
  const diningOutBtn = document.getElementById("diningOut");
  const deliveryBtn = document.getElementById("delivery");
  const logo = document.getElementById("logo");

  diningOutBtn?.addEventListener("click", () => {
    window.location.href = "../HTML Pages/index.html";
  });

  deliveryBtn?.addEventListener("click", () => {
    window.location.href = "../HTML Pages/delivery.html";
  });

  logo?.addEventListener("click", () => {
    window.location.href = "../HTML Pages/index.html";
  });
}

function setupAuth() {
  const signupBtn = document.getElementById("signup");
  const loginBtn = document.getElementById("login");

  signupBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    renderForm("signup");
  });

  loginBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    renderForm("login");
  });
}

function renderForm(type) {
  if (footer) footer.style.display = "none";

  if (type === "signup") {
    mainContainer.innerHTML = `
      <div class="signup-container">
        <h2>Sign Up</h2>
        <form id="signUpForm">
          <div class="form-group">
            <label>Username</label>
            <input id="userName" placeholder="i.e. Shah Fahad" type="text" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input id="signupEmail" placeholder="example@gmail.com" type="email" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="signupPass" placeholder="example123" required />
          </div>
          <button type="submit">Create Account</button>
        </form>
      </div>`;

    document.getElementById("signUpForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = {
        username: document.getElementById("userName").value,
        signupEmail: document.getElementById("signupEmail").value,
        signupPass: document.getElementById("signupPass").value,
      };
      localStorage.setItem("userInfo", JSON.stringify(formData));
      window.location.href = "../HTML Pages/index.html";
    });
  } else {
    mainContainer.innerHTML = `
      <div class="login-container">
        <h2>Login</h2>
        <form id="loginForm">
          <div class="form-group">
            <label>Email</label>
            <input id="loginEmail" placeholder="example@gmail.com" type="email" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input id="loginPass" placeholder="example123" type="password" required />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>`;

    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const loginEmail = document.getElementById("loginEmail").value;
      const loginPass = document.getElementById("loginPass").value;
      const savedData = JSON.parse(localStorage.getItem("userInfo"));

      if (
        savedData &&
        loginEmail === savedData.signupEmail &&
        loginPass === savedData.signupPass
      ) {
        window.location.href = "../HTML Pages/index.html";
      } else {
        alert("Incorrect credentials");
      }
    });
  }
}

function renderRestaurants(data) {
  if (!container) return;
  container.innerHTML = data
    .map(
      (r) => `
    <div class="card">
      <div class="card-img">
        <img src="${r.image}" alt="${r.name}">
      </div>
      <div class="card-top">
        <h3>${r.name}</h3>
        <span class="rating">⭐ ${r.rating}</span>
      </div>
      <div class="card-middle">
        <span>📍 ${r.location}</span>
        <span>${r.cost}</span>
      </div>
      <div class="card-bottom">
        <span class="${r.open ? "open" : "closed"}">
          ${r.open ? "Open Now" : "Closed"}
        </span>
        <span>${r.outdoorSeating ? "Outdoor" : "No Outdoor"}</span>
      </div>
    </div>`,
    )
    .join("");
}

function setupFilters(restaurants) {
  document
    .getElementById("rating")
    ?.addEventListener("click", () =>
      applyFilter(restaurants, (r) => r.rating > 4.5),
    );
  document
    .getElementById("petFriendly")
    ?.addEventListener("click", () =>
      applyFilter(restaurants, (r) => r.petFriendly),
    );
  document
    .getElementById("outdoorSeating")
    ?.addEventListener("click", () =>
      applyFilter(restaurants, (r) => r.outdoorSeating),
    );
  document
    .getElementById("openNow")
    ?.addEventListener("click", () => applyFilter(restaurants, (r) => r.open));
}

function applyFilter(data, condition) {
  const filtered = data.filter(condition);
  renderRestaurants(filtered);
}

const famousFood = [
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Machboos_%28cropped%29.JPG/1280px-Machboos_%28cropped%29.JPG",
    name: "Kabsa",
  },
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Chicken_Mandi_Rice_%D9%85%D9%86%D8%AF%D9%8A_%D8%AF%D8%AC%D8%A7%D8%AC.JPG/1280px-Chicken_Mandi_Rice_%D9%85%D9%86%D8%AF%D9%8A_%D8%AF%D8%AC%D8%A7%D8%AC.JPG",
    name: "Mandi",
  },
  {
    image:
      "https://www.moulinex-me.com/medias/?context=bWFzdGVyfHJvb3R8MTIzNDAxfGltYWdlL2pwZWd8YURNNEwyZ3daQzh4TlRrMk9EWTRORGd3TWpBM09DNXFjR2N8ZjdmMjgyNmMxYWNlMDk5MTc1OTg2ZWI2ZjEwNjc3M2U5ZWYwNmMwZGNiNTk4ZWQzYzJlNDQ4ZmY3NzZhMTMxOA",
    name: "Jaresh",
  },
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Murtabak.jpg/1280px-Murtabak.jpg",
    name: "Mutabbaq",
  },
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/The_Hijazi_Saleeg.jpg/960px-The_Hijazi_Saleeg.jpg",
    name: "Saleeg",
  },
  {
    image:
      "https://saudipedia.com/var/site/storage/images/2/1/0/8/4018012-1-eng-GB/e289e3854b0d-57268.jpg",
    name: "Matazeez",
  },
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Armenian_Harisa.JPG/1280px-Armenian_Harisa.JPG",
    name: "Harees",
  },
  {
    image:
      "https://d12eu00glpdtk2.cloudfront.net/public/images/dining/vegetarian-qatari-food-thareed/_910x600_clip_center-center_none/thareedsmall.jpg",
    name: "Thareed",
  },
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/9e/Mamoul_biscotti_libanesi.jpg",
    name: "Maamoul",
  },
  {
    image:
      "https://img-cdn.publive.online/fit-in/640x430/filters:format(webp)/sanjeev-kapoor/media/media_files/AceEmriBbDkAkUxIkfJY.JPG",
    name: "Kunafa",
  },
];

const brands = [
  {
    image:
      "https://b.zmtcdn.com/data/brand_creatives/logos/bb30587d1148b6ab628a61945f64bf88_1625164768.png",
    name: "MicDelivery",
  },
  {
    image:
      "https://b.zmtcdn.com/data/brand_creatives/logos/22529ff52d41a4aa3b36ac1e7e0c0db3_1605099406.png",
    name: "Haldiram's",
  },
  {
    image:
      "https://b.zmtcdn.com/data/brand_creatives/logos/a6927d83d9185b7788814049b4a9fc8c_1726608093.png",
    name: "Burger Kings",
  },
  {
    image:
      "https://b.zmtcdn.com/data/brand_creatives/logos/bba726b2cf5e9bed21280a9fe8d954a91712743700.png",
    name: "Hira Sweets",
  },
  {
    image:
      "https://b.zmtcdn.com/data/brand_creatives/logos/f1dc700c8be881b9a17be904971a0644_1726638885.png",
    name: "KFC",
  },
  {
    image:
      "https://b.zmtcdn.com/data/brand_creatives/logos/1356425eff0c9acd8ab6b0ad351759e4_1611253489.png",
    name: "Bikanervala",
  },
  {
    image:
      "https://b.zmtcdn.com/data/brand_creatives/logos/d5e9ecddad0404047d8f3a97fb4fff17_1733571414.png",
    name: "Punjabi Anghithi",
  },
  {
    image:
      "https://b.zmtcdn.com/data/brand_creatives/logos/7fdbbe0f4f0aff0bb3775f3ac819ecb0_1638424082.png",
    name: "Biryani Blues",
  },
  {
    image:
      "https://b.zmtcdn.com/data/brand_creatives/logos/9302c59eca94abbee01aec9acf9305f6_1676471786.png",
    name: "Subway",
  },
  {
    image:
      "https://b.zmtcdn.com/data/brand_creatives/logos/a52d138901fe2009cc770e5b85d7a3d2_1750250947.png",
    name: "Taco Bell",
  },
];

function renderFood() {
  const foodContainer = document.getElementById("foodContainer");
  if (!foodContainer) return;
  foodContainer.innerHTML = famousFood
    .map(
      (f) =>
        `<div class="item"><img src="${f.image}" alt="${f.name}" /><p>${f.name}</p></div>`,
    )
    .join("");
}

function renderBrands() {
  const brandsContainer = document.getElementById("brandsContainer");
  if (!brandsContainer) return;
  brandsContainer.innerHTML = brands
    .map(
      (b) =>
        `<div class="item"><img src="${b.image}" alt="${b.name}" /><p>${b.name}</p></div>`,
    )
    .join("");
}

function initApp() {
  setupNavigation();
  setupAuth();
  if (typeof restaurants !== "undefined") {
    renderRestaurants(restaurants);
    setupFilters(restaurants);
  }
  renderFood();
  renderBrands();
}
document.addEventListener("DOMContentLoaded", () => {
  const authButtons = document.getElementById("formButtons");
  const logOutBtn = document.getElementById("logOutBtn");
  const savedData = localStorage.getItem("userInfo");

  if (savedData) {
    // USER IS LOGGED IN
    if (authButtons) {
      authButtons.style.display = "none";
    }
    if (logOutBtn) {
      logOutBtn.style.display = "block";
      // Ensure the listener is only added once
      logOutBtn.onclick = () => {
        localStorage.removeItem("userInfo");
        window.location.href = "../HTML Pages/index.html";
      };
    }
  } else {
    // USER IS LOGGED OUT
    if (authButtons) {
      authButtons.style.display = "flex"; // Or "block" depending on your CSS
    }
    if (logOutBtn) {
      logOutBtn.style.display = "none";
    }
  }

  initApp();
});
