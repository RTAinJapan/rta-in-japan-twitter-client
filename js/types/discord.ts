/**
 * ユーザ
 * @see https://discordapp.com/developers/docs/resources/user#user-object
 */
export type DiscordUser = {
  /** the user's id	identify */
  id: string;
  /** the user's username, not unique across the platform	identify */
  username: string;
  /** the user's 4-digit discord-tag	identify */
  discriminator: string;
  /** the user's avatar hash	identify */
  avatar?: string;
  /** whether the user belongs to an OAuth2 application	identify */
  bot?: boolean;
  /** whether the user has two factor enabled on their account	identify */
  mfa_enabled?: boolean;
  /** the user's chosen language option	identify */
  locale?: string;
  /** whether the email on this account has been verified	email */
  verified?: boolean;
  /** the user's email	email */
  email?: string;
  /** the flags on a user's account	identify */
  flags?: number;
  /** the type of Nitro subscription on a user's account	identify */
  premium_type?: number;
};

export type DiscordGuild = {
  /** guild id */
  id: string;
  /** guild name (2-100 characters) */
  name: string;
  /** icon hash */
  icon?: string;
  /** splash hash */
  splash?: string;
  /** whether or not the user is the owner of the guild */
  owner?: boolean;
  /** id of owner */
  owner_id: string;
  /** total permissions for the user in the guild (does not include channel overrides) */
  permissions?: number;
  /** voice region id for the guild */
  region: string;
  /** id of afk channel */
  afk_channel_id?: string;
  /** afk timeout in seconds */
  afk_timeout: number;
  /** whether this guild is embeddable (e.g. widget) */
  embed_enabled?: boolean;
  /** if not null, the channel id that the widget will generate an invite to */
  embed_channel_id?: string;
  /** verification level required for the guild */
  verification_level: number;
  /** default message notifications level */
  default_message_notifications: number;
  /** explicit content filter level */
  explicit_content_filter: number;
  /** of role objects	roles in the guild */
  roles: DiscordRole[];
  /** of emoji objects	custom guild emojis */
  emojis: DiscordEmoji[];
  /** of guild feature strings	enabled guild features */
  features: DiscordGuildFeature[];
  /** required MFA level for the guild */
  mfa_level: number;
  /** application id of the guild creator if it is bot-created */
  application_id?: string;
  /** whether or not the server widget is enabled */
  widget_enabled?: boolean;
  /** the channel id for the server widget */
  widget_channel_id?: string;
  /** the id of the channel to which system messages are sent */
  system_channel_id?: string;
  /** timestamp	when this guild was joined at */
  joined_at: string;
  /** whether this is considered a large guild */
  large?: boolean;
  /** whether this guild is unavailable */
  unavailable?: boolean;
  /** total number of members in this guild */
  member_count?: number;
  /** of partial voice state objects	(without the guild_id key) */
  voice_states: Partial<DiscordVoiceState>[];
  /** of guild member objects	users in the guild */
  members?: DiscordGuildMember[];
  /** of channel objects	channels in the guild */
  channels?: DiscordChannel[];
  /** of partial presence update objects	presences of the users in the guild */
  presences?: DiscordPresenceUpdate[];
  /** the maximum amount of presences for the guild (the default value, currently 5000, is in effect when null is returned) */
  max_presences?: number;
  /** the maximum amount of members for the guild */
  max_members?: number;
  /** the vanity url code for the guild */
  vanity_url_code?: string;
  /** the description for the guild */
  description?: string;
  /** banner hash */
  banner?: string;
  /** premium tier */
  premium_tier: number;
  /** the total number of users currently boosting this server */
  premium_subscription_count?: number;
  /** the preferred locale of this guild only set if guild has the "DISCOVERABLE" feature, defaults to en-US */
  preferred_locale: string;
};

export type DiscordPartialGuild = {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
};

export type OAuthToken = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
};

export type DiscordRole = {};

export type DiscordEmoji = {};

export type DiscordGuildFeature = {};

export type DiscordVoiceState = {};

export type DiscordGuildMember = {
  /** the user this guild member represents */
  user: DiscordUser;
  /** this users guild nickname (if one is set) */
  nick?: string;
  /** array of role object ids */
  roles: string[];
  /** when the user joined the guild */
  joined_at: string;
  /** when the user used their Nitro boost on the server */
  premium_since?: string;
  /** whether the user is deafened in voice channels */
  deaf: boolean;
  /** whether the user is muted in voice channels */
  mute: boolean;
};

export type DiscordChannel = {};

export type DiscordPresenceUpdate = {};
