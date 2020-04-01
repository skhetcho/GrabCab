
    export function farehelper(distance,time,rateDetails){
        //console.log('rateDetails', rateDetails)

        let ratePerKm = rateDetails.rate_per_kilometer;
        let ratePerHour = rateDetails.rate_per_hour;
        let ratePerSecond = ratePerHour/3600;
        let minFare =  rateDetails.min_fare

        //Calculation 
        let DistanceInKM = (distance/1000).toFixed(2);
        let estimateRateForKM =(DistanceInKM*ratePerKm).toFixed(2)*1;
        let estimateRateForhour = (time*ratePerSecond).toFixed(2);

        //if "estimateRateForKM + estimateRateForhour" is less than min_fare then base fare will be "minFare" else "estimateRateForKM + estimateRateForhour" will be base fare
        let total = (parseFloat(estimateRateForKM)+parseFloat(estimateRateForhour))>minFare?(parseFloat(estimateRateForKM)+parseFloat(estimateRateForhour)):minFare;

        let convenienceFee = (total*rateDetails.convenience_fees/100);
        //console.log('convenienceFee',convenienceFee,'total',total)
        let grandtotal = (total+convenienceFee)
        //console.log(grandtotal)
        let calculateData = {
            distaceRate:estimateRateForKM,
            timeRate:estimateRateForhour,
            totalCost:total,grandTotal:grandtotal,
            convenience_fees:convenienceFee}
            
        return calculateData
    }

  