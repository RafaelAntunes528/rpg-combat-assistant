/*
 * ============================================================
 * RPG COMBAT MANAGER
 * ============================================================
 *
 * Ficheiro principal da aplicação.
 *
 * RESPONSABILIDADES:
 * - Gerir o estado do jogo e da Party
 * - Gerir criaturas e encontros
 * - Controlar turnos e ações de combate
 * - Gerir os modais da aplicação
 * - Guardar e recuperar o jogo através do LocalStorage
 *
 * NOTA:
 * Este ficheiro foi organizado e comentado sem alterar
 * intencionalmente a lógica existente da aplicação.
 *
 * Para desenvolvimento futuro:
 * - Componentes de UI devem ficar em ./components
 * - Tipos devem ficar em ./types
 * - Lógica reutilizável deve ser movida para ficheiros próprios
 * - Evitar colocar lógica complexa diretamente no JSX
 * ============================================================
 */

import {
  useEffect,
  useState
} from "react";

import CreatureCard from "./components/CreatureCard";
import AttackResult from "./components/AttackResult";
import DamageModal from "./components/DamageModal";
import MoveModal from "./components/MoveModal";
import AddCreatureModal from "./components/AddCreatureModal";
import RandomEncounterModal from "./components/RandomEncounterModal";

import PartyCard
  from "./components/PartyCard";

import CreatePartyModal
  from "./components/CreatePartyModal";

import PartyCharacterModal
  from "./components/PartyCharacterModal";

import type {
  Party,
  PartyCharacter
} from "./types";

import type {
  AttackResult as AttackResultType,
  Creature,
  CreatureTemplate,
  Weapon,
  Stats,
  ExtraDamage,
  StatName
} from "./types";

import {
  rollDie,
  rollDice,
  sumDice
} from "./dice";

import "./App.css";

import HelpModal from "./components/HelpModal";

type ActionMode =
  | "attack"
  | "move"
  | "random";

type ActionType =
  | "attack"
  | "move";

/*
 * ============================================================
 * LOCAL STORAGE — SAVE / LOAD DO JOGO
 * ============================================================
 * Guardamos um snapshot do jogo atual:
 * - Party
 * - Criaturas que estão atualmente no combate
 * - Turno atual
 * - Modo de ação selecionado
 *
 * A biblioteca de criaturas personalizadas continua separada
 * em "rpg-creature-library".
 */

const GAME_STORAGE_KEY = "rpg-combat-manager-game";
const GAME_STORAGE_VERSION = 1;

interface SavedGame {
  version: number;
  party: Party | null;
  creatures: Creature[];
  currentTurn: number;
  actionMode: ActionMode;
}

function loadSavedGame(): SavedGame | null {
  try {
    const saved = localStorage.getItem(GAME_STORAGE_KEY);

    if (!saved) {
      return null;
    }

    const parsed = JSON.parse(saved) as Partial<SavedGame>;

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return {
      version: GAME_STORAGE_VERSION,
      party: parsed.party ?? null,
      creatures: Array.isArray(parsed.creatures)
        ? parsed.creatures
        : [],
      currentTurn:
        typeof parsed.currentTurn === "number"
          ? parsed.currentTurn
          : 0,
      actionMode:
        parsed.actionMode === "attack" ||
        parsed.actionMode === "move" ||
        parsed.actionMode === "random"
          ? parsed.actionMode
          : "random"
    };
  } catch (error) {
    console.error("Erro ao carregar o jogo guardado:", error);
    return null;
  }
}

function saveGame(
  party: Party | null,
  creatures: Creature[],
  currentTurn: number,
  actionMode: ActionMode
) {
  try {
    const game: SavedGame = {
      version: GAME_STORAGE_VERSION,
      party,
      creatures,
      currentTurn,
      actionMode
    };

    localStorage.setItem(
      GAME_STORAGE_KEY,
      JSON.stringify(game)
    );
  } catch (error) {
    console.error("Erro ao guardar o jogo:", error);
  }
}

function clearSavedGame() {
  localStorage.removeItem(GAME_STORAGE_KEY);
}

/*
 * ============================================================
 * APP COMPONENT
 * ============================================================
 *
 * Componente principal da aplicação.
 *
 * Mantém o estado global do combate e coordena os componentes
 * filhos através de props e callbacks.
 * ============================================================
 */
