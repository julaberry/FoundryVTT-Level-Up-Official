// eslint-disable-next-line import/no-unresolved
import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

import getCorrectedTypeValueFromKey from './getCorrectedTypeValueFromKey';
import getDeterministicBonus from '../../dice/getDeterministicBonus';
import castType from '../../utils/castType';

/**
 * Add system-specific logic to the base ActiveEffect Class
 */
export default class ActiveEffectA5e extends ActiveEffect {
  // -------------------------------------------------------
  //  Static Properties
  // -------------------------------------------------------
  static FALLBACK_ICON = 'icons/svg/aura.svg';

  static PHASES = ['applyAEs', 'afterDerived'];

  static ITEM_TYPES = ['passive', 'onUse', 'permanent'];

  // -------------------------------------------------------
  //  Getters
  // -------------------------------------------------------
  /**
   * Convenience access to the ActiveEffect's icon field
   * @returns {String}
   */
  get img() {
    return this.icon || ActiveEffectA5e.FALLBACK_ICON;
  }

  /**
   * @returns {Boolean}
   */
  get isSuppressed() {
    if (this.disabled || !(['Actor', 'ActorDelta', 'Token'].includes(this.parent.documentName))) return true;

    const { parentItem } = this;
    if (!parentItem || parentItem?.type !== 'object') return false;

    return !parentItem?.system?.equipped;
  }

  get parentItem() {
    if (!(this.parent instanceof Actor)) return null;

    const idRegex = /Item\.([a-zA-Z0-9]+)/;
    const itemId = this.origin?.match(idRegex)?.[1];

    if (!itemId) return null;
    return this.parent.items.get(itemId);
  }

  // -------------------------------------------------------
  //  Class Methods
  // -------------------------------------------------------
  /**
   * @inheritdoc
   */
  apply(actor, _change, phase = 'applyAEs') {
    if (this.isSuppressed) return null;
    const change = foundry.utils.deepClone(_change);

    // Resolve/Validate Data
    if (phase !== 'afterDerived') {
      const resValue = Roll.replaceFormulaData(
        change.value,
        actor.getRollData(),
        { missing: null }
      );
      if (resValue.includes('null')) return null;
    }

    // Determine types
    const current = getCorrectedTypeValueFromKey(actor, change.key) ?? null;
    const targetType = foundry.utils.getType(current);
    const delta = castType(
      this.#convertToDeterministicBonus(actor, change),
      targetType
    );

    const newValue = this.#getNewValue(current, change, delta);
    const changes = { [change.key]: newValue };

    // Apply all changes to the Actor data
    foundry.utils.mergeObject(actor, changes);
    return changes;
    // return super.apply(actor, change);
  }

  /**
   * Returns the new value that should be applied to the actor.
   * @param {*} current
   * @param {*} change
   */
  #getNewValue(current, change, delta) {
    const MODES = CONST.ACTIVE_EFFECT_MODES;
    const { mode } = change;

    if (mode === MODES.ADD) return this.#addOrSubtractValues(current, delta);

    if (mode === MODES.MULTIPLY) {
      if (!(typeof delta === 'number' && (typeof current === 'number' || current === undefined))) return current;
      return Math.trunc((current ?? 0) * delta);
    }

    if ([MODES.SUBTRACT, MODES.REMOVE].includes(mode)) {
      const addedChange = (typeof current === 'number' || current === undefined) && typeof delta === 'number'
        ? -1 * delta
        : delta;

      return this.#addOrSubtractValues(current, addedChange);
    }

    if (mode === MODES.DOWNGRADE) {
      if (!(typeof delta === 'number' && (typeof current === 'number' || current === undefined))) return current;
      return Math.min(current ?? 0, delta);
    }

    if (mode === MODES.UPGRADE) {
      if (!(typeof delta === 'number' && (typeof current === 'number' || current === undefined))) return current;
      return Math.max(current ?? 0, delta);
    }

