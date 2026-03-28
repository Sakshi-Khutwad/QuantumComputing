import { motion } from 'framer-motion'

export function QuantumBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {Array.from({ length: 15 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0.22, y: -30 }}
          animate={{
            opacity: [0.18, 0.45, 0.18],
            y: ['-8%', '108%'],
            x: [0, index % 2 === 0 ? 24 : -24, 0],
          }}
          transition={{
            duration: 9 + index,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
            delay: index * 0.4,
          }}
          style={{
            position: 'absolute',
            left: `${4 + index * 6}%`,
            top: '-8%',
            width: 2,
            height: 94,
            borderRadius: 99,
            background:
              'linear-gradient(180deg, rgba(38,230,255,0), rgba(38,230,255,0.8), rgba(38,230,255,0))',
            boxShadow: '0 0 24px rgba(38,230,255,0.4)',
          }}
        />
      ))}
    </div>
  )
}