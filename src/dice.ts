export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollDice(
  sides: number,
  multiplier: number
): number[] {
  const rolls: number[] = [];

  for (let i = 0; i < multiplier; i++) {
    rolls.push(rollDie(sides));
  }

  return rolls;
}

export function sumDice(rolls: number[]): number {
  return rolls.reduce(
    (total, roll) => total + roll,
    0
  );
}
