import axios from 'axios';

// search class
export default class Search {
  constructor(query) {
    // query - search field input
    this.query = query;
  }
  // define methods
  // get recipes API results
  async getResults() {
    const key = '38a57c95216d214967ff5f785575a072';
    try {
      const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = res.data.recipes;
      console.log(this.result);
    } catch (e) {
      console.log(e);
    }

  }
}
