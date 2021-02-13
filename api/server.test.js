const request = require("supertest")
const db = require("../data/dbConfig")
const server = require("./server")

const corey = { username: "corey", password: "reyxco" }
const phil = { username: "phil", password: "hixpl" }

test('sanity', () => {
  expect(true).toBe(false)
  expect(process.env.NODE_ENV).toBe("testing")
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db("users").truncate()
})
afterAll(async () => {
  await db.destroy()
})

describe("[POST] /api/auth/register", () => {
  it("responds with the newly registered user", async () => {
    let res
    res = await request(server).post("/api/auth/register").send(corey)
    expect(res.body).toMatchObject({ id: 1, ...corey })

    res = await request(server).post("/api/auth/register").send(phil)
    expect(res.body).toMatchObject({ id: 2, ...phil })
  })
})
