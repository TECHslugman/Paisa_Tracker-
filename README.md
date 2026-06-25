💰 Paisa Tracker
Paisa Tracker is a comprehensive personal finance management application designed to provide users with clear insights into their spending habits, budget projections, and transaction history. Built to simplify financial tracking, it combines manual entry with intelligent data analysis.

🚀 Features
Dashboard Overview: Real-time summary of today’s spending, weekly averages, and monthly budget progress.

Financial Projections: Predictive analytics to show where your budget will stand at the end of the month based on current trends.

Transaction Management: Add, view, and manage your financial records manually (with future support for automated SMS parsing).

Largest Expense Tracking: Automatically highlight and identify your biggest monthly financial commitments.

Secure Authentication: JWT-based secure user authentication ensuring your financial data stays private.

🛠 Technical Stack
Frontend: React Native (Expo), Expo Router, Zustand, Fetch API.

Backend: Node.js & Express.js.

Database: MongoDB & Mongoose.

UI/UX: StyleSheet with custom iconography via lucide-react-native.

📖 How It Came To Be
Paisa Tracker was born out of a need for a localized, simplified finance tool. Often, complex banking apps are cluttered with unnecessary features. The goal here was to create a "zero-distraction" interface that focuses strictly on the user's cash flow, helping them make better financial decisions through simple, actionable data.

🔮 Future Scope
Automated SMS Parsing: Integration of background tasks to automatically read transaction notifications.

Data Visualization: Enhanced charts and graphs using Victory Native for better budget visualization.

Multi-Account Support: Ability to track different bank accounts or wallets separately.

Export Capabilities: CSV/PDF export for monthly financial reporting.

🚀 Getting Started
Prerequisites
Node.js (v18+)

MongoDB Atlas or local MongoDB instance

Expo Go

Installation & Setup
Clone the repository:

Bash
git clone https://github.com/yourusername/paisa-tracker.git
Setup Server:

Bash
cd server
npm install
# Create a .env file with your PORT and MONGO_URI
npm start
Setup Frontend:

Bash
cd frontend
npm install
# Create a .env file in the frontend folder:
# EXPO_PUBLIC_API_URL=http://<YOUR_IP_ADDRESS>:3000/api
npx expo start
🤝 Contribution
Contributions are welcome! Please feel free to open a Pull Request for any improvements or bug fixes.

Built with passion for better financial literacy.
