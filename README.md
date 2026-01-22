# Eco-Themed Farming Platform: KrishiSarthi AI

This is a code bundle for the **Eco-Themed Farming Platform**. The original project is available at: [Figma Design Link](https://www.figma.com/design/sfoBok2mv3LvibIiv5T3Je/Eco-Themed-Farming-Platform)

##  Running the Code

1. **Install Dependencies:**
   ```bash
   npm i

   npm run dev

   
 # Eco-Themed Farming Platform: KrishiSarthi AI

## ABSTRACT

**KrishiSarthi AI** is an intelligent agriculture assistance system designed to support farmers by providing timely, accurate, and AI-driven insights related to crop health, soil conditions, and farming decisions. The system leverages artificial intelligence and machine learning techniques to analyze agricultural data and assist farmers in improving productivity, reducing crop losses, and adopting smart farming practices. By integrating modern technologies with real-world agricultural needs, KrishiSarthi AI aims to bridge the gap between farmers and advanced digital solutions.

---

## CHAPTER 1: INTRODUCTION

### 1.1 Background
Agriculture plays a vital role in the economy, especially in countries like India where a large portion of the population depends on farming for livelihood. Traditional farming methods often rely on manual observation and experience, which may lead to delayed decision-making and reduced crop yield. With the advancement of artificial intelligence, data analytics, and automation, agriculture can be transformed into a smart and efficient sector. **KrishiSarthi AI** is developed to utilize these modern technologies to assist farmers in making informed decisions.

### 1.2 Problem Statement
Farmers face several challenges such as:
* **Lack of timely information:** Critical data is often unavailable when needed.
* **Disease identification:** Difficulty in identifying crop diseases early.
* **Resource utilization:** Inefficient use of water, fertilizers, and other resources.
* **Expert dependency:** High dependency on external agricultural experts.

These issues often result in crop damage, financial loss, and reduced productivity. There is a need for an intelligent system that can provide real-time agricultural guidance, detect issues early, and offer reliable recommendations in an accessible manner.
---

## CHAPTER 2: AIMS AND OBJECTIVES

### 2.1 Aim
The main aim of **KrishiSarthi AI** is to develop an AI-powered agricultural assistant that helps farmers monitor crop health, detect problems early, and make data-driven farming decisions to improve yield and sustainability.

### 2.2 Objectives
* To provide intelligent assistance for crop monitoring and management.
* To detect crop-related issues using AI-based detection techniques.
* To reduce dependency on manual expert consultation.
* To support farmers with accurate and timely agricultural insights.
* To promote smart and technology-driven farming practices.
* ---

## CHAPTER 3: SYSTEM ARCHITECTURE

KrishiSarthi AI follows a layered architecture to ensure modularity, scalability, and efficient processing.



| Layer | Description |
| :--- | :--- |
| **User Interface Layer** | Allows farmers or users to interact with the system. Includes input options such as images, text, or queries. |
| **Application Layer** | Handles user requests and manages system logic. Connects user inputs with backend services. |
| **AI & Processing Layer** | Performs machine learning and AI-based analysis. Includes detection, classification, and prediction models. |
| **Data Layer** | Stores agricultural data, user data, and model outputs. Supports future learning and improvements. |
---

## CHAPTER 4: TECHNOLOGY STACK

KrishiSarthi AI is built using a modern, scalable, and modular technology stack that integrates frontend technologies, backend services, artificial intelligence models, and external data sources to deliver intelligent agricultural solutions.

### 4.1 Frontend Technologies

#### 4.1.1 Core Framework
* **React.js (TypeScript):** A component-based frontend framework used to build a scalable, maintainable, and interactive user interface. TypeScript ensures type safety and improves code reliability.

#### 4.1.2 Styling and UI Components
* **Tailwind CSS:** A utility-first CSS framework used for rapid and consistent UI styling.
* **ShadCN UI:** Provides accessible, reusable, and modern UI components.
* **Lucide React:** Used for lightweight, modern, and customizable icons across the application.

#### 4.1.3 Animations
* **Framer Motion:** Enables smooth UI animations and transitions, improving user experience and interface responsiveness.

#### 4.1.4 State Management
* **React Hooks:** * `useState` for managing component-level state.
    * `useEffect` for handling lifecycle events and data fetching.

#### 4.1.5 API Communication
* **Fetch API:** Used for asynchronous communication between the frontend and backend REST APIs.

### 4.2 Backend Technologies

#### 4.2.1 Core Framework
* **Python Flask:** A lightweight REST API framework used to handle backend logic, request processing, and response management.

#### 4.2.2 API Architecture
* **Flask Blueprints:** Modular routing architecture for better code organization and scalability. The backend includes the following route modules:
    * `auth_routes`
    * `soil_routes`
    * `weather_routes`
    * `market_routes`
    * `wildlife_routes`
    * `chatbot_routes`

#### 4.2.3 Security and Middleware
* **Flask-CORS:** Enables cross-origin resource sharing between frontend and backend.
* **JWT (JSON Web Token – Optional / Future Ready):** Planned for secure authentication and authorization of users.

### 4.3 Machine Learning and Artificial Intelligence

#### 4.3.1 Deep Learning Framework
* **PyTorch:** Used as the core machine learning framework for training and deploying deep learning models.

#### 4.3.2 Computer Vision Libraries
* **Torchvision:** Provides image transformations and pretrained models.
* **PIL (Pillow):** Used for image preprocessing and handling uploaded images.

### 4.4 Soil Analysis Models

#### 4.4.1 Soil Type Classification
* **Model:** EfficientNet-B0 (Pretrained)
* **Classes:** Alluvial, Black, Red, Clay, Loamy, Sandy, Laterite.
* This model classifies soil type from input images using transfer learning.

#### 4.4.2 Soil Nutrient Regression Model
* **Architecture:** CNN Feature Extractor + Dense Regressor
* **Inputs:** Soil image, Soil pH value, Soil color.
* **Outputs:** Nitrogen (N), Phosphorus (P), Potassium (K), Moisture content, Organic matter.
* This module predicts soil nutrient levels to support fertilizer and crop recommendations.

### 4.5 Wildlife Detection Module
* **YOLOv8 (Ultralytics):** Used for real-time detection of animals from images to prevent crop damage caused by wildlife intrusion.

### 4.6 Data Handling and Datasets

#### 4.6.1 Datasets
* Kaggle Soil Image Datasets.
* Custom structured datasets using `ImageFolder` format.

#### 4.6.2 Training Metadata
* CSV-based regression labels.
* Combination of synthetic and derived agricultural data.

### 4.7 External Services and Integrations

#### 4.7.1 Weather Data Integration
* External weather APIs provide location-based weather forecasts to support farming decisions.

#### 4.7.2 Market Price Integration
* Government and market APIs used for dynamic crop price updates and market trend visualization.

### 4.8 Database Management

#### 4.8.1 Database (Current and Future Ready)
* **MySQL:** Stores farmer data, crop-related information, and market prices. The database design supports future expansion and analytics.

### 4.9 DevOps and Development Environment

#### 4.9.1 Local Development Setup
* Python virtual environment (`venv`).
* Node.js with `npm` for frontend dependency management.

#### 4.9.2 Debugging Tools
* Flask Debug Mode and Browser Developer Tools.

#### 4.9.3 Model Storage
* PyTorch model weight files (`.pth`).
* Organized directory structure.
* ---

## CHAPTER 5: FUNCTIONAL MODULES (CORE CONCEPTS)

KrishiSarthi AI consists of the following core functional modules:

* **Crop Detection Module:** Identifies crop-related issues using AI-based detection and analyzes visual or data inputs.
* **Disease Detection Module:** Detects crop diseases at early stages to help in reducing crop loss.
* **Recommendation Module:** Provides suggestions based on detected conditions and supports decision-making for farmers.
* **Data Analysis Module:** Processes historical and real-time data to improve the accuracy of predictions.
* **User Interaction Module:** Enables easy communication between the farmer and the system, designed for simplicity and usability.
* ---

## CHAPTER 6: REAL-WORLD DEPLOYMENT AND USE CASES

### Real-World Deployment
KrishiSarthi AI can be deployed in real agricultural environments such as farms, agricultural institutions, and rural areas. The system can operate through a web or mobile application, allowing farmers to access AI-based assistance anytime. Deployment can be done on cloud platforms to ensure scalability and availability.

### Use Cases
* **Disease Detection:** Farmers detecting crop diseases using images for early identification.
* **Educational Support:** Agricultural students using the system for learning and research.
* **Precision Farming:** Supporting precision farming practices to optimize resource usage.
* **Expert Accessibility:** Assisting rural farmers with limited access to expert agricultural consultants.
* ---

## CHAPTER 7: CONCLUSION

**KrishiSarthi AI** successfully demonstrates the application of Artificial Intelligence and modern web technologies in addressing real-world agricultural challenges. The system integrates machine learning, computer vision, and data-driven analytics to provide intelligent assistance for soil analysis, crop-related insights, wildlife detection, weather forecasting, and market price awareness. By combining frontend technologies such as **React** with a robust **Flask-based backend** and deep learning models implemented using **PyTorch**, the project delivers a scalable and user-friendly agricultural support system.

The layered system architecture ensures modularity, maintainability, and future extensibility. Core functionalities such as soil type classification, nutrient prediction, and real-time wildlife detection highlight the effectiveness of AI-driven decision support in farming. Integration with external weather and market APIs further enhances the practical relevance of the system by enabling farmers to make informed and timely decisions.

Overall, **KrishiSarthi AI** serves as a strong foundation for smart and precision agriculture. The project has the potential to reduce crop losses, optimize resource usage, and improve agricultural productivity. With future enhancements such as multilingual support, mobile application deployment, and real-time sensor integration, KrishiSarthi AI can evolve into a comprehensive and impactful solution for sustainable agriculture.
