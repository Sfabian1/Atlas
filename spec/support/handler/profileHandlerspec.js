const { ProfileHandler } = require('../../../lib/main/handlers/profile-handler.js');
const { generateShortUUID } = require('../../../lib/main/util/util.js');
const { generateRandomProfile } = require('../utils/profile-testing-util.js');
const { db, mysql } = require('../../../lib/main/util/sqlconnector.js');

describe("ProfileHandler", () => {

    describe("General Validation", () => {
        
        let ph = new ProfileHandler();

        beforeEach(() => {
            userID = generateShortUUID();
            profileID = generateShortUUID();
        });

        it("should return 400 if userID or profileID is missing", async () => {
            
            var res = await ph.GetProfile(null,profileID);
            expect(res.getCode()).toBe(400);
            var res = await ph.GetProfile(userID, null);
            expect(res.getCode()).toBe(400);
            var res = await ph.createProfile(null);
            expect(res.getCode()).toBe(400);
            var res = await ph.ListProfile(null);
            expect(res.getCode()).toBe(400);
            var res = await ph.DeleteProfile(null, profileID);
            expect(res.getCode()).toBe(400);
            var res = await ph.DeleteProfile(userID, null);
            expect(res.getCode()).toBe(400);
            var res = await ph.UpdateProfile(null, profileID);
            expect(res.getCode()).toBe(400);
            var res = await ph.UpdateProfile(userID, null);
            expect(res.getCode()).toBe(400);
           
        });
    });

    describe("createProfile method", () => {
        let ph = new ProfileHandler();
      
        beforeEach(() => {
          userID = generateShortUUID();
        });
      
        it("Req body, username, createdAt, age, bmi, height, weight existence check", async () => {
          ph.postValue = generateRandomProfile(false,null,22.86, 175,  70,);
          var res = await ph.createProfile(userID);
          expect(res.getCode()).toBe(400);
      
          ph.postValue = generateRandomProfile( false, "2023-01-01",null, 175,  70);
          var res = await ph.createProfile(userID);
          expect(res.getCode()).toBe(400);
      
          ph.postValue = generateRandomProfile("john_doe", "2023-01-01", false, 22.86, null);
          var res = await ph.createProfile(userID);
          expect(res.getCode()).toBe(400);
        });
      
        it("Req body, username, createdAt, age, bmi, height, weight enum", async () => {
          ph.postValue = generateRandomProfile(null, "2023-01-01", 30, 22.86, 175, 70);
          var res = await ph.createProfile(userID);
          expect(res.getCode()).toBe(400);
          
          ph.postValue = generateRandomProfile( "john_doe", "2023/01/01", 30, 22.86, 175, 70);
          var res = await ph.createProfile(userID);
          expect(res.getCode()).toBe(400);
      
          ph.postValue = generateRandomProfile( "john_doe", "2023-01-01", 30.09, 22.86, 175, 70);
          var res = await ph.createProfile(userID);
          expect(res.getCode()).toBe(400);

          ph.postValue = generateRandomProfile( "john_doe", "2023-01-01", 30, 500, 175, 70);
          var res = await ph.createProfile(userID);
          expect(res.getCode()).toBe(400);

          ph.postValue = generateRandomProfile( "john_doe", "2023-01-01", 30, 22.86, 1000, 70);
          var res = await ph.createProfile(userID); 
          expect(res.getCode()).toBe(400);
      
          ph.postValue = generateRandomProfile( "john_doe", "2023-01-01", 30, 22.86, 175, 70000);
          var res = await ph.createProfile(userID); 
          expect(res.getCode()).toBe(400);
        });
      });

    describe("UpdateProfile method", () => {
        let ph = new ProfileHandler();
      
        beforeEach(() => {
          userID = generateShortUUID();
          profileID = generateShortUUID();
        });
      
        it("Req body, username, createdAt, age, bmi, height, weight existence check", async () => {
          ph.postValue = generateRandomProfile(null,null,null, 22.86, 175,  70,);
          var res = await ph.UpdateProfile(userID);
          expect(res.getCode()).toBe(400);
      
          ph.postValue = generateRandomProfile( "john_doe", "2023-01-01",null,null, 175,  70);
          var res = await ph.UpdateProfile(userID);
          expect(res.getCode()).toBe(400);
      
          ph.postValue = generateRandomProfile("john_doe", "2023-01-01", 30, 22.86, null, null);
          var res = await ph.UpdateProfile(userID);
          expect(res.getCode()).toBe(400);
        });
      
        it("Req body, username, createdAt, age, bmi, height, weight validity check", async () => {
          ph.postValue = generateRandomProfile(null, "2023-01-01", 30, 22.86, 175, 70);
          var res = await ph.UpdateProfile(userID);
          expect(res.getCode()).toBe(400);
      
          ph.postValue = generateRandomProfile( "john_doe", "2023/01/01", 30, 22.86, 175, 70);
          var res = await ph.UpdateProfile(userID);
          expect(res.getCode()).toBe(400);
      
          ph.postValue = generateRandomProfile( "john_doe", "2023-01-01", 30.09, 22.86, 175, 70);
          var res = await ph.UpdateProfile(userID);
          expect(res.getCode()).toBe(400);
      
          ph.postValue = generateRandomProfile( "john_doe", "2023-01-01", 30, 500, 175, 70);
          var res = await ph.UpdateProfile(userID);
          expect(res.getCode()).toBe(400);
      
          ph.postValue = generateRandomProfile( "john_doe", "2023-01-01", 30, 22.86, 1000, 70);
          var res = await ph.UpdateProfile(userID); 
          expect(res.getCode()).toBe(400);
      
          ph.postValue = generateRandomProfile( "john_doe", "2023-01-01", 30, 22.86, 175, 70000);
          var res = await ph.UpdateProfile(userID); 
          expect(res.getCode()).toBe(400);
        });

        it("Req body, username, createdAt, age, bmi, height, weight validity check", async () => {
          ph.postValue = generateRandomProfile("john_doe","2023-01-01", 30, 22.86, 175, 70);
        
          var result = jasmine.createSpyObj('result', {}, { affectedRows: 1 });
          var mockDB = {};
        
          mockDB.query = jasmine.createSpy('query').and.returnValue(result);
          spyOn(mysql, 'createPool').and.returnValue(mockDB);
      
          var res = await ph.UpdateProfile(userID, profileID);
          expect(res.getCode()).toBe(200);
        });
        
      
        
      });
});
      

    
