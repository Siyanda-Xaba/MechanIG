# MechanIQ – Dashboard Warning Light Scanner API

## Overview

The MechanIQ Dashboard Warning Light Scanner is a Node.js backend service that analyses vehicle dashboard images to identify warning-light symbols.

It uses a hosted computer vision model from Roboflow to detect possible warning lights. The backend then matches the detected symbols against a local warning-light catalogue and returns information to the application.

The purpose of this feature is to help vehicle owners better understand dashboard warning lights, their possible meanings and the actions they may need to take.

This service is a separate feature from MechanIQ's OBD-II diagnostic scanner and Python-based sound detection system.

## Features

- Accepts dashboard images through an API endpoint.
- Uses Roboflow for image-based warning-light detection.
- Identifies supported dashboard warning-light classes.
- Matches detected symbols with a local warning-light catalogue.
- Provides explanations, possible causes and recommended actions.
- Includes urgency levels and safety advice.
- Returns confidence scores from the detection model.
- Handles unknown warning-light classes without generating unverified explanations.
- Includes automated tests for the response formatter.

## Technologies Used

| Technology          | Purpose                         |
| ------------------- | ------------------------------- |
| Node.js             | Backend runtime                 |
| Express.js          | API and routing                 |
| Roboflow            | Dashboard image detection       |
| Multer              | Image uploads                   |
| dotenv              | Environment variable management |
| Node.js Test Runner | Automated testing               |

## Project Structure

```text
dashboard-scanner/
│
├── data/
│   └── warningLights.js
│
├── middleware/
│   └── uploadMiddleware.js
│
├── routes/
│   └── scannerRoutes.js
│
├── services/
│   ├── roboflowService.js
│   └── responseFormatter.js
│
├── tests/
│   └── responseFormatter.test.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## Requirements

Before running the project, make sure you have:

- Node.js installed (Node.js 20 LTS or later recommended).
- npm installed.
- A Roboflow API key with access to the configured model.

## Installation

**1. Clone the repository**

```bash
git clone YOUR_REPOSITORY_URL
```

**2. Navigate into the project**

```bash
cd dashboard-scanner
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env` file in the root directory:

```env
PORT=3001
ROBOFLOW_API_KEY=your_roboflow_api_key
```

Replace `your_roboflow_api_key` with your own Roboflow API key.

Do not commit your `.env` file or share your API key publicly.

## Running the API

Start the development server:

```bash
npm run dev
```

Alternatively, run the server normally:

```bash
npm start
```

The API will run locally at:

```text
http://localhost:3001
```

To check whether the server is running, open:

```text
http://localhost:3001/
```

A successful response should look like:

```json
{
  "success": true,
  "message": "MechanIQ Dashboard Warning Light Scanner API is running."
}
```

## API Endpoint

### Scan Dashboard Image

**Endpoint**

```http
POST /api/scanner/scan
```

**Request type**

```text
multipart/form-data
```

**Required field**

| Field | Type | Description                    |
| ----- | ---- | ------------------------------ |
| image | File | Dashboard image to be analysed |

Supported image formats:

- JPEG
- PNG
- WebP

Maximum upload size: 5 MB.

### Example Request

Using curl:

```bash
curl -X POST http://localhost:3001/api/scanner/scan \
  -F "image=@dashboard.jpg"
```

### Example Response

The API returns a JSON response containing the detected warning lights and their explanations.

```json
{
  "success": true,
  "message": "Dashboard image analysed successfully.",
  "totalDetections": 1,
  "detections": [
    {
      "detectedLabel": "Check Engine",
      "title": "Check Engine Light",
      "meaning": "Indicates that the vehicle's engine management system has detected a possible issue.",
      "possibleCauses": [],
      "recommendedAction": "Have the vehicle checked by a qualified mechanic.",
      "urgency": "High",
      "safetyAdvice": "Pay attention to how the vehicle behaves and seek professional assistance.",
      "confidence": 0.95,
      "explanationAvailable": true
    }
  ]
}
```

_The example is illustrative. Actual explanations, confidence scores and detections depend on the uploaded image and model response._

## Warning Light Catalogue

The backend maintains a local catalogue of supported warning-light classes in:

```text
data/warningLights.js
```

The catalogue provides information such as:

- Warning-light title.
- Meaning of the symbol.
- Possible causes.
- Recommended action.
- Urgency level.
- Safety advice.

When the model identifies a class that is not in the catalogue, the API returns an unknown-symbol message instead of presenting an unverified explanation.

## Testing

The project uses the built-in Node.js test runner.

Run the automated tests using:

```bash
npm test
```

The current test suite checks:

1. Formatting a recognised warning light.
2. Handling the ESP class returned by Roboflow.
3. Handling unknown warning-light classes.
4. Handling images where no warning lights are detected.
5. Rejecting invalid Roboflow responses.

## Important Notes and Limitations

- Detection results depend on image quality, lighting, camera angle and the model's training data.
- A confidence score represents the model's prediction confidence; it does not guarantee that a detection is correct.
- Not every vehicle dashboard symbol is necessarily supported.
- The scanner provides general information and is not a replacement for a vehicle manual, qualified mechanic or professional vehicle diagnosis.
- If a red warning light indicates a potentially serious issue, the driver should stop safely when appropriate and consult the vehicle manual or a qualified professional.
- The Roboflow service requires an internet connection and a valid API key.
- API usage may be subject to Roboflow's pricing and usage limits.

## Security

- API keys are stored in environment variables.
- The `.env` file must be excluded from version control.
- Image uploads are restricted by file type and size.
- The Roboflow API key is used by the backend and should never be exposed in the React Native application.

## Future Improvements

- Connect the API to the MechanIQ React Native application.
- Add image resizing and compression before upload.
- Improve image validation and upload security.
- Expand and verify the warning-light catalogue.
- Improve handling of low-confidence detections.
- Add integration tests for the
