/**
 * DenizenM Async Safety Registry & Metadata Helper
 *
 * Mappings directly extracted from DenizenM-Tjtoxshpilivili1 CommonRegistries.java
 * and DenizenM-Core AbstractCommand.java / TagManager.java.
 */

// Commands that run directly on the async queue's worker thread without main-thread hand-off
export const ASYNC_RUNS_COMMANDS = new Set<string>([
  'actionbar',
  'announce',
  'async',
  'choose',
  'debug',
  'debug-invalid-command',
  'debugblock',
  'define',
  'definemap',
  'determine',
  'draw',
  'else',
  'filecopy',
  'fileread',
  'filewrite',
  'flag',
  'foreach',
  'goto',
  'if',
  'image',
  'inject',
  'log',
  'mark',
  'narrate',
  'playeffect',
  'playsound',
  'random',
  'ratelimit',
  'redis',
  'repeat',
  'run',
  'schematic',
  'sidebar',
  'sql',
  'stop',
  'tablist',
  'title',
  'toast',
  'wait',
  'waituntil',
  'webget',
  'webserver',
  'while',
  'yaml',
]);

// Commands that an async script may fire off to the main thread and carry on without waiting
export const ASYNC_DEFERRABLE_COMMANDS: Record<string, string> = {
  actionbar: 'Deferrable when targeting per-player',
  announce: 'Deferrable off-thread broadcast',
  compass: 'Deferrable per-player compass target',
  fakeequip: 'Deferrable visual equipment update',
  narrate: 'Deferrable when targeting per-player',
  playeffect: 'Deferrable particle/sound visual effect',
  playsound: 'Deferrable per-player or world sound playback',
  runlater: 'Deferrable with persistent id',
  showfake: 'Deferrable fake block/entity display',
  sidebar: 'Deferrable per-player sidebar update',
};

// Object types where every tag is safe off the main thread
export const ASYNC_SAFE_ALL_OBJECT_TYPES = new Set<string>([
  'biometag',
  'plugintag',
  'tradetag',
  'binarytag',
  'colortag',
  'customobjecttag',
  'durationtag',
  'elementtag',
  'imagetag',
  'javareflectedobjecttag',
  'listtag',
  'maptag',
  'quaterniontag',
  'queuetag',
  'scripttag',
  'secrettag',
  'timetag',
]);

// Types that are safe with minor exceptions
export const ASYNC_UNSAFE_EXCEPTIONS: Record<string, Set<string>> = {
  enchantmenttag: new Set(['full_name', 'can_enchant']),
  materialtag: new Set(['is_enabled']),
};