function App() {

  /*
   * ============================================================
   * STATE — ESTADO DA APLICAÇÃO
   * ============================================================
   */

   // Lemos o save apenas uma vez quando a App é criada.
   const [savedGame] = useState<
     SavedGame | null
   >(() => loadSavedGame());

   const [
     party,
     setParty
   ] = useState<Party | null>(
     () => savedGame?.party ?? null
   );

   const [
     partyCreateOpen,
     setPartyCreateOpen
   ] = useState(false);

   const [
     selectedPartyCharacter,
     setSelectedPartyCharacter
   ] =
     useState<PartyCharacter | null>(
       null
     );

  const [
    creatures,
    setCreatures
  ] = useState<Creature[]>(
    () => savedGame?.creatures ?? []
  );

  const [
    templates,
    setTemplates
  ] = useState<CreatureTemplate[]>([]);

  const [
    currentTurn,
    setCurrentTurn
  ] = useState(
    () => savedGame?.currentTurn ?? 0
  );

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    attackResult,
    setAttackResult
  ] = useState<AttackResultType | null>(
    null
  );

  const [
    moveCreature,
    setMoveCreature
  ] = useState<Creature | null>(
    null
  );

  const [
    addModalOpen,
    setAddModalOpen
  ] = useState(false);

  const [
    randomModalOpen,
    setRandomModalOpen
  ] = useState(false);

  const [
    damageModalOpen,
    setDamageModalOpen
  ] = useState(false);

  const [
    helpOpen,
    setHelpOpen
  ] = useState(() => {
    return localStorage.getItem("rpg-guide-seen") !== "true";
  });

  /*
   * Novo:
   *
   * Modal para criar criaturas.
   */
  const [
    createCreatureOpen,
    setCreateCreatureOpen
  ] = useState(false);

  const [
    actionMode,
    setActionMode
  ] = useState<ActionMode>(
    () => savedGame?.actionMode ?? "random"
    );

  const [
    addMenuOpen,
    setAddMenuOpen
  ] = useState(false);

  /*
   * ============================================================
   * LIBRARY — CARREGAR CRIATURAS
   * ============================================================
   */

  useEffect(() => {
    loadCreatures();
  }, []);

  useEffect(() => {
    saveGame(
      party,
      creatures,
      currentTurn,
      actionMode
    );
  }, [
    party,
    creatures,
    currentTurn,
    actionMode
  ]);

  function createParty(
    newParty: Party
  ) {

    setParty(
      newParty
    );

    setPartyCreateOpen(
      false
    );
  }

  function removePartyCharacter(
    characterId: number
  ) {

    setParty(
      current => {

        if (!current) {
          return current;
        }

        return {
          ...current,

          characters:
            current.characters.filter(
              character =>
                character.id !==
                characterId
            )
        };

      }
    );

    setSelectedPartyCharacter(
      current =>
        current?.id ===
        characterId
          ? null
          : current
    );
  }

  function removeParty() {

    setParty(
      null
    );

    setSelectedPartyCharacter(
      null
    );
  }

  function updatePartyCharacter(
    updatedCharacter:
      PartyCharacter
  ) {

    setParty(
      current => {

        if (!current) {
          return current;
        }

        return {
          ...current,

          characters:
            current.characters.map(
              character =>
                character.id ===
                updatedCharacter.id
                  ? updatedCharacter
                  : character
            )
        };

      }
    );
  }

  function changePartyHp(
    characterId: number,
    amount: number
  ) {

    setParty(
      current => {

        if (!current) {
          return current;
        }

        return {
          ...current,

          characters:
            current.characters.map(
              character => {

                if (
                  character.id !==
                  characterId
                ) {
                  return character;
                }

                return {
                  ...character,

                  currentHp:
                    Math.max(
                      0,
                      Math.min(
                        character.hp,
                        character.currentHp +
                          amount
                      )
                    )
                };

              }
            )
        };

      }
    );
  }

  async function loadCreatures() {

    try {

      const response =
        await fetch(
          `${import.meta.env.BASE_URL}creatures.json`
        );


      if (!response.ok) {

        throw new Error(
          "Não foi possível carregar creatures.json"
        );

      }


      const jsonCreatures:
        CreatureTemplate[] =
        await response.json();


      /*
       * Criaturas personalizadas guardadas
       * anteriormente no browser.
       */

      const savedCreatures =
        localStorage.getItem(
          "rpg-creature-library"
        );


      const customCreatures:
        CreatureTemplate[] =
        savedCreatures
          ? JSON.parse(
              savedCreatures
            )
          : [];


      /*
       * JSON + criaturas personalizadas.
       */

      const library = [
        ...jsonCreatures,
        ...customCreatures
      ];


      setTemplates(
        library
      );


      /*
       * Não limpamos as criaturas aqui.
       * Se existir um save, elas já foram restauradas
       * no estado inicial.
       */


    } catch (error) {

      console.error(
        error
      );

      alert(
        "Erro ao carregar a biblioteca de criaturas."
      );


    } finally {

      setLoading(false);

    }

  }


  /*
   * ============================================================
   * TURN SYSTEM — CRIATURA ATUAL
   * ============================================================
   */

  function getCurrentCreature():
    Creature | undefined {

    return creatures[
      currentTurn
    ];

  }


  /*
   * ============================================================
   * TURN SYSTEM — GESTÃO DE TURNOS
   * ============================================================
   */

  function nextTurn(
    creaturesOverride?: Creature[]
  ) {

    const list =
      creaturesOverride ??
      creatures;


    if (
      list.length === 0
    ) {

      return;

    }


    let next =
      (
        currentTurn + 1
      ) %
      list.length;


    let attempts = 0;


    /*
     * Não damos turnos
     * a criaturas mortas.
     */

    while (
      list[next].currentHp <= 0 &&
      attempts < list.length
    ) {

      next =
        (
          next + 1
        ) %
        list.length;


      attempts++;

    }


    if (
      attempts >=
      list.length
    ) {

      return;

    }


    setCurrentTurn(
      next
    );

  }


  /*
   * ============================================================
   * COMBAT — ESCOLHA DE AÇÃO / AI
   * ============================================================
   */

   function chooseAction(
     mode: ActionMode
   ): ActionType {

     if (mode === "attack") {
       return "attack";
     }

     if (mode === "move") {
       return "move";
     }

     return Math.random() < 0.5
       ? "attack"
       : "move";
   }


  function performAction() {

    const creature =
      getCurrentCreature();


    if (!creature) {

      return;

    }


    if (
      creature.currentHp <= 0
    ) {

      nextTurn();

      return;

    }


    const action =
      chooseAction(actionMode);


    if (
      action === "attack"
    ) {

      attack(
        creature
      );

    } else {

      move(
        creature
      );

    }

  }


  /*
   * ============================================================
   * COMBAT — ATAQUE
   * ============================================================
   */

  function chooseWeapon(
    creature: Creature
  ): Weapon | null {

    if (
      creature.weapons.length === 0
    ) {

      return null;

    }


    const index =
      Math.floor(
        Math.random() *
        creature.weapons.length
      );


    return creature.weapons[
      index
    ];

  }


  function attack(
    attacker: Creature
  ) {

    const weapon =
      chooseWeapon(
        attacker
      );


    if (!weapon) {

      alert(
        `${attacker.displayName} não possui armas.`
      );


      nextTurn();

      return;

    }


    /*
     * ROLAMENTO DE ATAQUE
     */

    const attackRoll =
      rollDie(20);


    const attackModifier =
      attacker.stats[
        `${weapon.stat}Mod`
      ];


    const totalAttack =
      attackRoll +
      attackModifier;


    /*
     * DANO
     */

    const damageRolls =
      rollDice(
        weapon.dice,
        weapon.multiplier
      );


    const baseDamage =
      sumDice(
        damageRolls
      );


    const statModifier =
      attackModifier;


    let extraRolls:
      number[] = [];


    let extraDamage =
      0;


    if (
      weapon.extra
    ) {

      extraRolls =
        rollDice(
          weapon.extra.dice,
          weapon.extra.multiplier
        );


      extraDamage =
        sumDice(
          extraRolls
        );

    }


    const totalDamage =
      baseDamage +
      statModifier +
      extraDamage;


    const result:
      AttackResultType = {

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

    };


    setAttackResult(
      result
    );

  }


  /*
   * ============================================================
   * COMBAT — MOVIMENTO
   * ============================================================
   */

  function move(
    creature: Creature
  ) {

    setMoveCreature(
      creature
    );

  }


  /*
   * ============================================================
   * COMBAT — APLICAÇÃO DE DANO
   * ============================================================
   */

  function applyDamage(
    creatureId: number,
    damage: number
  ) {

    setCreatures(
      current =>
        current.map(
          creature => {

            if (
              creature.id !==
              creatureId
            ) {

              return creature;

            }


            return {

              ...creature,

              currentHp:
                Math.max(
                  0,
                  creature.currentHp -
                    damage
                )

            };

          }
        )
    );

  }


  /*
   * ============================================================
   * ENCOUNTER — ADICIONAR CRIATURA
   * ============================================================
   */

  function addCreature(
    template: CreatureTemplate
  ) {

    setCreatures(
      current => {

        const sameType =
          current.filter(
            creature =>
              creature.name ===
              template.name
          ).length;


        const newCreature:
          Creature = {

          ...template,

          id:
            Date.now() +
            Math.random(),

          displayName:
            `${template.name} ${
              sameType + 1
            }`,

          currentHp:
            template.hp

        };


        return [
          ...current,
          newCreature
        ];

      }
    );

  }


  /*
   * ============================================================
   * ENCOUNTER — ENCONTRO ALEATÓRIO
   * ============================================================
   */

  function generateRandomEncounter(
    amount: number
  ) {

    if (
      templates.length === 0
    ) {

      return;

    }


    const counters:
      Record<string, number> = {};


    const generated:
      Creature[] = [];


    for (
      let i = 0;
      i < amount;
      i++
    ) {

      const template =
        templates[
          Math.floor(
            Math.random() *
            templates.length
          )
        ];


      counters[
        template.name
      ] =
        (
          counters[
            template.name
          ] ?? 0
        ) + 1;


      generated.push({

        ...template,

        id:
          Date.now() +
          Math.random(),

        displayName:
          `${template.name} ${
            counters[
              template.name
            ]
          }`,

        currentHp:
          template.hp

      });

    }


    setCreatures(
      generated
    );


    setCurrentTurn(
      0
    );

  }


  /*
   * ============================================================
   * ENCOUNTER — REMOVER CRIATURA
   * ============================================================
   */

  function removeCreature(
    id: number
  ) {

    setCreatures(
      current => {

        const index =
          current.findIndex(
            creature =>
              creature.id === id
          );


        if (
          index === -1
        ) {

          return current;

        }


        const newList =
          current.filter(
            creature =>
              creature.id !== id
          );


        if (
          newList.length === 0
        ) {

          setCurrentTurn(
            0
          );

          return newList;

        }


        if (
          index <
          currentTurn
        ) {

          setCurrentTurn(
            currentTurn - 1
          );

        }

        else if (
          currentTurn >=
          newList.length
        ) {

          setCurrentTurn(
            0
          );

        }


        return newList;

      }
    );

  }


  /*
   * ============================================================
   * GAME — NOVO JOGO / RESET
   * ============================================================
   */

   function resetCombat() {

     const confirmed = window.confirm(
       "Começar um novo jogo?\n\nA Party e o combate atual serão apagados."
     );

     if (!confirmed) {
       return;
     }

     setParty(null);
     setCreatures([]);
     setCurrentTurn(0);

     setAttackResult(null);
     setMoveCreature(null);

     setAddModalOpen(false);
     setRandomModalOpen(false);
     setDamageModalOpen(false);
     setPartyCreateOpen(false);
     setCreateCreatureOpen(false);

     setSelectedPartyCharacter(null);

     clearSavedGame();
   }


  /*
   * ============================================================
   * LIBRARY — GUARDAR CRIATURA PERSONALIZADA
   * ============================================================
   */

  function saveCustomCreature(
    creature: CreatureTemplate
  ) {

    const saved =
      localStorage.getItem(
        "rpg-creature-library"
      );


    const current:
      CreatureTemplate[] =
      saved
        ? JSON.parse(
            saved
          )
        : [];


    /*
     * Não guardar duas criaturas
     * personalizadas com o mesmo nome.
     */

    const alreadyExists =
      current.some(
        existing =>
          existing.name.toLowerCase() ===
          creature.name.toLowerCase()
      );


    if (
      alreadyExists
    ) {

      alert(
        `Já existe uma criatura personalizada chamada "${creature.name}".`
      );

      return;

    }


    const updated = [
      ...current,
      creature
    ];


    localStorage.setItem(
      "rpg-creature-library",
      JSON.stringify(
        updated,
        null,
        2
      )
    );


    /*
     * Adicionar imediatamente à biblioteca
     * atualmente carregada.
     */

    setTemplates(
      currentTemplates => [

        ...currentTemplates,

        creature

      ]
    );


    /*
     * Fechar editor.
     */

    setCreateCreatureOpen(
      false
    );

  }


  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (
    loading
  ) {

    return (

      <div className="loading">

        A carregar combate...

      </div>

    );

  }


  const currentCreature =
    getCurrentCreature();


  /*
   * ============================================================
   * APP
   * ============================================================
   */

  return (

    <div className="app">


      <header>

        <div>

          <h1>
            ⚔️ RPG Combat Manager
          </h1>


          {currentCreature && (

            <p>

              Turno de{" "}

              <strong>
                {
                  currentCreature
                    .displayName
                }
              </strong>

            </p>

          )}


          {!currentCreature && (

            <p>
              Nenhum inimigo no combate
            </p>

          )}

        </div>


        <div className="header-actions">

          <button
            className="header-add-button"
            onClick={() => setAddMenuOpen(!addMenuOpen)}
          >
            ➕ ADICIONAR ▾
          </button>

          {addMenuOpen && (
            <div className="header-dropdown">

              <button
                onClick={() => {
                  setAddModalOpen(true);
                  setAddMenuOpen(false);
                }}
              >
                ⚔️ Adicionar inimigo
              </button>

              <button
                onClick={() => {
                  setPartyCreateOpen(true);
                  setAddMenuOpen(false);
                }}
              >
                👥 Criar / gerir Party
              </button>

            </div>
          )}

          <button
            className="random-button"
            onClick={() => setRandomModalOpen(true)}
          >
            🎲 ENCONTRO
          </button>

          <button
            className="library-button"
            onClick={() => setCreateCreatureOpen(true)}
          >
            🐉 BIBLIOTECA
          </button>

          <button
            className="help-button"
            onClick={() => setHelpOpen(true)}
          >
            ❔ GUIA
          </button>

          <button
            className="reset-button"
            onClick={resetCombat}
          >
            ↻ NOVO JOGO
          </button>
        </div>

      </header>


      <main>

        {party && (

          <PartyCard
            party={
              party
            }

            onOpenCharacter={
              character =>
                setSelectedPartyCharacter(
                  character
                )
            }

            onDamage={
              changePartyHp
            }

            onRemoveCharacter={
              removePartyCharacter
            }

            onRemoveParty={
              removeParty
            }
          />

        )}

        <section className="turn-controls">


          <div className="action-selector">

            <span className="action-selector-label">
              AÇÃO
            </span>

            <button
              className={
                actionMode === "attack"
                  ? "action-mode active"
                  : "action-mode"
              }
              disabled={!currentCreature}
              onClick={() =>
                setActionMode("attack")
              }
            >
              ⚔️ ATACAR
            </button>

            <button
              className={
                actionMode === "move"
                  ? "action-mode active"
                  : "action-mode"
              }
              disabled={!currentCreature}
              onClick={() =>
                setActionMode("move")
              }
            >
              🏃 MOVER
            </button>

            <button
              className={
                actionMode === "random"
                  ? "action-mode active"
                  : "action-mode"
              }
              disabled={!currentCreature}
              onClick={() =>
                setActionMode("random")
              }
            >
              🎲 ALEATÓRIO
            </button>

          </div>


          <button
            className="action-button"
            disabled={!currentCreature}
            onClick={performAction}
          >
            FAZER AÇÃO →
          </button>


          <button
            onClick={() =>
              setDamageModalOpen(
                true
              )
            }
          >
            ❤️ REGISTAR DANO
          </button>


          <button
            className="next-button"
            // @ts-expect-error onClick
            onClick={
              nextTurn
            }
            disabled={
              !currentCreature
            }
          >
            PRÓXIMO TURNO →
          </button>

        </section>


        {creatures.length === 0 ? (

          <div className="empty-state">

            <div>
              ⚔️
            </div>

            <h2>
              Nenhum inimigo
            </h2>

            <p>
              Adiciona inimigos ou
              gera um encontro aleatório.
            </p>

          </div>

        ) : (

          <section className="creatures">

            {creatures.map(
              (
                creature,
                index
              ) => (

                <CreatureCard

                  key={
                    creature.id
                  }

                  creature={
                    creature
                  }

                  isCurrentTurn={
                    index ===
                    currentTurn
                  }

                  onAction={
                    performAction
                  }

                  onDamage={() =>
                    setDamageModalOpen(
                      true
                    )
                  }

                  onRemove={() =>
                    removeCreature(
                      creature.id
                    )
                  }

                />

              )
            )}

          </section>

        )}

      </main>


      {/* ======================================================
          ATTACK RESULT
          ====================================================== */}

      {attackResult && (

        <>

          <div
            className="attack-weapon-indicator"
            style={{
              position: "fixed",
              top: "20px",
              left: "50%",
              transform:
                "translateX(-50%)",
              zIndex: 1001,
              padding:
                "10px 18px",
              borderRadius:
                "8px",
              background:
                "rgba(20, 20, 20, 0.95)",
              border:
                "1px solid rgba(255,255,255,0.15)",
              color:
                "white",
              fontWeight:
                600,
              pointerEvents:
                "none"
            }}
          >

            ⚔️{" "}

            {
              attackResult
                .attacker
                .displayName
            }

            {" usa "}

            <strong>
              {
                attackResult
                  .weapon
                  .name
              }
            </strong>

          </div>


          <AttackResult

            result={
              attackResult
            }

            onClose={() => {

              setAttackResult(
                null
              );

              nextTurn();

            }}

          />

        </>

      )}


      {/* ======================================================
          MOVE MODAL
          ====================================================== */}

      {moveCreature && (

        <MoveModal

          creature={
            moveCreature
          }

          onClose={() =>
            setMoveCreature(
              null
            )
          }

          onContinue={() => {

            setMoveCreature(
              null
            );

            nextTurn();

          }}

        />

      )}


      {/* ======================================================
          DAMAGE MODAL
          ====================================================== */}

      {damageModalOpen && (

        <DamageModal

          attackResult={
            attackResult
          }

          creatures={
            creatures
          }

          onApplyDamage={
            applyDamage
          }

          onClose={() =>
            setDamageModalOpen(
              false
            )
          }

        />

      )}


      {/* ======================================================
          ADD EXISTING CREATURE
          ====================================================== */}

      {addModalOpen && (

        <AddCreatureModal

          templates={
            templates
          }

          creatures={
            creatures
          }

          onAdd={
            addCreature
          }

          onClose={() =>
            setAddModalOpen(
              false
            )
          }

        />

      )}


      {/* ======================================================
          RANDOM ENCOUNTER
          ====================================================== */}

      {randomModalOpen && (

        <RandomEncounterModal

          templates={
            templates
          }

          onGenerate={
            generateRandomEncounter
          }

          onClose={() =>
            setRandomModalOpen(
              false
            )
          }

        />

      )}


      {/* ======================================================
          CREATE CREATURE MODAL
          ====================================================== */}

      {createCreatureOpen && (

        <CreateCreatureModal

          onSave={
            saveCustomCreature
          }

          onClose={() =>
            setCreateCreatureOpen(
              false
            )
          }

        />

      )}

      {partyCreateOpen && (

        <CreatePartyModal
          onCreate={
            createParty
          }

          onClose={() =>
            setPartyCreateOpen(
              false
            )
          }
        />

      )}

      {selectedPartyCharacter && (

        <PartyCharacterModal
          character={
            selectedPartyCharacter
          }

          onUpdate={
            updatePartyCharacter
          }

          onClose={() =>
            setSelectedPartyCharacter(
              null
            )
          }
        />

      )}

      {helpOpen && (
        <HelpModal
          onClose={() => {
            localStorage.setItem("rpg-guide-seen", "true")
            setHelpOpen(false)
          }}
        />
      )}

    </div>

  );

}


