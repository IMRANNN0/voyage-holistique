# Voyage Holistique Tracking Plan

## Stack And IDs

- **GA4 measurement ID**: `G-RG386XNFN1`
- **Meta Pixel ID**: `936528165885461`
- **Microsoft Clarity project ID**: `wqpjpmjb2g`
- **Implementation pattern**: Direct tracking in Next.js code (no GTM). All tracking implemented via `lib/tracking.ts` with SSR-safe functions.

## Global Parameters

Every tracked event includes these automatic parameters from `lib/tracking.ts`:

- `page_path`
- `device_type`: `mobile`, `tablet`, `desktop`, or `unknown`
- `time_on_page`: seconds since page load

CTA events also include:

- `event_category`
- `button_text`
- `section_name`
- `destination_url` when relevant
- `cta_location` when relevant

No personally identifiable form values are sent to GA4, Meta, or Clarity.

## Removed GTM

Google Tag Manager (GTM) has been completely removed from the project:
- No GTM container scripts in `app/layout.tsx`
- No GTM-NFL7783S references
- All tracking implemented directly in Next.js code

## CTA And Interaction Events

| Event | Trigger | Important Parameters |
| --- | --- | --- |
| `header_reserve_click` | Header reserve button | `button_text`, `section_name`, `cta_location` |
| `mobile_menu_reserve_click` | Mobile menu reserve button | `button_text`, `section_name`, `cta_location` |
| `hero_reserve_click` | Hero reserve button | `button_text`, `section_name`, `cta_location` |
| `hero_program_click` | Hero programme anchor | `button_text`, `section_name`, `destination_url` |
| `sticky_bar_reserve_click` | Sticky bottom booking CTA | `button_text`, `section_name`, `cta_location` |
| `transformation_card_click` | Transformation card open/close | `card_title`, `card_index`, `interaction_action` |
| `programme_day_click` | Programme day tab | `programme_day`, `programme_title`, `day_index` |
| `offer_reserve_click` | Offer CTAs | `component_variant`, `cta_location`, `value`, `currency` |
| `faq_interaction` | FAQ open/close | `faq_question`, `faq_index`, `interaction_action` |
| `testimonial_interaction` | Testimonial dot click | `testimonial_name`, `testimonial_index` |
| `footer_whatsapp_click` | Footer WhatsApp link | `button_text`, `section_name`, `destination_url` |
| `whatsapp_click` | Any WhatsApp click | `whatsapp_number`, `message_prefill`, `destination_url` |
| `footer_email_click` | Footer email link | `button_text`, `destination_url` |
| `footer_instagram_click` | Footer Instagram link | `button_text`, `destination_url` |
| `footer_nav_click` | Footer navigation link | `button_text`, `destination_url` |
| `header_nav_click` | Desktop header navigation link | `button_text`, `destination_url` |
| `mobile_nav_click` | Mobile menu navigation link | `button_text`, `destination_url` |
| `footer_legal_click` | Footer legal/privacy buttons | `legal_modal` |
| `final_cta_click` | Final reserve CTA | `button_text`, `section_name`, `cta_location` |

## Booking Form Events

| Event | Trigger | Important Parameters |
| --- | --- | --- |
| `booking_modal_open` | Booking modal opens | `form_name`, `lead_type`, `cta_location` |
| `booking_modal_close` | Booking modal closes | `form_name`, `cta_location`, `close_reason` |
| `form_start` | First field focus in a modal session | `form_name`, `lead_type`, `cta_location` |
| `form_field_interaction` | First focus per field per modal session | `form_name`, `field_name`, `cta_location` |
| `form_submit_attempt` | Submit button attempt | `form_name`, `lead_type`, `guests`, `intent`, `value`, `currency` |
| `form_submit_success` | Webhook submission success | `form_name`, `lead_type`, `guests`, `intent`, `value`, `currency` |
| `generate_lead` | GA4 recommended lead event, fired with successful submit | `lead_type`, `form_name`, `value`, `currency` |
| `form_submit_error` | Missing webhook or network error | `form_name`, `lead_type`, `error_reason` |

Lead success parameters:

- `lead_type`: `booking_request`
- `form_name`: `voyage_holistique_booking`
- `value`: `7960`
- `currency`: `MAD`

## Scroll And Section Events