// Object types with specific sub-tags marked safe off-thread
export const ASYNC_SAFE_SUBTAGS: Record<string, Set<string>> = {
  chunktag: new Set(['add', 'cuboid', 'is_loaded', 'simple', 'sub', 'world', 'x', 'xz', 'z']),

  cuboidtag: new Set([
    'center', 'contains', 'contains_cuboid', 'contains_location', 'corners',
    'flag', 'flag_expiration', 'flag_map', 'get_outline', 'has_flag',
    'intersects', 'is_within', 'list_flags', 'max', 'min', 'outline',
    'outline_2d', 'shell', 'shift', 'size', 'volume', 'walls', 'with_max', 'with_min',
  ]),

  ellipsoidtag: new Set([
    'add', 'bounding_box', 'chunks', 'contains', 'contains_location',
    'flag', 'flag_expiration', 'flag_map', 'has_flag', 'include',
    'is_within', 'list_flags', 'location', 'random', 'shell', 'size',
    'with_location', 'with_size', 'world',
  ]),

  entitytag: new Set(['entity_type', 'script', 'translated_name', 'type', 'uuid']),

  inventorytag: new Set([]),

  itemtag: new Set([
    'book_author', 'book_map', 'book_pages', 'book_title', 'display',
    'durability', 'enchantment_map', 'enchantment_types', 'enchantments',
    'flag', 'flag_expiration', 'flag_map', 'has_display', 'has_flag',
    'has_lore', 'is_enchanted', 'list_flags', 'lore', 'material',
    'max_stack', 'quantity', 'script', 'with_flag',
  ]),

  locationtag: new Set([
    'above', 'add', 'backward', 'backward_flat', 'below', 'center', 'chunk',
    'distance', 'distance_squared', 'div', 'down', 'format', 'formatted',
    'forward', 'forward_flat', 'get_chunk', 'left', 'mul', 'normalize',
    'pitch', 'points_around_x', 'points_around_y', 'points_around_z',
    'points_between', 'quaternion_between_vectors', 'random_offset', 'raw',
    'relative', 'right', 'rotate_around_x', 'rotate_around_y', 'rotate_around_z',
    'rotate_pitch', 'rotate_yaw', 'round', 'round_down', 'round_to',
    'round_to_precision', 'round_up', 'simple', 'simplex_3d', 'sub',
    'to_axis_angle_quaternion', 'up', 'vector_length', 'vector_length_squared',
    'vector_to_face', 'with_pitch', 'with_x', 'with_y', 'with_yaw', 'with_z',
    'world', 'x', 'xyz', 'y', 'yaw', 'z',
  ]),

  npctag: new Set([]),

  playertag: new Set([
    'ban_created', 'ban_created_time', 'ban_expiration', 'ban_expiration_time',
    'ban_info', 'ban_reason', 'ban_source', 'chat_history', 'chat_history_list',
    'disguise_to_self', 'fake_block', 'fake_block_locations', 'fake_entities',
    'first_played', 'first_played_time', 'flag', 'flag_expiration', 'flag_map',
    'has_flag', 'has_played_before', 'is_banned', 'is_online', 'is_op',
    'is_player', 'is_whitelisted', 'last_played', 'last_played_time',
    'list_flags', 'name', 'sidebar_lines', 'sidebar_scores', 'sidebar_title',
    'uuid', 'whitelisted',
  ]),

  polygontag: new Set([
    'bounding_box', 'contains', 'contains_inclusive', 'contains_location',
    'corners', 'flag', 'flag_expiration', 'flag_map', 'has_flag',
    'include_y', 'is_within', 'list_flags', 'max_y', 'min_y', 'outline',
    'outline_2d', 'shell', 'shell_inclusive', 'shift', 'with_corner',
    'with_y_max', 'with_y_min', 'world',
  ]),

  worldtag: new Set([
    'allows_animals', 'allows_monsters', 'allows_pvp', 'ambient_spawn_limit',
    'animal_spawn_limit', 'auto_save', 'can_generate_structures', 'difficulty',
    'duration_since_created', 'environment', 'hardcore', 'has_storm',
    'is_day', 'is_night', 'keep_spawn', 'max_height', 'min_height',
    'monster_spawn_limit', 'moon_phase', 'name', 'sea_level', 'seed',
    'simulation_distance', 'sky_darkness', 'thunder_duration', 'thundering',
    'ticks_per_animal_spawn', 'ticks_per_monster_spawn', 'time',
    'time_duration', 'time_full', 'time_period', 'view_distance',
    'water_animal_spawn_limit', 'weather_duration', 'world_type',
  ]),

  servertag: new Set([
    'art_types', 'nbt_attribute_types', 'damage_causes', 'teleport_causes',
    'particle_types', 'effect_types', 'pattern_types', 'potion_types',
    'tree_types', 'map_cursor_types', 'world_types', 'entity_types',
    'material_types', 'sound_keys', 'statistic_types', 'statistic_type',
    'structures', 'enchantments', 'gamerules', 'max_players', 'motd',
    'view_distance', 'port', 'idle_timeout', 'bukkit_name', 'bukkit_version',
    'version', 'denizen_version', 'has_permissions', 'has_economy',
    'recent_tps', 'players', 'offline_players', 'online_ops', 'offline_ops',
    'online_players', 'online_players_flagged', 'ops', 'has_whitelist',
    'whitelisted_players', 'banned_players', 'banned_addresses', 'is_banned',
    'match_player', 'match_offline_player', 'potion_effect_types',
  ]),
};

// Tag bases that are safe bare (e.g. <player> or <npc>)
export const BARE_SAFE_BASES = new Set(['player', 'npc']);

// Util tags that are safe off-thread
export const UTIL_ASYNC_SAFE_TAGS = new Set([
  'current_thread',
  'is_main_thread',
  'current_time_nanos',
  'linger_stats',
  'pi',
  'tau',
  'e',
  'random',
  'random_decimal',
  'random_uuid',
  'time_now',
]);

export interface CommandAsyncInfo {
  runsAsync: boolean;
  deferrable: boolean;
  deferrableDetails?: string;
  badgeHtml: string;
  descriptionText: string;
}

