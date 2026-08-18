import type {
  Creature,
  CreatureTemplate
} from "../types";

interface Props {
  templates: CreatureTemplate[];
  creatures: Creature[];

  onAdd: (
    template: CreatureTemplate
  ) => void;

  onClose: () => void;
}

export default function AddCreatureModal({
  templates,
  creatures,
  onAdd,
  onClose
}: Props) {
  function addCreature(
    template: CreatureTemplate
  ) {
    onAdd(template);
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>➕ Adicionar Inimigo</h2>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <p className="modal-description">
          Escolhe o tipo de criatura que
          queres adicionar ao combate.
        </p>

        <div className="template-list">
          {templates.map(
            (template, index) => {

              const existing =
                creatures.filter(
                  creature =>
                    creature.name ===
                    template.name
                ).length;

              return (
                <button
                  className="template-option"
                  key={index}
                  onClick={() =>
                    addCreature(template)
                  }
                >
                  <div>
                    <strong>
                      {template.name}
                    </strong>

                    <span>
                      HP {template.hp}
                      {" • "}
                      AC {template.ac}
                      {" • "}
                      MOV {template.mov}
                    </span>
                  </div>

                  {existing > 0 && (
                    <small>
                      {existing} no combate
                    </small>
                  )}
                </button>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