/*
 * ==============================================================
 * CREATE CREATURE MODAL
 * ==============================================================
 *
 * Fica neste ficheiro de propósito para não precisarmos de
 * alterar a estrutura existente dos teus componentes.
 */

/*
 * ============================================================
 * CREATE CREATURE MODAL
 * ============================================================
 *
 * Editor responsável por criar uma nova CreatureTemplate.
 *
 * Atualmente este componente encontra-se neste ficheiro.
 * Pode ser movido para:
 *
 *   ./components/CreateCreatureModal.tsx
 *
 * numa futura refatoração, sem alterar a lógica.
 * ============================================================
 */
interface CreateCreatureModalProps {

  onSave:
    (creature: CreatureTemplate) =>
      void;

  onClose:
    () => void;

}


function CreateCreatureModal({
  onSave,
  onClose
}: CreateCreatureModalProps) {

  /*
   * ------------------------------------------------------------
   * BASIC INFORMATION
   * ------------------------------------------------------------
   */

  const [
    name,
    setName
  ] = useState("");


  const [
    hp,
    setHp
  ] = useState("10");


  const [
    ac,
    setAc
  ] = useState("10");


  const [
    mov,
    setMov
  ] = useState("6");


  /*
   * ------------------------------------------------------------
   * STATS
   * ------------------------------------------------------------
   */

  const [
    stats,
    setStats
  ] = useState<Stats>({

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


  /*
   * ------------------------------------------------------------
   * WEAPONS
   * ------------------------------------------------------------
   */

  const [
    weapons,
    setWeapons
  ] = useState<Weapon[]>([]);


  /*
   * ------------------------------------------------------------
   * UPDATE STAT
   * ------------------------------------------------------------
   */

  function updateStat(
    stat: StatName,
    value: number
  ) {

    const modifier =
      Math.floor(
        (value - 10) / 2
      );


    setStats(
      current => ({

        ...current,

        [stat]:
          value,

        [`${stat}Mod`]:
          modifier

      })
    );

  }


  /*
   * ------------------------------------------------------------
   * ADD WEAPON
   * ------------------------------------------------------------
   */

  function addWeapon() {

    const weapon:
      Weapon = {

      name:
        "Ataque",

      dice:
        6,

      multiplier:
        1,

      stat:
        "str",

      extra:
        null

    };


    setWeapons(
      current => [
        ...current,
        weapon
      ]
    );

  }


  /*
   * ------------------------------------------------------------
   * UPDATE WEAPON
   * ------------------------------------------------------------
   */

  function updateWeapon(
    index: number,
    changes: Partial<Weapon>
  ) {

    setWeapons(
      current =>
        current.map(
          (
            weapon,
            weaponIndex
          ) =>
            weaponIndex === index
              ? {
                  ...weapon,
                  ...changes
                }
              : weapon
        )
    );

  }


  /*
   * ------------------------------------------------------------
   * REMOVE WEAPON
   * ------------------------------------------------------------
   */

  function removeWeapon(
    index: number
  ) {

    setWeapons(
      current =>
        current.filter(
          (
            _,
            weaponIndex
          ) =>
            weaponIndex !== index
        )
    );

  }


  /*
   * ------------------------------------------------------------
   * ADD EXTRA DAMAGE
   * ------------------------------------------------------------
   */

  function addExtra(
    index: number
  ) {

    const extra:
      ExtraDamage = {

      name:
        "Extra",

      dice:
        6,

      multiplier:
        1

    };


    updateWeapon(
      index,
      {
        extra
      }
    );

  }


  /*
   * ------------------------------------------------------------
   * REMOVE EXTRA DAMAGE
   * ------------------------------------------------------------
   */

  function removeExtra(
    index: number
  ) {

    updateWeapon(
      index,
      {
        extra:
          null
      }
    );

  }


  /*
   * ------------------------------------------------------------
   * SAVE
   * ------------------------------------------------------------
   */

  function handleSave() {

    const trimmedName =
      name.trim();


    if (
      trimmedName.length === 0
    ) {

      alert(
        "Indica o nome da criatura."
      );

      return;

    }


    if (
      weapons.length === 0
    ) {

      alert(
        "Adiciona pelo menos um ataque ou arma."
      );

      return;

    }


    const creature:
      CreatureTemplate = {

      name:
        trimmedName,

      hp:
        Math.max(
          1,
          Number(hp) || 1
        ),

      ac:
        Math.max(
          0,
          Number(ac) || 0
        ),

      mov:
        Math.max(
          0,
          Number(mov) || 0
        ),

      stats,

      weapons

    };


    onSave(
      creature
    );

  }


  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (

    <div
      className="modal-backdrop"
      style={{
        position:
          "fixed",
        inset:
          0,
        zIndex:
          2000,
        background:
          "rgba(0,0,0,0.65)",
        display:
          "flex",
        alignItems:
          "center",
        justifyContent:
          "center",
        padding:
          "20px"
      }}
    >

      <div
        className="modal"
        style={{
          width:
            "min(900px, 100%)",
          maxHeight:
            "90vh",
          overflowY:
            "auto"
        }}
      >

        <div className="modal-header">

          <div>

            <h2>
              🐉 Criar Criatura
            </h2>

            <p>
              Cria um novo inimigo para
              a tua biblioteca.
            </p>

          </div>


          <button
            onClick={
              onClose
            }
          >
            ×
          </button>

        </div>


        {/* ==================================================
            BASIC
            ================================================== */}

        <div className="create-creature-section">

          <h3>
            Informações
          </h3>


          <label>

            Nome

            <input
              value={
                name
              }
              onChange={
                event =>
                  setName(
                    event.target.value
                  )
              }
              placeholder="Ex: Lobisomem"
            />

          </label>


          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(3, 1fr)",
              gap:
                "12px"
            }}
          >

            <label>

              HP

              <input
                type="number"
                min="1"
                value={
                  hp
                }
                onChange={
                  event =>
                    setHp(
                      event.target.value
                    )
                }
              />

            </label>


            <label>

              AC

              <input
                type="number"
                min="0"
                value={
                  ac
                }
                onChange={
                  event =>
                    setAc(
                      event.target.value
                    )
                }
              />

            </label>


            <label>

              MOV

              <input
                type="number"
                min="0"
                value={
                  mov
                }
                onChange={
                  event =>
                    setMov(
                      event.target.value
                    )
                }
              />

            </label>

          </div>

        </div>


        {/* ==================================================
            STATS
            ================================================== */}

        <div className="create-creature-section">

          <h3>
            Stats
          </h3>


          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(3, 1fr)",
              gap:
                "12px"
            }}
          >

            {(
              [
                "str",
                "dex",
                "con",
                "int",
                "wiz",
                "cha"
              ] as StatName[]
            ).map(
              stat => (

                <label
                  key={
                    stat
                  }
                >

                  {
                    stat.toUpperCase()
                  }


                  <input
                    type="number"
                    value={
                      stats[
                        stat
                      ]
                    }
                    onChange={
                      event =>
                        updateStat(
                          stat,
                          Number(
                            event.target.value
                          )
                        )
                    }
                  />


                  <small>

                    Modificador:{" "}

                    {
                      stats[
                        `${stat}Mod`
                      ]
                    }

                  </small>

                </label>

              )
            )}

          </div>

        </div>


        {/* ==================================================
            WEAPONS
            ================================================== */}

        <div className="create-creature-section">

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center"
            }}
          >

            <h3>
              ⚔️ Ataques
            </h3>


            <button
              onClick={
                addWeapon
              }
            >
              ➕ Adicionar Ataque
            </button>

          </div>


          {weapons.length === 0 && (

            <p>

              Esta criatura ainda não
              possui ataques.

            </p>

          )}


          {weapons.map(
            (
              weapon,
              index
            ) => (

              <div
                key={
                  index
                }
                style={{
                  border:
                    "1px solid rgba(255,255,255,0.12)",
                  borderRadius:
                    "8px",
                  padding:
                    "15px",
                  marginTop:
                    "12px"
                }}
              >

                <div
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "2fr 1fr 1fr 1fr",
                    gap:
                      "10px"
                  }}
                >

                  <label>

                    Nome

                    <input
                      value={
                        weapon.name
                      }
                      onChange={
                        event =>
                          updateWeapon(
                            index,
                            {
                              name:
                                event.target.value
                            }
                          )
                      }
                      placeholder="Mordida"
                    />

                  </label>


                  <label>

                    Dado

                    <input
                      type="number"
                      min="0"
                      value={
                        weapon.dice
                      }
                      onChange={
                        event =>
                          updateWeapon(
                            index,
                            {
                              dice:
                                Math.max(
                                  0,
                                  Number(
                                    event.target.value
                                  )
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
                      onChange={
                        event =>
                          updateWeapon(
                            index,
                            {
                              multiplier:
                                Math.max(
                                  0,
                                  Number(
                                    event.target.value
                                  )
                                )
                            }
                          )
                      }
                    />

                  </label>


                  <label>

                    Stat

                    <select
                      value={
                        weapon.stat
                      }
                      onChange={
                        event =>
                          updateWeapon(
                            index,
                            {
                              stat:
                                event.target.value as StatName
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
                        WIZ
                      </option>

                      <option value="cha">
                        CHA
                      </option>

                    </select>

                  </label>

                </div>


                {/* ==========================================
                    EXTRA DAMAGE
                    ========================================== */}

                <div
                  style={{
                    marginTop:
                      "12px"
                  }}
                >

                  {weapon.extra ? (

                    <div>

                      <strong>
                        Extra:{" "}
                        {
                          weapon.extra
                            .name
                        }
                      </strong>


                      <div
                        style={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "2fr 1fr 1fr auto",
                          gap:
                            "10px",
                          marginTop:
                            "8px"
                        }}
                      >

                        <input
                          value={
                            weapon.extra
                              .name
                          }
                          onChange={
                            event =>
                              updateWeapon(
                                index,
                                {
                                  extra: {
                                    ...weapon.extra!,
                                    name:
                                      event.target.value
                                  }
                                }
                              )
                          }
                        />


                        <input
                          type="number"
                          min="0"
                          value={
                            weapon.extra
                              .dice
                          }
                          onChange={
                            event =>
                              updateWeapon(
                                index,
                                {
                                  extra: {
                                    ...weapon.extra!,
                                    dice:
                                      Math.max(
                                        0,
                                        Number(
                                          event.target.value
                                        )
                                      )
                                  }
                                }
                              )
                          }
                        />


                        <input
                          type="number"
                          min="0"
                          value={
                            weapon.extra
                              .multiplier
                          }
                          onChange={
                            event =>
                              updateWeapon(
                                index,
                                {
                                  extra: {
                                    ...weapon.extra!,
                                    multiplier:
                                      Math.max(
                                        0,
                                        Number(
                                          event.target.value
                                        )
                                      )
                                  }
                                }
                              )
                          }
                        />


                        <button
                          onClick={() =>
                            removeExtra(
                              index
                            )
                          }
                        >
                          Remover
                        </button>

                      </div>

                    </div>

                  ) : (

                    <button
                      onClick={() =>
                        addExtra(
                          index
                        )
                      }
                    >
                      ➕ Adicionar dano extra
                    </button>

                  )}

                </div>


                <button
                  onClick={() =>
                    removeWeapon(
                      index
                    )
                  }
                  style={{
                    marginTop:
                      "12px"
                  }}
                >
                  🗑️ Remover ataque
                </button>

              </div>

            )
          )}

        </div>


        {/* ==================================================
            FOOTER
            ================================================== */}

        <div
          className="modal-actions"
        >

          <button
            onClick={
              onClose
            }
          >
            CANCELAR
          </button>


          <button
            className="add-button"
            onClick={
              handleSave
            }
          >
            💾 GUARDAR CRIATURA
          </button>

        </div>

      </div>

    </div>

  );

}


export default App;
