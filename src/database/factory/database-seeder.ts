import { faker } from '@faker-js/faker'
import { User } from '@/entities/user.entity'
import { myDataSource } from '@/__tests__/sqlite.config'
// Function to generate a user with fake data
// uuidv4, first_name, last_name, date_of_birth, gender, nationality, phone, email, username, `password`, createdAt, updatedAt)
export const createFakeUser = async () => {
  const fakeUser = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    date_of_birth: '' + faker.date.birthdate(),
    gender: faker.person.sex(),
    nationality: faker.location.country(),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: '$2a$12$3gd0ES6FIsgOYvlYEo5QD.mtF71CVxDwOAasEPfI7VgidmVfpnYKu', // Default Password@123
    createdAt: new Date(),
    updatedAt: new Date()
  }

  try {
    // Check if the user already exists
    const userExists = await myDataSource.getRepository(User).findOneBy({
      username: fakeUser.username
    })

    if (userExists) {
      console.log('User already exists')
      return null
    }

    // Create a new user
    // const newUser = myDataSource.getRepository(User).create({ ...fakeUser })

    // return await myDataSource.getRepository(User).save(newUser)
  } catch (error) {
    console.error(error)
    return null
  }
}

// Function to generate multiple users with fake data
export const createMultipleFakeUsers = async (count: any) => {
  const users = []
  for (let i = 0; i < count; i++) {
    const user = await createFakeUser()
    users.push(user)
  }
  return users
}
