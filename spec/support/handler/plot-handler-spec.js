
const exercise_testing_util = require("../utils/exercise-testing-util.js");
const {PlotHandler, TimeSeries, ExercisePlot, WellnessTimeSeries, WellnessPlot} = require("../../../lib/main/handlers/plot-handler.js");
const { generateRandomSet } = require("../utils/set-testing-util.js");
const { generateShortUUID } = require("../../../lib/main/util/util.js");
const jasmine = require("jasmine");
const { momentDateFormat } = require("../../../lib/main/constants/server-constants.js");
const { CompletedResponse, ValidaitonError } = require("../../../lib/main/util/response.js");
const { generateRandomWellness} = require("../utils/wellness-testing-util.js");

const ph = new PlotHandler();

describe("PlotHandler", () => {
    describe("PlotExercise", () => {
        it("test normal range inclusive ", async () => {
            const userId = generateShortUUID();
                        const exerciseId = generateShortUUID();
                        const otherId = generateShortUUID();
                        const url = `/${userId}/plot/?exerciseId=${exerciseId}&startDate=2023-10-22&numOfDays=4`
                       
                        let sets = [];
                        sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-22", "01:01:35", "02:02:25"));
                        sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-23", "01:02:35", "01:03:25"));
                        sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-24", "03:03:35", "03:06:24"));
                        sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-25", "03:15:35", "03:17:25"));

                        let set_resp =  new CompletedResponse(JSON.stringify(sets), "application/json");
                        spyOn(ph.sh, 'ListSets').withArgs(userId).and.returnValue(set_resp);
                
                        let actual_resp = (await ph.getExercisePlot(url)).getMessage();
                        actual_resp = JSON.parse(actual_resp);
                        expect(actual_resp.timeSeriesDistance.length).toEqual(3);
                        expect(actual_resp.timeSeriesWeight.length).toEqual(3);
            });

            it("test normal range outside ", async () => {
                const userId = generateShortUUID();
                            const exerciseId = generateShortUUID();
                            const otherId = generateShortUUID();
                            const url = `/${userId}/plot/?exerciseId=${exerciseId}&startDate=2023-10-22&numOfDays=4`
                           
                            let sets = [];
                            sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/9/2023", "01:01:35", "02:02:25"));
                            sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/31/2023", "01:02:35", "01:03:25"));
                            sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "10/30/2023", "03:03:35", "03:06:24"));
                            sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-29", "03:15:35", "03:17:25"));
                            
                            let set_resp =  new CompletedResponse(JSON.stringify(sets), "application/json");
                            spyOn(ph.sh, 'ListSets').withArgs(userId).and.returnValue(set_resp);
                    
                            let actual_resp = (await ph.getExercisePlot(url)).getMessage();
                            actual_resp = JSON.parse(actual_resp);
                            expect(actual_resp.timeSeriesDistance.length).toEqual(0);
                            expect(actual_resp.timeSeriesWeight.length).toEqual(0);
                });

                it("test normal range outside partial ", async () => {
                    const userId = generateShortUUID();
                                const exerciseId = generateShortUUID();
                                const otherId = generateShortUUID();
                                const url = `/${userId}/plot/?exerciseId=${exerciseId}&startDate=2023-10-22&numOfDays=2`
                               
                                let sets = [];
                                sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-22", "01:01:35", "02:02:25"));
                                sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-23", "01:02:35", "01:03:25"));
                                sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-29", "03:03:35", "03:06:24"));
                                sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-24", "03:15:35", "03:17:25"));
                                
                                let set_resp =  new CompletedResponse(JSON.stringify(sets), "application/json");
                                spyOn(ph.sh, 'ListSets').withArgs(userId).and.returnValue(set_resp);
                        
                                let actual_resp = (await ph.getExercisePlot(url)).getMessage();
                                actual_resp = JSON.parse(actual_resp);
                                expect(actual_resp.timeSeriesDistance.length).toEqual(2);
                                expect(actual_resp.timeSeriesWeight.length).toEqual(2);
                    });

                it("test negative days ", async () => {
                    const userId = generateShortUUID();
                                const exerciseId = generateShortUUID();
                                const otherId = generateShortUUID();
                                const url = `/${userId}/plot/?exerciseId=${exerciseId}&startDate=2023-10-22&numOfDays=-1`
                                
                                let sets = [];
                                sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-22", "01:01:35", "02:02:25"));
                                sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-23", "01:02:35", "01:03:25"));
                                sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-29", "03:03:35", "03:06:24"));
                                sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-24", "03:15:35", "03:17:25"));
                                
                                let set_resp =  new CompletedResponse(JSON.stringify(sets), "application/json");
                                spyOn(ph.sh, 'ListSets').withArgs(userId).and.returnValue(set_resp);
                        
                                let resp = await ph.getExercisePlot(url)
                              
                                expect(resp.getCode()).toBe(400);
                               
                    });

                    it("test invalid exercise id ", async () => {
                        const userId = generateShortUUID();
                                    const exerciseId = generateShortUUID();
                                    const otherId = generateShortUUID();
                                    const url = `/${userId}/plot/?exerciseId=823791&startDate=2023-10-22&numOfDays=-1`
                                    
                                    let sets = [];
                                    sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-22", "01:01:35", "02:02:25"));
                                    sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-23", "01:02:35", "01:03:25"));
                                    sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-29", "03:03:35", "03:06:24"));
                                    sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-24", "03:15:35", "03:17:25"));
                                    
                                    let set_resp =  new CompletedResponse(JSON.stringify(sets), "application/json");
                                    spyOn(ph.sh, 'ListSets').withArgs(userId).and.returnValue(set_resp);
                            
                                    let resp = await ph.getExercisePlot(url)
                                  
                                    expect(resp.getCode()).toBe(400);
                                   
                        });
                    
                    it("test invalid start date ", async () => {
                        const userId = generateShortUUID();
                                    const exerciseId = generateShortUUID();
                                    const otherId = generateShortUUID();
                                    const url = `/${userId}/plot/?exerciseId=${exerciseId}&startDate=10/2asd/2023&numOfDays=-1`
                                    
                                    let sets = [];
                                    sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-22", "01:01:35", "02:02:25"));
                                    sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-23", "01:02:35", "01:03:25"));
                                    sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-29", "03:03:35", "03:06:24"));
                                    sets.push(generateRandomSet(userId, exerciseId, otherId, otherId, "2023-10-24", "03:15:35", "03:17:25"));
                                    
                                    let set_resp =  new CompletedResponse(JSON.stringify(sets), "application/json");
                                    spyOn(ph.sh, 'ListSets').withArgs(userId).and.returnValue(set_resp);
                            
                                    let resp = await ph.getExercisePlot(url)
                                 
                                    expect(resp.getCode()).toBe(400);
                                    
                        });

                        it("test empty sets ", async () => {
                            const userId = generateShortUUID();
                                        const exerciseId = generateShortUUID();
                                        const otherId = generateShortUUID();
                                        const url = `/${userId}/plot/?exerciseId=${exerciseId}&startDate=10/2asd/2023&numOfDays=-1`
                                        
                                        let sets = [];
                                    
                                        let set_resp =  new CompletedResponse(JSON.stringify(sets), "application/json");
                                        spyOn(ph.sh, 'ListSets').withArgs(userId).and.returnValue(set_resp);
                                
                                        let resp = await ph.getExercisePlot(url)
                                     
                                        expect(resp.getCode()).toBe(400);         
                            });
                            it("test empty sets ", async () => {
                                const userId = generateShortUUID();
                                            const exerciseId = generateShortUUID();
                                            const otherId = generateShortUUID();
                                            const url = `/${userId}/plot/?exerciseId=${exerciseId}&startDate=10/2asd/2023&numOfDays=-1`
                                            
                                            let sets = [];
                                        
                                            let set_resp =  new ValidaitonError("testing something going wrong");
                                            spyOn(ph.sh, 'ListSets').withArgs(userId).and.returnValue(set_resp);
                                    
                                            let resp = await ph.getExercisePlot(url)
                                        
                                            expect(resp.getCode()).toBe(400);         
                                });
    });

    describe("getWellnessPlot", () => {
        it("test getWellnessPlot with all valid parameters ", async () => {
            const userId = generateShortUUID();
            const wellnessId = generateShortUUID();
            const url = `/${userId}/plot/?metric=mood&startDate=2023-11-20&numOfDays=3`
                                                   
            let wellness = [];
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-20"));
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-21"));
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-22"));
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-23"));
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-24"));
                            
            let wellness_resp =  new CompletedResponse(JSON.stringify(wellness), "application/json");
            spyOn(ph.wh, 'ListWellness').withArgs(userId).and.returnValue(wellness_resp);
                                            
            let actual_resp = (await ph.getWellnessPlot(url)).getMessage();
            actual_resp = JSON.parse(actual_resp);
            expect(actual_resp.timeSeriesWellness.length).toEqual(4);
        });
        it("test getWellnessPlot with an invalid metric", async () => {
            const userId = generateShortUUID();
            const wellnessId = generateShortUUID();
            const url = `/${userId}/plot/?metric=inspiration&startDate=2023-11-20&numOfDays=3`
                                                   
            let wellness = [];
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-20"));
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-21"));
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-22"));
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-23"));
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-24"));
                            
            let wellness_resp =  new CompletedResponse(JSON.stringify(wellness), "application/json");
            spyOn(ph.wh, 'ListWellness').withArgs(userId).and.returnValue(wellness_resp); 
            let resp = await ph.getWellnessPlot(url)    
            expect(resp.getCode()).toBe(400);         
        });
        it("test getWellnessPlot with an invalid number of days", async () => {
            const userId = generateShortUUID();
            const wellnessId = generateShortUUID();
            const url = `/${userId}/plot/?metric=hydration&startDate=2023-11-20&numOfDays=33`
                                                   
            let wellness = [];
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-20"));
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-21"));
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-22"));
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-23"));
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-24"));
                            
            let wellness_resp =  new CompletedResponse(JSON.stringify(wellness), "application/json");
            spyOn(ph.wh, 'ListWellness').withArgs(userId).and.returnValue(wellness_resp);
            let resp = await ph.getWellnessPlot(url)        
            expect(resp.getCode()).toBe(400);               
        });
        it("test getWellnessPlot with an invalid startDate", async () => {
            const userId = generateShortUUID();
            const wellnessId = generateShortUUID();
            const url = `/${userId}/plot/?metric=sleep&startDate=2023-11-49&numOfDays=2`
                                                   
            let wellness = [];
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-20"));
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-21"));
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-22"));
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-23"));
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-24"));
                            
            let wellness_resp =  new CompletedResponse(JSON.stringify(wellness), "application/json");
            spyOn(ph.wh, 'ListWellness').withArgs(userId).and.returnValue(wellness_resp);
            let resp = await ph.getWellnessPlot(url)        
            expect(resp.getCode()).toBe(400);               
        });
        it("test getWellnessPlot with no wellness entries recorded for that user", async () => {
            const userId = generateShortUUID();
            const wellnessId = generateShortUUID();
            const url = `/${userId}/plot/?metric=sleep&startDate=2023-11-49&numOfDays=2`
                                                   
            let wellness = [];
                            
            let wellness_resp =  new CompletedResponse(JSON.stringify(wellness), "application/json");
            spyOn(ph.wh, 'ListWellness').withArgs(userId).and.returnValue(wellness_resp);
            let resp = await ph.getWellnessPlot(url)        
            expect(resp.getCode()).toBe(400);      
            expect(wellness.length).toEqual(0);         
        });
        it("test getWellnessPlot with an empty URL", async () => {
            const userId = generateShortUUID();
            const wellnessId = generateShortUUID();
            const url = '';
                                                   
            let wellness = [];
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-20"));
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-21"));
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-22"));
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-23"));
            wellness.push(generateRandomWellness(userId, wellnessId, "2023-11-24"));
                            
            let wellness_resp =  new CompletedResponse(JSON.stringify(wellness), "application/json");
            spyOn(ph.wh, 'ListWellness').withArgs(userId).and.returnValue(wellness_resp);
            let resp = await ph.getWellnessPlot(url)        
            expect(resp.getCode()).toBe(400);               
        });
        

    });

});
