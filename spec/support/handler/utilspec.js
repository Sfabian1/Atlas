const generateShortUUID = require("../../../lib/main/util/util.js");
describe("UtilTester", () => {

    it("IDs should be the same length", () => {
        var id1 = generateShortUUID.generateShortUUID();
        var id2 = generateShortUUID.generateShortUUID();
        var id3 = generateShortUUID.generateShortUUID();
        var id4 = generateShortUUID.generateShortUUID();
        var id5 = generateShortUUID.generateShortUUID();
        var id6 = generateShortUUID.generateShortUUID();

        expect(id1.length).toEqual(22);
        expect(id2.length).toEqual(22);
        expect(id3.length).toEqual(22);
        expect(id4.length).toEqual(22);
        expect(id5.length).toEqual(22);
        expect(id6.length).toEqual(22);


    });


});