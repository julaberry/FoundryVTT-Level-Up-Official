import SettingsShim from './settings/SettingsShim';

import { gameSettings } from './settings/SettingsStore';

export default function registerSystemSettings() {
  gameSettings.init();

  // Internal System Migration Version
  // game.settings.register('a5e', 'systemMigrationVersion', {
  //   name: 'System Migration Version',
  //   scope: 'world',
  //   config: false,
  //   type: String,
  //   default: ''
  // });

  // game.settings.register('a5e', 'worldSchemaVersion', {
  //   name: 'World Schema Version',
  //   scope: 'world',
  //   config: false,
  //   type: Number,
  //   default: MigrationRunner.LATEST_SCHEMA_VERSION
  // });

  // Critical Hit Damage Modes
  game.settings.register('a5e', 'critCalculationMode', {
    name: 'A5E.settings.critCalculationMode',
    hint: 'A5E.settings.hints.critCalculationMode',
    scope: 'world',
    config: true,
    default: 'doubleAllDamage',
    type: String,
    choices: {
      doubleAllDamage: 'A5E.settings.critDoubleAllDamage',
      doubleDiceDamage: 'A5E.settings.critDoubleDiceDamage',
      doubleDiceQuantity: 'A5E.settings.critDoubleDiceQuantity',
      doubleDiceQuantityAndMods: 'A5E.settings.critDoubleDiceQuantityAndMods',
      maxDamage: 'A5E.settings.critMaxDamage',
      maxDamagePlusRoll: 'A5E.settings.critMaxDamagePlusRoll'
    }
  });

  // game.settings.register('a5e', '5eStyleDeathSaves', {
  //   name: 'A5E.settings.5eStyleDeathSaves',
  //   hint: 'A5E.settings.hints.5eStyleDeathSaves',
  //   scope: 'world',
  //   config: true,
  //   type: Boolean,
  //   default: false
  // });

  // game.settings.register('a5e', 'itemRightClickConfigure', {
  //   name: 'A5E.settings.itemRightClickConfigure',
  //   hint: 'A5E.settings.itemRightClickConfigure',
  //   scope: 'client',
  //   config: true,
  //   type: Boolean,
  //   default: false
  // });

  // game.settings.register('a5e', 'hideDeleteConfirmation', {
  //   name: 'A5E.settings.hideDeletionConfirmationDialog',
  //   hint: 'A5E.settings.hints.hideDeletionConfirmationDialog',
  //   scope: 'client',
  //   config: true,
  //   type: Boolean,
  //   default: false
  // });

  // game.settings.register('a5e', 'collapseActionList', {
  //   name: 'A5E.settings.hideActionListInLockedMode',
  //   hint: 'A5E.settings.hints.hideActionListInLockedMode',
  //   scope: 'client',
  //   config: true,
  //   type: Boolean,
  //   default: false,
  //   onChange: reload
  // });

  // game.settings.register('a5e', 'reverseInitiativeAltBehavior', {
  //   name: 'A5E.settings.reverseInitiativeAltBehavior',
  //   hint: 'A5E.settings.hints.reverseInitiativeAltBehavior',
  //   scope: 'client',
  //   config: true,
  //   default: false,
  //   type: Boolean,
  //   onChange: reload
  // });

  // Currency Weight
  // game.settings.register('a5e', 'currencyWeight', {
  //   name: 'A5E.settings.trackCurrencyWeight',
  //   hint: 'A5E.settings.hints.trackCurrencyWeight',
  //   scope: 'world',
  //   config: true,
  //   default: true,
  //   type: Boolean
  // });

  // Diagonal Movement Rule
  // game.settings.register('a5e', 'diagonalRule', {
  //   name: 'A5E.settings.diagonalMovementMeasurement',
  //   hint: 'A5E.settings.hints.diagonalMovementMeasurement',
  //   scope: 'world',
  //   config: true,
  //   default: 'normal',
  //   type: String,
  //   choices: {
  //     normal: 'A5E.settings.diagonalMovementMeasurementNormal',
  //     euclidean: 'A5E.settings.diagonalMovementMeasurementEuclidean',
  //     5105: 'A5E.settings.diagonalMovementMeasurementAlternating'
  //   },
  //   onChange: (rule) => { canvas.grid.diagonalRule = rule; }
  // });

  // Default GM Setting for placing templates
  // game.settings.register('a5e', 'placeItemTemplateDefault', {
  //   name: 'A5E.settings.placeItemTemplateDefault',
  //   hint: 'A5E.settings.hints.placeItemTemplateDefault',
  //   scope: 'world',
  //   config: true,
  //   type: Boolean,
  //   default: false
  // });

  // Default GM Setting for NPC Health Randomization
  // game.settings.register('a5e', 'randomizeNPCHitPoints', {
  //   name: 'A5E.settings.randomizeNPCHitPoints',
  //   hint: 'A5E.settings.hints.randomizeNPCHitPoints',
  //   scope: 'world',
  //   config: true,
  //   type: Boolean,
  //   default: false
  // });

  game.settings.registerMenu('a5e', 'SystemSettings', {
    name: 'System Settings',
    label: 'Configure System Settings',
    icon: 'fas fa bars',
    type: SettingsShim,
    restricted: true
  });
}
