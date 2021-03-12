import https from "https"
import { Entry, PostOptions, EntryReference } from "./model"
import { validateEntry, parseCollection } from "./private"

/**
 * Posts a user feedback entry.
 * @param collection Collection to post to. Formatted as `container-id/question-id`. Required.
 * @param entry User entry to post. Required.
 * @param options Optional options for posting.
 * @returns Promise<EntryReference>
 */
export const post = (collection: string, entry: Entry, options?: PostOptions): Promise<EntryReference> => {
  return new Promise((resolve, reject) => {
    let containerId: string, questionId: string
    try {
      const collectionComponents = parseCollection(collection)
      containerId = collectionComponents[0]
      questionId = collectionComponents[1]

      validateEntry(entry)
    } catch (error) {
      reject(error)
      return
    }

    const fallbackErrorReason = "Could not complete operation."

    const body = {
      questionId,
      score: entry.score,
      text: entry.text,
      user: {
        id: entry.user.id?.toString(),
        name: entry.user.name,
        email: entry.user.email,
        clientId: entry.user.clientId,
      },
      attributes: entry.customAttributes,
      attributeHints: {
        clientLibrary: "node",
        ...(entry.attributeHints || {}),
      },
    }

    const request = https.request(
      {
        host: options?._remoteHost || "user-api.qualtive.io",
        method: "POST",
        path: "/feedback/entries/",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-Container": containerId,
        },
      },
      (response) => {
        let responseText = ""
        response.on("data", (chunk) => (responseText += chunk))
        response.on("end", function () {
          const statusCode = response.statusCode ?? 0

          let json: unknown
          try {
            json = JSON.parse(responseText)
          } catch (error) {
            if (statusCode >= 400) {
              reject(new Error(fallbackErrorReason))
            } else {
              reject(error)
            }
            return
          }

          if (statusCode >= 400) {
            reject((json as { reason?: string }).reason || fallbackErrorReason)
          } else {
            resolve(json as EntryReference)
          }
        })
      }
    )
    request.on("error", (error: Error) => reject(error))
    request.write(JSON.stringify(body))
    request.end()
  })
}
