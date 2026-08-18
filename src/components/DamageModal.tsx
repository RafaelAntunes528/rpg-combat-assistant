import { useState } from "react";

import type { Creature } from "../types";
import type {
  AttackResult
} from "../types";

interface Props {
  creatures: Creature[];

  onApplyDamage: (
    creatureId: number,
    damage: number
  ) => void;

  attackResult:
      AttackResult | null;

  onClose: () => void;
}



export default function DamageModal({
  creatures,
  onApplyDamage,
  onClose
}: Props) {
  const aliveCreatures =
    creatures.filter(
      creature =>
        creature.currentHp > 0
    );

  const [
    selectedId,
    setSelectedId
  ] = useState<number>(
    aliveCreatures[0]?.id ?? 0
  );

  const [
    damage,
    setDamage
  ] = useState("");

  function submit() {
    const amount =
      Number(damage);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return;
    }

    onApplyDamage(
      selectedId,
      amount
    );

    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>
          ❤️ REGISTAR DANO
        </h2>

        <label>
          Criatura
        </label>

        <select
          value={selectedId}
          onChange={event =>
            setSelectedId(
              Number(
                event.target.value
              )
            )
          }
        >
          {aliveCreatures.map(
            creature => (
              <option
                key={creature.id}
                value={creature.id}
              >
                {creature.displayName}
              </option>
            )
          )}
        </select>

        <label>
          Dano recebido
        </label>

        <input
          type="number"
          min="0"
          step="1"
          value={damage}
          onChange={event =>
            setDamage(
              event.target.value
            )
          }
          autoFocus
          onKeyDown={event => {
            if (event.key === "Enter") {
              submit();
            }
          }}
        />

        <div className="modal-actions">

          <button onClick={onClose}>
            CANCELAR
          </button>

          <button
            className="danger"
            onClick={submit}
          >
            APLICAR
          </button>

        </div>

      </div>
    </div>
  );
}
