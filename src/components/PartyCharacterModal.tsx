import {
  useState
} from "react";

import type {
  PartyCharacter,
  PartyItem,
  PartyStatus,
  StatName,
  Weapon
} from "../types";

interface Props {
  character: PartyCharacter;

  onUpdate: (
    character: PartyCharacter
  ) => void;

  onClose: () => void;
}

const stats: StatName[] = [
  "str",
  "dex",
  "con",
  "int",
  "wiz",
  "cha"
];

function modifier(
  value: number
) {
  return Math.floor(
    (value - 10) / 2
  );
}

export default function PartyCharacterModal({
  character,
  onUpdate,
  onClose
}: Props) {

  const [
    draft,
    setDraft
  ] = useState<
    PartyCharacter
  >({
    ...character,

    stats: {
      ...character.stats
    },

    weapons:
      character.weapons.map(
        weapon => ({
          ...weapon,

          extra:
            weapon.extra
              ? {
                  ...weapon.extra
                }
              : null
        })
      ),

    inventory:
      character.inventory.map(
        item => ({
          ...item
        })
      ),

    statuses:
      character.statuses.map(
        status => ({
          ...status
        })
      )
  });

  function update(
    changes: Partial<PartyCharacter>
  ) {

    setDraft(
      current => ({
        ...current,
        ...changes
      })
    );
  }

  function updateStat(
    stat: StatName,
    value: number
  ) {

    setDraft(
      current => ({
        ...current,

        stats: {
          ...current.stats,

          [stat]: value,

          [`${stat}Mod`]:
            modifier(value)
        }
      })
    );
  }

  function updateWeapon(
    index: number,
    changes: Partial<Weapon>
  ) {

    setDraft(
      current => {

        const weapons =
          [
            ...current.weapons
          ];

        weapons[index] = {
          ...weapons[index],
          ...changes
        };

        return {
          ...current,
          weapons
        };

      }
    );
  }

  function updateInventory(
    index: number,
    changes: Partial<PartyItem>
  ) {

    setDraft(
      current => {

        const inventory =
          [
            ...current.inventory
          ];

        inventory[index] = {
          ...inventory[index],
          ...changes
        };

        return {
          ...current,
          inventory
        };

      }
    );
  }

  function updateStatus(
    index: number,
    changes: Partial<PartyStatus>
  ) {

    setDraft(
      current => {

        const statuses =
          [
            ...current.statuses
          ];

        statuses[index] = {
          ...statuses[index],
          ...changes
        };

        return {
          ...current,
          statuses
        };

      }
    );
  }

  function addWeapon() {

    setDraft(
      current => ({
        ...current,

        weapons: [
          ...current.weapons,

          {
            name:
              "Novo Ataque",

            dice: 6,

            multiplier: 1,

            stat: "str",

            extra: null
          }
        ]
      })
    );
  }

  function removeWeapon(
    index: number
  ) {

    setDraft(
      current => ({
        ...current,

        weapons:
          current.weapons.filter(
            (
              _,
              weaponIndex
            ) =>
              weaponIndex !==
              index
          )
      })
    );
  }

  function addItem() {

    setDraft(
      current => ({
        ...current,

        inventory: [
          ...current.inventory,

          {
            id:
              Date.now() +
              Math.random(),

            name:
              "Novo Item",

            quantity: 1,

            description:
              ""
          }
        ]
      })
    );
  }

  function removeItem(
    index: number
  ) {

    setDraft(
      current => ({
        ...current,

        inventory:
          current.inventory.filter(
            (
              _,
              itemIndex
            ) =>
              itemIndex !==
              index
          )
      })
    );
  }

  function addStatus() {

    setDraft(
      current => ({
        ...current,

        statuses: [
          ...current.statuses,

          {
            id:
              Date.now() +
              Math.random(),

            name:
              "Novo Status",

            description:
              ""
          }
        ]
      })
    );
  }

  function removeStatus(
    index: number
  ) {

    setDraft(
      current => ({
        ...current,

        statuses:
          current.statuses.filter(
            (
              _,
              statusIndex
            ) =>
              statusIndex !==
              index
          )
      })
    );
  }

  function save() {

    onUpdate(
      draft
    );

    onClose();
  }

  return (
    <div
      className="party-character-overlay"
      onMouseDown={event => {

        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }

      }}
    >

      <div className="party-character-modal">

        <header className="party-character-modal-header">

          <div>

            <h2>
              {draft.name}
            </h2>

            <span>
              Ficha de personagem
            </span>

          </div>

          <button
            className="party-character-close"
            onClick={onClose}
          >
            ×
          </button>

        </header>

        <div className="party-character-modal-body">

          {/* BASIC */}

          <div className="party-modal-grid">

            <label>
              Nome

              <input
                value={
                  draft.name
                }
                onChange={event =>
                  update({
                    name:
                      event
                        .target
                        .value
                  })
                }
              />

            </label>

            <label>
              HP Máximo

              <input
                type="number"
                value={
                  draft.hp
                }
                onChange={event => {

                  const hp =
                    Number(
                      event
                        .target
                        .value
                    ) || 0;

                  update({
                    hp,
                    currentHp:
                      Math.min(
                        draft
                          .currentHp,
                        hp
                      )
                  });

                }}
              />

            </label>

            <label>
              HP Atual

              <input
                type="number"
                min={0}
                max={draft.hp}
                value={
                  draft.currentHp
                }
                onChange={event =>
                  update({
                    currentHp:
                      Math.max(
                        0,
                        Math.min(
                          draft.hp,
                          Number(
                            event
                              .target
                              .value
                          ) || 0
                        )
                      )
                  })
                }
              />

            </label>

            <label>
              AC

              <input
                type="number"
                value={
                  draft.ac
                }
                onChange={event =>
                  update({
                    ac:
                      Number(
                        event
                          .target
                          .value
                      ) || 0
                  })
                }
              />

            </label>

            <label>
              Nível

              <input
                type="number"
                min={1}
                value={
                  draft.level
                }
                onChange={event =>
                  update({
                    level:
                      Math.max(
                        1,
                        Number(
                          event
                            .target
                            .value
                        ) || 1
                      )
                  })
                }
              />

            </label>

          </div>

          {/* STATS */}

          <section className="party-modal-section">

            <h3>
              Atributos
            </h3>

            <div className="party-modal-stats">

              {stats.map(
                stat => (

                  <div
                    key={
                      stat
                    }
                    className="party-modal-stat"
                  >

                    <span>
                      {
                        stat.toUpperCase()
                      }
                    </span>

                    <input
                      type="number"
                      value={
                        draft
                          .stats[
                            stat
                          ]
                      }
                      onChange={event =>
                        updateStat(
                          stat,
                          Number(
                            event
                              .target
                              .value
                          ) || 0
                        )
                      }
                    />

                    <small>
                      Mod{" "}
                      {
                        modifier(
                          draft
                            .stats[
                              stat
                            ]
                        ) >= 0
                          ? "+"
                          : ""
                      }
                      {
                        modifier(
                          draft
                            .stats[
                              stat
                            ]
                        )
                      }
                    </small>

                  </div>

                )
              )}

            </div>

          </section>

          {/* WEAPONS */}

          <section className="party-modal-section">

            <div className="party-modal-section-header">

              <h3>
                ⚔️ Armas / Ataques
              </h3>

              <button
                onClick={
                  addWeapon
                }
              >
                + Ataque
              </button>

            </div>

            {draft.weapons.map(
              (
                weapon,
                index
              ) => (

                <div
                  className="party-modal-weapon"
                  key={
                    index
                  }
                >

                  <input
                    value={
                      weapon.name
                    }
                    onChange={event =>
                      updateWeapon(
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

                  <input
                    type="number"
                    min={1}
                    value={
                      weapon.dice
                    }
                    onChange={event =>
                      updateWeapon(
                        index,
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
                      weapon.multiplier
                    }
                    onChange={event =>
                      updateWeapon(
                        index,
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

                  <select
                    value={
                      weapon.stat
                    }
                    onChange={event =>
                      updateWeapon(
                        index,
                        {
                          stat:
                            event
                              .target
                              .value as StatName
                        }
                      )
                    }
                  >

                    {stats.map(
                      stat => (

                        <option
                          key={
                            stat
                          }
                          value={
                            stat
                          }
                        >
                          {
                            stat.toUpperCase()
                          }
                        </option>

                      )
                    )}

                  </select>

                  <button
                    className="party-danger-small"
                    onClick={() =>
                      removeWeapon(
                        index
                      )
                    }
                  >
                    ×
                  </button>

                  {weapon.extra && (

                    <div className="party-modal-extra">

                      <input
                        placeholder="Dano extra"
                        value={
                          weapon
                            .extra
                            .name
                        }
                        onChange={event =>
                          updateWeapon(
                            index,
                            {
                              extra: {
                                ...weapon.extra!,
                                name:
                                  event
                                    .target
                                    .value
                              }
                            }
                          )
                        }
                      />

                      <input
                        type="number"
                        value={
                          weapon
                            .extra
                            .dice
                        }
                        onChange={event =>
                          updateWeapon(
                            index,
                            {
                              extra: {
                                ...weapon.extra!,
                                dice:
                                  Number(
                                    event
                                      .target
                                      .value
                                  ) || 1
                              }
                            }
                          )
                        }
                      />

                      <input
                        type="number"
                        value={
                          weapon
                            .extra
                            .multiplier
                        }
                        onChange={event =>
                          updateWeapon(
                            index,
                            {
                              extra: {
                                ...weapon.extra!,
                                multiplier:
                                  Number(
                                    event
                                      .target
                                      .value
                                  ) || 0
                              }
                            }
                          )
                        }
                      />

                    </div>

                  )}

                </div>

              )
            )}

          </section>

          {/* INVENTORY */}

          <section className="party-modal-section">

            <div className="party-modal-section-header">

              <h3>
                🎒 Inventário
              </h3>

              <button
                onClick={
                  addItem
                }
              >
                + Item
              </button>

            </div>

            {draft.inventory.map(
              (
                item,
                index
              ) => (

                <div
                  className="party-modal-item"
                  key={
                    item.id
                  }
                >

                  <input
                    value={
                      item.name
                    }
                    onChange={event =>
                      updateInventory(
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

                  <input
                    type="number"
                    min={0}
                    value={
                      item.quantity
                    }
                    onChange={event =>
                      updateInventory(
                        index,
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
                    className="party-danger-small"
                    onClick={() =>
                      removeItem(
                        index
                      )
                    }
                  >
                    ×
                  </button>

                </div>

              )
            )}

          </section>

          {/* STATUS */}

          <section className="party-modal-section">

            <div className="party-modal-section-header">

              <h3>
                ✨ Status
              </h3>

              <button
                onClick={
                  addStatus
                }
              >
                + Status
              </button>

            </div>

            {draft.statuses.map(
              (
                status,
                index
              ) => (

                <div
                  className="party-modal-item"
                  key={
                    status.id
                  }
                >

                  <input
                    value={
                      status.name
                    }
                    onChange={event =>
                      updateStatus(
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

                  <input
                    value={
                      status.description
                    }
                    placeholder="Descrição"
                    onChange={event =>
                      updateStatus(
                        index,
                        {
                          description:
                            event
                              .target
                              .value
                        }
                      )
                    }
                  />

                  <button
                    className="party-danger-small"
                    onClick={() =>
                      removeStatus(
                        index
                      )
                    }
                  >
                    ×
                  </button>

                </div>

              )
            )}

          </section>

        </div>

        <footer className="party-character-modal-footer">

          <button
            onClick={
              onClose
            }
          >
            Cancelar
          </button>

          <button
            className="party-save-button"
            onClick={
              save
            }
          >
            Guardar alterações
          </button>

        </footer>

      </div>

    </div>
  );
}
