const { SetHandler } = require('../../../lib/main/handlers/set-handler.js');

describe("SetHandler", () => {

    describe("GetSet method", () => {
        let mockReq, mockRes;

        beforeEach(() => {
            mockReq = {
                params: {
                    userID: "123",
                    setID: "1"
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

        it("should return 400 if userID or setID is missing", () => {
            mockReq.params.userID = null;

            SetHandler.GetSet(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(400);
            expect(mockRes.data).toEqual({ error: "Invalid userID or setID" });
        });

        // The setHandler database request needs to be directly modified for this test case to work
        /*it("should return 404 if set is not found", () => {
            SetHandler.GetSet(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(404);
            expect(mockRes.data).toEqual({ error: "Set not found" });
        });*/

        it("should return 401 if unauthorized userID is provided", () => {
            mockReq.params.userID = "999";

            SetHandler.GetSet(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(401);
            expect(mockRes.data).toEqual({ error: "Unauthorized UserID" });
        });

        it("should return the set if the userID and setID are valid", () => {
            SetHandler.GetSet(mockReq, mockRes);

            expect(mockRes.statusCode).toBeNull();
            expect(mockRes.data).toEqual({
                set_id: 1,
                exercise_id: 10,
                user_id: 123,
                workout_id: 456,
                Date: "2023-10-23",
                num_of_times: 3,
                weight: 50,
                weight_metric: "kg",
                distance: 100,
                distance_metric: "meters",
                rep_time: "00:30",
                rest_period: "00:45",
                difficulty: "medium",
                time_start: "09:00",
                time_end: "10:00"
            });
        });

        // The database needs to be directly modified to throw an error
        /*it("should return 500 on an internal server error", () => {
            SetHandler.GetSet(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(500);
            expect(mockRes.data).toEqual({ error: "Internal Server Error" });
        });*/
    });

    describe("ListSets method", () => {
        let mockReq, mockRes;

        beforeEach(() => {
            mockReq = {
                params: {
                    userID: "123",
                    exerciseID: "10"
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

        it("should return 400 if userID or exerciseID is missing", () => {
            mockReq.params.userID = null;

            SetHandler.ListSets(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(400);
            expect(mockRes.data).toEqual({ error: "Invalid userID or exerciseID" });
        });

        /*it("should return 404 if no sets are associated with the given exerciseID", () => {
            //database connection here that does not return anything

            SetHandler.ListSets(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(404);
            expect(mockRes.data).toEqual({ error: "Not found: No sets associated with the given exerciseID" });
        });*/

        it("should return the sets if the userID and exerciseID are valid", () => {
            SetHandler.ListSets(mockReq, mockRes);

            expect(mockRes.statusCode).toBeNull(); // If everything went well, we haven't explicitly set a status code
            expect(mockRes.data.length).toBeGreaterThan(0); // Assumes at least one set is returned
        });

        /*it("should return 500 on an internal server error", () => {
            // Simulate an error in the SetHandler (like a database failure)
            SetHandler.ListSets(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(500);
            expect(mockRes.data).toEqual({ error: "Internal Server Error" });
        });*/
    });

    describe("DeleteSet method", () => {
        let mockReq, mockRes;

        beforeEach(() => {
            mockReq = {
                params: {
                    userID: "123",
                    setID: "1"
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

        it("should return 400 if userID or setID is missing", () => {
            mockReq.params.userID = null;

            SetHandler.DeleteSet(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(400);
            expect(mockRes.data).toEqual({ error: "Invalid userID or setID" });
        });

        it("should return 404 if no set exists for the given setID and userID", () => {
            mockReq.params.setID = "999";

            SetHandler.DeleteSet(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(404);
            expect(mockRes.data).toEqual({ error: "No set with the given setID for the specified userID" });
        });

        it("should successfully delete the set if the userID and setID are valid", () => {
            SetHandler.DeleteSet(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(200);
            expect(mockRes.data).toEqual({ message: "Set deleted successfully" });
        });

        /*it("should return 500 on an internal server error", () => {
            // Simulate an error in the SetHandler (like a database failure)
            SetHandler.DeleteSet(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(500);
            expect(mockRes.data).toEqual({ error: "Internal Server Error" });
        });*/
    });
    describe("CreateSet method", () => {
        beforeEach(() => {
          mockReq = {
            params: {
              userID: "123",
              workoutID: "1",
            },
          };
      
          mockRes = {
            status: jasmine.createSpy("status").and.callFake(function (code) {
              this.statusCode = code;
              return this;
            }),
            json: jasmine.createSpy("json").and.callFake(function (data) {
              this.data = data;
              return this;
            }),
            statusCode: null,
            data: null,
          };
        });
      
        it("should create a set successfully", async () => {
          mockReq.params = {
            userID: "123", // A valid user ID
            workoutID: "1",
          };
      
          mockReq.body = {
            exercise_id: 1,
            workout_id: 2,
            Date: "2023-10-28",
            num_of_times: 3,
            weight: 50,
            weight_metric: "kg",
            difficulty: "medium",
            time_start: "08:00 AM",
          };
      
          SetHandler.CreateSet(mockReq, mockRes);
      
          expect(mockRes.status).toHaveBeenCalledWith(200);
          expect(mockRes.json).toHaveBeenCalledWith(
            jasmine.objectContaining({ set_id: jasmine.any(Number) })
          );
        });
      
        it("should return 403 status for an invalid user ID", async () => {
          mockReq.params.userID = ""; // An invalid user ID
          await SetHandler.CreateSet(mockReq, mockRes);
      
          expect(mockRes.status).toHaveBeenCalledWith(403);
          expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid userID" });
        });
      
        it("should return 400 status for incomplete set data", async () => {
          mockReq.body = {
            exercise_id: 1,
            workout_id: 2,
            Date: "2023-10-28",
          }; // Incomplete set data
          await SetHandler.CreateSet(mockReq, mockRes);
      
          expect(mockRes.status).toHaveBeenCalledWith(400);
          expect(mockRes.json).toHaveBeenCalledWith({
            error: "Bad request: Incomplete set data",
          });
        });
      
        it("should return 400 status for invalid difficulty", async () => {
          mockReq.body = {
            exercise_id: 1,
            workout_id: 2,
            Date: "2023-10-28",
            num_of_times: 3,
            weight: 50,
            weight_metric: "kg",
            difficulty: "invalid", // Invalid difficulty
            time_start: "08:00 AM",
          };
          await SetHandler.CreateSet(mockReq, mockRes);
      
          expect(mockRes.status).toHaveBeenCalledWith(400);
          expect(mockRes.json).toHaveBeenCalledWith({
            error:
              "Bad request: Invalid difficulty, weight metric, or distance metric value",
          });
        });
      });

});
