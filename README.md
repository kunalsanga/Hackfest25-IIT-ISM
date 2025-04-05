# Sentivent - Social Media Sentiment Analysis Dashboard

Sentivent is a modern dashboard application that provides real-time sentiment analysis and monitoring of social media interactions across multiple platforms including Twitter, Instagram, and email communications.

## Preview

### Welcome Screen
![Welcome Screen](public/welcome.png)

### Dashboard
![Dashboard Preview](public/dashboard.png)

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