# Todo List App

This is a Basic Todo List app built with React using the [@based/react](https://www.npmjs.com/package/@based/react) library for state management. The app allows users to log in with a code, view their tasks, add new tasks, mark tasks as done, and log out.

## Getting Started

To run the app locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd <project-directory>
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `based.json` file in the project root with your [Based](https://based.com/) credentials.

   ```json
   {
     "apiUrl": "https://api.based.com/v1",
     "apiKey": "<your-api-key>"
   }
   ```

5. Start the development server:

   ```bash
   npm start
   ```

   The app will be accessible at [http://localhost:1234](http://localhost:1234).

## Features

- **Authentication:** Users can log in with a code, and authentication logic is handled through the [@based/client](https://www.npmjs.com/package/@based/client) library.

- **Todo List:** The app displays a list of tasks, categorizing them based on completion status. Users can mark tasks as done, add new tasks, and view a virtualized list using the [@based/react](https://www.npmjs.com/package/@based/react) library for efficient rendering.

- **list a million todos**

## Considerations

- **Error Handling:** Some attention has been paid to error handling, although it may need further improvement based on the API behavior.

- **Component Building:** The focus was on functionality, and less attention was given to building reusable components. In a production environment, components should be designed for reusability.

## Out of Scope

- **Testing:** Limited testing has been performed using Jest, but extensive testing is out of scope for this project. test was only done on the virtuallist

## Notes

- The authentication logic is simplistic and should be enhanced in a production environment, including secure storage of user credentials.

- The virtualized list implementation assumes a working API with proper handling of requests and errors.

Feel free to explore, extend, and customize this Todo List app for your needs!
