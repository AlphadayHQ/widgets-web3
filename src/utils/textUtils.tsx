import { v4 as uuidv4 } from "uuid";
// import { TTag } from "../types"; TODO - define TTag 

const URL_REGEX = /(https?:\/\/[^ ]*)/gi;

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

/**
 * Returns a shorter from of a given string
 * @param text - string to be shortened
 * @param count - no of characters to be returned
 * @param ellipsisPos - position of ellipsis, center or end
 *
 * @returns string
 */
export const truncateWithEllipsis = (
  text: string,
  count?: number,
  ellipsisPos: "end" | "center" = "center"
): string => {
  const maxLen = count !== undefined ? count : 12;

  if (text.length > maxLen) {
    if (ellipsisPos === "end")
      return `${text.substr(0, Math.floor(maxLen))}...`;
    return `${text.substr(0, Math.floor(maxLen / 2))}...${text.substr(
      text.length - Math.floor(maxLen / 2)
    )}`;
  }
  return text;
};

export const parseNewLine = (s: string, tabCount = 2): JSX.Element => {
  return (
    <span>
      {s.split("\n").map((e, i, self) => (
        <span key={uuidv4()}>
          {e}
          {i < self.length - 1 && (
            <>
              {[...Array(tabCount)].map(() => (
                <br key={uuidv4()} />
              ))}
            </>
          )}
        </span>
      ))}
    </span>
  );
};

export const isURL = (text: string): boolean => URL_REGEX.test(text);

/**
 * Parses urls and new line elements in text of type string
 * to html format
 *
 * @returns a JSX.Element
 */
export const parseText = (text: string, tabCount = 2): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
  const urls = text.match(URL_REGEX);

  if (urls) {
    return (
      <>
        {text.split(" ").map((str) =>
          urls.includes(str) ? (
            <a
              href={str}
              className="link" // className link is used to style this item from a parent container
              target="_blank"
              rel="noreferrer"
              key={uuidv4()}
            >
              {truncateWithEllipsis(str, 18, "end")}
            </a>
          ) : (
            <span key={uuidv4()}>{parseNewLine(str)} </span>
          )
        )}
      </>
    );
  }

  return parseNewLine(text, tabCount);
};

// TODO TTag definition missing
// export const textHasTags = (text: string, tags: TTag[]): boolean =>
//   text.split(" ").some((curr) =>
//     tags.some((tag) => {
//       const filterTagName = new RegExp(tag.name, "i");
//       const filterTagSlug = new RegExp(tag.slug, "i");
//       return filterTagName.test(curr) || filterTagSlug.test(curr);
//     })
//   );
