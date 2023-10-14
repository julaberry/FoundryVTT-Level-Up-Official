export default function prepareHitDice(actor) {
  const actorType = actor.type;
  const hitDice = ['d6', 'd8', 'd10', 'd12'];

  if (actorType === 'npc') {
    hitDice.unshift('d4');
    hitDice.push('d20');
  }

  return hitDice.map((dieSize) => ({
    dieSize,
    icon: `fa-solid fa-dice-${dieSize}`,
    current: actor.system.attributes.hitDice[dieSize].current,
    total: actor.system.attributes.hitDice[dieSize].total
  }));
}
