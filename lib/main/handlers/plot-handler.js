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


class Plot {
    
    constructor(timeSeriesDistance, timeSeriesWeight){
        this.timeSeriesDistance = timeSeriesDistance;
        this.timeSeriesWeight = timeSeriesWeight;
    }
}

class TimeSeries {

    constructor(d, v, u){
        this.date = d;
        this.value = v;
        this.unit = u;

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
                    throw new ValidationExceptionO("Invalid start date");
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

                let result = new Plot(timeSeriesDistance, timeSeriesWeight);
                var string= JSON.stringify(result);
                return new CompletedResponse(string, 'application/json');

            } catch (error) {
                return handleError(error);
            }
        }

        async handle(req){
            return this.getExercisePlot(req.url);
        }
}


module.exports = {
    PlotHandler,
    Plot,
    TimeSeries,
}