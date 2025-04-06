import { useState, useEffect, useRef } from 'react';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import blogTechEvent from '../assets/images/Blog-Tech-Events.jpg';
import conferenceImage from '../../conference.jpg';
import officeEventImage from '../../office event.jpg';
import hackathonImage from '../../hackathon.jpg';
import munImage from '../../mun.jpeg';
import sportsImage from '../../sports.jpeg';

// Sample event image placeholders (in production, these would come from your API/backend)
const myEventPlaceholder = 'https://placehold.co/600x400/2563eb/ffffff?text=My+Event';
const eventPlaceholders = [
  blogTechEvent,  // Using Blog-Tech-Events image for Event 1
  conferenceImage,  // Using conference image for Event 2
  officeEventImage,  // Using office event image for Event 3
  munImage,  // Using MUN image for Event 4
  sportsImage,  // Using sports/marathon image for Event 5
  hackathonImage,  // Using hackathon image for Event 9
];

// Event categories 
const eventCategories = [
  { id: 'upcoming', title: 'Upcoming Events' },
  { id: 'popular', title: 'Popular Events' },
  { id: 'recommended', title: 'Recommended for You' },
  { id: 'nearby', title: 'Nearby Events' },
];

const Home = ({ onNavigateToDashboard }) => {
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // Simulate loading events from an API
    // In a real application, you would fetch this data from your backend
    const simulateEventLoad = () => {
      const events = [...eventPlaceholders]
        .sort(() => Math.random() - 0.5)
        .map((img, index) => ({
          id: `recommended-${index}`,
          title: `Recommended Event ${index + 1}`,
          image: img,
          date: new Date(Date.now() + (Math.random() * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString(),
          location: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)]
        }));
      
      setRecommendedEvents(events);
    };

    simulateEventLoad();
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    
    const autoScroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        // Reset to start when reaching the end
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Scroll by one card width
        scrollContainer.scrollBy({ left: 270, behavior: 'smooth' });
      }
    };

    // Set up automatic scrolling every 3 seconds
    const interval = setInterval(autoScroll, 3000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [recommendedEvents]);

  const manualScroll = (direction) => {
    const scrollContainer = scrollContainerRef.current;
    const scrollAmount = 300; // Scroll by 300px
    
    if (scrollContainer) {
      if (direction === 'left') {
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to SENTIVENT</h1>
        <p>Manage and explore events with real-time sentiment analysis</p>
      </header>

      <section className="my-event-section">
        <h2>My Event</h2>
        <div className="my-event-card" onClick={onNavigateToDashboard}>
          <div className="event-image-container">
            <img src={myEventPlaceholder} alt="My Event" className="event-image" />
            <div className="event-overlay">
              <div className="event-details">
                <h3>SENTIVENT Conference 2023</h3>
                <p className="event-date">October 15-17, 2023</p>
                <p className="event-location">San Francisco Convention Center</p>
                <div className="event-stats">
                  <div className="stat">
                    <span className="stat-value">1,200+</span>
                    <span className="stat-label">Attendees</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">85%</span>
                    <span className="stat-label">Positive</span>
                  </div>
                </div>
                <button className="view-dashboard-btn">View Dashboard</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="events-section">
        <div className="section-header">
          <h2>Recommended Events</h2>
          <div className="scroll-controls">
            <button 
              onClick={() => manualScroll('left')}
              className="scroll-btn"
            >
              <FiChevronLeft />
            </button>
            <button 
              onClick={() => manualScroll('right')}
              className="scroll-btn"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="events-scroll-container auto-scroll"
        >
          {recommendedEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-image-container">
                <img src={event.image} alt={event.title} className="event-image" />
              </div>
              <div className="event-info">
                <h3>{event.title}</h3>
                <p className="event-date">{event.date}</p>
                <p className="event-location">{event.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 