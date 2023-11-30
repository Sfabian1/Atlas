const { Handler } = require("../handlers/handler.js");
const { isValidDateFormat, ValidateDateFormat } = require("../constants/enumConstants");
const { ValidationException, AccessDeniedException } = require("../util/exceptions");
const { getURLParameters, getUserID } = require("../util/util.js");
const { SetHandler } = require("./set-handler");
const { handleError } = require("../util/error-handler.js");
const {validateAndConvertId} = require("../../main/util/util.js");
const moment = require('moment');
const { MOMENT_DATE_FORMAT } = require("../constants/server-constants.js");
const { CompletedResponse } = require("../util/response.js");
const { WellnessHandler } = require("./WellnessHandler");


class ExercisePlot {
    
    constructor(timeSeriesDistance, timeSeriesWeight){
        this.timeSeriesDistance = timeSeriesDistance;
        this.timeSeriesWeight = timeSeriesWeight;
    }
}

class WellnessPlot{

    constructor(timeSeriesWellness){
        this.timeSeriesWellness= timeSeriesWellness;
    }
}

class TimeSeries {

    constructor(d, v, u){
        this.date = d;
        this.value = v;
        this.unit = u;

    }

}

class WellnessTimeSeries{
    constructor(d,v){
        this.date = d;
        this.value = v;
    }
}

class PlotHandler extends Handler {

    sh = new SetHandler();
    async getExercisePlot(url) {
            try {
                if( url == null || url.length == 0)
                    throw new ValidationException("URL is null or empty");
                let userID = validateAndConvertId(getUserID(url));
                let startDate = moment(getURLParameters(url, "startDate"), MOMENT_DATE_FORMAT);
                let numOfDays = Number(getURLParameters(url, "numOfDays"));
                let exerciseID = validateAndConvertId(getURLParameters(url, "exerciseId"));
                if(startDate == NaN || !startDate.isValid()){
                    throw new ValidationException("Invalid start date");
                }
                
                if(numOfDays < 0 ){
                    throw new ValidationException("Number of days must be greater or equal to 0");
                }

                let list_set_resp = await this.sh.ListSets(userID);
                if(list_set_resp.getCode() != 200){
                    throw new AccessDeniedException(`Unable to get sets for user $[userID}`);
                }
                let sets = JSON.parse(list_set_resp.getMessage());
        
                if(sets.length <= 0)
                    throw new ValidationException(`No sets exist within the given range of ${startDate} and ${endDate}`); 

                const timeSeriesWeight = [];
                const timeSeriesDistance = [];
                let endDate = startDate.clone().add(numOfDays, 'days');
               
                await sets.filter(set => set.exerciseID == exerciseID)
                    .filter(set =>{
                       return moment(set.Date, MOMENT_DATE_FORMAT).isBetween(startDate, endDate, 'days', '(]')
                    })
                    .forEach(set => {
                        if(set.weight != null){
                           timeSeriesWeight.push( new TimeSeries(set.Date, Number(set.weight), set.weight_metric));
                        }

                        if(set.distance != null){
                            timeSeriesDistance.push(new TimeSeries(set.Date, Number(set.distance), set.distance_metric));
                        }
                        //TO-DO add time
                       // console.log(timeSeriesWeight);
                    });
                let result = new ExercisePlot(timeSeriesDistance, timeSeriesWeight);
                var string= JSON.stringify(result);
                return new CompletedResponse(string, 'application/json');

            } catch (error) {
                return handleError(error);
            }
        }
        wh = new WellnessHandler();
        async getWellnessPlot(url) {
            try {
                if (url == null || url.length == 0) {
                    throw new ValidationException("Url is empty");
                }
                let userID = validateAndConvertId(getUserID(url));
                let startDate = moment(getURLParameters(url, "startDate"), MOMENT_DATE_FORMAT);
                let numOfDays = Number(getURLParameters(url, "numOfDays"));
                let metric = String(getURLParameters(url, "metric"));
        
                const validMetrics = ["mood", "sleep", "stress", "motivation", "hydration", "soreness"];
                if (!validMetrics.includes(metric)) {
                    throw new ValidationException("Bad Request: Invalid Metric");
                }
                if (isNaN(startDate) || !startDate.isValid()) {
                    throw new ValidationException("Invalid start date");
                }
                if (numOfDays < 0)  {
                    throw new ValidationException("Number of days must be greater or equal to 7");
                }
                if (numOfDays > 30)  {
                    throw new ValidationException("Number of days must be less than or equal to 30");
                }
        
                let list_wellness_resp = await this.wh.ListWellness(userID); 
                if (list_wellness_resp.getCode() !== 200) {
                    throw new AccessDeniedException(`Unable to get wellness for user ${userID}`);
                }
            
                let wellness = JSON.parse(list_wellness_resp.getMessage());

                let endDate = startDate.clone().add(numOfDays, 'days');


                if (wellness.length <= 0) {
                    throw new ValidationException(`No wellness entrires exist within the date range of ${startDate} and ${endDate}`);
                }
        
                const timeSeriesWellness = [];
            

                await wellness
                .filter(wellness => wellness.user_id == userID)
                .filter(wellness => moment(wellness.date, MOMENT_DATE_FORMAT).isSameOrAfter(startDate, 'days') && moment(wellness.date, MOMENT_DATE_FORMAT).isSameOrBefore(endDate, 'days'))
                //.filter(wellness => moment(wellness.date, MOMENT_DATE_FORMAT).isBetween(startDate, endDate, 'days', '[]'))
                .forEach(wellness => {
                    let value;
                    switch (metric) {
                        case "mood":
                            value = wellness.mood;
                            break;
                        case "sleep":
                            value = wellness.sleep;
                            break;
                        case "stress":
                            value = wellness.stress;
                            break;
                        case "motivation":
                            value = wellness.motivation;
                            break;
                        case "hydration":
                            value = wellness.hydration;
                            break;
                        case "soreness":
                            value = wellness.soreness;
                            break;
                        default:
                            throw new ValidationException(`Invalid metric: ${metric}`);
                    }
                    timeSeriesWellness.push(new WellnessTimeSeries(wellness.date, value));
                });

                let result = new WellnessPlot(timeSeriesWellness);
                let string = JSON.stringify(result);
                return new CompletedResponse(string, 'application/json');
            } catch (error) {
                return handleError(error);
            }
        }
        

        async handle(req){
            if(req.url.includes("exerciseId")){
                return this.getExercisePlot(req.url);
            }else{
                return this.getWellnessPlot(req.url);
            }
        }
}


module.exports = {
    PlotHandler,
    ExercisePlot,
    TimeSeries,
    WellnessTimeSeries,
}