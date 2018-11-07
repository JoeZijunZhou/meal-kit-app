// Global app controller
// import str from './models/Search';
// import { add as a, multiply as m, ID } from './views/searchView';
// console.log(`I imported ${a(ID, 2)} and ${m(3,5)} and ${str} from models and views`);

import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

// state object - store events states
const state = {};

// search controller
const controlSearch = async () => {
  // get query from view
  const query = searchView.getInput();

  if (query) {
    // new search obj and add to state
    state.search = new Search(query);
    // clear input field & previous search UI setup
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    // search recipes
    await state.search.getResults();
    // display result UI
    console.log(state);
    console.log(state.search.result);
    clearLoader();
    searchView.renderResults(state.search.result);
  }
}

// search event handler/listener
elements.searchForm.addEventListener('submit', event => {
  event.preventDefault();
  controlSearch();
});

// page prev next event handler/listener
elements.searchResPages.addEventListener('click', event => {
  const btn = event.target.closest('.btn-inline');
  if (btn) {
    // btn trigger goto page number
    const goToPage = parseInt(btn.dataset.goto, 10);
    // clear old page
    searchView.clearResults();
    // render new page
    searchView.renderResults(state.search.result, goToPage);
    console.log(goToPage);

  }
});
