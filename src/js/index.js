// Global app controller
// import str from './models/Search';
// import { add as a, multiply as m, ID } from './views/searchView';
// console.log(`I imported ${a(ID, 2)} and ${m(3,5)} and ${str} from models and views`);

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

// state object - store events states
const state = {};

/**
 * search controller
 */
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

    try {
      // search recipes
      await state.search.getResults();
      // display result UI
      console.log(state);
      console.log(state.search.result);
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (e) {
      alert(e);
      clearLoader();
    }

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


/**
 * recipe controller
 */
// const r = new Recipe(46956);
// r.getRecipe();
// console.log(r);
const controlRecipe = async () => {
  // get recipe id from url
  const id = window.location.hash.replace('#', '');
  console.log(id);

  if (id) {
    // clear previous recipe UI
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // highlight selected recipe item
    searchView.highlightSelected(id);

    // create new recipe object
    state.recipe = new Recipe(id);

    try {
      // get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // calculate time & servings
      state.recipe.calcTime();
      state.recipe.calcServings();
      // render recipe UI
      console.log(state.recipe);
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

    } catch (e) {
      alert(`Error processing recipe: ${e}`);
    }

  }
};

// hash change & load page event handler/listener
// window.addEventListener('hashchange', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/**
 * list controller
 */
const controlList = () => {
  // new list data model if not exist
  if (!state.list) {
    state.list = new List();
  }

  // add ingredient to the list and display
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}

// delete & update list item event handler/listener
elements.shopping.addEventListener('click', e => {
  // find the id of this item (area click)
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // delete item
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // delete from state shopping list
    state.list.deleteItem(id);
    // delete from UI
    listView.deleteItem(id);

  // shopping list item count update
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});


/**
 * like controller
 */
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {
  // new like data model if not exist
  if (!state.likes) {
    state.likes = new Likes();
  }
  const currentID = state.recipe.id;

  // update like for this recipe
  if (!state.likes.isLiked(currentID)) { // not like -> like
    // add like to state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    // toggle like btn
    likesView.toggleLikeBtn(true);
    // add like item to list UI
    console.log(state.likes);
    likesView.renderLike(newLike);

  } else { // like -> not like
    // remove like to state
    const newLike = state.likes.deleteLike(currentID);
    // toggle like btn
    likesView.toggleLikeBtn(false);
    // remove like item to list UI
    console.log(state.likes);
    likesView.deleteLike(currentID);

  }
  // toggle like menu icon
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// recipe servings +/- event handler/listener
// add to shopping list event handler/listener
// add like event handler/listener
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    controlLike();
  }
  console.log(state.recipe);
});
