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
