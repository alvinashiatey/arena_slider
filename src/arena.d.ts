export interface ArenaResponse {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  added_to_at: string;
  published: boolean;
  open: boolean;
  collaboration: boolean;
  collaborator_count: number;
  slug: string;
  length: number;
  kind: string;
  status: string;
  user_id: number;
  manifest: Manifest;
  contents: Content[];
  base_class: string;
  page: number;
  per: number;
  collaborators: any[];
  follower_count: number;
  share_link: any;
  metadata: Metadata2;
  class_name: string;
  can_index: boolean;
  "nsfw?": boolean;
  owner: Owner;
  user: User2;
}

export interface Manifest {
  key: string;
  AWSAccessKeyId: string;
  bucket: string;
  success_action_status: string;
  policy: string;
  acl: string;
  signature: string;
  expires: string;
}

export interface Content {
  id: number;
  title: string;
  updated_at: string;
  created_at: string;
  state: string;
  comment_count: number;
  generated_title: string;
  content_html: string;
  description_html: string;
  visibility: string;
  content: string;
  description: string;
  source: any;
  image: any;
  embed: any;
  attachment: any;
  metadata: any;
  base_class: string;
  class: string;
  user: User;
  position: number;
  selected: boolean;
  connection_id: number;
  connected_at: string;
  connected_by_user_id: number;
  connected_by_username: string;
  connected_by_user_slug: string;
}

export interface User {
  id: number;
  created_at: string;
  slug: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar: string;
  avatar_image: AvatarImage;
  channel_count: number;
  following_count: number;
  profile_id: number;
  follower_count: number;
  initials: string;
  can_index: boolean;
  metadata: Metadata;
  is_premium: boolean;
  is_lifetime_premium: boolean;
  is_supporter: boolean;
  is_exceeding_connections_limit: boolean;
  is_confirmed: boolean;
  is_pending_reconfirmation: boolean;
  is_pending_confirmation: boolean;
  badge: string;
  base_class: string;
  class: string;
}

export interface AvatarImage {
  thumb: string;
  display: string;
}

export interface Metadata {
  description: any;
}

export interface Metadata2 {
  description: string;
}

export interface Owner {
  id: number;
  created_at: string;
  slug: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar: string;
  avatar_image: AvatarImage2;
  channel_count: number;
  following_count: number;
  profile_id: number;
  follower_count: number;
  initials: string;
  can_index: boolean;
  metadata: Metadata3;
  is_premium: boolean;
  is_lifetime_premium: boolean;
  is_supporter: boolean;
  is_exceeding_connections_limit: boolean;
  is_confirmed: boolean;
  is_pending_reconfirmation: boolean;
  is_pending_confirmation: boolean;
  badge: string;
  base_class: string;
  class: string;
}

export interface AvatarImage2 {
  thumb: string;
  display: string;
}

export interface Metadata3 {
  description: any;
}

export interface User2 {
  id: number;
  created_at: string;
  slug: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar: string;
  avatar_image: AvatarImage3;
  channel_count: number;
  following_count: number;
  profile_id: number;
  follower_count: number;
  initials: string;
  can_index: boolean;
  metadata: Metadata4;
  is_premium: boolean;
  is_lifetime_premium: boolean;
  is_supporter: boolean;
  is_exceeding_connections_limit: boolean;
  is_confirmed: boolean;
  is_pending_reconfirmation: boolean;
  is_pending_confirmation: boolean;
  badge: string;
  base_class: string;
  class: string;
}

export interface AvatarImage3 {
  thumb: string;
  display: string;
}

export interface Metadata4 {
  description: any;
}
