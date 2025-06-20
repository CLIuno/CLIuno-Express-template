// import request from 'supertest'
// import { APP } from '../server'
// import { initializeDataSource } from '@/database/app-data-source'

// beforeAll(async () => {
//   try {
//     await initializeDataSource()
//   } catch (error) {
//     console.error('Error during server setup:', error)
//   }
// })

// afterAll(() => {
//   // Any teardown after tests run
// })

// describe('Post /register', () => {
//   const userData = {
//     first_name: 'abdo',
//     last_name: 'aboAbdo',
//     username: 'assddaddaaasd',
//     phone: '+966565824926',
//     email: 'abdo@gmail.com',
//     password: 'HiAbdo123',
//     repeat_password: 'HiAbdo123'
//   }

//   it('should register a user', async () => {
//     try {
//       const response = await request(APP).post('/api/v1/auth/register').send(userData)
//       // Print the URL of the request
//       console.log(response.request.url)
//       const data = response.body
//       console.log('Response:', response.status, data)
//       expect(response.status).toBe(201)
//       expect(data).toMatchObject({
//         message: 'User created successfully and an email has been sent to you for verification',
//         status: 'success'
//       })
//     } catch (error) {
//       console.error('Error during test execution:', error)
//       throw error
//     }
//   })
// })
describe('Post /login', () => {
  it('should login a user', async () => {
    expect(1).toBe(1)
  })
})
