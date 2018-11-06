// Global app controller
// import str from './models/Search';
// import { add as a, multiply as m, ID } from './views/searchView';
// console.log(`I imported ${a(ID, 2)} and ${m(3,5)} and ${str} from models and views`);

import Search from './models/Search';

const state = {};

const controlSearch = async () => {
  // get query from view
  const query = 'pizza';

  if (query) {
    // new search obj and add to state
    state.search = new Search(query);
    // UI setup

    // search recipes
    await state.search.getResults();
    // display result UI
    console.log(state);
    console.log(state.search.result);
  }
}


document.querySelector('.search').addEventListener('submit', event => {
  event.preventDefault();
  controlSearch();
});
