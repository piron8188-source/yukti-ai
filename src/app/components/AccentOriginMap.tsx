'use client';

import { motion } from 'framer-motion';

interface MapConfig {
  highlightPaths: string[];
  contextPaths: string[];
  cityX: number;
  cityY: number;
  cityName: string;
  regionName: string;
  labelX: number;
  labelY: number;
}

const MAP_CONFIGS: Record<string, MapConfig> = {
  northeast: {
    // Assam highlighted, surrounding states context
    highlightPaths: [
      'M 85,45 L 155,40 L 165,55 L 170,70 L 155,82 L 130,88 L 100,85 L 75,80 L 65,65 Z',
    ],
    contextPaths: [
      'M 75,80 L 100,85 L 105,100 L 85,105 L 70,95 Z', // Meghalaya
      'M 85,25 L 165,20 L 170,40 L 155,40 L 85,45 Z', // Arunachal
      'M 130,88 L 155,82 L 160,110 L 135,120 L 115,110 L 110,95 Z', // Manipur/Nagaland/Mizoram
      'M 65,65 L 85,45 L 75,80 L 65,65 Z', // Bhutan/Sikkim area
    ],
    cityX: 115,
    cityY: 68,
    cityName: 'Guwahati',
    regionName: 'Northeast India',
    labelX: 115,
    labelY: 55,
  },
  bengal: {
    // West Bengal highlighted
    highlightPaths: [
      'M 140,42 L 158,40 L 162,65 L 148,72 L 138,60 Z',
    ],
    contextPaths: [
      'M 125,72 L 148,68 L 150,88 L 132,95 L 118,85 Z', // Odisha (context)
      'M 115,60 L 145,55 L 155,80 L 145,110 L 135,75 Z', // Jharkhand area
    ],
    cityX: 152,
    cityY: 58,
    cityName: 'Kolkata',
    regionName: 'West Bengal',
    labelX: 150,
    labelY: 45,
  },
  tamil: {
    // Tamil Nadu highlighted
    highlightPaths: [
      'M 110,80 L 135,75 L 145,110 L 130,140 L 110,145 L 100,120 L 105,95 Z',
    ],
    contextPaths: [
      'M 95,95 L 110,80 L 105,95 L 100,120 L 110,145 L 95,150 L 88,130 Z', // Kerala
      'M 80,65 L 115,60 L 135,75 L 110,80 L 95,95 L 75,90 L 70,75 Z', // Karnataka
      'M 115,60 L 145,55 L 155,80 L 145,110 L 135,75 Z', // Andhra/Telangana
    ],
    cityX: 122,
    cityY: 112,
    cityName: 'Chennai',
    regionName: 'Tamil Nadu',
    labelX: 122,
    labelY: 95,
  },
  hindi: {
    // UP highlighted - North India
    highlightPaths: [
      'M 80,40 L 130,35 L 135,55 L 120,65 L 85,68 L 75,55 Z',
    ],
    contextPaths: [
      'M 130,35 L 155,38 L 152,55 L 135,55 Z', // Bihar
      'M 45,30 L 80,25 L 80,40 L 75,55 L 50,58 L 38,45 Z', // Rajasthan
      'M 75,55 L 120,65 L 125,80 L 90,82 L 68,72 Z', // MP
      'M 55,25 L 78,22 L 80,35 L 72,42 L 55,40 Z', // Punjab/Haryana
    ],
    cityX: 105,
    cityY: 50,
    cityName: 'Lucknow',
    regionName: 'North India',
    labelX: 105,
    labelY: 38,
  },
  punjab: {
    // Punjab/Haryana highlighted
    highlightPaths: [
      'M 55,25 L 78,22 L 80,35 L 72,42 L 55,40 Z',
      'M 72,35 L 85,32 L 88,45 L 78,50 L 68,45 Z', // Haryana
    ],
    contextPaths: [
      'M 80,40 L 130,35 L 135,55 L 120,65 L 85,68 L 75,55 Z', // UP
      'M 38,45 L 65,40 L 68,55 L 60,65 L 38,68 L 28,58 Z', // Gujarat/Rajasthan
    ],
    cityX: 62,
    cityY: 32,
    cityName: 'Amritsar',
    regionName: 'Punjab & Haryana',
    labelX: 75,
    labelY: 25,
  },
  maharashtra: {
    // Maharashtra highlighted
    highlightPaths: [
      'M 60,60 L 100,55 L 110,75 L 95,90 L 68,88 L 52,78 Z',
    ],
    contextPaths: [
      'M 80,65 L 115,60 L 135,75 L 110,80 L 95,95 L 75,90 L 70,75 Z', // Karnataka
      'M 35,45 L 65,40 L 68,55 L 60,65 L 38,68 L 28,58 Z', // Gujarat
      'M 45,30 L 80,25 L 80,40 L 75,55 L 50,58 L 38,45 Z', // Rajasthan
    ],
    cityX: 105,
    cityY: 72,
    cityName: 'Mumbai',
    regionName: 'Maharashtra',
    labelX: 95,
    labelY: 60,
  },
  telugu: {
    // Andhra/Telangana highlighted
    highlightPaths: [
      'M 115,60 L 145,55 L 155,80 L 145,110 L 135,75 Z',
    ],
    contextPaths: [
      'M 110,80 L 135,75 L 145,110 L 130,140 L 110,145 L 100,120 L 105,95 Z', // Tamil Nadu
      'M 80,65 L 115,60 L 135,75 L 110,80 L 95,95 L 75,90 L 70,75 Z', // Karnataka
      'M 95,95 L 110,80 L 105,95 L 100,120 L 110,145 L 95,150 L 88,130 Z', // Kerala
    ],
    cityX: 140,
    cityY: 82,
    cityName: 'Hyderabad',
    regionName: 'Andhra Pradesh',
    labelX: 135,
    labelY: 68,
  },
  karnataka: {
    // Karnataka highlighted
    highlightPaths: [
      'M 80,65 L 115,60 L 135,75 L 110,80 L 95,95 L 75,90 L 70,75 Z',
    ],
    contextPaths: [
      'M 110,80 L 135,75 L 145,110 L 130,140 L 110,145 L 100,120 L 105,95 Z', // Tamil Nadu
      'M 95,95 L 110,80 L 105,95 L 100,120 L 110,145 L 95,150 L 88,130 Z', // Kerala
      'M 60,60 L 100,55 L 110,75 L 95,90 L 68,88 L 52,78 Z', // Maharashtra
    ],
    cityX: 105,
    cityY: 80,
    cityName: 'Bengaluru',
    regionName: 'Karnataka',
    labelX: 105,
    labelY: 70,
  },
  kerala: {
    // Kerala highlighted
    highlightPaths: [
      'M 95,95 L 110,80 L 105,95 L 100,120 L 110,145 L 95,150 L 88,130 Z',
    ],
    contextPaths: [
      'M 80,65 L 115,60 L 135,75 L 110,80 L 95,95 L 75,90 L 70,75 Z', // Karnataka
      'M 110,80 L 135,75 L 145,110 L 130,140 L 110,145 L 100,120 L 105,95 Z', // Tamil Nadu
    ],
    cityX: 98,
    cityY: 135,
    cityName: 'Thiruvananthapuram',
    regionName: 'Kerala',
    labelX: 100,
    labelY: 105,
  },
  gujarat: {
    // Gujarat highlighted
    highlightPaths: [
      'M 35,45 L 65,40 L 68,55 L 60,65 L 38,68 L 28,58 Z',
    ],
    contextPaths: [
      'M 60,60 L 100,55 L 110,75 L 95,90 L 68,88 L 52,78 Z', // Maharashtra
      'M 45,30 L 80,25 L 80,40 L 75,55 L 50,58 L 38,45 Z', // Rajasthan
    ],
    cityX: 50,
    cityY: 55,
    cityName: 'Ahmedabad',
    regionName: 'Gujarat',
    labelX: 52,
    labelY: 42,
  },
  odisha: {
    // Odisha highlighted
    highlightPaths: [
      'M 125,72 L 148,68 L 150,88 L 132,95 L 118,85 Z',
    ],
    contextPaths: [
      'M 140,42 L 158,40 L 162,65 L 148,72 L 138,60 Z', // West Bengal
      'M 115,60 L 145,55 L 155,80 L 145,110 L 135,75 Z', // Andhra
    ],
    cityX: 138,
    cityY: 80,
    cityName: 'Bhubaneswar',
    regionName: 'Odisha',
    labelX: 138,
    labelY: 70,
  },
  uk: {
    // UK map - England highlighted
    highlightPaths: [
      'M 90,80 L 110,75 L 118,100 L 112,130 L 95,140 L 82,125 L 78,105 Z',
    ],
    contextPaths: [
      'M 88,55 L 108,50 L 112,75 L 90,80 L 82,70 Z', // Scotland
      'M 78,105 L 90,100 L 88,120 L 78,118 Z', // Wales
    ],
    cityX: 100,
    cityY: 118,
    cityName: 'London',
    regionName: 'United Kingdom',
    labelX: 95,
    labelY: 100,
  },
  usa: {
    // USA map - Continental US
    highlightPaths: [
      'M 30,40 L 160,35 L 168,55 L 162,85 L 140,100 L 100,105 L 60,98 L 35,80 L 25,60 Z',
    ],
    contextPaths: [
      // Subtle state grid lines effect as paths
      'M 60,40 L 60,100 M 90,38 L 90,102 M 120,36 L 120,100', // Vertical grid
      'M 25,60 L 165,55 M 30,80 L 160,75', // Horizontal grid
    ],
    cityX: 148,
    cityY: 52,
    cityName: 'New York',
    regionName: 'United States',
    labelX: 100,
    labelY: 75,
  },
  australia: {
    // Australia map
    highlightPaths: [
      'M 50,40 L 150,35 L 160,70 L 140,100 L 100,110 L 60,100 L 40,70 Z',
    ],
    contextPaths: [
      'M 140,30 L 160,28 L 162,50 L 145,48 Z', // Tasmania area
    ],
    cityX: 135,
    cityY: 85,
    cityName: 'Sydney',
    regionName: 'Australia',
    labelX: 100,
    labelY: 55,
  },
  default: {
    // Full India map as default
    highlightPaths: [
      // No highlight - just show full map
    ],
    contextPaths: [
      // Simplified India outline
      'M 40,30 L 160,25 L 175,50 L 165,90 L 140,120 L 100,130 L 60,120 L 35,80 Z',
    ],
    cityX: 100,
    cityY: 70,
    cityName: 'New Delhi',
    regionName: 'India',
    labelX: 100,
    labelY: 50,
  },
};

