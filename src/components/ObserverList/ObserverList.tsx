import React, { useRef } from "react";
import styles from "./ObserverList.module.scss";

export default function ObserverList({
  items,
  height,
  gap,
}: {
  items: number[] | string[];
  height: number;
  gap: number;
}) {
  const refBottom = useRef<HTMLDivElement>(null);
  const refTop = useRef<HTMLDivElement>(null);
  const refWrapper = useRef<HTMLDivElement>(null);
  const [indexes, setIndexes] = React.useState<number[]>([]);

  React.useEffect(() => {
    const h = window.innerHeight;
    const count = Math.floor(h / (height - gap));
    setIndexes(Array.from({ length: count + 1 }).map((_, i) => i));
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const copy = indexes.slice(1);
            copy.push(indexes[indexes.length - 1] + 1);
            setIndexes(copy);
          }
        });
      },
      {
        threshold: 0,
      },
    );
    if (refBottom.current) {
      observer.observe(refBottom.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [indexes]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const copy = indexes.slice(0);
            copy.pop();
            copy.unshift(copy[0] - 1);
            setIndexes(copy);
            if (refWrapper.current) {
              refWrapper.current.scrollIntoView(true);
            }
          }
        });
      },
      {
        threshold: 1,
      },
    );
    if (refTop.current) {
      observer.observe(refTop.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [indexes]);
  return (
    <>
      {indexes[0] !== 0 && <div ref={refTop} className={styles.block} />}
      <div
        className={styles.wrapper}
        style={{
          gap,
        }}
        ref={refWrapper}
      >
        {indexes.map((el) => {
          return (
            <div
              key={el}
              style={{
                height,
              }}
              className={styles.item}
            >
              {items[el]}
            </div>
          );
        })}
      </div>
      {indexes[indexes.length - 1] !== items.length - 1 && (
        <div ref={refBottom} className={styles.block} />
      )}
    </>
  );
}
