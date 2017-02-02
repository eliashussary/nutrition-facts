# Nutrition Facts


### About
A NodeJs wrapper of the [USDA Food Composition Database API (NDB API)](https://ndb.nal.usda.gov/ndb/doc/index).


### Install Nutrition Facts
```Javascript
npm install nutrition-facts --save
```

### API Documentation and API Keys
[Please refer to the NDB Documentation website](https://ndb.nal.usda.gov/ndb/doc/index)

### Script Example
See [Demo Script](https://github.com/eliash91/nutrition-facts/blob/master/demo/demo.js)
```Javascript
import NutritionFacts from 'nutrition-facts'
   
const NF = new NutritionFacts(process.env.USDA_NDB_API_KEY);
  
NF.searchFoods({
    q: 'salted butter',
    ds: 'Standard Reference'
}).then(results => {
    
    // Returns search results
    let mySelectedItem = results.list.item[0]
    
    // Items are returned as a FoodItem instance
    // allowing you to call 'getNutrition' directly on the instance.
    mySelectedItem.getNutrition()
        .then(nutritionReport => {
            console.log(nutritionReport)
        }).catch(err => {
            console.log(err)
        })
        
}).catch(err => {
    console.log(err)
})

// Alternatively, if you know the NDBNO off-hand
// you can call 'getNutrition' from the NF instance.

NF.getNutrition('01001','b')
    .then(nutritionReport => {
        console.log(nutritionReport)
    }).catch(err => {
        console.log(err)
    })
```

####License
MIT License
Copyright (c) 2017 Elias Hussary

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.