// Data extracted from the subject model's bundled files (commit 8b0921a).
// QF27/QF28 summaries from js/data/flightTracks.js — central angle + mean
// air speed computed by running his data through his own functions.

export const QF_TRACKS = [
  {
    id: 'QF28-2024-06-25', flight: 'QF28', date: '2024-06-25',
    label: 'QF28 · Santiago → Sydney · 2024-06-25',
    actualSec: 50797, predictedSec: 51211.467703,
    centralAngleDeg: 101.974, meanAirSpeedMph: 532.6,
    start: { name: 'Santiago', lat: -33.376282, lon: -70.788086 },
    end:   { name: 'Sydney',   lat: -33.973297, lon: 151.183029 },
  },
  {
    id: 'QF27-2024-06-25', flight: 'QF27', date: '2024-06-25',
    label: 'QF27 · Sydney → Santiago · 2024-06-25',
    actualSec: 42484, predictedSec: 42111.830116,
    centralAngleDeg: 101.997, meanAirSpeedMph: 580.3,
    start: { name: 'Sydney',   lat: -33.940071, lon: 151.174393 },
    end:   { name: 'Santiago', lat: -33.386707, lon: -70.786148 },
  },
  {
    id: 'QF27-2024-06-26', flight: 'QF27', date: '2024-06-26',
    label: 'QF27 · Sydney → Santiago · 2024-06-26',
    actualSec: 41461, predictedSec: 41464.344891,
    centralAngleDeg: 102.009, meanAirSpeedMph: 597.7,
    start: { name: 'Sydney',   lat: -33.942078, lon: 151.174896 },
    end:   { name: 'Santiago', lat: -33.370056, lon: -70.787056 },
  },
  {
    id: 'QF28-2024-06-26', flight: 'QF28', date: '2024-06-26',
    label: 'QF28 · Santiago → Sydney · 2024-06-26',
    actualSec: 51810, predictedSec: 51332,
    centralAngleDeg: 101.970, meanAirSpeedMph: 524.0,
    start: { name: 'Santiago', lat: -33.375469, lon: -70.787643 },
    end:   { name: 'Sydney',   lat: -33.977734, lon: 151.184113 },
  },
];

// His city list from js/data/flightRoutes.js — real airports + the
// synthetic "geometric anchors" he labels as if they were cities.
export const CITIES = {
  // Real airports
  syd: { name: 'Sydney',       real: true,  lat: -33.95003, lon:  151.18169 },
  scl: { name: 'Santiago',     real: true,  lat: -33.39710, lon:  -70.79368 },
  mel: { name: 'Melbourne',    real: true,  lat: -37.67082, lon:  144.84298 },
  akl: { name: 'Auckland',     real: true,  lat: -37.00894, lon:  174.78638 },
  jnb: { name: 'Johannesburg', real: true,  lat: -26.13939, lon:   28.24679 },
  drw: { name: 'Darwin',       real: true,  lat: -12.41323, lon:  130.88129 },
  gru: { name: 'São Paulo',    real: true,  lat: -23.43022, lon:  -46.47167 },
  eze: { name: 'Buenos Aires', real: true,  lat: -34.81653, lon:  -58.53727 },
  per: { name: 'Perth',        real: true,  lat: -31.93855, lon:  115.96725 },
  jfk: { name: 'New York JFK', real: true,  lat:  40.6398,  lon:  -73.7789  },
  // Synthetic geometric anchors — his label vs his actual coordinate
  nm_jnb: {
    name:    'N-Mirror "≈ Egypt"',
    real:    false,
    note:    'Lat-flipped Johannesburg. Lands in southern Egypt — not an airport.',
    lat:     26.13939, lon: 28.24679,
  },
  nm_syd: {
    name:    'N-Mirror "≈ Pacific"',
    real:    false,
    note:    'Lat-flipped Sydney. Lands ~700 km off the Japanese coast — not an airport.',
    lat:     33.95003, lon: 151.18169,
  },
  persian_n: {
    name:    '"Persian Gulf"',
    real:    false,
    note:    'Author\'s label. Coordinates 25°N 60.82°E are open water in the Arabian Sea, hundreds of km east of Oman. No JFK ↔ here flight exists.',
    lat:     25.0, lon: 60.82,
  },
};

// Constants from his source.
export const MI_PER_DEG = 69.0936;       // js/demos/flightRoutes.js line 46
export const FE_RADIUS = 1;              // js/core/constants.js
export const SUBJECT_PINNED_COMMIT = '8b0921aa1ed236802c378ca3baaab11fed79f666';

// Subject site URL (for "see his version" links).
export const SUBJECT_URL = 'https://alanspaceaudits.github.io/conceptual_flat_earth_model/';
