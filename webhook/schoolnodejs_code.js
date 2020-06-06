/* 
Team TechApetite - Project Eurobot
*/

/*variable initialize*/
var request = require("request-promise");
const DiscoveryV1 = require("watson-developer-cloud/discovery/v1");
/*const {IamAuthenticator}  = require("ibm-watson/auth");*/
 

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/*Main function*/
async function main(params) {
    
    /* start - For covid stats connect to api.covid19 website*/
    if (params.type === "API") {
        const summary = await request({
        method: "GET",
        uri: "https://api.covid19api.com/summary",
        json: true,
      });

      
      let location= 'india'
      for (var i = 0; i < summary.Countries.length; i++) {
          if (
            summary.Countries[i].Country.toLowerCase() ===
              location.toLowerCase() ||
            summary.Countries[i].CountryCode.toLowerCase() ===
              location.toLowerCase()
          ) {
            return {
              result: `Total Cases: ${summary.Countries[i].TotalConfirmed}\nTotal Deaths: ${summary.Countries[i].TotalDeaths}\nTotal Recovered: ${summary.Countries[i].TotalRecovered}\n\nSource: Johns Hopkins CSSE`,
            };
          }
      }

    }
    /* End - For covid stats connect to api.covid19 website*/
    
    /* start - For students data extraction */
  	const discovery = new DiscoveryV1({
      version: "2019-04-30",
      iam_apikey: params.api_key,
      url: params.url,
    });
    
    
    const offset = getRandomInt(50);
    
    let inputpara = params.grid;
    
    const queryParams = {
      environment_id: params.env_id,
      collection_id: params.collection_id,
      config_id:params.config_id,
      /*natural_language_query:"",*/
      natural_language_query: inputpara.toString(),
     
    };
    
    data = await discovery.query(queryParams);
    
    /* if GRID do not exists in database report an error */
    if (data.matching_results===0 )
    {
            return { result: "GRID not found. Please enter a valid GRID to help you with details." };
    }; 
    
    /* if data matching to GRID exists then return the details */
    let studentname = data.results[0].name;
    let studentrollno = data.results[0].rollno;
    let studentclass = data.results[0].currentacad;
    let studentbooks = data.results[0].bookscollection;
    
    return {
        result: `\ngrid value:${inputpara}\nname: ${studentname}\nRollNo: ${studentrollno}\nCurrent Academic Year: ${studentclass}\nBooks collection: ${studentbooks}`,
      };

    /* End - For students data extraction */
  
}