export function getCommandAsyncStatus(commandName: string): CommandAsyncInfo {
  const clean = commandName.trim().toLowerCase();
  const runsAsync = ASYNC_RUNS_COMMANDS.has(clean);
  const deferrable = clean in ASYNC_DEFERRABLE_COMMANDS;
  const deferrableDetails = ASYNC_DEFERRABLE_COMMANDS[clean];

  if (runsAsync && deferrable) {
    return {
      runsAsync: true,
      deferrable: true,
      deferrableDetails,
      badgeHtml: `<span class="badge-async-safe inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-[#00efb2] border border-emerald-500/30">⚡ Runs Off-Thread</span> <span class="badge-async-defer inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30">⚡ Deferrable</span>`,
      descriptionText: `Runs on the async queue's worker thread without main-thread hand-off. Also deferrable (${deferrableDetails.toLowerCase()}).`,
    };
  }

  if (runsAsync) {
    return {
      runsAsync: true,
      deferrable: false,
      badgeHtml: `<span class="badge-async-safe inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-[#00efb2] border border-emerald-500/30">⚡ Runs Off-Thread</span>`,
      descriptionText: `Runs directly on the async queue's worker thread without main-thread hand-off.`,
    };
  }

  if (deferrable) {
    return {
      runsAsync: false,
      deferrable: true,
      deferrableDetails,
      badgeHtml: `<span class="badge-async-defer inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30">⚡ Deferrable</span>`,
      descriptionText: `${deferrableDetails}. Async scripts fire this to the main thread and continue immediately without waiting.`,
    };
  }

  return {
    runsAsync: false,
    deferrable: false,
    badgeHtml: `<span class="badge-async-main inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">Main Thread Hand-Off</span>`,
    descriptionText: `Requires live server state; automatically dispatched to the main thread when executed from an async queue.`,
  };
}

export interface TagAsyncInfo {
  isSafe: boolean;
  badgeHtml: string;
  descriptionText: string;
}

export function getTagAsyncStatus(cleanTagName: string, beforeDotRaw = '', afterDotRaw = ''): TagAsyncInfo {
  const cleanTag = cleanTagName.trim().toLowerCase();
  const beforeDot = (beforeDotRaw || (cleanTag.includes('.') ? cleanTag.split('.')[0] : cleanTag)).toLowerCase();
  const afterDot = (afterDotRaw || (cleanTag.includes('.') ? cleanTag.slice(beforeDot.length + 1) : '')).toLowerCase();
  const firstAttr = afterDot.split('.')[0].replace(/\[.*\]/g, '').trim();

  // 1. Check if the type has ALL tags async safe
  if (ASYNC_SAFE_ALL_OBJECT_TYPES.has(beforeDot)) {
    return {
      isSafe: true,
      badgeHtml: `<span class="badge-async-safe inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-[#00efb2] border border-emerald-500/30">⚡ Async-Safe</span>`,
      descriptionText: `Pure data processing: evaluates directly on the async script's worker thread (0ms latency, no main-thread hand-off).`,
    };
  }

  // 2. Types with exceptions (EnchantmentTag, MaterialTag)
  if (beforeDot in ASYNC_UNSAFE_EXCEPTIONS) {
    const unsafeSet = ASYNC_UNSAFE_EXCEPTIONS[beforeDot];
    if (unsafeSet.has(firstAttr)) {
      return {
        isSafe: false,
        badgeHtml: `<span class="badge-async-main inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">Main Thread Hand-Off</span>`,
        descriptionText: `This specific sub-tag requires live server state and is handed to the main thread.`,
      };
    }
    return {
      isSafe: true,
      badgeHtml: `<span class="badge-async-safe inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-[#00efb2] border border-emerald-500/30">⚡ Async-Safe</span>`,
      descriptionText: `Registry / constant data: evaluates directly on the async worker thread without hand-off.`,
    };
  }

  // 3. Types with safe sub-tags
  if (beforeDot in ASYNC_SAFE_SUBTAGS) {
    const safeSet = ASYNC_SAFE_SUBTAGS[beforeDot];
    if (safeSet.has(firstAttr)) {
      return {
        isSafe: true,
        badgeHtml: `<span class="badge-async-safe inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-[#00efb2] border border-emerald-500/30">⚡ Async-Safe</span>`,
        descriptionText: `Memory / cached field: safe off the main thread (0ms latency, thread-safe access).`,
      };
    }
  }

  // 4. Server static tags
  if (beforeDot === 'server' || beforeDot === 'servertag') {
    if (ASYNC_SAFE_SUBTAGS.servertag.has(firstAttr)) {
      return {
        isSafe: true,
        badgeHtml: `<span class="badge-async-safe inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-[#00efb2] border border-emerald-500/30">⚡ Async-Safe</span>`,
        descriptionText: `Static server registry / cached value: safe off the main thread.`,
      };
    }
  }

  // 5. Util tags
  if (beforeDot === 'util' || beforeDot === 'utiltag') {
    if (UTIL_ASYNC_SAFE_TAGS.has(firstAttr) || firstAttr.startsWith('random') || firstAttr.startsWith('current')) {
      return {
        isSafe: true,
        badgeHtml: `<span class="badge-async-safe inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-[#00efb2] border border-emerald-500/30">⚡ Async-Safe</span>`,
        descriptionText: `Utility computation: runs directly on the async script's thread.`,
      };
    }
  }

  // 6. Bare tag base check
  if (!afterDot && BARE_SAFE_BASES.has(beforeDot)) {
    return {
      isSafe: true,
      badgeHtml: `<span class="badge-async-safe inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-[#00efb2] border border-emerald-500/30">⚡ Bare-Safe</span>`,
      descriptionText: `The bare reference &lt;${beforeDot}&gt; hands back the queue's linked object without server hand-off.`,
    };
  }

  // 7. Core mathematical or queue tags
  if (
    cleanTag.includes('async') ||
    cleanTag.startsWith('queue.') ||
    cleanTag.startsWith('queuetag.')
  ) {
    return {
      isSafe: true,
      badgeHtml: `<span class="badge-async-safe inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-[#00efb2] border border-emerald-500/30">⚡ Async-Safe</span>`,
      descriptionText: `Async queue introspection: evaluates on the queue's worker thread.`,
    };
  }

  return {
    isSafe: false,
    badgeHtml: `<span class="badge-async-main inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">Main Thread Hand-Off</span>`,
    descriptionText: `Reads live server state; automatically evaluated on the main thread when called from an async queue.`,
  };
}

