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
};

const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path] || routes[404];
  const html = await fetch(route).then((res) => res.text());
  document.getElementById("main").innerHTML = html;

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

  const productsContainer = document.getElementById("products-container");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const pageSpans = document.querySelectorAll(".pagination span");

  let currentPage = 1; // Track the current page
  const mealsPerPage = 8; // Number of meals per page

  const renderMeals = () => {
    // Clear the container
    productsContainer.innerHTML = "";

    // Calculate the start and end index for the current page
    const startIndex = (currentPage - 1) * mealsPerPage;
    const endIndex = startIndex + mealsPerPage;
    const mealsToDisplay = meals.slice(startIndex, endIndex);

    // Render meals
    mealsToDisplay.forEach((meal) => {
      const product = document.createElement("div");
      product.classList.add("bg-white", "shadow-md", "rounded-lg", "p-3");
      product.innerHTML = `
      <img src="${meal.image}" alt="" class="w-full rounded-md object-cover size-80" />
      <div class="card-body flex flex-col gap-1">
        <h3 class="text-lg font-bold">${meal.name}</h3>
        <p class="text-sm text-gray-500">${meal.description}</p>
        <button class="btn bg-primary text-white font-semibold rounded-xl p-2">اضف الى السلة</button>
      </div>
    `;
      productsContainer.appendChild(product);
    });

    // Update pagination buttons
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = endIndex >= meals.length;

    // Update page number spans
    pageSpans.forEach((span, index) => {
      span.textContent = currentPage + index;
      span.classList.toggle("bg-primary", currentPage + index === currentPage);
      span.classList.toggle("bg-gray-300", currentPage + index !== currentPage);
    });
  };

  // Event listener for the "Previous" button
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderMeals();
    }
  });

  // Event listener for the "Next" button
  nextButton.addEventListener("click", () => {
    const totalPages = Math.ceil(meals.length / mealsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderMeals();
    }
  });

  // Initial render
  renderMeals();
};

// Expose route function globally
window.onpopstate = handleLocation;
window.route = route;

handleLocation();
