import BaseGrant from './BaseGrant';

import NumericalGrantConfig from '../../../apps/components/grants/NumericalGrantConfig.svelte';

import { getDamageBonusContext } from '../../actor/Contexts';

export default class DamageGrant extends BaseGrant {
  #configComponent = NumericalGrantConfig;

  #type = 'damage';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'damage' }),
      bonus: new fields.StringField({ required: true, initial: '' }),
      damageType: new fields.StringField({ required: true, initial: '' }),
      context: new fields.SchemaField(getDamageBonusContext()),
      default: new fields.BooleanField({ required: true, initial: true }),
      label: new fields.StringField({ required: true, initial: 'New Damage Grant' })
    });
  }

  getApplyData(actor: any): any {
    if (!actor) return {};

    const bonusId = foundry.utils.randomID();
    const bonus = {
      context: this.context,
      formula: this.bonus,
      label: this.label || this.parent?.name || 'Damage Grant',
      default: this.default ?? true,
      img: this.img || this?.parent?.img
    };

    const grantData = {
      itemUuid: this.parent.uuid,
      grantId: this._id,
      bonusId,
      type: 'damage'
    };

    return {
      [`system.bonuses.damage.${bonusId}`]: bonus,
      'system.grants': {
        ...actor.system.grants,
        [this._id]: grantData
      }
    };
  }

  getSelectionComponent() { return null; }

  getSelectionComponentProps() { return null; }

  requiresConfig() { return false; }

  override async configureGrant() {
    const dialogData = {
      document: this.parent,
      grantId: this._id,
      grantType: this.#type
    };

    super.configureGrant(
      'Configure Damage Grant',
      dialogData,
      this.#configComponent,
      { width: 500 }
    );
  }
}