/* Server Only */
export const resourceTypes = ['user', 'event'] as const

export type ResourceType = (typeof resourceTypes)[number]

export type NotionDB = { [K in ResourceType]: string }

type NotionImage =
  | {
      type: 'file'
      file: {
        url: string
        expiry_time: string
      }
    }
  | {
      type: 'external'
      external: {
        url: string
      }
    }
  | null

export interface NotionEvent {
  id: string
  created_time: Date
  last_edited_time: Date
  cover: NotionImage
  icon: NotionImage
  properties: {
    ID: {
      type: 'unique_id'
      unique_id: {
        number: number
      }
    }
    Status: {
      type: 'status'
      status: {
        name: 'Planned' | 'Live' | 'Complete' | 'Cancelled'
      }
    }
    Name: {
      type: 'title'
      title: { plain_text: string }[]
    }
    Address: {
      type: 'rich_text'
      rich_text: {
        type: 'text'
        text: {
          content: string
        }
      }[]
    }
    Date: {
      type: 'date'
      date: {
        start: string
      }
    }
    Map: {
      type: 'url'
      url: string
    }
    Price: {
      type: 'number'
      number: number
    }
  }
  url: string
  public_url: null
}

export interface NotionUser {
  id: string
  created_time: string
  last_edited_time: string
  cover: NotionImage
  icon: NotionImage
  properties: {
    // Index
    Status: {
      type: 'status'
      status: {
        name: 'Unfilled' | 'Filled' | 'Verified' | 'Active' | 'Inactive'
      }
    }
    Name: {
      type: 'title'
      title: { plain_text: string }[]
    }
    Profession: {
      type: 'rich_text'
      rich_text: { text: { content: string } }[]
    }
    Gender: {
      type: 'select'
      select: {
        name: 'Male' | 'Female' | 'Other'
      }
    }
    DOB: {
      type: 'date'
      date: {
        start: string
      }
    }
    Email: {
      type: 'email'
      email: string
    }
    Phone: {
      type: 'phone_number'
      phone_number: string
    }
    Event: {
      type: 'relation'
      relation: string[]
      has_more: false
    }
  }
}
