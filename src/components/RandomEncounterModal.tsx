import {
  useMemo,
  useState
} from "react";

import type {
  CreatureTemplate
} from "../types";

interface Props {
  templates: CreatureTemplate[];

  onGenerate: (
    amount: number,
    tags: string[]
  ) => void;

  onClose: () => void;
}

export default function RandomEncounterModal({
  templates,
  onGenerate,
  onClose
}: Props) {

  const [
    selectedTags,
    setSelectedTags
  ] = useState<string[]>([]);

  const [
    amount,
    setAmount
  ] = useState(3);

  const [
    showAllCreatures,
    setShowAllCreatures
  ] = useState(false);

  /*
   * ============================================================
   * AVAILABLE TAGS
   * ============================================================
   */

  const availableTags = useMemo(
    () =>
      Array.from(
        new Set(
          templates.flatMap(
            template =>
              template.tags ?? []
          )
        )
      ).sort(),
    [templates]
  );

  /*
   * ============================================================
   * FILTERED CREATURES
   * ============================================================
   *
   * Sem filtros:
   *   -> todas as criaturas
   *
   * Com filtros:
   *   -> criatura precisa de pelo menos
   *      uma das tags selecionadas.
   */

  const filteredTemplates =
    useMemo(
      () => {

        if (
          selectedTags.length === 0
        ) {
          return templates;
        }

        return templates.filter(
          template =>
            template.tags?.some(
              tag =>
                selectedTags.includes(tag)
            )
        );

      },
      [
        templates,
        selectedTags
      ]
    );

  /*
   * ============================================================
   * VISIBLE CREATURES
   * ============================================================
   *
   * Por defeito mostramos apenas algumas.
   * Isto evita aquele bloco gigante de criaturas.
   */

  const visibleTemplates =
    showAllCreatures
      ? filteredTemplates
      : filteredTemplates.slice(
          0,
          12
        );

  const hiddenCreatureCount =
    Math.max(
      0,
      filteredTemplates.length - 12
    );

  /*
   * ============================================================
   * TAG TOGGLE
   * ============================================================
   */

  function toggleTag(
    tag: string
  ) {

    setSelectedTags(
      current =>
        current.includes(tag)
          ? current.filter(
              existing =>
                existing !== tag
            )
          : [
              ...current,
              tag
            ]
    );

    /*
     * Sempre que mudamos o filtro,
     * voltamos a mostrar apenas
     * as primeiras criaturas.
     */

    setShowAllCreatures(false);
  }

  /*
   * ============================================================
   * GENERATE
   * ============================================================
   */

  function generate() {

    if (
      amount <= 0
    ) {
      return;
    }

    if (
      filteredTemplates.length === 0
    ) {
      return;
    }

    onGenerate(
      amount,
      selectedTags
    );

    onClose();
  }

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="modal-overlay">

      <div className="modal random-modal">

        {/* ======================================================
            HEADER
            ====================================================== */}

        <div className="modal-header">

          <div>

            <h2>
              🎲 Random Encounter
            </h2>

            <p className="modal-description">
              Gera um encontro aleatório
              a partir da tua biblioteca.
            </p>

          </div>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        {/* ======================================================
            AMOUNT
            ====================================================== */}

        <label>
          Número de inimigos
        </label>

        <input
          type="number"
          min="1"
          max="50"
          value={amount}
          onChange={event =>
            setAmount(
              Math.max(
                1,
                Number(
                  event.target.value
                )
              )
            )
          }
        />


        {/* ======================================================
            FILTERS
            ====================================================== */}

        <div className="random-filter">

          <div className="random-filter-header">

            <div>

              <strong>
                Filtrar criaturas
              </strong>

              <span>
                {selectedTags.length === 0
                  ? "Todas as criaturas"
                  : `${selectedTags.length} tag${selectedTags.length > 1 ? "s" : ""} selecionada${selectedTags.length > 1 ? "s" : ""}`
                }
              </span>

            </div>


            {selectedTags.length > 0 && (

              <button
                type="button"
                className="random-filter-clear"
                onClick={() => {
                  setSelectedTags([]);
                  setShowAllCreatures(false);
                }}
              >
                Limpar
              </button>

            )}

          </div>


          <div className="random-filter-tags">

            {availableTags.map(
              tag => (

                <button
                  key={tag}
                  type="button"
                  className={
                    selectedTags.includes(tag)
                      ? "random-tag active"
                      : "random-tag"
                  }
                  onClick={() =>
                    toggleTag(tag)
                  }
                >
                  {tag}
                </button>

              )
            )}

          </div>

        </div>


        {/* ======================================================
            POSSIBLE CREATURES
            ====================================================== */}

        <div className="random-preview">

          <div className="random-preview-header">

            <div>

              <span>
                Possíveis criaturas
              </span>

              <strong>
                {filteredTemplates.length}
              </strong>

            </div>

            <small>
              {selectedTags.length === 0
                ? "Todas"
                : "Após filtro"
              }
            </small>

          </div>


          {filteredTemplates.length === 0 ? (

            <div className="random-preview-empty">

              Nenhuma criatura corresponde
              às Tags selecionadas.

            </div>

          ) : (

            <div className="random-preview-list">

              {visibleTemplates.map(
                template => (

                  <span
                    className="preview-creature"
                    key={template.name}
                  >
                    {template.name}
                  </span>

                )
              )}

            </div>

          )}


          {hiddenCreatureCount > 0 && (

            <button
              type="button"
              className="random-preview-toggle"
              onClick={() =>
                setShowAllCreatures(
                  current =>
                    !current
                )
              }
            >

              {showAllCreatures
                ? "Mostrar menos ▲"
                : `Ver mais ${hiddenCreatureCount} ▼`
              }

            </button>

          )}

        </div>


        {/* ======================================================
            GENERATE
            ====================================================== */}

        <button
          className="random-generate"
          onClick={generate}
          disabled={
            filteredTemplates.length === 0
          }
        >
          🎲 GERAR ENCONTRO
        </button>

      </div>

    </div>
  );
}
