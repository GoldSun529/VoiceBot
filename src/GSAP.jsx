import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { createContext, useContext, useRef, useState } from "react";
gsap.registerPlugin(CustomEase, CustomWiggle);
gsap.config({ trialWarn: false });

CustomWiggle.create("myWiggle", {
  wiggles: 8,
  type: "uniform",
});

gsap.registerEffect({
  name: "pulse",
  effect(targets) {
    return gsap.fromTo(
      targets,
      {
        scale: 1,
      },
      {
        scale: 1.5,
        repeat: 1,
        ease: "bounce",
        yoyoEase: "power3",
      }
    );
  },
});

gsap.registerEffect({
  name: "spin",
  effect(targets) {
    return gsap.to(targets, {
      rotation: (i, el) =>
        gsap.utils.snap(360, gsap.getProperty(el, "rotation") + 360),
    });
  },
});

gsap.registerEffect({
  name: "shake",
  effect(targets) {
    return gsap.fromTo(
      targets,
      {
        x: 0,
      },
      {
        x: 10,
        ease: "myWiggle",
      }
    );
  },
});

export const wrap = gsap.utils.wrap(["pulse", "spin", "shake"]);

export const GsapEffect = forwardRef(
  ({ children, effect, targetRef, vars }, ref) => {
    const animation = useRef();

    useGSAP(() => {
      if (gsap.effects[effect]) {
        const t = gsap.effects[effect](targetRef.current, vars);
        animation.current = t;
      }
    }, [effect, targetRef, vars]);

    useGSAP(() => {
      if (typeof ref === "function") {
        ref(animation.current);
      } else if (ref) {
        ref.current = animation.current;
      }
    }, [ref]);

    return <>{children}</>;
  }
);

const GsapContext = createContext();

export const useGsapTimeline = () => {
  const context = useContext(GsapContext);
  if (!context) {
    throw new Error('useGsapimeline must be used within a GsapTimeline Provider.')
  } else {
    return context;
  }
}


export const GsapTimelineProvider = ({ children }) => {
  const [tls, setTls] = useState({});
  const [start, setStart] = useState(false);

  const startTimeline = (key) => {
    setTl((tls) => {
      tls[key] = gsap.timeline();
    });
  }
  useGSAP(() => {
    if (start) {
      startTimeline();
    }
  }, [start])

  return <GsapContext.Provider value={{ timeline: tls, startTimeline }}>{children}</GsapContext.Provider>;
};