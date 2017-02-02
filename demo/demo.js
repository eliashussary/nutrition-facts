import NutritionFacts from '../src/index'

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
        })

})
