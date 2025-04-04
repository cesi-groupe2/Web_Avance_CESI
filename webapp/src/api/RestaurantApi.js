/**
 * Swagger Easeat restaurant microservice
 * This is a microservice for managing restaurants
 *
 * The version of the OpenAPI document: 2.0
 * Contact: benjamin.guerre@viacesi.fr
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */


import ApiClient from "../ApiClient";
import ModelMenuitem from '../model/ModelMenuitem';
import ModelRestaurant from '../model/ModelRestaurant';

/**
* Restaurant service.
* @module api/RestaurantApi
* @version 2.0
*/
export default class RestaurantApi {

    /**
    * Constructs a new RestaurantApi. 
    * @alias module:api/RestaurantApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }


    /**
     * Callback function to receive the result of the restaurantNearbyLatitudeLongitudeKmAroundGet operation.
     * @callback module:api/RestaurantApi~restaurantNearbyLatitudeLongitudeKmAroundGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/ModelRestaurant>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get nearby restaurants
     * Get nearby restaurants from the user's location
     * @param {String} latitude Latitude of the user
     * @param {String} longitude Longitude of the user
     * @param {String} kmAround Distance around the user in km
     * @param {module:api/RestaurantApi~restaurantNearbyLatitudeLongitudeKmAroundGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/ModelRestaurant>}
     */
    restaurantNearbyLatitudeLongitudeKmAroundGet(latitude, longitude, kmAround, callback) {
      let postBody = null;
      // verify the required parameter 'latitude' is set
      if (latitude === undefined || latitude === null) {
        throw new Error("Missing the required parameter 'latitude' when calling restaurantNearbyLatitudeLongitudeKmAroundGet");
      }
      // verify the required parameter 'longitude' is set
      if (longitude === undefined || longitude === null) {
        throw new Error("Missing the required parameter 'longitude' when calling restaurantNearbyLatitudeLongitudeKmAroundGet");
      }
      // verify the required parameter 'kmAround' is set
      if (kmAround === undefined || kmAround === null) {
        throw new Error("Missing the required parameter 'kmAround' when calling restaurantNearbyLatitudeLongitudeKmAroundGet");
      }

      let pathParams = {
        'latitude': latitude,
        'longitude': longitude,
        'kmAround': kmAround
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['BearerAuth'];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = [ModelRestaurant];
      return this.apiClient.callApi(
        '/restaurant/nearby/{latitude}/{longitude}/{kmAround}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the restaurantRestaurantIdGet operation.
     * @callback module:api/RestaurantApi~restaurantRestaurantIdGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ModelRestaurant} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get a restaurant by its id
     * Get a restaurant by its id
     * @param {String} restaurantId Restaurant ID
     * @param {module:api/RestaurantApi~restaurantRestaurantIdGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ModelRestaurant}
     */
    restaurantRestaurantIdGet(restaurantId, callback) {
      let postBody = null;
      // verify the required parameter 'restaurantId' is set
      if (restaurantId === undefined || restaurantId === null) {
        throw new Error("Missing the required parameter 'restaurantId' when calling restaurantRestaurantIdGet");
      }

      let pathParams = {
        'restaurantId': restaurantId
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['BearerAuth'];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = ModelRestaurant;
      return this.apiClient.callApi(
        '/restaurant/{restaurantId}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the restaurantRestaurantIdMenuitemsGet operation.
     * @callback module:api/RestaurantApi~restaurantRestaurantIdMenuitemsGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/ModelMenuitem>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get menu items by restaurant id
     * Get menu items by restaurant id
     * @param {String} restaurantId Restaurant ID
     * @param {module:api/RestaurantApi~restaurantRestaurantIdMenuitemsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/ModelMenuitem>}
     */
    restaurantRestaurantIdMenuitemsGet(restaurantId, callback) {
      let postBody = null;
      // verify the required parameter 'restaurantId' is set
      if (restaurantId === undefined || restaurantId === null) {
        throw new Error("Missing the required parameter 'restaurantId' when calling restaurantRestaurantIdMenuitemsGet");
      }

      let pathParams = {
        'restaurantId': restaurantId
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['BearerAuth'];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = [ModelMenuitem];
      return this.apiClient.callApi(
        '/restaurant/{restaurantId}/menuitems', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }


}
