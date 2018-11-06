// Global app controller
// import str from './models/Search';
// import { add as a, multiply as m, ID } from './views/searchView';
// console.log(`I imported ${a(ID, 2)} and ${m(3,5)} and ${str} from models and views`);

import Search from './models/Search';

const search = new Search('pizza');
console.log(search);
search.getResults();
