# Technologies we will use while making this project

- FrontEnd
  - React.js
  - TailWinds.css
- Backend
  - Node.js
  - Express
  - MongoDB
  - Redis
- Universal Compiler
  - Judge0

# Making Project

- Backend
  - Creation of the APIs
    1. User Authentication - two types - Admin and Normal User
       - Registering
       - Log in
       - Log out
       - fetching github account
       - email verification
       - set password
       - reset password
       - forget password
       - Google Signup
    2. Problems - someone who will create the problem (Admin only)
    3. Problem Submission
    4. Questions of DSA
    5. Schema
       - How would it look like?
       - Should I use a single schema?
         - No, we will have multiple schemas
         - Schema for an admin
         - for a single user
           - first name
           - last name
           - score
           - solved problems
         - problems schema
           - title
           - test cases
           - hidden test cases
           - initial code with language
           - accepted solutions
           - real solution
           - accepted test cases
           - run output test cases
           - run hidden test cases
           - problem id
         - submit schema
           - What was the solution of the user
           - problem id
           - solution accepted / solution rejected
