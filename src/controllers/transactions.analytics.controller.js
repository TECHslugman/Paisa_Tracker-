const Transaction = require('../models/transaction.model');
const mongoose = require('mongoose');

exports.getHomeSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();
        
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 7);
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const allDebits = await Transaction.find({
            user: userId,
            type: 'debit',
            timestamp: { $gte: startOfMonth }
        }).sort({ timestamp: -1 });

        // console.log("Fetched transactions:", allDebits.length);

        // 1. Safe Today Calculation
        const todayData = allDebits.filter(t => new Date(t.timestamp) >= startOfToday);
        const today = {
            amount: todayData.reduce((sum, t) => sum + (t.amount || 0), 0),
            transactionCount: todayData.length,
            transactionIds: todayData.map(t => t._id)
        };

        // 2. Safe Week Calculation
        const weekData = allDebits.filter(t => new Date(t.timestamp) >= startOfWeek);
        const week = {
            amount: weekData.reduce((sum, t) => sum + (t.amount || 0), 0),
            transactionCount: weekData.length,
            averagePerDay: (weekData.reduce((sum, t) => sum + (t.amount || 0), 0) / 7).toFixed(2)
        };

        // 3. Month Calculation
        const monthAmount = allDebits.reduce((sum, t) => sum + (t.amount || 0), 0);
        const month = {
            amount: monthAmount,
            transactionCount: allDebits.length,
            monthProgress: ((now.getDate() / new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()) * 100).toFixed(0) + '%'
        };

        // 4. Safe Largest Expense
        const largestExpense = allDebits.length > 0 
            ? allDebits.reduce((prev, curr) => ((prev.amount || 0) > (curr.amount || 0)) ? prev : curr)
            : null;

        // 5. Safe Projection
        const daysPassed = now.getDate();
        const dailyAvg = daysPassed > 0 ? (monthAmount / daysPassed) : 0;
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        
        const projection = {
            currentDailyAverage: dailyAvg.toFixed(2),
            daysRemaining: daysInMonth - daysPassed,
            projectedMonthEnd: (dailyAvg * daysInMonth).toFixed(2)
        };

        res.json({ today, week, month, projection, largestExpense });

    } catch (err) {
        console.error("DEBUG ERROR:", err);
        res.status(500).json({ error: "Analytics calculation failed", details: err.message });
    }
};