const { WorkoutHandler } = require('../lib/workoutHandler.js');

describe("WorkoutHandler", () => {

    describe("GetWorkout method", () => {
        let mockReq, mockRes;

        beforeEach(() => {
            mockReq = {
                params: {
                    userID: "123",
                    workoutID: "1"
                }
            };

            mockRes = {
                status(code) {
                    this.statusCode = code;
                    return this;
                },
                json(data) {
                    this.data = data;
                    return this;
                },
                statusCode: null,
                data: null
            };
        });

        it("should return 400 if userID or workoutID is missing", () => {
            mockReq.params.userID = null;

            WorkoutHandler.GetWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(400);
            expect(mockRes.data).toEqual({ error: "Invalid userID or workoutID" });
        });

        //The workoutHandler database request needs to be directly modified for this test case to work
        /*it("should return 404 if workout is not found", () => {
            WorkoutHandler.GetWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(404);
            expect(mockRes.data).toEqual({ error: "Workout not found" });
        });*/

        it("should return 401 if unauthorized userID is provided", () => {
            mockReq.params.userID = "999";

            WorkoutHandler.GetWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(401);
            expect(mockRes.data).toEqual({ error: "Unauthorized UserID" });
        });

        it("should return the workout if the userID and workoutID are valid", () => {
            WorkoutHandler.GetWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBeNull();  // Successful, so no specific status code set
            expect(mockRes.data).toEqual({
                userID: 123,
                workoutID: 1,
                exercise: "Squats",
                sets: 3,
                reps: 10,
                weight: 70,
                date: "2023-10-23"
            });
        });

        // The database needs to be directly modified to throw an error
        /*it("should return 500 on an internal server error", () => {
            WorkoutHandler.GetWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(500);
            expect(mockRes.data).toEqual({ error: "Internal Server Error" });
        });*/
    });
    describe("ListWorkouts method", () => {
        let mockReq, mockRes;
    
        beforeEach(() => {
            mockReq = {
                params: {
                    userID: "123",
                }
            };
    
            mockRes = {
                status(code) {
                    this.statusCode = code;
                    return this;
                },
                json(data) {
                    this.data = data;
                    return this;
                },
                statusCode: null,
                data: null
            };
        });
    
        it("should return 400 if userID is missing", () => {
            mockReq.params.userID = null;
    
            WorkoutHandler.ListWorkouts(mockReq, mockRes);
    
            expect(mockRes.statusCode).toBe(400);
            expect(mockRes.data).toEqual({ error: "Invalid userID" });
        });
    
        it("should return the list of workouts if the userID is valid", () => {
            WorkoutHandler.ListWorkouts(mockReq, mockRes);
    
            expect(mockRes.statusCode).toBeNull(); 
            expect(mockRes.data).toEqual([
                
                {
                    userID:123,
                    workoutID: 1,
                    exercise: "Squats",
                    sets: 3,
                    reps: 10,
                    weight: 70,
                    date: "2023-10-23"
                },
                {
                    userID: 123,
                    workoutID: 2,
                    exercise: "Push-ups",
                    sets: 4,
                    reps: 15,
                    weight: null,
                    date: "2023-10-24"
                },
                {
                    userID: 123,
                    workoutID: 3,
                    exercise: "Deadlifts",
                    sets: 5,
                    reps: 8,
                    weight: 225,
                    date: "2023-10-25"
                }
                
            ]);
        });
    });
});

