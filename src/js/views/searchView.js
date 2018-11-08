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
  elements.searchResPages.innerHTML = "";
};

// highlight selected item in the results list
export const highlightSelected = id => {
  const resultsArr = Array.from(document.querySelectorAll('.results__link'));
  resultsArr.forEach(el => {
    el.classList.remove('results__link--active');
  });
  document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
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
          <a class="results__link" href="#${recipe.recipe_id}">
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

// create single button UI - private method
const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
      <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
      </svg>
      <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
  </button>
`;

// render button for each page - private method
const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);

  let button;
  if (page === 1 && pages > 1) { // next button
    button = createButton(page, 'next');
  } else if (page < pages) { // two buttons
    button = `
      ${createButton(page, 'prev')}
      ${createButton(page, 'next')}
    `;
  } else if (page === pages && pages > 1) { // pre button
    button = createButton(page, 'prev');
  }
  elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

// render recipes results list method
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // pagination
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  // each page (subarray) iterate
  recipes.slice(start, end).forEach(renderRecipe);
  renderButtons(page, recipes.length, resPerPage);
};
