import {
  useEffect,
  useState
} from "react";

import type {
  Party,
  PartyCharacter,
  PartyItem,
  StatName,
  Weapon
} from "../types";

interface Props {
  onCreate: (
    party: Party
  ) => void;

  onClose: () => void;
}

type CreateMode =
  | "manual"
  | "random";

const STAT_NAMES: {
  key: StatName;
  label: string;
}[] = [
  {
    key: "str",
    label: "STR"
  },
  {
    key: "dex",
    label: "DEX"
  },
  {
    key: "con",
    label: "CON"
  },
  {
    key: "int",
    label: "INT"
  },
  {
    key: "wiz",
    label: "WIZ"
  },
  {
    key: "cha",
    label: "CHA"
  }
];

function calculateModifier(
  value: number
) {
  return Math.floor(
    (value - 10) / 2
  );
}

function createStats(
  value = 10
) {
  return {
    str: value,
    strMod: calculateModifier(value),

    dex: value,
    dexMod: calculateModifier(value),

    con: value,
    conMod: calculateModifier(value),

    int: value,
    intMod: calculateModifier(value),

    wiz: value,
    wizMod: calculateModifier(value),

    cha: value,
    chaMod: calculateModifier(value)
  };
}

function createWeapon(): Weapon {
  return {
    name: "Espada",
    dice: 6,
    multiplier: 1,
    stat: "str",
    extra: null
  };
}

function createItem(): PartyItem {
  return {
    id:
      Date.now() +
      Math.random(),

    name: "Novo Item",

    quantity: 1,

    description: ""
  };
}

function createCharacter(
  index: number
): PartyCharacter {
  return {
    id:
      Date.now() +
      Math.random(),

    name:
      `Personagem ${index + 1}`,

    hp: 10,

    currentHp: 10,

    ac: 10,

    mov: 0,

    level: 1,

    stats:
      createStats(),

    weapons: [],

    inventory: [],

    statuses: []
  };
}

const RANDOM_NAMES = [
  "Aldric",
  "Aria",
  "Borin",
  "Caelan",
  "Dorian",
  "Elara",
  "Gareth",
  "Lyra",
  "Mira",
  "Ragnar",
  "Rowan",
  "Sylas",
  "Thalia",
  "Valen",
  "Vera"
];

function randomName() {
  return (
    RANDOM_NAMES[
      Math.floor(
        Math.random() *
          RANDOM_NAMES.length
      )
    ]
  );
}

function randomCharacter(
  index: number
): PartyCharacter {

  const str =
    Math.floor(
      Math.random() * 9
    ) + 8;

  const dex =
    Math.floor(
      Math.random() * 9
    ) + 8;

  const con =
    Math.floor(
      Math.random() * 9
    ) + 8;

  const int =
    Math.floor(
      Math.random() * 9
    ) + 8;

  const wiz =
    Math.floor(
      Math.random() * 9
    ) + 8;

  const cha =
    Math.floor(
      Math.random() * 9
    ) + 8;

  const hp =
    Math.floor(
      Math.random() * 31
    ) + 20;

  const stats = {
    str,
    strMod:
      calculateModifier(str),

    dex,
    dexMod:
      calculateModifier(dex),

    con,
    conMod:
      calculateModifier(con),

    int,
    intMod:
      calculateModifier(int),

    wiz,
    wizMod:
      calculateModifier(wiz),

    cha,
    chaMod:
      calculateModifier(cha)
  };

  return {
    id:
      Date.now() +
      Math.random(),

    name:
      `${randomName()} ${
        index + 1
      }`,

    hp,

    currentHp: hp,

    ac:
      Math.floor(
        Math.random() * 6
      ) + 10,

    mov: 0,

    level: 1,

    stats,

    weapons: [
      createWeapon()
    ],

    inventory: [
      {
        id:
          Date.now() +
          Math.random(),

        name:
          "Poção de Cura",

        quantity: 1,

        description:
          "Recupera HP."
      }
    ],

    statuses: []
  };
}

