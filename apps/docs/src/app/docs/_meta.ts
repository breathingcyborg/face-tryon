import type { MetaRecord } from "nextra";

/**
 * type MetaRecordValue =
 *  | TitleSchema
 *  | PageItemSchema
 *  | SeparatorSchema
 *  | MenuSchema
 *
 * type MetaRecord = Record<string, MetaRecordValue>
 **/
const meta: MetaRecord = {
  index: {
    title: "Introduction",
  },
  "getting-started": {
    title: "Getting Started",
  },
  "preparing-3d-model": {},
  "code-walkthrough": {},
  "example-occluders": {},
  "tryon-example": {},
};

export default meta;
