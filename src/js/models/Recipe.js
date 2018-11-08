// recipe model
import axios from 'axios';
import { key } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
      console.log(res);
    } catch (e) {
        console.log(e);
        alert('sth went wrong');
    }
  }

  calcTime() {
    // assume time = 15 * every 3 ingredient
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cup', 'pounds'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    const units = [...unitsShort, 'kg', 'g'];

    const newIngredients = this.ingredients.map(el => {
      // deal with each ingredient in ingredients
      // uniform units - change to short unit
      let ingredient = el.toLowerCase();
      unitsLong.forEach((long, i) => {
        ingredient = ingredient.replace(long, unitsShort[i]);
      });
      // remove text between parenthesis
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');


      // parse ingredient into count, unit and ingredient
      const arrIng = ingredient.split(' ');
      // find idx of the unit
      const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

      // ingredient object
      let objIng;
      if (unitIndex > -1) { // has unit
        // get nums/count subarray
        const arrCount = arrIng.slice(0, unitIndex);

        let count;
        if (arrCount.length == 1) { // only 1 num
          count = eval(arrIng[0].replace('-', '+')); // case: '1-1/3'
        } else { // more than 1 num
          count = eval(arrCount.join('+')); // case: ['1', '1/3']
        }

        objIng = {
            count,
            unit: arrIng[unitIndex],
            ingredient: arrIng.slice(unitIndex + 1).join(' ')
        };

      } else if (parseInt(arrIng[0], 10)) { // no unit, 1st el is num
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        };
      } else if (unitIndex === -1) { // no unit, 1st el is not num
        objIng = {
          count: 1,
          unit: '',
          ingredient
        };
      }

      return objIng;
    });
    this.ingredients = newIngredients;
  }

  updateServings (type) {
    // servings update +/-
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
    // update every ingredient count
    this.ingredients.forEach(ing => {
      ing.count *= (newServings / this.servings);
    });

    this.servings = newServings;
  }
}