function detectRegion(accentIdentified: string): string {
  const accent = accentIdentified.toLowerCase();

  // Northeast India
  if (accent.includes('assamese') || accent.includes('assam') || accent.includes('northeast')) {
    return 'northeast';
  }

  // Bengal
  if (accent.includes('bengali') || accent.includes('west bengal') || accent.includes('kolkata') || accent.includes('bengal')) {
    return 'bengal';
  }

  // Tamil
  if (accent.includes('tamil') || accent.includes('chennai') || accent.includes('tamil')) {
    return 'tamil';
  }

  // Hindi/North
  if (accent.includes('hindi') || accent.includes('up ') || accent.includes('bihar') || accent.includes('north indian') || accent.includes('delhi')) {
    return 'hindi';
  }

  // Punjab
  if (accent.includes('punjabi') || accent.includes('haryana') || accent.includes('punjab')) {
    return 'punjab';
  }

  // Maharashtra
  if (accent.includes('marathi') || accent.includes('maharashtra') || accent.includes('mumbai')) {
    return 'maharashtra';
  }

  // Telugu
  if (accent.includes('telugu') || accent.includes('andhra') || accent.includes('hyderabad')) {
    return 'telugu';
  }

  // Karnataka
  if (accent.includes('kannada') || accent.includes('karnataka') || accent.includes('bangalore') || accent.includes('bengaluru')) {
    return 'karnataka';
  }

  // Kerala
  if (accent.includes('malayalam') || accent.includes('kerala')) {
    return 'kerala';
  }

  // Gujarat
  if (accent.includes('gujarati') || accent.includes('gujarat')) {
    return 'gujarat';
  }

  // Odisha
  if (accent.includes('odia') || accent.includes('odisha') || accent.includes('orissa')) {
    return 'odisha';
  }

  // UK/British
  if (accent.includes('british') || accent.includes('rp') || accent.includes('uk') || accent.includes('english')) {
    return 'uk';
  }

  // US/American
  if (accent.includes('american') || accent.includes('general american') || accent.includes('us ')) {
    return 'usa';
  }

  // Australian
  if (accent.includes('australian') || accent.includes('aussie')) {
    return 'australia';
  }

  // Default fallback
  return 'default';
}

