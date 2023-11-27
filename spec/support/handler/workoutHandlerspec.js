
const { WorkoutHandler } = require('../../../lib/main/handlers/workout-handler.js');
const { generateShortUUID } = require('../../../lib/main/util/util.js');
const { generateRandomWorkout } = require('../utils/workout-testing-util.js');
const {db, mysql} = require('../../../lib/main/util/sqlconnector.js');

describe("WorkoutHandler", () => {

    describe("General Validation", () => {
        
        let wh = new WorkoutHandler();
        beforeEach(() => {
           userID = generateShortUUID();
           workoutID = generateShortUUID();

        });

        it("should return 400 if userID or workoutID is missing", async () => {
            
            var res = await wh.GetWorkout(null, workoutID);
            expect(res.getCode()).toBe(400);
            var res = await wh.GetWorkout(userID, null);
            expect(res.getCode()).toBe(400);
            var res = await wh.CreateWorkout(null);
            expect(res.getCode()).toBe(400);
            var res = await wh.ListWorkout(null);
            expect(res.getCode()).toBe(400);
            var res = await wh.DeleteWorkout(null, workoutID);
            expect(res.getCode()).toBe(400);
            var res = await wh.DeleteWorkout(userID, null);
            expect(res.getCode()).toBe(400);
            var res = await wh.UpdateWorkout(null, workoutID);
            expect(res.getCode()).toBe(400);
            var res = await wh.UpdateWorkout(userID, null);
            expect(res.getCode()).toBe(400);
           
        });

    });

    describe("Create Workout Tests", () => {
        
        let wh = new WorkoutHandler();
        
        beforeEach(() => {
           userID = generateShortUUID();
           
        });


        it("Req body,difficulty,date,status existence check", async () => {
            wh.postValue = generateRandomWorkout("IN_PROGRESS","12/02/24","09:02:13","09:03:15", null, false);
            var res = await wh.CreateWorkout(userID);
            expect(res.getCode()).toBe(400);

            wh.postValue = generateRandomWorkout(null,"12/02/24","09:02:13","09:03:15", false);
            var res = await wh.CreateWorkout(userID);
            expect(res.getCode()).toBe(400);

            wh.postValue = generateRandomWorkout("IN_PROGRESS",null,"09:02:13","09:03:15", false);
            var res = await wh.CreateWorkout(userID);
            expect(res.getCode()).toBe(400);
        });

        it("Req body,difficulty,date,status enum", async () => {
            wh.postValue = generateRandomWorkout("IN_PROGRESS","12/02/24","09:02:13","09:03:15", "RUCKUS", false);
            var res = await wh.CreateWorkout(userID);
            expect(res.getCode()).toBe(400);

            wh.postValue = generateRandomWorkout("WHATEVER","12/02/24","09:02:13","09:03:15", false);
            var res = await wh.CreateWorkout(userID);
            expect(res.getCode()).toBe(400);

            wh.postValue = generateRandomWorkout("IN_PROGRESS",null,"09:02:13","09:03:15", false);
            var res = await wh.CreateWorkout(userID);
            expect(res.getCode()).toBe(400);

            wh.postValue = generateRandomWorkout("COMPLETED","12/02/24","09:02:13","09:0", false);
            var res = await wh.CreateWorkout(userID);
            expect(res.getCode()).toBe(400);

            wh.postValue = generateRandomWorkout("COMPLETED","12/02/24","09:0","09:03:15", false);
            var res = await wh.CreateWorkout(userID);
            expect(res.getCode()).toBe(400);
        });

    });

    describe("UpdateWorkout method", () => {
        let wh = new WorkoutHandler();
        
        beforeEach(() => {
           userID = generateShortUUID();
           workoutID = generateShortUUID();
           
        });

        it("Req body,difficulty,date,status existence check", async () => {
            wh.postValue = generateRandomWorkout("IN_PROGRESS","12/02/24","09:02:13","09:03:15", null, false);
            var res = await wh.UpdateWorkout(userID);
            expect(res.getCode()).toBe(400);

            wh.postValue = generateRandomWorkout(null,"12/02/24","09:02:13","09:03:15", false);
            var res = await wh.UpdateWorkout(userID);
            expect(res.getCode()).toBe(400);

            wh.postValue = generateRandomWorkout("IN_PROGRESS",null,"09:02:13","09:03:15", false);
            var res = await wh.UpdateWorkout(userID);
            expect(res.getCode()).toBe(400);
        });

        it("Req body,difficulty,date,status enum", async () => {
            wh.postValue = generateRandomWorkout("IN_PROGRESS","12/02/24","09:02:13","09:03:15", "RUCKUS", false);
            var res = await wh.UpdateWorkout(userID);
            expect(res.getCode()).toBe(400);

            wh.postValue = generateRandomWorkout("WHATEVER","12/02/24","09:02:13","09:03:15", null,  false);
            var res = await wh.UpdateWorkout(userID);
            expect(res.getCode()).toBe(400);

            wh.postValue = generateRandomWorkout("IN_PROGRESS",null,"09:02:13","09:03:15", null, false);
            var res = await wh.UpdateWorkout(userID);
            expect(res.getCode()).toBe(400);

            wh.postValue = generateRandomWorkout("COMPLETED","12/02/24","09:02:13","09:0",null, false);
            var res = await wh.UpdateWorkout(userID);
            expect(res.getCode()).toBe(400);

            wh.postValue = generateRandomWorkout("COMPLETED","12/02/24","09:0","09:03:15",null ,false);
            var res = await wh.UpdateWorkout(userID);
            expect(res.getCode()).toBe(400);

            wh.postValue = "{}";
            var res = await wh.UpdateWorkout(userID);
            expect(res.getCode()).toBe(400);
        });

        
        it("Req body,difficulty,date,status enum", async () => {
            wh.postValue = generateRandomWorkout("IN_PROGRESS","2024-12-12","09:02:13","09:03:15", null, false);
            
            var result = jasmine.createSpyObj('result', {}, {affectedRows: 1});
            var mockDB = {};

            mockDB.query = jasmine.createSpy('query').and.returnValue(result);
            spyOn(mysql, 'createPool').and.returnValue(mockDB);
            
            var res = await wh.UpdateWorkout(userID, workoutID);
            expect(res.getCode()).toBe(200);
        });
    });
});
