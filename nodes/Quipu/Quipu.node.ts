import type { INodeType, INodeTypeDescription } from "n8n-workflow";
import { NodeConnectionTypes } from "n8n-workflow";
import {
  N8NPropertiesBuilder,
  N8NPropertiesBuilderConfig,
} from "@devlikeapro/n8n-openapi-node";
import * as doc from "./openapi.json";

const config: N8NPropertiesBuilderConfig = {};
const parser = new N8NPropertiesBuilder(doc, config);
const properties = parser.build();

export class Quipu implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Quipu",
    name: "quipu",
    icon: "file:quipu.svg",
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: "Interact with Quipu API for invoicing, accounting and taxes",
    defaults: {
      name: "Quipu",
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: "quipuApi",
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: "https://getquipu.com",
      url: "",
      headers: {
        Accept: "application/vnd.quipu.v1+json",
        "Content-Type": "application/vnd.quipu.v1+json",
      },
    },
    properties: properties,
  };
}
