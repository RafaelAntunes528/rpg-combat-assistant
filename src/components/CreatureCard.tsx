import type { Creature } from "../types";

interface Props {
  creature: Creature;
  isCurrentTurn: boolean;

  onAction: () => void;
  onDamage: () => void;
  onRemove: () => void;
}

export default function CreatureCard({
  creature,
  isCurrentTurn,
  onAction,
  onDamage,
  onRemove
}: Props) {
  const hpPercentage =
    Math.max(
      0,
      creature.currentHp / creature.hp
    ) * 100;

  const dead =
    creature.currentHp <= 0;

  return (
    <div
      className={[
        "creature-card",
        isCurrentTurn
          ? "current-turn"
          : "",
        dead ? "dead" : ""
      ].join(" ")}
    >
      <div className="creature-header">

        <h2>
          {creature.displayName}
        </h2>

        {isCurrentTurn &&
          !dead && (
            <span className="turn-badge">
              TURNO
            </span>
          )}

      </div>

      <div className="hp-section">

        <div className="hp-text">
          ❤️ {creature.currentHp}
          {" / "}
          {creature.hp}
        </div>

        <div className="hp-bar">
          <div
            className="hp-fill"
            style={{
              width:
                `${hpPercentage}%`
            }}
          />
        </div>

      </div>

      <div className="basic-info">
        <span>
          🛡️ AC {creature.ac}
        </span>

        <span>
          🏃 MOV {creature.mov}
        </span>
      </div>

      <div className="stats">

        <span>
          STR {creature.stats.str}
          {" "}
          ({formatMod(
            creature.stats.strMod
          )})
        </span>

        <span>
          DEX {creature.stats.dex}
          {" "}
          ({formatMod(
            creature.stats.dexMod
          )})
        </span>

        <span>
          CON {creature.stats.con}
          {" "}
          ({formatMod(
            creature.stats.conMod
          )})
        </span>

        <span>
          INT {creature.stats.int}
          {" "}
          ({formatMod(
            creature.stats.intMod
          )})
        </span>

        <span>
          WIS {creature.stats.wiz}
          {" "}
          ({formatMod(
            creature.stats.wizMod
          )})
        </span>

        <span>
          CHA {creature.stats.cha}
          {" "}
          ({formatMod(
            creature.stats.chaMod
          )})
        </span>

      </div>

      <div className="weapons">

        <strong>
          ⚔️ Armas
        </strong>

        {creature.weapons.map(
          (weapon, index) => (

            <div
              className="weapon"
              key={index}
            >
              <span>
                {weapon.name}
              </span>

              <span>
                {weapon.multiplier}
                d
                {weapon.dice}
                {" + "}
                {weapon.stat.toUpperCase()}
              </span>
            </div>

          )
        )}

      </div>

      {dead ? (

        <div className="dead-area">

          <div className="dead-label">
            💀 DERROTADO
          </div>

          <button
            className="remove-button"
            onClick={onRemove}
          >
            🗑️ REMOVER
          </button>

        </div>

      ) : (

        <div className="actions">

          <button
            disabled={!isCurrentTurn}
            onClick={onAction}
          >
            🎲 AÇÃO
          </button>

          <button
            className="damage-button"
            onClick={onDamage}
          >
            ❤️ DANO
          </button>

          <button
            className="remove-button"
            onClick={onRemove}
          >
            🗑️
          </button>

        </div>

      )}

    </div>
  );
}

function formatMod(
  mod: number
): string {
  return mod >= 0
    ? `+${mod}`
    : `${mod}`;
}
