/**
 * Swagger Easeat Auth API
 * This is a microservice for managing authentication
 *
 * The version of the OpenAPI document: 1.0
 * Contact: benjamin.guerre@viacesi.fr
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */


import ApiClient from "../ApiClient";
import ModelUser from '../model/ModelUser';

/**
* Auth service.
* @module api/AuthApi
* @version 1.0
*/
export default class AuthApi {

    /**
    * Constructs a new AuthApi. 
    * @alias module:api/AuthApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }


    /**
     * Callback function to receive the result of the authLogoutPost operation.
     * @callback module:api/AuthApi~authLogoutPostCallback
     * @param {String} error Error message, if any.
     * @param {String} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Logout the user
     * Logout the user
     * @param {module:api/AuthApi~authLogoutPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link String}
     */
    authLogoutPost(callback) {
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
      let returnType = 'String';
      return this.apiClient.callApi(
        '/auth/logout', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the authMeGet operation.
     * @callback module:api/AuthApi~authMeGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ModelUser} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get the current user
     * Get the current user
     * @param {module:api/AuthApi~authMeGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ModelUser}
     */
    authMeGet(callback) {
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
      let returnType = ModelUser;
      return this.apiClient.callApi(
        '/auth/me', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the authRefreshTokenPost operation.
     * @callback module:api/AuthApi~authRefreshTokenPostCallback
     * @param {String} error Error message, if any.
     * @param {String} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Refresh the JWT token
     * Refresh the JWT token
     * @param {String} token Token
     * @param {module:api/AuthApi~authRefreshTokenPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link String}
     */
    authRefreshTokenPost(token, callback) {
      let postBody = null;
      // verify the required parameter 'token' is set
      if (token === undefined || token === null) {
        throw new Error("Missing the required parameter 'token' when calling authRefreshTokenPost");
      }

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
        'token': token
      };

      let authNames = ['BearerAuth'];
      let contentTypes = ['application/x-www-form-urlencoded'];
      let accepts = ['application/json'];
      let returnType = 'String';
      return this.apiClient.callApi(
        '/auth/refreshToken', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the authResetPwdUserIdPost operation.
     * @callback module:api/AuthApi~authResetPwdUserIdPostCallback
     * @param {String} error Error message, if any.
     * @param {String} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Reset password
     * Reset password
     * @param {Number} userId User ID
     * @param {String} password New password
     * @param {module:api/AuthApi~authResetPwdUserIdPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link String}
     */
    authResetPwdUserIdPost(userId, password, callback) {
      let postBody = null;
      // verify the required parameter 'userId' is set
      if (userId === undefined || userId === null) {
        throw new Error("Missing the required parameter 'userId' when calling authResetPwdUserIdPost");
      }
      // verify the required parameter 'password' is set
      if (password === undefined || password === null) {
        throw new Error("Missing the required parameter 'password' when calling authResetPwdUserIdPost");
      }

      let pathParams = {
        'userId': userId
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
        'password': password
      };

      let authNames = ['BearerAuth'];
      let contentTypes = ['application/x-www-form-urlencoded'];
      let accepts = ['application/json'];
      let returnType = 'String';
      return this.apiClient.callApi(
        '/auth/resetPwd/{userId}', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }


}
