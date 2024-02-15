# GDSC2524

**Google Developer Student Clubs 2524 (GDSC2524)** is a website designed to streamline the reporting of various civic issues such as illegal dumping, clogged storm drains, and potholes. By facilitating efficient communication between residents and city departments, GDSC2524 aims to enhance community well-being.

## Project Overview

GDSC2524 offers a flexible platform that can be extended based on student interests and career goals. From design and frontend development to backend infrastructure and database management, students have the opportunity to explore various aspects of software engineering.

### Completed Features

- **Reporting System**
  - Create, view, and edit reports for civic issues
  - List of reported issues with filtering and sorting options
 
- **Map Location Picker**
  - Integrate Mapbox for location selection when creating or editing reports
  - Display selected locations on interactive maps for improved visualization

- **Form Validation**
  - Utilize Formik and Yup for client-side form validation
  - Define validation schemas to ensure data integrity and accuracy

- **API Design and Data Modeling**
  - Design efficient APIs for seamless communication between frontend, backend, and external services
  - Optimize data models for scalability and performance

### Ongoing Features and Stretch Goals

- **Attachment Management**
  - Upload and manage attachments (e.g., images, documents) related to reports using Amazon S3

- **Contact Form**
  - Create, view, and edit contact forms for general inquiries or feedback
  - Email notification for new submissions and responses

- **Data Visualization and Dashboarding**
  - Generate interactive dashboards and visualizations to present statistical data and trends related to reported issues

- **Integration Testing**
  - Develop comprehensive integration tests to ensure the reliability and functionality of the entire system

- **User Authentication and Authorization**
  - Implement user authentication and authorization for secure access to reporting and contact features
  - Role-based access control for administrators, moderators, and regular users

## Tech Stack

Throughout the development process, the project leveraged the following technologies:

- **Next.js** and **React** for frontend development
- **Material UI** and **CSS** for UI design
- **AWS Lambda** for backend services
- **TypeScript** for enhanced robustness
- **AWS** for cloud hosting
- **DynamoDB** for database management
- **AWS CDK** and **Amazon CodePipelines** for CI/CD automation

## Project Structure

- `app/`: Next.js application with React frontend and Lambda backend
- `infra-cdk/`: Infrastructure-as-code using AWS CDK

🛠️ It was an exciting journey exploring these technologies and building a platform to empower communities! 🚀
