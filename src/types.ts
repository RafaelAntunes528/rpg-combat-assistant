export type StatName =
  | "str"
  | "dex"
  | "con"
  | "int"
  | "wiz"
  | "cha";

export interface Stats {
  str: number;
  strMod: number;

  dex: number;
  dexMod: number;

  con: number;
  conMod: number;

  int: number;
  intMod: number;

  wiz: number;
  wizMod: number;

  cha: number;
  chaMod: number;
}

export interface ExtraDamage {
  name: string;
  dice: number;
  multiplier: number;
}

export interface Weapon {
  name: string;
  dice: number;
  multiplier: number;
  stat: StatName;
  extra: ExtraDamage | null;
}

export interface CreatureTemplate {
  name: string;
  hp: number;
  ac: number;
  mov: number;
  stats: Stats;
  weapons: Weapon[];
}

export interface Creature extends CreatureTemplate {
  id: number;
  displayName: string;
  currentHp: number;
}

export interface AttackResult {
  attacker: Creature;

  weapon: Weapon;

  attackRoll: number;
  attackModifier: number;
  totalAttack: number;

  damageRolls: number[];
  baseDamage: number;

  statModifier: number;

  extraRolls: number[];
  extraDamage: number;

  totalDamage: number;
}

/* =========================================================
   PARTY
   ========================================================= */

export interface PartyItem {
  id: number;
  name: string;
  quantity: number;
  description: string;
}

export interface PartyStatus {
  id: number;
  name: string;
  description: string;
}

export interface PartyCharacter {
  id: number;

  name: string;

  hp: number;
  currentHp: number;

  ac: number;

  /*
   * A Party não participa no sistema
   * de turnos dos monstros.
   *
   * Mantemos mov apenas para a ficha.
   */
  mov: number;

  level: number;

  stats: Stats;

  /*
   * É exatamente o mesmo Weapon
   * utilizado pelas criaturas.
   */
  weapons: Weapon[];

  inventory: PartyItem[];

  statuses: PartyStatus[];
}

export interface Party {
  id: number;

  name: string;

  characters: PartyCharacter[];
}
