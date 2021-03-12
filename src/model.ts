/**
 * Feedback entry contaning data for a user entry.
 */
export type Entry = {
  /**
   * Score value between 0 and 100. Required.
   */
  score: number

  /**
   * User typed text. Optional.
   */
  text?: string | null

  /**
   * User who entered feedback. For example the logged in user on the site.
   * Must have a value with clientId as a minimum.
   * Required.
   */
  user: {
    /**
     * Uniq identifier for the client the feedback was sent from. Required.
     */
    clientId: string | number

    /**
     * Uniq identifier for the logged in user. Optional.
     */
    id?: string | number | null

    /**
     * Name of the logged in user. Optional.
     */
    name?: string

    /**
     * Email to the logged in user. Optional.
     */
    email?: string
  }

  /**
   * Hints for the attributes parser. None of these are required, but all are recommended.
   */
  attributeHints?: {
    /**
     * Client user agent. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent.
     */
    userAgent?: string

    /**
     * Name of client platform. For example: https://developer.mozilla.org/en-US/docs/Web/API/NavigatorID/platform.
     */
    platform?: string

    /**
     * If the client has touch screen or not.
     */
    hasTouch?: boolean

    /**
     * The size of the client screen.
     */
    screenSize?: {
      width: number
      height: number
    }

    /**
     * The size of the client window.
     */
    windowSize?: {
      width: number
      height: number
    }
  }

  /**
   * Custom attributes. Optional.
   */
  customAttributes?: { [key: string]: string | number | boolean | null } | null
}

/**
 * Reference to a posted entry.
 */
export type EntryReference = {
  /**
   * Identifier for the posted entry.
   *
   * Posted entries can be viewed in admin following this pattern: https://qualtive.app/{container-id}/{entry-id}/
   */
  id: number
}

/**
 * Optional base options to use when posting feedback.
 */
export type PostOptions = {
  /**
   * The remote host to post feedback to. Must not include scheme. For debug usages only.
   */
  _remoteHost?: string | null
}
