# Sentivent - Social Media Sentiment Analysis Dashboard

Sentivent is a modern sentiment analysis dashboard designed for event organizers to bridge the communication gap between organizers and their audience. The platform provides real-time sentiment analysis and monitoring of social media interactions across multiple platforms including Twitter, Instagram, and email communications. The data for analysis is collected from recent user feedback and social media apps (Twitter, Instagram, LinkedIn).

## Preview

### Welcome Screen
![Welcome Screen](https://github.com/kunalsanga/Hackfest25-IIT-ISM/blob/83f3c481a7aa5657be90c9fc9886447ecc7e9e36/welcome.png)

### Dashboard
![Dashboard Preview](https://github.com/kunalsanga/Hackfest25-IIT-ISM/blob/d25d570f94b8e7d5a114ec900e3b9acf4b521a87/dashboard.png)

## Features

- **Real-time Sentiment Analysis**: Analyze customer feedback and social media interactions in real-time
- **Multi-platform Integration**: Monitor Twitter, Instagram, and email communications
- **AI-Powered Insights**: Get intelligent suggestions and recommendations using Gemini AI
- **Interactive Dashboard**: Beautiful and responsive UI with real-time data visualization
- **Priority Management**: Track and manage urgent issues with priority indicators
- **Performance Metrics**: Monitor key performance indicators across all platforms
- **Custom AI-Powered Sentiment Analysis**:
  - Advanced text processing using NLTK
  - Machine learning-based sentiment classification
  - Custom rule-based issue detection
  - TF-IDF vectorization for feature extraction
- **Multi-Source Data Collection**:
  - Survey response collection
  - Chat message analysis
  - JSON-based data storage
- **Comprehensive Analysis**:
  - Sentiment scoring (positive/negative/neutral)
  - Issue detection across multiple categories
  - Detailed feedback analysis
  - Summary statistics generation

## Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **AI Integration**: Google Gemini API
- **Styling**: Modern CSS with glassmorphic design
- **Animation**: Smooth transitions and hover effects
- **Responsive Design**: Mobile-first approach

## Dependencies

### Core Dependencies
* **React** (v18.2.0) - UI library for building the frontend
* **React DOM** (v18.2.0) - React rendering for web
* **Vite** (v5.1.6) - Next generation frontend tooling
* **Chart.js** (v4.4.8) - JavaScript charting library
* **React ChartJS 2** (v5.3.0) - React wrapper for Chart.js

### UI and Styling
* **React Icons** (v5.0.1) - Popular icon library for React
* **Tailwind CSS** - Utility-first CSS framework
* **@nivo/line** (v0.84.0) - Line chart component
* **@nivo/pie** (v0.84.0) - Pie chart component

### Backend and API
* **Express** (v4.18.2) - Web framework for Node.js
* **Mongoose** (v8.0.3) - MongoDB object modeling
* **Axios** (v1.6.8) - Promise based HTTP client
* **CORS** (v2.8.5) - Cross-Origin Resource Sharing
* **JSON Web Token** (v9.0.2) - JWT implementation
* **Bcryptjs** (v2.4.3) - Password hashing

### AI and Analysis
* **@google/generative-ai** (v0.24.0) - Google's Gemini AI API
* **Sentiment** (v5.0.2) - Sentiment analysis library

### Development Dependencies
* **ESLint** (v8.57.0) - JavaScript linter
* **ESLint React Plugin** (v7.34.1) - React specific linting rules
* **ESLint React Hooks Plugin** (v4.6.0) - React Hooks linting rules
* **Nodemon** (v3.1.9) - Auto-restarting Node.js application
* **Concurrently** (v8.2.2) - Run multiple commands concurrently
* **Dotenv** (v16.3.1) - Environment variable management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kunalsanga/Hackfest25-IIT-ISM.git
cd Hackfest25-IIT-ISM
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Gemini API key:
```
REACT_APP_GEMINI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── services/       # API and external service integrations
├── styles/         # CSS and styling files
├── App.jsx         # Main application component
└── index.jsx       # Application entry point
```

## Key Features in Detail

### 1. Social Media Monitoring
- Track Twitter tweets and Instagram queries
- Monitor email communications
- Real-time updates and notifications

### 2. Sentiment Analysis
- AI-powered sentiment analysis
- Priority-based issue tracking
- Trend visualization

### 3. Dashboard Features
- Interactive stat cards
- Real-time data updates
- Responsive design
- Beautiful animations

### 4. AI Integration
- Gemini AI-powered suggestions
- Automated issue prioritization
- Smart recommendations

### 5. Custom AI Model Architecture
#### 1. Sentiment Analysis Engine
- **Text Preprocessing**
  - Tokenization
  - Stopword removal
  - Text normalization
  - Feature extraction using TF-IDF

- **Sentiment Classification**
  - Logistic Regression model
  - Custom sentiment scoring system
  - Multi-class classification (positive/negative/neutral)

#### 2. Issue Detection System
- **Rule-Based Detection**
  - Technical issues
  - Content issues
  - Speaker issues
  - Venue issues
  - Schedule issues
  - Registration issues
  - Network issues
  - Audio issues
  - Video issues
  - Platform issues

- **Keyword-Based Analysis**
  - Custom keyword sets for each issue type
  - Context-aware issue detection
  - Priority-based issue scoring

### 6. System Workflow
1. **Data Collection**
   - Collect feedback from multiple sources
   - Store data in structured JSON format
   - Maintain feedback history

2. **Text Processing**
   - Clean and normalize text
   - Extract features using TF-IDF
   - Prepare data for analysis

3. **Analysis Pipeline**
   - Sentiment classification
   - Issue detection
   - Score calculation
   - Summary generation

4. **Results Generation**
   - Detailed analysis reports
   - Issue summaries
   - Sentiment trends
   - Actionable insights

### 7. API Endpoints
- `/analyze-feedback`: Full feedback analysis
- `/analyze-surveys`: Survey-specific analysis
- `/analyze-chats`: Chat message analysis
- `/analyze-text`: Single text analysis
- `/get-feedback`: Retrieve all feedback

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Gemini AI
- React.js community
- All contributors and supporters

## Contact

Kunal Sanga - [@kunalsanga](https://github.com/kunalsanga)

Project Link: [https://github.com/kunalsanga/Hackfest25-IIT-ISM](https://github.com/kunalsanga/Hackfest25-IIT-ISM)
