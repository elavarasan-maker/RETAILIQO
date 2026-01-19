import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getNegotiationStrategy = async (productName: string, mrp: number, currentPrice: number, qty: number) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As a B2B Retail Specialist, analyze this wholesale deal:
    Product: ${productName}
    MRP: ₹${mrp}
    Supplier Price: ₹${currentPrice}
    Bulk Quantity: ${qty}
    
    Provide a professional negotiation strategy including:
    1. Aggressive Target (15% below current)
    2. Balanced Target (7% below current)
    3. Reasoning based on volume logic.`,
    config: {
      temperature: 0.7,
      thinkingConfig: { thinkingBudget: 100 }
    }
  });
  return response.text;
};

export const getBusinessAdvice = async (salesData: string, merchantContext: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `System: You are Asanix AI Business Advisor.
    Merchant Profile: ${merchantContext}
    Current Challenge: ${salesData}
    
    Task: Provide 3 hyper-local actionable steps to increase sales or reduce overhead for this specific shop category.`,
    config: {
      temperature: 0.8,
      thinkingConfig: { thinkingBudget: 120 }
    }
  });
  return response.text;
};

export const getMarketIntelligence = async (area: string, merchantContext: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `System: Asanix Market Intelligence Protocol.
    Merchant Category: ${merchantContext}
    Target Search Area: ${area}
    
    Analyze: Local demand trends, competitor density, and sourcing gaps. Suggest 2 high-margin SKUs for this merchant.`,
    config: {
      temperature: 0.6,
      thinkingConfig: { thinkingBudget: 150 }
    }
  });
  return response.text;
};

export const identifyProductFromImage = async (base64Image: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: "Act as Asanix Vision. Identify this SKU. Provide estimated wholesale market price, typical min-order quantity for retailers, and shelf-life considerations." }
      ]
    },
  });
  return response.text;
};

export const getChatAssistantResponse = async (history: {role: 'user'|'model', text: string}[], message: string) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    })),
    config: {
      systemInstruction: 'You are Asanix AI, a specialized retail assistant by Asanix Developers. You help merchants with inventory management, bulk sourcing, and market trends. Be professional, data-driven, and concise.',
    }
  });
  
  const response = await chat.sendMessage({ message });
  return response.text;
};

export const getStoreLayoutOptimization = async (dimensions: string, merchantContext: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Merchant Context: ${merchantContext}
    Dimensions: ${dimensions}
    
    Generate a layout plan focusing on high-traffic areas, FMCG placement at eye level, and bulk-storage accessibility.`,
    config: {
      temperature: 0.8,
      thinkingConfig: { thinkingBudget: 200 }
    }
  });
  return response.text;
};