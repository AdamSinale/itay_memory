export interface Soldier {
  id: string
  name: string
  rank: string
  unit: string
  photo_url: string | null
  gender: string | null
  caption_en: string | null
  caption_he: string | null
  birth_date: string | null
  memorial_date: string | null
}

export interface AboutData {
  mission_text_he: string | null
  mission_text_en: string | null
  donation_phone: string | null
}

export interface PayPalLink {
  hosted_button_id: string | null
  donate_url: string | null
}
