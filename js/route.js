import { meals } from "./data.js";

const route = (e) => {
  e = e || window.event;
  e.preventDefault();
  const target = e.currentTarget;
  window.history.pushState({}, "", target.href);
  handleLocation();
};

const routes = {
  404: "/pages/404.html",
  "/": "/pages/home.html",
  "/about": "/pages/about.html",
  "/contact": "/pages/contact.html",
  "/menu": "/pages/menu.html",
  "/cart": "/pages/cart.html",
};

const handleLocation = async () => {
  try {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    const response = await fetch(route);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const mainElement = document.getElementById("main");

    if (!mainElement) {
      console.error("Main element not found");
      return;
    }

    mainElement.innerHTML = html;

    // Initialize Swiper if elements exist
    if (document.querySelector(".mySwiper")) {
      var swiper = new Swiper(".mySwiper", {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    }

    const productsContainer = document.getElementById("products-container");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    const pageSpans = document.querySelectorAll(".pagination span");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cartCount = document.getElementById("cart-count");
    const cartContainer = document.getElementById("cart-container");
    const cartTotal = document.getElementById("total-price");

    // Cart functionality
    let cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];

    const addToCart = (id) => {
      const meal = meals.find((meal) => meal.id === id);
      if (meal) {
        cart.push(meal);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("تمت الاضافة الى السلة");
        updateCartCount();
        updateCartTotal();
        renderCart();
      }
    };

    const removeFromCart = (id) => {
      cart = cart.filter((meal) => meal.id !== id);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("تمت الإزالة من السلة");
      updateCartCount();
      updateCartTotal();
      renderCart();
    };

    const updateCartCount = () => {
      if (cartCount) cartCount.textContent = cart.length;
    };

    const updateCartTotal = () => {
      if (cartTotal) {
        const total = cart.reduce((acc, meal) => acc + (meal.price || 0), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
      }
    };

    const renderCart = () => {
      if (!cartContainer) return;

      cartContainer.innerHTML = "";
      cart.forEach((meal) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("bg-white", "shadow-md", "rounded-lg", "p-3");
        cartItem.innerHTML = `
          <img src="${meal.image || ""}" alt="${
          meal.name || ""
        }" class="w-full rounded-md object-cover size-80" />
          <div class="card-body flex flex-col gap-1">
            <h3 class="text-lg font-bold">${meal.name || "Unnamed Item"}</h3>
            <p class="text-sm text-gray-500">${meal.description || ""}</p>
            <button onclick="window.removeFromCart(${
              meal.id
            })" class="btn bg-primary text-white font-semibold rounded-xl p-2">ازالة</button>
          </div>
        `;
        cartContainer.appendChild(cartItem);
      });
    };

    let currentPage = 1;
    const mealsPerPage = 8;
    let filteredMeals = [...meals];

    const renderMeals = () => {
      if (!productsContainer) return;

      productsContainer.innerHTML = "";
      const startIndex = (currentPage - 1) * mealsPerPage;
      const endIndex = startIndex + mealsPerPage;
      const mealsToDisplay = filteredMeals.slice(startIndex, endIndex);

      mealsToDisplay.forEach((meal) => {
        const product = document.createElement("div");
        product.classList.add("bg-white", "shadow-md", "rounded-lg", "p-3");
        product.innerHTML = `
          <img src="${meal.image || ""}" alt="${
          meal.name || ""
        }" class="w-full rounded-md object-cover size-80" />
          <div class="card-body flex flex-col gap-1">
            <h3 class="text-lg font-bold">${meal.name || "Unnamed Meal"}</h3>
            <p class="text-sm text-gray-500">${meal.description || ""}</p>
            <button onclick="window.addToCart(${
              meal.id
            })" class="btn bg-primary text-white font-semibold rounded-xl p-2">اضف الى السلة</button>
          </div>
        `;
        productsContainer.appendChild(product);
      });

      if (prevButton) prevButton.disabled = currentPage === 1;
      if (nextButton) nextButton.disabled = endIndex >= filteredMeals.length;

      pageSpans.forEach((span, index) => {
        const pageNum = currentPage + index;
        span.textContent = pageNum;
        span.classList.toggle("bg-primary", pageNum === currentPage);
        span.classList.toggle("bg-gray-300", pageNum !== currentPage);
      });
    };

    // Event Listeners
    if (prevButton) {
      prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          renderMeals();
        }
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredMeals.length / mealsPerPage);
        if (currentPage < totalPages) {
          currentPage++;
          renderMeals();
        }
      });
    }

    filterButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const filter = e.target.dataset.filter;
        filteredMeals =
          filter === "all"
            ? [...meals]
            : meals.filter((meal) => meal.category === filter);
        currentPage = 1;
        renderMeals();
      });
    });

    // Expose functions to window
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;

    // Initial render
    updateCartCount();
    updateCartTotal();
    renderCart();
    renderMeals();
  } catch (error) {
    console.error("Error in handleLocation:", error);
    const mainElement = document.getElementById("main");
    if (mainElement) {
      mainElement.innerHTML =
        "<h1>Error loading page</h1><p>Please try again later</p>";
    }
  }
};

// Window event handlers
window.onpopstate = handleLocation;
window.route = route;

// Initial load
handleLocation();
