// export const add = (a, b) => a + b;
// export const multiply = (a, b) => a * b;
// export const ID = 23;

import { elements } from './base';

// get search input method
export const getInput = () => elements.searchInput.value;

// clear search input field method
export const clearInput = () => {
  elements.searchInput.value = "";
};

// clear recipes results list method
export const clearResults = () => {
  elements.searchResList.innerHTML = "";
};

// one line title omit the rest
const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(' ')} ...`;
  }
  return title;
}

// render single recipe item UI - private method
const renderRecipe = recipe => {
  const markup = `
      <li>
          <a class="results__link results__link--active" href="#${recipe.recipe_id}">
              <figure class="results__fig">
                  <img src="${recipe.image_url}" alt="Test">
              </figure>
              <div class="results__data">
                  <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                  <p class="results__author">${recipe.publisher}</p>
              </div>
          </a>
      </li>
      `;
  elements.searchResList.insertAdjacentHTML('beforeend', markup);

};

// render recipes results list method
export const renderResults = recipes => {
  recipes.forEach(renderRecipe);
};
