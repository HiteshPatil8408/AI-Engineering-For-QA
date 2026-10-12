import {
  Braces,
  Compass,
  Database,
  Sigma,
  Sparkles,
  Network,
  ShieldCheck,
  Container,
  FlaskConical,
  Layers3,
} from "lucide-react";
export function PhaseIcon({
  phase,
  size = 20,
}: {
  phase: number;
  size?: number;
}) {
  const Icon =
    phase === 0
      ? Compass
      : phase === 1
        ? Braces
        : phase <= 4
          ? Database
          : phase <= 7
            ? Sigma
            : phase <= 12
              ? Sparkles
              : phase <= 17
                ? Layers3
                : phase <= 22
                  ? Network
                  : phase <= 25
                    ? FlaskConical
                    : phase <= 29
                      ? ShieldCheck
                      : Container;
  return <Icon size={size} />;
}
