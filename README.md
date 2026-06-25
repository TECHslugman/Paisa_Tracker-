# Paisa Tracker

Paisa Tracker is a personal finance management application designed to give users clear visibility into their spending habits, budget projections, and transaction history. Built with simplicity in mind, it combines manual transaction entry with intelligent data analysis to support better financial decision-making.

---

## Features

**Dashboard Overview**
Real-time summary of today's spending, weekly averages, and monthly budget progress displayed through a clean, distraction-free interface.

**Financial Projections**
Predictive analytics that estimate end-of-month budget standing based on current daily spending trends.

**Transaction Management**
Add, view, edit, and delete financial records manually, with future support for automated SMS parsing.

**Largest Expense Tracking**
Automatic identification and highlighting of the user's biggest monthly financial commitments.

**Secure Authentication**
JWT-based user authentication ensuring all financial data remains private and user-scoped.

---

## Technical Stack

| Layer       | Technology                                      |
|-------------|--------------------------------------------------|
| Frontend    | React Native (Expo), Expo Router, Zustand        |
| Backend     | Node.js, Express.js                             |
| Database    | MongoDB, Mongoose                               |
| UI          | React Native StyleSheet, lucide-react-native    |
| HTTP Client | Fetch API                                       |

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB Atlas account or a local MongoDB instance
- Expo Go installed on a physical device or emulator

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/paisa-tracker.git
cd paisa-tracker
```

**2. Set up the server**

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

Start the server:

```bash
npm start
```

**3. Set up the frontend**

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
EXPO_PUBLIC_API_URL=http://<YOUR_IP_ADDRESS>:3000/api
```

Start the Expo development server:

```bash
npx expo start
```

---

## Background

Paisa Tracker was developed in response to a gap in localized, lightweight finance tooling. Most banking applications are feature-heavy and visually cluttered, making day-to-day financial awareness harder than it needs to be. The goal of this project was to create a focused interface that presents only what matters — cash flow — enabling users to make informed financial decisions through simple, actionable data.

---

## Roadmap

- **Automated SMS Parsing** — Background task integration to automatically read and parse transaction notifications from banking SMS messages.
- **Data Visualization** — Enhanced charts and graphs using Victory Native for richer budget visualization.
- **Multi-Account Support** — Ability to track multiple bank accounts or digital wallets independently.
- **Export Capabilities** — CSV and PDF export for monthly financial reporting and record-keeping.

---

## Contributing

Contributions are welcome. Please open a pull request for any improvements or bug fixes, and ensure changes are well-documented before submission.

---

*Built with a focus on financial literacy and simplicity.*
