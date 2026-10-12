"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

const STORAGE_KEY = "cuenta-clara-counter";

export default function Home() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState("1");
  const [isReady, setIsReady] = useState(false);
  const stepValue = Math.min(100, Math.max(1, Number(step) || 1));

  function saveCounter(nextCount: number, nextStep: number) {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ count: nextCount, step: nextStep }),
      );
    } catch {
      // Keep the counter usable when browser storage is unavailable.
    }
  }

  useEffect(() => {
    try {
      const savedState = window.localStorage.getItem(STORAGE_KEY);

      if (savedState) {
        const parsedState: unknown = JSON.parse(savedState);

        if (typeof parsedState === "object" && parsedState !== null) {
          const savedCount = "count" in parsedState ? parsedState.count : null;
          const savedStep = "step" in parsedState ? parsedState.step : null;

          if (
            typeof savedCount === "number" &&
            Number.isSafeInteger(savedCount)
          ) {
            setCount(savedCount);
          }

          if (
            typeof savedStep === "number" &&
            Number.isSafeInteger(savedStep) &&
            savedStep >= 1 &&
            savedStep <= 100
          ) {
            setStep(String(savedStep));
          }
        }
      }
    } catch {
      // Keep the defaults when local storage is unavailable or invalid.
    } finally {
      setIsReady(true);
    }
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.workspace} aria-labelledby="page-title">
        <div className={styles.heading}>
          <h1 id="page-title">
            Contador<span>.</span>
          </h1>
        </div>

        <section className={styles.counter} aria-label="Control del contador">
          <div className={styles.counterTop}>
            <span className={styles.counterLabel}>TOTAL</span>
            <button
              className={styles.reset}
              type="button"
              onClick={() => {
                setCount(0);
                saveCounter(0, stepValue);
              }}
              disabled={!isReady || count === 0}
              aria-label="Reiniciar contador"
              title="Reiniciar contador"
            >
              <span aria-hidden="true">↺</span>
              <span>Reiniciar</span>
            </button>
          </div>

          <output
            className={styles.value}
            aria-live="polite"
            aria-atomic="true"
          >
            {isReady ? count : "…"}
          </output>

          <div className={styles.actions}>
            <button
              className={styles.decrement}
              type="button"
              onClick={() => {
                const nextCount = count - stepValue;
                setCount(nextCount);
                saveCounter(nextCount, stepValue);
              }}
              disabled={!isReady}
              aria-label={`Restar ${stepValue}`}
              title={`Restar ${stepValue}`}
            >
              <span aria-hidden="true">−</span>
            </button>
            <button
              className={styles.increment}
              type="button"
              onClick={() => {
                const nextCount = count + stepValue;
                setCount(nextCount);
                saveCounter(nextCount, stepValue);
              }}
              disabled={!isReady}
              aria-label={`Sumar ${stepValue}`}
              title={`Sumar ${stepValue}`}
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>

          <div className={styles.stepControl}>
            <label htmlFor="step">PASO</label>
            <input
              id="step"
              type="number"
              min="1"
              max="100"
              step="1"
              value={step}
              disabled={!isReady}
              onChange={(event) => {
                const nextStep = event.target.value;
                const nextStepValue = Number(nextStep);
                setStep(nextStep);

                if (
                  Number.isSafeInteger(nextStepValue) &&
                  nextStepValue >= 1 &&
                  nextStepValue <= 100
                ) {
                  saveCounter(count, nextStepValue);
                }
              }}
              onBlur={() => {
                setStep(String(stepValue));
                saveCounter(count, stepValue);
              }}
              aria-label="Cantidad por incremento"
            />
          </div>
        </section>
      </section>
    </main>
  );
}
