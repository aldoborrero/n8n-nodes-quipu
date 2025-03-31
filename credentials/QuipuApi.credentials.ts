import {
  ICredentialDataDecryptedObject,
  ICredentialType,
  IHttpRequestOptions,
  INodeProperties,
} from "n8n-workflow";

export class QuipuApi implements ICredentialType {
  name = "quipuApi";
  displayName = "Quipu API";
  documentationUrl = "https://getquipu.com/en/integrations";

  properties: INodeProperties[] = [
    {
      displayName: "Client ID",
      name: "clientId",
      type: "string",
      default: "",
    },
    {
      displayName: "Client Secret",
      name: "clientSecret",
      type: "string",
      default: "",
      typeOptions: {
        password: true,
      },
    },
    {
      displayName: "Environment",
      name: "environment",
      type: "options",
      default: "production",
      options: [
        {
          name: "Production",
          value: "production",
        },
      ],
    },
  ];

  async authenticate(
    credentials: ICredentialDataDecryptedObject,
    requestOptions: IHttpRequestOptions,
  ): Promise<IHttpRequestOptions> {
    const response = await this.getToken(credentials);
    const { access_token } = response;

    requestOptions.headers = {
      ...requestOptions.headers,
      Accept: "application/vnd.quipu.v1+json",
      Authorization: `Bearer ${access_token}`,
    };

    return requestOptions;
  }

  async getToken(credentials: ICredentialDataDecryptedObject): Promise<any> {
    const { clientId, clientSecret } = credentials;

    const baseUrl = "https://getquipu.com";

    const options = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      form: {
        grant_type: "client_credentials",
        scope: "ecommerce",
        client_id: clientId as string,
        client_secret: clientSecret as string,
      },
      uri: `${baseUrl}/oauth/token`,
      json: true,
    };

    try {
      // @ts-ignore
      return await this.helpers.request(options);
    } catch (error) {
      throw new Error("Failed to get access token from Quipu API: " + error);
    }
  }
}
