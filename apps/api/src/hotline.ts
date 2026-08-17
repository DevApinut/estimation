export interface HotlineInput {
  regularDays:number; regularRate:number; holidayDays:number; holidayRate:number;
  hotstickDays:number; hotstickRate:number; bucket2233Days:number; bucket2233Rate:number;
  bucket115Days:number; bucket115Rate:number; waterTruckDays:number; waterTruckRate:number;
  allowanceDays:number; allowanceRate:number; lodgingDays:number; lodgingRate:number;
  hotstickKm:number; hotstickFuelPrice:number; bucketKm:number; bucketFuelPrice:number;
  bucketWaterKm:number; bucketWaterFuelPrice:number; waterTruckKm:number; waterTruckFuelPrice:number;
}

const round=(value:number)=>Math.round((value+Number.EPSILON)*100)/100;

export function calculateHotline(input:HotlineInput){
  const regularLabor=input.regularDays*input.regularRate;
  const holidayLabor=input.holidayDays*input.holidayRate;
  const hotstickTool=input.hotstickDays*input.hotstickRate;
  const bucket2233=input.bucket2233Days*input.bucket2233Rate;
  const bucket115=input.bucket115Days*input.bucket115Rate;
  const waterTruckTool=input.waterTruckDays*input.waterTruckRate;
  const laborTotal=regularLabor+holidayLabor;
  const toolTotal=hotstickTool+bucket2233+bucket115+waterTruckTool;
  const miscellaneous=(laborTotal+toolTotal)*0.05;
  const operation=(laborTotal+toolTotal+miscellaneous)*0.075;
  const allowance=input.allowanceDays*input.allowanceRate;
  const lodging=input.lodgingDays*input.lodgingRate;
  const hotstickVehicle=input.hotstickKm*input.hotstickFuelPrice*1;
  const bucketVehicle=input.bucketKm*input.bucketFuelPrice*2;
  const bucketWaterVehicle=input.bucketWaterKm*input.bucketWaterFuelPrice*2.2;
  const waterTruckVehicle=input.waterTruckKm*input.waterTruckFuelPrice*1;
  const staffTotal=allowance+lodging;
  const vehicleTotal=hotstickVehicle+bucketVehicle+bucketWaterVehicle+waterTruckVehicle;
  const grossProfit=(laborTotal+toolTotal+miscellaneous+operation+staffTotal+vehicleTotal)*0.30;
  const total=regularLabor+holidayLabor+hotstickTool+bucket2233+bucket115+waterTruckTool+miscellaneous+operation+allowance+lodging+hotstickVehicle+bucketVehicle+bucketWaterVehicle+waterTruckVehicle+grossProfit;
  return {rows:{regularLabor:round(regularLabor),holidayLabor:round(holidayLabor),hotstickTool:round(hotstickTool),bucket2233:round(bucket2233),bucket115:round(bucket115),waterTruckTool:round(waterTruckTool),miscellaneous:round(miscellaneous),operation:round(operation),allowance:round(allowance),lodging:round(lodging),hotstickVehicle:round(hotstickVehicle),bucketVehicle:round(bucketVehicle),bucketWaterVehicle:round(bucketWaterVehicle),waterTruckVehicle:round(waterTruckVehicle),grossProfit:round(grossProfit)},total:round(total)};
}
