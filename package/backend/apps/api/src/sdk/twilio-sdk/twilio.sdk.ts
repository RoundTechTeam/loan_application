import { BadRequestException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { TwilioMessageInstance } from './type';
export class TwilioSdk {
  private _twilio_account_sid: string;
  private _twilio_auth_token: string;
  private readonly twilioClient: AxiosInstance;

  constructor() {
    this._twilio_account_sid = 'ACced3a17ce50840d2a5c7c5f602794c51';
    this._twilio_auth_token = '9471989e049ebe92fa19666744282ee6';

    if (!this._twilio_account_sid || !this._twilio_auth_token) {
      throw new BadRequestException(
        'Twilio account SID or auth token is missing.',
      );
    }

    this.twilioClient = axios.create({
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authorizationHeader,
      },
    });
  }

  private get authorizationHeader() {
    return `Basic ${Buffer.from(
      `${this._twilio_account_sid}:${this._twilio_auth_token}`,
    ).toString('base64')}`;
  }

  async checkAuthenticate() {
    try {
      const resp = await this.twilioClient.post(
        'https://api.twilio.com/2010-04-01/Accounts.json',
        {
          AccountSid: this._twilio_account_sid,
          AuthToken: this._twilio_auth_token,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      return resp.data;
    } catch (e) {
      const error = e.response.data as Error;
      //throw
      throw new BadRequestException(`[Twilio Message] ${error.message}`);
    }
  }

  async sendVerificationContentTemplate(
    api_content_sid: string,
    messaging_service_sid: string,
    from: string,
    to: string,
    variables: Record<string, string>,
  ) {
    const client: AxiosInstance = await axios.create({
      headers: {
        'Content-Type': `application/x-www-form-urlencoded`,
        Authorization: this.authorizationHeader,
      },
    });

    variables = {
      '1': '168888',
    };

    const data = new URLSearchParams();
    data.append('To', `whatsapp:+${to}`);
    data.append('ContentSid', 'HXa77a2fdd7032e173241d480032267513');
    data.append('MessagingServiceSid', 'MGb91f3de204feabc49485b73af849a291');
    data.append('From', from);
    data.append('ContentVariables', JSON.stringify(variables));
    // data.append('From', `whatsapp:+601158526735`);
    // data.append('MessagingServiceSid', `${messaging_service_sid}`);
    // if (variables !== undefined && variables !== null)
    //   data.append('ContentVariables', JSON.stringify(variables)); // Assuming $variables is a JavaScript object

    const resp = await client.post(
      `https://api.twilio.com/2010-04-01/Accounts/${this._twilio_account_sid}/Messages.json`,
      data,
    );
    return resp.data as TwilioMessageInstance;
  }
}
