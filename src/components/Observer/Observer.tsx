import React, { useEffect, useRef, useState } from "react";
import styles from "./Observer.module.scss";
import { Loader2 } from "lucide-react";

export default function Observer({
  children,
  once,
  threshold,
}: {
  children: React.ReactNode;
  once?: boolean;
  threshold?: number | number[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<boolean>(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setView(true);
            if (once && observer.current) {
              observer.current.disconnect();
            }
          } else {
            setView(false);
          }
        });
      },
      {
        threshold: threshold || 0,
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
  }, [threshold, once]);

  return (
    <div className={styles.main} ref={ref}>
      {view ? (
        <>{children}</>
      ) : (
        <div className={styles.wrapper}>
          <Loader2 size={16} className={styles.loader} />
        </div>
      )}
    </div>
  );
}
