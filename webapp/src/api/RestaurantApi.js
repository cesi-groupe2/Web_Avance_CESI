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
     * Callback function to receive the result of the restaurantMyGet operation.
     * @callback module:api/RestaurantApi~restaurantMyGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/ModelRestaurant>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get the restaurants owned by the user
     * Get the restaurants owned by the user
     * @param {module:api/RestaurantApi~restaurantMyGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/ModelRestaurant>}
     */
    restaurantMyGet(callback) {
      let postBody = null;

      let pathParams = {
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
        '/restaurant/my', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
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
     * Callback function to receive the result of the restaurantNewPost operation.
     * @callback module:api/RestaurantApi~restaurantNewPostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ModelRestaurant} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create a new restaurant
     * Create a new restaurant
     * @param {String} name Name of the restaurant
     * @param {String} phone Phone number of the restaurant
     * @param {String} address Address of the restaurant
     * @param {String} localisationLatitude Latitude of the restaurant
     * @param {String} localisationLongitude Longitude of the restaurant
     * @param {File} picture Picture of the restaurant
     * @param {String} opening_hours Opening hours of the restaurant
     * @param {module:api/RestaurantApi~restaurantNewPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ModelRestaurant}
     */
    restaurantNewPost(name, phone, address, localisationLatitude, localisationLongitude, picture, opening_hours,	 callback) {
      let postBody = null;
      // verify the required parameter 'name' is set
      if (name === undefined || name === null) {
        throw new Error("Missing the required parameter 'name' when calling restaurantNewPost");
      }
      // verify the required parameter 'phone' is set
      if (phone === undefined || phone === null) {
        throw new Error("Missing the required parameter 'phone' when calling restaurantNewPost");
      }
      // verify the required parameter 'address' is set
      if (address === undefined || address === null) {
        throw new Error("Missing the required parameter 'address' when calling restaurantNewPost");
      }
      // verify the required parameter 'localisationLatitude' is set
      if (localisationLatitude === undefined || localisationLatitude === null) {
        throw new Error("Missing the required parameter 'localisationLatitude' when calling restaurantNewPost");
      }
      // verify the required parameter 'localisationLongitude' is set
      if (localisationLongitude === undefined || localisationLongitude === null) {
        throw new Error("Missing the required parameter 'localisationLongitude' when calling restaurantNewPost");
      }
      // verify the required parameter 'picture' is set
      if (picture === undefined || picture === null) {
        throw new Error("Missing the required parameter 'picture' when calling restaurantNewPost");
      }

      // verify the required parameter 'opening_hours' is set
      if (opening_hours === undefined || opening_hours === null) {
        throw new Error("Missing the required parameter 'opening_hours' when calling restaurantNewPost");
      }

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
        'name': name,
        'phone': phone,
        'address': address,
        'localisation_latitude': localisationLatitude,
        'localisation_longitude': localisationLongitude,
        'picture': picture,
        'opening_hours': opening_hours,
      };

      let authNames = ['BearerAuth'];
      let contentTypes = ['multipart/form-data'];
      let accepts = ['application/json'];
      let returnType = ModelRestaurant;
      return this.apiClient.callApi(
        '/restaurant/new', 'POST',
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
