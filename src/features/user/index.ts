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

export { default as User } from './models/user.model';
export { default as Owner } from './models/owner.model';
export { default as Client } from './models/client.model';
export { default as IUser } from './interfaces/Iuser.interface';
export { default as OwnerController } from './owner.controller';
export { default as ClientController } from './client.controller';
export { default as AuthUser } from './interfaces/auth.user.interface';
export { default as UpdateUserDTO } from './dtos/update.user.dto';
export {
  CreateUserDTO,
  CreateOwnerDTO,
  CreateClientDTO
} from './dtos/create.user.dto';
