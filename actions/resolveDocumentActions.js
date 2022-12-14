import defaultResolve from "part:@sanity/base/document-actions";

import { GetPostMeta } from "./GetPostMeta";

export default function resolveDocumentActions(props) {
    return [...defaultResolve(props), GetPostMeta];
}
