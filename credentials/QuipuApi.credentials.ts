import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  IHttpRequestHelper,
  INodeProperties,
} from "n8n-workflow";

export class QuipuApi implements ICredentialType {
  name = "quipuApi";
  displayName = "Quipu API";
  documentationUrl = "https://getquipu.com/en/integrations";

  properties: INodeProperties[] = [
    {
      displayName: "App ID",
      name: "appId",
      type: "string",
      default: "",
      required: true,
      description: "The App ID from your Quipu account",
    },
    {
      displayName: "App Secret",
      name: "appSecret",
      type: "string",
      default: "",
      required: true,
      typeOptions: {
        password: true,
      },
      description: "The App Secret from your Quipu account",
    },
  ];

  async preAuthentication(this: IHttpRequestHelper, credentials: any): Promise<any> {
    // Encode app_id:app_secret in Base64 for Basic Authentication
    const basicAuth = Buffer.from(
      `${credentials.appId}:${credentials.appSecret}`
    ).toString("base64");

    // Fetch the access token using OAuth2 client credentials with Basic Auth
    const tokenResponse = await this.helpers.httpRequest({
      method: "POST",
      url: "https://getquipu.com/oauth/token",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      form: {
        grant_type: "client_credentials",
        scope: "ecommerce",
      },
      json: true,
    });

    return {
      accessToken: tokenResponse.access_token,
    };
  }

  authenticate: IAuthenticateGeneric = {
    type: "generic",
    properties: {
      headers: {
        Accept: "application/vnd.quipu.v1+json",
        Authorization: "=Bearer {{$credentials.accessToken}}",
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: "https://getquipu.com",
      url: "/contacts?page[number]=1",
      method: "GET",
    },
  };
}