export default function CreatePartyModal({
  onCreate,
  onClose
}: Props) {

  const [
    mode,
    setMode
  ] = useState<CreateMode>(
    "manual"
  );

  const [
    partyName,
    setPartyName
  ] = useState("Nova Party");

  const [
    amount,
    setAmount
  ] = useState(4);

  const [
    characters,
    setCharacters
  ] = useState<
    PartyCharacter[]
  >([]);

  useEffect(() => {

    setCharacters(
      Array.from(
        {
          length: amount
        },
        (_, index) =>
          mode === "random"
            ? randomCharacter(
                index
              )
            : createCharacter(
                index
              )
      )
    );

  }, [
    amount,
    mode
  ]);

  function updateCharacter(
    index: number,
    changes: Partial<PartyCharacter>
  ) {

    setCharacters(
      current =>
        current.map(
          (
            character,
            characterIndex
          ) => {

            if (
              characterIndex !==
              index
            ) {
              return character;
            }

            return {
              ...character,
              ...changes
            };

          }
        )
    );
  }

  function updateStat(
    characterIndex: number,
    stat: StatName,
    value: number
  ) {

    setCharacters(
      current =>
        current.map(
          (
            character,
            index
          ) => {

            if (
              index !==
              characterIndex
            ) {
              return character;
            }

            return {
              ...character,

              stats: {
                ...character.stats,

                [stat]: value,

                [`${stat}Mod`]:
                  calculateModifier(
                    value
                  )
              }
            };

          }
        )
    );
  }

  function updateWeapon(
    characterIndex: number,
    weaponIndex: number,
    changes: Partial<Weapon>
  ) {

    setCharacters(
      current =>
        current.map(
          (
            character,
            index
          ) => {

            if (
              index !==
              characterIndex
            ) {
              return character;
            }

            const weapons =
              [
                ...character.weapons
              ];

            weapons[
              weaponIndex
            ] = {
              ...weapons[
                weaponIndex
              ],
              ...changes
            };

            return {
              ...character,
              weapons
            };
          }
        )
    );
  }

  function addWeapon(
    characterIndex: number
  ) {

    setCharacters(
      current =>
        current.map(
          (
            character,
            index
          ) =>
            index ===
            characterIndex
              ? {
                  ...character,

                  weapons: [
                    ...character.weapons,

                    createWeapon()
                  ]
                }
              : character
        )
    );
  }

  function removeWeapon(
    characterIndex: number,
    weaponIndex: number
  ) {

    setCharacters(
      current =>
        current.map(
          (
            character,
            index
          ) =>
            index ===
            characterIndex
              ? {
                  ...character,

                  weapons:
                    character.weapons.filter(
                      (
                        _,
                        currentIndex
                      ) =>
                        currentIndex !==
                        weaponIndex
                    )
                }
              : character
        )
    );
  }

  function updateInventoryItem(
    characterIndex: number,
    itemIndex: number,
    changes: Partial<PartyItem>
  ) {

    setCharacters(
      current =>
        current.map(
          (
            character,
            index
          ) => {

            if (
              index !==
              characterIndex
            ) {
              return character;
            }

            const inventory =
              [
                ...character.inventory
              ];

            inventory[
              itemIndex
            ] = {
              ...inventory[
                itemIndex
              ],
              ...changes
            };

            return {
              ...character,
              inventory
            };

          }
        )
    );
  }

  function addInventoryItem(
    characterIndex: number
  ) {

    setCharacters(
      current =>
        current.map(
          (
            character,
            index
          ) =>
            index ===
            characterIndex
              ? {
                  ...character,

                  inventory: [
                    ...character.inventory,

                    createItem()
                  ]
                }
              : character
        )
    );
  }

  function removeInventoryItem(
    characterIndex: number,
    itemIndex: number
  ) {

    setCharacters(
      current =>
        current.map(
          (
            character,
            index
          ) =>
            index ===
            characterIndex
              ? {
                  ...character,

                  inventory:
                    character.inventory.filter(
                      (
                        _,
                        currentIndex
                      ) =>
                        currentIndex !==
                        itemIndex
                    )
                }
              : character
        )
    );
  }

  function updateExtra(
    characterIndex: number,
    weaponIndex: number,
    changes: Partial<Weapon["extra"]>
  ) {

    setCharacters(
      current =>
        current.map(
          (
            character,
            index
          ) => {

            if (
              index !==
              characterIndex
            ) {
              return character;
            }

            const weapons =
              [
                ...character.weapons
              ];

            const weapon =
              weapons[
                weaponIndex
              ];

            if (
              !weapon.extra
            ) {
              return character;
            }

            weapons[
              weaponIndex
            ] = {
              ...weapon,

              extra: {
                ...weapon.extra,
                ...changes
              }
            };

            return {
              ...character,
              weapons
            };

          }
        )
    );
  }

  function toggleExtra(
    characterIndex: number,
    weaponIndex: number
  ) {

    setCharacters(
      current =>
        current.map(
          (
            character,
            index
          ) => {

            if (
              index !==
              characterIndex
            ) {
              return character;
            }

            const weapons =
              [
                ...character.weapons
              ];

            const weapon =
              weapons[
                weaponIndex
              ];

            weapons[
              weaponIndex
            ] = {
              ...weapon,

              extra:
                weapon.extra
                  ? null
                  : {
                      name:
                        "Dano Extra",

                      dice: 6,

                      multiplier: 1
                    }
            };

            return {
              ...character,
              weapons
            };

          }
        )
    );
  }

  function handleCreate() {

    const party: Party = {
      id:
        Date.now() +
        Math.random(),

      name:
        partyName.trim() ||
        "Nova Party",

      characters
    };

    onCreate(party);
  }

  return (
    <div
      className="party-create-overlay"
      onMouseDown={event => {

        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }

      }}
    >

      <div className="party-create-modal">

        <header className="party-create-header">

          <div>

            <h2>
              👥 Criar Party
            </h2>

            <span>
              Cria um grupo de personagens
            </span>

          </div>

          <button
            className="party-create-close"
            onClick={onClose}
          >
            ×
          </button>

        </header>

        <div className="party-create-body">

          {/* PARTY NAME */}

          <div className="party-form-field">

            <label>
              Nome da Party
            </label>

            <input
              value={partyName}
              onChange={event =>
                setPartyName(
                  event.target.value
                )
              }
            />

          </div>

          {/* MODE */}

          <div className="party-mode">

            <button
              type="button"
              className={
                mode === "manual"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setMode("manual")
              }
            >
              ✏️ Manual
            </button>

            <button
              type="button"
              className={
                mode === "random"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setMode("random")
              }
            >
              🎲 Aleatória
            </button>

          </div>

          {/* AMOUNT */}

          <div className="party-amount">

            <label>
              Número de personagens
            </label>

            <input
              type="number"
              min={1}
              max={12}
              value={amount}
              onChange={event =>
                setAmount(
                  Math.max(
                    1,
                    Math.min(
                      12,
                      Number(
                        event.target
                          .value
                      ) || 1
                    )
                  )
                )
              }
            />

          </div>

          {/* CHARACTERS */}

          <div className="party-editor-list">

            {characters.map(
              (
                character,
                index
              ) => (

                <section
                  className="party-editor-character"
                  key={
                    character.id
                  }
                >

                  <div className="party-editor-title">

                    <h3>
                      {character.name}
                    </h3>

                    <span>
                      Personagem{" "}
                      {index + 1}
                    </span>

                  </div>

                  {/* BASIC */}

                  <div className="party-basic-fields">

                    <div className="party-form-field party-field-wide">

                      <label>
                        Nome
                      </label>

                      <input
                        value={
                          character.name
                        }
                        onChange={
                          event =>
                            updateCharacter(
                              index,
                              {
                                name:
                                  event
                                    .target
                                    .value
                              }
                            )
                        }
                      />

                    </div>

                    <div className="party-form-field">

                      <label>
                        HP
                      </label>

                      <input
                        type="number"
                        min={0}
                        value={
                          character.hp
                        }
                        onChange={
                          event => {

                            const hp =
                              Math.max(
                                0,
                                Number(
                                  event
                                    .target
                                    .value
                                ) || 0
                              );

                            updateCharacter(
                              index,
                              {
                                hp,
                                currentHp:
                                  hp
                              }
                            );

                          }
                        }
                      />

                    </div>

                    <div className="party-form-field">

                      <label>
                        AC
                      </label>

                      <input
                        type="number"
                        min={0}
                        value={
                          character.ac
                        }
                        onChange={
                          event =>
                            updateCharacter(
                              index,
                              {
                                ac:
                                  Number(
                                    event
                                      .target
                                      .value
                                  ) || 0
                              }
                            )
                        }
                      />

                    </div>

                    <div className="party-form-field">

                      <label>
                        Nível
                      </label>

                      <input
                        type="number"
                        min={1}
                        value={
                          character.level
                        }
                        onChange={
                          event =>
                            updateCharacter(
                              index,
                              {
                                level:
                                  Math.max(
                                    1,
                                    Number(
                                      event
                                        .target
                                        .value
                                    ) || 1
                                  )
                              }
                            )
                        }
                      />

                    </div>

                  </div>

                  {/* STATS */}

                  <div className="party-editor-section">

                    <div className="party-editor-section-header">

                      <h4>
                        Atributos
                      </h4>

                    </div>

                    <div className="party-editor-stats">

                      {STAT_NAMES.map(
                        stat => (

                          <div
                            className="party-stat-field"
                            key={
                              stat.key
                            }
                          >

                            <label>
                              {
                                stat.label
                              }
                            </label>

                            <input
                              type="number"
                              value={
                                character
                                  .stats[
                                    stat.key
                                  ]
                              }
                              onChange={
                                event =>
                                  updateStat(
                                    index,
                                    stat.key,
                                    Number(
                                      event
                                        .target
                                        .value
                                    ) || 0
                                  )
                              }
                            />

                            <span>
                              Mod{" "}
                              {
                                character
                                  .stats[
                                    `${stat.key}Mod`
                                  ]
                              }
                            </span>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                  {/* WEAPONS */}

                  <div className="party-editor-section">

                    <div className="party-editor-section-header">

                      <h4>
                        ⚔️ Armas / Ataques
                      </h4>

                      <button
                        type="button"
                        className="party-small-button"
                        onClick={() =>
                          addWeapon(
                            index
                          )
                        }
                      >
                        + Ataque
                      </button>

                    </div>

                    <div className="party-editor-weapons">

                      {character.weapons.length ===
                      0 ? (

                        <div className="party-editor-empty">
                          Nenhum ataque.
                        </div>

                      ) : (

                        character.weapons.map(
                          (
                            weapon,
                            weaponIndex
                          ) => (

                            <div
                              className="party-editor-weapon"
                              key={
                                weaponIndex
                              }
                            >

                              <div className="party-weapon-row">

                                <div className="party-form-field party-weapon-name-field">

                                  <label>
                                    Ataque
                                  </label>

                                  <input
                                    value={
                                      weapon.name
                                    }
                                    onChange={
                                      event =>
                                        updateWeapon(
                                          index,
                                          weaponIndex,
                                          {
                                            name:
                                              event
                                                .target
                                                .value
                                          }
                                        )
                                    }
                                  />

                                </div>

                                <div className="party-form-field">

                                  <label>
                                    Dado
                                  </label>

                                  <input
                                    type="number"
                                    min={1}
                                    value={
                                      weapon.dice
                                    }
                                    onChange={
                                      event =>
                                        updateWeapon(
                                          index,
                                          weaponIndex,
                                          {
                                            dice:
                                              Number(
                                                event
                                                  .target
                                                  .value
                                              ) || 1
                                          }
                                        )
                                    }
                                  />

                                </div>

                                <div className="party-form-field">

                                  <label>
                                    x Dados
                                  </label>

                                  <input
                                    type="number"
                                    min={0}
                                    value={
                                      weapon.multiplier
                                    }
                                    onChange={
                                      event =>
                                        updateWeapon(
                                          index,
                                          weaponIndex,
                                          {
                                            multiplier:
                                              Math.max(
                                                0,
                                                Number(
                                                  event
                                                    .target
                                                    .value
                                                ) || 0
                                              )
                                          }
                                        )
                                    }
                                  />

                                </div>

                                <div className="party-form-field">

                                  <label>
                                    Atributo
                                  </label>

                                  <select
                                    value={
                                      weapon.stat
                                    }
                                    onChange={
                                      event =>
                                        updateWeapon(
                                          index,
                                          weaponIndex,
                                          {
                                            stat:
                                              event
                                                .target
                                                .value as StatName
                                          }
                                        )
                                    }
                                  >

                                    {STAT_NAMES.map(
                                      stat => (

                                        <option
                                          key={
                                            stat.key
                                          }
                                          value={
                                            stat.key
                                          }
                                        >
                                          {
                                            stat.label
                                          }
                                        </option>

                                      )
                                    )}

                                  </select>

                                </div>

                                <button
                                  type="button"
                                  className="party-remove-small"
                                  onClick={() =>
                                    removeWeapon(
                                      index,
                                      weaponIndex
                                    )
                                  }
                                >
                                  ×
                                </button>

                              </div>

                              <div className="party-weapon-extra-control">

                                <label className="party-checkbox">

                                  <input
                                    type="checkbox"
                                    checked={
                                      weapon.extra !==
                                      null
                                    }
                                    onChange={() =>
                                      toggleExtra(
                                        index,
                                        weaponIndex
                                      )
                                    }
                                  />

                                  <span>
                                    Dano extra
                                  </span>

                                </label>

                                {weapon.extra && (

                                  <div className="party-extra-fields">

                                    <input
                                      placeholder="Nome do dano"
                                      value={
                                        weapon
                                          .extra
                                          .name
                                      }
                                      onChange={
                                        event =>
                                          updateExtra(
                                            index,
                                            weaponIndex,
                                            {
                                              name:
                                                event
                                                  .target
                                                  .value
                                            }
                                          )
                                      }
                                    />

                                    <input
                                      type="number"
                                      min={1}
                                      value={
                                        weapon
                                          .extra
                                          .dice
                                      }
                                      onChange={
                                        event =>
                                          updateExtra(
                                            index,
                                            weaponIndex,
                                            {
                                              dice:
                                                Number(
                                                  event
                                                    .target
                                                    .value
                                                ) || 1
                                            }
                                          )
                                      }
                                    />

                                    <input
                                      type="number"
                                      min={0}
                                      value={
                                        weapon
                                          .extra
                                          .multiplier
                                      }
                                      onChange={
                                        event =>
                                          updateExtra(
                                            index,
                                            weaponIndex,
                                            {
                                              multiplier:
                                                Math.max(
                                                  0,
                                                  Number(
                                                    event
                                                      .target
                                                      .value
                                                  ) || 0
                                                )
                                            }
                                          )
                                      }
                                    />

                                  </div>

                                )}

                              </div>

                            </div>

                          )
                        )

                      )}

                    </div>

                  </div>

                  {/* INVENTORY */}

                  <div className="party-editor-section">

                    <div className="party-editor-section-header">

                      <h4>
                        🎒 Inventário
                      </h4>

                      <button
                        type="button"
                        className="party-small-button"
                        onClick={() =>
                          addInventoryItem(
                            index
                          )
                        }
                      >
                        + Item
                      </button>

                    </div>

                    <div className="party-editor-inventory">

                      {character.inventory.length ===
                      0 ? (

                        <div className="party-editor-empty">
                          Inventário vazio.
                        </div>

                      ) : (

                        character.inventory.map(
                          (
                            item,
                            itemIndex
                          ) => (

                            <div
                              className="party-editor-item"
                              key={
                                item.id
                              }
                            >

                              <input
                                placeholder="Nome"
                                value={
                                  item.name
                                }
                                onChange={
                                  event =>
                                    updateInventoryItem(
                                      index,
                                      itemIndex,
                                      {
                                        name:
                                          event
                                            .target
                                            .value
                                      }
                                    )
                                }
                              />

                              <input
                                className="party-item-quantity"
                                type="number"
                                min={0}
                                value={
                                  item.quantity
                                }
                                onChange={
                                  event =>
                                    updateInventoryItem(
                                      index,
                                      itemIndex,
                                      {
                                        quantity:
                                          Math.max(
                                            0,
                                            Number(
                                              event
                                                .target
                                                .value
                                            ) || 0
                                          )
                                      }
                                    )
                                }
                              />

                              <button
                                type="button"
                                className="party-remove-small"
                                onClick={() =>
                                  removeInventoryItem(
                                    index,
                                    itemIndex
                                  )
                                }
                              >
                                ×
                              </button>

                            </div>

                          )
                        )

                      )}

                    </div>

                  </div>

                </section>

              )
            )}

          </div>

        </div>

        <footer className="party-create-footer">

          <button
            type="button"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="party-create-submit"
            onClick={
              handleCreate
            }
          >
            👥 Criar Party
          </button>

        </footer>

      </div>

    </div>
  );
}
