//this defines an object literal, containing multiple array items
// containing numerical keys and nested objects (defined by {} );

let books = {
      1: {"author": "Chinua Achebe","title": "Things Fall Apart", "reviews": {} },
      2: {"author": "Hans Christian Andersen","title": "Fairy tales", "reviews": {} },
      3: {"author": "Dante Alighieri","title": "The Divine Comedy", "reviews": "Funny!" },
      4: {"author": "Unknown","title": "The Epic Of Gilgamesh", "reviews": "OK" },
      5: {"author": "Unknown","title": "The Book Of Job", "reviews": "Oh well..." },
      6: {"author": "Unknown","title": "One Thousand and One Nights", "reviews": "A classic" },
      7: {"author": "Unknown","title": "Nj\u00e1l's Saga", "reviews": "Don't know..." },
      8: {"author": "Jane Austen","title": "Pride and Prejudice", "reviews": "Good for killing time" },
      9: {"author": "Honor\u00e9 de Balzac","title": "Le P\u00e8re Goriot", "reviews": "Didn't finish..." },
      10: {"author": "Samuel Beckett","title": "Molloy, Malone Dies, The Unnamable, the trilogy", "reviews": "Okay book." }
}

module.exports=books;
