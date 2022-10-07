import { useDocumentOperation } from "@sanity/react-hooks";
import { EyeOpenIcon, EyeClosedIcon } from "@sanity/icons";

import { nanoid } from "nanoid";
import readingTime from "reading-time";

function getSlug(input) {
    if (input.slug) {
        return input.slug;
    } else {
        const slug = `${input.title
            .toLowerCase()
            .replaceAll(" ", "-")}-${nanoid(5)}`;
        return slug;
    }
}

function getReadingTime(input) {
    const { minutes } = readingTime(input);
    return Math.round(minutes);
}

function getDescription(input, length) {
    const data = input
        .match(/.+?(?=\n)/)
        .pop()
        .split(/\s/);
    let result = [];
    while (result.length < length && result.length < data.length) {
        result.push(data[result.length]);
    }
    return result.join(" ").trim();
}

export function GetPostMeta({ id, type, draft }) {
    const { patch, publish } = useDocumentOperation(id, type);

    if (type !== "post") {
        return;
    }

    return {
        label: publish.disabled ? "No changes" : "Generate Meta",
        disabled: publish.disabled,
        icon: publish.disabled ? EyeClosedIcon : EyeOpenIcon,
        onHandle: () => {
            patch.execute([
                {
                    set: {
                        publishedAt:
                            draft.publishedAt ?? new Date().toISOString(),
                        slug: getSlug(draft),
                        description: getDescription(draft.body, 12),
                        readingTime: getReadingTime(draft.body),
                    },
                },
            ]);
        },
    };
}
