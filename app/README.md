# GDSC2524 - app

Application using React (frontend) and Lambda (backend) for Google Developer Student Clubs 2524!

## Development Guide

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Setup local environment

Create an `.env.local` file in the `app/` directory with the following keys:

```
CL_AWS_ACCESS_KEY=
CL_AWS_SECRET_ACCESS_KEY=
CL_STAGE=
CL_TENANT=
```

Set the following values on the right-hand side of the equal sign (no quotes):

1. `CL_AWS_ACCESS_KEY` should be your AWS access key.
2. `CL_AWS_SECRET_ACCESS_KEY` should be your AWS secret access key.
3. `CL_STAGE` should always be `dev` when running locally.
4. `CL_TENANT` should be your name (`sophie` or `harry`).

### Run development server

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Technical Architecture

## Clients

When writing our application logic, we don't want to worry about the exact implementation of the API calls - we just want to be able to call a function that acccomplishes our objective. In many cases, we will have corresponding API calls in the frontend and the backend. Over time, we may also migrate between backends (for example, from DynamoDB to a SQL database).

For these reasons, all APIs in this project are defined with an interface, a frontend client, and a backend client. For example:

-   `IGuestBookClient` defines the interface for all clients for guest book APIs. All guest book API clients should be able to get, create, and list guest book messages.
-   `GuestBookApiClient` implements `IGuestBookClient` for frontend use. This client uses the browser `fetch` function to make calls to the CL311 API to get, create, and list guest book messages.
-   `GuestBookDbClient` implements `IPortfolioClient` for backend use. This client uses the AWS SDK to make calls to the DynamoDB API to get, create, and list guest book messages.

### File Structure

-   `components/` - Common components that can be used across multiple pages.
    -   `guestbook/` - Components for guestbook.
-   `hooks/` - Common React hooks that can be used across multiple pages.
    -   `guestbook/` - Hooks for guestbook.
-   `models/`
    -   `clients/` - API client interfaces are declared in this directory.
    -   `constants/` - Constants are declared in this directory.
    -   `data/` - Data structures are declared in this directory.
    -   `types/` - Types are declared in this directory.
-   `pages/` - All pages and APIs are implemented in this directory.
    -   `api/` - All APIs are implemented in this directory.
        -   `guestbook/` - All guestbook APIs are implemented in this directory.
    -   `guestbook/` - All guestbook pages are implemented in this directory.
-   `styles/` - All custom styles are implemented in this directory.
-   `utils/` - All utility functions are implemented in this directory.
    -   `api/` - All backend-specific utility functions are implemented in this directory
    -   `clients/` - All clients are implemented in this directory.
