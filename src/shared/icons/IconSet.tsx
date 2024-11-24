import { useMemo } from "react";
import clsx from "clsx";
import { SetType } from "@/models/ExerciseSet";

const IconSet = ({ setType, setNumber, size }: { setType: SetType, setNumber?: number, size?: string }) => {
  let icon = null;

  const styles = useMemo(() => {
    return {
      commonTextStyles: clsx(
        "font-bold",
        size === "sm" ? "text-md" :
          size === "lg" ? "text-2xl" :
            "text-lg",
        "w-full"
      ),
      warmupTextStyles: "text-warmup",
      restPauseTextStyles: "text-rest-pause",
      dropSetTextStyles: "text-drop-set",
      failureSetTextStyles: "text-failure-set"
    };
  }, [size]);

  switch (setType) {
    case SetType.NormalSet:
      icon = <div><span className={clsx(styles.commonTextStyles)}>{setNumber ? setNumber : 1}</span></div>;
      break;
    case SetType.WarmUpSet:
      icon = <div><span className={clsx(styles.commonTextStyles, styles.warmupTextStyles)}>W</span></div>;
      break;
    case SetType.RestPauseSet:
      icon = <div><span className={clsx(styles.commonTextStyles, styles.restPauseTextStyles)}>R</span></div>;
      break;
    case SetType.DropSet:
      icon = <div><span className={clsx(styles.commonTextStyles, styles.dropSetTextStyles)}>D</span></div>;
      break;
    case SetType.FailureSet:
      icon = <div><span className={clsx(styles.commonTextStyles, styles.failureSetTextStyles)}>F</span></div>;
      break;
  }

  return icon;
};

export default IconSet;
