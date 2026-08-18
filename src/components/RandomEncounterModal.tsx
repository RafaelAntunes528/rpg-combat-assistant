import { useState } from "react";

import type {
  CreatureTemplate
} from "../types";

interface Props {
  templates: CreatureTemplate[];

  onGenerate: (
    amount: number
  ) => void;

  onClose: () => void;
}

export default function RandomEncounterModal({
  templates,
  onGenerate,
  onClose
}: Props) {
  const [
    amount,
    setAmount
  ] = useState(3);

  function generate() {
    if (
      templates.length === 0 ||
      amount <= 0
    ) {
      return;
    }

    onGenerate(amount);
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal random-modal">

        <div className="modal-header">
          <h2>🎲 Random Encounter</h2>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <p className="modal-description">
          A app irá escolher criaturas
          aleatoriamente do teu JSON.
        </p>

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

        <div className="random-preview">
          <span>Possíveis criaturas</span>

          <div>
            {templates.map(
              (template, index) => (
                <span
                  className="preview-creature"
                  key={index}
                >
                  {template.name}
                </span>
              )
            )}
          </div>
        </div>

        <button
          className="random-generate"
          onClick={generate}
        >
          🎲 GERAR ENCONTRO
        </button>

      </div>
    </div>
  );
}
