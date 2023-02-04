# CityBike App
About
This is a basic app for showing bike trips and some statistics about bike stations. It was done based on a pre-assignment challenge from Solita, and Solita supplied the journey and station data.
I made the decision to use NodeJS and Express for the backend due to the ease of the calculations and the vast amount of records and data and ReactJS for the frontend. 
Additionally, I think MongoDB is a great choice for a database because in reality, the information for the journeys and stations for this app is not related to each other.

# Backend
As previously noted, the backend is built on NodeJS, Express, and MongoDB, with the Mongoose module.
The CSV files is obtained and read by the backend. Verify the validity of the records. Trips must extend farther than 10 meters and last longer than 10 seconds in order to be valid. Duplication check is also added for checking trips since users upload files, and if a file is uploaded several times, it leads to duplicate entries and renders statistical analysis meaningless. However, turning on this option significantly slows down processing of data.
The station's recordings are simply checked for duplication, which is optional but strongly advised.

## Prerequisite 
If you want to run the backend server locally, you must have Node 18.12.1 and npm installed on your machine. The versions mentioned above are based on the version I have on my computer.<br/>
You can also use the cloud backend server with the following address:
```
https://city-bike-ynfd.onrender.com/
```
Which is available until the end of February 2023.

##### Database	
If you wnat to run the server locally, You also require a MongoDB database as well, though Claude platforms are another alternative. You could configure the connections URI and authentication for the database in the ./utils/config.js file.

## Run
To run the server in production mode, you can use:
```
> npm start 
```
The server runs on port 3005 by default. The port can be changed by editing the ./utils/config.js file.
### Uploading Trips data.
if you run the server locally, It is possible to upload trips using a CSV file with a "," separator.
CSV data should follow the format shown below. The first row was also ignored by the program and treated as a headline.
```
Departure,Return,Departure station id,Departure station name,Return station id,Return station name,Covered distance (m),Duration (sec.)
```

The file should be sent as post method the address:
```
URI: /api/files/trip
Method: Post
Parameter ( ‘file’ , formData.DuplicationCheck ) 
```
* The file path and file name are necessary.
* The duplicate check option is the second parameter, and it is a Boolean value and it is optional. if it is omitted, is considered true.
##### Note: 
It is advised to keep the duplication check option turned on if the file has not been examined and you are unsure whether the data are free of duplicates. You can make this option inactive by passing the value "false" as a formData.duplicationCheck parameter.

Successful Response:  
```
code: 200     body: (data in json format)
 { totalRecords,
   inValidRecords,
   addRecordeToDatabse,
   shortTrip,
   quickTrip,
   dublicatedRecord
 }
```

### Uploading Stations data.
It is possible to upload station using a CSV file with a "," separator.
CSV data should follow the format shown below. The first row was also ignored by the program and treated as a headline.
```
FID;ID;Nimi;Namn;Name;Osoite;Adress;Kaupunki;Stad;Operaattor;Kapasiteet;x;y
````
The file should be sent as post method the address:
````
URI: /api/files/station
Method: Post
Parameter ( ‘file’ , formData.DuplicationCheck ) 
````
* The file path and file name are necessary.
* The duplicate check option is the second parameter, and it is a Boolean value and it is optional. if it is omitted, is considered true.
##### Note:
It is advised to keep the duplication check option turned on if the file has not been examined and you are unsure whether the data are free of duplicates. You can make this option inactive by passing the value "false" as a formData.duplicationCheck parameter.

Successful Response:  
```
code: 200     body: (data in json format)
 { totalRecords,
   inValidRecords,
   addRecordeToDatabse,
   dublicatedRecord
 }
```

### Reading Trips data
The data processing, filtering, and pagination are done on the backend because there are too many records for the trips and to prevent excessive data transmission between the backend and frontend. Therefore, the page, row per page, and filter parameters should be passed to the get method.

```
URI: /api/trips
Method: get
Parameter (/:page/:rowsPerPage, requestQuery  ) 
```
##### Note:
It gets the request parameters page and rows per page in the format /:page/:rowsPerPage as well as filter parameters inside the request query In Json format. 
Filter data:
```
{ originStation : ( the start station of the trip) ,
destinationStation:  (the end station of the trip),
start: (the date the trip started),
end: (the time the trip ended),
durationFrom: (the minimum for the duration)
durationTo: (the maximum for duration)
distanceFrom: (the minimum for distance)
distanceTo: (the maximum for distance)
}
```
Successful Response:  
```
code: 200     body: (trips data in json format)
```
### Reading Stations data
Because there aren't many records for the stations, we process and filter the data for them on the front end so that we can generate a quicker response.
```
URI: /api/stations
Method: get
Parameter: none
```
Successful Response:  
```
code: 200     body: (trips data in json format)
```
### Reading info and statistic for one station
```
URI: /api/stations/:sid
Method: get
Parameter: sid (Station ID)
```
Successful Response:  
```
code: 200     body: (Station info and Statistic data in json format)
```
## Test Backend
I use Jest and the supertest package to test the backend. Test makes use of the "test-city-bike" database.
because Linux is the development environment in the script, I just defined the mode. Use the  cross-env library if you want to work in the Windows environment.
To run the test use: 
```
>npm test
```
##### Test 1. file processing 
✓ Trip file with correct format is converted to trip model     
✓ Only valid trips add to the database     
✓ Duplicate trips would not be added to the database    
✓ Station file with correct format is converted to trip model    
✓ Only valid stations add to the database    
✓ Duplicate stations would not be added to the database  
##### Test 2. rest-api
  **Receive trips**     
	✓ trips are returned as json      
	✓ Return All Trips 	<br/>
	✓ Pagination test     
	✓ Test Filter  					
    
**Receive Stations**  
✓ Stations are returned as json    
✓ Return all stations 
