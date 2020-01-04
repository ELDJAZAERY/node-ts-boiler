/**
 *
 * @_Feature_Designe_Patern_
 *
 * 1- @_dtos
 *      ## contien les data transfer objects ##
 *      ## used for validate the data recived ##
 *
 * 2- @_interfaces
 *
 * 3- @_Enums
 *
 * 4- @_Model
 *      ## data base models object - used with typeorm or mongoos ORM
 *
 * 5- @_Controller
 *      ## init the routes of this feature
 *
 * 6- @_Service
 *      ## all the feature function
 *
 * 7- @_API
 *      ## rest api docs with open rest api plugin in vsCode
 */

/**
 *
 * @_REQUIRED_FEATURES_   [ @_USER_FEATURE ]
 *
 */

export { default as AuthController } from './auth.controller';
export { default as AuthService } from './auth.service';
