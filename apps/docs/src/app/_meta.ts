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
    type: "page",
    display: "hidden",
    theme: {
      footer: false,
      timestamp: false,
      toc: false,
      sidebar: false,
    },
  },
  docs: {
    type: "page",
  },
};

export default meta;
