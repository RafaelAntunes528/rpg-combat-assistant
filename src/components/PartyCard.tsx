import type {
  Party,
  PartyCharacter,
  Weapon
} from "../types";

interface Props {
  party: Party;

  onOpenCharacter: (
    character: PartyCharacter
  ) => void;

  onDamage: (
    characterId: number,
    amount: number
  ) => void;

  onRemoveCharacter: (
    characterId: number
  ) => void;

  onRemoveParty: () => void;
}

function formatDamage(
  weapon: Weapon
) {

  if (
    weapon.multiplier <= 0
  ) {
    return "—";
  }

  return `${weapon.multiplier}d${weapon.dice}`;
}

function formatModifier(
  value: number
) {
  if (value >= 0) {
    return `+${value}`;
  }

  return `${value}`;
}

function WeaponCard({
  weapon
}: {
  weapon: Weapon;
}) {

  const statModifier =
    weapon.stat;

  return (
    <div className="party-card-weapon">

      <div className="party-card-weapon-main">

        <div>

          <strong>
            ⚔️ {weapon.name}
          </strong>

          <span>
            {statModifier.toUpperCase()} Mod
          </span>

        </div>

        <div className="party-card-damage">

          <strong>
            {formatDamage(
              weapon
            )}
          </strong>

          <span>
            + {statModifier}
          </span>

        </div>

      </div>

      {weapon.extra && (

        <div className="party-card-extra">

          <span>
            + {weapon.extra.name}
          </span>

          <strong>
            {weapon.extra.multiplier}d
            {weapon.extra.dice}
          </strong>

        </div>

      )}

    </div>
  );
}

function CharacterCard({
  character,
  onOpen,
  onDamage,
  onRemove
}: {
  character: PartyCharacter;

  onOpen: () => void;

  onDamage: (
    amount: number
  ) => void;

  onRemove: () => void;
}) {

  const hpPercent =
    character.hp > 0
      ? Math.max(
          0,
          Math.min(
            100,
            (
              character.currentHp /
              character.hp
            ) *
              100
          )
        )
      : 0;

  const totalItems =
    character.inventory.reduce(
      (
        total,
        item
      ) =>
        total +
        item.quantity,
      0
    );

  return (
    <article className="party-character-card">

      {/* HEADER */}

      <div className="party-character-header">

        <div>

          <h3>
            {character.name}
          </h3>

          <span>
            Nível{" "}
            {character.level}
          </span>

        </div>

        <button
          className="party-remove-button"
          onClick={
            onRemove
          }
        >
          ×
        </button>

      </div>

      {/* HP */}

      <div className="party-card-hp">

        <div className="party-card-hp-header">

          <span>
            ❤️ HP
          </span>

          <strong>
            {character.currentHp}
            {" / "}
            {character.hp}
          </strong>

        </div>

        <div className="party-card-hp-bar">

          <div
            className="party-card-hp-fill"
            style={{
              width:
                `${hpPercent}%`
            }}
          />

        </div>

      </div>

      {/* BASIC */}

      <div className="party-card-basic">

        <div>

          <span>
            AC
          </span>

          <strong>
            {character.ac}
          </strong>

        </div>

        <div>

          <span>
            Nível
          </span>

          <strong>
            {character.level}
          </strong>

        </div>

        <div>

          <span>
            Itens
          </span>

          <strong>
            {totalItems}
          </strong>

        </div>

      </div>

      {/* STATS */}

      <div className="party-card-stats">

        {(
          [
            "str",
            "dex",
            "con",
            "int",
            "wiz",
            "cha"
          ] as const
        ).map(
          stat => (

            <div
              key={stat}
            >

              <span>
                {stat.toUpperCase()}
              </span>

              <strong>
                {
                  character
                    .stats[
                      stat
                    ]
                }
              </strong>

              <small>
                {
                  formatModifier(
                    character
                      .stats[
                        `${stat}Mod`
                      ]
                  )
                }
              </small>

            </div>

          )
        )}

      </div>

      {/* WEAPONS */}

      <div className="party-card-section">

        <div className="party-card-section-title">
          ⚔️ Armas / Ataques
        </div>

        {character.weapons.length ===
        0 ? (

          <div className="party-card-empty">
            Nenhum ataque.
          </div>

        ) : (

          character.weapons.map(
            (
              weapon,
              index
            ) => (

              <WeaponCard
                key={
                  `${weapon.name}-${index}`
                }
                weapon={
                  weapon
                }
              />

            )
          )

        )}

      </div>

      {/* INVENTORY */}

      <div className="party-card-inventory">

        🎒 Inventário

        <strong>
          {totalItems}
        </strong>

      </div>

      {/* ACTIONS */}

      <div className="party-card-actions">

        <button
          className="party-damage-button"
          onClick={() =>
            onDamage(1)
          }
        >
          −1 HP
        </button>

        <button
          onClick={() =>
            onDamage(-1)
          }
        >
          +1 HP
        </button>

        <button
          className="party-sheet-button"
          onClick={
            onOpen
          }
        >
          FICHA
        </button>

      </div>

    </article>
  );
}

export default function PartyCard({
  party,
  onOpenCharacter,
  onDamage,
  onRemoveCharacter,
  onRemoveParty
}: Props) {

  return (
    <section className="party-section">

      <header className="party-section-header">

        <div>

          <h2>
            👥 {party.name}
          </h2>

          <span>
            {party.characters.length}{" "}
            personagem
            {party.characters.length !==
            1
              ? "s"
              : ""}
          </span>

        </div>

        <button
          className="party-remove-party"
          onClick={
            onRemoveParty
          }
        >
          Remover Party
        </button>

      </header>

      <div className="party-characters">

        {party.characters.map(
          character => (

            <CharacterCard
              key={
                character.id
              }
              character={
                character
              }
              onOpen={() =>
                onOpenCharacter(
                  character
                )
              }
              onDamage={amount =>
                onDamage(
                  character.id,
                  amount
                )
              }
              onRemove={() =>
                onRemoveCharacter(
                  character.id
                )
              }
            />

          )
        )}

      </div>

    </section>
  );
}