export function AccentOriginMap({ accentIdentified }: { accentIdentified: string }) {
  const region = detectRegion(accentIdentified);
  const config = MAP_CONFIGS[region];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ marginTop: 14 }}
    >
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--text-secondary)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 8,
      }}>
        Origin Region
      </div>

      <svg width={180} height={144} viewBox="0 0 200 160" style={{ display: 'block' }}>
        {/* Faded context regions */}
        {config.contextPaths.map((path, i) => (
          <path
            key={`ctx-${i}`}
            d={path}
            fill="rgba(0,0,0,0.04)"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth={1}
          />
        ))}

        {/* Highlighted region */}
        {config.highlightPaths.map((path, i) => (
          <motion.path
            key={`hl-${i}`}
            d={path}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: i * 0.1 }}
            fill="rgba(20,184,166,0.2)"
            stroke="rgba(20,184,166,0.7)"
            strokeWidth={2}
          />
        ))}

        {/* Default case: pulsing dot on full map */}
        {region === 'default' && (
          <>
            {/* India outline for default */}
            <path
              d="M 40,30 L 160,25 L 175,50 L 165,90 L 140,120 L 100,130 L 60,120 L 35,80 Z"
              fill="rgba(0,0,0,0.02)"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth={1}
            />
          </>
        )}

        {/* Pulsing city dot */}
        <circle
          cx={config.cityX}
          cy={config.cityY}
          r={4}
          fill="var(--teal)"
        >
          <animate
            attributeName="r"
            values="4;8;4"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.2;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Static center dot */}
        <circle
          cx={config.cityX}
          cy={config.cityY}
          r={3}
          fill="var(--teal)"
        />

        {/* City label */}
        <text
          x={config.cityX}
          y={config.cityY + 14}
          fontSize={8}
          fontFamily="var(--font-mono)"
          fill="rgba(0,0,0,0.5)"
          textAnchor="middle"
        >
          {config.cityName}
        </text>

        {/* Region label */}
        <text
          x={config.labelX}
          y={config.labelY}
          fontSize={9}
          fontFamily="var(--font-mono)"
          fill="rgba(0,0,0,0.4)"
          textAnchor="middle"
        >
          {config.regionName}
        </text>

        {/* Compass N */}
        <text
          x={185}
          y={150}
          fontSize={8}
          fontFamily="var(--font-mono)"
          fill="rgba(0,0,0,0.25)"
        >
          N↑
        </text>
      </svg>

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--teal)',
        marginTop: 6,
        letterSpacing: '0.04em',
      }}>
        ● {config.cityName} · {config.regionName}
      </div>
    </motion.div>
  );
}
