import { z } from 'zod'

export default defineEventHandler(async (event) => {
  try {
    const { slug: eventSlug } = await getValidatedRouterParams(
      event,
      z.object({
        slug: z.string(),
      }).parse
    )
    const body = await readBody<{ ticketType: 'basic' | 'vip' }>(event)
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

    console.log(body)
    // create a ticket against that person of that event
    await notion.pages.create({
      parent: { database_id: notionDbId.ticket },
      properties: {
        Name: {
          type: 'title',
          title: [{ type: 'text', text: { content: `${notionTextStringify(user.properties.Name.title)}'s Ticket for ${notionTextStringify(hostedEvent.properties.Name.title)} Event` } }],
        },
        Status: {
          type: 'status',
          status: {
            name: 'Booked',
          },
        },
        Type: {
          type: 'select',
          select: { name: changeCase(body.ticketType, 'sentence') },
        },
        Price: {
          type: 'number',
          number: ticketPriceMap[body.ticketType],
        },
        'Purchase Date': {
          type: 'date',
          date: { start: new Date().toISOString() },
        },
        User: {
          type: 'relation',
          relation: [{ id: user.id }],
        },
        Event: {
          type: 'relation',
          relation: [{ id: hostedEvent.id }],
        },
      },
    })

    return {
      type: changeCase(body.ticketType, 'sentence'),
      price: ticketPriceMap[body.ticketType],
      status: 'booked',
    }
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    console.error('API event/[slug] POST', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
