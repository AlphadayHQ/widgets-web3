import renderer from "react-test-renderer";
import { parseText, slugify } from "./textUtils";

describe("Test for text Utilities", () => {
    it("check the slug is correctly formatted", () => {
        const slugTests = [
            { test: " bitcoin ", result: "bitcoin" },
            { test: "terra luna", result: "terra-luna" },
            { test: "Bitcoin Cash", result: "bitcoin-cash" },
        ];
        slugTests.forEach(({ test, result }) => {
            expect(slugify(test)).toBe(result);
        });
    });

    it("checks jsx.Element is created correctly from a string by parseText", () => {
        const rawText =
            "Yellow Fever:\n\nRequired if arriving from \n- Angola\n- Peru\n- Dominican Republic. \n\n Visit https://www.who.int/publications-detail-redirect/9789241563871 or https://www.sciencedirect.com/topics/immunology-and-microbiology/infectious-diseases to learn more.";
        const tree = renderer.create(parseText(rawText)).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
