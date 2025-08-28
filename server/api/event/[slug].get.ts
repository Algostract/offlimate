/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderSVG } from 'uqr'
import { z } from 'zod'

export function generateQR(payload: any, options?: Record<string, any>): string {
  // normalize payload to string
  const text = (() => {
    if (payload === null || payload === undefined) return ''
    if (typeof payload === 'string') return payload
    if (typeof payload === 'number' || typeof payload === 'boolean') return String(payload)

    // stable stringify for objects/arrays so same object -> same QR text
    try {
      const seen = new WeakSet<any>()
      const replacer = (_key: string, value: any) => {
        // prevent circular
        if (value && typeof value === 'object') {
          if (seen.has(value)) return
          seen.add(value)
        }
        return value
      }

      // sort keys recursively
      const sortKeys = (obj: any): any => {
        if (obj === null || typeof obj !== 'object') return obj
        if (Array.isArray(obj)) return obj.map(sortKeys)
        const sorted: Record<string, any> = {}
        Object.keys(obj)
          .sort()
          .forEach((k) => {
            sorted[k] = sortKeys(obj[k])
          })
        return sorted
      }

      return JSON.stringify(sortKeys(payload), replacer)
    } catch {
      // fallback
      return String(payload)
    }
  })()

  // render SVG using uqr (returns SVG string)
  // options can include ecc (error correction), border, etc. (see uqr README)
  const svg = renderSVG(text, options)

  // ensure returned value is string
  if (typeof svg !== 'string') return String(svg)
  return svg
}

export default defineEventHandler(async (event) => {
  try {
    const { slug: eventSlug } = await getValidatedRouterParams(
      event,
      z.object({
        slug: z.string(),
      }).parse
    )
    const { user: authUser } = await requireUserSession(event)

    const config = useRuntimeConfig()
    const notionDbId = config.private.notionDbId as unknown as NotionDB

    const user = (
      await notion.databases.query({
        database_id: notionDbId.user,
        filter: {
          property: 'Email',
          email: { equals: authUser.email },
        },
      })
    ).results[0] as unknown as NotionUser

    const hostedEvent = (
      await notion.databases.query({
        database_id: notionDbId.event,
        filter: {
          property: 'ID',
          unique_id: { equals: parseInt(eventSlug) },
        },
      })
    ).results[0] as unknown as NotionEvent

    const ticket = (
      await notion.databases.query({
        database_id: notionDbId.ticket,
        filter: {
          and: [
            {
              property: 'User',
              relation: { contains: user.id },
            },
            {
              property: 'Event',
              relation: { contains: hostedEvent.id },
            },
          ],
        },
      })
    ).results[0] as unknown as NotionTicket

    const payment = config.private.paymentUpiInfo as unknown as {
      accountName: string
      accountId: string
      vpa: string
    }

    const title = notionTextStringify(ticket.properties.Name.title)
    const upiLink = generateUpiDeepLink(payment.accountId, payment.vpa, payment.accountName, ticket.properties.Price.number, title)

    return (
      ticket && {
        name: notionTextStringify(ticket.properties.Name.title),
        type: changeCase(ticket.properties.Type.select.name, 'lower') as 'basic' | 'vip',
        price: ticket.properties.Price.number,
        status: changeCase(ticket.properties.Status.status.name, 'lower'),
        qr: ticket.properties.Status.status.name !== 'Paid' && ticket.properties.Status.status.name !== 'Cancelled' ? generateQR(upiLink) : undefined,
      }
    )
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    console.error('API event/[slug] GET', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
