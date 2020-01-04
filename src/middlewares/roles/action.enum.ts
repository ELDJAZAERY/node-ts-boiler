const enum ActionRoleStratagies {
  /**
   * @_SUPER_ACTION
   * Requier the super admin permission
   *  ## @Action on any @client or @admin account
   *
   */
  SUPER = 'SUPER',

  /**
   *
   * @_ADMIN_ACTION
   * Requier the admin permission
   *  ## @Action on any @client account
   *
   */

  ADMIN = 'ADMIN',

  /**
   * @SELFISH_PRIVATE_ACTION
   * Concerned excessively or exclusively with oneself
   *
   * Action from user to his profile @only
   * either admin or super admin can't do this action to any account except his owner profile
   */
  SELFISH = 'SELFISH',

  /**
   *
   * @_BASIC_ACTION
   * Basic action, all user have permission to do this action
   *
   */
  BASIC = 'BASIC'
}

export default ActionRoleStratagies;
