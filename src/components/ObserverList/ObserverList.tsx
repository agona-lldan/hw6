import React, { useEffect, useRef, useState } from "react";
import styles from "./ObserverList.module.scss";
import { Loader2 } from "lucide-react";

export default function ObserverList({
  maxLength,
  renderLength,
  renderFunction,
}: {
  maxLength: number;
  renderLength: number;
  renderFunction: (index: number) => React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [indexes, setIndexes] = useState<number[]>(
    Array.from({ length: renderLength }, (_, i) => i),
  );
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIndexes(completeIndexes(indexes, maxLength, renderLength));
          }
        });
      },
      {
        threshold: 1,
      },
    );

    if (ref.current) {
      observer.current.observe(ref.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [indexes]);

  return (
    <>
      {indexes.map((el) => {
        return (
          <div key={el} className={styles.wrapper}>
            {renderFunction(el)}
          </div>
        );
      })}
      {indexes.length !== maxLength && (
        <div className={styles.wrapper} ref={ref}>
          <Loader2 size={16} className={styles.loader} />
        </div>
      )}
    </>
  );
}

function completeIndexes(
  indexes: number[],
  maxLength: number,
  renderLength: number,
): number[] {
  const last = indexes[indexes.length - 1];
  const copy = indexes.slice(0);
  for (let i = last + 1; i < last + renderLength + 1; i++) {
    if (i < maxLength) {
      copy.push(i);
    }
  }
  return copy;
}
