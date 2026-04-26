import { LoginForm } from "@/features/auth/login/LoginForm";
import { DecorativeCircles } from "@/components/decorative/circle";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";

const COLORS = {
  gradientStart: "oklch(38% 0.22 274)",
  gradientMid: "oklch(54% 0.23 274)",
  gradientEnd: "oklch(62% 0.20 300)",
  circleTop: "oklch(80% 0.15 274)",
  circleBottom: "oklch(80% 0.15 300)",
  circleRight: "oklch(90% 0.10 274)",
  primary: "oklch(54% 0.23 274)",
} as const;

// const FEATURE_CHIPS = ["Transparan", "Akurat", "Terukur"] as const;

export const LoginPage = () => {
  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — branding ─────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${COLORS.gradientStart} 0%, ${COLORS.gradientMid} 50%, ${COLORS.gradientEnd} 100%)`,
        }}
      >
        <DecorativeCircles
          colors={{
            circleTop: COLORS.circleTop,
            circleBottom: COLORS.circleBottom,
            circleRight: COLORS.circleRight,
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <Text as="span" size="lg" weight="semibold" className="text-white tracking-wide">
            SPK TOPSIS
          </Text>
        </div>

        {/* Center copy */}
        <div className="relative z-10 space-y-6">
          <Heading as="h1" size="4xl" weight="bold" className="text-white leading-tight">
            Sistem Pendukung
            <br />
            Keputusan Seleksi
            <br />
            Penerima Bantuan
          </Heading>

          <Text size="base" className="text-white/70 leading-relaxed max-w-xs">
            Metode TOPSIS untuk seleksi penerima bantuan yang transparan,
            akurat, dan terukur.
          </Text>

          {/* Feature chips */}
          {/* <div className="flex flex-wrap gap-2 pt-2">
            {FEATURE_CHIPS.map((label) => (
              <Text
                key={label}
                as="span"
                size="xs"
                weight="medium"
                className="px-3 py-1 rounded-full text-white bg-white/15 backdrop-blur border border-white/20"
              >
                {label}
              </Text>
            ))}
          </div> */}
        </div>

        {/* Bottom */}
        <Text size="xs" className="relative z-10 text-white/40">
          © {new Date().getFullYear()} SPK Bantuan. All rights reserved.
        </Text>
      </div>

      {/* ── Right panel — form ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 bg-background">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: COLORS.primary }}
          >
            <svg fill="none" height="18" viewBox="0 0 24 24" width="18">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
          <Text as="span" weight="semibold" className="text-(--foreground)">
            SPK TOPSIS
          </Text>
        </div>

        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
