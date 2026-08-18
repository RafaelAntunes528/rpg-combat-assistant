import { useState } from "react";
import type {
  CreatureTemplate,
  Weapon
} from "../types";

interface Props {
  onSave: (
    creature: CreatureTemplate
  ) => void;

  onClose: () => void;
}

const emptyWeapon: Weapon = {
  name: "",
  dice: 6,
  multiplier: 1,
  stat: "str",
  extra: null
};

export default function CreatureEditorModal({
  onSave,
  onClose
}: Props) {

  const [
    name,
    setName
  ] = useState("");

  const [
    hp,
    setHp
  ] = useState(20);

  const [
    ac,
    setAc
  ] = useState(12);

  const [
    mov,
    setMov
  ] = useState(6);

  const [
    stats,
    setStats
  ] = useState({
    str: 10,
    strMod: 0,

    dex: 10,
    dexMod: 0,

    con: 10,
    conMod: 0,

    int: 10,
    intMod: 0,

    wiz: 10,
    wizMod: 0,

    cha: 10,
    chaMod: 0
  });

  const [
    weapons,
    setWeapons
  ] = useState<Weapon[]>([
    {
      ...emptyWeapon
    }
  ]);

  function updateStat(
    key: keyof typeof stats,
    value: number
  ) {

    setStats(current => ({
      ...current,
      [key]: value
    }));
  }

  function updateWeapon(
    index: number,
    changes: Partial<Weapon>
  ) {

    setWeapons(current =>
      current.map(
        (weapon, weaponIndex) =>
          weaponIndex === index
            ? {
                ...weapon,
                ...changes
              }
            : weapon
      )
    );
  }

  function addWeapon() {

    setWeapons(current => [
      ...current,
      {
        ...emptyWeapon
      }
    ]);
  }

  function removeWeapon(
    index: number
  ) {

    setWeapons(current =>
      current.filter(
        (_, i) => i !== index
      )
    );
  }

  function save() {

    if (!name.trim()) {
      return;
    }

    const creature:
      CreatureTemplate = {

      name: name.trim(),

      hp,
      ac,
      mov,

      stats,

      weapons
    };

    onSave(creature);
    onClose();
  }

  return (
    <div className="modal-overlay">

      <div className="modal creature-editor">

        <div className="modal-header">

          <h2>
            🧬 Nova Criatura
          </h2>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        <div className="editor-scroll">

          <h3>
            Informação Básica
          </h3>

          <div className="form-grid">

            <label>
              Nome

              <input
                value={name}
                onChange={e =>
                  setName(e.target.value)
                }
                placeholder="Ex: Wendigo"
              />
            </label>

            <label>
              HP

              <input
                type="number"
                value={hp}
                onChange={e =>
                  setHp(
                    Number(e.target.value)
                  )
                }
              />
            </label>

            <label>
              AC

              <input
                type="number"
                value={ac}
                onChange={e =>
                  setAc(
                    Number(e.target.value)
                  )
                }
              />
            </label>

            <label>
              Movimento

              <input
                type="number"
                value={mov}
                onChange={e =>
                  setMov(
                    Number(e.target.value)
                  )
                }
              />
            </label>

          </div>

          <h3>
            Atributos
          </h3>

          <div className="stats-editor">

            {(
              [
                ["str", "STR"],
                ["dex", "DEX"],
                ["con", "CON"],
                ["int", "INT"],
                ["wiz", "WIS"],
                ["cha", "CHA"]
              ] as const
            ).map(
              ([key, label]) => (

                <div
                  className="stat-editor"
                  key={key}
                >

                  <strong>
                    {label}
                  </strong>

                  <label>
                    Valor

                    <input
                      type="number"
                      value={
                        stats[key]
                      }
                      onChange={e =>
                        updateStat(
                          key,
                          Number(
                            e.target.value
                          )
                        )
                      }
                    />
                  </label>

                  <label>
                    Mod

                    <input
                      type="number"
                      value={
                        stats[
                          `${key}Mod`
                        ]
                      }
                      onChange={e =>
                        updateStat(
                          `${key}Mod`,
                          Number(
                            e.target.value
                          )
                        )
                      }
                    />
                  </label>

                </div>

              )
            )}

          </div>

          <h3>
            Ataques
          </h3>

          <div className="weapon-editor">

            {weapons.map(
              (weapon, index) => (

                <div
                  className="weapon-editor-card"
                  key={index}
                >

                  <div className="weapon-editor-header">

                    <strong>
                      Ataque {index + 1}
                    </strong>

                    <button
                      className="remove-button"
                      onClick={() =>
                        removeWeapon(
                          index
                        )
                      }
                    >
                      🗑️
                    </button>

                  </div>

                  <label>
                    Nome

                    <input
                      value={
                        weapon.name
                      }
                      onChange={e =>
                        updateWeapon(
                          index,
                          {
                            name:
                              e.target.value
                          }
                        )
                      }
                      placeholder="Mordida"
                    />
                  </label>

                  <div className="form-grid">

                    <label>
                      Dado

                      <input
                        type="number"
                        min="1"
                        value={
                          weapon.dice
                        }
                        onChange={e =>
                          updateWeapon(
                            index,
                            {
                              dice:
                                Number(
                                  e.target.value
                                )
                            }
                          )
                        }
                      />
                    </label>

                    <label>
                      Multiplicador

                      <input
                        type="number"
                        min="0"
                        value={
                          weapon.multiplier
                        }
                        onChange={e =>
                          updateWeapon(
                            index,
                            {
                              multiplier:
                                Number(
                                  e.target.value
                                )
                            }
                          )
                        }
                      />
                    </label>

                    <label>
                      Atributo

                      <select
                        value={
                          weapon.stat
                        }
                        onChange={e =>
                          updateWeapon(
                            index,
                            {
                              stat:
                                e.target.value as Weapon["stat"]
                            }
                          )
                        }
                      >

                        <option value="str">
                          STR
                        </option>

                        <option value="dex">
                          DEX
                        </option>

                        <option value="con">
                          CON
                        </option>

                        <option value="int">
                          INT
                        </option>

                        <option value="wiz">
                          WIS
                        </option>

                        <option value="cha">
                          CHA
                        </option>

                      </select>

                    </label>

                  </div>

                </div>

              )
            )}

          </div>

          <button
            className="add-button"
            onClick={addWeapon}
          >
            ➕ ADICIONAR ATAQUE
          </button>

        </div>

        <div className="editor-footer">

          <button
            onClick={onClose}
          >
            CANCELAR
          </button>

          <button
            className="random-generate"
            onClick={save}
          >
            💾 GUARDAR CRIATURA
          </button>

        </div>

      </div>

    </div>
  );
}
