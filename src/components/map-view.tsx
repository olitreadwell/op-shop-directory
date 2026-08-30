import type { Item } from '@/data/schema';

/** Fallback bounds (all of New Zealand) used when no listing has coordinates. */
const NZ_BOUNDS = { north: -34.4, south: -46.7, west: 166.4, east: 178.6 } as const;

/**
 * Fit bounds to the listings themselves (with padding) so a single-region
 * directory zooms into its cluster instead of spreading the whole country.
 *
 * @param items - Listings with coordinates
 * @returns Bounding box covering every coordinate, or the NZ fallback
 */
function fitBounds(items: Item[]) {
  const withCoords = items.filter((item) => item.lat !== undefined && item.lng !== undefined);
  if (withCoords.length === 0) return NZ_BOUNDS;
  const lats = withCoords.map((item) => item.lat as number);
  const lngs = withCoords.map((item) => item.lng as number);
  const pad = 0.08;
  return {
    north: Math.max(...lats) + (Math.max(...lats) - Math.min(...lats)) * pad,
    south: Math.min(...lats) - (Math.max(...lats) - Math.min(...lats)) * pad,
    west: Math.min(...lngs) - (Math.max(...lngs) - Math.min(...lngs)) * pad,
    east: Math.max(...lngs) + (Math.max(...lngs) - Math.min(...lngs)) * pad,
  };
}

/**
 * Dependency-free SVG map: plots listings from their lat/lng onto a simple
 * equirectangular projection with the region name as the frame. The map is
 * a single labelled image; interactive linkage lives in the link list the
 * map page renders alongside it (SVG anchors would trip axe's
 * nested-interactive rule).
 *
 * @param items - Listings with coordinates
 * @param region - Region label for the title
 * @returns SVG map element
 */
export function MapView({ items, region }: { items: Item[]; region: string }): React.ReactElement {
  const withCoords = items.filter((item) => item.lat !== undefined && item.lng !== undefined);
  const bounds = fitBounds(items);
  const width = 600;
  const height = 480;
  const project = (lat: number, lng: number): { x: number; y: number } => ({
    x: ((lng - bounds.west) / (bounds.east - bounds.west)) * width,
    y: ((bounds.north - lat) / (bounds.north - bounds.south)) * height,
  });
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Map of ${region} showing ${withCoords.length} of ${items.length} listings`}
      className="h-auto w-full rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <title>{`Map of ${region}: ${withCoords.length} listed ${withCoords.length === 1 ? 'item' : 'items'}`}</title>
      <rect
        x="2"
        y="2"
        width={width - 4}
        height={height - 4}
        rx="8"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.2"
      />
      <text x="16" y="30" className="fill-neutral-500 text-sm" aria-hidden="true">
        {region} — approximate positions
      </text>
      {withCoords.map((item) => {
        const { x, y } = project(item.lat ?? 0, item.lng ?? 0);
        return (
          <g key={item.id}>
            <circle cx={x} cy={y} r="6" fill="#2563eb" opacity="0.85" aria-hidden="true" />
            <text
              x={x + 10}
              y={y + 4}
              className="text-xs fill-neutral-700 dark:fill-neutral-200"
              aria-hidden="true"
            >
              {item.name.length > 24 ? `${item.name.slice(0, 24)}…` : item.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
