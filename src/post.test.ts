import https from "https"
import { EventEmitter } from "events"
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

  describe("pass-through key", () => {
    const sentHeaders = async (passThroughKey?: string | null) => {
      let headers: Record<string, string> = {}
      const spy = jest.spyOn(https, "request").mockImplementation((((
        requestOptions: https.RequestOptions,
        callback: (response: EventEmitter & { statusCode: number }) => void
      ) => {
        headers = requestOptions.headers as Record<string, string>
        const response = Object.assign(new EventEmitter(), { statusCode: 201 })
        const request = Object.assign(new EventEmitter(), {
          write: jest.fn(),
          end: () => {
            callback(response)
            response.emit("data", '{"id":1}')
            response.emit("end")
          },
        })
        return request
      }) as unknown) as typeof https.request)
      try {
        await post(validCollection, validEntry, { passThroughKey })
      } finally {
        spy.mockRestore()
      }
      return headers
    }

    it("should send the pass-through key header", async () => {
      const headers = await sentHeaders("pt-secret")
      expect(headers["X-Qualtive-Pass-Through"]).toBe("pt-secret")
      expect(headers["X-Container"]).toBe("ci-test")
    })

    it("should omit the header without a pass-through key", async () => {
      expect(await sentHeaders()).not.toHaveProperty("X-Qualtive-Pass-Through")
      expect(await sentHeaders(null)).not.toHaveProperty("X-Qualtive-Pass-Through")
    })
  })
})