| Event | Trigger | Important Parameters |
| --- | --- | --- |
| `scroll_25` | User reaches 25% page depth | `scroll_percent` |
| `scroll_50` | User reaches 50% page depth | `scroll_percent` |
| `scroll_75` | User reaches 75% page depth | `scroll_percent` |
| `scroll_90` | User reaches 90% page depth | `scroll_percent` |
| `scroll_100` | User reaches page bottom | `scroll_percent` |
| `section_view` | Key section is at least 25% visible | `section_name`, `visibility_percent` |
| `section_view_offer` | Offer section viewed | `section_name`, `visibility_percent` |

Tracked sections:

- `hero`
- `transformation`
- `places`
- `programme`
- `learnings`
- `experts`
- `testimonial`
- `offer`
- `faq`
- `final_cta`
- `footer`

Scroll and section events fire once per page load.

## Engagement Quality Events

| Event | Trigger | Notes |
| --- | --- | --- |
| `time_on_page_30s` | 30 seconds on page | Fires once |
| `time_on_page_60s` | 60 seconds on page | Fires once |
| `time_on_page_120s` | 120 seconds on page | Fires once |
| `user_engaged_deep` | First CTA click, WhatsApp click, or 75% scroll | Fires once |
| `high_intent_user` | Booking modal open or WhatsApp click | Fires once |

## GA4 Setup

GA4 is implemented directly in `app/layout.tsx` using Next.js Script component:

- Strategy: `afterInteractive`
- Script: `https://www.googletagmanager.com/gtag/js?id=G-RG386XNFN1`
- Base config included in inline script

## Meta Pixel Setup

Meta Pixel is implemented directly in `app/layout.tsx` using Next.js Script component:

- Strategy: `afterInteractive`
- Script: `https://connect.facebook.net/en_US/fbevents.js`
- Base config and PageView included

## Microsoft Clarity Setup

Microsoft Clarity is implemented directly in `app/layout.tsx` using Next.js Script component:

- Strategy: `afterInteractive`
- Script: `https://www.clarity.ms/tag/wqpjpmjb2g`

## Meta Pixel Event Mappings

Direct mappings implemented in code:

| Meta Event | Triggered by |
| --- | --- |
| `PageView` | Page load |
| `ViewContent` | `booking_modal_open` |
| `InitiateCheckout` | `offer_reserve_click` |
| `Contact` | `whatsapp_click` |
| `Lead` | `form_submit_success` |

## Recommended GA4 Conversions

Primary:

- `generate_lead`
- `form_submit_success`
- `whatsapp_click`

Secondary:

- `booking_modal_open`
- `offer_reserve_click`
- `final_cta_click`
- `scroll_75`
- `section_view_offer`

## Testing Checklist

### Build and Type Safety
- [ ] Run `npm run build` and confirm no errors
- [ ] Verify no TypeScript errors
- [ ] Confirm no hydration errors in browser console

### GA4 Verification
- [ ] Open browser console and confirm GA4 script loads
- [ ] Verify `page_view` event fires on page load
- [ ] Test all CTA clicks and confirm events fire
- [ ] Test form submission and confirm `generate_lead` fires
- [ ] Verify WhatsApp clicks trigger `whatsapp_click`
- [ ] Confirm scroll events fire (25%, 50%, 75%, 90%, 100%)
- [ ] Confirm section_view events fire for all sections

### Meta Pixel Verification
- [ ] Use Meta Pixel Helper extension
- [ ] Confirm `PageView` fires on page load
- [ ] Open booking modal and confirm `ViewContent` fires
- [ ] Click offer reserve and confirm `InitiateCheckout` fires
- [ ] Click WhatsApp and confirm `Contact` fires
- [ ] Submit form and confirm `Lead` fires

### Microsoft Clarity Verification
- [ ] Confirm Clarity script loads in network tab
- [ ] Verify clarity.ms domain requests

### GTM Removal Verification
- [ ] Search codebase for "GTM-NFL7783S" - should return no results
- [ ] Search codebase for "googletagmanager.com/gtm.js" - should return no results
- [ ] Confirm no GTM iframe in HTML
- [ ] Confirm no dataLayer events still referencing GTM

### Mobile UX Verification
- [ ] Test on mobile viewport
- [ ] Confirm no layout breaks
- [ ] Verify modal positioning is correct
- [ ] Test all interactions work