    if (mode === MODES.OVERRIDE) {
      // TODO: Add support for objects
      return delta;
    }

    if (mode === MODES.CUSTOM) {
      return this.#applyCustom(change);
    }

    return current;
  }

  #addOrSubtractValues(current, delta, isSubtract = false) {
    const isNumericAddition = typeof delta === 'number'
      && (typeof current === 'number' || [undefined, null].includes(current));
    const isArrayAdd = Array.isArray(current) && delta instanceof Array;
    const isSetAdd = current instanceof Set && delta instanceof Set;

    if (isNumericAddition) {
      if (isSubtract) return (current ?? 0) - delta;
      return (current ?? 0) + delta;
    }

    if (isArrayAdd) {
      if (isSubtract) return current.filter((e) => e !== delta.includes(e));
      return [...current, ...delta];
    }

    if (isSetAdd) {
      if (isSubtract) return current.difference(delta);
      return current.union(delta);
    }

    if (!current.length) return delta;
    if (isSubtract) return `${current} - ${delta}`;
    return `${current} + ${delta}`;
  }

  #applyCustom(change) {
    if (!change.key.startsWith('flags.a5e.effects')) return null;

    let newKey = '';
    let delta = '';

    // TODO: Move to own utility function
    switch (change.key) {
      case 'flags.a5e.effects.damageResistances.all':
      case 'flags.a5e.effects.damageVulnerabilities.all':
      case 'flags.a5e.effects.damageImmunities.all':
        newKey = `system.traits.${change.key.split('.').at(-2)}`;
        delta = Object.keys(CONFIG.A5E.damageTypes);
        break;
      case 'flags.a5e.effects.conditionImmunities.all':
        newKey = `system.traits.${change.key.split('.').at(-2)}`;
        delta = Object.keys(CONFIG.A5E.conditions);
        break;
      default:
        break;
    }

    change.key = newKey;
    return delta;
  }

  /**
   *
   * @param {import("../actor").default| import("../item").default} document
   * @param {*} change
   * @param {*} delta
   */
  #convertToDeterministicBonus(document, change) {
    const isActor = document.documentName === 'Actor';
    const isItem = document.documentName === 'Item';

    try {
      if (isActor) {
        const targetField = game.a5e.activeEffects
          .EffectOptions.options[document.type].allOptionsObj[change.key];
        if (typeof targetField.sampleValue !== 'number') return change.value;

        return getDeterministicBonus(
          change.value ?? 0,
          document.getRollData()
        ) ?? change.value;
      }

      if (isItem && document.parent?.documentName === 'Actor') {
        return getDeterministicBonus(
          change.value ?? 0,
          document.parent?.getRollData()
        ) ?? change.value;
      }
    } catch (e) {
      // TODO: Handle invalid roll formula ui side to make sure it's always correct.
      // Invalid roll formula is handled in UI.
      return change.value;
    }

    return change.value;
  }

  _onUpdate(data, options, userId) {
    super._onUpdate(data, options, userId);
    if (!(this.parent?.parent instanceof Actor)) return;
    const actor = this.parent.parent;

    actor.effectPhases = null;
    actor.reset();

    // Update parent effect
    if (this.flags?.a5e?.transferType !== 'passive') return;
    const parentEffect = actor.effects.contents.find((e) => e.origin === this.origin);
    if (!parentEffect) return;
    parentEffect.update(data);
  }

  _onDelete(options, userId) {
    super._onDelete(options, userId);

    if (this.parent?.documentName !== 'Actor') return;
    this.parent.effectPhases = null;
    this.parent.reset();
  }

  async duplicateEffect() {
    const owningDocument = this.parent;
    const newEffect = foundry.utils.duplicate(this);
    newEffect.name = `${localize(newEffect.name)} (Copy)`;

    if (owningDocument) owningDocument.createEmbeddedDocuments('ActiveEffect', [newEffect]);
  }

  async toggleActiveState() {
    await this.update({ disabled: !this.disabled });
  }

  /**
  * Transfer the affect to another token.
  */
  transferEffect(token) {
    const data = [{
      name: this.name,
      origin: this.parent.uuid,
      changes: this.changes
    }];

    token.actor.createEmbeddedDocuments('ActiveEffect', data);
  }

  // -------------------------------------------------------
  //  Static Methods
  // -------------------------------------------------------
  /**
   *
   * @param {import("../actor").default| import("../item").default} actor
   * @param {Array<ActiveEffectA5e>} effects
   * @param {() => boolean} predicate
   */
  static applyEffects(actor, effects, currentPhase, nextPhase, predicate = () => true) {
    const actorOverrides = {};
    const tokenOverrides = {};

    // Get token data
    const linked = foundry.utils.getProperty(actor, 'prototypeToken.actorLink') ?? true;
    const token = linked ? actor.getActiveTokens()?.[0] : actor.token;

    // Extract and organize changes and apply a priority if it doesn't exist.
    // BasePriority is determined by CONST.ACTIVE_EFFECTS_MODE * 10
    const applyObjects = effects.flatMap((effect) => {
      if (effect.disabled || effect.isSuppressed) return [];

      // Add status effects to actor list
      effect.statuses.forEach((statusId) => actor.statuses.add(statusId));

      return effect.changes.filter(predicate).map((change) => {
        change.priority = change.priority ?? change.mode * 10;
        return { effect, change };
      });
    });

    if (currentPhase !== 'applyAEs') applyObjects.push(...actor.effectPhases[currentPhase]);
    applyObjects.sort((a, b) => (a.change.priority ?? 0) - (b.change.priority ?? 0));

    // Apply changes to calling document
    applyObjects.forEach((applyObject) => {
      if (!applyObject.change?.key) return;

      // Determine if effect is applied on the actor or the token document.
      let appliedChange;
      if (applyObject.change.key.startsWith('@token') && token) {
        appliedChange = applyObject.effect.apply(token, applyObject.change, currentPhase);

        Object.assign(tokenOverrides, appliedChange);
      } else {
        appliedChange = applyObject.effect.apply(actor, applyObject.change, currentPhase);

      // If appliedChange is null, retry in next phase
      if (appliedChange === null && !applyObject.effect.isSuppressed) {
        if (!nextPhase) {
          ui.notifications.error(localize('A5E.notifications.effects.invalidChange'));
          return;
        }

        let idx = actor.effectPhases[nextPhase]
          ?.findIndex((e) => e.effect._id === applyObject.effect._id
            && e.change.key === applyObject.change.key) ?? -1;
        if (idx === -1) actor.effectPhases[nextPhase].push(applyObject);

        if (currentPhase !== 'applyAEs') return;

        idx = actor.effectPhases[currentPhase]
          ?.findIndex((e) => e.effect._id === applyObject.effect._id
            && e.change.key === applyObject.change.key) ?? -1;
        if (idx !== -1) actor.effectPhases[currentPhase].splice(idx, 1);
      }

      // Assign change to overrides object
        Object.assign(actorOverrides, appliedChange);
      }
    });

    // Update document overrides
    actor.overrides = foundry.utils.expandObject({
      ...foundry.utils.flattenObject(actor.overrides),

    if (!token) return;
    token.overrides = foundry.utils.expandObject({
      ...foundry.utils.flattenObject(token.overrides ?? {}),
      ...tokenOverrides
    });
  }

  /**
   * Creates a new default active effect on an actor or an item
   * @param {import("../actor").default| import("../item").default} parentDocument
   * @returns
   */
  static createDefaultEffect(parentDocument) {
    const data = {
      name: localize('A5E.effects.new'),
      icon: this.FALLBACK_ICON,
      flags: { a5e: { sort: 0 } }
    };
    return super.create(data, { parent: parentDocument });
  }
}
