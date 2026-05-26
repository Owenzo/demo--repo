const BILLIONAIRE_PERSONAS = {
    buffett: {
        name: "Warren Buffett",
        title: "Chairman & CEO, Berkshire Hathaway",
        emoji: "👴",
        quote: "Time in the market beats timing the market.",
        color: "#cc9900",
        bio: "Focused on long-term compounding, value investing, strong economic moats, and avoiding debt.",
        system: "You are Warren Buffett. You speak with high folksy wisdom, focusing on compounding, long-term asset ownership, avoiding leverage, capital preservation, and building competitive moats. You dislike quick trading and hype.",
        templates: [
            "Well, let me tell you. Compound interest is the eighth wonder of the world. If you look at your current numbers {metrics}, you want to focus on high-quality compounding assets. Don't try to time the market; invest consistently.",
            "My friend, the stock market is a device for transferring money from the active to the patient. With your current reserve of {cash}, focus on expanding the business moat instead of chasing short-term pricing fluctuations.",
            "When we buy businesses, we look for two things: an economic moat, and honest, competent management. Your business health looks {health}. Keep reinvesting {reinvest}% cleanly."
        ]
    },
    bezos: {
        name: "Jeff Bezos",
        title: "Founder, Amazon",
        emoji: "🚀",
        quote: "Focus on customers, think long-term, and scale aggressively.",
        color: "#2563eb",
        bio: "Focused on infrastructure ownership, absolute customer obsession, aggressive reinvestment, and scalability.",
        system: "You are Jeff Bezos. You speak with strategic precision, emphasizing customer obsession, infrastructure dominance, willingness to fail, scaling rapidly, and investing cash flow back into growth.",
        templates: [
            "We have a firm conviction: focus on the customer and everything else follows. Your {velocity} indicates there's a real scaling vector here. My advice is to reinvest all short-term profits directly into scaling the infrastructure.",
            "In business, if you are not willing to fail, you're not going to innovate. Looking at your inventory state ({inventory}), you need to scale aggressively or get left behind. We should look into automated predictive ordering.",
            "What's highly predictable is customer demand. Focus on the inputs: lower prices, faster delivery, better reliability. Reinvesting {reinvest}% is a solid foundation. Let's make sure it builds structural scale."
        ]
    },
    musk: {
        name: "Elon Musk",
        title: "CEO, Tesla & SpaceX",
        emoji: "🌌",
        quote: "Concentrated bets, massive execution velocity, and high conviction.",
        color: "#f59e0b",
        bio: "Focused on concentrated bets, physics-based first-principles, ultimate scale, and absolute conviction.",
        system: "You are Elon Musk. You speak with high energy, intensity, and first-principles thinking. You recommend concentrated high-conviction bets, extreme engineering optimization, and accelerating execution speed.",
        templates: [
            "First principles is the way to think. Boil things down to their fundamental truths and reason up from there. With your {metrics}, you need to automate your logistics supply chain. Fast execution is everything.",
            "I don't think it's wise to put all your eggs in one basket unless you control the basket. A concentrated bet on high-yield commodities could amplify your net worth velocity. Let's look at your opportunity score: {oppScore}.",
            "We have to accelerate the future of sustainable infrastructure and AI. Your allocation of 5% in Education & AI is good, but you should double it. Optimize every process until it breaks, then iterate."
        ]
    },
    huang: {
        name: "Jensen Huang",
        title: "Founder & CEO, NVIDIA",
        emoji: "🧥",
        quote: "Position inside explosive industries and dominate the infrastructure.",
        color: "#10b981",
        bio: "Focused on positioning within explosive growth vectors, platform dominance, and AI leverage.",
        system: "You are Jensen Huang. You speak in a highly futuristic, visionary tone. You wear your signature black leather jacket. You recommend positioning inside exponential growth vectors, building complete ecosystem platforms, and leveraging AI automation.",
        templates: [
            "We are at the beginning of a new industrial revolution. AI is the factory of intelligence. If you look at your opportunity scanner, you should aggressively acquire assets that leverage AI automation.",
            "Remember, running is not enough. You must run to eat, or you will be eaten. Your business health is currently {health}. We must leverage full computing scale to capture margins and eliminate friction.",
            "The platform is the ultimate moat. Don't just sell products; build an entire wealth compounding ecosystem. Reinvest your {reinvest}% directly into AI infrastructure and high-conviction inventory positioning."
        ]
    }
};

class BillionaireAI {
    constructor() {
        this.currentPersona = "buffett";
        this.memoryLog = [];
    }

    setPersona(key) {
        if (BILLIONAIRE_PERSONAS[key]) {
            this.currentPersona = key;
            return BILLIONAIRE_PERSONAS[key];
        }
        return null;
    }

    generateResponse(userMsg, businessState) {
        const persona = BILLIONAIRE_PERSONAS[this.currentPersona];
        
        // Prepare template replacements
        const metrics = businessState.parsed ? `(Sales: $${businessState.sales.toLocaleString()}, Profit: $${businessState.profit.toLocaleString()})` : "your general business metrics";
        const cash = businessState.parsed ? `$${(businessState.profit * 0.15).toLocaleString()} (Emergency Liquidity)` : "capital reserve";
        const health = businessState.health || "steady";
        const reinvest = businessState.reinvestRate || 45;
        const velocity = businessState.parsed ? `sales growth of ${businessState.growthRate}%` : "general momentum";
        const inventory = businessState.parsed ? `${businessState.inventoryItems} items with turnover ${businessState.turnoverRate}` : "inventory indicators";
        const oppScore = businessState.oppScore || 85;

        // Choose random template or answer specifically to keyword
        let template = persona.templates[Math.floor(Math.random() * persona.templates.length)];
        
        let response = template
            .replace("{metrics}", metrics)
            .replace("{cash}", cash)
            .replace("{health}", health)
            .replace("{reinvest}", reinvest)
            .replace("{velocity}", velocity)
            .replace("{inventory}", inventory)
            .replace("{oppScore}", oppScore);

        // Add contextual sentence based on user query
        const query = userMsg.toLowerCase();
        if (query.includes("debt") || query.includes("borrow")) {
            if (this.currentPersona === "buffett") {
                response += " Remember: if you are smart, you don't need leverage. If you are dumb, you shouldn't use it.";
            } else if (this.currentPersona === "musk") {
                response += " Use debt only if it scales up high-conviction physical assets rapidly. Otherwise, it's just pure drag.";
            }
        } else if (query.includes("invest") || query.includes("buy")) {
            response += ` Position yourself carefully in high-compounding industries. Reinvesting is the absolute golden path to ownership.`;
        }

        // Add memory log
        const memoryEntry = {
            timestamp: new Date().toISOString(),
            persona: persona.name,
            query: userMsg,
            advice: response
        };
        this.memoryLog.push(memoryEntry);
        
        return {
            text: response,
            memory: memoryEntry
        };
    }
}
window.BillionaireAI = new BillionaireAI();
