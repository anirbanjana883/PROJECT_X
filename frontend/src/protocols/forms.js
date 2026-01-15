export const GameForms = {
  "space-pursuits": [
    { name: "speed", label: "Asteroid Speed", type: "slider", min: 1, max: 20, defaultValue: 5 },
    { name: "size", label: "Asteroid Size", type: "slider", min: 1, max: 10, defaultValue: 5 },
    { name: "contrast", label: "Contrast %", type: "slider", min: 10, max: 100, defaultValue: 100 },
    { name: "asteroidCount", label: "Density", type: "number", min: 10, max: 100, defaultValue: 40 },
    { name: "dichopticEnabled", label: "Dichoptic Mode", type: "toggle", defaultValue: false },
    { name: "colorCombination", label: "Color Filter", type: "select", options: ["none", "red-blue", "red-green"], defaultValue: "none" }
  ],
  "memory-matrix": [
    { name: "gridSize", label: "Grid Size (NxN)", type: "slider", min: 3, max: 8, defaultValue: 4 },
    { name: "numberOfTiles", label: "Tiles to Remember", type: "slider", min: 3, max: 15, defaultValue: 5 },
    { name: "displayTime", label: "Memorize Time (sec)", type: "number", min: 0.5, max: 5, step: 0.5, defaultValue: 2 }
  ],
  "eagle-eye": [
    { name: "targetSize", label: "Target Size (px)", type: "slider", min: 20, max: 100, defaultValue: 40 },
    { name: "fieldDensity", label: "Distractor Count", type: "select", options: ["low", "medium", "high"], defaultValue: "medium" },
    { name: "contrast", label: "Contrast %", type: "slider", min: 10, max: 100, defaultValue: 100 },
    { name: "timeLimit", label: "Time Limit (sec)", type: "number", defaultValue: 60 }
  ],
  "peripheral-defender": [
    { name: "speed", label: "Stimulus Speed", type: "slider", min: 1, max: 10, defaultValue: 5 },
    { name: "stimulusSize", label: "Dot Size", type: "slider", min: 1, max: 10, defaultValue: 5 },
    { name: "fieldOfView", label: "Field Spread (Deg)", type: "slider", min: 20, max: 90, defaultValue: 40 }
  ],
  "jungle-jump": [
    { name: "gameSpeed", label: "Scroll Speed", type: "slider", min: 1, max: 10, defaultValue: 5 },
    { name: "gravity", label: "Gravity Strength", type: "select", options: ["low", "normal", "high"], defaultValue: "normal" }
  ]
};