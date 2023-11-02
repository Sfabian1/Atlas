const { WorkoutHandler } = require('../../../lib/main/handlers/workout-handler.js');

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

        it("should return 401 if userID is missing", () => {
            mockReq.params.userID = null;

            WorkoutHandler.CreateWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(401);
            expect(mockRes.data).toEqual({ error: "Unauthorized: Invalid userID" });
        });

        it("should return 413 if payload is too large", () => {
            mockReq.body = { data: "a".repeat(10001) };

            WorkoutHandler.CreateWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(413);
            expect(mockRes.data).toEqual({ error: "Payload too large" });
        });

        it("should return 422 if incomplete workout data is provided", () => {
            mockReq.body = { name: "Morning Workout" };

            WorkoutHandler.CreateWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(422);
            expect(mockRes.data).toEqual({ error: "Incomplete workout data" });
        });

        it("should return 422 if timeEnd is missing and status is not 'IN_PROGRESS' or 'STARTED'", () => {
            mockReq.body = {
                name: "Morning Workout",
                difficulty: "easy",
                timeStart: "08:00",
                date: "2023-10-23",
                status: "COMPLETED"
            };

            WorkoutHandler.CreateWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(422);
            expect(mockRes.data).toEqual({ error: "timeEnd is required unless status is IN_PROGRESS or STARTED" });
        });

        it("should return 400 for invalid difficulty or status value", () => {
            mockReq.body = {
                name: "Morning Workout",
                difficulty: "very_easy",
                timeStart: "08:00",
                timeEnd: "09:00",
                date: "2023-10-23",
                status: "COMPLETED"
            };

            WorkoutHandler.CreateWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(400);
            expect(mockRes.data).toEqual({ error: "Invalid difficulty or status value" });
        });

        it("should return 200 with workoutID if valid data is provided", () => {
            mockReq.body = {
                name: "Morning Workout",
                difficulty: "easy",
                timeStart: "08:00",
                timeEnd: "09:00",
                date: "2023-10-23",
                status: "COMPLETED"
            };

            WorkoutHandler.CreateWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(200);
            expect(mockRes.data.workoutID).toBeDefined();
        });
    });

    describe("CreateWorkout method", () => {
        let mockReq, mockRes;

        beforeEach(() => {
            mockReq = {
                params: {
                    userID: "123"
                },
                body: {}
            };

    
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

            describe("UpdateWorkout", () => {
                let mockReq, mockRes;
                const workouts = [
                {
                    userID: 1,
                    workoutID: 1,
                    exercise: "Squats",
                    sets: 3,
                    reps: 10,
                    weight: 70,
                    date: "2023-10-23",
                },
                {
                    userID: 1,
                    workoutID: 2,
                    exercise: "Bench PmockRess",
                    sets: 3,
                    reps: 8,
                    weight: 135,
                    date: "2023-10-24",
                },
                ];
            
                beforeEach(() => {
                mockReq = {
                    params: {},
                    body: {},
                };
                mockRes = {
                    status: jasmine.createSpy("status").and.returnValue(mockRes),
                    json: jasmine.createSpy("json"),
                };
                });
            
                it("should update a workout with valid fields", async () => {
                mockReq.params.userID = 1;
                mockReq.params.workoutID = 1;
                mockReq.body.sets = 4; // Change the sets value
                mockReq.body.reps = 12; // Change the reps value
                mockReq.body.weight = 75; // Change the weight value
                mockReq.body.date = "2023-10-25"; // Change the date value
            
                await UpdateWorkout(mockReq, mockRes, workouts); // Pass the workouts array
            
                // Check that the workout has been updated
                expect(mockRes.status).not.toHaveBeenCalled();
                expect(mockRes.json).toHaveBeenCalledWith({
                    userID: 1,
                    workoutID: 1,
                    exercise: "Squats",
                    sets: 4, // Updated sets
                    reps: 12, // Updated reps
                    weight: 75, // Updated weight
                    date: "2023-10-25", // Updated date
                });
                });
            
                it("should return a 404 error if the workout is not found", async () => {
                //ERROR: 404
                mockReq.params.userID = 1;
                mockReq.params.workoutID = 999; // Assuming a non-existing workoutID
            
                // Mock the mockRes object with the necessary methods
                const mockRes = {
                    status: jasmine
                    .createSpy()
                    .and.returnValue({ json: jasmine.createSpy() }),
                };
            
                // Call the UpdateWorkout function
                await UpdateWorkout(mockReq, mockRes);
            
                // Expect a 404 error
                expect(mockRes.status).toHaveBeenCalledWith(404);
                expect(mockRes.status().json).toHaveBeenCalledWith({
                    error: "Workout not found",
                });
                });
            
                it("should return a 400 error if userID or workoutID is missing", async () => {
                //error 400 invalid id
                // Don't set userID and workoutID to simulate missing parameters
                mockReq.params = {}; // Clear the parameters
                mockReq.body = {}; // Clear the mockRequest body
            
                // Mock the mockRes object with the necessary methods
                const mockRes = {
                    status: jasmine
                    .createSpy()
                    .and.returnValue({ json: jasmine.createSpy() }),
                };
            
                // Call the UpdateWorkout function
                await UpdateWorkout(mockReq, mockRes);
            
                // Expect a 400 error
                expect(mockRes.status).toHaveBeenCalledWith(400);
                expect(mockRes.status().json).toHaveBeenCalledWith({
                    error: "Invalid userID or workoutID",
                });
                });
            });
});
