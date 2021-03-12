import { post, Entry } from "./"

describe("post", () => {
  const validCollection = "ci-test/node"
  const validEntry: Entry = {
    score: 50,
    text: "Hello world!",
    user: {
      clientId: "abc-123",
      id: "ci-node",
    },
  }

  it("should handle success", async () => {
    const reference = await post(validCollection, validEntry)
    expect(reference.id).toBeGreaterThan(0)
  })

  it("should handle invalid collection", async () => {
    try {
      await post("ci-test/does-not-exist", validEntry)
    } catch (error) {
      // expected
      return
    }
    fail("did not throw error")
  })

  it("should handle invalid entry", async () => {
    try {
      await post(validCollection, {} as Entry)
    } catch (error) {
      // expected
      return
    }
    fail("did not throw error")
  })

  it("should handle unexpected response", async () => {
    try {
      await post(validCollection, validEntry, { _remoteHost: "qualtive.io" })
    } catch (error) {
      // expected
      try {
        await post(validCollection, validEntry, { _remoteHost: "google.com" })
      } catch (error) {
        // expected
        return
      }
    }
    fail("did not throw error")
  })

  it("should handle connection failure", async () => {
    try {
      await post(validCollection, validEntry, { _remoteHost: "does-not-exists.qualtive.io" })
    } catch (error) {
      // expected
      return
    }
    fail("did not throw error")
  })
})
