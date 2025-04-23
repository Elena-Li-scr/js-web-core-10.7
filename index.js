const input = document.querySelector(".search");
const autocompl = document.querySelector(".autocompl");
const cards = document.querySelector(".cards");
const template = document.querySelector(".hide-card");

const debounce = (fn, debounceTime) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), debounceTime);
  };
};

function addCard(item) {
  const card = template.content.cloneNode(true);
  card.querySelector(".card-name").textContent = `Name: ${item.name}`;
  card.querySelector(".card-owner").textContent = `Owner: ${item.owner.login}`;
  card.querySelector(
    ".card-stars"
  ).textContent = `Stars: ${item.stargazers_count}`;
  card.querySelector(".card-button").addEventListener("click", (evt) => {
    evt.target.closest(".card").remove();
  });
  cards.append(card);
  input.value = "";
  autocompl.innerHTML = "";
}

async function getRepos(query) {
  autocompl.innerHTML = "";
  if (!query) {
    autocompl.style.display = "none";
    return;
  }

  try {
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(
        query
      )}+in:name&per_page=5`
    );
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      autocompl.style.display = "block";
      data.items.forEach((item) => {
        const repo = document.createElement("p");
        repo.className = "repo";
        repo.textContent = `${item.name}`;
        repo.addEventListener("click", () => addCard(item));
        autocompl.appendChild(repo);
      });
    } else {
      autocompl.innerHTML = '<p class="no-results">No results</p>';
    }
  } catch (error) {
    console.error("Ошибка при получении репозиториев:", error);
    autocompl.innerHTML = '<p class="error-message">Try again later.</p>';
  }
}

const debounceGetRepos = debounce(getRepos, 700);

input.addEventListener("input", () => {
  if (input.value.trim()[0] === " ") return;
  debounceGetRepos(input.value.trim());
});
