export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const notionDbId = config.private.notionDbId as unknown as NotionDB
  const events = await notionQueryDb<NotionEvent>(notion, notionDbId.event)

  const payment = config.private.paymentUpiInfo as unknown as {
    accountName: string
    accountId: string
    vpa: string
  }

  return events.map(({ properties }) => {
    const title = 'Offlimate - Meetup'
    const contact = '7003165756'
    const image = '/images/place-1.webp'

    return {
      id: properties.ID.unique_id.number,
      datetime: properties.Date.date.start,
      location: {
        name: notionTextStringify(properties.Name.title),
        address: notionTextStringify(properties.Address.rich_text),
      },
      urls: {
        payment: generateUpiDeepLink(payment.accountId, payment.vpa, payment.accountName, properties.Price.number, title),
        direction: properties.Map.url,
        call: `tel:+91${contact}`,
      },
      price: properties.Price.number,
      image: image,
    }
  })
})
