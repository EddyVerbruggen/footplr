export type PlayerPosition =
    "GK" |
    "GSW" |
    "SW" |
    "CB" |
    "RCB" |
    "LCB" |
    "RB" |
    "RWB" |
    "LB" |
    "LWB" |
    "DM" |
    "RDM" |
    "LDM" |
    "CM" |
    "RCM" |
    "LCM" |
    "RM" |
    "LM" |
    "AM" |
    "IR" |
    "IL" |
    "RWM" |
    "LWM" |
    "SS" |
    "RSS" |
    "LSS" |
    "RW" |
    "LW" |
    "CF" |
    "RCF" |
    "LCF";

const PLAYER_POSITIONS = new Map<PlayerPosition, string>([
  ["GK", "Keeper"],
  ["GSW", "Meevoetballende keeper"],
  ["SW", "Laatste man"],
  ["CB", "Centrale verdediger"],
  ["RCB", "Rechter centrale verdediger"],
  ["LCB", "Linker centrale verdediger"],
  ["RB", "Rechtsback"],
  ["RWB", "Opkomende rechtsback"],
  ["LB", "Linksback"],
  ["LWB", "Opkomende linksback"],
  ["DM", "Verdedigende middenvelder"],
  ["RDM", "Rechter verdedigende middenvelder"],
  ["LDM", "Linker verdedigende middenvelder"],
  ["CM", "Centrale middenvelder"],
  ["RCM", "Rechter centrale middenvelder"],
  ["LCM", "Linker centrale middenvelder"],
  ["RM", "Rechtshalf"],
  ["LM", "Linkshalf"],
  ["AM", "Aanvallende middenvelder"],
  ["IR", "Rechtsbinnen"],
  ["IL", "Linksbinnen"],
  ["RWM", "Rechter aanvallende middenvelder"],
  ["LWM", "Linker aanvallende middenvelder"],
  ["SS", "Valse spits"],
  ["RSS", "Rechter valse spits"],
  ["LSS", "Linker valse spits"],
  ["RW", "Rechtsbuiten"],
  ["LW", "Linksbuiten"],
  ["CF", "Centrumspits"],
  ["RCF", "Rechter spits"],
  ["LCF", "Linker spits"],
]);

export function getAllPlayerPositionDescriptions(): Array<string> {
  const result: Array<string> = [];
  PLAYER_POSITIONS.forEach((value, key) => {
    result.push(value);
  });
  return result;
}

export function getPlayerPositionValueForKey(key: PlayerPosition): string {
  return PLAYER_POSITIONS.get(key);
}

export function getPlayerPositionKeyForValue(needle: string): PlayerPosition {
  let result = null;
  PLAYER_POSITIONS.forEach((value, key) => {
    if (value === needle) {
      result = key;
    }
  });
  return result;
}
