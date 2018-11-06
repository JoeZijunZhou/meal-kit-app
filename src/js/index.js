// Global app controller
// import str from './models/Search';
// import { add as a, multiply as m, ID } from './views/searchView';
// console.log(`I imported ${a(ID, 2)} and ${m(3,5)} and ${str} from models and views`);

import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';

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
    // search recipes
    await state.search.getResults();
    // display result UI
    console.log(state);
    console.log(state.search.result);
    searchView.renderResults(state.search.result);
  }
}

// search event handler/listener
elements.searchForm.addEventListener('submit', event => {
  event.preventDefault();
  controlSearch();
});
