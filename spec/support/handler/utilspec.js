const generateShortUUID = require("../../../lib/main/util/util.js");
describe("UtilTester", () => {

    it("IDs should be the same length", () => {
        var id1 = generateShortUUID.generateShortUUID();

        expect(typeof(id1)).toEqual(typeof Number(0));

    });


});