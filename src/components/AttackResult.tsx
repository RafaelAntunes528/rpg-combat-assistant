import type {
  AttackResult as AttackResultType
} from "../types";


interface AttackResultProps {

  result:
    AttackResultType;

  onClose:
    () => void;

}


function formatModifier(
  value: number
): string {

  return value >= 0
    ? `+${value}`
    : `${value}`;

}


function formatMath(
  value: number
): string {

  return value >= 0
    ? `+ ${value}`
    : `− ${Math.abs(value)}`;

}


function AttackResult({
  result,
  onClose
}: AttackResultProps) {

  const {
    attacker,
    weapon,

    attackRoll,
    attackModifier,
    totalAttack,

    damageRolls,
    baseDamage,

    statModifier,

    extraRolls,
    extraDamage,

    totalDamage
  } = result;


  const statName =
    weapon.stat.toUpperCase();


  const statValue =
    attacker.stats[
      weapon.stat
    ];


  return (

    <div
      className="attack-result-overlay"
    >

      <div
        className="attack-result-modal"
      >

        {/* ==================================================
            HEADER
            ================================================== */}

        <div
          className="attack-result-header"
        >

          <div>

            <div
              className="attack-result-eyebrow"
            >
              ⚔️ ATAQUE
            </div>


            <h2>
              {attacker.displayName}
            </h2>


            <div
              className="attack-result-weapon"
            >
              usa{" "}
              <strong>
                {weapon.name}
              </strong>
            </div>

          </div>


          <button
            className="attack-result-close"
            onClick={
              onClose
            }
          >
            ×
          </button>

        </div>


        {/* ==================================================
            ATTACK
            ================================================== */}

        <section
          className="attack-result-section"
        >

          <div
            className="attack-result-section-title"
          >
            🎲 TESTE DE ATAQUE
          </div>


          <div
            className="attack-roll-display"
          >

            <div
              className="roll-box"
            >

              <span>
                d20
              </span>

              <strong>
                {attackRoll}
              </strong>

            </div>


            <div
              className="operator"
            >
              {formatMath(
                attackModifier
              )}
            </div>


            <div
              className="roll-box modifier-box"
            >

              <span>
                {statName}
              </span>

              <strong>
                {formatModifier(
                  attackModifier
                )}
              </strong>

            </div>


            <div
              className="operator"
            >
              =
            </div>


            <div
              className="roll-box total-roll"
            >

              <span>
                TOTAL
              </span>

              <strong>
                {totalAttack}
              </strong>

            </div>

          </div>


          <div
            className="attack-result-meta"
          >

            <span>
              {statName}:{" "}
              <strong>
                {statValue}
              </strong>
            </span>

            <span>
              Modificador:{" "}
              <strong>
                {formatModifier(
                  attackModifier
                )}
              </strong>
            </span>

          </div>


          <div
            className="attack-result-note"
          >

            ⚠️ Compara o{" "}
            <strong>
              {totalAttack}
            </strong>
            {" "}
            com a AC do jogador.

          </div>

        </section>


        {/* ==================================================
            DAMAGE
            ================================================== */}

        <section
          className="attack-result-section"
        >

          <div
            className="attack-result-section-title"
          >
            💥 DANO
          </div>


          <div
            className="damage-line"
          >

            <span
              className="damage-label"
            >
              {weapon.multiplier}d{
                weapon.dice
              }
            </span>


            <span>
              →
            </span>


            <span
              className="dice-results"
            >
              [
              {
                damageRolls.join(
                  ", "
                )
              }
              ]
            </span>


            <span>
              =
            </span>


            <strong>
              {baseDamage}
            </strong>

          </div>


          <div
            className="damage-subline"
          >

            {baseDamage}

            {" "}

            <span>
              {formatMath(
                statModifier
              )}
            </span>

            {" "}

            <span>
              {statName}{" "}
              {formatModifier(
                statModifier
              )}
            </span>

            {" = "}

            <strong>
              {
                baseDamage +
                statModifier
              }
            </strong>

          </div>

        </section>


        {/* ==================================================
            EXTRA DAMAGE
            ================================================== */}

        {weapon.extra && (

          <section
            className="attack-result-section extra-damage-section"
          >

            <div
              className="attack-result-section-title"
            >
              ☠️{" "}
              {
                weapon.extra.name
              }
            </div>


            <div
              className="damage-line"
            >

              <span
                className="damage-label"
              >
                {
                  weapon.extra
                    .multiplier
                }d{
                  weapon.extra
                    .dice
                }
              </span>


              <span>
                →
              </span>


              <span
                className="dice-results"
              >
                [
                {
                  extraRolls.join(
                    ", "
                  )
                }
                ]
              </span>


              <span>
                =
              </span>


              <strong>
                {extraDamage}
              </strong>

            </div>

          </section>

        )}


        {/* ==================================================
            TOTAL
            ================================================== */}

        <div
          className="attack-result-total"
        >

          <span>
            DANO TOTAL
          </span>


          <strong>
            {totalDamage}
          </strong>

        </div>


        {/* ==================================================
            FOOTER
            ================================================== */}

        <button
          className="attack-result-continue"
          onClick={
            onClose
          }
        >
          CONTINUAR →
        </button>

      </div>

    </div>

  );

}


export default AttackResult;
