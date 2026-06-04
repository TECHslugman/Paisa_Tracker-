# PAISA TRACKER — UPDATED CORE SPEC (agent.md)

## 📌 Overview

Paisa Tracker is a personal finance tracking application designed to automatically record and analyze user spending based on MPay (Bhutan National Bank) SMS notifications.

The system is built around **real bank SMS data**, making it future-proof for full automation (SMS parsing) while still supporting manual entry.

The goal is to eliminate manual expense tracking and provide clear financial visibility through structured transaction data.

---

## 🎯 Core Problem

The user makes frequent payments via MPay but struggles to track:

- Where money is going
- How much is spent daily/weekly/monthly
- Spending patterns over time

Manual tracking is unreliable and inconvenient.

---

## 💡 Solution Concept

Paisa Tracker captures financial transactions primarily from **MPay SMS messages**, converts them into structured data, and stores it in a local system.

The app then provides:

- Transaction history
- Spending summaries
- Category breakdowns (future)
- Financial insights (future)

---

## 📱 Core User Flow

### 1. App Launch
- User logs into Paisa Tracker
- Home screen initially shows no transactions if empty

---

### 2. Add Transaction (Manual Mode)

User can manually input transaction data for testing or fallback:

Fields:
- Amount
- Timestamp (auto-filled if not provided)
- Reference ID (auto-generated if missing)
- Currency (BTN)
- Optional merchant (not always available in SMS)
- Category (optional)

---

### 3. Transaction Storage

All transactions are stored in a structured format derived from SMS banking messages.

Each transaction is considered a **financial record derived from bank SMS data**, even if manually entered.

---

### 4. Transaction Page

Displays all transactions in a card/list format:

Example:
- KFC — BTN 250 — Food — 04-06-2026 13:36
- Taxi — BTN 120 — Transport — 04-06-2026 10:12

---

### 5. Home Dashboard

Displays aggregated spending insights:

- Total spent today
- Total spent this week
- Total spent this month

All values are computed from stored transaction data.

---

## 🧾 CORE DATA SOURCE (IMPORTANT)

The system is designed around MPay SMS format.

### Example SMS:

Dear Customer, your XXXXX4471 has been Debited by BTN 25.00 with ref:261553557 on 04-06-2026 at 01:36 PM. AC balance is BTN 2,404.11.

---

## 🧠 Extracted Transaction Fields

From each SMS, the system extracts:

### 1. Transaction Type
- Debited → Expense
- Credited → Income (future support)

---

### 2. Amount
- Numeric value (e.g., 25.00)
- Currency (BTN)

---

### 3. Reference ID
- Unique identifier (e.g., 261553557)
- Used for deduplication and tracking

---

### 4. Timestamp
- Date + time converted into standard format

---

### 5. Account Identifier
- Masked account number (e.g., last 4 digits: 4471)

---

### 6. Balance After Transaction (Optional)
- Remaining account balance after transaction

---

### 7. Raw SMS Storage
- Full original SMS is stored for auditing and future re-parsing

---

### 8. Merchant / Place
- Not available in SMS
- Can be manually added later or inferred in future versions

---

## 🧾 FINAL TRANSACTION DATA MODEL

Each transaction is stored in this structured format:

- id (unique identifier)
- raw_sms (original bank message)
- type (debit / credit)
- amount (numeric)
- currency (BTN)
- reference_id (unique bank reference)
- timestamp (standard datetime)
- account_last4 (masked identifier)
- balance_after (optional)
- merchant (optional)
- category (optional)
- source (mpay_sms or manual)

---

## 🧭 SYSTEM DESIGN PRINCIPLE

Paisa Tracker is built as a **SMS-driven financial data system**, not a manual expense tracker.

### Data Flow:

MPay SMS → Parsed Transaction → Database → UI → Analytics

---

## 📊 UI STRUCTURE CONCEPT

Bottom navigation layout:

- Home (Dashboard)
- Transactions (History)
- Add (+ Floating Action Button)
- Stats (Future analytics)
- Profile

---

## 🧠 DESIGN GOALS

- Minimize manual input
- Ensure SMS compatibility from the start
- Store raw financial truth (SMS) + structured data
- Enable future automation and AI integration
- Maintain simple and clean user experience

---

## 🔮 FUTURE EXTENSIONS (NOT PART OF CORE MVP)

- SMS auto-parsing engine
- Merchant detection system
- Category classification system
- AI financial assistant
- Spending predictions
- Budget recommendations
- Natural language queries over transactions

---

## 🚀 SUMMARY

Paisa Tracker is a SMS-driven personal finance system that converts MPay transaction messages into structured financial data, enabling users to track and understand their spending behavior with minimal manual input.

The system is designed to evolve from a simple tracker into a fully automated financial intelligence assistant.