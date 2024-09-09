# Under All in One Project

## Please Don't Open This Project

it's not ready yet and it contains a lot of bugs

## JS - JAVA - Python - PHP - ASP.NET

and here is the deal All Backend Frameworks work on PORT = 3000

and the Frontend Frameworks work on PORT = 8000

# Express template

<img src="logo.jpg" style="width: 540px; height: 300px; margin: auto; display: block; padding-bottom: 30px;" alt="logo">

## Installation

make sure you have installed nodejs, pnpm, and docker
to install node js go to [nodejs](https://nodejs.org/en/download/)
to install pnpm run the following command

```bash
npm install -g pnpm
```

to install docker go to [docker](https://docs.docker.com/get-docker/)

clone the repository

git clone [repository](https://github.com/CLIuno/CLIuno-Express-template.git)

then run the following command

```bash
pnpm install
```

## Usage

to run the project run the following command

```bash
pnpm dev
```

## Features

list of features that already implemented:

- [ ] Auth routes
- [ ] User routes
- [ ] Role routes
- [ ] Permissions routes
- [ ] User Role Permission
- [x] microservice architecture
- [ ] CI/CD
- [ ] logging
- [ ] dockerize
- [ ] kubernetes
- [ ] redis cache
- [ ] fully unit test
- [ ] fully documentation

## list of finished endpoints (works well)

### - [ ] Auth routes

- [x] post /api/v1/auth/login
- [ ] post /api/v1/auth/register
- [ ] post /api/v1/auth/logout
- [x] post /api/v1/auth/reset-password
- [x] post /api/v1/auth/forgot-password
- [x] post /api/v1/auth/change-password
- [ ] post /api/v1/auth/send-verify-email
- [ ] post /api/v1/auth/verify-email
- [ ] post /api/v1/auth/check-token
- [ ] post /api/v1/auth/refresh-token
- [x] post /api/v1/auth/otp/verify
- [x] post /api/v1/auth/otp/disable
- [x] post /api/v1/auth/otp/generate
- [x] post /api/v1/auth/otp/validate

### - [ ] User routes

- [x] get /api/v1/users/all
- [ ] get /api/v1/users/:id
- [ ] patch /api/v1/users/:id
- [ ] delete /api/v1/users/:id

### - [ ] Permissions routes

- [ ] get /api/v1/permissions/all
- [ ] get /api/v1/permissions/:id
- [ ] post /api/v1/permissions/
- [ ] patch /api/v1/permissions/:id
- [ ] delete /api/v1/permissions/:id

### - [ ] Role routes

- [ ] get /api/v1/roles/all
- [ ] get /api/v1/roles/:id
- [ ] post /api/v1/roles/
- [ ] patch /api/v1/roles/:id
- [ ] delete /api/v1/roles/:id

### - [ ] User Role Permission

- [ ] get /api/v1/user-role-permission/all
- [ ] get /api/v1/user-role-permission/:id
- [ ] post /api/v1/user-role-permission/
- [ ] patch /api/v1/user-role-permission/:id
- [ ] delete /api/v1/user-role-permission/:id

### - [ ] Users routes

- [ ] get /api/v1/users/all
- [ ] get /api/v1/users/:id
- [ ] post /api/v1/users/
- [ ] patch /api/v1/users/:id
- [ ] delete /api/v1/users/:id

## Unit test

### - [ ] unit test for Auth routes

- [ ] post /api/v1/auth/login
- [ ] post /api/v1/auth/register
- [ ] post /api/v1/auth/logout
- [ ] post /api/v1/auth/reset-password
- [ ] post /api/v1/auth/forgot-password
- [ ] post /api/v1/auth/change-password
- [ ] post /api/v1/auth/verify-email
- [ ] post /api/v1/auth/check-token
- [ ] post /api/v1/auth/refresh-token
- [ ] post /api/v1/auth/otp/verify
- [ ] post /api/v1/auth/otp/disable
- [ ] post /api/v1/auth/otp/generate

### - [ ] unit test for User routes

- [ ] get /api/v1/users/all
- [ ] get /api/v1/users/:id
- [ ] patch /api/v1/users/:id
- [ ] delete /api/v1/users/:id

### - [ ] unit test for Permissions routes

- [ ] get /api/v1/permissions/all
- [ ] get /api/v1/permissions/:id
- [ ] post /api/v1/permissions/
- [ ] patch /api/v1/permissions/:id
- [ ] delete /api/v1/permissions/:id

### - [ ] unit test for Role routes

- [ ] get /api/v1/roles/all
- [ ] get /api/v1/roles/:id
- [ ] post /api/v1/roles/
- [ ] patch /api/v1/roles/:id
- [ ] delete /api/v1/roles/:id

### - [ ] unit test for User Role Permission

- [ ] get /api/v1/user-role-permission/all
- [ ] get /api/v1/user-role-permission/:id
- [ ] post /api/v1/user-role-permission/
- [ ] patch /api/v1/user-role-permission/:id
- [ ] delete /api/v1/user-role-permission/:id

## Enhancements

- [ ] Make use of Enums
- [ ] GraphQL
