const enum ActionRoleEnum {
  /**
   * @SELFISH_PRIVATE_ACTION
   * Concerned exclusively with oneself ( designation, change password ...etc )
   *
   * Action from user to his profile @only
   * either @Admin or @Super_admin can't do this action to any account except his owner profile
   */
  SELFISH = 'SELFISH',

  /**
   *
   *
   *
   *
   *
   *
   *
   */

  /**
   * @_SUPER_OWNER_ACTION
   * Requier the @_OWNER_ACCESS with @Super_admin Role
   *  ## any @Action on any @client or @owner account
   *  ## @Without check the boolean roles in DB
   *
   */
  SUPER_OWNER = 'Super Admin Owner',

  /**
   *
   * @_ADMIN_OWNER_ACTION
   * Requier the admin permission
   *  ## any @Action on any @client account
   *  ## @With chekc the boolean roles in DB
   */

  ADMIN_OWNER = 'Admin Owner',

  /**
   *
   * @_BASIC_OWNER_ACTION
   * Basic action, all @owner_access have permission to do this action
   *
   */
  BASIC_OWNER = 'Basic Owner',

  /**
   *
   *
   *
   *
   *
   *
   *
   *
   *
   */

  /**
   * @_SUPER_CLIENT_ACTION
   * Requier @_CLIENT_ADMIN Role and the @_CLIENT_ACCESS with @_ALL_Booleans_Roles
   *  ## PS: the cleint can't change his boolean roles any way
   */
  SUPER_CLIENT = 'Super Admin Client',

  /**
   *
   * @_SUPER_CLIENT_ACTION
   * @_OR__
   * @_SUPER_OWNER_ACTION
   *
   */
  SUPER_CLIENT_OWNER = 'Super owner OR Super Admin Client',

  /**
   * @_CLIENTS_WITH_SAME_PARTNER
   * @_SUPER_ @_ADMIN_ @_BASIC_
   * ## clients thats have the same partner
   *
   */
  CLIENT_OR_BASIC_OWNER = 'Client or basic owner',

  /**
   * @_SELFISH
   * @_SUPER_ @_ADMIN_ @_BASIC_
   * ## clients thats have the same partner
   *
   */
  SELFISH_OR_BASIC_OWNER = 'SELFISH or basic owner',

  /**
   * @_SELFISH
   * @_SUPER_
   * ## clients thats have the same partner
   *
   */
  SELFISH_OR_SUPER_OWNER = 'SELFISH or Super owner',

  /**
   * @_CLIENTS_WITH_SAME_PARTNER
   * ## only clients thats have the same partner
   *
   */
  ONLY_CLIENT_HAVE_SAME_PARTNER = 'Client have same Partner',

  /**
   * @_FETCH_KEYS__ACTION
   * Requier the @_isKeysVisible
   */

  FETCH_KEYS = 'FETCH_KEYS',

  /**
   * @_EDIT_KEYS__ACTION
   * Requier the @_isKeysEditable
   */

  EDIT_KEYS = 'EDIT_KEYS',

  /**
   * @_FETCH_REQUESTS__ACTION
   * Requier the @_isRequestVisible
   */

  FETCH_REQUESTS = 'FETCH_REQUESTS',

  /**
   * @_FETCH_HISTORIC__ACTION
   * Requier the @_isHistoricVisible
   */

  FETCH_HISTORIC = 'FETCH_HISTORIC'
}

export default ActionRoleEnum;
