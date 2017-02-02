'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     Elias Hussary - eliashussary@gmail.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     (c) 2017
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO add full coverage of API ( missing LISTS, NUTRIENT REPORTS endpoints )

var NutritionFacts = function () {
    function NuritionFacts() {
        var API_KEY = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'DEMO_KEY';

        _classCallCheck(this, NuritionFacts);

        // Register Default Globals;
        this.URI = 'https://api.nal.usda.gov/ndb/';
        if (API_KEY === 'DEMO_KEY') {
            console.warn('You have not inputted an API_KEY, by default you are using the DEMO KEY. \nPlease visit https://ndb.nal.usda.gov/ndb/doc/index to register for your API_KEY');
        }
        this.API_KEY = API_KEY;
        this.FORMAT = 'JSON';

        // Register default endpoint params;
        // FR = Food Report endpoint
        this.FR_ENDPOINT = this.URI + 'reports/';
        this.FR_TYPE = 'b';

        // SR = Search endpoint
        this.SR_ENDPOINT = this.URI + 'search/';
        this.SR_Q = '';
        this.SR_DS = '';
        this.SR_FG = '';
        this.SR_SORT = 'r';
        this.SR_MAX = 25;
        this.SR_OFFSET = 0;
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


    _createClass(NuritionFacts, [{
        key: 'searchFoods',
        value: function searchFoods(searchArgs) {
            var _this = this;

            return (0, _requestPromise2.default)({
                method: 'GET',
                url: this.SR_ENDPOINT,
                json: true,
                qs: {
                    api_key: this.API_KEY,
                    format: this.FORMAT,
                    q: searchArgs.q || this.SR_Q,
                    ds: searchArgs.ds || this.SR_DS,
                    fg: searchArgs.fg || this.SR_FG,
                    sort: searchArgs.sort || this.SR_SORT,
                    max: searchArgs.max || this.SR_MAX,
                    offset: searchArgs.offset || this.SR_OFFSET
                },
                transform: function transform(body) {
                    // TODO handle iteration asynchronously
                    body.list.item = body.list.item.map(function (item) {
                        return new FoodItem(_this.API_KEY, item);
                    });
                    return body;
                }
            });
        }

        /**
         * Get nutrition method to retrieve individual food item.
         * see: https://ndb.nal.usda.gov/ndb/doc/apilist/API-FOOD-REPORT.md
         * @param {String} foodId The ndbno id number of the food.
         * @param {String} [reportType='b'] The report type to retrieve.
         * @returns {Promise} request-promise
         */

    }, {
        key: 'getNutrition',
        value: function getNutrition(foodId) {
            var reportType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.FR_TYPE;

            return (0, _requestPromise2.default)({
                method: 'GET',
                url: this.FR_ENDPOINT,
                json: true,
                qs: {
                    api_key: this.API_KEY,
                    format: this.FORMAT,
                    ndbno: foodId,
                    type: reportType
                },
                transform: function transform(body) {
                    return body.report.food;
                }
            });
        }
    }]);

    return NuritionFacts;
}();

var FoodItem = function (_NutritionFacts) {
    _inherits(FoodItem, _NutritionFacts);

    function FoodItem(API_KEY, foodItem) {
        _classCallCheck(this, FoodItem);

        var _this2 = _possibleConstructorReturn(this, (FoodItem.__proto__ || Object.getPrototypeOf(FoodItem)).call(this, API_KEY));

        _this2.NDBNO = foodItem.ndbno;
        _this2.GROUP = foodItem.group;
        _this2.NAME = foodItem.name;
        _this2.DS = foodItem.ds;
        _this2.OFFSET = foodItem.offset;
        return _this2;
    }

    /**
     * Get nutrition method to retrieve individual food item.
     * see: https://ndb.nal.usda.gov/ndb/doc/apilist/API-FOOD-REPORT.md
     * @param {String} [reportType='b'] The report type to retrieve.
     * @returns {Promise} request-promise
     */


    _createClass(FoodItem, [{
        key: 'getNutrition',
        value: function getNutrition() {
            var reportType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'b';

            return _get(FoodItem.prototype.__proto__ || Object.getPrototypeOf(FoodItem.prototype), 'getNutrition', this).call(this, this.NDBNO, reportType);
        }

        // TODO measurement conversion helper methods

    }]);

    return FoodItem;
}(NutritionFacts);

exports.default = NutritionFacts;

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