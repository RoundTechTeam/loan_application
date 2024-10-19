import { IsDateString, IsNotEmpty } from 'class-validator';

type TwilioTemplateTypes =
  | 'twilio/quick-reply'
  | 'twilio/text'
  | 'twilio/media';
type TwilioTemplateApprovalType = 'UTILITY' | 'MARKETING';
type SubmitTemplateStatus = 'received' | 'pending' | 'approved' | 'rejected';

interface TwilioTemplateTypeContent {
  body: string;
  media?: string[];
  actions?: {
    title: string;
    id: string;
  }[];
}

export interface TwilioSubmitTemplateResponse {
  allow_category_change: boolean;
  category: TwilioTemplateApprovalType;
  content_type: TwilioTemplateTypes;
  name: string;
  rejection_reason: string;
  status: SubmitTemplateStatus;
}

interface Links {
  approval_create: string;
  approvval_fetch: string;
}

export interface TwilioTemplate {
  friendly_name: string;
  account_sid?: string;
  date_created?: string;
  language: string;
  date_updated?: string;
  links?: Links;
  sid?: string;
  url?: string;
  variables?: Record<string, string>;
  types: Partial<Record<TwilioTemplateTypes, TwilioTemplateTypeContent>>;
}

export interface SubmitTemplateApprovalRequest {
  name: string;
  category: TwilioTemplateApprovalType;
}

export interface ApprovalRequest {
  url: string;
  whatsapp: {
    category: string;
    status: SubmitTemplateStatus;
    name: string;
    type: 'whatsapp';
    content_type: TwilioTemplateTypes;
    rejection_reason: string;
  };
  account_sid: string;
  sid: string;
}

export class DateRangeDto {
  @IsDateString()
  @IsNotEmpty()
  from: Date;

  @IsDateString()
  @IsNotEmpty()
  to: Date;
}

export interface ChannelSender {
  contact_no: string;
  send_limit?: number;
  messages_sent_last_24_hours?: number;
  max_limit?: number;
}

export interface TwilioMessageInstance {
  sid: string;
  body: string;
  account_sid: string;
  messaging_service_sid: string;
  date_created: string;
  date_updated: string;
  error_code: string;
  error_message: string;
  num_segments: string;
  num_media: string;
  direction: string;
  api_version: string;
  price: string;
  price_unit: string;
  uri: string;
  subresource_uris: {
    media: string;
    to: string;
    uri: string;
  };
}
