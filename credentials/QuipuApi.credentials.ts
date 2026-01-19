import { ICredentialType, INodeProperties } from "n8n-workflow";

export class QuipuApi implements ICredentialType {
  name = "quipuApi";
  displayName = "Quipu API";
  documentationUrl = "https://getquipu.com/en/integrations";

  // Extend n8n's built-in OAuth2 API credential type
  extends = ["oAuth2Api"];

  properties: INodeProperties[] = [
    // OAuth2 configuration - hidden with Quipu-specific defaults
    {
      displayName: "Grant Type",
      name: "grantType",
      type: "hidden",
      default: "clientCredentials",
    },
    {
      displayName: "Access Token URL",
      name: "accessTokenUrl",
      type: "hidden",
      default: "https://getquipu.com/oauth/token",
    },
    {
      displayName: "Scope",
      name: "scope",
      type: "hidden",
      default: "ecommerce",
    },
    {
      displayName: "Authentication",
      name: "authentication",
      type: "hidden",
      default: "header", // Send client credentials as Basic Auth header
    },
    // User-visible fields
    {
      displayName: "App ID",
      name: "clientId", // Maps to OAuth2 clientId
      type: "string",
      default: "",
      required: true,
      description: "The App ID from your Quipu account",
    },
    {
      displayName: "App Secret",
      name: "clientSecret", // Maps to OAuth2 clientSecret
      type: "string",
      default: "",
      required: true,
      typeOptions: {
        password: true,
      },
      description: "The App Secret from your Quipu account",
    },
  ];
}
