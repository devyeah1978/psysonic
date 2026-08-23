import { findServerByIdOrIndexKey } from '@/lib/server/serverLookup';

export interface ArtistDetailPathOptions {
  serverId?: string | null;
  search?: string | URLSearchParams;
  /**
   * Display name of the concrete artist credit that opened the page.
   *
   * OpenSubsonic track credits may carry an artist id that has no standalone
   * `getArtist` row (guest/featured artists). Preserve the clicked structured
   * name so the detail page can keep the route identity even when the server's
   * legacy artist endpoint cannot resolve that id cleanly.
   */
  artistName?: string | null;
}

/** Build an album detail path while preserving query parameters and owning server. */
export function buildAlbumDetailPath(
  albumId: string,
  options: ArtistDetailPathOptions = {},
): string {
  const params = new URLSearchParams(options.search ?? '');
  if (options.serverId) params.set('server', options.serverId);
  const query = params.toString();
  return `/album/${albumId}${query ? `?${query}` : ''}`;
}

/** Build an artist detail path while preserving query parameters and owning server. */
export function buildArtistDetailPath(
  artistId: string,
  options: ArtistDetailPathOptions = {},
): string {
  const params = new URLSearchParams(options.search ?? '');
  if (options.serverId) params.set('server', options.serverId);
  if (options.artistName?.trim()) params.set('artistName', options.artistName.trim());
  const query = params.toString();
  return `/artist/${artistId}${query ? `?${query}` : ''}`;
}

/** Build a composer detail path while preserving query parameters and owning server. */
export function buildComposerDetailPath(
  composerId: string,
  options: ArtistDetailPathOptions = {},
): string {
  const params = new URLSearchParams(options.search ?? '');
  if (options.serverId) params.set('server', options.serverId);
  const query = params.toString();
  return `/composer/${composerId}${query ? `?${query}` : ''}`;
}

/** Resolve `?server=` on album/artist detail routes; falls back when absent or unknown. */
export function readDetailServerId(
  searchParams: URLSearchParams,
  fallback: string | null | undefined,
): string | null {
  const raw = searchParams.get('server');
  if (raw) return findServerByIdOrIndexKey(raw)?.id ?? null;
  if (!fallback) return null;
  return findServerByIdOrIndexKey(fallback)?.id ?? null;
}

/** Append or merge `server=` into an existing album/artist link query string. */
export function appendServerQuery(
  base: string | undefined,
  serverId: string | undefined,
): string | undefined {
  if (!serverId) return base;
  const params = new URLSearchParams(base ?? '');
  params.set('server', serverId);
  return params.toString();
}
