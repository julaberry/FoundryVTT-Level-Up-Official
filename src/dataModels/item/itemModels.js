import ArchetypeDataModel from './ArchetypeDataModel';
import BackgroundDataModel from './BackgroundDataModel';
import ClassDataModel from './ClassDataModel';
import CultureDataModel from './CultureDataModel';
import DestinyDataModel from './DestinyDataModel';
import HeritageDataModel from './HeritageDataModel';

import { A5EFeatureData } from './FeatureDataModel';
import ManeuverDataModel from './ManeuverDataModel';
import { A5EObjectData } from './ObjectDataModel';
import SpellDataModel from './SpellDataModel';

const itemDataModels = {
  archetype: ArchetypeDataModel,
  background: BackgroundDataModel,
  class: ClassDataModel,
  culture: CultureDataModel,
  destiny: DestinyDataModel,
  heritage: HeritageDataModel,

  feature: A5EFeatureData,
  maneuver: ManeuverDataModel,
  object: A5EObjectData,
  spell: SpellDataModel
};

export default itemDataModels;
