(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const createHeader = (title = "점심 뭐 먹지") => {
  const header = document.createElement("header");
  header.classList.add("gnb");
  header.innerHTML = /*html*/
  `
    <h1 class="gnb__title text-title">${title}</h1>
    <button type="button" class="gnb__button" aria-label="음식점 추가">
      <img src="./assets/add-button.png" alt="음식점 추가">
    </button>
  `;
  return header;
};
const sortingBy = (value, restaurants) => {
  const dataToSort = [...restaurants];
  if (value === "distance") {
    return dataToSort.sort(
      (restaurantA, restaurantB) => restaurantA.distance - restaurantB.distance
    );
  }
  if (value === "name") {
    return dataToSort.sort(
      (restaurantA, restaurantB) => restaurantA.name.localeCompare(restaurantB.name)
    );
  }
};
const restaurantData = [
  {
    category: "한식",
    name: "피양콩할마니",
    distance: 10,
    description: "평양 출신의 할머니가 수십 년간 운영해온 비지 전문점 피양콩 할마니. 두부를 빼지 않은 되비지를 맛볼 수 있는 곳으로, ‘피양’은 평안도 사투리로 ‘평양’을 의미한다. 딸과 함께 운영하는 이곳에선 맷돌로 직접 간 콩만을 사용하며, 일체의 조미료를 넣지 않은 건강식을 선보인다. 콩비지와 피양 만두가 이곳의 대표 메뉴지만, 할머니가 옛날 방식을 고수하며 만들어내는 비지전골 또한 이 집의 역사를 느낄 수 있는 특별한 메뉴다. 반찬은 손님들이 먹고 싶은 만큼 덜어 먹을 수 있게 준비돼 있다."
  },
  {
    category: "중식",
    name: "친친",
    distance: 5,
    description: "Since 2004 편리한 교통과 주차, 그리고 관록만큼 깊은 맛과 정성으로 정통 중식의 세계를 펼쳐갑니다."
  },
  {
    category: "일식",
    name: "잇쇼우",
    distance: 10,
    description: "잇쇼우는 정통 자가제면 사누끼 우동이 대표메뉴입니다. 기술은 정성을 이길 수 없다는 신념으로 모든 음식에 최선을 다하는 잇쇼우는 고객 한분 한분께 최선을 다하겠습니다."
  },
  {
    category: "양식",
    name: "이태리키친",
    distance: 20,
    description: "늘 변화를 추구하는 이태리키친입니다."
  },
  {
    category: "아시안",
    name: "호아빈 삼성점",
    distance: 15,
    description: "푸짐한 양에 국물이 일품인 쌀국수."
  },
  {
    category: "기타",
    name: "도스타코스 선릉점",
    distance: 5,
    description: "멕시칸 캐주얼 그릴."
  }
];
const createFragment = () => document.createDocumentFragment();
const CATEGORY_IMG_SRC = {
  "한식": `./assets/category-korean.png`,
  "중식": `./assets/category-chinese.png`,
  "일식": `./assets/category-japanese.png`,
  "양식": `./assets/category-western.png`,
  "아시안": `./assets/category-asian.png`,
  "기타": `./assets/category-etc.png`
};
const createRestaurantListItem = ({
  category,
  name,
  distance,
  description
}) => {
  const restaurantListItem = document.createElement("li");
  restaurantListItem.classList.add("restaurant");
  restaurantListItem.innerHTML = /*html*/
  `
        <div class="restaurant__category">
            <img src= "${CATEGORY_IMG_SRC[category] || CATEGORY_IMG_SRC.기타} " alt="${category}" class="category-icon">
        </div>
        <div class="restaurant__info">
            <h3 class="restaurant__name text-subtitle">${name}</h3>
            <span class="restaurant__distance text-body">캠퍼스부터 ${distance}분 내</span>
            <p class="restaurant__description text-body">
            ${description}
            </p>
        </div>
        `;
  return restaurantListItem;
};
const createRestaurantList = (restaurants = restaurantData) => {
  const restaurantList = document.createElement("ul");
  restaurantList.classList.add("restaurant-list");
  const fragment = createFragment();
  restaurants.forEach((item) => {
    const listItem = createRestaurantListItem({
      category: item.category,
      name: item.name,
      distance: item.distance,
      description: item.description
    });
    fragment.appendChild(listItem);
  });
  restaurantList.appendChild(fragment);
  return restaurantList;
};
const createRestaurantListSection = (restaurants) => {
  const restaurantListSection = document.createElement("section");
  restaurantListSection.classList.add("restaurant-list-container");
  const restaurantList = renderRestaurantList(restaurants);
  restaurantListSection.appendChild(restaurantList);
  return restaurantListSection;
};
const renderRestaurantList = (restaurants) => {
  const sortingFilter = document.getElementById("sorting-filter");
  const selectedSort = sortingFilter.value;
  const sortedRestaurantData = sortingBy(selectedSort, restaurants);
  const restaurantList = createRestaurantList(sortedRestaurantData);
  return restaurantList;
};
const filterByCategory = (category, restaurants) => {
  if (category === "전체") return restaurants;
  return restaurants.filter((restaurant) => restaurant.category === category);
};
const addEvent = () => {
  const categoryFilter = document.getElementById("category-filter");
  const sortingFilter = document.getElementById("sorting-filter");
  const updateRestaurantList = () => {
    const selectedCategory = categoryFilter.value;
    const filteredRestaurants = filterByCategory(
      selectedCategory,
      restaurantData
    );
    const selectedSort = sortingFilter.value;
    const sortedRestaurants = sortingBy(selectedSort, filteredRestaurants);
    const restaurantList = createRestaurantList(sortedRestaurants);
    const listContainer = document.querySelector(".restaurant-list");
    listContainer.replaceWith(restaurantList);
  };
  categoryFilter.addEventListener("change", updateRestaurantList);
  sortingFilter.addEventListener("change", updateRestaurantList);
};
addEventListener("load", () => {
  const body = document.querySelector("body");
  const header = createHeader();
  body.prepend(header);
  const main = document.querySelector("main");
  const restaurantListSection = createRestaurantListSection(restaurantData);
  main.appendChild(restaurantListSection);
  addEvent();
});
