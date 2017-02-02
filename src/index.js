/*
Elias Hussary - eliashussary@gmail.com
(c) 2017
 */

import req from 'request-promise';

// TODO add full coverage of API ( missing LISTS, NUTRIENT REPORTS endpoints )

const NutritionFacts = class NuritionFacts {
    constructor(API_KEY = 'DEMO_KEY'){
        // Register Default Globals;
        this.URI = 'https://api.nal.usda.gov/ndb/'
        if(API_KEY === 'DEMO_KEY'){
            console.warn('You have not inputted an API_KEY, by default you are using the DEMO KEY. \nPlease visit https://ndb.nal.usda.gov/ndb/doc/index to register for your API_KEY')
        }
        this.API_KEY = API_KEY
        this.FORMAT = 'JSON'

        // Register default endpoint params;
        // FR = Food Report endpoint
        this.FR_ENDPOINT = `${this.URI}reports/`
        this.FR_TYPE = 'b'
        
        // SR = Search endpoint
        this.SR_ENDPOINT = `${this.URI}search/`
        this.SR_Q = ''
        this.SR_DS = ''
        this.SR_FG = ''
        this.SR_SORT = 'r'
        this.SR_MAX = 25
        this.SR_OFFSET = 0
    }

    /**
     * Search method to query USDA NDB database.
     * see: https://ndb.nal.usda.gov/ndb/doc/apilist/API-SEARCH.md
     * @param {Object} searchArgs USDA NDB Search Arguements
     * @param {String} searchArgs.q The search terms.
     * @param {String} [searchArgs.max = 25] Maximum results to retrieve.
     * @param {String} [searchArgs.offset = 0] Offset reults by x amount.
     * @param {String} [searchArgs.ds] The data source either 'Branded Food Products' or 'Standard Reference'.
     * @param {String} [searchArgs.fg] The food group.
     * @param {String} [searchArgs.sort = 'r'] Sort method, 'r' by relevance or 'n' by name.
     * @returns {Promise} request-promise
     */
    searchFoods(searchArgs){
        return req({
            method: 'GET',
            url: this.SR_ENDPOINT,
            json: true,
            qs:{
                api_key: this.API_KEY,
                format: this.FORMAT,
                q: searchArgs.q || this.SR_Q,
                ds: searchArgs.ds || this.SR_DS,
                fg: searchArgs.fg || this.SR_FG,
                sort: searchArgs.sort || this.SR_SORT,
                max: searchArgs.max || this.SR_MAX,
                offset: searchArgs.offset || this.SR_OFFSET,
            },
            transform: (body) => {
                // TODO handle iteration asynchronously
                body.list.item = body.list.item.map(item => {
                    return new FoodItem(this.API_KEY, item)
                })
                return body
            }
        })
    }

    /**
     * Get nutrition method to retrieve individual food item.
     * see: https://ndb.nal.usda.gov/ndb/doc/apilist/API-FOOD-REPORT.md
     * @param {String} foodId The ndbno id number of the food.
     * @param {String} [reportType='b'] The report type to retrieve.
     * @returns {Promise} request-promise
     */
    getNutrition(foodId, reportType = this.FR_TYPE){
        return req({
            method: 'GET',
            url: this.FR_ENDPOINT,
            json: true,
            qs: {
                api_key: this.API_KEY,
                format: this.FORMAT,
                ndbno: foodId,
                type: reportType
            },
            transform: (body) => {
                return body.report.food
            }
        })
    }
}

const FoodItem = class FoodItem extends NutritionFacts {
    constructor(API_KEY, foodItem){
        super(API_KEY)
        this.NDBNO = foodItem.ndbno
        this.GROUP = foodItem.group
        this.NAME = foodItem.name
        this.DS = foodItem.ds
        this.OFFSET = foodItem.offset
    }

    /**
     * Get nutrition method to retrieve individual food item.
     * see: https://ndb.nal.usda.gov/ndb/doc/apilist/API-FOOD-REPORT.md
     * @param {String} [reportType='b'] The report type to retrieve.
     * @returns {Promise} request-promise
     */
    getNutrition(reportType = 'b'){
        return super.getNutrition(this.NDBNO, reportType)
    }

    // TODO measurement conversion helper methods
}

export default NutritionFacts


/*
Food Report:
------------------
api_key     - self explanatory
ndbno       - food id
type        - [b] basic [f] full [s] stats
format      - JSON

Search:
------------------
api_key     - self explanatory
q           - search terms
ds          - data source [Branded Food Products] [Standard Reference]
fg          - food group id
sort        - [r] relevance or [n] name
max         - max rows
offset      - offset
format      - JSON
*/