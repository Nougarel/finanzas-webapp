-- Sustituye Big Three/Five por nivel de literacia financiera autopercibido.
-- Las columnas big_three_* se conservan nullable (datos históricos legacy).
-- Ver ADR en vault: decisión de cambio de constructo (objetivo → percibido).

ALTER TABLE pretest_responses
  ADD COLUMN IF NOT EXISTS financial_literacy_level smallint
    CHECK (financial_literacy_level BETWEEN 1 AND 4);

ALTER TABLE pretest_responses
  ALTER COLUMN big_three_q1 DROP NOT NULL;

ALTER TABLE pretest_responses
  ALTER COLUMN big_three_q2 DROP NOT NULL;

ALTER TABLE pretest_responses
  ALTER COLUMN big_three_q3 DROP NOT NULL;

COMMENT ON COLUMN pretest_responses.financial_literacy_level IS
  'Nivel de literacia financiera AUTOPERCIBIDO (1-4). Reemplaza Big Three/Five (autoselección con anclas descriptivas). 1=sin formación, 2=básico, 3=sólido, 4=avanzado.';
