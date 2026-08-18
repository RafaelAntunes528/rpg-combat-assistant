import { useState } from "react";

import type {
  CreatureTemplate
} from "../types";

interface Props {
  templates: CreatureTemplate[];

  onAddToCombat: (
    template: CreatureTemplate
  ) => void;

  onCreate: (
    creature: CreatureTemplate
  ) => void;

  onExport: () => void;

  onClose: () => void;
}

export default function CreatureLibrary({
  templates,
  onAddToCombat,
  onCreate,
  onExport,
  onClose
}: Props) {

  const [
    search,
    setSearch
  ] = useState("");

  const filtered =
    templates.filter(
      creature =>
        creature.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <div className="library-overlay">

      <div className="library">

        <header className="library-header">

          <div>

            <h1>
              📖 Biblioteca
              de Criaturas
            </h1>

            <p>
              {templates.length}
              {" "}
              criaturas disponíveis
            </p>

          </div>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </header>

        <div className="library-actions">

          <button
            className="add-button"
            onClick={() => {

              const name =
                prompt(
                  "Nome da nova criatura:"
                );

              if (!name) {
                return;
              }

              /*
               * O editor completo será
               * aberto pelo App.
               */

              onCreate({
                name,

                hp: 20,

                ac: 12,

                mov: 6,

                stats: {
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
                },

                weapons: []
              });

            }}
          >
            ➕ CRIAR CRIATURA
          </button>

          <button
            onClick={onExport}
          >
            ↓ EXPORTAR JSON
          </button>

        </div>

        <input
          className="library-search"
          placeholder="🔎 Procurar criatura..."
          value={search}
          onChange={e =>
            setSearch(
              e.target.value
            )
          }
        />

        <div className="library-list">

          {filtered.map(
            (creature, index) => (

              <div
                className="library-creature"
                key={index}
              >

                <div>

                  <h3>
                    {creature.name}
                  </h3>

                  <span>
                    ❤️ {creature.hp}
                    {" • "}
                    🛡️ AC {creature.ac}
                    {" • "}
                    🏃 {creature.mov}
                  </span>

                  <small>
                    ⚔️{" "}
                    {creature.weapons.length}
                    {" "}
                    ataques
                  </small>

                </div>

                <button
                  className="add-button"
                  onClick={() =>
                    onAddToCombat(
                      creature
                    )
                  }
                >
                  ⚔️ ADICIONAR
                </button>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}