export function getObjectTypeAsyncStatus(cleanTypeName: string): {
  isFullSafe: boolean;
  isPartial: boolean;
  safeCount: number;
  badgeHtml: string;
  descriptionText: string;
} {
  const clean = cleanTypeName.toLowerCase().endsWith('tag') ? cleanTypeName.toLowerCase() : cleanTypeName.toLowerCase() + 'tag';

  if (ASYNC_SAFE_ALL_OBJECT_TYPES.has(clean)) {
    return {
      isFullSafe: true,
      isPartial: false,
      safeCount: 999,
      badgeHtml: `<span class="badge-async-safe inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-[#00efb2] border border-emerald-500/30">⚡ 100% Async-Safe</span>`,
      descriptionText: `Every tag on this object type is completely safe off the main thread. Pure data processing.`,
    };
  }

  if (clean in ASYNC_UNSAFE_EXCEPTIONS) {
    const count = ASYNC_UNSAFE_EXCEPTIONS[clean].size;
    return {
      isFullSafe: true,
      isPartial: false,
      safeCount: 999,
      badgeHtml: `<span class="badge-async-safe inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-[#00efb2] border border-emerald-500/30">⚡ Async-Safe (${count} exceptions)</span>`,
      descriptionText: `Safe off the main thread except for ${Array.from(ASYNC_UNSAFE_EXCEPTIONS[clean]).join(', ')}.`,
    };
  }

  if (clean in ASYNC_SAFE_SUBTAGS) {
    const set = ASYNC_SAFE_SUBTAGS[clean];
    if (set.size > 0) {
      return {
        isFullSafe: false,
        isPartial: true,
        safeCount: set.size,
        badgeHtml: `<span class="badge-async-defer inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30">⚡ Partial Async-Safe (${set.size} tags)</span>`,
        descriptionText: `${set.size} sub-tags are safe off the main thread (arithmetic, coordinates, thread-safe flags). Live server reads hand off.`,
      };
    }
  }

  return {
    isFullSafe: false,
    isPartial: false,
    safeCount: 0,
    badgeHtml: `<span class="badge-async-main inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">Main Thread Only</span>`,
    descriptionText: `Object wraps live Minecraft / Bukkit entities or state. Tags require main thread execution.`,
  };
}
