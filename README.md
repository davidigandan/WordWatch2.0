# WordWatch2

WordWatch2 is a web application developed using Node.js and Express.js, with the frontend rendered in EJS. It provides a platform for conducting audio analysis on YouTube videos by making REST API calls to Azure Cognitive Services' Speech Service. The project is constantly evolving and aims to offer a wide range of features for audio content analysis and collaboration.

## Demo

Check out the live demo at [www.wordwatch.azurewebsites.net](https://www.wordwatch.azurewebsites.net/)

## Features

- **Transcription:** Current functionality includes automatic audio transcription from YouTube videos.
- **Improved Security:** Enhanced security measures will be implemented to protect user data and API credentials.
- **Keyword Extraction:** Upcoming feature for extracting keywords from the transcribed content.
- **Sentiment Analysis:** Analyzing the sentiment of the transcribed text.
- **Language Detection:** Detecting the language of the transcribed text.
- **Emotion Analysis:** Analyzing emotions expressed in the audio content.
- **Content Summarization:** Summarizing the transcribed content for quick insights.
- **Analysis Collaboration Dashboard:** A dashboard for collaboration on analyzed content.
- **Content Moderation:** Moderation features to ensure content compliance.
- **Content Recommendation:** Recommending related content based on analysis results.
- **YouTube Comments Analysis:** Analyzing comments related to the YouTube video.
- **Filtering Tools:** Tools for filtering and organizing analysis results.
- **User Accounts:** User account management and authentication.
- **Analysis Collaboration Between Users:** Collaborative analysis features for multiple users.
- **Data Export:** Exporting analysis results and data for further use.

## Installation

To run WordWatch2 locally, follow these steps:

1. Clone this repository to your local machine.
2. Install the required dependencies using npm or yarn:

   ```bash
   npm install
   # or
   yarn install
   
This command will install all the necessary project dependencies based on the package.json file.

Create a .env file and configure your Azure Cognitive Services API credentials and other environment variables:

Create a file named .env in the root directory of the project. Add your Azure Cognitive Services API credentials and other required environment variables to this file. For example:
```
AZURE_SPEECH_SERVICE_KEY=your_api_key
AZURE_SPEECH_SERVICE_REGION=your_region
# Add other environment variables as needed
```
Start the server using 

```bash
npm start
```
or 
```bash
yarn run
```

This command will launch the Node.js server, and you can access the application in your web browser by navigating to http://localhost:3000. Feel free to use any other port number of your choosing, though you'll have to dig into the source code to configure it right. Look in the app.js file on line 14. Adjust the value of PORT to your desired port number.

# Comments
Comments and feedback to the WordWatch2 project are always welcome. You can contribute by opening an issue. 

#Acknowledgements
This project was inspired by Clement Mihelescu.

