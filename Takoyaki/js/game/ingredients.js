(function registerIngredients(app) {
  "use strict";

  app.Ingredients = {
    toppings: {
      greenOnion: { icon: "🧅", score: 25 },
      beni: { icon: "🥓", score: 25 },
      tenkasu: { icon: "✨", score: 25 },
      mixed: { icon: "🌈", score: 30 }
    },
    sauces: {
      classic: { icon: "🍯", score: 35 },
      mayo: { icon: "🧂", score: 35 },
      special: { icon: "🍯", score: 45 }
    },
    getTopping(level) {
      return this.toppings[level.topping] || this.toppings.greenOnion;
    },
    getSauce(level) {
      return this.sauces[level.sauce] || this.sauces.classic;
    }
  };
})(window.Takoyaki = window.Takoyaki || {});
