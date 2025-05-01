# Cliuno Express template

<img src="./public/logo.png" style="width: 300px; height: 300px; padding-bottom: 30px;" alt="logo">

## Installation

if you want to run the project locally make sure you have installed nodejs, pnpm.
to install node js go to [nodejs](https://nodejs.org/en/download/)
to install pnpm run the following command

```bash
npm install -g pnpm
```

if you want to run the project using docker make sure you have installed docker.

to install docker go to [docker](https://docs.docker.com/get-docker/)

to run the project using docker run the following command

```bash
docker compose -d up
```

or pull the image from docker hub

```bash
docker pull iru44/express-template
```

make sure you pull the database image from docker hub as well

then run the following command

```bash
docker run -p 3000:3000 iru44/express-template
```

if you want to run the project using kubernetes make sure you have installed minikube.

to install minikube go to [minikube](https://minikube.sigs.k8s.io/docs/start/)
to install kubectl go to [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

## Clone the repository

```bash
git clone https://github.com/CLIuno/CLIuno-Express-template.git
```

then run the following command

```bash
pnpm install
```

## Usage

after installing the dependencies you can run the project using the following command to migrate the database

```bash
pnpm migrate
```

then you run the project using the following command

```bash
pnpm dev
```

## Features

list of features that already implemented:

| Status             | Feature                       |
| ------------------ | ----------------------------- |
| :white_check_mark: | Auth routes                   |
| [ ]                | User routes                   |
| [ ]                | Role routes                   |
| [ ]                | Post routes                   |
| [ ]                | User Role routes              |
| [ ]                | CI/CD with GitHub Actions     |
| :white_check_mark: | Mailer                        |
| :white_check_mark: | Logging                       |
| [ ]                | Dockerize                     |
| [ ]                | Kubernetes                    |
| [ ]                | Soft delete                   |
| :white_check_mark: | SQLite database               |
| [ ]                | Fully documentation           |
| :white_check_mark: | Postman collection just basic |

## Premium features

You will get more features if you buy the full version and you can use it for commercial purposes (contact me for more information)

| Status             | Feature                      |
| ------------------ | ---------------------------- |
| :white_check_mark: | Vote routes                  |
| :white_check_mark: | Comment routes               |
| :white_check_mark: | Permission routes            |
| :white_check_mark: | Reacion routes               |
| :white_check_mark: | Payment routes               |
| :white_check_mark: | Notification routes          |
| :white_check_mark: | Pagination                   |
| :white_check_mark: | Redis cache                  |
| :white_check_mark: | File upload                  |
| :white_check_mark: | Fully unit test              |
| :white_check_mark: | Database Factory             |
| :white_check_mark: | Make use of Enums            |
| :white_check_mark: | GraphQL (Optional)           |
| :white_check_mark: | Postman collection extra     |
| :white_check_mark: | Postgres database or MongoDB |

## list of endpoints

### Auth

| Status             | Endpoint Description    | Method | Path                             |
| ------------------ | ----------------------- | ------ | -------------------------------- |
| :white_check_mark: | Login                   | POST   | `/api/v1/auth/login`             |
| :white_check_mark: | Register                | POST   | `/api/v1/auth/register`          |
| :white_check_mark: | Logout                  | POST   | `/api/v1/auth/logout`            |
| :white_check_mark: | Reset Password          | POST   | `/api/v1/auth/reset-password`    |
| :white_check_mark: | Forgot Password         | POST   | `/api/v1/auth/forgot-password`   |
| :white_check_mark: | Change Password         | POST   | `/api/v1/auth/change-password`   |
| :white_check_mark: | Send Verification Email | POST   | `/api/v1/auth/send-verify-email` |
| :white_check_mark: | Verify Email            | POST   | `/api/v1/auth/verify-email`      |
| :white_check_mark: | Check Token             | POST   | `/api/v1/auth/check-token`       |
| :white_check_mark: | Refresh Token           | POST   | `/api/v1/auth/refresh-token`     |
| :white_check_mark: | Verify OTP              | POST   | `/api/v1/auth/otp/verify`        |
| :white_check_mark: | Disable OTP             | POST   | `/api/v1/auth/otp/disable`       |
| :white_check_mark: | Validate OTP            | POST   | `/api/v1/auth/otp/validate`      |
| :white_check_mark: | Generate OTP            | POST   | `/api/v1/auth/otp/generate`      |

### Users

| Status             | Endpoint Description | Method | Path                               |
| ------------------ | -------------------- | ------ | ---------------------------------- |
| :white_check_mark: | Get current user     | GET    | `/api/v1/users/current`            |
| :white_check_mark: | Update current user  | PATCH  | `/api/v1/users/current`            |
| :white_check_mark: | Delete current user  | DELETE | `/api/v1/users/current`            |
| :white_check_mark: | Get user by username | GET    | `/api/v1/users/username/:username` |
| :white_check_mark: | Get all users        | GET    | `/api/v1/users`                    |
| :white_check_mark: | Get a user by ID     | GET    | `/api/v1/users/:id`                |
| :white_check_mark: | Update user by ID    | PATCH  | `/api/v1/users/:id`                |
| :white_check_mark: | Delete user by ID    | DELETE | `/api/v1/users/:id`                |
| :white_check_mark: | Get posts by user    | GET    | `/api/v1/users/posts`              |
| :white_check_mark: | Get roles by user    | GET    | `/api/v1/users/role`               |

### Roles

| Status | Endpoint Description    | Method | Path                                 |
| ------ | ----------------------- | ------ | ------------------------------------ |
| [ ]    | Get all roles           | GET    | `/api/v1/roles`                      |
| [ ]    | Get role by ID          | GET    | `/api/v1/roles/:id`                  |
| [ ]    | Create a role           | POST   | `/api/v1/roles`                      |
| [ ]    | Update role by ID       | PATCH  | `/api/v1/roles/:id`                  |
| [ ]    | Delete role by ID       | DELETE | `/api/v1/roles/:id`                  |
| [ ]    | Get permissions by role | GET    | `/api/v1/roles/:role_id/permissions` |
| [ ]    | Get users by role       | GET    | `/api/v1/roles/:role_id/users`       |

### Posts

| Status | Endpoint Description       | Method | Path                          |
| ------ | -------------------------- | ------ | ----------------------------- |
| [ ]    | Get all current user posts | GET    | `/api/v1/posts/current-user`  |
| [ ]    | Get all posts              | GET    | `/api/v1/posts`               |
| [ ]    | Get post by ID             | GET    | `/api/v1/posts/:id`           |
| [ ]    | Create a post              | POST   | `/api/v1/posts`               |
| [ ]    | Update post by ID          | PATCH  | `/api/v1/posts/:id`           |
| [ ]    | Delete post by ID          | DELETE | `/api/v1/posts/:id`           |
| [ ]    | Get users by post          | GET    | `/api/v1/posts/:post_id/user` |
